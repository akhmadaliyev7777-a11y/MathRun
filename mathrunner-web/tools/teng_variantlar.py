# -*- coding: utf-8 -*-
"""Test/o'yin variantlarida qiymati TENG bo'lib qolgan javoblarni topadi.

Muammo: «1/3 × 3 = ?» savolida to'g'ri javob «1», lekin noto'g'ri deb berilgan
«3/3» ham aslida 1 ga teng — o'quvchi to'g'ri tanlasa ham xato deb belgilanadi.

Tekshiradi:
  data/banks/*_questions.json   — correctAnswer + wrongAnswers (test sahifasi va o'yinlar)
  data/banks/*_tasks.json       — options bo'lgan o'yin topshiriqlari (target/javob ichida bormi)
  data/tug_questions.json       — arqon tortish (options + correct indeks)

Sonlarni tushunadi: butun son, «1 000» (bo'sh joyli), o'nli kasr (0,5 / 0.5),
oddiy kasr (3/4), aralash son (2 1/3), manfiy son; oxiridagi bir xil so'z
(«12 kg», «5 ta», «3 soatda yetadi») bo'lsa — so'z ham bir xil bo'lishi kerak.
Qiymatlar fractions.Fraction bilan solishtiriladi.

Natija:
  XATO   — variant javobga qiymatan teng (yoki aynan bir xil), ikki noto'g'ri
           variant o'zaro teng, javob variantlar ichida yo'q.
  SHUBHA — faqat o'lchov birligini almashtirganda yoki ifodani hisoblaganda teng
           chiqadi (masalan «1 m» va «100 cm», «2 + 3» va «5») — ko'zdan kechiring.
  QABUL  — QABUL ro'yxatidagi savollar (atayin teng shakl so'raladi) — sanalmaydi.
  GAP    — «2/4 katta» / «1/2 katta» kabi savoldagi sonlarni taqqoslovchi gaplar
           (javob «teng») — xato emas, faqat -v bilan ko'rsatiladi.

Ishlatish:  python3 tools/teng_variantlar.py [-v]
Chiqish kodi: XATO bo'lsa 1, aks holda 0.
"""
import json, glob, os, re, sys
from fractions import Fraction
from itertools import combinations

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))

# Atayin «bir xil qiymat, boshqa shakl» so'raladigan savollar: id -> sabab.
# (Bunday savolda variantlar ichida teng qiymat bo'lishi mumkin, lekin faqat bittasi
#  so'ralgan shaklda bo'lishi kerak.) Yangi holat topilsa — ko'zdan kechirib shu yerga yozing.
QABUL = {
}

NUM = r"-?\d+(?:[.,]\d+)?"
RE_MIXED = re.compile(r"^(-?)(\d+) (\d+)/(\d+)$")
RE_FRAC = re.compile(r"^(-?\d+)/(\d+)$")
RE_THOUS = re.compile(r"^-?\d{1,3}(?: \d{3})+$")
RE_DEC = re.compile(r"^" + NUM + r"$")

# o'lchov birliklari -> (tur, asosiy birlikdagi ko'paytuvchi)
UNITS = {
    "mm": ("uz", 1), "sm": ("uz", 10), "cm": ("uz", 10), "dm": ("uz", 100), "m": ("uz", 1000), "km": ("uz", 1000000),
    "g": ("og", 1), "gr": ("og", 1), "kg": ("og", 1000), "s": ("og", 100000), "sr": ("og", 100000), "t": ("og", 1000000),
    "ml": ("hj", 1), "l": ("hj", 1000), "litr": ("hj", 1000),
    "sekund": ("vq", 1), "sek": ("vq", 1), "min": ("vq", 60), "minut": ("vq", 60), "daqiqa": ("vq", 60), "soat": ("vq", 3600),
    "sutka": ("vq", 86400), "kun": ("vq", 86400), "hafta": ("vq", 604800),
    "tiyin": ("pul", 1), "so'm": ("pul", 100),
}


def norm(s):
    s = str(s).replace("−", "-").replace(" ", " ").replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip()


