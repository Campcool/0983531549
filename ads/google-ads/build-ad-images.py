"""Build Google Ads photo assets from existing site photography only.

This script performs deterministic crop/resize/color correction and optional
privacy blur. It does not synthesize, inpaint, remove, or add scene content.
"""

from __future__ import annotations

import csv
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path(__file__).resolve().parent / "images"

SOURCES = [
    {
        "service": "commercial-kitchen",
        "source": "public/cases/commercial-kitchen/commercial-kitchen-02.jpg",
        "focus": (0.52, 0.42),
        "zoom": 1.06,
        "edits": "裁切、拉正（原圖已水平）、曝光+0.06EV、對比+3%、飽和-2%",
    },
    {
        "service": "floor-waxing",
        "source": "public/cases/floor-waxing/floor-waxing-03.jpg",
        "focus": (0.54, 0.46),
        "zoom": 1.06,
        "blur": (0.47, 0.10, 0.69, 0.28),
        "edits": "裁切、曝光+0.06EV、對比+3%、飽和-2%、臉部局部模糊",
    },
    {
        "service": "floor-adhesive-removal",
        "source": "public/cases/floor-adhesive-removal/floor-adhesive-removal-05.jpg",
        "focus": (0.55, 0.40),
        "zoom": 1.06,
        "edits": "裁切、拉正（原圖已垂直）、曝光+0.06EV、對比+3%、飽和-2%",
    },
    {
        "service": "wood-floor-cleaning",
        "source": "public/cases/wood-floor-cleaning/wood-floor-cleaning-02.jpg",
        "focus": (0.52, 0.40),
        "zoom": 1.06,
        "edits": "裁切、拉正（原圖已垂直）、曝光+0.06EV、對比+3%、飽和-2%",
    },
    {
        "service": "awning-cleaning",
        "source": "public/cases/awning-cleaning/awning-cleaning-02.jpg",
        "focus": (0.58, 0.48),
        "zoom": 1.06,
        "edits": "裁切、曝光+0.06EV、對比+3%、飽和-2%",
    },
]

FORMATS = {
    "landscape": {"ratio": 1200 / 628, "preferred": (1200, 628), "minimum": (600, 314)},
    "square": {"ratio": 1, "preferred": (1200, 1200), "minimum": (300, 300)},
}


def output_size(image: Image.Image, preferred: tuple[int, int], minimum: tuple[int, int], zoom: float) -> tuple[int, int]:
    target_w, target_h = preferred
    ratio = target_w / target_h
    source_w, source_h = image.size
    crop_w = min(source_w, source_h * ratio) / zoom
    crop_h = crop_w / ratio
    scale = min(1.15, target_w / crop_w, target_h / crop_h)
    width = min(target_w, int(math.floor(crop_w * scale)))
    height = int(round(width / ratio))
    if height > target_h:
        height = target_h
        width = int(round(height * ratio))
    if width < minimum[0] or height < minimum[1]:
        raise ValueError(f"Source cannot meet minimum size: {image.size} -> {(width, height)}")
    return width, height


def crop_box(size: tuple[int, int], ratio: float, focus: tuple[float, float], zoom: float) -> tuple[int, int, int, int]:
    width, height = size
    if width / height >= ratio:
        crop_h = height / zoom
        crop_w = crop_h * ratio
    else:
        crop_w = width / zoom
        crop_h = crop_w / ratio
    center_x = focus[0] * width
    center_y = focus[1] * height
    left = max(0, min(width - crop_w, center_x - crop_w / 2))
    top = max(0, min(height - crop_h, center_y - crop_h / 2))
    return tuple(round(value) for value in (left, top, left + crop_w, top + crop_h))


