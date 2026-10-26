#!/usr/bin/env python3
"""
Módulo de Historial y Respaldo Automático de Guiones (AutoPNGTuber)

Funcionalidades:
1. Carga y actualiza `src/data/historial_temas.json`.
2. Detecta temas duplicados mediante `difflib.SequenceMatcher` (> 65% de similitud en gancho o guion completo).
3. Genera respaldos exactos de `guion.json` en `archivo_videos/{fecha}_{id_o_slug}.json`.
4. Soporta tanto estructura directa de arreglo `[...]` como objeto con metadatos `{ meta: {...}, escenas: [...] }`.
"""

import difflib
import io
import json
import re
import sys
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
GUION_PATH = ROOT_DIR / "src" / "data" / "guion.json"
HISTORIAL_PATH = ROOT_DIR / "src" / "data" / "historial_temas.json"
ARCHIVO_VIDEOS_DIR = ROOT_DIR / "archivo_videos"

PUNCT_STRIP = "¿?¡!.,;:()\"'«»—–-[]{}"
UMBRAL_SIMILITUD_DEFECTO = 0.65


def limpiar_slug(texto: str, max_palabras: Optional[int] = None) -> str:
    """Convierte texto en un slug alfanumérico limpio para nombres de archivo."""
    if not texto:
        return "short"
    str_val = texto.strip()
    if max_palabras:
        partes = str_val.split()
        if len(partes) > max_palabras:
            str_val = " ".join(partes[:max_palabras])

    # Normalizar diacríticos
    str_val = unicodedata.normalize("NFD", str_val)
    str_val = "".join(c for c in str_val if unicodedata.category(c) != "Mn")
    str_val = str_val.lower()
    str_val = re.sub(r"[^a-z0-9]+", "_", str_val)
    str_val = str_val.strip("_")
    return str_val[:50] or "short"


def normalizar_para_comparacion(texto: str) -> str:
    """Limpia puntuación, tildes y espacios para comparaciones semánticas difusas."""
    if not texto:
        return ""
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    texto = texto.lower()
    for ch in PUNCT_STRIP:
        texto = texto.replace(ch, " ")
    return " ".join(texto.split())


def cargar_historial() -> List[Dict[str, Any]]:
    """Carga el historial de temas registrados desde src/data/historial_temas.json."""
    if not HISTORIAL_PATH.exists():
        return []
    try:
        with open(HISTORIAL_PATH, "r", encoding="utf-8") as f:
            datos = json.load(f)
            return datos if isinstance(datos, list) else []
    except Exception as err:
        print(f"[HISTORIAL] ⚠️ Error leyendo {HISTORIAL_PATH}: {err}", file=sys.stderr)
        return []


def guardar_historial(historial: List[Dict[str, Any]]) -> None:
    """Guarda el historial actualizado en src/data/historial_temas.json."""
    HISTORIAL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORIAL_PATH, "w", encoding="utf-8") as f:
        json.dump(historial, f, ensure_ascii=False, indent=2)


def descomponer_guion(guion_raw: Any) -> Tuple[Optional[Dict[str, Any]], List[Dict[str, Any]]]:
    """Extrae meta (si existe) y el arreglo de escenas de cualquier estructura de guion."""
    if isinstance(guion_raw, dict) and "escenas" in guion_raw:
        meta = guion_raw.get("meta") if isinstance(guion_raw.get("meta"), dict) else {}
        escenas = guion_raw.get("escenas") or []
        return meta, escenas
    if isinstance(guion_raw, list):
        return None, guion_raw
    return None, []


def extraer_info_guion(guion_raw: Any) -> Dict[str, Any]:
    """Extrae id/slug, gancho, palabras clave y texto completo del guion."""
    meta, escenas = descomponer_guion(guion_raw)

    gancho = ""
    if escenas and isinstance(escenas[0], dict):
        gancho = (escenas[0].get("texto") or "").strip()

    titulos = [
        e.get("tituloVisual", "").strip()
        for e in escenas
        if isinstance(e, dict) and e.get("tituloVisual")
    ]
    palabras_clave = ", ".join(t for t in titulos if t)

    textos_escenas = [
        (e.get("texto") or "").strip()
        for e in escenas
        if isinstance(e, dict) and e.get("texto")
    ]
    texto_completo = " ".join(t for t in textos_escenas if t)

    # Determinación de ID / slug
    identificador = ""
    if meta:
        identificador = meta.get("id") or meta.get("slug") or ""

    if not identificador:
        if titulos:
            identificador = limpiar_slug(titulos[0])
        elif gancho:
            identificador = limpiar_slug(gancho, max_palabras=6)
        else:
            identificador = "video_short"

    return {
        "id": identificador,
        "gancho": gancho,
        "palabrasClave": palabras_clave,
        "textoCompleto": texto_completo,
        "meta": meta,
        "escenas": escenas,
    }


