#!/usr/bin/env python3
"""Mavzu bo'yicha darslik va mashq daftari betlarini chiqarish (Claude uchun yordamchi).

  python3 _reja/kitob.py 6            -> 6-mavzuning darslik + daftar matni (ekranga)
  python3 _reja/kitob.py 6 --rasm DIR -> o'sha betlarni PNG qilib DIR ga (ko'rib chiqish uchun)
  python3 _reja/kitob.py royxat       -> barcha mavzular va betlar
  python3 _reja/kitob.py 6:3          -> 6-sinf 3-mavzu (_reja/mavzular6.json)

Bet raqamlari kitobdagi raqam; PDF bet = kitob beti + 4 (to'rtala kitobda).
Rasmlar faqat ko'rib chiqish uchun — saytga kitob rasmi qo'yilmaydi (reja, A2).
"""
import json, os, re, sys
import pymupdf

# kitoblar papkasi: MATHLEARN_KITOB muhit o'zgaruvchisi, bo'lmasa repodagi _kitob/ (gitignore), bo'lmasa kompyuterdagi joy
_ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KITOB = os.environ.get("MATHLEARN_KITOB") or next(
    (p for p in (os.path.join(_ILDIZ, "_kitob"), os.path.expanduser("~/Desktop/maktab darsliklari")) if os.path.isdir(p)),
    os.path.join(_ILDIZ, "_kitob"))
FAYL = {
    "D1": "5-sinf matematika 1-qism darslik.pdf",
    "D2": "5-sinf matematika 2-qism darslik.pdf",
    "M1": "5-sinf matematika 1-qism mashq daftar.pdf",
    "M2": "5-sinf matematika 2-qism mashq daftari.pdf",
}
OFFSET = 4
MAVZU = json.load(open(os.path.join(os.path.dirname(__file__), "mavzular.json")))
# 6-sinf: «python3 _reja/kitob.py 6:3» (sinf:mavzu); kitob nomlari va PDF siljishi (bet + 4) bir xil
if len(sys.argv) > 1 and sys.argv[1].startswith("6:"):
    FAYL = {"D1": "6-sinf matematika 1-qism darslik.pdf", "D2": "6-sinf matematika 2-qism darslik.pdf",
            "M1": "6-sinf matematika 1-mashq daftari.pdf", "M2": "6-sinf matematika 2-mashq daftari.pdf"}
    MAVZU = {"6:" + k: v for k, v in json.load(open(os.path.join(os.path.dirname(__file__), "mavzular6.json"))).items()}


def betlar(oraliq):
    for a, b in oraliq:
        yield from range(a, b + 1)


def matn(kod, bet):
    d = pymupdf.open(os.path.join(KITOB, FAYL[kod]))
    t = d[bet + OFFSET - 1].get_text()
    t = re.sub(r".*MATEMATICS (SCHOOLBOOK|WORKBOOK).*\n?", "", t)
    t = re.sub(r"\d\d/\d\d/\d\d\s+\d\d:\d\d\n?", "", t)
    t = re.sub(r"[\t ]+", " ", t)
    return re.sub(r"\s*\n\s*", " | ", t).strip()


def rasm(kod, bet, papka):
    d = pymupdf.open(os.path.join(KITOB, FAYL[kod]))
    os.makedirs(papka, exist_ok=True)
    yol = os.path.join(papka, f"{kod}-{bet:03d}.png")
    d[bet + OFFSET - 1].get_pixmap(dpi=110).save(yol)
    return yol


def main():
    if len(sys.argv) < 2 or sys.argv[1] == "royxat":
        for n, t in MAVZU.items():
            print(f"{n:>5}  {t['id']:<42} {t['darslik']} {t['d']}  {t['daftar']} {t['m']}")
        return
    t = MAVZU[sys.argv[1]]
    papka = sys.argv[sys.argv.index("--rasm") + 1] if "--rasm" in sys.argv else None
    print(f"# {sys.argv[1]}. {t['nom']}  (data.js id: {t['id']})")
    for kod, oraliq in ((t["darslik"], t["d"]), (t["daftar"], t["m"])):
        for bet in betlar(oraliq):
            if papka:
                print(rasm(kod, bet, papka))
            else:
                print(f"\n[{kod} {bet}-bet] {matn(kod, bet)}")


if __name__ == "__main__":
    main()
