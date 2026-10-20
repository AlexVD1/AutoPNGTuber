import asyncio
import json
from pathlib import Path
import edge_tts
from mutagen.mp3 import MP3

ROOT_DIR = Path(__file__).resolve().parent.parent
GUION_PATH = ROOT_DIR / "src" / "data" / "guion.json"
AUDIOS_DIR = ROOT_DIR / "public" / "audios"

VOICE = "es-MX-JorgeNeural"
RATE = "+10%"
PAUSE_SECONDS = 0.25


async def procesar_escena(escena: dict) -> None:
    escena_id = escena["id"]
    texto = escena["texto"]
    audio_path = AUDIOS_DIR / f"escena_{escena_id}.mp3"

    communicate = edge_tts.Communicate(
        texto,
        VOICE,
        rate=RATE,
        boundary="WordBoundary",
    )

    palabras = []
    with open(audio_path, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                inicio_ms = round(chunk["offset"] / 10_000)
                fin_ms = round((chunk["offset"] + chunk["duration"]) / 10_000)
                palabras.append(
                    {
                        "palabra": chunk["text"],
                        "inicioMs": inicio_ms,
                        "finMs": fin_ms,
                    }
                )

    mp3_info = MP3(audio_path)
    duracion_segundos = round(mp3_info.info.length + PAUSE_SECONDS, 3)

    escena["duracionSegundos"] = duracion_segundos
    escena["palabras"] = palabras
    print(
        f"[Escena {escena_id}] Audio generado: {audio_path.name} "
        f"({duracion_segundos:.2f}s, {len(palabras)} palabras)"
    )


async def main() -> None:
    AUDIOS_DIR.mkdir(parents=True, exist_ok=True)

    with open(GUION_PATH, "r", encoding="utf-8") as f:
        guion = json.load(f)

    for escena in guion:
        await procesar_escena(escena)

    with open(GUION_PATH, "w", encoding="utf-8") as f:
        json.dump(guion, f, ensure_ascii=False, indent=2)

    total = sum(e["duracionSegundos"] for e in guion)
    print(f"\nGuion actualizado en {GUION_PATH} (Duracion total: {total:.2f}s)")


if __name__ == "__main__":
    asyncio.run(main())