def verificar_duplicado(
    nuevo_id: str,
    nuevo_gancho: str,
    nuevo_texto_completo: str,
    historial: List[Dict[str, Any]],
    umbral: float = UMBRAL_SIMILITUD_DEFECTO,
    nuevo_tema: str = "",
) -> List[Dict[str, Any]]:
    """
    Compara el gancho, el tema (meta.temaResumen) y el texto completo contra el historial usando difflib.SequenceMatcher.
    Si detecta similitud > 65% con otro video (distinto al actual en edición),
    muestra la advertencia [ALERTA DUPLICADO] Este tema ya se trató en el video {id}.
    """
    duplicados = []
    norm_nuevo_gancho = normalizar_para_comparacion(nuevo_gancho)
    norm_nuevo_completo = normalizar_para_comparacion(nuevo_texto_completo)

    for registro in historial:
        reg_id = registro.get("id", "")
        # Si es la misma historia (re-ejecución del video actual en edición), se omite
        if reg_id == nuevo_id:
            continue

        reg_gancho = registro.get("gancho", "")
        reg_completo = registro.get("textoCompleto") or ""

        # Si el registro no tiene textoCompleto almacenado, comparar con su gancho o palabrasClave
        norm_reg_gancho = normalizar_para_comparacion(reg_gancho)
        norm_reg_completo = normalizar_para_comparacion(reg_completo)

        sim_gancho = 0.0
        if norm_nuevo_gancho and norm_reg_gancho:
            sim_gancho = difflib.SequenceMatcher(None, norm_nuevo_gancho, norm_reg_gancho).ratio()

        sim_completo = 0.0
        if norm_nuevo_completo and norm_reg_completo:
            sim_completo = difflib.SequenceMatcher(None, norm_nuevo_completo, norm_reg_completo).ratio()

        # Tema: compara meta.temaResumen (o, si el registro es antiguo, su gancho)
        norm_nuevo_tema = normalizar_para_comparacion(nuevo_tema)
        norm_reg_tema = normalizar_para_comparacion(registro.get("tema") or reg_gancho)
        sim_tema = 0.0
        if norm_nuevo_tema and norm_reg_tema:
            sim_tema = difflib.SequenceMatcher(None, norm_nuevo_tema, norm_reg_tema).ratio()

        max_sim = max(sim_gancho, sim_completo, sim_tema)

        if max_sim >= umbral:
            tipo_coincidencia = max(((sim_gancho, "gancho"), (sim_completo, "guion completo"), (sim_tema, "tema")))[1]
            porcentaje = int(round(max_sim * 100))
            duplicados.append({
                "id": reg_id,
                "registro": registro,
                "similitud": max_sim,
                "porcentaje": porcentaje,
                "tipo": tipo_coincidencia,
            })
            print(
                f"\n⚠️  [ALERTA DUPLICADO] Este tema ya se trató en el video {reg_id}.\n"
                f"   Coincidencia en {tipo_coincidencia}: {porcentaje}% (Umbral: {int(umbral*100)}%)\n"
                f"   Gancho previo: \"{reg_gancho}\"\n"
            )

    return duplicados


def respaldar_guion(guion_raw: Any, id_slug: str, fecha_str: Optional[str] = None) -> str:
    """Guarda una copia exacta de guion.json sincronizado en archivo_videos/{fecha}_{id_o_slug}.json."""
    ARCHIVO_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    if not fecha_str:
        fecha_str = datetime.now().strftime("%Y-%m-%d")

    nombre_archivo = f"{fecha_str}_{id_slug}.json"
    ruta_destino = ARCHIVO_VIDEOS_DIR / nombre_archivo

    with open(ruta_destino, "w", encoding="utf-8") as f:
        json.dump(guion_raw, f, ensure_ascii=False, indent=2)

    ruta_relativa = f"archivo_videos/{nombre_archivo}"
    return ruta_relativa


