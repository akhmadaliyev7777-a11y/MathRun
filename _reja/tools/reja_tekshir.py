#!/usr/bin/env python3
# Ish rejasini (_reja/ISH-REJASI.md) tekshirish va ko'rish.
#   python3 _reja/tools/reja_tekshir.py            -> katakchalarni saytning haqiqiy holati bilan solishtiradi
#   python3 _reja/tools/reja_tekshir.py --rasm F   -> yana rejani VS Code'dagidek chizib, F (PNG) ga saqlaydi (Playwright kerak)
# 6-sinf mavzusi «tayyor» deyiladi, agar: maruza/6-<id>.html bor, js/data.js da embedUrl va test havolasi bor,
# js/quizzes.js da "6|matematika|<id>" kaliti bor. Rejada [x] bo'lsa-yu tayyor bo'lmasa (yoki aksincha) — XATO.
import html, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REJA = os.path.join(ROOT, "_reja", "ISH-REJASI.md")
reja = open(REJA, encoding="utf-8").read()
data = open(os.path.join(ROOT, "js", "data.js"), encoding="utf-8").read()
quiz = open(os.path.join(ROOT, "js", "quizzes.js"), encoding="utf-8").read()

# 6-sinf mavzulari: data.js dagi tartib bo'yicha (sarlavha «N. Nomi»)
blok = data[data.index('name: "6-sinf"'):data.index('name: "7-sinf"')]
mavzular = re.findall(r'\{ id: "([^"]+)",[^\n]*?title: "(\d+)\. ([^"]+)"([^\n]*)', blok)

xato = 0
belgilar = {}
for m in re.finditer(r"^- \[( |x|X)\] (\d+)\. ", reja, re.M):
    belgilar.setdefault(int(m.group(2)), []).append(m.group(1).lower() == "x")

for mid, n, nom, qolgan in mavzular:
    n = int(n)
    tayyor = (os.path.exists(os.path.join(ROOT, "maruza", f"6-{mid}.html"))
              and f'embedUrl: "maruza/6-{mid}.html"' in qolgan
              and f"mavzu={mid}" in qolgan
              and f'"6|matematika|{mid}"' in quiz)
    b = belgilar.get(n)
    if not b:
        print(f"XATO  {n}. {nom}: rejada yo'q"); xato += 1
    elif b[-1] != tayyor:
        print(f"XATO  {n}. {nom}: rejada {'[x]' if b[-1] else '[ ]'}, haqiqatda {'tayyor' if tayyor else 'tayyor emas'}"); xato += 1

# «Hozirgi ish» bo'limidagi qadamlar: hammasi [x] bo'lgan mavzu 3-bo'limda ham [x] bo'lishi kerak
for sarlavha, qadamlar in re.findall(r"^### (\d+)\. [^\n]*\n((?:- \[[ xX]\] [^\n]*\n?)+)", reja, re.M):
    hammasi = all(q.lower() == "x" for q in re.findall(r"- \[( |x|X)\]", qadamlar))
    b = belgilar.get(int(sarlavha))
    if b and hammasi != b[-1]:
        print(f"ogoh  {sarlavha}-mavzu: qadamlar {'hammasi bajarilgan' if hammasi else 'chala'}, ro'yxatda {'[x]' if b[-1] else '[ ]'}")

vaqt = re.search(r"Oxirgi yangilanish:\*\* ([0-9: -]+)", reja)
jami = len(re.findall(r"^- \[[ xX]\]", reja, re.M))
bajarilgan = len(re.findall(r"^- \[[xX]\]", reja, re.M))
print(f"Reja: {bajarilgan}/{jami} katakcha belgilangan; oxirgi yangilanish: {vaqt.group(1).strip() if vaqt else '—'}; "
      f"6-sinf mavzulari: {len(mavzular)} ta tekshirildi, {xato} ta XATO")

if "--rasm" in sys.argv:
    out = sys.argv[sys.argv.index("--rasm") + 1]
    # oddiy markdown -> HTML (sarlavha, ro'yxat, katakcha, qalin, kursiv, `kod`, iqtibos)
    def inline(t):
        t = html.escape(t, quote=False)
        t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
        t = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", t)
        t = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", t)
        return t
    qator, ichida = [], False
    for s in reja.splitlines():
        m = re.match(r"^- \[( |x|X)\] (.*)", s)
        if m:
            if not ichida: qator.append('<ul class="contains-task-list">'); ichida = True
            ch = " checked" if m.group(1) != " " else ""
            qator.append(f'<li class="task-list-item"><input class="task-list-item-checkbox" type="checkbox" disabled{ch}> {inline(m.group(2))}</li>')
            continue
        m = re.match(r"^- (.*)", s)
        if m:
            if not ichida: qator.append("<ul>"); ichida = True
            qator.append(f"<li>{inline(m.group(1))}</li>"); continue
        if ichida: qator.append("</ul>"); ichida = False
        m = re.match(r"^(#{1,4}) (.*)", s)
        if m: qator.append(f"<h{len(m.group(1))}>{inline(m.group(2))}</h{len(m.group(1))}>")
        elif s.startswith("> "): qator.append(f"<blockquote>{inline(s[2:])}</blockquote>")
        elif s.strip() == "---": qator.append("<hr>")
        elif s.strip(): qator.append(f"<p>{inline(s)}</p>")
    if ichida: qator.append("</ul>")
    css = open(os.path.join(ROOT, ".vscode", "reja.css"), encoding="utf-8").read()
    sahifa = ("<!doctype html><meta charset='utf-8'><style>body{font:16px -apple-system,Segoe UI,Helvetica,Arial,sans-serif;"
              "max-width:760px;margin:0 auto;padding:24px 32px;color:#1f2328;background:#fff;line-height:1.5}"
              "h1,h2{border-bottom:1px solid #d1d9e0;padding-bottom:.3em}code{background:#eff1f3;padding:.1em .4em;border-radius:6px;font-size:85%}"
              "blockquote{color:#59636e;border-left:4px solid #d1d9e0;margin:0;padding:0 1em}"
              ".contains-task-list{padding-left:0}.task-list-item{list-style:none;margin:4px 0}" + css + "</style>" + "\n".join(qator))
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 820, "height": 900})
        pg.set_content(sahifa)
        pg.screenshot(path=out, full_page=True)
        b.close()
    print("Rasm:", out)

sys.exit(1 if xato else 0)
