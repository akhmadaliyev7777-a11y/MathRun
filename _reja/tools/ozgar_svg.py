#!/usr/bin/env python3
"""O'zgaruvchan nisbat chizmasi («Oldin» va «Keyin» tasmalari) — test savollari uchun SVG satri.
Ma'ruzadagi data-ozgar (maruza/chizma.js, chizOzgar) bilan bir xil qoidalar va ko'rinish
(farqi faqat: bu yerda <svg> ga xmlns qo'shiladi). Biri o'zgartirilsa — ikkinchisi ham.

    from ozgar_svg import ozgar
    svg = ozgar("Oltin:3|Kumush:4 > Oltin:1|Kumush:2", tur="bir", ozgarmas="Oltin", yoz="o:?|d1:10 ta")

tur: "bir" (ozgarmas — o'zgarmagan miqdor nomi), "jami", "farq", "teng" (son="-12,-30" — o'zgarishlar).
yoz: "o:..|k:..|oN:..|kN:..|dN:.." (o/k — o'ng qavs, oN/kN — qator ustida, dN — o'zgargan qism ostida).
bosqich: 1 — faqat Oldin, 2 — bo'lakchasiz, 3 — to'liq. mayda=False — punktir bo'lakchalarsiz.
"""
import math
import sys

TASMA_RANG = [["#dbe7ff", "#1f5fd6"], ["#ffe6d6", "#d4501b"], ["#dcf3e8", "#12805c"], ["#ece4fb", "#6d3fc0"]]


def _f(v):
    r = math.floor(v * 10 + 0.5) / 10
    s = repr(r)
    return s[:-2] if s.endswith(".0") else s


def _oqi(s):
    out = []
    for q in s.split("|"):
        i = q.rfind(":")
        out.append({"nom": q[:i].strip(), "b": float(q[i + 1:])})
    return out


def _js_num(v):
    """JS dagi String(son) kabi: butun bo'lsa nuqtasiz."""
    return str(int(v)) if float(v).is_integer() else repr(v)