def rango_duracion(guion_raw: Any) -> tuple:
    """Rango (min, max) en segundos: meta.duracionObjetivo = [min, max] o 62-110 por defecto."""
    meta = guion_raw.get("meta") if isinstance(guion_raw, dict) else None
    objetivo = (meta or {}).get("duracionObjetivo")
    if isinstance(objetivo, (list, tuple)) and len(objetivo) == 2:
        return float(objetivo[0]), float(objetivo[1])
    return 62.0, 110.0

def registrar_historia(
    guion_raw: Optional[Any] = None,
    fecha_str: Optional[str] = None,
    umbral: float = UMBRAL_SIMILITUD_DEFECTO,
) -> Dict[str, Any]:
    """
    Función principal llamada tras la generación de voz o de forma manual:
    1. Carga o recibe el guion.
    2. Extrae metadatos.
    3. Verifica duplicados con difflib.SequenceMatcher.
    4. Guarda la copia en archivo_videos/{fecha}_{id_o_slug}.json.
    5. Actualiza src/data/historial_temas.json.
    """
    if guion_raw is None:
        if not GUION_PATH.exists():
            raise FileNotFoundError(f"No existe el archivo de guion en {GUION_PATH}")
        with open(GUION_PATH, "r", encoding="utf-8") as f:
            guion_raw = json.load(f)

    if not fecha_str:
        fecha_str = datetime.now().strftime("%Y-%m-%d")

    info = extraer_info_guion(guion_raw)
    nuevo_id = info["id"]
    gancho = info["gancho"]
    palabras_clave = info["palabrasClave"]
    texto_completo = info["textoCompleto"]

    historial = cargar_historial()

    # Verificación de duplicado
    verificar_duplicado(
        nuevo_id=nuevo_id,
        nuevo_gancho=gancho,
        nuevo_texto_completo=texto_completo,
        historial=historial,
        umbral=umbral,
        nuevo_tema=(info["meta"] or {}).get("temaResumen", ""),
    )

    # Verificación de duración contra meta.duracionObjetivo (por defecto 62-110 s)
    total_duracion = sum(
        e.get("duracionSegundos", 0)
        for e in info.get("escenas", [])
        if isinstance(e, dict) and isinstance(e.get("duracionSegundos"), (int, float))
    )
    if total_duracion > 0:
        minimo, maximo = rango_duracion(guion_raw)
        tiempo_fmt = f"{int(total_duracion // 60)}:{int(round(total_duracion % 60)):02d}"
        if total_duracion < minimo:
            print(
                f"⏱️  [DURACIÓN] ⚠️ ALERTA: {tiempo_fmt} ({total_duracion:.1f}s) es menor al mínimo del objetivo ({minimo:.0f}s).\n"
                f"   El guion debe ampliarse para cumplir con la duración objetivo.\n"
            )
        elif total_duracion > maximo:
            print(f"⏱️  [DURACIÓN] ⚠️ AVISO: {tiempo_fmt} ({total_duracion:.1f}s) excede el máximo del objetivo ({maximo:.0f}s).\n")
        else:
            print(f"⏱️  [DURACIÓN] ✅ {tiempo_fmt} ({total_duracion:.1f}s) dentro del objetivo [{minimo:.0f}-{maximo:.0f}s]\n")
    # Respaldo en archivo_videos/
    archivo_respaldo = respaldar_guion(guion_raw, nuevo_id, fecha_str)

    # Registro en historial_temas.json
    nuevo_registro = {
        "id": nuevo_id,
        "fecha": fecha_str,
        "gancho": gancho,
        "tema": (info["meta"] or {}).get("temaResumen", ""),
        "palabrasClave": palabras_clave,
        "archivoRespaldo": archivo_respaldo,
        "textoCompleto": texto_completo,
    }

    # Si ya existía una entrada con el mismo ID, actualizarla; de lo contrario, agregar
    idx_existente = next((i for i, r in enumerate(historial) if r.get("id") == nuevo_id), None)
    if idx_existente is not None:
        historial[idx_existente] = nuevo_registro
        accion = "actualizado"
    else:
        historial.append(nuevo_registro)
        accion = "agregado"

    guardar_historial(historial)
    print(
        f"[HISTORIAL] Guion {accion} exitosamente en {HISTORIAL_PATH.name}:\n"
        f"   - ID: {nuevo_id}\n"
        f"   - Gancho: {gancho}\n"
        f"   - Respaldo: {archivo_respaldo}\n"
    )

    return nuevo_registro


def main() -> None:
    print("[HISTORIAL] Procesando registro del guion actual...")
    registrar_historia()


if __name__ == "__main__":
    main()
