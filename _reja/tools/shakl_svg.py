#!/usr/bin/env python3
"""Ko'pburchak (uchburchak, to'rtburchak) chizmasi — test savollari uchun SVG satri.
Ma'ruzadagi data-shakl (maruza/chizma.js, chizShakl) bilan bir xil qoidalar va ko'rinish.

    from shakl_svg import shakl
    svg = shakl({"A": [0, 0], "B": [6, 0], "C": [3, 5]},
                tomon={"AB": "6 cm"}, belgi={"AB": 1, "AC": 1}, burchak={"A": "60°", "C": "?"}, tik=["B"])

nuqta: nom -> [x, y] (y tepaga); tartib — ko'pburchak uchlari tartibi.
tomon: "AB" -> yozuv (tashqarida); belgi: "AB" -> 1/2/3 (teng tomon shtrixlari);
burchak: "A" -> yozuv (ichkarida yoy bilan); tik: to'g'ri burchak belgisi qo'yiladigan uchlar;
diag: [["A","C"], ...] — qo'shimcha kesmalar (punktir emas, ingichka).
"""
import math

RANG = "#1f5fd6"


def shakl(nuqta, tomon=None, belgi=None, burchak=None, tik=(), diag=(), olcham=260, bosh=None):
    tomon, belgi, burchak = tomon or {}, belgi or {}, burchak or {}
    nom = list(nuqta)
    xs = [p[0] for p in nuqta.values()]; ys = [p[1] for p in nuqta.values()]
    w, h = max(xs) - min(xs) or 1, max(ys) - min(ys) or 1
    k = olcham / max(w, h)
    pad = 44
    W, H = w * k + 2 * pad, h * k + 2 * pad
    P = {n: (pad + (nuqta[n][0] - min(xs)) * k, pad + (max(ys) - nuqta[n][1]) * k) for n in nom}
    gx = sum(p[0] for p in P.values()) / len(P); gy = sum(p[1] for p in P.values()) / len(P)
    f = lambda v: f"{v:.1f}"
    out = []
    poly = " ".join(f"{f(P[n][0])},{f(P[n][1])}" for n in nom)
    out.append(f'<polygon points="{poly}" fill="{RANG}" fill-opacity=".1" stroke="#1f2433" stroke-width="2.4" stroke-linejoin="round"/>')
    for a, b in diag:
        out.append(f'<line x1="{f(P[a][0])}" y1="{f(P[a][1])}" x2="{f(P[b][0])}" y2="{f(P[b][1])}" stroke="#1f2433" stroke-width="1.8"/>')
    n = len(nom)
    # burchak yoylari va to'g'ri burchak
    for i, v in enumerate(nom):
        if v not in burchak and v not in tik:
            continue
        pv, nx = P[nom[i - 1]], P[nom[(i + 1) % n]]
        vx, vy = P[v]
        a1 = math.atan2(pv[1] - vy, pv[0] - vx); a2 = math.atan2(nx[1] - vy, nx[0] - vx)
        d = (a2 - a1) % (2 * math.pi)
        if d > math.pi:
            a1, a2 = a2, a1; d = 2 * math.pi - d
        if v in tik:
            q = 13
            u = (vx + math.cos(a1) * q, vy + math.sin(a1) * q); t = (vx + math.cos(a2) * q, vy + math.sin(a2) * q)
            c = (u[0] + t[0] - vx, u[1] + t[1] - vy)
            out.append(f'<path d="M{f(u[0])} {f(u[1])} L{f(c[0])} {f(c[1])} L{f(t[0])} {f(t[1])}" fill="none" stroke="#d6454f" stroke-width="2"/>')
        else:
            r = 22
            s1 = (vx + math.cos(a1) * r, vy + math.sin(a1) * r); s2 = (vx + math.cos(a2) * r, vy + math.sin(a2) * r)
            out.append(f'<path d="M{f(vx)} {f(vy)} L{f(s1[0])} {f(s1[1])} A {r} {r} 0 0 1 {f(s2[0])} {f(s2[1])} Z" fill="#e07b39" fill-opacity=".18" stroke="#e07b39" stroke-width="1.8"/>')
        if v in burchak and burchak[v]:
            m = a1 + d / 2; rr = 42 if d > 0.9 else 52
            out.append(f'<text x="{f(vx + math.cos(m) * rr)}" y="{f(vy + math.sin(m) * rr + 6)}" text-anchor="middle" font-size="16" font-weight="800" fill="#c2410c" stroke="#fff" stroke-width="4" paint-order="stroke">{burchak[v]}</text>')
    # tomonlar: shtrix va yozuv
    for i in range(n):
        a, b = nom[i], nom[(i + 1) % n]
        key = a + b if a + b in tomon or a + b in belgi else b + a
        ax, ay = P[a]; bx, by = P[b]
        mx, my = (ax + bx) / 2, (ay + by) / 2
        L = math.hypot(bx - ax, by - ay) or 1
        ux, uy = (bx - ax) / L, (by - ay) / L
        nx, ny = -uy, ux
        if (mx - gx) * nx + (my - gy) * ny < 0:
            nx, ny = -nx, -ny
        cnt = belgi.get(key, 0)
        for j in range(cnt):
            o = (j - (cnt - 1) / 2) * 6
            cx, cy = mx + ux * o, my + uy * o
            out.append(f'<line x1="{f(cx - nx * 7)}" y1="{f(cy - ny * 7)}" x2="{f(cx + nx * 7)}" y2="{f(cy + ny * 7)}" stroke="#12805c" stroke-width="2.4"/>')
        if key in tomon and tomon[key]:
            ot = 30 if cnt else 20
            out.append(f'<text x="{f(mx + nx * ot)}" y="{f(my + ny * ot + 6)}" text-anchor="middle" font-size="16" font-weight="800" fill="{RANG}" stroke="#fff" stroke-width="4" paint-order="stroke">{tomon[key]}</text>')
    # uch nomlari
    for v in nom:
        vx, vy = P[v]
        dx, dy = vx - gx, vy - gy; L = math.hypot(dx, dy) or 1
        out.append(f'<circle cx="{f(vx)}" cy="{f(vy)}" r="3" fill="#1f2433"/>')
        if not v.startswith("_"):
            out.append(f'<text x="{f(vx + dx / L * 18)}" y="{f(vy + dy / L * 18 + 6)}" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2433">{v}</text>')
    svg = f'<svg viewBox="0 0 {f(W)} {f(H)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Shakl chizmasi">' + "".join(out) + "</svg>"
    assert "'" not in svg
    return svg


if __name__ == "__main__":
    print(shakl({"A": [0, 0], "B": [6, 0], "C": [3, 5.2]}, belgi={"AB": 1, "BC": 1, "CA": 1}, burchak={"A": "60°"}))
