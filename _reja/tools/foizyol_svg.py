#!/usr/bin/env python3
"""Foiz zinasi (bitta qism ma'lum — butunni topish) — test savollari uchun SVG satri.
Ma'ruzadagi data-foizyol (maruza/chizma.js, chizFoizyol) bilan bir xil qoidalar va ko'rinish
(farqi faqat: bu yerda <svg> ga xmlns qo'shiladi). Biri o'zgartirilsa — ikkinchisi ham.

    from foizyol_svg import foizyol
    svg = foizyol("30:60", birlik="ta", tasma=True)          # 30% → 60, 10% → 20, 100% → 200
    svg = foizyol("36:252", orqali=1, yoz="?")               # 1% orqali, oxirgi qiymat «?»
    svg = foizyol("3/8:57", birlik="bet")                    # kasr qism: 3/8 → 57, 1/8 → 19, butun → 152

orqali — oraliq foiz (100 ning bo'luvchisi; berilmasa: 100 foizga bo'linsa — to'g'ridan-to'g'ri, aks holda 10, 5 yoki 1).
yoz="?" — oxirgi qiymat «?»; yoz="??" — oraliq va oxirgi qiymat «?». tasma=True — ustida foizli tasma.
"""
import math
import sys


def _js_str(v):
    """JS dagi String(son) kabi: butun bo'lsa nuqtasiz."""
    v = float(v)
    return str(int(v)) if v.is_integer() else repr(v)


def _f(v):
    return _js_str(math.floor(v * 10 + 0.5) / 10)


def _guruh(t):
    t = str(t)
    if len(t) < 5:
        return t
    out = ""
    for i, ch in enumerate(t):
        if i and (len(t) - i) % 3 == 0:
            out += " "
        out += ch
    return out


def _onli(x):
    t = _js_str(math.floor(x * 1e9 + 0.5) / 1e9).split(".")
    return _guruh(t[0]) + "," + t[1] if len(t) > 1 else _guruh(t[0])


def _num(s):
    return float(s.replace(" ", "").replace(" ", "").replace(",", "."))


