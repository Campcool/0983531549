"""Rebuild web derivatives from preserved case photos. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1] / 'public'
sources = [
    'cases/site-cleaning-hero.jpg',
    'cases/room-after-work-cleaning.jpg',
    'cases/general-cleaning/general-cleaning-01.jpg',
    'cases/garbage-clearance/garbage-clearance-01.jpg',
    'cases/grease-kitchen/grease-kitchen-01.jpg',
    'cases/general-home-cleaning/general-home-cleaning-11.jpg',
]
output = root / 'responsive'
output.mkdir(exist_ok=True)
for source in sources:
    with Image.open(root / source) as raw:
        image = ImageOps.exif_transpose(raw).convert('RGB')
        for width in [480, 960]:
            size = (min(width, image.width), round(image.height * min(width, image.width) / image.width))
            image.resize(size, Image.Resampling.LANCZOS).save(output / f'{Path(source).stem}-{width}.webp', quality=82, method=6)
