import csv
import datetime
import difflib
import glob
import json
import os
import re
import unicodedata
import urllib.request
from concurrent.futures import ThreadPoolExecutor

CHANNEL_HANDLE = "@StickyDato"
SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
]


def normalizar_texto(texto):
    if not texto:
        return ""
    t = re.sub(r"#\S+", "", texto)
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def walk_json(obj, callback):
    if isinstance(obj, dict):
        callback(obj)
        for v in obj.values():
            walk_json(v, callback)
    elif isinstance(obj, list):
        for v in obj:
            walk_json(v, callback)


def fetch_public_youtube_shorts(handle=CHANNEL_HANDLE):
    """Obtiene los Shorts públicos directamente del canal sin requerir OAuth."""
    url = f"https://www.youtube.com/{handle}/shorts"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "es-MX,es;q=0.9"},
    )
    try:
        html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", "ignore")
    except Exception as e:
        print(f"[AVISO] No se pudo consultar {url}: {e}")
        return []

    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m:
        return []

    data = json.loads(m.group(1))
    video_ids = []

    def collect_ids(node):
        if "shortsLockupViewModel" in node:
            vm = node["shortsLockupViewModel"]
            vid = (
                vm.get("onTap", {})
                .get("innertubeCommand", {})
                .get("reelWatchEndpoint", {})
                .get("videoId")
            )
            if vid and vid not in video_ids:
                video_ids.append(vid)
        elif "reelItemRenderer" in node:
            vid = node["reelItemRenderer"].get("videoId")
            if vid and vid not in video_ids:
                video_ids.append(vid)

    walk_json(data, collect_ids)

    def fetch_single_video(vid):
        v_url = f"https://www.youtube.com/watch?v={vid}"
        v_req = urllib.request.Request(
            v_url,
            headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "es-MX,es;q=0.9"},
        )
        v_html = urllib.request.urlopen(v_req, timeout=15).read().decode("utf-8", "ignore")
        m_pr = re.search(r"var ytInitialPlayerResponse = (\{.*?\});</script>", v_html)
        m_id = re.search(r"var ytInitialData = (\{.*?\});</script>", v_html)

        item = {
            "videoId": vid,
            "title": "",
            "duration_s": None,
            "views": None,
            "likes": None,
            "publishDate": "",
            "avgViewPercentage": None,
            "pctViewed": None,
            "subscribersGained": None,
        }
        if m_pr:
            pr = json.loads(m_pr.group(1))
            vd = pr.get("videoDetails", {})
            mf = pr.get("microformat", {}).get("playerMicroformatRenderer", {})
            item["title"] = vd.get("title", "")
            if vd.get("lengthSeconds"):
                item["duration_s"] = float(vd["lengthSeconds"])
            if vd.get("viewCount") is not None:
                item["views"] = int(vd["viewCount"])
            pub = mf.get("publishDate") or mf.get("uploadDate") or ""
            item["publishDate"] = pub.split("T")[0] if "T" in pub else pub

        if m_id:
            s = m_id.group(1)
            likes = re.findall(r'"iconName":"LIKE".*?"title":"(\d+)"', s)
            if likes:
                item["likes"] = int(likes[0])
        return item

    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(fetch_single_video, video_ids))
    return results


def find_client_secrets(repo_root):
    direct = os.path.join(repo_root, "client_secrets.json")
    if os.path.exists(direct):
        return direct
    matches = glob.glob(os.path.join(repo_root, "client_secret*.json"))
    return matches[0] if matches else None


