const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
try { process.loadEnvFile(path.join(ROOT_DIR, ".env")); } catch { /* .env opcional */ }

const GUION_PATH = path.resolve(ROOT_DIR, "src/data/guion.json");
const OUT_DIR = path.resolve(ROOT_DIR, "out");
const DESTINO_DIR = process.env.DESTINO_DIR || "";
const TTS_CACHE_PATH = path.resolve(ROOT_DIR, "public/audios/.tts_cache.json");
const VOICE_CAST_PATH = path.resolve(ROOT_DIR, "public/voices/voice_cast.json");
const BGM_PATH = path.resolve(ROOT_DIR, "public/bgm/bgm.mp3");

/**
 * Convierte un texto en un slug seguro para nombres de archivo.
 */
function limpiarSlug(texto, maxPalabras = null) {
  if (!texto) return "short";

  let str = texto.trim();
  if (maxPalabras && str.split(/\s+/).length > maxPalabras) {
    str = str.split(/\s+/).slice(0, maxPalabras).join(" ");
  }

  const slug = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);

  return slug || "short";
}

/**
 * Determina el slug del video a partir de argumentos o del guion activo.
 */
function obtenerSlug(guion, customName) {
  if (customName && customName.trim()) {
    let clean = customName.trim();
    if (clean.toLowerCase().endsWith(".mp4")) {
      clean = clean.slice(0, -4);
    }
    return limpiarSlug(clean);
  }

  const meta = Array.isArray(guion) ? null : guion?.meta;
  if (meta && (meta.slug || meta.id)) {
    return limpiarSlug(meta.slug || meta.id);
  }

  const escenas = Array.isArray(guion) ? guion : (guion?.escenas || []);
  if (Array.isArray(escenas) && escenas.length > 0) {
    const escenaConTitulo = escenas.find((e) => e && e.tituloVisual && e.tituloVisual.trim());
    if (escenaConTitulo) {
      return limpiarSlug(escenaConTitulo.tituloVisual);
    }
    if (escenas[0] && escenas[0].texto) {
      return limpiarSlug(escenas[0].texto, 6);
    }
  }

  return "short";
}

/**
 * Da formato de título limpio en español preservando signos de apertura y tratando palabras menores.
 */
