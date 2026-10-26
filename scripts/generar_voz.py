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
TEMPERATURE = 0.50
WHISPER_MODEL_SIZE = "base"
PIPELINE_VERSION = "v3_sentence_tailcut"

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
    """Calcula el hash SHA-256 determinista del texto normalizado, versión del pipeline y condiciones."""
    normalizado = re.sub(r"\s+", " ", texto.strip())
    payload = f"{PIPELINE_VERSION}::{conds_path.name}::{normalizado}".encode("utf-8")
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


def dividir_en_fragmentos(texto: str, max_chars: int = 135) -> list[str]:
    limpio = limpiar_texto_narracion(texto)
    if not limpio:
        return []

    # 1. Separar primero por punto, signo de interrogación o exclamación (oraciones completas)
    partes_oracion = [s.strip() for s in re.split(r"(?<=[.!?])\s+", limpio) if s.strip()]

    fragmentos = []
    for oracion in partes_oracion:
        if len(oracion) <= max_chars:
            fragmentos.append(oracion)
        else:
            # 2. Si una oración excede max_chars, separar por signos de puntuación internos (, : ;)
            clausulas = [s.strip() for s in re.split(r"(?<=[,;:])\s+", oracion) if s.strip()]
            if len(clausulas) > 1:
                actual = ""
                for c in clausulas:
                    if not actual:
                        actual = c
                    elif len(actual) + 1 + len(c) <= max_chars:
                        actual = f"{actual} {c}"
                    else:
                        fragmentos.append(actual)
                        actual = c
                if actual:
                    fragmentos.append(actual)
            else:
                # 3. Si no tiene puntuación intermedia y es muy larga, separar por palabras
                palabras = oracion.split()
                bloque = []
                for p in palabras:
                    if bloque and len(" ".join(bloque)) + 1 + len(p) > max_chars:
                        fragmentos.append(" ".join(bloque))
                        bloque = [p]
                    else:
                        bloque.append(p)
                if bloque:
                    fragmentos.append(" ".join(bloque))

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

    def sintetizar_a_mp3(self, texto: str, destino_mp3: Path, temperature: float = TEMPERATURE) -> None:
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
                temperature=temperature,
                repetition_penalty=2.0,
            )
            if isinstance(wav_tensor, torch.Tensor):
                wav_np = wav_tensor.detach().cpu().numpy().squeeze()
            else:
                wav_np = np.asarray(wav_tensor).squeeze()

            # Evitar pops y clicks en transiciones de fragmentos aplicando micro-fade
            if len(wav_np) > int(sr * 0.02):
                micro_in = min(int(sr * 0.006), len(wav_np))
                wav_np[:micro_in] *= np.linspace(0.0, 1.0, micro_in)
                micro_out = min(int(sr * 0.012), len(wav_np))
                wav_np[-micro_out:] *= np.linspace(1.0, 0.0, micro_out)

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
                "loudnorm=I=-16:TP=-1.5:LRA=11"
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
        fade_start = max(0.0, corte_segundos - 0.12)
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
            f"afade=t=out:st={fade_start:.3f}:d=0.12",
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


