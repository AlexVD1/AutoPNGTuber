import json
import os
import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
ARCHIVO_DIR = ROOT_DIR / "archivo_videos"
GUIONES_DIR = ROOT_DIR / "guiones"
GUIONES_DIR.mkdir(parents=True, exist_ok=True)

count = 0
for f in os.listdir(ARCHIVO_DIR):
    if not f.endswith(".json"):
        continue
    # Strip date prefix e.g. 2026-10-29_slug.json -> slug
    match = re.match(r"^\d{4}-\d{2}-\d{2}_(.*)\.json$", f)
    slug = match.group(1) if match else f[:-5]
    
    src_file = ARCHIVO_DIR / f
    dest_dir = GUIONES_DIR / slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_json = dest_dir / "guion.json"
    
    try:
        with open(src_file, "r", encoding="utf-8") as rf:
            data = json.load(rf)
            
        with open(dest_json, "w", encoding="utf-8") as wf:
            json.dump(data, wf, ensure_ascii=False, indent=2)
            
        # Also write readable text
        meta = data.get("meta") if isinstance(data, dict) else None
        escenas = data.get("escenas") if isinstance(data, dict) else (data if isinstance(data, list) else [])
        
        dest_txt = dest_dir / "guion.txt"
        with open(dest_txt, "w", encoding="utf-8") as wf:
            wf.write(f"ID / SLUG: {slug}\n")
            if meta:
                if "titulo" in meta:
                    wf.write(f"Título: {meta['titulo']}\n")
                if "gancho" in meta:
                    wf.write(f"Gancho: {meta['gancho']}\n")
                if "temaResumen" in meta:
                    wf.write(f"Tema: {meta['temaResumen']}\n")
            wf.write("=" * 60 + "\n\n")
            for esc in escenas:
                if isinstance(esc, dict):
                    wf.write(f"[Escena {esc.get('id')}] {esc.get('tituloVisual', '')}\n")
                    wf.write(f"{esc.get('texto', '')}\n\n")
        count += 1
    except Exception as e:
        print(f"Error procesando {f}: {e}")

print(f"✅ {count} guiones organizados en carpetas dentro de 'guiones/'!")
