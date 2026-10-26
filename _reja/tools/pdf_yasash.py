#!/usr/bin/env python3
"""Tayyor PDF fayllarni yasash (ma'ruzalar va testlar) — saytdagi «PDF yuklab olish», «1-test — PDF», «2-test — PDF» uchun.

Fayl nomi = mavzu nomi (brauzerning PDF ko'rish oynasi yuklab olishda fayl nomini manzildan oladi):
  pdf/6-sinf Aylananing uzunligi.pdf            — ma'ruza (faqat <body data-a4> bo'lganlari)
  pdf/6-sinf Aylananing uzunligi 1-test.pdf     — 1-test (oson), «... 2-test.pdf» — 2-test (qiyin)
pdf/royxat.json — kalit (ma'ruza: maruza fayli nomi «6-aylana-uzunligi»; test: «6-aylana-uzunligi-1-test») →
  { "fayl": "6-sinf Aylananing uzunligi.pdf", "sahifa": 14, "hajm": baytlar, "v": "imzo" }.
Tugmalar shu ro'yxatga qaraydi: fayl bo'lsa — PDF yangi oynada (brauzerning o'z PDF oynasida) ochiladi;
bo'lmasa — eski usul (chop etish oynasi).

Ishlatish (loyiha ildizidan):
  python3 _reja/tools/pdf_yasash.py                      # hammasi: data-a4 ma'ruzalar + 5–11-sinf barcha 20+20 testlari
  python3 _reja/tools/pdf_yasash.py 6-aylana-uzunligi     # bitta ma'ruza (maruza/6-aylana-uzunligi.html)
  python3 _reja/tools/pdf_yasash.py "test:6|matematika|aylana-uzunligi"   # bitta mavzuning ikkala testi
  python3 _reja/tools/pdf_yasash.py --maruza             # faqat ma'ruzalar;  --test — faqat testlar
Ma'ruza yoki test o'zgarsa — shu buyruqni qayta ishga tushiring. Ko'rinishi o'zgarmagan fayl qayta yozilmaydi.

Kerak: pip install playwright pymupdf && python3 -m playwright install chromium
KaTeX: internetdan (cdn.jsdelivr.net) yoki MATHLEARN_KATEX=<.../node_modules/katex> dan olinadi.
"""
import hashlib
import json
import os
import re
import socket
import subprocess
import sys
import time
from pathlib import Path

import pymupdf
from playwright.sync_api import sync_playwright

ILDIZ = Path(__file__).resolve().parents[2]
PDF = ILDIZ / "pdf"
ROYXAT = PDF / "royxat.json"
KATEX_URL = "katex@0.16.11/dist/"


def fayl_nomi(sinf, sarlavha, qoshimcha=""):
    """«6-sinf Aylananing uzunligi 1-test» — faqat harf, raqam, bo'sh joy, ' - , ( ) ° ² ³ qoladi."""
    t = re.sub(r"^[\d.]+\s*", "", sarlavha.strip())
    t = re.sub(r"[‘’ʻʼ`´]", "'", t)
    t = re.sub(r"[—–]", " ", t)
    t = re.sub(r"[^0-9A-Za-zÀ-ɏЀ-ӿ°²³ ',()\-]+", " ", t)
    nom = re.sub(r"\s+", " ", f"{sinf}-sinf {t} {qoshimcha}")
    return re.sub(r"\s+([,)])", r"\1", re.sub(r"\(\s+", "(", nom)).strip(" -,")


def katex_papka():
    nomzodlar = [os.environ.get("MATHLEARN_KATEX", "")]
    nomzodlar += [str(p) for p in Path("/private/tmp").glob("claude-*/*/*/scratchpad/node_modules/katex")]
    for n in nomzodlar:
        if n and (Path(n) / "dist" / "katex.min.js").exists():
            return Path(n) / "dist"
    return None