def num(s):
    """Faqat son bo'lsa Fraction, aks holda None."""
    m = RE_MIXED.match(s)
    if m:
        sg, w, a, b = m.groups()
        if int(b) == 0:
            return None
        v = int(w) + Fraction(int(a), int(b))
        return -v if sg else v
    m = RE_FRAC.match(s)
    if m:
        return Fraction(int(m.group(1)), int(m.group(2))) if int(m.group(2)) else None
    if RE_THOUS.match(s):
        return Fraction(int(s.replace(" ", "")))
    if RE_DEC.match(s):
        return Fraction(s.replace(",", "."))
    return None


def value(s):
    """(qiymat, qo'shimcha so'z) — son + ixtiyoriy so'z; son bo'lmasa None."""
    s = norm(s)
    v = num(s)
    if v is not None:
        return v, ""
    # son + so'z: oxirgi bo'sh joygacha bo'lgan eng uzun son qismi
    parts = s.split(" ")
    for k in range(len(parts) - 1, 0, -1):
        head, tail = " ".join(parts[:k]), " ".join(parts[k:])
        v = num(head)
        if v is not None and re.match(r"^[^\d]", tail):
            return v, tail.lower()
    return None


def unit_value(s):
    """«1 m 20 sm», «120 sm» -> (tur, asosiy birlikda qiymat)."""
    s = norm(s).lower()
    toks = re.findall(r"(" + NUM + r"(?: \d+/\d+)?)\s*([a-z']+)", s)
    if not toks or re.sub(r"(" + NUM + r"(?: \d+/\d+)?)\s*([a-z']+)", "", s).strip():
        return None
    kind, tot = None, Fraction(0)
    for n, u in toks:
        if u not in UNITS:
            return None
        k, f = UNITS[u]
        if kind and kind != k:
            return None
        kind = k
        tot += num(n) * f
    return kind, tot


def expr_value(s):
    """Faqat sonlar va + - × · * : ( ) dan iborat ifodani hisoblaydi (bitta '=' siz)."""
    s = norm(s)
    if "=" in s or not re.search(r"[+\-×·*:]", s.lstrip("-")):
        return None
    if not re.fullmatch(r"[\d\s.,/+\-×·*:()]+", s):
        return None
    t = s.replace("×", "*").replace("·", "*").replace(":", "/")
    t = re.sub(r"(\d+),(\d+)", r"\1.\2", t)
    t = re.sub(r"(\d+(?:\.\d+)?)", r"Fraction('\1')", t)
    try:
        return eval(t, {"__builtins__": {}, "Fraction": Fraction})
    except Exception:
        return None


def check_options(qid, text, options, answer_idx):
    """[(daraja, xabar)] qaytaradi."""
    out = []
    opts = [norm(o) for o in options]
    text_n = norm(text)
    for i, j in combinations(range(len(opts)), 2):
        a, b = opts[i], opts[j]
        tag = "javob" if answer_idx in (i, j) else "ikki chalg'ituvchi"
        if a == b:
            out.append(("XATO", f"aynan bir xil variant ({tag}): «{a}»"))
            continue
        va, vb = value(a), value(b)
        if va is not None and vb is not None and va == vb:
            ha, hb = a[:len(a) - len(va[1])].strip(), b[:len(b) - len(vb[1])].strip()
            if va[1] and ha in text_n and hb in text_n:
                # «6/6 oldinroq» / «1 oldinroq» — savoldagi ikki sonni taqqoslovchi gaplar
                # (to'g'ri javob «teng»): son emas, da'vo; ikkalasi ham noto'g'ri — normal.
                out.append(("GAP", f"taqqoslash gaplari: «{a}» / «{b}»"))
                continue
            out.append(("XATO", f"qiymati teng ({tag}): «{a}» = «{b}»"))
            continue
        ua, ub = unit_value(a), unit_value(b)
        if ua and ub and ua == ub:
            out.append(("SHUBHA", f"birlik almashtirilsa teng ({tag}): «{a}» = «{b}»"))
            continue
        ea = expr_value(a) if expr_value(a) is not None else (va[0] if va and not va[1] else None)
        eb = expr_value(b) if expr_value(b) is not None else (vb[0] if vb and not vb[1] else None)
        if ea is not None and eb is not None and ea == eb and (expr_value(a) is not None or expr_value(b) is not None):
            out.append(("SHUBHA", f"ifoda hisoblansa teng ({tag}): «{a}» = «{b}»"))
    return out