function formatearTitulo(texto) {
  if (!texto) return "Short";
  let s = texto.trim();
  const menores = new Set([
    "de", "del", "en", "el", "la", "los", "las", "un", "una", "unos", "unas",
    "y", "e", "o", "u", "a", "por", "con", "para", "al"
  ]);

  const lower = s.toLowerCase();
  const palabras = lower.split(/(\s+)/);
  let primera = true;

  return palabras
    .map((chunk) => {
      if (/^\s+$/.test(chunk)) return chunk;
      const cleanWord = chunk
        .replace(/^[¿¡(\[]+/, "")
        .replace(/[?!)\].:,;]+$/, "");

      if (!primera && menores.has(cleanWord)) {
        return chunk;
      }
      primera = false;
      return chunk.replace(/(^[¿¡(\[]*)(\w)/, (_, pre, l) => pre + l.toUpperCase());
    })
    .join("");
}

/**
 * Obtiene un título presentable para la publicación.
 */
function obtenerTituloLegible(guion, customName, customTitle) {
  if (customTitle && customTitle.trim()) {
    return customTitle.trim();
  }

  const meta = Array.isArray(guion) ? null : guion?.meta;
  if (meta && meta.temaResumen) {
    return formatearTitulo(meta.temaResumen);
  }

  const escenas = Array.isArray(guion) ? guion : (guion?.escenas || []);
  if (Array.isArray(escenas) && escenas.length > 0) {
    const escenaConTitulo = escenas.find((e) => e && e.tituloVisual && e.tituloVisual.trim());
    if (escenaConTitulo) {
      return formatearTitulo(escenaConTitulo.tituloVisual);
    }
    if (escenas[0] && escenas[0].texto) {
      const primeraFrase = escenas[0].texto.split(/[.?!]/)[0];
      return formatearTitulo(primeraFrase);
    }
  }

  if (customName && customName.trim()) {
    const clean = customName.replace(/\.mp4$/i, "").replace(/[_-]+/g, " ");
    return formatearTitulo(clean);
  }

  return "Short Sabías Que";
}

/**
 * Detecta el género temático del video a partir de su contenido.
 */
function detectarGenero(textoCompleto, palabrasClave = []) {
  const combinado = (textoCompleto + " " + palabrasClave.join(" ")).toLowerCase();

  if (/qu[eé]\s+pasar[ií]a\s+si|imagin[aá]te\s+si|hipot[eé]tico/i.test(combinado)) {
    return "HYPOTHETICAL";
  }
  if (/misterio|enigma|conspiraci[oó]n|secreto|inexplicable/i.test(combinado)) {
    return "MYSTERY";
  }
  if (/estrella|planeta|espacio|universo|galaxia|astronom|f[ií]sica|qu[ií]mica|ciencia|átomo|cu[aá]ntic|gravedad/i.test(combinado)) {
    return "SCIENCE";
  }
  if (/historia|imperio|siglo|antiguo|guerr|civilizaci|arqueolog/i.test(combinado)) {
    return "HISTORY";
  }
  if (/futuro|ia|inteligencia\s+artificial|tecnolog|robot|cyborg/i.test(combinado)) {
    return "SCI_FI";
  }
  return "CURIOSITIES";
}

const STOP_WORDS = new Set([
  "un", "una", "unos", "unas", "de", "del", "al", "en", "el", "la", "los", "las",
  "y", "e", "o", "u", "a", "por", "con", "para", "sin", "sobre", "tras", "desde",
  "hasta", "hacia", "pero", "mas", "como", "cuando", "donde", "quien", "cual", "que",
  "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "aquel", "aquella",
  "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  "once", "doce", "trece", "catorce", "quince", "veinte", "treinta", "cuarenta",
  "cincuenta", "sesenta", "setenta", "ochenta", "noventa", "cien", "ciento", "mil",
  "millon", "millones", "primer", "primero", "primera", "segundo", "tercero",
  "cada", "todo", "toda", "todos", "todas", "otro", "otra", "otros", "otras",
  "muy", "mucho", "poco", "tanto", "tambien", "tampoco", "nada", "algo", "asi",
  "bien", "mal", "aqui", "alla", "alli", "ahora", "despues", "luego", "antes",
]);

/**
 * Normaliza un término a formato hashtag (#palabra) sin acentos ni caracteres especiales.
 * Filtra números y palabras vacías/preposiciones.
 */
function normalizarHashtag(str) {
  if (!str) return null;
  const limpio = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (!limpio || limpio.length < 3) return null;
  // Descartar si es un número puro o palabra vacía
  if (/^\d+$/.test(limpio)) return null;
  if (STOP_WORDS.has(limpio)) return null;

  return `#${limpio}`;
}

/**
 * Genera entre 6 y 10 hashtags estratégicos, limpios y enfocados en el nicho del video,
 * retención y viralidad (sin números ni preposiciones).
 */
function generarHashtags(genero, guion) {
  const nicheTags = new Set();
  const viralTags = new Set();

  // 1. Tags temáticos del nicho según género
  if (genero === "SCIENCE" || genero === "HYPOTHETICAL") {
    nicheTags.add("#ciencia");
    nicheTags.add("#curiosidades");
    nicheTags.add("#aprendeentiktok");
  } else if (genero === "HISTORY") {
    nicheTags.add("#historia");
    nicheTags.add("#curiosidadeshistoricas");
    nicheTags.add("#datoscuriosos");
  } else if (genero === "SCI_FI") {
    nicheTags.add("#scifi");
    nicheTags.add("#futuro");
    nicheTags.add("#tecnologia");
  } else {
    nicheTags.add("#curiosidades");
    nicheTags.add("#sabiasque");
  }

  // 2. Extraer palabras clave sustantivas del guion (máx 3-4 las más relevantes)
  const escenas = Array.isArray(guion) ? guion : (guion?.escenas || []);
  for (const escena of escenas) {
    if (Array.isArray(escena.palabrasClave)) {
      for (const kw of escena.palabrasClave) {
        const h = normalizarHashtag(kw);
        if (h && !nicheTags.has(h) && nicheTags.size < 6) {
          nicheTags.add(h);
        }
      }
    }
  }

  // 3. Tags virales de alto alcance para completar entre 6 y 8 tags
  const viralesBase = ["#sabiasque", "#datoscuriosos", "#parati", "#fyp", "#viral"];
  for (const v of viralesBase) {
    if (!nicheTags.has(v)) {
      viralTags.add(v);
    }
  }

  // 4. Combinar manteniendo entre 6 y 10 hashtags en total
  const resultado = [...nicheTags, ...viralTags].slice(0, 8);
  return resultado;
}

/**
 * UUID estable derivado del slug: re-exportar no cambia el ID.
 */
function storyIdEstable(slug) {
  const h = crypto.createHash("sha1").update(slug).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/**
 * Duración real del MP4 con ffprobe; null si no existe el archivo o ffprobe falla.
 */
function medirDuracionMp4(rutaMp4) {
  if (!fs.existsSync(rutaMp4)) return null;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", rutaMp4], { encoding: "utf-8" });
  const d = parseFloat(r.stdout);
  return r.status === 0 && d > 0 ? Number(d.toFixed(2)) : null;
}

const MAX_TITULO = 60;
const LIMITE_DESCRIPCION = 500;

function primeraFrase(texto) {
  return (texto || "").trim().split(/(?<=[.!?])\s+/)[0] || "";
}

function recortar(texto, max) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return corte.slice(0, corte.lastIndexOf(" ") > 0 ? corte.lastIndexOf(" ") : undefined).replace(/[,;:\s]+$/, "") + "…";
}

/**
 * Título ≤ 60 caracteres. Rota (estable por slug) entre 4 plantillas:
 * pregunta, cifra, contradicción y "lo que nadie te dice". Meta.titulo tiene prioridad.
 */
function generarTitulo(meta, escenas, slug, textoCompleto) {
  if (meta?.titulo) return recortar(meta.titulo.trim(), MAX_TITULO);

  const base = (meta?.temaResumen || escenas.find((e) => e?.tituloVisual)?.tituloVisual || "Short Sabías Que").trim();
  // Segmentos (hasta "?" o ".") sin signos de interrogación; se corta antes de cláusulas secundarias.
  const segmentos = base.split(/[?.]/).map((s) => s.replace(/^¿/, "").split(/,| mediante | debido | según | gracias /)[0].trim()).filter(Boolean);
  const minus = (n) => n.charAt(0).toLowerCase() + n.slice(1);
  const cifra = textoCompleto.match(/\d+(?:[.,]\d+)?\s?%?/)?.[0].trim();

  const plantillas = [
    (n) => `¿${n}?`,
    cifra && !base.includes(cifra) && ((n) => `${cifra}: ${minus(n)}`),
    (n) => `No es lo que crees: ${minus(n)}`,
    (n) => `Lo que nadie te dice: ${minus(n)}`,
  ].filter(Boolean);

  // Plantilla inicial estable por slug; se usa la primera combinación segmento+plantilla que cabe en 60.
  const idx = parseInt(crypto.createHash("sha1").update(slug).digest("hex").slice(0, 8), 16) % plantillas.length;
  for (const seg of segmentos) {
    for (let i = 0; i < plantillas.length; i++) {
      const t = plantillas[(idx + i) % plantillas.length](seg);
      if (t.length <= MAX_TITULO) return t;
    }
  }
  return recortar(plantillas[0](segmentos[0]), MAX_TITULO);
}
/**
 * Descripción ≤ 500 caracteres: gancho, 2 líneas de datos, CTA, fuentes y hashtags.
 */
function generarDescripcion(meta, escenas, hashtags) {
  const gancho = recortar(meta?.gancho || primeraFrase(escenas[0]?.texto), 120);
  const ultima = (escenas[escenas.length - 1]?.texto || "").trim().split(/(?<=[.!?])\s+/);
  const cta = [...ultima].reverse().find((f) => f.endsWith("?")) || "¿Qué otro tema quieres que explique?";
  const fuentes = meta?.fuentes?.length ? `Fuentes: ${meta.fuentes.join("; ")}` : "";
  const tags = hashtags.join(" ");

  const fijo = [gancho, cta, fuentes, tags].filter(Boolean).join("\n\n");
  // El resto del presupuesto se reparte entre las 2 líneas de datos.
  const presupuesto = Math.max(20, Math.floor((LIMITE_DESCRIPCION - fijo.length - 6) / 2));
  const datos = escenas.slice(1, 3).map((e) => recortar(primeraFrase(e?.texto), presupuesto)).filter(Boolean);

  return [gancho, datos.join("\n"), cta, fuentes, tags].filter(Boolean).join("\n\n");
}

/**
 * Resuelve la voz TTS utilizada a partir de la caché o configuración.
 */
function resolverTtsVoice() {
  if (fs.existsSync(TTS_CACHE_PATH)) {
    try {
      const cache = JSON.parse(fs.readFileSync(TTS_CACHE_PATH, "utf-8"));
      for (const key of Object.keys(cache)) {
        if (cache[key] && cache[key].voiceConds) {
          return cache[key].voiceConds;
        }
      }
    } catch {
      // Ignorar error de lectura de caché
    }
  }

  if (fs.existsSync(VOICE_CAST_PATH)) {
    try {
      const cast = JSON.parse(fs.readFileSync(VOICE_CAST_PATH, "utf-8"));
      if (cast.narrator_voice) {
        return `${cast.narrator_voice}.conds.pt`;
      }
    } catch {
      // Ignorar error de voz
    }
  }

  return "alex.conds.pt";
}

/**
 * Construye el objeto completo de metadata según el esquema de VideosStories.
 */
function generarMetadata(opciones = {}) {
  let guion = opciones.guion;
  if (!guion) {
    if (fs.existsSync(GUION_PATH)) {
      guion = JSON.parse(fs.readFileSync(GUION_PATH, "utf-8"));
    } else {
      guion = [];
    }
  }

  const slug = opciones.slug || obtenerSlug(guion, opciones.customName);
  const nombreVideo = `${slug}.mp4`;
  const meta = Array.isArray(guion) ? null : guion?.meta;
  const escenas = Array.isArray(guion) ? guion : (guion?.escenas || []);

  // Narración completa (antes era la descripción; ahora va aparte)
  const transcript = escenas
    .map((e) => (e && e.texto ? e.texto.trim() : ""))
    .filter(Boolean)
    .join(" ");

  const todasLasPalabrasClave = escenas.flatMap((e) =>
    Array.isArray(e.palabrasClave) ? e.palabrasClave : []
  );

  // La heurística de género es solo una pista; meta.genero o --genre la sobrescriben.
  const genero = opciones.genre || meta?.genero || detectarGenero(transcript, todasLasPalabrasClave);
  const hashtags = generarHashtags(genero, escenas);
  const titulo = opciones.title?.trim() || generarTitulo(meta, escenas, slug, transcript);
  const tituloVisual = escenas.find((e) => e?.tituloVisual)?.tituloVisual || titulo;
  const tituloCorto = meta?.titulo_corto || tituloVisual.split(/\s+/).slice(0, 5).join(" ");

  // Duración real del MP4; respaldo: suma de escenas
  const duracionMp4 = medirDuracionMp4(path.join(opciones.outDir || OUT_DIR, nombreVideo));
  const totalSegundos = escenas.reduce(
    (acc, e) => acc + (typeof e.duracionSegundos === "number" ? e.duracionSegundos : 4),
    0
  );
  const duracionSegundos = duracionMp4 ?? Number(totalSegundos.toFixed(2));

  // Conserva campos de seguimiento editados a mano al re-exportar
  let previo = {};
  try {
    previo = JSON.parse(fs.readFileSync(path.join(opciones.outDir || OUT_DIR, `${slug}_metadata.json`), "utf-8"));
  } catch { /* primera exportación */ }

  return {
    storyId: storyIdEstable(slug),
    title: titulo,
    titulo_corto: tituloCorto,
    description: generarDescripcion(meta, escenas, hashtags.slice(0, 4)),
    transcript,
    hashtags,
    fuentes: meta?.fuentes || [],
    genre: genero,
    category: opciones.category || (genero === "SCIENCE" || genero === "SCI_FI" ? "Science & Technology" : "Education"),
    language: "es-MX",
    duration_seconds: duracionSegundos,
    resolution: "1080x1920",
    format: "mp4",
    codec_video: "h264",
    codec_audio: "aac",
    fps: 30,
    created_at: new Date().toISOString(),
    video_file: nombreVideo,
    scene_count: escenas.length,
    has_subtitles: true,
    has_narration: true,
    has_music: fs.existsSync(BGM_PATH),
    tts_voice: resolverTtsVoice(),
    playlist: previo.playlist ?? meta?.playlist ?? null,
    idioma_alterno: previo.idioma_alterno ?? meta?.idioma_alterno ?? null,
    estado: previo.estado ?? "pendiente",
    fecha_publicacion: previo.fecha_publicacion ?? null,
  };
}

/**
 * Guarda el archivo de metadata en disco (en /out y opcionalmente en H:\Mi unidad\ShortsMotionGraphics).
 */
function exportarArchivoMetadata(opciones = {}) {
  const metadata = generarMetadata(opciones);
  const slug = opciones.slug || metadata.video_file.replace(/\.mp4$/i, "");
  const nombreJson = `${slug}_metadata.json`;

  const outDir = opciones.outDir || OUT_DIR;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const rutaOut = path.join(outDir, nombreJson);
  fs.writeFileSync(rutaOut, JSON.stringify(metadata, null, 2), "utf-8");
  console.log(`[METADATA] 📄 Metadata guardada en: ${rutaOut}`);

  // Copia a destino secundario (Google Drive / ShortsMotionGraphics) si aplica
  let rutaDestino = null;
  const destinoDir = opciones.destinoDir !== undefined ? opciones.destinoDir : DESTINO_DIR;

  if (destinoDir && opciones.copiarDestino !== false) {
    try {
      const unidad = path.parse(destinoDir).root;
      if (fs.existsSync(unidad)) {
        if (!fs.existsSync(destinoDir)) {
          fs.mkdirSync(destinoDir, { recursive: true });
        }
        rutaDestino = path.join(destinoDir, nombreJson);
        fs.writeFileSync(rutaDestino, JSON.stringify(metadata, null, 2), "utf-8");
        console.log(`[METADATA] 🚀 Metadata copiada a: ${rutaDestino}`);
      } else {
        console.log(`[METADATA] ℹ️  Unidad ${unidad} no disponible; metadata conservada en /out.`);
      }
    } catch (err) {
      console.warn(`[METADATA] ⚠️  No se pudo copiar metadata a ${destinoDir}: ${err.message}`);
    }
  }

  return {
    metadata,
    nombreArchivo: nombreJson,
    rutaOut,
    rutaDestino,
  };
}

// Ejecución directa por línea de comandos
if (require.main === module) {
  const args = process.argv.slice(2);
  let customName = null;
  let customTitle = null;
  let customGenre = null;
  let noCopy = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--name" && args[i + 1]) {
      customName = args[++i];
    } else if (arg.startsWith("--name=")) {
      customName = arg.split("=")[1];
    } else if (arg === "--title" && args[i + 1]) {
      customTitle = args[++i];
    } else if (arg.startsWith("--title=")) {
      customTitle = arg.split("=")[1];
    } else if (arg === "--genre" && args[i + 1]) {
      customGenre = args[++i];
    } else if (arg.startsWith("--genre=")) {
      customGenre = arg.split("=")[1];
    } else if (arg === "--no-copy") {
      noCopy = true;
    } else if (!arg.startsWith("-") && !customName) {
      customName = arg;
    }
  }

  try {
    const resultado = exportarArchivoMetadata({
      customName,
      title: customTitle,
      genre: customGenre,
      copiarDestino: !noCopy,
    });
    console.log("\n[METADATA] ✅ Exportación finalizada exitosamente.");
    console.log(`            Título:      ${resultado.metadata.title}`);
    console.log(`            Género:      ${resultado.metadata.genre}`);
    console.log(`            Duración:    ${resultado.metadata.duration_seconds}s`);
    console.log(`            Escenas:     ${resultado.metadata.scene_count}`);
    console.log(`            Hashtags:    ${resultado.metadata.hashtags.length} etiquetas`);
  } catch (err) {
    console.error(`[METADATA] ❌ Error al exportar metadata: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  generarMetadata,
  exportarArchivoMetadata,
  obtenerSlug,
  obtenerTituloLegible,
  detectarGenero,
  generarHashtags,
  DESTINO_DIR,
};
