import argparse
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import warnings
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


def _ensure_venv_python() -> None:
    """Re-ejecuta el script automáticamente en el entorno virtual con GPU/TTS si el Python actual no tiene torch."""
    if os.environ.get("AUTOPNGTUBER_VENV_ACTIVE") == "1":
        return
    try:
        import chatterbox  # noqa: F401
        import faster_whisper  # noqa: F401
        import mutagen  # noqa: F401
        import torch  # noqa: F401
        return
    except ImportError:
        pass

    candidates = [
        ROOT_DIR / ".venv" / "Scripts" / "python.exe",
        ROOT_DIR.parent / "AIO" / "KidsAnimationStudio" / "voice-lab" / ".venv" / "Scripts" / "python.exe",
        ROOT_DIR.parent / ".venv" / "Scripts" / "python.exe",
    ]
    for candidate in candidates:
        if candidate.exists() and candidate.resolve() != Path(sys.executable).resolve():
            env = os.environ.copy()
            env["AUTOPNGTUBER_VENV_ACTIVE"] = "1"
            res = subprocess.run([str(candidate), *sys.argv], env=env)
            sys.exit(res.returncode)


_ensure_venv_python()

os.environ.setdefault("TQDM_DISABLE", "1")
os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")
warnings.filterwarnings("ignore")

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    import truststore
    truststore.inject_into_ssl()
except Exception:
    pass

import numpy as np
import soundfile as sf
import torch
from faster_whisper import WhisperModel
from mutagen.mp3 import MP3

GUION_PATH = ROOT_DIR / "src" / "data" / "guion.json"
AUDIOS_DIR = ROOT_DIR / "public" / "audios"
VOICES_DIR = ROOT_DIR / "public" / "voices"
CACHE_PATH = AUDIOS_DIR / ".tts_cache.json"

DEFAULT_VOICE_CONDS = "alex.conds.pt"
PAUSE_SECONDS = 0.25
EXAGGERATION = 0.55
TEMPERATURE = 0.75
WHISPER_MODEL_SIZE = "base"

PUNCT_STRIP = "¿?¡!.,;:()\"'«»—–-[]{}"


def resolver_archivo_condiciones(nombre_conds: str = DEFAULT_VOICE_CONDS) -> Path:
    """Busca el archivo .conds.pt (alex.conds.pt o voice.conds.pt) en public/voices o raíz."""
    candidatos = [
        VOICES_DIR / nombre_conds,
        VOICES_DIR / "alex.conds.pt",
        VOICES_DIR / "voice.conds.pt",
        ROOT_DIR / nombre_conds,
        ROOT_DIR / "alex.conds.pt",
        ROOT_DIR / "voice.conds.pt",
    ]
    for ruta in candidatos:
        if ruta.exists():
            return ruta.resolve()
    raise FileNotFoundError(
        f"No se encontró el archivo de condiciones de voz ({nombre_conds}) en {VOICES_DIR}"
    )


