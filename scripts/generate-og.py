#!/usr/bin/env python3
"""產生首頁／案例頁／分享頁共用的 OG 圖（1200x1200）。

⚠️ 這支與 scripts/generate-og.ps1 是同一張圖的兩個產生器，**必須同步修改**：
   - generate-og.ps1：Windows／System.Drawing，業主本機用，需要
     %WINDIR%\\Fonts\\NotoSansTC-VF.ttf。
   - generate-og.py ：跨平台／Pillow，沙盒與 CI 用，字型從 Google Fonts 取
     Noto Sans TC（同一個字型家族，所以兩邊輸出的字形一致）。
   改了文案只改其中一支，下一個人重跑另一支就會把改動蓋掉。見 AI-README 陷阱 14。

用法：
    python3 scripts/generate-og.py [--font-dir <放 NotoSansTC-700.ttf 的目錄>]

字型取得方式（沙盒內可直接執行）：
    curl --get --data-urlencode 'family=Noto Sans TC:wght@700' \\
         --data-urlencode "text=$(cat 需要的字元)" \\
         https://fonts.googleapis.com/css2 -o css.css
    # 取出 css 內的 fonts.gstatic.com 連結下載 woff2，再用 fonttools 轉 ttf
"""

import argparse
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public/og-cleaning-area-services-20260910.jpg')
PHOTO = os.path.join(ROOT, 'public/cases/site-cleaning-hero.jpg')
LOGO = os.path.join(ROOT, 'public/brand/logo-horizontal-transparent.png')
CASE_PHOTO = os.path.join(ROOT, 'public/cases/commercial-kitchen/commercial-kitchen-01.jpg')

# GDI+ 的 DrawString 預設 StringFormat 會在字串左右各補約 em/6 的留白，Pillow 不會。
# 不補這段，所有文字會比 PS1 的輸出往左偏 0.17 em（82px 字就是 14px）。
# 這個係數是拿舊圖未改動的元素（品牌字 82px、副標 44px、slogan 35px、浮水印 24px）
# 逐像素互相關校正出來的：四個字級量到的位移都落在 -0.16 ~ -0.17 em。
# 垂直方向兩者一致，不需要偏移。
GDI_SIDE_PADDING = 1 / 6


def draw_text(draw, xy, text, font, fill):
    """比照 GDI+ DrawString 的定位語意。"""
    x, y = xy
    draw.text((x + font.size * GDI_SIDE_PADDING, y), text, font=font, fill=fill)


def round_rect(draw, box, radius, fill=None, outline=None, width=1):
    x, y, w, h = box
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius,
                           fill=fill, outline=outline, width=width)


def draw_cover(canvas, image, x, y, w, h):
    """等比裁切填滿，對應 PS1 的 Draw-CoverImage。"""
    scale = max(w / image.width, h / image.height)
    sw, sh = int(w / scale), int(h / scale)
    sx, sy = int((image.width - sw) / 2), int((image.height - sh) / 2)
    crop = image.crop((sx, sy, sx + sw, sy + sh)).resize((w, h), Image.LANCZOS)
    canvas.paste(crop, (x, y))


def build(font_dir, out_path=OUT):
    def f(size):
        return ImageFont.truetype(os.path.join(font_dir, 'NotoSansTC-700.ttf'), size)

    primary, secondary, muted = '#174f5d', '#2f8f8f', '#54707a'
    white, line_green = '#ffffff', '#017a35'
    blue, orange, purple = '#2f77a1', '#c57b2c', '#6f5cc5'

    img = Image.new('RGB', (1200, 1200), '#e9f8f5')

    photo = Image.open(PHOTO).convert('RGB')
    draw_cover(img, photo, 445, 0, 755, 1200)
    overlay = Image.new('RGBA', (755, 1200), (23, 79, 93, 128))
    img.paste(Image.alpha_composite(img.crop((445, 0, 1200, 1200)).convert('RGBA'), overlay).convert('RGB'), (445, 0))

    panel = Image.new('RGBA', (1200, 1200), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    round_rect(pd, (58, 64, 704, 1072), 48, fill=(255, 255, 255, 242),
               outline=(167, 220, 200, 150), width=3)
    img = Image.alpha_composite(img.convert('RGBA'), panel).convert('RGB')
    d = ImageDraw.Draw(img)

    logo = Image.open(LOGO).convert('RGBA').resize((270, 134), Image.LANCZOS)
    img.paste(logo, (104, 96), logo)
    d = ImageDraw.Draw(img)

    draw_text(d, (104, 268), '潔淨坊', f(82), primary)
    draw_text(d, (108, 364), '清潔工作室', f(44), primary)
    draw_text(d, (108, 438), '乾淨，讓生活更美好！', f(35), secondary)

    # 服務地區。2026-09-24 業主要求從「基隆｜台北｜新北｜桃園」改成五個地區，
    # 並把最常到府的林口、龜山放在第一行。五個地區單行排會把字級從 50px 壓到
    # 38px，反而弱化業主最在意的這一行，所以改成兩行 44px。
    area_font = f(44)
    round_rect(d, (104, 520, 574, 140), 34, fill='#dff3ef')
    draw_text(d, (124, 536), '林口｜龜山｜基隆', area_font, primary)
    draw_text(d, (124, 596), '雙北｜桃園', area_font, primary)

    # 地區帶長高 22px，以下元素整體下移 22px
    draw_text(d, (108, 706), '服務內容', f(26), muted)

    chips = [
        ('居家清潔', 108, 760, 250, secondary, '#e6f7f2'),
        ('裝潢細清', 382, 760, 250, blue, '#e8f5fb'),
        ('退租入住', 108, 838, 250, orange, '#fff3e5'),
        ('重油汙', 382, 838, 250, purple, '#f0edff'),
        ('特殊清潔', 108, 916, 250, primary, '#edf8e8'),
    ]
    chip_font = f(31)
    for text, x, y, w, color, bg in chips:
        round_rect(d, (x, y, w, 58), 29, fill=bg)
        draw_text(d, (x + 27, y + 9), text, chip_font, color)

    round_rect(d, (104, 1022, 574, 82), 28, fill=line_green)
    draw_text(d, (155, 1039), 'LINE 傳照片先確認', f(35), white)

    card = Image.new('RGBA', (1200, 1200), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    round_rect(cd, (790, 704, 338, 276), 30, fill=(255, 255, 255, 245))
    img = Image.alpha_composite(img.convert('RGBA'), card).convert('RGB')
    case = Image.open(CASE_PHOTO).convert('RGB')
    draw_cover(img, case, 810, 724, 298, 190)
    d = ImageDraw.Draw(img)
    draw_text(d, (845, 930), '實拍案場', f(26), primary)

    wm = Image.new('RGBA', (1200, 1200), (0, 0, 0, 0))
    ImageDraw.Draw(wm).text((776 + 24 * GDI_SIDE_PADDING, 1058),
                            'JIE JING FANG CLEANING SERVICE',
                            font=f(24), fill=(255, 255, 255, 185))
    img = Image.alpha_composite(img.convert('RGBA'), wm).convert('RGB')

    img.save(out_path, 'JPEG', quality=90, subsampling=0)
    return out_path


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--font-dir', default=os.path.join(ROOT, 'scripts'))
    ap.add_argument('--out', default=OUT)
    args = ap.parse_args()
    print(build(args.font_dir, args.out))