def enrich_with_youtube_analytics_oauth(repo_root, yt_videos):
    """Si existe client_secrets.json, autentica vía OAuth2 y obtiene retención y suscriptores por video."""
    secrets_file = find_client_secrets(repo_root)
    if not secrets_file:
        print(
            "[INFO] Modo Público activo (vistas/likes/fechas). "
            "Para traer Retención (%) y Suscriptores de YouTube Studio, coloca 'client_secrets.json' en la raíz."
        )
        return False

    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build
    except ImportError:
        print("[AVISO] Faltan librerías de Google OAuth. Ejecuta: pip install google-api-python-client google-auth-oauthlib")
        return False

    token_path = os.path.join(repo_root, ".yt_token.json")
    creds = None
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            print(f"[OAUTH] Abriendo navegador para autorizar lectura de YouTube Analytics ({os.path.basename(secrets_file)})...", flush=True)
            flow = InstalledAppFlow.from_client_secrets_file(secrets_file, SCOPES)
            creds = flow.run_local_server(port=0, timeout_seconds=120)
        with open(token_path, "w", encoding="utf-8") as tf:
            tf.write(creds.to_json())

    try:
        yt_analytics = build("youtubeAnalytics", "v2", credentials=creds)
        end_date = datetime.date.today().strftime("%Y-%m-%d")
        start_date = (datetime.date.today() - datetime.timedelta(days=180)).strftime("%Y-%m-%d")

        resp = (
            yt_analytics.reports()
            .query(
                ids="channel==MINE",
                startDate=start_date,
                endDate=end_date,
                metrics="views,engagedViews,averageViewDuration,averageViewPercentage,subscribersGained,likes,comments",
                dimensions="video",
                maxResults=200,
                sort="-views",
            )
            .execute()
        )

        rows_by_vid = {}
        for r in resp.get("rows", []):
            # [video, views, engagedViews, averageViewDuration, averageViewPercentage, subscribersGained, likes, comments]
            views_val = int(r[1])
            engaged_val = int(r[2])
            pct_viewed = round((engaged_val / views_val) * 100, 1) if views_val > 0 else None
            rows_by_vid[r[0]] = {
                "views": views_val,
                "engagedViews": engaged_val,
                "avgViewDuration": int(r[3]),
                "avgViewPercentage": round(float(r[4]), 1),
                "pctViewed": pct_viewed,
                "subscribersGained": int(r[5]),
                "likes": int(r[6]),
                "comments": int(r[7]),
            }

        for v in yt_videos:
            vid = v["videoId"]
            if vid in rows_by_vid:
                st = rows_by_vid[vid]
                if st["views"] > (v["views"] or 0):
                    v["views"] = st["views"]
                v["avgViewPercentage"] = st["avgViewPercentage"]
                v["pctViewed"] = st["pctViewed"]
                v["subscribersGained"] = st["subscribersGained"]
                if st["likes"] > (v["likes"] or 0):
                    v["likes"] = st["likes"]
        print(f"[OAUTH] Métricas privadas de YouTube Analytics sincronizadas ({len(rows_by_vid)} videos).")
        return True
    except Exception as e:
        print(f"[AVISO] Error al consultar YouTube Analytics API: {e}")
        return False


def match_local_to_yt(slug, local_title, yt_videos, used_ids):
    norm_title = normalizar_texto(local_title)
    norm_slug = normalizar_texto(slug.replace("_", " "))

    best_vid = None
    best_score = 0.0

    for v in yt_videos:
        if v["videoId"] in used_ids:
            continue
        yt_norm = normalizar_texto(v["title"])
        if not yt_norm:
            continue

        # Coincidencia por contención directa o similitud
        score_title = difflib.SequenceMatcher(None, norm_title, yt_norm).ratio() if norm_title else 0
        score_slug = difflib.SequenceMatcher(None, norm_slug, yt_norm).ratio() if norm_slug else 0

        if norm_title and (norm_title in yt_norm or yt_norm in norm_title):
            score_title = max(score_title, 0.90)

        # Palabras significativas en común
        words_local = set((norm_title + " " + norm_slug).split()) - {
            "el", "la", "los", "las", "de", "del", "en", "un", "una", "por", "que", "como", "tu", "te", "se", "a", "y", "o", "no", "es", "mas"
        }
        words_yt = set(yt_norm.split())
        overlap = len(words_local & words_yt) / max(1, min(len(words_local), len(words_yt))) if words_local and words_yt else 0

        score = max(score_title, score_slug, overlap * 0.85)
        if score > best_score:
            best_score = score
            best_vid = v

    if best_vid and best_score >= 0.52:
        used_ids.add(best_vid["videoId"])
        return best_vid
    return None