def server_boshla():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    pr = subprocess.Popen([sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
                          cwd=ILDIZ, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(50):
        try:
            socket.create_connection(("127.0.0.1", port), timeout=0.2).close()
            return pr, f"http://127.0.0.1:{port}"
        except OSError:
            time.sleep(0.1)
    pr.terminate()
    raise SystemExit("Lokal server ishga tushmadi")


def korinish(fayl):
    """Faylning ko'rinishi (har bet 60 dpi rasmining imzosi) — Chromium har safar baytlari boshqacha PDF beradi."""
    d = pymupdf.open(fayl)
    h = hashlib.md5(str(d.page_count).encode())
    for bet in d:
        h.update(bet.get_pixmap(dpi=60).samples)
    d.close()
    return h.hexdigest()


def a4_maruzalar():
    return sorted(p.stem for p in (ILDIZ / "maruza").glob("*.html")
                  if re.search(r"<body[^>]*\bdata-a4\b", p.read_text(encoding="utf-8")))


SAYT_JS = r"""() => {
  const lec = {}, tests = [], nom = {};
  (SITE_DATA.grades || []).forEach(g => (g.subjects || []).forEach(s => {
    const walk = (arr) => (arr || []).forEach(t => {
      if (!t || typeof t !== "object") return;
      if (t.id && t.title) nom[g.id + "|" + s.id + "|" + t.id] = t.title;
      if (t.id && t.lecture && t.lecture.embedUrl && /^maruza\//.test(t.lecture.embedUrl))
        lec[t.lecture.embedUrl.replace(/^maruza\//, "").replace(/\.html?$/, "")] = { sinf: g.id, nom: t.title };
      walk(t.topics); walk(t.children);
    });
    walk(s.topics); walk(s.chapters);
  }));
  Object.keys(QUIZ_DATA).forEach(k => {
    const p = k.split("|"), d = QUIZ_DATA[k];
    if (+p[0] >= 5 && d && !Array.isArray(d) && (d.oson || d.qiyin))
      tests.push({ key: k, nom: nom[k] || "", oson: !!(d.oson && d.oson.length), qiyin: !!(d.qiyin && d.qiyin.length) });
  });
  return { lec, tests };
}"""


def main():
    args = sys.argv[1:]
    faqat_m = "--maruza" in args
    faqat_t = "--test" in args
    nomlar = [a for a in args if not a.startswith("--")]
    PDF.mkdir(exist_ok=True)
    royxat = json.loads(ROYXAT.read_text(encoding="utf-8")) if ROYXAT.exists() else {}

    pr, BASE = server_boshla()
    kx = katex_papka()
    natija, xatolar, ozgarmadi = [], [], []
    try:
        with sync_playwright() as p:
            br = p.chromium.launch()
            ctx = br.new_context(viewport={"width": 1100, "height": 1400}, color_scheme="light", device_scale_factor=1)
            if kx:
                def katex(route):
                    f = kx / route.request.url.split(KATEX_URL, 1)[1].split("?")[0]
                    if f.exists():
                        route.fulfill(path=str(f))
                    else:
                        route.continue_()
                ctx.route("**/" + KATEX_URL + "**", katex)
            pg = ctx.new_page()
            xato = []
            pg.on("pageerror", lambda e: xato.append(str(e)))

            pg.goto(BASE + "/test.html", wait_until="load")
            sayt = pg.evaluate(SAYT_JS)

            ish = []   # (kalit, fayl nomi, url, tayyor-belgisi)
            tanlangan_m = [n for n in nomlar if not n.startswith("test:")]
            tanlangan_t = [n[5:] for n in nomlar if n.startswith("test:")]
            if not faqat_t and (not nomlar or tanlangan_m):
                for m in (tanlangan_m or a4_maruzalar()):
                    if not (ILDIZ / "maruza" / (m + ".html")).exists():
                        xatolar.append(f"{m}: maruza/{m}.html yo'q")
                        continue
                    l = sayt["lec"].get(m)
                    if not l:
                        xatolar.append(f"{m}: data.js da bu ma'ruzali mavzu topilmadi")
                        continue
                    ish.append((m, fayl_nomi(l["sinf"], l["nom"]), f"{BASE}/maruza/{m}.html?pdf=1", "html.a4-pdf-tayyor"))
            if not faqat_m and (not nomlar or tanlangan_t):
                for t in sayt["tests"]:
                    if tanlangan_t and t["key"] not in tanlangan_t:
                        continue
                    g, fan, mid = t["key"].split("|")
                    for tur, n in (("oson", 1), ("qiyin", 2)):
                        if t[tur]:
                            ish.append((f"{g}-{mid}-{n}-test", fayl_nomi(g, t["nom"] or mid, f"{n}-test"),
                                        f"{BASE}/test.html?sinf={g}&fan={fan}&mavzu={mid}&pdf={tur}&tayyor=1",
                                        "html.qz-pdf-tayyor"))
                if tanlangan_t and not any(i[0].endswith("-test") for i in ish):
                    xatolar.append("test: bunday kalit topilmadi: " + ", ".join(tanlangan_t))

            band = {}
            for kalit, nom, _, _ in ish:
                if nom in band:
                    xatolar.append(f"{kalit}: fayl nomi «{nom}» {band[nom]} bilan bir xil")
                band[nom] = kalit

            for kalit, nom, url, belgi in ish:
                ok = False
                for _ in range(2):   # sekin tarmoqda bir marta qayta uriniladi
                    xato.clear()
                    try:
                        pg.goto(url, wait_until="load")
                        pg.wait_for_selector(belgi, state="attached", timeout=20000)
                        ok = True
                        break
                    except Exception:
                        pass
                if not ok:
                    xatolar.append(f"{kalit}: sahifa tayyor bo'lmadi" + (" — " + xato[0][:120] if xato else ""))
                    continue
                pg.evaluate("() => document.fonts.ready")
                pg.wait_for_timeout(150)
                info = pg.evaluate("""() => ({ varaq: document.querySelectorAll('.a4-varaq').length,
                    katex: document.querySelectorAll('.katex').length, kxato: document.querySelectorAll('.katex-error').length,
                    xom: /\\\\\\(|\\\\frac/.test(document.body.innerText) })""")
                chiqish = PDF / (nom + ".pdf")
                xom = PDF / (kalit + ".xom.tmp")
                yangi = PDF / (kalit + ".yangi.tmp")
                pg.pdf(path=str(xom), format="A4", print_background=True, prefer_css_page_size=True)
                doc = pymupdf.open(xom)
                sahifa = doc.page_count
                doc.set_metadata({"title": nom, "author": "Mathlearn", "creator": "Mathlearn (mathlearn.uz)", "producer": "Mathlearn"})
                doc.save(yangi, garbage=4, deflate=True, no_new_id=True)
                doc.close()
                xom.unlink()
                # ko'rinishi va sarlavhasi o'zgarmagan bo'lsa — eski fayl qoladi (git'da keraksiz o'zgarish bo'lmasin)
                if chiqish.exists() and pymupdf.open(chiqish).metadata.get("title") == nom and korinish(chiqish) == korinish(yangi):
                    yangi.unlink()
                    ozgarmadi.append(kalit)
                else:
                    yangi.replace(chiqish)
                # mavzu nomi o'zgargan bo'lsa — eski nomdagi fayl o'chiriladi
                eski = royxat.get(kalit, {}).get("fayl")
                if eski and eski != chiqish.name and (PDF / eski).exists():
                    (PDF / eski).unlink()
                hajm = chiqish.stat().st_size
                royxat[kalit] = {"fayl": chiqish.name, "sahifa": sahifa, "hajm": hajm,
                                 "v": hashlib.md5(chiqish.read_bytes()).hexdigest()[:8]}
                izoh = []
                if info["varaq"] and info["varaq"] != sahifa:
                    izoh.append(f"ekranda {info['varaq']} varaq, PDF da {sahifa}")
                if info["kxato"] or info["xom"] or (info["varaq"] and not info["katex"]):
                    izoh.append(f"formulalar: katex={info['katex']} xato={info['kxato']} xom={info['xom']}")
                if xato:
                    izoh.append("JS xato: " + xato[0][:120])
                if izoh:
                    xatolar.append(f"{kalit}: " + "; ".join(izoh))
                natija.append((kalit, sahifa, hajm))
                print(f"  {chiqish.name} — {sahifa} bet, {hajm / 1024:.0f} KB" + (" (o'zgarmadi)" if kalit in ozgarmadi else ""), flush=True)
            br.close()
    finally:
        pr.terminate()
        pr.wait()

    # fayli yo'q yozuvlar ro'yxatdan, ro'yxatda yo'q PDF'lar papkadan olib tashlanadi
    royxat = {k: v for k, v in sorted(royxat.items()) if (PDF / v.get("fayl", "-")).exists()}
    kerakli = {v["fayl"] for v in royxat.values()}
    ortiqcha = [f for f in PDF.glob("*.pdf") if f.name not in kerakli]
    for f in ortiqcha:
        f.unlink()
    ROYXAT.write_text(json.dumps(royxat, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    jami = sum(v["hajm"] for v in royxat.values())
    print(f"\nYasaldi: {len(natija)} ta fayl, {sum(n[1] for n in natija)} bet, "
          f"{sum(n[2] for n in natija) / 1048576:.1f} MB; o'zgarmagani (eski fayl qoldi): {len(ozgarmadi)}"
          + (f"; ortiqcha o'chirildi: {len(ortiqcha)}" if ortiqcha else ""))
    print(f"pdf/ papkada jami: {len(royxat)} ta fayl, {jami / 1048576:.1f} MB (KaTeX: {'lokal' if kx else 'internet'})")
    if xatolar:
        print("\nDIQQAT:")
        for x in xatolar:
            print("  - " + x)
        sys.exit(1)
    print("Xato yo'q.")


if __name__ == "__main__":
    main()
