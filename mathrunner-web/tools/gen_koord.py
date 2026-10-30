"""«Koordinata» (xazina oroli xaritasi) o'yini banklari.

Xarita — koordinata burchagi (3–4-sinf: 0..N) yoki to'rt choraklik tekislik (7-sinf: −N..N).
Topshiriq (`tur`):
  qaz     — «Xazina (x; y) da» — nuqtani bosib qazish. `nuqta`
  top     — xaritada buyum (`buyum`) turibdi, koordinatasini tanlash. `nuqta`, `options`, `javob`
  yol     — kapitan yo'li: nuqtalarni tartib bilan bosish (`points`); oxirida shakl chiqishi mumkin (`shakl`)
  yur     — kema (x; y) da, `qadam` = [[yo'nalish, son], ...] — qayerga keladi? nuqtani bosish. `nuqta` — boshlanish, `javob` — [x, y]
  masofa  — bir qatordagi (yoki bir ustundagi) ikki buyum orasi necha birlik. `a`, `b`, `options`, `javob`
  nur     — koordinata nuri (bir o'q): bir bo'lak = `qadam` birlik, qayiq `k`-belgida; koordinatasi? `options`, `javob`
  chorak  — nuqta qaysi chorakda (yoki o'qda)? `nuqta`, `options`, `javob`
Har topshiriqda `oraliq` = [min, max] (ikkala o'q uchun bir xil).
Ishga tushirish: python3 tools/gen_koord.py  (tekshiruv ichida)
"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'
BUYUM = ['sandiq', 'palma', 'bayroq', 'langar', 'mayoq', 'toshbaqa']
YON = {'o': (1, 0), 'ch': (-1, 0), 'yu': (0, 1), 'p': (0, -1)}


def P(x, y): return [x, y]


def shakl_nomi(pts):
    """Yopiq yo'l bo'lsa — shakl nomi (uchburchak, kvadrat, to'g'ri to'rtburchak), aks holda None."""
    if len(pts) < 4 or pts[0] != pts[-1]: return None
    v = pts[:-1]
    if len(v) == 3: return 'uchburchak'
    if len(v) == 4:
        xs = sorted({p[0] for p in v}); ys = sorted({p[1] for p in v})
        if len(xs) == 2 and len(ys) == 2 and {tuple(p) for p in v} == {(x, y) for x in xs for y in ys}:
            return 'kvadrat' if xs[1] - xs[0] == ys[1] - ys[0] else "to'g'ri to'rtburchak"
        return "to'rtburchak"
    return None


def sn(n): return str(n).replace('-', '\u2212')


def fmt(p): return f'({sn(p[0])}; {sn(p[1])})'


def top_opts(rng, p, lo, hi):
    """To'g'ri javob, almashgan (y; x) va bittadan farqli variantlar."""
    x, y = p
    cand = [(y, x), (x + 1, y), (x, y + 1), (x - 1, y), (x, y - 1), (x + 1, y - 1)]
    if lo < 0: cand = [(y, x), (-x, y), (x, -y), (-y, -x)] + cand
    out = [tuple(p)]
    for c in cand:
        if c not in out and lo <= c[0] <= hi and lo <= c[1] <= hi: out.append(c)
        if len(out) == 4: break
    assert len(out) == 4, p
    rng.shuffle(out)
    return [fmt(c) for c in out]


def son_opts(rng, j, ex):
    out = [j] + [e for e in ex if e != j and e > 0]
    k = 1
    while len(set(out)) < 4:
        out += [j + k, j - k] if j - k > 0 else [j + k]; k += 1
    o = list(dict.fromkeys(out))[:4]
    rng.shuffle(o)
    return o


def chorak_of(p):
    x, y = p
    if x == 0 and y == 0: return 'Koordinata boshi'
    if x == 0: return 'Oy o\'qida'
    if y == 0: return 'Ox o\'qida'
    return {(1, 1): 'I chorak', (-1, 1): 'II chorak', (-1, -1): 'III chorak', (1, -1): 'IV chorak'}[(x > 0) - (x < 0), (y > 0) - (y < 0)]


class Gen:
    def __init__(self, lid, lo, hi, seed, yollar=()):
        self.lid, self.lo, self.hi = lid, lo, hi
        self.rng = random.Random(f'koord-{seed}')
        self.used = set()
        self.yollar = list(yollar)

    def pt(self, nol=True, chet=0):
        r = self.rng
        while True:
            p = (r.randint(self.lo + chet, self.hi - chet), r.randint(self.lo + chet, self.hi - chet))
            if self.lo < 0 and not nol and (p[0] == 0 or p[1] == 0): continue
            if self.lo >= 0 and not nol and (p[0] == 0 or p[1] == 0): continue
            return p

    def uniq(self, key):
        if key in self.used: return False
        self.used.add(key); return True

    def qaz(self, nol=False):
        while True:
            p = self.pt(nol=nol)
            if p[0] != p[1] and self.uniq(('qaz', p)): break     # x ≠ y — almashtirish xatosi ko'rinsin
        return {'tur': 'qaz', 'nuqta': list(p)}

    def top(self):
        while True:
            p = self.pt(nol=False)
            if p[0] != p[1] and self.uniq(('top', p)): break
        return {'tur': 'top', 'nuqta': list(p), 'buyum': self.rng.choice(BUYUM), 'options': top_opts(self.rng, p, self.lo, self.hi), 'javob': fmt(p)}

    def yol(self):
        r = self.rng
        if self.yollar:
            pts = self.yollar.pop(0)
        else:
            for _ in range(5000):
                kind = r.choice(['rect', 'tri', 'zig'])
                if kind == 'rect':
                    w, h = r.randint(2, 4), r.randint(2, 4)
                    x0, y0 = r.randint(self.lo, self.hi - w), r.randint(self.lo, self.hi - h)
                    pts = [(x0, y0), (x0 + w, y0), (x0 + w, y0 + h), (x0, y0 + h), (x0, y0)]
                elif kind == 'tri':
                    a, b, c = self.pt(), self.pt(), self.pt()
                    if len({a, b, c}) < 3 or (b[0] - a[0]) * (c[1] - a[1]) == (c[0] - a[0]) * (b[1] - a[1]): continue
                    pts = [a, b, c, a]
                else:
                    pts = [self.pt() for _ in range(4)]
                    if len(set(pts)) < 4: continue
                if self.lo < 0 and not any(p[0] < 0 or p[1] < 0 for p in pts): continue
                break
        pts = [tuple(p) for p in pts]
        assert self.uniq(('yol', tuple(pts)))
        t = {'tur': 'yol', 'points': [list(p) for p in pts]}
        s = shakl_nomi(pts)
        if s: t['shakl'] = s
        return t

    def yur(self, ikki=True, orqaga=True):
        r = self.rng
        for _ in range(5000):
            p = self.pt()
            yon1 = r.choice(['o', 'ch'] if orqaga else ['o'])
            yon2 = r.choice(['yu', 'p'] if orqaga else ['yu'])
            q = [[yon1, r.randint(1, 4)], [yon2, r.randint(1, 4)]] if ikki else [[r.choice([yon1, yon2]), r.randint(2, 4)]]
            x, y = p
            for d, n in q: x += YON[d][0] * n; y += YON[d][1] * n
            if not (self.lo <= x <= self.hi and self.lo <= y <= self.hi): continue
            if self.uniq(('yur', p, tuple(map(tuple, q)))): break
        return {'tur': 'yur', 'nuqta': list(p), 'qadam': q, 'javob': [x, y]}

    def masofa(self):
        r = self.rng
        for _ in range(5000):
            tik = r.random() < 0.5
            c = r.randint(self.lo + 1, self.hi)
            a1, a2 = sorted(r.sample(range(self.lo, self.hi + 1), 2))
            if a2 - a1 < 2: continue
            a, b = ((c, a1), (c, a2)) if tik else ((a1, c), (a2, c))
            if self.uniq(('masofa', a, b)): break
        j = a2 - a1
        ex = [a1 + a2, a2, j + 1, j - 1]          # tipik xatolar: qo'shib yuborish, kattasini aytish
        bu = r.sample(BUYUM, 2)
        return {'tur': 'masofa', 'a': list(a), 'b': list(b), 'buyumlar': bu, 'options': son_opts(r, j, ex), 'javob': j}

    def nur(self, qadamlar=(1, 2, 5, 10)):
        r = self.rng
        for _ in range(5000):
            q = r.choice(qadamlar); k = r.randint(2, 9)
            if self.uniq(('nur', q, k)): break
        j = q * k
        ex = [k, j + q, j - q, k + q]               # tipik xato: bo'laklarni sanab qo'yish (k)
        return {'tur': 'nur', 'qadam': q, 'k': k, 'belgi': 10, 'options': son_opts(r, j, ex), 'javob': j}

    def chorak(self, oq=False):
        r = self.rng
        for _ in range(5000):
            if oq:
                p = r.choice([(0, r.randint(self.lo, self.hi)), (r.randint(self.lo, self.hi), 0)])
                if p == (0, 0): continue
            else:
                p = self.pt(nol=False)
            if self.uniq(('chorak', p)): break
        j = chorak_of(p)
        opts = ['I chorak', 'II chorak', 'III chorak', 'IV chorak'] if not oq else [j, 'I chorak', 'II chorak', 'IV chorak' if j != 'IV chorak' else 'III chorak']
        if oq:
            opts = list(dict.fromkeys(opts))
            while len(opts) < 4: opts.append('III chorak')
            opts = opts[:4]
        r.shuffle(opts)
        return {'tur': 'chorak', 'nuqta': list(p), 'options': opts, 'javob': j}


def tekshir(t, lo, hi):
    rng_ok = lambda p: lo <= p[0] <= hi and lo <= p[1] <= hi
    tur = t['tur']
    if tur == 'qaz': assert rng_ok(t['nuqta'])
    elif tur == 'top':
        assert rng_ok(t['nuqta']) and len(set(t['options'])) == 4 and t['options'].count(fmt(t['nuqta'])) == 1 and t['javob'] == fmt(t['nuqta'])
        for o in t['options']:
            x, y = map(int, o.replace('\u2212', '-').strip('()').split('; ')); assert rng_ok((x, y))
    elif tur == 'yol':
        pts = t['points']; assert len(pts) >= 2 and all(rng_ok(p) for p in pts) and all(a != b for a, b in zip(pts, pts[1:]))
        assert shakl_nomi([tuple(p) for p in pts]) == t.get('shakl')
    elif tur == 'yur':
        x, y = t['nuqta']
        for d, n in t['qadam']: x += YON[d][0] * n; y += YON[d][1] * n
        assert [x, y] == t['javob'] and rng_ok(t['javob']) and rng_ok(t['nuqta'])
    elif tur == 'masofa':
        a, b = t['a'], t['b']; assert (a[0] == b[0]) != (a[1] == b[1])
        assert t['javob'] == abs(a[0] - b[0]) + abs(a[1] - b[1]) and len(set(t['options'])) == 4 and t['javob'] in t['options']
    elif tur == 'nur':
        assert t['javob'] == t['qadam'] * t['k'] and t['k'] < t['belgi'] and len(set(t['options'])) == 4 and t['javob'] in t['options']
    elif tur == 'chorak':
        assert t['javob'] == chorak_of(t['nuqta']) and len(set(t['options'])) == 4 and t['javob'] in t['options'] and rng_ok(t['nuqta'])
    return True


# Avvalgi bankdagi asl (darslikdan kelgan) yo'llar — saqlab qolinadi
ESKI_YOLLAR = {
    'g3_c3_b52_l1': [[(0, 0), (3, 0), (3, 3)], [(1, 1), (4, 1), (4, 4), (1, 4)], [(0, 2), (2, 4), (4, 2), (2, 0)], [(0, 0), (4, 0), (2, 3)], [(1, 0), (1, 4), (3, 4), (3, 0)], [(0, 1), (2, 1), (2, 3), (0, 3)], [(0, 4), (2, 2), (4, 4)], [(1, 1), (3, 1), (2, 4)], [(0, 0), (2, 2), (4, 0), (4, 4), (0, 4)], [(2, 0), (4, 2), (2, 4), (0, 2)]],
    'g4_c1_b5_l1': [[(1, 2), (4, 2), (4, 5)], [(0, 0), (3, 0), (3, 3), (0, 3), (0, 0)], [(1, 1), (5, 1), (3, 4), (1, 1)], [(1, 1), (4, 1), (4, 4), (1, 4), (1, 1)], [(0, 0), (2, 4), (4, 0), (0, 0)], [(1, 4), (3, 1), (5, 4)]],
    'g4_c1_b16_l1': [[(0, 0), (2, 2), (4, 4)], [(1, 1), (4, 1), (4, 4), (1, 1)], [(2, 0), (2, 3), (5, 3)], [(0, 2), (3, 5), (6, 2), (0, 2)], [(1, 1), (1, 4), (4, 4), (4, 1), (1, 1)], [(0, 0), (6, 0), (6, 6), (0, 6), (0, 0)]],
}


def bank(lid, lo, hi, reja, prefix):
    g = Gen(lid, lo, hi, lid, ESKI_YOLLAR.get(lid, []))
    out = []
    for mashq in reja:                      # har mashq — 10 topshiriq, ro'yxatdagi tartibda
        assert len(mashq) == 10, (lid, len(mashq))
        for f in mashq:
            t = f(g); t['oraliq'] = [lo, hi]
            tekshir(t, lo, hi); out.append(t)
    for i, t in enumerate(out, 1): t['id'] = f'{prefix}_orol_{i:02d}'
    return out


def main():
    Q, T, Y, Yr, M, N, C = (lambda g: g.qaz()), (lambda g: g.top()), (lambda g: g.yol()), (lambda g: g.yur()), \
        (lambda g: g.masofa()), (lambda g: g.nur()), (lambda g: g.chorak())
    Yo = lambda g: g.yur(orqaga=False)          # faqat o'ngga va yuqoriga
    Co = lambda g: g.chorak(oq=True)
    Q0 = lambda g: g.qaz(nol=True)
    rejalar = {
        # 3-sinf: koordinata burchagi, nuqta yasash
        'g3_c3_b52_l1': (0, 6, [[Q, T, Q, T, Y, Q, T, Yo, Q, Y], [Yr, T, Y, Q0, Yr, T, Y, Yr, Q, Y]], 'g3c3b52l1'),
        # 4-sinf: koordinata nuri va burchagi (takrorlash)
        'g4_c1_b5_l1': (0, 8, [[N, Q, T, N, Y, T, Q, N, T, Y], [Yr, M, Y, N, Yr, M, T, Y, Yr, M]], 'g4c1b5l1'),
        # 4-sinf: koordinata nuri va koordinata burchagi
        'g4_c1_b16_l1': (0, 8, [[T, N, Q, Y, T, N, Q, T, Y, N], [M, Yr, Y, M, Yr, N, Y, M, Yr, Q]], 'g4c1b16l1'),
        # 7-sinf algebra 26: Dekart koordinatalar sistemasi (to'rt chorak)
        'y7a_dekart': (-5, 5, [[Q, C, T, Q, C, T, Q, C, T, Co], [Yr, Y, T, Yr, Y, C, Yr, Y, T, Co]], 'y7a_dekart'),
    }
    jami = 0
    for lid, (lo, hi, reja, prefix) in rejalar.items():
        b = bank(lid, lo, hi, reja, prefix)
        (BANKS / f'{lid}_tasks.json').write_text(json.dumps(b, ensure_ascii=False, indent=1) + '\n')
        jami += len(b)
        print(f'{lid}: {len(b)} ta —', ', '.join(f"{k} {sum(t['tur'] == k for t in b)}" for k in ['qaz', 'top', 'yol', 'yur', 'masofa', 'nur', 'chorak'] if any(t['tur'] == k for t in b)))
    print(f'Jami {jami} topshiriq, hammasi tekshirildi.')


if __name__ == '__main__':
    main()
