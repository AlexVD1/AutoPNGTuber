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

try:
    from scripts.normalizador_numeros import normalizar_texto_para_tts
except ImportError:
    from normalizador_numeros import normalizar_texto_para_tts

GUION_PATH = ROOT_DIR / "src" / "data" / "guion.json"
AUDIOS_DIR = ROOT_DIR / "public" / "audios"
VOICES_DIR = ROOT_DIR / "public" / "voices"
CACHE_PATH = AUDIOS_DIR / ".tts_cache.json"

DEFAULT_VOICE_CONDS = "alex.conds.pt"
PAUSE_SECONDS = 0.25
EXAGGERATION = 0.55
TEMPERATURE = 0.50
WHISPER_MODEL_SIZE = "base"
PIPELINE_VERSION = "v4_nw_precision_align"

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


def calcular_hash_escena(texto: str, conds_path: Path, silencio_extra: float = 0.0) -> str:
    """Calcula el hash SHA-256 determinista del texto normalizado, versión del pipeline y condiciones."""
    normalizado = re.sub(r"\s+", " ", texto.strip())
    payload = f"{PIPELINE_VERSION}::{conds_path.name}::{normalizado}::{silencio_extra:.2f}".encode("utf-8")
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
    texto = re.sub(r"\.{2,}|…", ", ", texto)
    texto = re.sub(r"[—–-]{2,}", ", ", texto)
    return re.sub(r"\s+", " ", texto).strip()


FONETIZACIONES_TTS = [
    # Anglicismos o préstamos que inician con 'h' aspirada y en español deben sonar con /j/ (evita h muda en TTS)
    (r"\b[hH]ackear(lo|la|los|las|me|te|se|nos)?\b", lambda m: ("Jaquear" if m.group(0)[0].isupper() else "jaquear") + (m.group(1) or "")),
    (r"\b[hH]ackea([nsr])?\b", lambda m: ("Jaquea" if m.group(0)[0].isupper() else "jaquea") + (m.group(1) or "")),
    (r"\b[hH]acke(é|ó|an|en|aron|aste|amos)\b", lambda m: ("Jaque" if m.group(0)[0].isupper() else "jaque") + m.group(1)),
    (r"\b[hH]ackeando\b", lambda m: "Jaqueando" if m.group(0)[0].isupper() else "jaqueando"),
    (r"\b[hH]ackeo(s)?\b", lambda m: ("Jaqueo" if m.group(0)[0].isupper() else "jaqueo") + (m.group(1) or "")),
    (r"\b[hH]acks?\b", lambda m: ("Jaks" if m.group(0).lower().endswith("s") else "Jak") if m.group(0)[0].isupper() else ("jaks" if m.group(0).lower().endswith("s") else "jak")),
    (r"\b[hH]acker(s)?\b", lambda m: ("Jáquer" if m.group(0)[0].isupper() else "jáquer") + (m.group(1) or "")),
    (r"\b[hH]obby\b", lambda m: "Jobi" if m.group(0)[0].isupper() else "jobi"),
    (r"\b[hH]obbies\b", lambda m: "Jobis" if m.group(0)[0].isupper() else "jobis"),
]


def fonetizar_para_tts(texto: str) -> str:
    """Ajusta palabras extranjeras con dicción no fonética en español para que el sintetizador neural las pronuncie correctamente."""
    t = texto
    for patron, reemplazo in FONETIZACIONES_TTS:
        t = re.sub(patron, reemplazo, t)
    return t


