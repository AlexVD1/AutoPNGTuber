/**
 * Valida src/data/guion.json (zod) y avisa de problemas de ritmo visual.
 * Uso: npm run validar   (exit 1 si hay errores; los avisos no bloquean)
 */
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

const ROOT = path.resolve(__dirname, "..");
const GUION_PATH = path.join(ROOT, "src/data/guion.json");

/** Extrae los literales de un `export type Nombre = | "a" | "b";` de src/types.ts. */
function literalesDeTipo(nombre) {
  const src = fs.readFileSync(path.join(ROOT, "src/types.ts"), "utf-8");
  const m = src.match(new RegExp(`export type ${nombre}\\s*=([^;]+);`));
  if (!m) throw new Error(`No se encontró el tipo ${nombre} en src/types.ts`);
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

const catalogo = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/poses.json"), "utf-8")).recursos;
// El catálogo usa prefijos (expr_, prop_); el guion usa el id sin prefijo.
const idsPorCategoria = (...cats) => new Set(catalogo.filter((r) => cats.includes(r.categoria)).flatMap((r) => [r.id, r.id.replace(/^(expr|prop)_/, "")]));
const POSES = new Set(catalogo.map((r) => r.id));
const EXPRESIONES = idsPorCategoria("expresiones");
const PROPS = idsPorCategoria("props", "props_festivos");

const ESCENARIOS = new Set(literalesDeTipo("TipoEscenario"));
const COMPOSICIONES = literalesDeTipo("TipoComposicionVisual");
const TRANSICIONES = literalesDeTipo("TipoTransicion");

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const esPropValido = (p) => !p || PROPS.has(p) || p.startsWith("lucide:") || p.startsWith("svg:") || p.trim().startsWith("<") || /^[A-Z][A-Za-z0-9]+$/.test(p);

const Palabra = z.looseObject({ palabra: z.string(), inicioMs: z.number().min(0), finMs: z.number() });
const Paso = z.looseObject({ poseId: z.string().optional(), expresion: z.string().optional() });
const Personaje = z.looseObject({
  id: z.string(),
  poseId: z.string().optional(),
  expresion: z.string().optional(),
  prop: z.string().optional(),
  acciones: z.array(z.looseObject({ pasos: z.array(Paso).optional() })).optional(),
});
const Escena = z.looseObject({
  id: z.number().int().positive(),
  texto: z.string().min(1),
  icono: z.string().min(1),
  colorIcono: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, "colorIcono debe ser HEX"),
  tituloVisual: z.string().min(1),
  composicionVisual: z.enum(COMPOSICIONES).optional(),
  transicion: z.enum(TRANSICIONES).optional(),
  escenario: z.string().optional(),
  palabrasClave: z.array(z.string()).optional(),
  personajes: z.array(Personaje).optional(),
  palabras: z.array(Palabra).optional(),
  duracionSegundos: z.number().positive().optional(),
});
const Guion = z.object({
  meta: z.looseObject({
    duracionObjetivo: z.tuple([z.number().positive(), z.number().positive()]).optional(),
    fuentes: z.array(z.string()).optional(),
  }).optional(),
  escenas: z.array(Escena).min(1),
});

const errores = [];
const avisos = [];
const err = (m) => errores.push(m);
const warn = (m) => avisos.push(m);

function validarCatalogos(e) {
  const where = `Escena ${e.id}`;
  if (e.escenario && !ESCENARIOS.has(e.escenario)) err(`${where}: escenario "${e.escenario}" no existe en TipoEscenario`);
  const poses = [e.poseId, e.pose];
  const props = [e.prop];
  for (const p of e.personajes || []) {
    poses.push(p.poseId);
    props.push(p.prop);
    if (p.expresion && !EXPRESIONES.has(p.expresion)) err(`${where}/${p.id}: expresión "${p.expresion}" no existe`);
    for (const a of p.acciones || []) {
      for (const s of a.pasos || []) {
        poses.push(s.poseId);
        if (s.expresion && !EXPRESIONES.has(s.expresion)) err(`${where}/${p.id}: expresión "${s.expresion}" no existe`);
      }
    }
  }
  for (const id of poses.filter(Boolean)) if (!POSES.has(id)) err(`${where}: poseId "${id}" no existe en poses.json`);
  for (const p of props.filter(Boolean)) {
    if (p.startsWith("lucide:")) warn(`${where}: prop "${p}" usa Lucide (prohibido por regla; diseña un prop SVG propio en propsLibrary.ts)`);
    else if (!esPropValido(p)) warn(`${where}: prop "${p}" no está en el catálogo (¿svg:?)`);
  }
  for (const o of e.objetos || []) {
    if (o.propId?.startsWith("lucide:")) warn(`${where}: objeto "${o.propId}" usa Lucide (prohibido por regla; diseña un prop SVG propio en propsLibrary.ts)`);
    else if (o.propId && !esPropValido(o.propId)) warn(`${where}: objeto "${o.propId}" no está en el catálogo`);
  }
  if (e.sfx) {
    const sfxPath = path.join(ROOT, "public", e.sfx);
    if (!fs.existsSync(sfxPath)) warn(`${where}: archivo SFX "${e.sfx}" no existe en public/ (genéralo con python scripts/generar_sfx.py o síntesis WAV)`);
  }
}