def limpiar_y_compactar_audio(audio_path: Path, texto_guion: str, whisper_model: WhisperModel) -> None:
    """Elimina ruidos/balbuceos previos al primer fonema real y compacta pausas internas > 0.28s a 0.15s."""
    try:
        audio, sr = sf.read(str(audio_path))
    except Exception as e:
        print(f"[Limpieza Audio] ⚠️ Error al leer {audio_path}: {e}")
        return

    if audio.ndim > 1:
        audio = audio.mean(axis=1)

    segments, _ = whisper_model.transcribe(
        str(audio_path),
        language="es",
        word_timestamps=True,
        vad_filter=True,
        condition_on_previous_text=False,
    )
    all_words = []
    for s in segments:
        if s.words:
            all_words.extend(s.words)

    if not all_words:
        return

    from difflib import SequenceMatcher

    tokens_guion = [
        t.strip(PUNCT_STRIP).lower()
        for t in re.findall(r"\S+", texto_guion)
        if t.strip(PUNCT_STRIP)
    ]

    # 1. Anti-balbuceo inicial: Encontrar dónde arranca el primer fonema válido del guion
    first_valid_start = 0.0
    for w in all_words[:6]:
        w_clean = w.word.strip(PUNCT_STRIP).lower()
        if not w_clean:
            continue
        # Comparar con los primeros 3 tokens del guion
        match = any(SequenceMatcher(None, w_clean, tok).ratio() >= 0.65 for tok in tokens_guion[:3])
        if match:
            first_valid_start = max(0.0, w.start - 0.03)
            break

    modificado = False

    # Si hay ruido/balbuceo antes del primer fonema válido (> 0.06s)
    start_sample = int(first_valid_start * sr)
    if start_sample > int(0.06 * sr) and start_sample < len(audio):
        audio = audio[start_sample:]
        time_offset = first_valid_start
        for w in all_words:
            w.start = max(0.0, w.start - time_offset)
            w.end = max(0.0, w.end - time_offset)
        fade_len = min(int(0.015 * sr), len(audio))
        audio[:fade_len] *= np.linspace(0.0, 1.0, fade_len)
        modificado = True
        print(f"[Limpieza Audio] ✂️  Ruido/balbuceo inicial eliminado ({first_valid_start:.3f}s)")

    # 2. Compactar pausas internas mayores a 0.28s a 0.15s
    cortes = []
    for i in range(len(all_words) - 1):
        w1 = all_words[i]
        w2 = all_words[i + 1]
        gap = w2.start - w1.end
        if gap > 0.28:
            t_keep_w1 = w1.end + 0.05
            t_keep_w2 = w2.start - 0.05
            if t_keep_w2 > t_keep_w1:
                s_from = int(t_keep_w1 * sr)
                s_to = int(t_keep_w2 * sr)
                if s_to < len(audio):
                    cortes.append((s_from, s_to, gap))

    if cortes:
        pedazos = []
        last_idx = 0
        xfade_len = int(0.010 * sr)
        for s_from, s_to, gap in cortes:
            if s_from > last_idx:
                chunk = audio[last_idx:s_from].copy()
                if len(chunk) > xfade_len:
                    chunk[-xfade_len:] *= np.linspace(1.0, 0.0, xfade_len)
                pedazos.append(chunk)
            last_idx = s_to
            if last_idx < len(audio):
                fade_in_len = min(xfade_len, len(audio) - last_idx)
                audio[last_idx : last_idx + fade_in_len] *= np.linspace(0.0, 1.0, fade_in_len)
        if last_idx < len(audio):
            pedazos.append(audio[last_idx:])

        if pedazos:
            audio = np.concatenate(pedazos)
            modificado = True
            print(f"[Limpieza Audio] ⚡ {len(cortes)} pausa(s) compactada(s) a 0.15s")

    # 3. Eliminar colas residuales, respiraciones o ruidos extraños después de la última palabra
    if all_words:
        total_recortado = sum(s_to - s_from for s_from, s_to, _ in cortes) if cortes else 0
        fin_ultima_palabra = int(all_words[-1].end * sr) - total_recortado
        limite_muestras = fin_ultima_palabra + int(0.16 * sr)
        if 0 < limite_muestras < len(audio) - int(0.08 * sr):
            cola_recortada_s = (len(audio) - limite_muestras) / sr
            audio = audio[:limite_muestras]
            fade_tail = min(int(0.040 * sr), len(audio))
            audio[-fade_tail:] *= np.linspace(1.0, 0.0, fade_tail)
            modificado = True
            print(f"[Limpieza Audio] ✂️  Cola residual eliminada ({cola_recortada_s:.3f}s de ruido/silencio final)")

    if modificado:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            tmp_wav = Path(tmp_file.name)
        try:
            sf.write(str(tmp_wav), audio, sr)
            cmd = [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(tmp_wav),
                "-ar",
                "24000",
                "-ac",
                "1",
                "-codec:a",
                "libmp3lame",
                "-qscale:a",
                "2",
                str(audio_path),
            ]
            subprocess.run(cmd, capture_output=True, text=True)
        finally:
            tmp_wav.unlink(missing_ok=True)


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

        from difflib import SequenceMatcher

        # Intentar fusionar subtokens contiguos que formen una sola palabra del guion (ej: "del" + "fin" -> "delfín")
        limpias = [
            {"palabra": d["palabra"].strip(PUNCT_STRIP).lower(), "inicioMs": d["inicioMs"], "finMs": d["finMs"]}
            for d in detectadas
            if d["palabra"].strip(PUNCT_STRIP)
        ]

        if not tokens_guion:
            return []
        if not limpias:
            dur_ms = max(200, round(duracion_audio_s * 1000))
            paso = dur_ms / len(tokens_guion)
            return [
                {"palabra": tok, "inicioMs": round(i * paso), "finMs": round((i + 1) * paso)}
                for i, tok in enumerate(tokens_guion)
            ]

        i_det = 0
        i_gui = 0
        fusionadas = []

        while i_det < len(limpias) and i_gui < len(tokens_guion):
            gui_w = tokens_guion[i_gui].lower().strip(PUNCT_STRIP)
            det_w = limpias[i_det]["palabra"]

            if SequenceMatcher(None, gui_w, det_w).ratio() >= 0.70:
                fusionadas.append({
                    "palabra": tokens_guion[i_gui],
                    "inicioMs": limpias[i_det]["inicioMs"],
                    "finMs": limpias[i_det]["finMs"],
                })
                i_det += 1
                i_gui += 1
                continue

            if i_det + 1 < len(limpias):
                combo = det_w + limpias[i_det + 1]["palabra"]
                if SequenceMatcher(None, gui_w, combo).ratio() >= 0.65:
                    fusionadas.append({
                        "palabra": tokens_guion[i_gui],
                        "inicioMs": limpias[i_det]["inicioMs"],
                        "finMs": limpias[i_det + 1]["finMs"],
                    })
                    i_det += 2
                    i_gui += 1
                    continue

            fusionadas.append({
                "palabra": tokens_guion[i_gui],
                "inicioMs": limpias[i_det]["inicioMs"],
                "finMs": limpias[i_det]["finMs"],
            })
            i_det += 1
            i_gui += 1

        if len(fusionadas) < len(tokens_guion):
            last_end = fusionadas[-1]["finMs"] if fusionadas else 0
            total_ms = round(duracion_audio_s * 1000)
            rem_count = len(tokens_guion) - len(fusionadas)
            step = max(80, (total_ms - last_end) / rem_count)
            for idx in range(len(fusionadas), len(tokens_guion)):
                rel_i = idx - len(fusionadas)
                fusionadas.append({
                    "palabra": tokens_guion[idx],
                    "inicioMs": round(last_end + rel_i * step),
                    "finMs": round(min(total_ms, last_end + (rel_i + 1) * step)),
                })

        return fusionadas


