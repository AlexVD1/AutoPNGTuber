const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { exportarArchivoMetadata, DESTINO_DIR } = require("./exportar_metadata");

const OUT_DIR = path.resolve(__dirname, "../out");
const GUION_PATH = path.resolve(__dirname, "../src/data/guion.json");
const MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 horas
const PURGA_EXTS = new Set([".mp4", ".mov", ".webm", ".mkv", ".avi", ".json"]);

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
      const guionRaw = JSON.parse(fs.readFileSync(GUION_PATH, "utf-8"));
      const meta = Array.isArray(guionRaw) ? null : guionRaw?.meta;
      if (meta && (meta.slug || meta.id)) {
        return limpiarSlug(meta.slug || meta.id);
      }
      const escenas = Array.isArray(guionRaw) ? guionRaw : (guionRaw?.escenas || []);
      if (Array.isArray(escenas) && escenas.length > 0) {
        // Prioridad 1: tituloVisual de la primera escena que lo tenga
        const escenaConTitulo = escenas.find((e) => e && e.tituloVisual && e.tituloVisual.trim());
        if (escenaConTitulo) {
          return limpiarSlug(escenaConTitulo.tituloVisual);
        }

        // Prioridad 2: Primeras palabras del texto de la primera escena
        if (escenas[0] && escenas[0].texto) {
          return limpiarSlug(escenas[0].texto, 6);
        }
      }
    } catch (err) {
      console.warn(`[RENDER] ⚠️  No se pudo leer ${GUION_PATH}: ${err.message}`);
    }
  }

  return "short";
}

/**
 * Ejecuta python scripts/generar_voz.py si se detecta desfase en los audios.
 */
function ejecutarTTS() {
  console.log("\n[AUDIO] 🎙️  Ejecutando scripts/generar_voz.py para sincronizar audios con el guion activo...");
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  const scriptPath = path.resolve(__dirname, "generar_voz.py");
  const res = spawnSync(pythonCmd, [process.platform === "win32" ? `"${scriptPath}"` : scriptPath], {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
    shell: true,
  });
  if (res.status !== 0) {
    console.error(`\n[AUDIO] ❌ Error al generar la voz (código ${res.status}). Abortando render.`);
    process.exit(res.status ?? 1);
  }
  console.log("[AUDIO] ✅ Audios sintetizados, alineados y verificados con éxito.\n");
}

/**
 * Verifica si los archivos de audio en /public/audios corresponden al guion actual.
 * Compara los textos de cada escena con la entrada correspondiente en .tts_cache.json.
 */
function verificarCoherenciaAudios() {
  const cachePath = path.resolve(__dirname, "../public/audios/.tts_cache.json");
  if (!fs.existsSync(GUION_PATH)) return;

  let guion;
  try {
    guion = JSON.parse(fs.readFileSync(GUION_PATH, "utf8"));
  } catch (e) {
    return;
  }

  const escenas = Array.isArray(guion) ? guion : guion.escenas || [];
  if (!escenas || escenas.length === 0) return;

  if (!fs.existsSync(cachePath)) {
    console.warn("\n[AUDIO] ⚠️  No existe .tts_cache.json. Ejecutando generar_voz.py...");
    ejecutarTTS();
    return;
  }

  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
  } catch (e) {
    console.warn("\n[AUDIO] ⚠️  No se pudo leer .tts_cache.json. Ejecutando generar_voz.py...");
    ejecutarTTS();
    return;
  }

  for (const esc of escenas) {
    const mp3Path = path.resolve(__dirname, `../public/audios/escena_${esc.id}.mp3`);
    if (!fs.existsSync(mp3Path)) {
      console.warn(`\n[AUDIO] ⚠️  Falta escena_${esc.id}.mp3. Regenerando audios...`);
      ejecutarTTS();
      return;
    }
    const cacheEntry = cache[`escena_${esc.id}`];
    if (!cacheEntry || !cacheEntry.texto) {
      console.warn(`\n[AUDIO] ⚠️  No hay registro de texto en caché para escena_${esc.id}. Regenerando audios...`);
      ejecutarTTS();
      return;
    }

    const REQUIRED_PIPELINE = "v4_nw_precision_align";
    if (cacheEntry.pipelineVersion !== REQUIRED_PIPELINE) {
      console.warn(`\n[AUDIO] ⚠️  Audio de escena_${esc.id} fue procesado con pipeline antiguo (${cacheEntry.pipelineVersion || "legacy"}).`);
      console.warn(`        Regenerando automáticamente con pipeline moderno (${REQUIRED_PIPELINE})...`);
      ejecutarTTS();
      return;
    }

    const normGuion = (esc.texto || "").replace(/\s+/g, " ").trim();
    const normCache = (cacheEntry.texto || "").replace(/\s+/g, " ").trim();
    if (normGuion !== normCache) {
      console.warn(`\n[AUDIO] 🚨 DESAJUSTE DETECTADO en Escena ${esc.id}:`);
      console.warn(`        Guion actual: "${normGuion.substring(0, 60)}..."`);
      console.warn(`        Audio en disco: "${normCache.substring(0, 60)}..."`);
      console.warn(`        Regenerando audios automáticamente para garantizar sincronía total...`);
      ejecutarTTS();
      return;
    }
  }

  console.log("[AUDIO] ✅ Todos los audios en /public/audios coinciden exactamente con el guion activo.");
}

