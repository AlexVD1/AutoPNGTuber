const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT_DIR = path.resolve(__dirname, "..");
const GUION_PATH = path.resolve(ROOT_DIR, "src/data/guion.json");
const OUT_DIR = path.resolve(ROOT_DIR, "out");
const DESTINO_DIR = "H:\\Mi unidad\\ShortsMotionGraphics";
const TTS_CACHE_PATH = path.resolve(ROOT_DIR, "public/audios/.tts_cache.json");
const VOICE_CAST_PATH = path.resolve(ROOT_DIR, "public/voices/voice_cast.json");
const BGM_PATH = path.resolve(ROOT_DIR, "public/sfx/bgm.mp3");

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
  const titulo = obtenerTituloLegible(guion, opciones.customName, opciones.title);

  const escenas = Array.isArray(guion) ? guion : (guion?.escenas || []);

  // Descripción completa reuniendo la narración de todas las escenas
  const descripcion = escenas
    .map((e) => (e && e.texto ? e.texto.trim() : ""))
    .filter(Boolean)
    .join(" ");

  const todasLasPalabrasClave = escenas.flatMap((e) =>
    Array.isArray(e.palabrasClave) ? e.palabrasClave : []
  );

  const genero = opciones.genre || detectarGenero(descripcion, todasLasPalabrasClave);
  const hashtags = generarHashtags(genero, escenas);

  // Duración total exacta sumada de las escenas
  const totalSegundos = escenas.reduce(
    (acc, e) => acc + (typeof e.duracionSegundos === "number" ? e.duracionSegundos : 4),
    0
  );
  const duracionSegundos = Number(totalSegundos.toFixed(2));

  const hasMusic = fs.existsSync(BGM_PATH);
  const ttsVoice = resolverTtsVoice();

  return {
    storyId: crypto.randomUUID(),
    title: titulo,
    description: descripcion,
    hashtags: hashtags,
    genre: genero,
    category: opciones.category || "Entertainment",
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
    has_music: hasMusic,
    tts_voice: ttsVoice,
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
};
