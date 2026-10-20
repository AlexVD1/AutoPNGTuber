import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const bundleResult = await esbuild.build({
  entryPoints: [
    path.join(ROOT, "src/stickman/expressions.ts"),
    path.join(ROOT, "src/stickman/bodyPoses.ts"),
    path.join(ROOT, "src/stickman/propsLibrary.ts"),
    path.join(ROOT, "src/stickman/festiveLibrary.ts"),
    path.join(ROOT, "src/stickman/composites.ts"),
  ],
  bundle: true,
  format: "esm",
  write: false,
  outdir: path.join(ROOT, ".tmp-build"),
});

const modules = {};
for (const out of bundleResult.outputFiles) {
  const name = path.basename(out.path, ".js");
  const dataUrl =
    "data:text/javascript;base64," +
    Buffer.from(out.text, "utf-8").toString("base64");
  modules[name] = await import(dataUrl);
}

const { EXPRESSIONS, renderFaceMarkup } = modules.expressions;
const { BODY_POSES } = modules.bodyPoses;
const { PROPS_LIBRARY } = modules.propsLibrary;
const { FESTIVE_PROPS, FESTIVE_COMPOSITES } = modules.festiveLibrary;
const { COMPOSITE_POSES, buildStickmanSvgString } = modules.composites;

const DIRS = [
  "public/poses/base",
  "public/poses/emociones",
  "public/poses/acciones",
  "public/poses/expresiones",
  "public/poses/props",
  "public/poses/props/festivos",
  "public/poses/compuestas",
  "public/poses/compuestas/festivos",
];

for (const dir of DIRS) {
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
}

// 1. Master Reference Sheet
const masterSvg = buildStickmanSvgString({
  poseId: "standing_relaxed",
  expressionId: "smile_soft",
});
fs.writeFileSync(
  path.join(ROOT, "public/poses/master_reference.svg"),
  masterSvg,
  "utf-8"
);

const catalogo = [];

// 2. Generar poses corporales (base, emociones, acciones)
for (const pose of Object.values(BODY_POSES)) {
  const relPath = `poses/${pose.folder}/${pose.id}.svg`;
  const absPath = path.join(ROOT, "public", relPath);
  const svgContent = buildStickmanSvgString({
    poseId: pose.id,
    expressionId: pose.defaultExpression,
  });
  fs.writeFileSync(absPath, svgContent, "utf-8");

  catalogo.push({
    id: pose.id,
    nombre: pose.name,
    categoria: pose.folder,
    subcategoria: pose.group,
    emocion: pose.emotion,
    accion: pose.action,
    propsAsociados: [],
    ruta: relPath,
    formato: "svg",
    etiquetas: pose.tags,
    compatibleComposicion: true,
  });
}

// 3. Generar variaciones de expresiones faciales (24 expresiones)
for (const expr of Object.values(EXPRESSIONS)) {
  const relPath = `poses/expresiones/expr_${expr.id}.svg`;
  const absPath = path.join(ROOT, "public", relPath);
  const faceSvg = `<svg width="240" height="240" viewBox="110 30 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="115" r="68" fill="#FFFFFF" stroke="#111827" stroke-width="12" />
  ${renderFaceMarkup(expr, "#111827")}
</svg>`;
  fs.writeFileSync(absPath, faceSvg, "utf-8");

  catalogo.push({
    id: `expr_${expr.id}`,
    poseParamId: expr.id,
    nombre: `Expresión: ${expr.name}`,
    categoria: "expresiones",
    emocion: expr.emotion,
    accion: "facial_expression",
    propsAsociados: [],
    ruta: relPath,
    formato: "svg",
    etiquetas: expr.tags,
    compatibleComposicion: true,
  });
}