def foizyol(qiymat, orqali=None, birlik="", yoz="", tasma=False, izoh=None):
    ix = qiymat.rfind(":")
    pS = qiymat[:ix].replace("%", "").strip()
    m = _num(qiymat[ix + 1:])
    bir = " " + birlik if birlik else ""
    kasr = pS.find("/") > 0
    rows, ops = [], []
    a = b = p = d = 0
    if kasr:
        a, b = (int(x) for x in pS.split("/"))
        rows.append({"a": a, "b": b, "v": m})
        if a != 1:
            rows.append({"a": 1, "b": b, "v": m / a})
            ops.append(": " + str(a))
        rows.append({"t": "butun", "v": rows[-1]["v"] * b})
        ops.append("× " + str(b))
    else:
        p = _num(pS)
        d = float(orqali) if orqali else (p if 100 % p == 0 else 10 if p % 10 == 0 else 5 if p % 5 == 0 else 1)
        rows.append({"t": _onli(p) + "%", "v": m})
        if d != p:
            rows.append({"t": _onli(d) + "%", "v": m / (p / d)})
            ops.append(": " + _onli(p / d))
        rows.append({"t": "100%", "v": rows[-1]["v"] * (100 / d)})
        ops.append("× " + _onli(100 / d))
    n = len(rows)

    def yashir(i):
        return (i == n - 1 and "?" in yoz) or (0 < i < n - 1 and yoz == "??")

    def qiy(i):
        return ("?" if yashir(i) else _onli(rows[i]["v"])) + bir

    W = 380
    svg = ['<defs><marker id="fyq" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#5b6275"/></marker></defs>']
    top = 0
    if tasma:
        L, TW = 20, 340
        jamiU = b if kasr else max(p, 100)
        butunU = b if kasr else 100
        malumU = a if kasr else p
        hujU = 1 if kasr else d
        hujV = m / a if kasr else m / (p / d)
        k = TW / jamiU

        def X(u):
            return L + u * k
        nh = math.floor(jamiU / hujU + 0.5)
        katak = nh <= 20 and abs(jamiU / hujU - nh) < 1e-9
        if not kasr:
            svg.append(f'<line x1="{L}" y1="24" x2="{_f(X(jamiU))}" y2="24" stroke="#1f2433" stroke-width="1.4"/>')
            if katak:
                for i in range(nh + 1):
                    svg.append(f'<line x1="{_f(X(i * hujU))}" y1="19" x2="{_f(X(i * hujU))}" y2="24" stroke="#5b6275" stroke-width="1.2"/>')
            yz = sorted([[0, "0%"], [p, _onli(p) + "%"], [100, "100%"]], key=lambda z: z[0])
            cx = [X(z[0]) for z in yz]
            wz = [len(z[1]) * 8.4 for z in yz]
            for i in range(len(yz)):
                cx[i] = min(max(cx[i], wz[i] / 2 + 1), W - wz[i] / 2 - 1)
            for i in range(len(yz) - 2, -1, -1):
                if cx[i] + wz[i] / 2 + 4 > cx[i + 1] - wz[i + 1] / 2:
                    cx[i] = cx[i + 1] - wz[i + 1] / 2 - 4 - wz[i] / 2
            for i, z in enumerate(yz):
                svg.append(f'<line x1="{_f(X(z[0]))}" y1="17" x2="{_f(X(z[0]))}" y2="27" stroke="#1f2433" stroke-width="1.8"/>'
                           f'<text x="{_f(cx[i])}" y="13" text-anchor="middle" font-size="14" font-weight="800" fill="#1f5fd6">{z[1]}</text>')
        if katak:
            for i in range(nh):
                x, w = X(i * hujU), hujU * k
                on = (i + 1) * hujU <= malumU + 1e-9
                svg.append(f'<rect x="{_f(x)}" y="30" width="{_f(w)}" height="36" fill="{"#ffe6d6" if on else "#fff"}" '
                           f'stroke="{"#d4501b" if on else "#9aa3b5"}" stroke-width="{2 if on else 1.5}"'
                           + ("" if on else ' stroke-dasharray="5 4"') + "/>")
                t = _onli(hujV)
                if nh <= 10 and yoz != "??" and len(t) * 8.5 + 6 <= w:
                    svg.append(f'<text x="{_f(x + w / 2)}" y="54" text-anchor="middle" font-size="15" font-weight="800" '
                               f'fill="{"#d4501b" if on else "#8a93a6"}">{t}</text>')
        else:
            svg.append(f'<rect x="{L}" y="30" width="{_f(malumU * k)}" height="36" fill="#ffe6d6" stroke="#d4501b" stroke-width="2"/>')
            if malumU < jamiU:
                svg.append(f'<rect x="{_f(X(malumU))}" y="30" width="{_f((jamiU - malumU) * k)}" height="36" fill="#fff" stroke="#9aa3b5" stroke-width="1.5" stroke-dasharray="5 4"/>')
        svg.append(f'<rect x="{L}" y="30" width="{_f(butunU * k)}" height="36" fill="none" stroke="#1f2433" stroke-width="2"/>')
        if jamiU > butunU:
            svg.append(f'<line x1="{_f(X(butunU))}" y1="26" x2="{_f(X(butunU))}" y2="70" stroke="#1f2433" stroke-width="2.5" stroke-dasharray="5 4"/>')
        svg.append(f'<path d="M{L + 2} 70 V78 H{_f(X(malumU) - 2)} V70" fill="none" stroke="#d4501b" stroke-width="2"/>'
                   f'<text x="{_f((L + X(malumU)) / 2)}" y="96" text-anchor="middle" font-size="16" font-weight="800" fill="#d4501b">{_onli(m)}{bir}</text>')
        svg.append(f'<path d="M{L + 2} 104 V112 H{_f(X(butunU) - 2)} V104" fill="none" stroke="#12805c" stroke-width="2"/>'
                   f'<text x="{_f((L + X(butunU)) / 2)}" y="130" text-anchor="middle" font-size="16" font-weight="800" fill="#12805c">{qiy(n - 1)}</text>')
        top = 142
    RH, y0 = 84, top + 30
    for i, r in enumerate(rows):
        y = y0 + i * RH
        c = "#d4501b" if i == 0 else "#12805c" if i == n - 1 else "#1f5fd6"
        if "t" in r:
            svg.append(f'<text x="24" y="{y}" font-size="19" font-weight="800" fill="#1f2433">{r["t"]}</text>')
        else:
            w = max(len(str(r["a"])), len(str(r["b"]))) * 11 + 8
            svg.append(f'<text x="{_f(24 + w / 2)}" y="{y - 12}" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">{r["a"]}</text>'
                       f'<line x1="24" y1="{y - 6}" x2="{24 + w}" y2="{y - 6}" stroke="#1f2433" stroke-width="1.8"/>'
                       f'<text x="{_f(24 + w / 2)}" y="{y + 10}" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">{r["b"]}</text>')
        svg.append(f'<line x1="96" y1="{y - 6}" x2="146" y2="{y - 6}" stroke="#5b6275" stroke-width="2.4" marker-end="url(#fyq)"/>'
                   f'<text x="160" y="{y}" font-size="19" font-weight="800" fill="{c}">{qiy(i)}</text>')
        if i < n - 1:
            ya = y + (12 if "t" in r else 18)
            yb = y + RH - 26
            ym = (ya + yb) / 2
            op = ops[i]
            pw = 18 + len(op) * 8
            for x in (44, 180):
                svg.append(f'<line x1="{x}" y1="{ya}" x2="{x}" y2="{yb}" stroke="#d4501b" stroke-width="2.4" marker-end="url(#fyq)"/>'
                           f'<rect x="{x + 10}" y="{_f(ym - 13)}" width="{pw}" height="26" rx="13" fill="#ffe6d6" stroke="#d4501b" stroke-width="1.6"/>'
                           f'<text x="{_f(x + 10 + pw / 2)}" y="{_f(ym + 5)}" text-anchor="middle" font-size="15" font-weight="800" fill="#d4501b">{op}</text>')
    H = y0 + (n - 1) * RH + 18
    if izoh is None:
        izoh = "Foiz zinasi: " + "; ".join((r.get("t") or f'{r["a"]}/{r["b"]}') + " — " + qiy(i) for i, r in enumerate(rows))
    return (f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{izoh.replace(chr(34), "")}">'
            + "".join(svg) + "</svg>")


if __name__ == "__main__":
    # Namuna: python3 _reja/tools/foizyol_svg.py "30:60" [orqali] [birlik] [yoz] [tasma]
    a = sys.argv[1:]
    print(foizyol(a[0], orqali=(a[1] or None) if len(a) > 1 else None, birlik=a[2] if len(a) > 2 else "",
                  yoz=a[3] if len(a) > 3 else "", tasma=len(a) > 4 and a[4] == "1"))