def main():
    verbose = "-v" in sys.argv
    rows = []          # (daraja, fayl, id, savol, xabar)
    n_q = 0

    for f in sorted(glob.glob(os.path.join(DATA, "banks", "*.json"))):
        name = os.path.basename(f)
        data = json.load(open(f, encoding="utf-8"))
        for q in data:
            qid = q.get("id", "?")
            if "correctAnswer" in q:
                n_q += 1
                wr = q.get("wrongAnswers") or []
                if not wr:
                    rows.append(("XATO", name, qid, q.get("question", ""), "noto'g'ri variantlar yo'q"))
                    continue
                opts = [q["correctAnswer"]] + list(wr)
                for lv, msg in check_options(qid, q.get("question", ""), opts, 0):
                    rows.append((lv, name, qid, q.get("question", ""), msg))
            elif "options" in q:
                n_q += 1
                opts = q["options"]
                if "target" in q:
                    if q["target"] not in opts:
                        rows.append(("XATO", name, qid, q.get("prompt", ""), f"javob «{q['target']}» variantlar ichida yo'q"))
                        continue
                    ai = opts.index(q["target"])
                elif "total" in q and "knownWeight" in q:   # tarozi
                    ans = Fraction(q["total"] - q["knownWeight"], q["shapeCount"])
                    hits = [i for i, o in enumerate(opts) if Fraction(o) == ans]
                    if len(hits) != 1:
                        rows.append(("XATO", name, qid, q.get("prompt", ""), f"javob {ans} variantlar ichida {len(hits)} marta"))
                        continue
                    ai = hits[0]
                else:
                    ai = 0
                for lv, msg in check_options(qid, q.get("prompt", ""), [str(o) for o in opts], ai):
                    rows.append((lv, name, qid, q.get("prompt", ""), msg))

    tug = os.path.join(DATA, "tug_questions.json")
    if os.path.exists(tug):
        for cat in json.load(open(tug, encoding="utf-8"))["categories"]:
            for k, q in enumerate(cat["questions"]):
                n_q += 1
                qid = f"tug:{cat['id']}#{k}"
                if not (0 <= q["correct"] < len(q["options"])):
                    rows.append(("XATO", "tug_questions.json", qid, q["q"], "correct indeksi variantlardan tashqarida"))
                    continue
                for lv, msg in check_options(qid, q["q"], q["options"], q["correct"]):
                    rows.append((lv, "tug_questions.json", qid, q["q"], msg))

    qabul = [r for r in rows if r[2] in QABUL]
    rows = [r for r in rows if r[2] not in QABUL]
    gap = [r for r in rows if r[0] == "GAP"]
    xato = [r for r in rows if r[0] == "XATO"]
    shubha = [r for r in rows if r[0] == "SHUBHA"]

    for lv, name, qid, text, msg in xato + shubha:
        print(f"{lv:6} {name} {qid}\n       savol: {text}\n       {msg}")
    if verbose:
        for lv, name, qid, text, msg in qabul:
            print(f"QABUL  {name} {qid}: {msg}  — {QABUL[qid]}")
        for lv, name, qid, text, msg in gap:
            print(f"GAP    {name} {qid}: {msg}")
    print(f"\nTekshirildi: {n_q} ta savol/topshiriq. XATO: {len(xato)}, SHUBHA: {len(shubha)}, "
          f"QABUL (atayin teng shakl): {len(qabul)}, taqqoslash gaplari (normal): {len(gap)}")
    return 1 if xato else 0


if __name__ == "__main__":
    sys.exit(main())