def ozgar(ozgar, tur="bir", ozgarmas=None, yoz="", bosqich=3, mayda=True, sarlavha="Oldin|Keyin", son="0,0", izoh=None):
    ikki = ozgar.split(">")
    if len(ikki) != 2:
        return ""
    O, K = _oqi(ikki[0]), _oqi(ikki[1])
    if len(O) != 2 or len(K) != 2:
        return ""
    if tur == "teng":
        ch = [float(x) for x in son.replace("−", "-").split(",")]
        p = (ch[0] - ch[1]) / (K[0]["b"] - K[1]["b"])
        if not p > 0:
            return ""
        newU = [K[0]["b"] * p, K[1]["b"] * p]
        oldU = [newU[0] - ch[0], newU[1] - ch[1]]
        bO, bK = oldU[0], p
    else:
        if tur == "jami":
            x, y0 = O[0]["b"] + O[1]["b"], K[0]["b"] + K[1]["b"]
        elif tur == "farq":
            x, y0 = abs(O[0]["b"] - O[1]["b"]), abs(K[0]["b"] - K[1]["b"])
            if (O[0]["b"] - O[1]["b"]) * (K[0]["b"] - K[1]["b"]) <= 0:
                return ""
        else:
            nomlar = [r["nom"] for r in O]
            i = nomlar.index(ozgarmas) if ozgarmas in nomlar else 1
            x, y0 = O[i]["b"], K[i]["b"]
        E = x / math.gcd(int(x), int(y0)) * y0
        bO, bK = E / x, E / y0
        oldU = [O[0]["b"] * bO, O[1]["b"] * bO]
        newU = [K[0]["b"] * bK, K[1]["b"] * bK]
    if not (oldU[0] > 0 and oldU[1] > 0 and newU[0] >= 0 and newU[1] >= 0):
        return ""
    Y = {}
    for s in (yoz or "").split("|"):
        i = s.find(":")
        if i > 0:
            Y[s[:i].strip()] = s[i + 1:].strip()
    bosq = int(bosqich)
    mayda = mayda and bosq >= 3 and tur != "teng"
    sar = sarlavha.split("|")
    f = _f
    W, Lm, H = 380, 84, 30
    ongM = [s for s in [Y.get("o"), Y.get("k") if bosq >= 2 else ""] if s]
    Rm = 26 + 8.6 * max(len(s) for s in ongM) if ongM else 8
    maxU = max(oldU[0], oldU[1], max(newU[0], newU[1]) if bosq >= 2 else 0)
    u = (W - Lm - Rm) / maxU
    X = lambda v: Lm + v * u
    out = []
    st = {"y": 4}

    def qavsPast(x1, x2, yy, t):
        out.append(f'<path d="M{f(x1)} {f(yy)} V{f(yy + 6)} H{f(x2)} V{f(yy)}" fill="none" stroke="#b45309" stroke-width="1.8"/>')
        tw = len(t) * 7.6
        cx = min(max((x1 + x2) / 2, tw / 2 + 2), W - tw / 2 - 2)
        out.append(f'<text x="{f(cx)}" y="{f(yy + 22)}" text-anchor="middle" font-size="14" font-weight="800" fill="#b45309">{t}</text>')

    def qavsUst(x1, x2, yy, t):
        out.append(f'<path d="M{f(x1)} {f(yy)} V{f(yy - 6)} H{f(x2)} V{f(yy)}" fill="none" stroke="#1f2433" stroke-width="1.8"/>')
        tw = len(t) * 8.2
        cx = min(max((x1 + x2) / 2, tw / 2 + 2), W - tw / 2 - 2)
        out.append(f'<text x="{f(cx)}" y="{f(yy - 11)}" text-anchor="middle" font-size="15" font-weight="800" fill="#1f2433">{t}</text>')

    def qavsOng(y1, y2, t):
        x = X(maxU) + 6
        ym = (y1 + y2) / 2
        out.append(f'<path d="M{f(x)} {f(y1)} Q{f(x + 7)} {f(y1)} {f(x + 7)} {f(y1 + 8)} V{f(ym - 6)}'
                   f' Q{f(x + 7)} {f(ym)} {f(x + 13)} {f(ym)} Q{f(x + 7)} {f(ym)} {f(x + 7)} {f(ym + 6)}'
                   f' V{f(y2 - 8)} Q{f(x + 7)} {f(y2)} {f(x)} {f(y2)}" fill="none" stroke="#1f2433" stroke-width="1.8"/>')
        out.append(f'<text x="{f(x + 17)}" y="{f(ym + 6)}" font-size="16" font-weight="800" fill="#1f2433">{t}</text>')

    def guruh(nomi, qatorlar, ongKalit, ustKalit):
        out.append(f'<text x="4" y="{f(st["y"] + 14)}" font-size="14" font-style="italic" font-weight="700" fill="#5f6676">{nomi}</text>')
        st["y"] += 22
        ys = []
        for i, r in enumerate(qatorlar):
            c = TASMA_RANG[i % len(TASMA_RANG)]
            ust = Y.get(ustKalit + str(i))
            if ust:
                st["y"] += 22
            y = st["y"]
            ys.append(y)
            out.append(f'<text x="{Lm - 8}" y="{f(y + H / 2 + 5)}" text-anchor="end" font-size="15" font-weight="700" fill="#1f2433">{r["nom"]}</text>')
            if r["len"] > 0:
                out.append(f'<rect x="{f(Lm)}" y="{f(y)}" width="{f(r["len"] * u)}" height="{H}" fill="{c[0]}"/>')
            if r.get("qosh"):
                q = r["qosh"]
                op = f' fill-opacity="{q[3]}"' if q[3] else ""
                out.append(f'<rect x="{f(X(q[0]))}" y="{f(y)}" width="{f((q[1] - q[0]) * u)}" height="{H}" fill="{q[2]}"{op}/>')
            if r.get("ayir"):
                a = r["ayir"]
                out.append(f'<rect x="{f(X(a[0]))}" y="{f(y + 1)}" width="{f((a[1] - a[0]) * u)}" height="{H - 2}" rx="2" fill="#fff" stroke="{c[1]}" stroke-width="1.8" stroke-dasharray="6 4"/>')
            if mayda:
                oxir = r["ayir"][1] if r.get("ayir") else r["len"]
                k = 1
                while k < oxir:
                    if (k < r["len"] and k % r["blok"] == 0) or k == r["len"]:
                        k += 1
                        continue
                    ich = k < r["len"]
                    out.append(f'<line x1="{f(X(k))}" y1="{f(y + 3)}" x2="{f(X(k))}" y2="{f(y + H - 3)}" stroke="{c[1]}" stroke-width="1.2" stroke-dasharray="3 3" opacity="{".75" if ich else ".45"}"/>')
                    k += 1
            s = 0.0
            while s < r["len"] - 1e-9:
                out.append(f'<rect x="{f(X(s))}" y="{f(y)}" width="{f(min(r["blok"], r["len"] - s) * u)}" height="{H}" rx="2" fill="none" stroke="{c[1]}" stroke-width="2"/>')
                s += r["blok"]
            if ust and r["len"] > 0:
                qavsUst(Lm, X(r["len"]), y - 6, ust)
            st["y"] += H
            z = r.get("qosh") or r.get("ayir")
            if r.get("d") and z:
                qavsPast(X(z[0]), X(z[1]), st["y"] + 5, r["d"])
                st["y"] += 26
            st["y"] += 8
        if Y.get(ongKalit):
            qavsOng(ys[0], ys[-1] + H, Y[ongKalit])
        st["y"] += 4

    guruh(sar[0], [{"nom": r["nom"], "len": oldU[i], "blok": bO} for i, r in enumerate(O)], "o", "o")
    if bosq >= 2:
        qs = []
        for i, r in enumerate(K):
            q = {"nom": r["nom"], "len": newU[i], "blok": bK, "d": Y.get("d" + str(i))}
            if newU[i] > oldU[i] + 1e-9:
                q["qosh"] = ([oldU[i], newU[i], TASMA_RANG[(1 - i) % len(TASMA_RANG)][0], ""] if tur == "jami"
                             else [oldU[i], newU[i], TASMA_RANG[i % len(TASMA_RANG)][1], ".32"])
            elif newU[i] < oldU[i] - 1e-9:
                q["ayir"] = [newU[i], oldU[i]]
            qs.append(q)
        guruh(sar[1] if len(sar) > 1 and sar[1] else "Keyin", qs, "k", "k")
    if izoh is None:
        izoh = (f"Chizmali model: oldin {O[0]['nom']} : {O[1]['nom']} = {_js_num(O[0]['b'])} : {_js_num(O[1]['b'])}"
                + (f", keyin {_js_num(K[0]['b'])} : {_js_num(K[1]['b'])}" if bosq >= 2 else ""))
    return (f'<svg viewBox="0 0 {W} {f(st["y"])}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{izoh.replace(chr(34), "")}">'
            + "".join(out) + "</svg>")


if __name__ == "__main__":
    # Namuna: python3 _reja/tools/ozgar_svg.py "Oltin:3|Kumush:4 > Oltin:1|Kumush:2" bir Oltin "o:?|d1:10 ta"
    a = sys.argv[1:]
    print(ozgar(a[0], tur=a[1] if len(a) > 1 else "bir", ozgarmas=a[2] if len(a) > 2 else None, yoz=a[3] if len(a) > 3 else ""))
