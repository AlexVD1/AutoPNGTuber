const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const OUT_DIR = path.resolve(__dirname, "../out");
const GUION_PATH = path.resolve(__dirname, "../src/data/guion.json");
const DESTINO_DIR = "H:\\Mi unidad\\ShortsMotionGraphics";
const MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 horas
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".mkv", ".avi"]);

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
    .replace(/[\u0300-\u036f]/g, "") // Quitar diacríticos / tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")    // Caracteres especiales a guion bajo
    .replace(/^_+|_+$/g, "")        // Quitar guiones en bordes
    .slice(0, 50);                  // Límite de longitud

  return slug || "short";
}

/**
 * Obtiene el nombre del video a partir de argumentos o del guion activo.
 */
function obtenerNombreVideo(customName) {
  if (customName && customName.trim()) {
    let clean = customName.trim();
    if (clean.toLowerCase().endsWith(".mp4")) {
      clean = clean.slice(0, -4);
    }
    return limpiarSlug(clean);
  }

  if (fs.existsSync(GUION_PATH)) {
    try {
      const guion = JSON.parse(fs.readFileSync(GUION_PATH, "utf-8"));
      if (Array.isArray(guion) && guion.length > 0) {
        // Prioridad 1: tituloVisual de la primera escena que lo tenga
        const escenaConTitulo = guion.find((e) => e && e.tituloVisual && e.tituloVisual.trim());
        if (escenaConTitulo) {
          return limpiarSlug(escenaConTitulo.tituloVisual);
        }

        // Prioridad 2: Primeras palabras del texto de la primera escena
        if (guion[0] && guion[0].texto) {
          return limpiarSlug(guion[0].texto, 6);
        }
      }
    } catch (err) {
      console.warn(`[RENDER] ⚠️  No se pudo leer ${GUION_PATH}: ${err.message}`);
    }
  }

  return "short";
}

/**
 * Elimina videos con más de 48 horas de antigüedad únicamente en la carpeta /out.
 */
function limpiarVideosAntiguos() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    return;
  }

  console.log("\n[LIMPIEZA] 🔍 Revisando carpeta /out (videos > 48h)...");
  const ahora = Date.now();
  let eliminados = 0;

  try {
    const archivos = fs.readdirSync(OUT_DIR);
    for (const archivo of archivos) {
      const ext = path.extname(archivo).toLowerCase();
      if (!VIDEO_EXTS.has(ext)) continue;

      const rutaArchivo = path.join(OUT_DIR, archivo);
      try {
        const stats = fs.statSync(rutaArchivo);
        if (stats.isFile()) {
          const antiguedadMs = ahora - stats.mtimeMs;
          if (antiguedadMs > MAX_AGE_MS) {
            const horas = (antiguedadMs / (1000 * 60 * 60)).toFixed(1);
            fs.unlinkSync(rutaArchivo);
            console.log(`[LIMPIEZA] 🗑️  Eliminado: ${archivo} (${horas}h de antigüedad)`);
            eliminados++;
          }
        }
      } catch (err) {
        console.warn(`[LIMPIEZA] ⚠️  No se pudo verificar ${archivo}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`[LIMPIEZA] ⚠️  Error al leer /out: ${err.message}`);
  }

  if (eliminados === 0) {
    console.log("[LIMPIEZA] ✨ Carpeta /out al día (sin videos > 48h).");
  }
}

/**
 * Copia el video generado a la unidad de destino si está disponible.
 */
function copiarADestino(rutaOrigen, nombreArchivo) {
  try {
    const unidad = path.parse(DESTINO_DIR).root;
    if (!fs.existsSync(unidad)) {
      console.warn(`\n[COPIA] ⚠️  La unidad ${unidad} no está conectada.`);
      console.warn(`[COPIA] ℹ️  El video se encuentra disponible en: ${rutaOrigen}`);
      return;
    }

    if (!fs.existsSync(DESTINO_DIR)) {
      fs.mkdirSync(DESTINO_DIR, { recursive: true });
    }

    const rutaDestino = path.join(DESTINO_DIR, nombreArchivo);
    fs.copyFileSync(rutaOrigen, rutaDestino);
    console.log(`\n[COPIA] 🚀 Video enviado exitosamente a:`);
    console.log(`        ${rutaDestino}`);
  } catch (err) {
    console.warn(`\n[COPIA] ⚠️  No se pudo copiar a ${DESTINO_DIR}: ${err.message}`);
    console.warn(`[COPIA] ℹ️  El video permanece en: ${rutaOrigen}`);
  }
}

/**
 * Flujo principal de renderizado.
 */
function main() {
  const args = process.argv.slice(2);
  let customName = null;
  let composition = "ShortSabiasQue";
  let port = "3002";
  let cleanOnly = false;
  const remotionFlags = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--clean-only" || arg === "--limpiar") {
      cleanOnly = true;
    } else if (arg === "--name" && args[i + 1]) {
      customName = args[++i];
    } else if (arg.startsWith("--name=")) {
      customName = arg.split("=")[1];
    } else if (arg === "--composition" && args[i + 1]) {
      composition = args[++i];
    } else if (arg.startsWith("--composition=")) {
      composition = arg.split("=")[1];
    } else if (arg === "--port" && args[i + 1]) {
      port = args[++i];
    } else if (arg.startsWith("--port=")) {
      port = arg.split("=")[1];
    } else if (!arg.startsWith("-") && !customName) {
      customName = arg;
    } else {
      remotionFlags.push(arg);
    }
  }

  // 1. Revisar y limpiar videos de más de 48h en /out
  limpiarVideosAntiguos();

  if (cleanOnly) {
    console.log("[RENDER] Modo solo limpieza finalizado.");
    return;
  }

  // 2. Determinar nombre de archivo descriptivo
  const slug = obtenerNombreVideo(customName);
  const nombreArchivo = `${slug}.mp4`;
  const rutaSalida = path.join(OUT_DIR, nombreArchivo);
  const rutaRelativa = path.relative(process.cwd(), rutaSalida).replace(/\\/g, "/");

  console.log(`\n[RENDER] 🎬 Composición: ${composition}`);
  console.log(`[RENDER] 📁 Destino local: ${rutaRelativa}`);
  console.log(`[RENDER] 🌐 Puerto: ${port}\n`);

  // 3. Ejecutar render con Remotion
  const comando = `npx remotion render ${composition} "${rutaRelativa}" --port ${port} ${remotionFlags.join(" ")}`.trim();
  const resultado = spawnSync(comando, {
    shell: true,
    stdio: "inherit",
    cwd: process.cwd(),
  });

  if (resultado.status !== 0) {
    console.error(`\n[RENDER] ❌ El render falló con código de salida ${resultado.status}.`);
    process.exit(resultado.status ?? 1);
  }

  console.log(`\n[RENDER] ✅ Video generado con éxito: ${rutaRelativa}`);

  // 4. Enviar a H:\Mi unidad\ShortsMotionGraphics
  copiarADestino(rutaSalida, nombreArchivo);
}

main();
