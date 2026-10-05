"""Build Google Ads variants from explicitly AI-generated master images."""

from __future__ import annotations

import csv
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
MASTERS = Path(__file__).resolve().parent / "generated-masters"
OUTPUT = Path(__file__).resolve().parent / "images-ai-generated"

SCENES = [
    {
        "service": "cabinet-detail-cleaning",
        "master": "ai-cabinet-detail-cleaning.png",
        "focus": {"landscape": (0.48, 0.46), "square": (0.50, 0.50), "portrait": (0.48, 0.51)},
        "prompt_summary": "成人清潔人員於台灣住宅清潔櫥櫃內部，人物不具可辨識臉孔",
    },
    {
        "service": "commercial-kitchen",
        "master": "ai-commercial-kitchen.png",
        "focus": {"landscape": (0.53, 0.47), "square": (0.50, 0.50), "portrait": (0.50, 0.52)},
        "prompt_summary": "成人清潔人員以洗地機清潔商業廚房地面",
    },
    {
        "service": "floor-waxing",
        "master": "ai-floor-waxing.png",
        "focus": {"landscape": (0.49, 0.48), "square": (0.50, 0.50), "portrait": (0.50, 0.52)},
        "prompt_summary": "成人清潔人員於大樓公共空間使用單盤洗地機",
    },
    {
        "service": "post-renovation-cleaning",
        "master": "ai-post-renovation-cleaning.png",
        "focus": {"landscape": (0.50, 0.44), "square": (0.50, 0.50), "portrait": (0.50, 0.50)},
        "prompt_summary": "兩名成人清潔人員進行裝潢後細清與吸塵",
    },
    {
        "service": "mold-removal",
        "master": "ai-mold-removal.png",
        "focus": {"landscape": (0.55, 0.53), "square": (0.50, 0.50), "portrait": (0.55, 0.51)},
        "prompt_summary": "成人清潔人員刷洗浴室磁磚接縫與局部黴垢",
    },
]

FORMATS = {
    "landscape": (1200, 628),
    "square": (1200, 1200),
    "portrait": (960, 1200),
}


def crop_to_ratio(image: Image.Image, target: tuple[int, int], focus: tuple[float, float]) -> Image.Image:
    width, height = image.size
    ratio = target[0] / target[1]
    if width / height > ratio:
        crop_h = height
        crop_w = crop_h * ratio
    else:
        crop_w = width
        crop_h = crop_w / ratio
    center_x = focus[0] * width
    center_y = focus[1] * height
    left = max(0, min(width - crop_w, center_x - crop_w / 2))
    top = max(0, min(height - crop_h, center_y - crop_h / 2))
    box = tuple(round(value) for value in (left, top, left + crop_w, top + crop_h))
    return image.crop(box).resize(target, Image.Resampling.LANCZOS)


def build_contact_sheet(paths: list[Path]) -> None:
    cell_w, cell_h = 320, 250
    cols = 3
    rows = math.ceil(len(paths) / cols)
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, path in enumerate(paths):
        with Image.open(path) as opened:
            preview = ImageOps.contain(opened.convert("RGB"), (cell_w - 16, cell_h - 44))
        x = index % cols * cell_w
        y = index // cols * cell_h
        sheet.paste(preview, (x + (cell_w - preview.width) // 2, y + 4))
        draw.text((x + 8, y + cell_h - 32), path.name, fill="black", font=font)
    sheet.save(OUTPUT / "contact-sheet-ai-generated.jpg", "JPEG", quality=88, optimize=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for old in OUTPUT.iterdir():
        if old.is_file():
            old.unlink()
    rows: list[dict] = []
    paths: list[Path] = []
    for scene_index, scene in enumerate(SCENES, 1):
        with Image.open(MASTERS / scene["master"]) as opened:
            master = ImageOps.exif_transpose(opened).convert("RGB")
        for kind, target in FORMATS.items():
            filename = f"ai-{kind}-{scene['service']}-{scene_index:02d}.jpg"
            destination = OUTPUT / filename
            result = crop_to_ratio(master, target, scene["focus"][kind])
            result.save(destination, "JPEG", quality=88, optimize=True, progressive=True, subsampling="4:2:0")
            rows.append({
                "output_file": filename,
                "master_file": f"generated-masters/{scene['master']}",
                "origin": "AI-generated",
                "ratio": "1.91:1" if kind == "landscape" else ("1:1" if kind == "square" else "4:5"),
                "width": target[0],
                "height": target[1],
                "service": scene["service"],
                "edits": "生成母圖後僅裁切與 JPEG 輸出；無疊字、Logo、拼貼或額外補畫",
                "prompt_summary": scene["prompt_summary"],
            })
            paths.append(destination)
    with (OUTPUT / "manifest-ai-generated.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    build_contact_sheet(paths)
    print(f"Built {len(paths)} AI-generated ad assets in {OUTPUT}")


if __name__ == "__main__":
    main()
