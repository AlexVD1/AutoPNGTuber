#!/usr/bin/env python3
"""
Script de procesamiento por lotes para actualizar, limpiar audio y renderizar
todos los Shorts generados con la nueva arquitectura estética y de monetización.
"""

import os
import sys
import io
import json
import shutil
import subprocess
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
ARCHIVO_DIR = ROOT_DIR / "archivo_videos"
GUION_PATH = ROOT_DIR / "src" / "data" / "guion.json"
OUT_DIR = ROOT_DIR / "out"
DRIVE_DIR = Path(r"H:\Mi unidad\ShortsMotionGraphics")

PYTHON_EXE = (
    ROOT_DIR.parent
    / "AIO"
    / "KidsAnimationStudio"
    / "voice-lab"
    / ".venv"
    / "Scripts"
    / "python.exe"
)
if not PYTHON_EXE.exists():
    PYTHON_EXE = Path(sys.executable)

VIDEOS_A_PROCESAR = [
    "agujero_negro_caida",
    "bostezo_contagioso_cerebro",
    "cielo_azul_atardecer",
    "curacion_expres",
    "deja_vu_misterio_cerebro",
    "delfines_dormir_respirar",
    "impacto_monstruoso",
    "luna_desaparece_caos",
    "piel_de_gallina",
    "reflejo_felino",
]


def procesar_video(slug: str, idx: int, total: int):
    print("\n" + "=" * 70)
    print(f"🎬 [{idx}/{total}] PROCESANDO SHORT: {slug}")
    print("=" * 70)

    archivo_fuente = ARCHIVO_DIR / f"2026-10-21_{slug}.json"
    if not archivo_fuente.exists():
        print(f"❌ Error: No existe {archivo_fuente}")
        return False

    # 1. Cargar guion activo
    print(f"\n[1/4] Copiando {archivo_fuente.name} -> src/data/guion.json...")
    shutil.copyfile(archivo_fuente, GUION_PATH)

    # 2. Generar voz y limpiar audio
    print(f"\n[2/4] Ejecutando TTS, alineación Whisper y limpieza de pausas...")
    cmd_tts = [
        str(PYTHON_EXE),
        str(ROOT_DIR / "scripts" / "generar_voz.py"),
        "--force",
    ]
    env = os.environ.copy()
    env["AUTOPNGTUBER_VENV_ACTIVE"] = "1"
    res_tts = subprocess.run(cmd_tts, cwd=ROOT_DIR, env=env)
    if res_tts.returncode != 0:
        print(f"❌ Error en TTS para {slug} (código {res_tts.returncode})")
        return False

    # 3. Respaldar guion con timings actualizados
    print(f"\n[3/4] Respaldando guion actualizado en archivo_videos...")
    shutil.copyfile(GUION_PATH, archivo_fuente)

    # 4. Renderizar video y exportar metadata
    print(f"\n[4/4] Renderizando video con Remotion...")
    cmd_render = [
        "node",
        str(ROOT_DIR / "scripts" / "render_short.js"),
        "--name",
        slug,
        "--port",
        "3004",
    ]
    res_render = subprocess.run(cmd_render, cwd=ROOT_DIR, shell=True)
    if res_render.returncode != 0:
        print(f"❌ Error en Render para {slug} (código {res_render.returncode})")
        return False

    # 5. Verificación
    mp4_out = OUT_DIR / f"{slug}.mp4"
    mp4_drive = DRIVE_DIR / f"{slug}.mp4"
    if mp4_out.exists():
        size_mb = mp4_out.stat().st_size / (1024 * 1024)
        print(f"\n✅ Render local exitoso: {mp4_out} ({size_mb:.1f} MB)")
    if mp4_drive.exists():
        print(f"🚀 Copia en Drive confirmada: {mp4_drive}")

    return True


def main():
    total = len(VIDEOS_A_PROCESAR)
    exitos = 0
    fallos = []

    print(f"Iniciando procesamiento por lotes de {total} videos...\n")

    for i, slug in enumerate(VIDEOS_A_PROCESAR, 1):
        ok = procesar_video(slug, i, total)
        if ok:
            exitos += 1
        else:
            fallos.append(slug)

    print("\n" + "=" * 70)
    print(f"📊 RESUMEN FINAL: {exitos}/{total} videos renderizados exitosamente.")
    if fallos:
        print(f"⚠️ Fallaron: {', '.join(fallos)}")
    else:
        print("🎉 ¡TODOS LOS VIDEOS COMPLETADOS CON ÉXITO!")
    print("=" * 70)


if __name__ == "__main__":
    main()
