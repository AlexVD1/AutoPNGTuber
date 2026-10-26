#!/usr/bin/env python3
"""
Script de procesamiento por lotes para verificar, sintetizar y renderizar
todos los Shorts generados con la nueva arquitectura estética, científica y de monetización.

Uso:
  python scripts/batch_procesar_videos.py --all
  python scripts/batch_procesar_videos.py --start=0 --limit=5
  python scripts/batch_procesar_videos.py slug1 slug2
"""

import os
import sys
import io
import json
import shutil
import argparse
import subprocess
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
ARCHIVO_DIR = ROOT_DIR / "archivo_videos"
GUION_PATH = ROOT_DIR / "src" / "data" / "guion.json"
OUT_DIR = ROOT_DIR / "out"
PENDIENTES_DIR = OUT_DIR / "pendientes"

_env = ROOT_DIR / ".env"
DRIVE_DIR = Path(next((l.split("=", 1)[1].strip() for l in _env.read_text(encoding="utf-8").splitlines() if l.startswith("DESTINO_DIR=")), "") if _env.exists() else "")

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

TODOS_LOS_VIDEOS = [
    "agua_mar_deshidratacion",
    "agujero_negro_caida",
    "arboles_red_micelio_wood_wide_web",
    "bioluminiscencia_marina_olas_azules",
    "bostezo_contagioso_cerebro",
    "caer_en_lava_volcan",
    "camaleon_cristales_color",
    "camaron_pistola_cavitacion",
    "cielo_azul_atardecer",
    "color_agua_azul_hielo",
    "curacion_expres",
    "deja_vu_misterio_cerebro",
    "delfines_dormir_respirar",
    "dolor_extremo_schmidt",
    "el_abismo_oceanico",
    "extincion_insectos_ecosistema",
    "fotosintesis_clorofila_verde",
    "hielo_flotante_anomalia",
    "hormiga_caida_inmortal",
    "impacto_monstruoso",
    "luna_desaparece_caos",
    "maglev_levitacion_magnetica",
    "marte_sin_escafandra",
    "metales_brillantes_conductores",
    "miel_inmortal_arqueologia",
    "paradoja_gemelos_espacio",
    "piel_de_gallina",
    "reflejo_felino",
    "tardigrado_criptobiosis_inmortal",
    "tiempo_bajo_tierra_gravedad",
]


def buscar_archivo_guion(slug: str) -> Path | None:
    direct = ARCHIVO_DIR / f"2026-10-21_{slug}.json"
    if direct.exists():
        return direct
    matches = list(ARCHIVO_DIR.glob(f"*{slug}*.json"))
    return matches[0] if matches else None


def ya_esta_procesado(slug: str) -> bool:
    """Verifica si el video ya fue renderizado con la nueva arquitectura (fuentes y QA)."""
    mp4_pend = PENDIENTES_DIR / f"{slug}.mp4"
    json_pend = PENDIENTES_DIR / f"{slug}_metadata.json"
    if not mp4_pend.exists() or not json_pend.exists():
        return False
    try:
        data = json.loads(json_pend.read_text(encoding="utf-8"))
        # Si tiene fuentes y created_at es de hoy (2026-10-22), está al día
        return bool(data.get("fuentes") and data.get("titulo_corto"))
    except Exception:
        return False