function validarPalabras(e) {
  if (!e.palabras) return;
  let previo = -1;
  for (const w of e.palabras) {
    if (w.inicioMs < previo) err(`Escena ${e.id}: inicioMs desordenado en "${w.palabra}" (${w.inicioMs} < ${previo})`);
    if (w.finMs < w.inicioMs) err(`Escena ${e.id}: finMs < inicioMs en "${w.palabra}"`);
    previo = w.inicioMs;
  }
  const hablado = e.palabras.map((w) => norm(w.palabra)).filter(Boolean).join(" ");
  const guion = e.texto.split(/\s+/).map(norm).filter(Boolean).join(" ");
  if (hablado !== guion) err(`Escena ${e.id}: las palabras alineadas no coinciden con el texto (ejecuta npm run tts)`);
}

function primeraPose(e) {
  const p = e.personajes?.[0];
  return e.poseId || e.pose || p?.poseId || p?.acciones?.[0]?.pasos?.[0]?.poseId || null;
}

/** Lint de ritmo: avisos, nunca bloquea. */
function lintVisual(escenas) {
  escenas.forEach((e, i) => {
    const matchCifra = (e.texto || "").match(/\b\d+(?:[.,]\d+)?\b/g);
    if (matchCifra) {
      warn(`Escena ${e.id}: contiene cifras en dígitos (${matchCifra.join(", ")}) en el texto narrado; escribe los números con palabras o ejecuta npm run tts para normalizarlos.`);
    }
    const efectos = e.efectosCamara || [];
    if ((e.duracionSegundos ?? 0) > 6 && !efectos.some((x) => x === "punch" || x === "shake")) {
      warn(`Escena ${e.id}: dura ${e.duracionSegundos.toFixed(1)} s sin cambio de cámara (añade punch/shake o divide la escena)`);
    }
    const prev = escenas[i - 1];
    if (!prev) return;
    const mismaComp = (e.composicionVisual || "auto") === (prev.composicionVisual || "auto");
    const pose = primeraPose(e);
    if (mismaComp && pose && pose === primeraPose(prev)) {
      warn(`Escenas ${prev.id}-${e.id}: repiten composición (${e.composicionVisual || "auto"}) y pose (${pose})`);
    } else if (mismaComp && e.composicionVisual && e.escenario === prev.escenario) {
      warn(`Escenas ${prev.id}-${e.id}: repiten encuadre (${e.composicionVisual}) y escenario (${e.escenario})`);
    }
  });
}

function main() {
  const raw = JSON.parse(fs.readFileSync(GUION_PATH, "utf-8"));
  const parsed = Guion.safeParse(Array.isArray(raw) ? { escenas: raw } : raw);
  if (!parsed.success) {
    for (const i of parsed.error.issues) err(`${i.path.join(".") || "(raíz)"}: ${i.message}`);
  } else {
    const { escenas, meta } = parsed.data;
    const ids = escenas.map((e) => e.id);
    if (new Set(ids).size !== ids.length) err("Hay ids de escena duplicados");
    escenas.forEach((e) => { validarCatalogos(e); validarPalabras(e); });

    const total = escenas.reduce((a, e) => a + (e.duracionSegundos ?? 0), 0);
    if (total > 0) {
      const [min, max] = meta?.duracionObjetivo || [62, 110];
      if (total < min || total > max) err(`Duración total ${total.toFixed(1)} s fuera del objetivo ${min}-${max} s (meta.duracionObjetivo)`);
    }
    lintVisual(escenas);
  }

  avisos.forEach((a) => console.warn(`[VALIDAR] ⚠️  ${a}`));
  errores.forEach((m) => console.error(`[VALIDAR] ❌ ${m}`));
  if (errores.length) {
    console.error(`\n[VALIDAR] ${errores.length} error(es) en el guion.`);
    process.exit(1);
  }
  console.log(`[VALIDAR] ✅ guion.json válido (${avisos.length} aviso(s) de ritmo/catálogo).`);
}

main();