// 4. Generar props generales reutilizables (90 props)
for (const prop of Object.values(PROPS_LIBRARY)) {
  const relPath = `poses/props/prop_${prop.id}.svg`;
  const absPath = path.join(ROOT, "public", relPath);
  const propSvg = `<svg width="200" height="200" viewBox="-65 -65 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${prop.svg}
</svg>`;
  fs.writeFileSync(absPath, propSvg, "utf-8");

  catalogo.push({
    id: `prop_${prop.id}`,
    propParamId: prop.id,
    nombre: `Prop: ${prop.name}`,
    categoria: "props",
    subcategoria: prop.family,
    emocion: "any",
    accion: prop.defaultPlacement,
    propsAsociados: [prop.id],
    ruta: relPath,
    formato: "svg",
    etiquetas: prop.tags,
    compatibleComposicion: true,
  });
}

// 5. Generar props festivos organizados por subcategoría (public/poses/props/festivos/<subcategoria>/)
for (const fprop of Object.values(FESTIVE_PROPS)) {
  const subDir = path.join(
    ROOT,
    "public/poses/props/festivos",
    fprop.subcategoria
  );
  fs.mkdirSync(subDir, { recursive: true });

  const relPath = `poses/props/festivos/${fprop.subcategoria}/prop_${fprop.id}.svg`;
  const absPath = path.join(ROOT, "public", relPath);
  const propSvg = `<svg width="220" height="220" viewBox="-80 -80 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${fprop.svg}
</svg>`;
  fs.writeFileSync(absPath, propSvg, "utf-8");

  catalogo.push({
    id: `prop_${fprop.id}`,
    propParamId: fprop.id,
    nombre: `Prop Festivo: ${fprop.name}`,
    categoria: "props_festivos",
    subcategoria: fprop.subcategoria,
    festividad: fprop.festividad,
    temporada: fprop.temporada,
    ...(fprop.paisCompatible ? { paisCompatible: fprop.paisCompatible } : {}),
    emocion: "any",
    accion: fprop.slot,
    propsAsociados: [fprop.id],
    ruta: relPath,
    formato: "svg",
    etiquetas: fprop.tags,
    compatibleComposicion: true,
  });
}

// 6. Generar combinaciones compuestas generales (32 compuestas)
for (const comp of Object.values(COMPOSITE_POSES)) {
  const relPath = `poses/compuestas/${comp.id}.svg`;
  const absPath = path.join(ROOT, "public", relPath);
  const compSvg = buildStickmanSvgString({
    poseId: comp.id,
  });
  fs.writeFileSync(absPath, compSvg, "utf-8");

  const propsAsociados = [
    comp.rightProp,
    comp.leftProp,
    comp.overheadProp,
  ].filter(Boolean);

  catalogo.push({
    id: comp.id,
    nombre: comp.name,
    categoria: "compuestas",
    poseBase: comp.bodyPoseId,
    expresionBase: comp.expressionId,
    emocion: comp.emotion,
    accion: comp.action,
    propsAsociados,
    ruta: relPath,
    formato: "svg",
    etiquetas: comp.tags,
    compatibleComposicion: true,
  });
}

// 7. Generar combinaciones compuestas festivas (20 compuestas festivas)
for (const fcomp of Object.values(FESTIVE_COMPOSITES)) {
  const relPath = `poses/compuestas/festivos/${fcomp.id}.svg`;
  const absPath = path.join(ROOT, "public", relPath);
  const compSvg = buildStickmanSvgString({
    poseId: fcomp.id,
  });
  fs.writeFileSync(absPath, compSvg, "utf-8");

  const propsAsociados = [
    fcomp.rightProp,
    fcomp.leftProp,
    fcomp.overheadProp,
    fcomp.hatProp,
    fcomp.faceProp,
    fcomp.neckProp,
    fcomp.waistProp,
  ].filter(Boolean);

  catalogo.push({
    id: fcomp.id,
    nombre: fcomp.name,
    categoria: "compuestas_festivas",
    subcategoria: fcomp.subcategoria,
    festividad: fcomp.festividad,
    temporada: fcomp.temporada,
    ...(fcomp.paisCompatible ? { paisCompatible: fcomp.paisCompatible } : {}),
    poseBase: fcomp.bodyPoseId,
    expresionBase: fcomp.expressionId,
    emocion: fcomp.emotion,
    accion: fcomp.action,
    propsAsociados,
    ruta: relPath,
    formato: "svg",
    etiquetas: fcomp.tags,
    compatibleComposicion: true,
  });
}

