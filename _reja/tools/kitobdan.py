# Ma'ruza sahifasidagi ifodalarni kitob matni bilan solishtiradi: aynan bir xil "son amal son" juftlari topiladi.
# Foydalanish: python3 _reja/kitob.py N > /tmp/kN.txt ; python3 _reja/tools/kitobdan.py /tmp/kN.txt maruza/5-<id>.html
# Juftlar tartibsiz solishtiriladi (8 · 5 = 5 · 8). Juda oddiy juftlar (ikkala son ≤ 3) e'tiborga olinmaydi.
import re, sys, html

SON = r"\d+(?:\s+\d+/\d+|/\d+)?"          # 12, 3/4, 2 1/3

def kitob_matn(t):
    t = t.replace("÷", ":").replace("–", "-").replace("−", "-")
    t = re.sub(r"(\d+)\s*\|\s*(\d+)", r"\1/\2", t)       # 3 | 4 -> 3/4
    return t

def sahifa_matn(s):
    s = html.unescape(re.sub(r"<script.*?</script>", " ", s, flags=re.S))
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\\(sur|mx|nat)\{([^{}]*)\}", r"\2", s)
    s = re.sub(r"(\d+)\s*\\frac\{(\d+)\}\{(\d+)\}", r"\1 \2/\3", s)
    s = re.sub(r"\\frac\{(\d+)\}\{(\d+)\}", r"\1/\2", s)
    for a, b in [("\\cdot", "×"), ("·", "×"), ("\\times", "×"), ("\\(", " "), ("\\)", " "), ("−", "-"), ("\u00a0", " ")]:
        s = s.replace(a, b)
    return s

def juftlar(t):
    t = re.sub(r"(?<=\d) (?=\d{3}(?!\d))", "", t)
    out = {}
    for m in re.finditer(rf"({SON})\s*([×:+\-])\s*({SON})", t):
        a, op, b = m.group(1).strip(), m.group(2), m.group(3).strip()
        nums = [int(x) for x in re.findall(r"\d+", a + " " + b)]
        if max(nums) <= 3:
            continue
        key = (op, frozenset([a, b])) if op in "×+" else (op, a, b)
        out.setdefault(key, m.group(0).strip())
    return out

k = juftlar(kitob_matn(open(sys.argv[1], encoding="utf-8").read()))
p = juftlar(sahifa_matn(open(sys.argv[2], encoding="utf-8").read()))
mos = sorted({p[x] for x in p if x in k})
print(f"sahifada {len(p)} ta ifoda, kitob bilan bir xil: {len(mos)}")
for x in mos:
    print("   ", x)