def privacy_blur(image: Image.Image, box: tuple[float, float, float, float] | None) -> Image.Image:
    if not box:
        return image
    width, height = image.size
    pixels = tuple(round(value * axis) for value, axis in zip(box, (width, height, width, height)))
    region = image.crop(pixels).filter(ImageFilter.GaussianBlur(radius=max(12, width // 45)))
    mask = Image.new("L", region.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, region.width - 1, region.height - 1), fill=255)
    image.paste(region, pixels[:2], mask)
    return image


def tune(image: Image.Image) -> Image.Image:
    image = ImageEnhance.Brightness(image).enhance(2 ** (0.06 / 1.0))
    image = ImageEnhance.Contrast(image).enhance(1.03)
    return ImageEnhance.Color(image).enhance(0.98)


def build_photo(item: dict, kind: str, sequence: int, manifest: list[dict]) -> Path:
    source_path = ROOT / item["source"]
    with Image.open(source_path) as opened:
        source = ImageOps.exif_transpose(opened).convert("RGB")
    source = privacy_blur(source, item.get("blur"))
    spec = FORMATS[kind]
    box = crop_box(source.size, spec["ratio"], item["focus"], item["zoom"])
    crop = source.crop(box)
    size = output_size(source, spec["preferred"], spec["minimum"], item["zoom"])
    upscale = max(size[0] / crop.width, size[1] / crop.height)
    result = tune(crop).resize(size, Image.Resampling.LANCZOS)
    filename = f"{kind}-{item['service']}-{sequence:02d}.jpg"
    destination = OUTPUT / filename
    result.save(destination, "JPEG", quality=85, optimize=True, progressive=True, subsampling="4:2:0")
    manifest.append({
        "output_file": filename,
        "source_file": item["source"],
        "ratio": "1.91:1" if kind == "landscape" else "1:1",
        "width": size[0],
        "height": size[1],
        "upscale_factor": f"{upscale:.3f}",
        "service": item["service"],
        "edits": item["edits"],
    })
    return destination


def build_portrait(item: dict, sequence: int, manifest: list[dict]) -> Path:
    source_path = ROOT / item["source"]
    with Image.open(source_path) as opened:
        source = ImageOps.exif_transpose(opened).convert("RGB")
    source = privacy_blur(source, item.get("blur"))
    ratio = 4 / 5
    box = crop_box(source.size, ratio, item["focus"], item["zoom"])
    crop = source.crop(box)
    size = output_size(source, (960, 1200), (480, 600), item["zoom"])
    upscale = max(size[0] / crop.width, size[1] / crop.height)
    result = tune(crop).resize(size, Image.Resampling.LANCZOS)
    filename = f"portrait-{item['service']}-{sequence:02d}.jpg"
    destination = OUTPUT / filename
    result.save(destination, "JPEG", quality=85, optimize=True, progressive=True, subsampling="4:2:0")
    manifest.append({
        "output_file": filename,
        "source_file": item["source"],
        "ratio": "4:5",
        "width": size[0],
        "height": size[1],
        "upscale_factor": f"{upscale:.3f}",
        "service": item["service"],
        "edits": item["edits"],
    })
    return destination


def build_logo(source_rel: str, filename: str, canvas: tuple[int, int], manifest: list[dict]) -> Path:
    source_path = ROOT / source_rel
    with Image.open(source_path) as opened:
        logo = ImageOps.exif_transpose(opened).convert("RGBA")
    background = Image.new("RGB", canvas, "white")
    position = ((canvas[0] - logo.width) // 2, (canvas[1] - logo.height) // 2)
    background.paste(logo, position, logo)
    destination = OUTPUT / filename
    background.save(destination, "PNG", optimize=True)
    manifest.append({
        "output_file": filename,
        "source_file": source_rel,
        "ratio": "1:1" if canvas[0] == canvas[1] else "4:1",
        "width": canvas[0],
        "height": canvas[1],
        "upscale_factor": "1.000",
        "service": "brand-logo",
        "edits": "白底置中、維持原始像素尺寸、不變形、不重畫",
    })
    return destination


def build_contact_sheet(paths: list[Path]) -> None:
    thumb_w, thumb_h = 320, 220
    cols = 3
    rows = math.ceil(len(paths) / cols)
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 42)), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, path in enumerate(paths):
        with Image.open(path) as opened:
            preview = ImageOps.contain(opened.convert("RGB"), (thumb_w - 20, thumb_h - 12))
        x = (index % cols) * thumb_w
        y = (index // cols) * (thumb_h + 42)
        sheet.paste(preview, (x + (thumb_w - preview.width) // 2, y + 6))
        draw.text((x + 10, y + thumb_h + 8), path.name, fill="black", font=font)
    sheet.save(OUTPUT / "contact-sheet.jpg", "JPEG", quality=88, optimize=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for old in OUTPUT.iterdir():
        if old.is_file():
            old.unlink()
    manifest: list[dict] = []
    paths: list[Path] = []
    for sequence, item in enumerate(SOURCES, 1):
        paths.append(build_photo(item, "landscape", sequence, manifest))
        paths.append(build_photo(item, "square", sequence, manifest))
    for sequence, item in enumerate(SOURCES[:2], 1):
        paths.append(build_portrait(item, sequence, manifest))
    paths.append(build_logo("public/brand/logo-mark-transparent.png", "logo-square-1200.png", (1200, 1200), manifest))
    paths.append(build_logo("public/brand/logo-horizontal-transparent.png", "logo-landscape-1200x300.png", (1200, 300), manifest))
    with (OUTPUT / "manifest.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "output_file", "source_file", "ratio", "width", "height",
            "upscale_factor", "service", "edits",
        ])
        writer.writeheader()
        writer.writerows(manifest)
    build_contact_sheet(paths)
    print(f"Built {len(paths)} ad assets in {OUTPUT}")


if __name__ == "__main__":
    main()
