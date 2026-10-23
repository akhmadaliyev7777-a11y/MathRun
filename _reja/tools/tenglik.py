# Ma'ruza sahifasidagi tenglik zanjirlarini (+ − · : qavs, \frac, aralash son, foiz %) Fraction bilan hisoblab tekshiradi.
# Foydalanish: python3 _reja/tools/tenglik.py maruza/5-<id>.html
# «XATO» chiqqanlar: atayin xato misollar (Diqqat, Xatoni toping), □ topshiriqlar, qoldiqli bo'lish — qo'lda ko'rib chiqiladi.
import re, sys, html
from fractions import Fraction
with open(sys.argv[1], encoding="utf-8") as f:
    t = f.read()
t = re.sub(r"<script.*?</script>", " ", t, flags=re.S)
t = re.sub(r"<br\s*/?>", " ; ", t)
t = re.sub(r"<[^>]+>", " ", t)
t = html.unescape(t)
t = t.replace("\\(", " ").replace("\\)", " ")
t = re.sub(r"\\(nat|sur|mx)\{([^{}]*)\}", r"\2", t)
for a, b in [("°", ""), ("\\angle", ""), ("\\cdot", "*"), ("·", "*"), ("×", "*"), ("\\,", ""), ("\\;", " "), ("\u00a0", " "), ("−", "-"), ("\\approx", "≈"), ("\\dots", "…")]:
    t = t.replace(a, b)
t = re.sub(r"(?<=\d) (?=\d{3}(?!\d))", "", t)
# o'nli kasr: 0,67 -> (067/100)
t = re.sub(r"(\d+),(\d+)", lambda m: "(" + m.group(1) + m.group(2) + "/1" + "0" * len(m.group(2)) + ")", t)
# foiz: 47% -> (47/100)
t = re.sub(r"(\d+)\s*\\?%", r"(\1/100)", t)
# kasrlar: 2\frac{1}{3} -> (2+1/3), \frac{3}{5} -> (3/5)
t = re.sub(r"(\d+)\s*\\frac\{\s*(\d+)\s*\}\{\s*(\d+)\s*\}", r"(\1+\2/\3)", t)
t = re.sub(r"\\frac\{\s*(\d+)\s*\}\{\s*(\d+)\s*\}", r"(\1/\2)", t)
# qavsdan keyingi foiz: (1100/25)% -> (1100/25)*(1/100)
t = re.sub(r"\)\s*\\?%", ")*(1/100)", t)
part = r"[\d(][\d\s+\-*:()/]*[\d)]"
ok = bad = 0
def val(p):
    p = p.strip()
    if p.count("(") != p.count(")"): return None
    e = re.sub(r"(\d+)", r"Fraction(\1)", p).replace(":", "/")
    try: return eval(e)
    except Exception: return None
for m in re.finditer(rf"{part}(?:\s*=\s*{part})+", t):
    parts = m.group(0).split("=")
    vals = [val(p) for p in parts]
    if None in vals: continue
    if len(set(vals)) == 1: ok += 1
    else:
        bad += 1; print("XATO:", " = ".join(x.strip() for x in parts), "->", [str(v) for v in vals])
print("to'g'ri:", ok, " xato:", bad)