// 8. Control de calidad y validación del catálogo
const seenIds = new Set();
let errors = 0;

for (const item of catalogo) {
  if (seenIds.has(item.id)) {
    console.error(`[ERROR] ID duplicado: ${item.id}`);
    errors++;
  }
  seenIds.add(item.id);

  const fullPath = path.join(ROOT, "public", item.ruta);
  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] Archivo faltante: ${fullPath}`);
    errors++;
  } else {
    const content = fs.readFileSync(fullPath, "utf-8");
    if (!content.includes("<svg") || !content.includes("</svg>")) {
      console.error(`[ERROR] SVG inválido en: ${fullPath}`);
      errors++;
    }
  }
}

if (errors > 0) {
  process.exit(1);
}

// 9. Guardar src/data/poses.json
const resumen = {
  version: "2.0.0",
  referenciaMaestra: "poses/master_reference.svg",
  totales: {
    posesCorporales: Object.keys(BODY_POSES).length,
    expresionesFaciales: Object.keys(EXPRESSIONS).length,
    propsGenerales: Object.keys(PROPS_LIBRARY).length,
    propsFestivos: Object.keys(FESTIVE_PROPS).length,
    combinacionesCompuestas: Object.keys(COMPOSITE_POSES).length,
    combinacionesFestivas: Object.keys(FESTIVE_COMPOSITES).length,
    totalRecursos: catalogo.length,
  },
  compatibilidadLegacy: {
    normal: "standing_relaxed",
    pensando: "thinking_chin_hand",
    sorprendido: "surprised_hands_up",
    explicando: "explaining_pointing_up",
  },
  recursos: catalogo,
};

fs.writeFileSync(
  path.join(ROOT, "src/data/poses.json"),
  JSON.stringify(resumen, null, 2),
  "utf-8"
);

// 10. Generar hoja de contacto visual interactiva (public/poses/contact_sheet.html)
const sections = [
  {
    key: "compuestas_festivas",
    title: "Combinaciones Festivas y de Temporada (Pose + Accesorios + Props)",
  },
  {
    key: "props_festivos",
    title: "Props y Accesorios Festivos por Celebración",
  },
  {
    key: "compuestas",
    title: "Combinaciones Compuestas Generales (Educación, Ciencia, Historia)",
  },
  { key: "base", title: "Poses Corporales: Base y Transición" },
  { key: "emociones", title: "Poses Corporales: Emociones" },
  { key: "acciones", title: "Poses Corporales: Acciones y Enseñanza" },
  { key: "expresiones", title: "Variaciones de Expresiones Faciales" },
  { key: "props", title: "Biblioteca General de Props Reutilizables" },
];

const sectionHtml = sections
  .map((sec) => {
    const items = catalogo.filter((i) => i.categoria === sec.key);
    const cards = items
      .map((item) => {
        const relFromPoses = item.ruta.replace(/^poses\//, "./");
        return `<div class="card" data-tags="${[
          item.id,
          item.nombre,
          item.emocion,
          item.accion,
          item.festividad || "",
          item.temporada || "",
          ...(item.paisCompatible || []),
          ...(item.etiquetas || []),
        ]
          .join(" ")
          .toLowerCase()}">
          <div class="preview">
            <img src="${relFromPoses}" alt="${item.nombre}" loading="lazy" />
          </div>
          <div class="meta">
            <code>${item.id}</code>
            <strong>${item.nombre}</strong>
            <div class="badges">
              <span class="badge">${item.emocion}</span>
              ${
                item.festividad
                  ? `<span class="badge fest">${item.festividad} (${item.temporada})</span>`
                  : ""
              }
              ${
                item.paisCompatible?.length
                  ? `<span class="badge country">${item.paisCompatible.join(", ")}</span>`
                  : ""
              }
              ${
                item.propsAsociados?.length
                  ? `<span class="badge prop">props: ${item.propsAsociados.join(", ")}</span>`
                  : ""
              }
            </div>
            <div class="tags">${(item.etiquetas || []).join(" · ")}</div>
          </div>
        </div>`;
      })
      .join("\n");

    return `<section>
      <h2>${sec.title} <span>(${items.length})</span></h2>
      <div class="grid">${cards}</div>
    </section>`;
  })
  .join("\n");

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Hoja de Contacto - Biblioteca Stickman AutoPNGTuber</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #F9FAFB;
      color: #111827;
      margin: 0;
      padding: 32px;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 32px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      background: #FFFFFF;
      padding: 24px 32px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    h1 { margin: 0 0 6px; font-size: 26px; }
    .stats { color: #4B5563; font-size: 14px; }
    input[type="search"] {
      padding: 12px 16px;
      border: 2px solid #E5E7EB;
      border-radius: 10px;
      width: 360px;
      font-size: 15px;
    }
    section { max-width: 1400px; margin: 0 auto 42px; }
    h2 {
      font-size: 20px;
      border-bottom: 2px solid #E5E7EB;
      padding-bottom: 10px;
      margin-bottom: 18px;
    }
    h2 span { color: #6B7280; font-weight: 500; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 16px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .preview {
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(#F3F4F6 1px, transparent 1px);
      background-size: 12px 12px;
      border-radius: 8px;
      padding: 8px;
    }
    .preview img {
      max-height: 164px;
      max-width: 100%;
      object-fit: contain;
    }
    .meta { display: flex; flex-direction: column; gap: 4px; }
    code {
      font-size: 12px;
      color: #2563EB;
      background: #EFF6FF;
      padding: 2px 6px;
      border-radius: 4px;
      align-self: flex-start;
      font-weight: 700;
    }
    strong { font-size: 13px; color: #111827; }
    .badges { display: flex; flex-wrap: wrap; gap: 4px; }
    .badge {
      font-size: 11px;
      background: #F3F4F6;
      color: #374151;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .badge.prop { background: #FEF3C7; color: #92400E; }
    .badge.fest { background: #FCE7F3; color: #9D174D; }
    .badge.country { background: #DCFCE7; color: #166534; }
    .tags { font-size: 11px; color: #6B7280; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Biblioteca Visual del Stickman (AutoPNGTuber v2.0)</h1>
      <div class="stats">
        Total validados: <strong>${catalogo.length}</strong> recursos |
        <strong>${Object.keys(BODY_POSES).length}</strong> poses |
        <strong>${Object.keys(EXPRESSIONS).length}</strong> expresiones |
        <strong>${Object.keys(PROPS_LIBRARY).length}</strong> props base |
        <strong>${Object.keys(FESTIVE_PROPS).length}</strong> props festivos |
        <strong>${Object.keys(COMPOSITE_POSES).length + Object.keys(FESTIVE_COMPOSITES).length}</strong> compuestas
      </div>
    </div>
    <input type="search" id="search" placeholder="Buscar por ID, festividad, temporada, país o etiqueta..." />
  </header>
  ${sectionHtml}
  <script>
    const input = document.getElementById("search");
    const cards = Array.from(document.querySelectorAll(".card"));
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach((c) => {
        c.style.display = !q || c.dataset.tags.includes(q) ? "" : "none";
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync(
  path.join(ROOT, "public/poses/contact_sheet.html"),
  htmlContent,
  "utf-8"
);

console.log(
  `Biblioteca v2.0 generada y validada con exito:` +
    `\n - Poses corporales: ${Object.keys(BODY_POSES).length}` +
    `\n - Expresiones faciales: ${Object.keys(EXPRESSIONS).length}` +
    `\n - Props generales: ${Object.keys(PROPS_LIBRARY).length}` +
    `\n - Props festivos y de temporada: ${Object.keys(FESTIVE_PROPS).length}` +
    `\n - Combinaciones compuestas generales: ${Object.keys(COMPOSITE_POSES).length}` +
    `\n - Combinaciones compuestas festivas: ${Object.keys(FESTIVE_COMPOSITES).length}` +
    `\n - Total en src/data/poses.json: ${catalogo.length}` +
    `\n - Hoja de contacto: public/poses/contact_sheet.html`
);
