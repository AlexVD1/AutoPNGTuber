import json
import os
import glob
import csv

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    seguimiento_path = os.path.join(repo_root, "docs", "SEGUIMIENTO.csv")

    found_videos = []

    # 1. Videos en out/publicados
    pub_dir = os.path.join(repo_root, "out", "publicados")
    for mp4 in sorted(glob.glob(os.path.join(pub_dir, "*.mp4"))):
        slug = os.path.basename(mp4).replace(".mp4", "")
        meta_path = os.path.join(pub_dir, f"{slug}_metadata.json")
        found_videos.append((slug, mp4, meta_path, "Publicado (en out/publicados)"))

    # 2. Videos en out/ directamente (archivos directos, excluyendo subcarpetas)
    out_dir = os.path.join(repo_root, "out")
    for f in sorted(os.listdir(out_dir)):
        p = os.path.join(out_dir, f)
        if f.endswith(".mp4") and os.path.isfile(p):
            slug = f.replace(".mp4", "")
            meta_path = os.path.join(out_dir, f"{slug}_metadata.json")
            found_videos.append((slug, p, meta_path, "Listo (en out/)"))

    # Cargar títulos limpios de archivo_videos y guion activo
    titulos_limpios = {}
    for p in glob.glob(os.path.join(repo_root, "archivo_videos", "*.json")):
        try:
            with open(p, "r", encoding="utf-8") as af:
                d = json.load(af)
                meta = d.get("meta", {}) if isinstance(d, dict) else {}
                slug = meta.get("slug") or meta.get("id")
                if not slug:
                    base = os.path.basename(p).replace(".json", "")
                    parts = base.split("_", 1)
                    slug = parts[1] if len(parts) > 1 and len(parts[0]) == 10 and parts[0][4] == "-" else base
                if meta.get("titulo"):
                    titulos_limpios[slug] = meta["titulo"]
        except Exception:
            pass

    # También revisar guion activo
    guion_path = os.path.join(repo_root, "src", "data", "guion.json")
    if os.path.exists(guion_path):
        try:
            with open(guion_path, "r", encoding="utf-8") as gf:
                g = json.load(gf)
                if isinstance(g, dict) and g.get("meta"):
                    slug = g["meta"].get("slug") or g["meta"].get("id")
                    if slug and g["meta"].get("titulo"):
                        titulos_limpios[slug] = g["meta"]["titulo"]
        except Exception:
            pass

    headers = [
        "slug",
        "fecha_publicacion",
        "titulo",
        "duracion_s",
        "grupo",
        "plataforma",
        "vistas_48h",
        "retencion_media_pct",
        "pct_visto_vs_deslizado",
        "suscriptores_ganados",
        "comentarios"
    ]

    rows = []
    for slug, mp4_path, meta_path, comentario in found_videos:
        titulo = titulos_limpios.get(slug, "")
        dur = None
        fecha = ""

        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as mf:
                m = json.load(mf)
                if not titulo:
                    titulo = m.get("title") or ""
                if m.get("duration_seconds"):
                    dur = round(float(m["duration_seconds"]), 1)
                if m.get("fecha_publicacion"):
                    fecha = m["fecha_publicacion"]
                elif m.get("created_at"):
                    fecha = m["created_at"].split("T")[0]

        if not titulo:
            titulo = slug.replace("_", " ").capitalize()

        if dur is not None:
            grupo = "corto" if dur < 60 else ("medio" if dur < 80 else "largo")
        else:
            grupo = "medio"

        rows.append([
            slug,
            fecha,
            titulo,
            dur if dur is not None else "",
            grupo,
            "",  # plataforma
            "",  # vistas_48h
            "",  # retencion_media_pct
            "",  # pct_visto_vs_deslizado
            "",  # suscriptores_ganados
            comentario
        ])

    with open(seguimiento_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"SEGUIMIENTO.csv actualizado exclusivamente con {len(rows)} videos de out/publicados y out/.")

if __name__ == "__main__":
    main()
