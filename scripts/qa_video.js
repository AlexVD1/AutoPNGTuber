/**
 * QA post-render con ffprobe/ffmpeg.
 * Uso: npm run qa [-- ruta/video.mp4]   (por defecto: out/<slug del guion>.mp4)
 * Sale con código 1 si algún chequeo falla.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { obtenerSlug } = require("./exportar_metadata");

const ROOT = path.resolve(__dirname, "..");
const GUION_PATH = path.join(ROOT, "src/data/guion.json");

const LUFS_OBJETIVO = -14;
const LUFS_TOLERANCIA = 3;
const SILENCIO_MAX_S = 1;
const MB_MAX = 100;

function ejecutar(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw new Error(`No se pudo ejecutar ${cmd}: ${r.error.message} (¿está instalado y en PATH?)`);
  return r;
}

function rangoDuracion(guion) {
  const objetivo = Array.isArray(guion) ? null : guion?.meta?.duracionObjetivo;
  return Array.isArray(objetivo) && objetivo.length === 2 ? objetivo : [62, 110];
}

function qaVideo(rutaVideo, guion) {
  const fallos = [];
  if (!fs.existsSync(rutaVideo)) return [`No existe el video ${rutaVideo}`];

  const probe = JSON.parse(
    ejecutar("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration,size", "-of", "json", rutaVideo]).stdout
  );
  const { width, height, r_frame_rate } = probe.streams[0];
  const [num, den] = r_frame_rate.split("/").map(Number);
  const fps = num / (den || 1);
  const duracion = parseFloat(probe.format.duration);
  const mb = parseInt(probe.format.size, 10) / (1024 * 1024);

  const [min, max] = rangoDuracion(guion);
  if (duracion < min || duracion > max) fallos.push(`Duración ${duracion.toFixed(1)} s fuera del objetivo ${min}-${max} s`);
  if (width !== 1080 || height !== 1920) fallos.push(`Resolución ${width}x${height} (se esperaba 1080x1920)`);
  if (Math.abs(fps - 30) > 0.01) fallos.push(`FPS ${fps.toFixed(2)} (se esperaba 30)`);
  if (mb > MB_MAX) fallos.push(`Tamaño ${mb.toFixed(1)} MB excede ${MB_MAX} MB (baja el CRF)`);

  // Loudness integrado (EBU R128) y silencios largos en una sola pasada
  const af = `loudnorm=I=${LUFS_OBJETIVO}:print_format=json,silencedetect=n=-45dB:d=${SILENCIO_MAX_S}`;
  const log = ejecutar("ffmpeg", ["-hide_banner", "-nostats", "-i", rutaVideo, "-vn", "-af", af, "-f", "null", "-"]).stderr;

  const json = log.match(/\{[^{}]*"input_i"[^{}]*\}/);
  if (!json) fallos.push("No se pudo medir el loudness (¿el video no tiene audio?)");
  else {
    const lufs = parseFloat(JSON.parse(json[0]).input_i);
    if (Math.abs(lufs - LUFS_OBJETIVO) > LUFS_TOLERANCIA) fallos.push(`Loudness ${lufs.toFixed(1)} LUFS (objetivo ${LUFS_OBJETIVO} ±${LUFS_TOLERANCIA})`);
  }

  // Silencios > 1 s (ignorando el cierre del video)
  const silencios = [...log.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_duration: ([\d.]+)/g)]
    .map((m) => ({ inicio: parseFloat(m[1]), dur: parseFloat(m[2]) }))
    .filter((s) => s.inicio + s.dur < duracion - 0.5);
  for (const s of silencios) fallos.push(`Silencio de ${s.dur.toFixed(1)} s en ${s.inicio.toFixed(1)} s`);

  console.log(`[QA] ${path.basename(rutaVideo)}: ${duracion.toFixed(1)} s · ${width}x${height} · ${fps.toFixed(0)} fps · ${mb.toFixed(1)} MB`);
  return fallos;
}

function main() {
  const guion = fs.existsSync(GUION_PATH) ? JSON.parse(fs.readFileSync(GUION_PATH, "utf-8")) : [];
  const arg = process.argv[2];
  const ruta = arg ? path.resolve(arg) : path.join(ROOT, "out", `${obtenerSlug(guion)}.mp4`);
  const fallos = qaVideo(ruta, guion);
  if (fallos.length) {
    fallos.forEach((f) => console.error(`[QA] ❌ ${f}`));
    process.exit(1);
  }
  console.log("[QA] ✅ El video cumple todos los chequeos.");
}

if (require.main === module) main();

module.exports = { qaVideo };
