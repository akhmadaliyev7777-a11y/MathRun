#!/usr/bin/env python3
"""GPT yasagan personaj rasmlarini saytga tayyorlash (Claude uchun yordamchi).

  python3 _reja/personaj.py            -> ~/Desktop/personajlar/0..9.png ni qayta ishlaydi
  python3 _reja/personaj.py 3          -> faqat 3.png

Har bir rasm teng ustunlarga bo'linadi (0.png — 3 ta, 1..9.png — 2 ta), fon tozalanadi
(yarim shaffof shovqin olib tashlanadi, oq fon bo'lsa shaffofga aylantiriladi), chetlari kesiladi,
balandligi 520 px qilib WebP ko'rinishida maruza/personaj/ ga yoziladi.
"""
import os, sys
from PIL import Image, ImageFilter

MANBA = os.path.expanduser("~/Desktop/personajlar")
CHIQ = os.path.join(os.path.dirname(__file__), "..", "maruza", "personaj")
BALAND = 520
NOMLAR = {
    0: ["aziz", "madina", "ustoz"],
    1: ["aziz-tushuntiradi", "aziz-oylaydi"],
    2: ["aziz-diqqat", "aziz-yozadi"],
    3: ["aziz-xursand", "aziz-planshet"],
    4: ["madina-tushuntiradi", "madina-oylaydi"],
    5: ["madina-diqqat", "madina-yozadi"],
    6: ["madina-xursand", "madina-planshet"],
    7: ["ustoz-tushuntiradi", "ustoz-oylaydi"],
    8: ["ustoz-diqqat", "ustoz-yozadi"],
    9: ["ustoz-xursand", "ustoz-planshet"],
}


def shaffof_qil(im):
    """Oq fonni (agar rasm shaffof bo'lmasa) shaffofga aylantiradi, kuchsiz shovqinni o'chiradi."""
    im = im.convert("RGBA")
    a = im.getchannel("A")
    if a.getextrema()[0] == 255:  # fon shaffof emas — chetdan boshlab oq rangni o'chiramiz
        px = im.load()
        w, h = im.size
        stack = [(x, y) for x in (0, w - 1) for y in range(h)] + [(x, y) for y in (0, h - 1) for x in range(w)]
        seen = set()
        while stack:
            x, y = stack.pop()
            if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
                continue
            seen.add((x, y))
            r, g, b, _ = px[x, y]
            if r > 238 and g > 238 and b > 238:
                px[x, y] = (r, g, b, 0)
                stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
        a = im.getchannel("A")
    a = a.point(lambda v: 0 if v < 60 else v)          # yarim shaffof shovqin
    a = a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))  # mayda dog'lar
    im.putalpha(a)
    return im


def kes(im):
    bb = im.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox()
    if not bb:
        return None
    pad = 8
    x0, y0, x1, y1 = bb
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def ishla(n):
    yol = os.path.join(MANBA, f"{n}.png")
    if not os.path.exists(yol):
        return
    im = shaffof_qil(Image.open(yol))
    nomlar = NOMLAR[n]
    w = im.width / len(nomlar)
    os.makedirs(CHIQ, exist_ok=True)
    for i, nom in enumerate(nomlar):
        bo = kes(im.crop((round(i * w), 0, round((i + 1) * w), im.height)))
        if bo is None:
            print("bo'sh:", nom)
            continue
        k = BALAND / bo.height
        bo = bo.resize((max(1, round(bo.width * k)), BALAND), Image.LANCZOS)
        chiq = os.path.join(CHIQ, nom + ".webp")
        bo.save(chiq, "WEBP", quality=88, method=6)
        print(f"{nom:<22} {bo.size}  {os.path.getsize(chiq) // 1024} KB")


if __name__ == "__main__":
    for n in ([int(sys.argv[1])] if len(sys.argv) > 1 else range(10)):
        ishla(n)