def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    seguimiento_path = os.path.join(repo_root, "docs", "SEGUIMIENTO.csv")

    print(f"[1/3] Consultando videos publicados en YouTube ({CHANNEL_HANDLE})...")
    yt_videos = fetch_public_youtube_shorts(CHANNEL_HANDLE)
    print(f"      -> {len(yt_videos)} Shorts detectados en el canal.")

    print("[2/3] Verificando conexión con YouTube Analytics API...")
    enrich_with_youtube_analytics_oauth(repo_root, yt_videos)

    found_videos = []

    # 1. Videos en out/publicados
    pub_dir = os.path.join(repo_root, "out", "publicados")
    for mp4 in sorted(glob.glob(os.path.join(pub_dir, "*.mp4"))):
        slug = os.path.basename(mp4).replace(".mp4", "")
        meta_path = os.path.join(pub_dir, f"{slug}_metadata.json")
        found_videos.append((slug, mp4, meta_path, "Publicado (en out/publicados)"))

    # 2. Videos en out/ directamente
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

    # Conservar valores manuales previos (ej. pct_visto_vs_deslizado) si ya estaban en SEGUIMIENTO.csv
    prev_manual = {}
    if os.path.exists(seguimiento_path):
        try:
            with open(seguimiento_path, "r", encoding="utf-8") as pf:
                reader = csv.DictReader(pf)
                for r in reader:
                    s = r.get("slug")
                    if s:
                        prev_manual[s] = r
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
        "comentarios",
    ]

    rows = []
    used_yt_ids = set()

    for slug, mp4_path, meta_path, estado_local in found_videos:
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

        yt_match = match_local_to_yt(slug, titulo, yt_videos, used_yt_ids)
        prev = prev_manual.get(slug, {})

        plataforma = prev.get("plataforma", "")
        vistas = prev.get("vistas_48h", "")
        retencion = prev.get("retencion_media_pct", "")
        visto_vs_deslizado = prev.get("pct_visto_vs_deslizado", "")
        subs = prev.get("suscriptores_ganados", "")
        comentario = estado_local

        if yt_match:
            plataforma = "YouTube"
            if yt_match.get("publishDate"):
                fecha = yt_match["publishDate"]
            if yt_match.get("views") is not None:
                vistas = yt_match["views"]
            if yt_match.get("avgViewPercentage") is not None:
                retencion = yt_match["avgViewPercentage"]
            if yt_match.get("pctViewed") is not None:
                visto_vs_deslizado = yt_match["pctViewed"]
            if yt_match.get("subscribersGained") is not None:
                subs = yt_match["subscribersGained"]
            likes_str = f" | Likes: {yt_match['likes']}" if yt_match.get("likes") is not None else ""
            comentario = f"YT ({yt_match['videoId']}){likes_str} - {estado_local}"

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
            plataforma,
            vistas,
            retencion,
            visto_vs_deslizado,
            subs,
            comentario,
        ])

    # Agregar también cualquier video publicado en el canal que ya no esté en out/ o out/publicados
    for v in yt_videos:
        if v["videoId"] not in used_yt_ids:
            dur = v.get("duration_s")
            grupo = "corto" if (dur and dur < 60) else ("medio" if (dur and dur < 80) else "largo")
            slug_virtual = f"yt_{v['videoId']}"
            prev = prev_manual.get(slug_virtual, {})
            likes_str = f" | Likes: {v['likes']}" if v.get("likes") is not None else ""
            rows.append([
                slug_virtual,
                v.get("publishDate", ""),
                v.get("title", ""),
                dur if dur is not None else "",
                grupo,
                "YouTube",
                v["views"] if v.get("views") is not None else "",
                v["avgViewPercentage"] if v.get("avgViewPercentage") is not None else prev.get("retencion_media_pct", ""),
                v["pctViewed"] if v.get("pctViewed") is not None else prev.get("pct_visto_vs_deslizado", ""),
                v["subscribersGained"] if v.get("subscribersGained") is not None else prev.get("suscriptores_ganados", ""),
                f"YT ({v['videoId']}){likes_str} - Publicado en canal",
            ])

    try:
        with open(seguimiento_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)
        print(f"[3/3] SEGUIMIENTO.csv actualizado con {len(rows)} filas ({len(yt_videos)} sincronizadas con YouTube).")
    except PermissionError:
        alt_path = seguimiento_path.replace(".csv", "_actualizado.csv")
        with open(alt_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)
        print(
            f"[AVISO] 'docs/SEGUIMIENTO.csv' está bloqueado por otro programa (ej. Excel). "
            f"Se guardó en 'docs/SEGUIMIENTO_actualizado.csv'."
        )


if __name__ == "__main__":
    main()