def calcular_hash_escena(texto: str, conds_path: Path) -> str:
    """Calcula el hash SHA-256 determinista del texto normalizado y el archivo de condiciones."""
    normalizado = re.sub(r"\s+", " ", texto.strip())
    payload = f"{conds_path.name}::{normalizado}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def cargar_cache() -> dict:
    if CACHE_PATH.exists():
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def guardar_cache(cache: dict) -> None:
    AUDIOS_DIR.mkdir(parents=True, exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def limpiar_texto_narracion(texto: str) -> str:
    if not texto:
        return ""
    texto = re.sub(r"[*_#`~]", "", texto)
    texto = re.sub(r"\[.*?\]|\(.*?\)", "", texto)
    texto = re.sub(r"\.{2,}|…", ". ", texto)
    texto = re.sub(r"[—–-]{2,}", ", ", texto)
    return re.sub(r"\s+", " ", texto).strip()


def dividir_en_fragmentos(texto: str, max_chars: int = 180) -> list[str]:
    limpio = limpiar_texto_narracion(texto)
    if not limpio:
        return []
    if len(limpio) <= max_chars:
        return [limpio]

    oraciones = re.split(r"(?<=[.!?])\s+", limpio)
    fragmentos = []
    actual = ""
    for oracion in oraciones:
        oracion = oracion.strip()
        if not oracion:
            continue
        if not actual:
            actual = oracion
        elif len(actual) + 1 + len(oracion) <= max_chars:
            actual = f"{actual} {oracion}"
        else:
            fragmentos.append(actual)
            actual = oracion
    if actual:
        fragmentos.append(actual)
    return fragmentos if fragmentos else [limpio]


class LocalClonedTTS:
    """Motor TTS local con carga de condiciones vocales (.conds.pt) en GPU/CPU."""

    def __init__(self, conds_path: Path, exaggeration: float = EXAGGERATION) -> None:
        self.conds_path = conds_path
        self.exaggeration = exaggeration
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.base_conds = None

    def asegurar_modelo(self) -> None:
        if self.model is not None:
            return

        from chatterbox import ChatterboxMultilingualTTS
        from chatterbox.mtl_tts import Conditionals, T3Cond

        print(
            f"[TTS Local] Cargando modelo de clonación en {self.device.upper()} "
            f"con condiciones '{self.conds_path.name}'..."
        )
        self.model = ChatterboxMultilingualTTS.from_pretrained(device=self.device)
        loaded_conds = Conditionals.load(self.conds_path, map_location=self.device).to(self.device)

        t3_cond = loaded_conds.t3
        new_t3 = T3Cond(
            speaker_emb=t3_cond.speaker_emb,
            cond_prompt_speech_tokens=t3_cond.cond_prompt_speech_tokens,
            emotion_adv=float(self.exaggeration) * torch.ones(1, 1, 1, device=self.device),
        ).to(device=self.device)
        self.base_conds = Conditionals(new_t3, loaded_conds.gen)
        self.model.conds = self.base_conds

    def sintetizar_a_mp3(self, texto: str, destino_mp3: Path) -> None:
        self.asegurar_modelo()
        self.model.conds = self.base_conds

        sr = self.model.sr
        pausa = np.zeros(int(sr * 0.14), dtype=np.float32)
        fragmentos = dividir_en_fragmentos(texto)
        segmentos_audio = []

        for frag in fragmentos:
            wav_tensor = self.model.generate(
                text=frag,
                language_id="es",
                exaggeration=self.exaggeration,
                temperature=TEMPERATURE,
                repetition_penalty=2.0,
            )
            if isinstance(wav_tensor, torch.Tensor):
                wav_np = wav_tensor.detach().cpu().numpy().squeeze()
            else:
                wav_np = np.asarray(wav_tensor).squeeze()
            segmentos_audio.append(wav_np)
            segmentos_audio.append(pausa)

        if segmentos_audio:
            audio_completo = np.concatenate(segmentos_audio[:-1])
        else:
            audio_completo = np.zeros(int(sr * 0.5), dtype=np.float32)

        destino_mp3.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            tmp_wav = Path(tmp_file.name)

        try:
            sf.write(str(tmp_wav), audio_completo, sr)
            filtro_audio = (
                "highpass=f=80,"
                "loudnorm=I=-16:TP=-1.5:LRA=11,"
                "areverse,"
                "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-42dB,"
                "areverse"
            )
            cmd = [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(tmp_wav),
                "-af",
                filtro_audio,
                "-ar",
                "24000",
                "-ac",
                "1",
                "-codec:a",
                "libmp3lame",
                "-qscale:a",
                "2",
                str(destino_mp3),
            ]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                sf.write(str(destino_mp3), audio_completo, sr)
        finally:
            tmp_wav.unlink(missing_ok=True)

    def liberar_vram(self) -> None:
        if self.model is not None:
            del self.model
            self.model = None
        if self.base_conds is not None:
            del self.base_conds
            self.base_conds = None
        if torch.cuda.is_available():
            torch.cuda.empty_cache()


def recortar_cola_mp3(audio_path: Path, corte_segundos: float) -> None:
    """Recorta colas residuales del sintetizador después de la última palabra pronunciada."""
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False, dir=str(audio_path.parent)) as tmp_file:
        tmp_mp3 = Path(tmp_file.name)
    try:
        fade_start = max(0.0, corte_segundos - 0.08)
        cmd = [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(audio_path),
            "-t",
            f"{corte_segundos:.3f}",
            "-af",
            f"afade=t=out:st={fade_start:.3f}:d=0.08",
            "-ar",
            "24000",
            "-ac",
            "1",
            "-codec:a",
            "libmp3lame",
            "-qscale:a",
            "2",
            str(tmp_mp3),
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0 and tmp_mp3.exists() and tmp_mp3.stat().st_size > 500:
            os.replace(tmp_mp3, audio_path)
    finally:
        tmp_mp3.unlink(missing_ok=True)


class LocalWhisperAligner:
    """Extractor local de tiempos por palabra (inicioMs, finMs) con faster-whisper."""

    def __init__(self, model_size: str = WHISPER_MODEL_SIZE) -> None:
        self.model_size = model_size
        self.model: WhisperModel | None = None

    def asegurar_modelo(self) -> WhisperModel:
        if self.model is None:
            print(f"[Faster-Whisper] Cargando modelo local '{self.model_size}' (int8)...")
            self.model = WhisperModel(self.model_size, device="cpu", compute_type="int8")
        return self.model

    def extraer_palabras(self, audio_path: Path, texto_guion: str, duracion_audio_s: float) -> list[dict]:
        model = self.asegurar_modelo()
        segments, _ = model.transcribe(
            str(audio_path.resolve()),
            language="es",
            word_timestamps=True,
            vad_filter=True,
            condition_on_previous_text=False,
        )

        detectadas = []
        for seg in segments:
            if not seg.words:
                continue
            for w in seg.words:
                if (w.end - w.start) < 0.015:
                    continue
                limpia = w.word.strip().strip(PUNCT_STRIP)
                if not limpia:
                    continue
                inicio_ms = max(0, round(w.start * 1000))
                fin_ms = max(inicio_ms + 20, round(w.end * 1000))
                detectadas.append(
                    {
                        "palabra": limpia,
                        "inicioMs": inicio_ms,
                        "finMs": fin_ms,
                    }
                )

        tokens_guion = [
            t.strip(PUNCT_STRIP)
            for t in re.findall(r"\S+", texto_guion)
            if t.strip(PUNCT_STRIP)
        ]

        if detectadas and len(detectadas) > len(tokens_guion) and len(tokens_guion) > 0:
            detectadas = detectadas[: len(tokens_guion)]

        # Si el conteo de palabras coincide con el guion, preservar la ortografía exacta del guion
        if detectadas and len(detectadas) == len(tokens_guion):
            for item, token_exacto in zip(detectadas, tokens_guion):
                item["palabra"] = token_exacto
            return detectadas

        if detectadas:
            return detectadas

        # Respaldo proporcional si el audio es demasiado corto y VAD no devolvió palabras
        if not tokens_guion:
            return []
        dur_ms = max(200, round(duracion_audio_s * 1000))
        paso = dur_ms / len(tokens_guion)
        return [
            {
                "palabra": tok,
                "inicioMs": round(i * paso),
                "finMs": round((i + 1) * paso),
            }
            for i, tok in enumerate(tokens_guion)
        ]


def procesar_escena(
    escena: dict,
    tts_engine: LocalClonedTTS,
    whisper_aligner: LocalWhisperAligner,
    cache: dict,
    force: bool = False,
) -> None:
    escena_id = escena["id"]
    texto = escena["texto"]
    audio_path = AUDIOS_DIR / f"escena_{escena_id}.mp3"
    cache_key = f"escena_{escena_id}"

    hash_actual = calcular_hash_escena(texto, tts_engine.conds_path)
    entrada_cache = cache.get(cache_key, {})

    en_cache = (
        not force
        and audio_path.exists()
        and audio_path.stat().st_size > 500
        and entrada_cache.get("sha256") == hash_actual
        and bool(entrada_cache.get("palabras") or escena.get("palabras"))
    )

    if en_cache:
        mp3_info = MP3(audio_path)
        duracion_segundos = round(mp3_info.info.length + PAUSE_SECONDS, 3)
        palabras = entrada_cache.get("palabras") or escena.get("palabras", [])
        escena["duracionSegundos"] = duracion_segundos
        escena["palabras"] = palabras
        print(
            f"[Escena {escena_id}] Caché SHA-256 válido ({hash_actual[:10]}...): "
            f"{audio_path.name} ({duracion_segundos:.2f}s, {len(palabras)} palabras)"
        )
        return

    tts_engine.sintetizar_a_mp3(texto, audio_path)

    mp3_info = MP3(audio_path)
    duracion_real_mp3 = mp3_info.info.length

    palabras = whisper_aligner.extraer_palabras(audio_path, texto, duracion_real_mp3)

    # Si el sintetizador dejó una cola residual larga tras la última palabra, recortar el MP3 y re-medir con mutagen
    if palabras:
        fin_ultima_palabra_s = palabras[-1]["finMs"] / 1000.0
        if duracion_real_mp3 > fin_ultima_palabra_s + 0.35:
            recortar_cola_mp3(audio_path, fin_ultima_palabra_s + 0.18)
            mp3_info = MP3(audio_path)
            duracion_real_mp3 = mp3_info.info.length

    duracion_segundos = round(duracion_real_mp3 + PAUSE_SECONDS, 3)

    escena["duracionSegundos"] = duracion_segundos
    escena["palabras"] = palabras

    cache[cache_key] = {
        "sha256": hash_actual,
        "texto": texto,
        "voiceConds": tts_engine.conds_path.name,
        "duracionSegundos": duracion_segundos,
        "palabras": palabras,
    }

    print(
        f"[Escena {escena_id}] Audio clonado + Whisper OK: {audio_path.name} "
        f"({duracion_segundos:.2f}s, {len(palabras)} palabras, sha256={hash_actual[:10]}...)"
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generador de voz clonada local (.conds.pt) + alineación por palabra con faster-whisper."
    )
    parser.add_argument(
        "--conds",
        default=DEFAULT_VOICE_CONDS,
        help="Nombre o ruta del archivo de condiciones vocales (por defecto: alex.conds.pt)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Forzar regeneración de todos los audios ignorando el caché SHA-256",
    )
    args = parser.parse_args()

    AUDIOS_DIR.mkdir(parents=True, exist_ok=True)
    conds_path = resolver_archivo_condiciones(args.conds)

    with open(GUION_PATH, "r", encoding="utf-8") as f:
        guion = json.load(f)

    cache = cargar_cache()
    tts_engine = LocalClonedTTS(conds_path=conds_path)
    whisper_aligner = LocalWhisperAligner()

    try:
        for escena in guion:
            procesar_escena(
                escena=escena,
                tts_engine=tts_engine,
                whisper_aligner=whisper_aligner,
                cache=cache,
                force=args.force,
            )
    finally:
        tts_engine.liberar_vram()

    guardar_cache(cache)

    with open(GUION_PATH, "w", encoding="utf-8") as f:
        json.dump(guion, f, ensure_ascii=False, indent=2)

    total = sum(e["duracionSegundos"] for e in guion)
    print(f"\nGuion actualizado en {GUION_PATH} (Duración total: {total:.2f}s)")


if __name__ == "__main__":
    main()