def procesar_video(slug: str, idx: int, total: int, force_tts: bool = False, force_render: bool = False, port: int = 3004):
    print("\n" + "=" * 70)
    print(f"🎬 [{idx}/{total}] PROCESANDO SHORT CIENTÍFICO: {slug}")
    print("=" * 70)

    if not force_render and ya_esta_procesado(slug):
        print(f"⏩ [OMITIDO] '{slug}' ya está renderizado con la nueva arquitectura y fuentes.")
        return True

    archivo_fuente = buscar_archivo_guion(slug)
    if not archivo_fuente or not archivo_fuente.exists():
        print(f"❌ Error: No se encontró archivo en archivo_videos para '{slug}'")
        return False

    # 1. Cargar guion activo
    print(f"\n[1/4] Copiando {archivo_fuente.name} -> src/data/guion.json...")
    shutil.copyfile(archivo_fuente, GUION_PATH)

    # 2. Generar voz y alinear timestamps si se requiere o si se fuerza
    print(f"\n[2/4] Verificando / Sintetizando voz neuronal y alineación Whisper...")
    cmd_tts = [
        str(PYTHON_EXE),
        str(ROOT_DIR / "scripts" / "generar_voz.py"),
    ]
    if force_tts:
        cmd_tts.append("--force")

    env = os.environ.copy()
    env["AUTOPNGTUBER_VENV_ACTIVE"] = "1"
    res_tts = subprocess.run(cmd_tts, cwd=ROOT_DIR, env=env)
    if res_tts.returncode != 0:
        print(f"❌ Error en TTS para {slug} (código {res_tts.returncode})")
        return False

    # 3. Respaldar guion sincronizado en archivo_videos
    shutil.copyfile(GUION_PATH, archivo_fuente)

    # 4. Renderizar video con Remotion (ejecuta validar_guion y qa_video automáticamente)
    print(f"\n[3/4] Renderizando video con Remotion, validación Zod y QA...")
    cmd_render = [
        "node",
        str(ROOT_DIR / "scripts" / "render_short.js"),
        "--name",
        slug,
        "--port",
        str(port),
    ]
    res_render = subprocess.run(cmd_render, cwd=ROOT_DIR, shell=True)
    if res_render.returncode != 0:
        print(f"❌ Error en Render para {slug} (código {res_render.returncode})")
        return False

    # 5. Mover a out/pendientes para mantener out organizado
    PENDIENTES_DIR.mkdir(parents=True, exist_ok=True)
    mp4_out = OUT_DIR / f"{slug}.mp4"
    json_out = OUT_DIR / f"{slug}_metadata.json"

    if mp4_out.exists():
        mp4_final = PENDIENTES_DIR / f"{slug}.mp4"
        shutil.copyfile(mp4_out, mp4_final)
        size_mb = mp4_final.stat().st_size / (1024 * 1024)
        print(f"\n✅ Video guardado en out/pendientes/: {mp4_final.name} ({size_mb:.1f} MB)")

    if json_out.exists():
        json_final = PENDIENTES_DIR / f"{slug}_metadata.json"
        shutil.copyfile(json_out, json_final)

    # 6. Verificación en Drive si está conectado
    mp4_drive = DRIVE_DIR / f"{slug}.mp4"
    if DRIVE_DIR.name and mp4_drive.exists():
        print(f"🚀 Sincronizado en Drive: {mp4_drive}")

    return True


def main():
    parser = argparse.ArgumentParser(description="Procesamiento por lotes de Shorts de AutoPNGTuber")
    parser.add_argument("slugs", nargs="*", help="Slugs específicos a procesar")
    parser.add_argument("--all", action="store_true", help="Procesar todos los 30 videos de producción")
    parser.add_argument("--start", type=int, default=0, help="Índice de inicio")
    parser.add_argument("--limit", type=int, default=None, help="Cantidad máxima de videos a procesar")
    parser.add_argument("--force-tts", action="store_true", help="Forzar re-síntesis TTS en todas las escenas")
    parser.add_argument("--force", action="store_true", help="Forzar re-renderizado aunque ya esté procesado")
    parser.add_argument("--port", type=int, default=3004, help="Puerto para Remotion")

    args = parser.parse_args()

    if args.slugs:
        videos = args.slugs
    elif args.all or args.limit is not None or args.start > 0:
        videos = TODOS_LOS_VIDEOS[args.start:]
        if args.limit is not None:
            videos = videos[:args.limit]
    else:
        videos = TODOS_LOS_VIDEOS

    total = len(videos)
    exitos = 0
    fallos = []

    print(f"🚀 Iniciando procesamiento por lotes de {total} videos...\n")

    for i, slug in enumerate(videos, 1):
        ok = procesar_video(slug, i, total, force_tts=args.force_tts, force_render=args.force, port=args.port)
        if ok:
            exitos += 1
        else:
            fallos.append(slug)

    print("\n" + "=" * 70)
    print(f"📊 RESUMEN FINAL: {exitos}/{total} videos renderizados exitosamente.")
    if fallos:
        print(f"⚠️ Fallaron: {', '.join(fallos)}")
    else:
        print("🎉 ¡TODOS LOS VIDEOS DEL LOTE COMPLETADOS CON ÉXITO!")
    print("=" * 70)


if __name__ == "__main__":
    main()
