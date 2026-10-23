#!/usr/bin/env python3
"""Test savollari uchun burchak chizmasi (SVG satri) — ma'ruzadagi data-nurlar bilan bir xil ko'rinish.

Foydalanish (boshqa skriptdan):
    from burchak_svg import nurlar
    svg = nurlar({"A": 180, "B": 0, "C": 55}, yoy=[("B", "C", "55°"), ("C", "A", "x")], markaz="O")

nur: nom -> yo'nalish gradusda (0 — o'ngga, 90 — tepaga); "_1" kabi nomlar yozilmaydi.
yoy: (nur1, nur2, yozuv[, rang]) — nur1 dan nur2 gacha soat strelkasiga teskari; yozuv "90°" bo'lsa — to'g'ri burchak belgisi.
Natija — bir qatorli SVG (JS satriga ' ichida qo'yish uchun ' belgisi yo'q).
"""
import math

YOY = ["#1f5fd6", "#e07b39", "#12805c", "#8b5cf6", "#d6454f", "#0e9aa7"]


def nurlar(nur, yoy=(), markaz="O", R=110):
    rad = math.radians
    xs, ys = [0, -30, 30], [-30, 30]
    for a in nur.values():
        xs.append(math.cos(rad(a)) * (R + 22)); ys.append(-math.sin(rad(a)) * (R + 22))
    for y in yoy:
        if not y[2]: continue
        d = nur[y[1]] - nur[y[0]]
        while d <= 0: d += 360
        while d > 360: d -= 360
        ry = 40 if d < 35 else 30
        r = ry + (24 if d < 40 else 34 if d > 180 else 17)
        m = rad(nur[y[0]] + d / 2)
        lx, ly = math.cos(m) * r, -math.sin(m) * r
        xs += [lx - 24, lx + 24]; ys += [ly - 14, ly + 10]
    pad = 14
    minx, maxx = min(xs) - pad, max(xs) + pad
    miny, maxy = min(ys) - pad, max(ys) + pad + 8
    W, H, cx, cy = maxx - minx, maxy - miny, -minx, -miny

    def P(d, r):
        return cx + math.cos(rad(d)) * r, cy - math.sin(rad(d)) * r

    f = lambda v: f"{v:.1f}"
    h = []
    for i, y in enumerate(yoy):
        a1, a2, yoz = nur[y[0]], nur[y[1]], y[2]
        c = y[3] if len(y) > 3 else YOY[i % len(YOY)]
        d = a2 - a1
        while d <= 0: d += 360
        while d > 360: d -= 360
        ry, mid = (40 if d < 35 else 30), a1 + d / 2
        if yoz == "90°":
            q = 14; u, v = P(a1, q), P(a2, q); w = (u[0] + v[0] - cx, u[1] + v[1] - cy)
            h.append(f'<path d="M{f(u[0])} {f(u[1])} L{f(w[0])} {f(w[1])} L{f(v[0])} {f(v[1])}" fill="none" stroke="{c}" stroke-width="2"/>')
        else:
            s1, s2 = P(a1, ry), P(a2, ry)
            h.append(f'<path d="M{f(cx)} {f(cy)} L{f(s1[0])} {f(s1[1])} A {ry} {ry} 0 {1 if d > 180 else 0} 0 {f(s2[0])} {f(s2[1])} Z" fill="{c}" fill-opacity=".14" stroke="{c}" stroke-width="2"/>')
        if yoz:
            t = P(mid, ry + (24 if d < 40 else 34 if d > 180 else 17))
            h.append(f'<text x="{f(t[0])}" y="{f(t[1] + 6)}" text-anchor="middle" font-size="17" font-weight="800" fill="{c}" stroke="#fff" stroke-width="4" paint-order="stroke">{yoz}</text>')
    for k, a in nur.items():
        e, t = P(a, R), P(a, R + 14)
        h.append(f'<line x1="{f(cx)}" y1="{f(cy)}" x2="{f(e[0])}" y2="{f(e[1])}" stroke="#1f2433" stroke-width="2.4" stroke-linecap="round"/>')
        h.append(f'<circle cx="{f(e[0])}" cy="{f(e[1])}" r="3" fill="#1f2433"/>')
        if k and not k.startswith("_"):
            h.append(f'<text x="{f(t[0])}" y="{f(t[1] + 6)}" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2433">{k}</text>')
    h.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="4" fill="#1f2433"/>')
    if markaz:
        ay = sorted(a % 360 for a in nur.values())
        best, gap = 270, -1
        for i, a in enumerate(ay):
            nx = ay[i + 1] if i + 1 < len(ay) else ay[0] + 360
            if nx - a > gap: gap, best = nx - a, a + (nx - a) / 2
        if abs(gap - 180) < 1e-6 and any(abs(a - 180) < 1e-6 for a in ay): best = 270
        def yoyda(b):
            for y in yoy:
                a1, d, x = nur[y[0]], nur[y[1]] - nur[y[0]], b - nur[y[0]]
                while d <= 0: d += 360
                while x < 0: x += 360
                if x % 360 < d: return True
            return False
        m = P(best, 15 if yoyda(best) else 20)
        h.append(f'<text x="{f(m[0])}" y="{f(m[1] + 6)}" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2433" stroke="#fff" stroke-width="4" paint-order="stroke">{markaz}</text>')
    svg = f'<svg viewBox="0 0 {f(W)} {f(H)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Burchaklar chizmasi">' + "".join(h) + "</svg>"
    assert "'" not in svg
    return svg


if __name__ == "__main__":
    print(nurlar({"A": 180, "B": 0, "C": 55}, [("B", "C", "55°"), ("C", "A", "x")]))
