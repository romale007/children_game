"""Generate voice-over mp3 files for a game: src/games/<game>/phrases.json → public/games/<game>/audio/.

Usage:
    python3 -m venv .venv && .venv/bin/pip install edge-tts
    .venv/bin/python scripts/generate_audio.py autumn-count            # only missing files
    .venv/bin/python scripts/generate_audio.py autumn-count --force    # regenerate everything
    .venv/bin/python scripts/generate_audio.py autumn-count right      # only the given phrases
"""

import argparse
import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent

# edge-tts returns CBR 48 kbit/s mono mp3 at 24 kHz: every frame is 144 bytes and 24 ms long.
FRAME_BYTES = 144
FRAME_SECONDS = 576 / 24000
# Kept after the last word so the ending isn't clipped (covers decoder delay too).
TAIL_SECONDS = 0.2


async def synthesize(text: str, voice: str, rate: str, pitch: str) -> bytes:
    """Returns mp3 bytes with the long trailing silence edge-tts adds cut off."""
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    audio = bytearray()
    speech_end = 0.0  # seconds
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
        elif chunk["type"] == "WordBoundary":
            # offsets and durations are in 100 ns ticks
            speech_end = max(speech_end, (chunk["offset"] + chunk["duration"]) / 10_000_000)

    is_cbr = all(audio[i] == 0xFF and audio[i + 1] & 0xE0 == 0xE0 for i in range(0, len(audio), FRAME_BYTES))
    if not speech_end or not is_cbr:
        return bytes(audio)
    frames = int((speech_end + TAIL_SECONDS) / FRAME_SECONDS) + 1
    return bytes(audio[: frames * FRAME_BYTES])


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("game", help="game id, a folder name in src/games")
    parser.add_argument("--voice", default="ru-RU-SvetlanaNeural")
    parser.add_argument("--rate", default="-10%", help="slower speech is easier for kids")
    parser.add_argument("--pitch", default="+0Hz")
    parser.add_argument("--force", action="store_true", help="overwrite existing files")
    parser.add_argument("ids", nargs="*", help="phrase ids to generate (default: all)")
    args = parser.parse_args()

    phrases_file = ROOT / "src" / "games" / args.game / "phrases.json"
    out_dir = ROOT / "public" / "games" / args.game / "audio"
    phrases: dict[str, str] = json.loads(phrases_file.read_text(encoding="utf-8"))
    out_dir.mkdir(parents=True, exist_ok=True)

    for phrase_id, text in phrases.items():
        if args.ids and phrase_id not in args.ids:
            continue
        target = out_dir / f"{phrase_id}.mp3"
        if target.exists() and not args.force and not args.ids:
            continue
        target.write_bytes(await synthesize(text, args.voice, args.rate, args.pitch))
        print(f"{target.relative_to(ROOT)}: {text}")


if __name__ == "__main__":
    asyncio.run(main())