def dividir_en_fragmentos(texto: str, max_chars: int = 125) -> list[str]:
    limpio = limpiar_texto_narracion(texto)
    if not limpio:
        return []

    # 1. Separar primero por punto, signo de interrogación o exclamación (oraciones completas)
    partes_oracion = [s.strip() for s in re.split(r"(?<=[.!?])\s+", limpio) if s.strip()]

    # 2. Fusionar oraciones diminutas (<= 3 palabras o <= 18 caracteres, ej. 'Tampoco.', 'Nunca lo llevó.')
    # con la oración anterior si caben juntas dentro de max_chars, evitando fragmentos aislados de 1 palabra
    # que provocan tropiezos o alucinaciones en modelos autoregresivos como Chatterbox.
    oraciones_fusionadas = []
    for o in partes_oracion:
        palabras = o.split()
        if oraciones_fusionadas and (len(palabras) <= 3 or len(o) <= 18):
            if len(oraciones_fusionadas[-1]) + 1 + len(o) <= max_chars:
                oraciones_fusionadas[-1] = f"{oraciones_fusionadas[-1]} {o}"
                continue
        oraciones_fusionadas.append(o)

    fragmentos = []
    for oracion in oraciones_fusionadas:
        if len(oracion) <= max_chars:
            fragmentos.append(oracion)
        else:
            # 3. Si una oración excede max_chars, separar por signos de puntuación internos (, : ;)
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
                # 4. Si no tiene puntuación intermedia y es muy larga, separar por palabras
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
            frag_clean = frag.strip()
            if not frag_clean:
                continue
            if frag_clean[-1] not in ".!?,:;":
                frag_clean += "."

            wav_tensor = self.model.generate(
                text=frag_clean,
                language_id="es",
                exaggeration=self.exaggeration,
                temperature=temperature,
                repetition_penalty=1.2,
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

    prompt_guion = re.sub(r"[*_#`~]", "", texto_guion).strip()
    segments, _ = whisper_model.transcribe(
        str(audio_path),
        language="es",
        word_timestamps=True,
        vad_filter=True,
        condition_on_previous_text=False,
        initial_prompt=prompt_guion,
    )
    all_words = []
    for s in segments:
        if s.words:
            all_words.extend([w for w in s.words if (w.end - w.start) >= 0.02])

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
            first_valid_start = max(0.0, w.start - 0.04)
            break

    modificado = False

    # Si hay ruido/balbuceo antes del primer fonema válido (> 0.08s)
    start_sample = int(first_valid_start * sr)
    if start_sample > int(0.08 * sr) and start_sample < len(audio):
        audio = audio[start_sample:]
        time_offset = first_valid_start
        for w in all_words:
            w.start = max(0.0, w.start - time_offset)
            w.end = max(0.0, w.end - time_offset)
        fade_len = min(int(0.015 * sr), len(audio))
        audio[:fade_len] *= np.linspace(0.0, 1.0, fade_len)
        modificado = True
        print(f"[Limpieza Audio] ✂️  Ruido/balbuceo inicial eliminado ({first_valid_start:.3f}s)")

    # 2. Compactar pausas internas mayores a 0.38s (manteniendo 0.10s de margen seguro en ambos extremos)
    cortes = []
    for i in range(len(all_words) - 1):
        w1 = all_words[i]
        w2 = all_words[i + 1]
        gap = w2.start - w1.end
        if gap > 0.38:
            t_keep_w1 = w1.end + 0.10
            t_keep_w2 = w2.start - 0.10
            if t_keep_w2 > t_keep_w1:
                s_from = int(t_keep_w1 * sr)
                s_to = int(t_keep_w2 * sr)
                if s_to < len(audio):
                    cortes.append((s_from, s_to, gap))

    if cortes:
        pedazos = []
        last_idx = 0
        xfade_len = int(0.012 * sr)
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
            print(f"[Limpieza Audio] ⚡ {len(cortes)} pausa(s) compactada(s) suavemente")

    # 3. Eliminar colas residuales, respiraciones o ruidos extraños después de la última palabra
    # Margen seguro de 0.38s para NO cortar jamás la última sílaba o resonancia natural
    # IMPORTANTE: Solo recortar si la transcripción detectó efectivamente el final del guion
    if all_words and tokens_guion:
        last_tok = tokens_guion[-1]
        last_word_clean = all_words[-1].word.strip(PUNCT_STRIP).lower()
        sim_final = SequenceMatcher(None, last_word_clean, last_tok).ratio()
        llega_al_final = (sim_final >= 0.70) and (len(all_words) >= int(len(tokens_guion) * 0.85))

        if llega_al_final:
            total_recortado = sum(s_to - s_from for s_from, s_to, _ in cortes) if cortes else 0
            fin_ultima_palabra = int(all_words[-1].end * sr) - total_recortado
            limite_muestras = fin_ultima_palabra + int(0.38 * sr)
            if 0 < limite_muestras < len(audio) - int(0.20 * sr):
                cola_recortada_s = (len(audio) - limite_muestras) / sr
                audio = audio[:limite_muestras]
                fade_tail = min(int(0.060 * sr), len(audio))
                audio[-fade_tail:] *= np.linspace(1.0, 0.0, fade_tail)
                modificado = True
                print(f"[Limpieza Audio] ✂️  Cola residual eliminada ({cola_recortada_s:.3f}s de ruido/silencio final)")
        else:
            print(f"[Limpieza Audio] 🛡️  Cola preservada intacta (la transcripción preliminar no cubrió el final: '{last_word_clean}' vs '{last_tok}')")

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


def align_words_nw(tokens_guion: list[str], detected_words: list[dict], duracion_audio_s: float) -> list[dict]:
    """
    Alinea los tokens del guion con las palabras detectadas por Whisper usando
    el algoritmo global de Needleman-Wunsch. Garantiza sincronización monótona
    sin desfases en cascada.
    """
    from difflib import SequenceMatcher

    M = len(tokens_guion)
    N = len(detected_words)

    if M == 0:
        return []
    if N == 0:
        total_ms = max(200, round(duracion_audio_s * 1000))
        total_chars = sum(len(w) for w in tokens_guion)
        res = []
        curr = 0
        for w in tokens_guion:
            dur = max(60, round((len(w) / max(1, total_chars)) * total_ms))
            res.append({"palabra": w, "inicioMs": curr, "finMs": min(total_ms, curr + dur)})
            curr += dur
        return res

    def _clean(w: str) -> str:
        s = w.strip(PUNCT_STRIP).lower()
        s = (
            s.replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
        )
        s = re.sub(r"ck|qu|k", "k", s)
        s = re.sub(r"^[hj]", "j", s)
        return s

    GAP_PENALTY = -0.8
    score = [[0.0] * (N + 1) for _ in range(M + 1)]
    ptr = [[(0, 0)] * (N + 1) for _ in range(M + 1)]

    for i in range(1, M + 1):
        score[i][0] = i * GAP_PENALTY
        ptr[i][0] = (i - 1, 0)
    for j in range(1, N + 1):
        score[0][j] = j * GAP_PENALTY
        ptr[0][j] = (0, j - 1)

    for i in range(1, M + 1):
        g_w = _clean(tokens_guion[i - 1])
        for j in range(1, N + 1):
            d_w = _clean(detected_words[j - 1]["palabra"])
            sim = SequenceMatcher(None, g_w, d_w).ratio()
            if g_w == d_w:
                sim_score = 2.0
            elif sim >= 0.70:
                sim_score = sim * 1.8
            else:
                sim_score = -1.2

            diag = score[i - 1][j - 1] + sim_score
            up = score[i - 1][j] + GAP_PENALTY
            left = score[i][j - 1] + GAP_PENALTY

            if diag >= up and diag >= left:
                score[i][j] = diag
                ptr[i][j] = (i - 1, j - 1)
            elif up >= left:
                score[i][j] = up
                ptr[i][j] = (i - 1, j)
            else:
                score[i][j] = left
                ptr[i][j] = (i, j - 1)

    i = M
    j = N
    matches = {}

    while i > 0 or j > 0:
        pi, pj = ptr[i][j]
        if pi == i - 1 and pj == j - 1:
            g_w = _clean(tokens_guion[i - 1])
            d_w = _clean(detected_words[j - 1]["palabra"])
            if SequenceMatcher(None, g_w, d_w).ratio() >= 0.55 or g_w == d_w:
                matches[i - 1] = j - 1
            i, j = pi, pj
        elif pi == i - 1 and pj == j:
            i = pi
        else:
            j = pj

    resultado = [None] * M
    total_ms = max(200, round(duracion_audio_s * 1000))

    for idx, g_tok in enumerate(tokens_guion):
        if idx in matches:
            det = detected_words[matches[idx]]
            resultado[idx] = {
                "palabra": g_tok,
                "inicioMs": det["inicioMs"],
                "finMs": det["finMs"],
            }

    # Interpolar palabras intermedias sin match
    for idx in range(M):
        if resultado[idx] is not None:
            continue

        prev_end = 0
        p = idx - 1
        while p >= 0:
            if resultado[p] is not None:
                prev_end = resultado[p]["finMs"]
                break
            p -= 1

        next_start = total_ms
        n = idx + 1
        unmatched_block_len = 1
        while n < M:
            if resultado[n] is not None:
                next_start = resultado[n]["inicioMs"]
                break
            unmatched_block_len += 1
            n += 1

        gap = max(40, next_start - prev_end)
        rel_pos = idx - (p + 1)
        step = gap / unmatched_block_len
        start_ms = round(prev_end + rel_pos * step)
        end_ms = round(min(total_ms, prev_end + (rel_pos + 1) * step))

        resultado[idx] = {
            "palabra": tokens_guion[idx],
            "inicioMs": start_ms,
            "finMs": max(start_ms + 20, end_ms),
        }

    # Garantizar monotonía estricta
    prev_ms = 0
    for item in resultado:
        if item["inicioMs"] < prev_ms:
            item["inicioMs"] = prev_ms
        if item["finMs"] <= item["inicioMs"]:
            item["finMs"] = item["inicioMs"] + 25
        prev_ms = item["inicioMs"]

    return resultado


class LocalWhisperAligner:
    """Extractor local de tiempos por palabra (inicioMs, finMs) con faster-whisper y alineación NW."""

    def __init__(self, model_size: str = WHISPER_MODEL_SIZE) -> None:
        self.model_size = model_size
        self.model: WhisperModel | None = None

    def asegurar_modelo(self) -> WhisperModel:
        if self.model is None:
            print(f"[Faster-Whisper] Cargando modelo local '{self.model_size}' (int8)...")
            self.model = WhisperModel(self.model_size, device="cpu", compute_type="int8")
        return self.model

    def extraer_palabras(
        self, audio_path: Path, texto_guion: str, duracion_audio_s: float
    ) -> tuple[list[dict], list[dict], float]:
        model = self.asegurar_modelo()
        prompt_guion = re.sub(r"[*_#`~]", "", texto_guion).strip()
        segments, _ = model.transcribe(
            str(audio_path.resolve()),
            language="es",
            word_timestamps=True,
            vad_filter=True,
            condition_on_previous_text=False,
            initial_prompt=prompt_guion,
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

        if not tokens_guion:
            return [], [], 0.0

        if not detectadas:
            total_ms = max(200, round(duracion_audio_s * 1000))
            paso = total_ms / len(tokens_guion)
            fallback = [
                {"palabra": tok, "inicioMs": round(i * paso), "finMs": round((i + 1) * paso)}
                for i, tok in enumerate(tokens_guion)
            ]
            return fallback, [], 0.0

        alineadas = align_words_nw(tokens_guion, detectadas, duracion_audio_s)

        from difflib import SequenceMatcher
        tok_str = " ".join(t.lower() for t in tokens_guion)
        det_str = " ".join(d["palabra"].lower() for d in detectadas)
        similitud = SequenceMatcher(None, tok_str, det_str).ratio()

        return alineadas, detectadas, similitud


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
    texto_original = escena["texto"]
    texto = normalizar_texto_para_tts(texto_original)
    if texto != texto_original:
        escena["texto"] = texto
        print(f"[Escena {escena_id}] 🔢 Cifras normalizadas para TTS: '{texto_original}' -> '{texto}'")

    # Fonetización para pronunciación correcta en el modelo TTS neural (ej. 'hackear' -> 'jaquear')
    texto_tts = escena.get("textoTts") or fonetizar_para_tts(texto)
    if texto_tts != texto:
        print(f"[Escena {escena_id}] 🗣️ Fonetización aplicada para dicción TTS: '{texto}' -> '{texto_tts}'")

    audio_path = AUDIOS_DIR / f"escena_{escena_id}.mp3"
    cache_key = f"escena_{escena_id}"

    silencio_extra = float(escena.get("silencioFinalSegundos", 0.0))
    hash_actual = calcular_hash_escena(texto_tts, tts_engine.conds_path, silencio_extra)
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
        tts_engine.sintetizar_a_mp3(texto_tts, audio_path, temperature=temp_intento)

        # Posprocesamiento de audio: eliminar balbuceos iniciales, compactar pausas y recortar colas residuales
        limpiar_y_compactar_audio(audio_path, texto_tts, whisper_aligner.asegurar_modelo())

        mp3_info = MP3(audio_path)
        duracion_real_mp3 = mp3_info.info.length

        palabras, detectadas, similitud = whisper_aligner.extraer_palabras(
            audio_path, texto, duracion_real_mp3
        )

        # Si faltan palabras clave respecto al guion y quedan intentos, reintentar síntesis
        if intento < max_intentos - 1 and detectadas and tokens_guion:
            from difflib import SequenceMatcher
            first_token = tokens_guion[0].lower()
            first_detected = detectadas[0]["palabra"].lower()
            first_sim = SequenceMatcher(None, first_token, first_detected).ratio()

            last_token = tokens_guion[-1].lower()
            last_detected = detectadas[-1]["palabra"].lower()
            last_sim = SequenceMatcher(None, last_token, last_detected).ratio()

            min_palabras = max(len(tokens_guion) - 2, int(len(tokens_guion) * 0.88))
            if len(detectadas) < min_palabras or first_sim < 0.65 or last_sim < 0.75 or similitud < 0.72:
                print(
                    f"[Escena {escena_id}] ⚠️ Audio imperfecto o pronunciación imprecisa "
                    f"(similitud={similitud:.2f}, {len(detectadas)}/{len(tokens_guion)} palabras detectadas, "
                    f"primera='{first_detected}' vs '{first_token}', "
                    f"última='{last_detected}' vs esperada='{last_token}'). "
                    f"Reintentando síntesis (intento {intento + 2}/{max_intentos}, temp={temp_intento})..."
                )
                continue

        break

    palabras = validar_palabras(palabras, texto, escena_id)

    silencio_extra = float(escena.get("silencioFinalSegundos", 0.0))
    if silencio_extra > 0.0:
        tmp_padded = audio_path.with_suffix(".padded.mp3")
        cmd_pad = [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(audio_path),
            "-af",
            f"apad=pad_dur={silencio_extra:.2f}",
            str(tmp_padded),
        ]
        res_pad = subprocess.run(cmd_pad, capture_output=True, text=True)
        if res_pad.returncode == 0 and tmp_padded.exists():
            tmp_padded.replace(audio_path)
            mp3_info = MP3(audio_path)
            duracion_real_mp3 = mp3_info.info.length
            print(f"[Escena {escena_id}] 🤫 Pausa dramática en silencio añadida al final (+{silencio_extra:.2f}s -> {duracion_real_mp3:.2f}s)")

    duracion_segundos = round(duracion_real_mp3 + PAUSE_SECONDS, 3)

    escena["duracionSegundos"] = duracion_segundos
    escena["palabras"] = palabras

    cache[cache_key] = {
        "sha256": hash_actual,
        "pipelineVersion": PIPELINE_VERSION,
        "texto": texto,
        "textoTts": texto_tts,
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