def validar_palabras(palabras: list[dict], texto_guion: str, escena_id) -> list[dict]:
    """Garantiza que las palabras coincidan con el guion y que inicioMs sea creciente."""
    tokens = [t.strip(PUNCT_STRIP) for t in re.findall(r"\S+", texto_guion) if t.strip(PUNCT_STRIP)]
    nombres = [p["palabra"].strip(PUNCT_STRIP) for p in palabras]
    if nombres != tokens:
        print(f"[Escena {escena_id}] ⚠️ Las palabras alineadas no coinciden con el texto del guion.")
        print(f"    guion:    {' '.join(tokens)}")
        print(f"    alineado: {' '.join(nombres)}")

    previo = 0
    for p in palabras:
        if p["inicioMs"] < previo:
            print(f"[Escena {escena_id}] ⚠️ Tiempo desordenado en '{p['palabra']}' ({p['inicioMs']}ms < {previo}ms); corregido.")
            p["inicioMs"] = previo
        if p["finMs"] <= p["inicioMs"]:
            p["finMs"] = p["inicioMs"] + 20
        previo = p["inicioMs"]
    return palabras


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

    tokens_guion = [
        t.strip(PUNCT_STRIP)
        for t in re.findall(r"\S+", texto)
        if t.strip(PUNCT_STRIP)
    ]

    max_intentos = 4
    for intento in range(max_intentos):
        temp_intento = round(TEMPERATURE + (intento * 0.03), 2)
        tts_engine.sintetizar_a_mp3(texto, audio_path, temperature=temp_intento)

        # Posprocesamiento de audio: eliminar balbuceos iniciales, compactar pausas y recortar colas residuales
        limpiar_y_compactar_audio(audio_path, texto, whisper_aligner.asegurar_modelo())

        mp3_info = MP3(audio_path)
        duracion_real_mp3 = mp3_info.info.length

        palabras = whisper_aligner.extraer_palabras(audio_path, texto, duracion_real_mp3)

        # Si faltan palabras clave respecto al guion y quedan intentos, reintentar síntesis
        if palabras and tokens_guion and intento < max_intentos - 1:
            from difflib import SequenceMatcher
            last_token = tokens_guion[-1].lower()
            last_spoken = palabras[-1]["palabra"].lower()
            last_sim = SequenceMatcher(None, last_token, last_spoken).ratio()

            texto_spoken = " ".join(p["palabra"].lower() for p in palabras)
            texto_expected = " ".join(tokens_guion).lower()
            overall_sim = SequenceMatcher(None, texto_expected, texto_spoken).ratio()

            if len(palabras) < int(len(tokens_guion) * 0.85) or last_sim < 0.55 or overall_sim < 0.72:
                print(
                    f"[Escena {escena_id}] ⚠️ Audio imperfecto o pronunciación imprecisa "
                    f"(similitud={overall_sim:.2f}, {len(palabras)}/{len(tokens_guion)} palabras, "
                    f"última detectada='{last_spoken}' vs esperada='{last_token}'). "
                    f"Reintentando síntesis (intento {intento + 2}/{max_intentos}, temp={temp_intento})..."
                )
                continue

        break

    palabras = validar_palabras(palabras, texto, escena_id)
    duracion_segundos = round(duracion_real_mp3 + PAUSE_SECONDS, 3)

    escena["duracionSegundos"] = duracion_segundos
    escena["palabras"] = palabras

    cache[cache_key] = {
        "sha256": hash_actual,
        "pipelineVersion": PIPELINE_VERSION,
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
        guion_raw = json.load(f)

    is_wrapped = isinstance(guion_raw, dict) and "escenas" in guion_raw
    escenas = guion_raw["escenas"] if is_wrapped else guion_raw

    cache = cargar_cache()
    tts_engine = LocalClonedTTS(conds_path=conds_path)
    whisper_aligner = LocalWhisperAligner()

    try:
        for escena in escenas:
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
        json.dump(guion_raw, f, ensure_ascii=False, indent=2)

    total = sum(e.get("duracionSegundos", 0) for e in escenas)
    print(f"\nGuion actualizado en {GUION_PATH} (Duración total: {total:.2f}s)")

    try:
        from scripts.registrar_historia import rango_duracion
    except ImportError:
        from registrar_historia import rango_duracion
    minimo, maximo = rango_duracion(guion_raw)
    if total < minimo:
        print(
            f"\n[ALERTA MONETIZACIÓN] ⚠️ Duración total ({total:.2f}s) menor al mínimo del objetivo ({minimo:.0f}s). "
            f"Agrega escenas de desarrollo al guion antes de renderizar."
        )
    elif total > maximo:
        print(
            f"\n[ALERTA MONETIZACIÓN] ⚠️ Duración total ({total:.2f}s) excede el máximo del objetivo ({maximo:.0f}s). "
            f"Reduce o compacta escenas antes de renderizar."
        )
    else:
        print(f"\n[DURACIÓN OK] ✅ Duración total ({total:.2f}s) dentro del objetivo [{minimo:.0f}-{maximo:.0f}s].")
    try:
        try:
            from scripts.registrar_historia import registrar_historia
        except ImportError:
            from registrar_historia import registrar_historia
        registrar_historia(guion_raw)
    except Exception as reg_err:
        print(f"[HISTORIAL] ⚠️ Error al registrar en historial: {reg_err}", file=sys.stderr)


if __name__ == "__main__":
    main()