/**
 * Elimina videos y archivos .json con más de 48 horas de antigüedad únicamente en la carpeta /out.
 */
function limpiarVideosAntiguos() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    return;
  }

  console.log("\n[LIMPIEZA] 🔍 Revisando carpeta /out (archivos > 48h)...");
  const ahora = Date.now();
  let eliminados = 0;

  try {
    const archivos = fs.readdirSync(OUT_DIR);
    for (const archivo of archivos) {
      const ext = path.extname(archivo).toLowerCase();
      if (!PURGA_EXTS.has(ext)) continue;

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
    console.log("[LIMPIEZA] ✨ Carpeta /out al día (sin archivos > 48h).");
  }
}

/**
 * Copia el video generado a la unidad de destino si está disponible.
 */
function copiarADestino(rutaOrigen, nombreArchivo) {
  if (!DESTINO_DIR) return console.warn("\n[COPIA] ℹ️  DESTINO_DIR no definido en .env; sin copia a Drive.");
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
 * Ejecuta un script de chequeo (validar_guion.js / qa_video.js); aborta el render si falla.
 */
function ejecutarChequeo(script, args, mensajeFallo) {
  const res = spawnSync(process.execPath, [path.resolve(__dirname, script), ...args], { stdio: "inherit" });
  if (res.status !== 0) {
    console.error(`\n[RENDER] ❌ ${mensajeFallo}`);
    process.exit(res.status ?? 1);
  }
}
/**
 * Flujo principal de renderizado.
 */
function main() {
  const args = process.argv.slice(2);
  let customName = null;
  let customTitle = null;
  let composition = "ShortSabiasQue";
  let port = "3002";
  let cleanOnly = false;
  let metadataOnly = false;
  let sinQa = false;
  const remotionFlags = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--clean-only" || arg === "--limpiar") {
      cleanOnly = true;
    } else if (arg === "--metadata-only" || arg === "--metadata") {
      metadataOnly = true;
    } else if (arg === "--sin-qa") {
      sinQa = true;
    } else if (arg === "--name" && args[i + 1]) {
      customName = args[++i];
    } else if (arg.startsWith("--name=")) {
      customName = arg.split("=")[1];
    } else if (arg === "--title" && args[i + 1]) {
      customTitle = args[++i];
    } else if (arg.startsWith("--title=")) {
      customTitle = arg.split("=")[1];
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

  if (metadataOnly) {
    console.log(`\n[METADATA] 📋 Modo solo metadata activado para "${slug}"...`);
    exportarArchivoMetadata({
      slug,
      customName,
      title: customTitle,
      outDir: OUT_DIR,
      destinoDir: DESTINO_DIR,
    });
    return;
  }

  // 2.5 Verificar coherencia estricta entre guion activo y audios en disco
  verificarCoherenciaAudios();

  // 2.6 Validar el guion (esquema, catálogos, tiempos); falla antes de gastar minutos renderizando
  ejecutarChequeo("validar_guion.js", [], "El guion no es válido (ver errores arriba).");

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

    // 3.5 QA del MP4 (duración, resolución, loudness, silencios, tamaño)
  if (!sinQa) ejecutarChequeo("qa_video.js", [rutaSalida], "El video no cumple el QA (usa --sin-qa para omitirlo).");

  console.log(`\n[RENDER] ✅ Video generado con éxito: ${rutaRelativa}`);

  // 4. Enviar a H:\Mi unidad\ShortsMotionGraphics
  copiarADestino(rutaSalida, nombreArchivo);

  // 5. Exportar y copiar archivo de metadata para publicación
  try {
    exportarArchivoMetadata({
      slug,
      customName,
      title: customTitle,
      outDir: OUT_DIR,
      destinoDir: DESTINO_DIR,
    });
  } catch (err) {
    console.warn(`\n[METADATA] ⚠️  No se pudo exportar metadata: ${err.message}`);
  }
}

main();
