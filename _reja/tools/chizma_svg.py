#!/usr/bin/env python3
"""Ma'ruza chizmalarini (maruza/chizma.js, data-* atributlar) test savollari uchun tayyor SVG satriga aylantiradi.

    from chizma_svg import chizmalar
    svglar = chizmalar(['<div data-kub="3x2x2"></div>', '<div data-geo=\'{...}\'></div>'])

Brauzerda (Playwright, Chromium) maruza sahifasi muhitida chizma.js ishlaydi va tayyor <svg> olinadi.
Server kerak: repo ildizida `python3 -m http.server 8765`.
Natijadagi SVG: width/height olib tashlanadi (test sahifasida o'zi moslashadi), ' belgisi bo'lmaydi.
"""
import re
from playwright.sync_api import sync_playwright

URL = "http://localhost:8765/maruza/_chizma_svg.html"
ROOT = __file__.rsplit("/_reja/", 1)[0]


def chizmalar(htmllar):
    sahifa = ('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="maruza.css?v=30"></head>'
              '<body><main class="m-wrap">' + "".join(f'<div class="ch" id="ch{i}">{h}</div>' for i, h in enumerate(htmllar)) +
              '</main><script src="chizma.js?v=' + "x" + '"></script><script>MaruzaChizma.chiz(document);</script></body></html>')
    yol = ROOT + "/maruza/_chizma_svg.html"
    open(yol, "w").write(sahifa)
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={"width": 900, "height": 900})
            xato = []
            pg.on("pageerror", lambda e: xato.append(str(e)))
            pg.route("**/*", lambda r: r.abort() if ("fonts.g" in r.request.url or "katex" in r.request.url) else r.continue_())
            pg.goto(URL, wait_until="load"); pg.wait_for_timeout(300)
            natija = pg.evaluate("n => [...Array(n).keys()].map(i => { const s = document.querySelector('#ch' + i + ' svg'); return s ? s.outerHTML : null; })", len(htmllar))
            b.close()
        assert not xato, xato
    finally:
        import os
        os.remove(yol)
    out = []
    for i, s in enumerate(natija):
        assert s, f"chizma chiqmadi: {htmllar[i][:80]}"
        s = re.sub(r'\s(width|height)="[^"]*"(?=[^>]*viewBox)', "", s, count=2) if s.startswith("<svg") else s
        s = re.sub(r'^<svg([^>]*?)\swidth="[^"]*"', r"<svg\1", s)
        s = re.sub(r'^<svg([^>]*?)\sheight="[^"]*"', r"<svg\1", s)
        if "xmlns=" not in s[:200]:
            s = s.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
        s = re.sub(r'\sstyle="max-width:[^"]*"', '', s, count=1)
        s = s.replace("'", "’")
        out.append(s)
    return out
