"""«Yoyilma» (origami ustaxonasi) o'yini banklari.

Topshiriq turlari (`tur`):
  jism      — yoyilma ko'rsatiladi, qaysi jism chiqadi? (`target`, `options` — jismlar)
  kubmi     — bu yoyilmadan kub (prizma, silindr) yasab bo'ladimi? (`javob`: true/false, `jism`)
  qarama    — kub yoyilmasida ★ belgili yoqqa qarama-qarshi yoqni bosing (`belgi` — katak, `javob` — katak)
  yoyilmasi — jism ko'rsatiladi, uning yoyilmasi qaysi? (`variantlar` — 3 ta yoyilma, `javob` — to'g'risining o'rni)
  sirt      — o'lchamlari yozilgan parallelepiped yoyilmasi, sirt yuzi (`options` — sonlar, `javob`)
Yoyilma (`yoy`): {"tur":"grid","cells":[[x,y],..],"dims":[a,b,c]?} | {"tur":"prizma","uchlar":[[i,"t"|"b"],..]} |
  {"tur":"piramida"} | {"tur":"silindr","doiralar":[[i,"t"|"b"],..]} | {"tur":"konus"}; ixtiyoriy "aylan": 0..3 (90° qadam).
Kub yoyilmasi to'g'riligi va qarama-qarshi yoqlar «kubni dumalatib» hisoblanadi (o'yindagi bilan bir xil usul).
Ishga tushirish: python3 tools/gen_yoyilma.py
"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'


# ---- poliomino: hammasi (erkin), normallashtirish ----
def norm(cells):
    mx, my = min(x for x, y in cells), min(y for x, y in cells)
    return tuple(sorted((x - mx, y - my) for x, y in cells))


def variantlari(cells):
    out = set(); c = list(cells)
    for _ in range(4):
        c = [(y, -x) for x, y in c]
        out.add(norm(c)); out.add(norm([(-x, y) for x, y in c]))
    return out


def kanon(cells): return min(variantlari(cells))


def hexominolar():
    cur = {((0, 0),)}
    for _ in range(5):
        nxt = set()
        for p in cur:
            for x, y in p:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (x + dx, y + dy)
                    if q not in p: nxt.add(kanon(p + (q,)))
        cur = nxt
    return sorted(cur)


# ---- kubni dumalatish: har katak qaysi yoqqa tushadi ----
def neg(v): return tuple(-a for a in v)


def dumalat(cells):
    cells = [tuple(c) for c in cells]
    s = set(cells); root = cells[0]
    holat = {root: ((0, 0, -1), (1, 0, 0), (0, 1, 0))}   # (normal, o'ng, past)
    q = [root]
    while q:
        c = q.pop(0); n, R, D = holat[c]
        for (dx, dy), f in (((1, 0), lambda: (R, neg(n), D)), ((-1, 0), lambda: (neg(R), n, D)),
                            ((0, 1), lambda: (D, R, neg(n))), ((0, -1), lambda: (neg(D), R, n))):
            d = (c[0] + dx, c[1] + dy)
            if d in s and d not in holat: holat[d] = f(); q.append(d)
    return [holat[c] for c in cells]


def kubmi(cells): return len({h[0] for h in dumalat(cells)}) == 6


def qarama(cells, i):
    h = dumalat(cells); n = neg(h[i][0])
    return next(j for j, x in enumerate(h) if x[0] == n)


def joylash(rng, cells):
    v = list(variantlari(cells)); c = list(rng.choice(sorted(v)))
    # ildiz — eng ko'p qo'shnisi bor katak (o'yinda buklash shundan boshlanadi)
    s = set(c)
    c.sort(key=lambda p: -sum((p[0] + dx, p[1] + dy) in s for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))))
    return [list(p) for p in c]


HEX = hexominolar()
assert len(HEX) == 35
KUB = [h for h in HEX if kubmi(list(h))]
NOKUB = [h for h in HEX if not kubmi(list(h))]
assert len(KUB) == 11, len(KUB)
# noto'g'ri yoyilmalardan «ko'zga yaqinlari»: 2×2 blok yo'q, 4 tadan uzun qator yo'q (aks holda juda oson)
def yaqin(h):
    s = set(h)
    blok = any({(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)} <= s for x, y in h)
    return not blok
NOKUB_YAQIN = [h for h in NOKUB if yaqin(h)]

JISMLAR = ['cube', 'cuboid', 'triangularPrism', 'squarePyramid', 'cylinder', 'cone']


def yoy_jism(rng, j):
    if j == 'cube': return {'tur': 'grid', 'cells': joylash(rng, rng.choice(KUB))}
    if j == 'cuboid':
        a, b, c = rng.sample([2, 3, 4], 3) if rng.random() < .5 else (rng.choice([3, 4]), 2, rng.choice([2, 3]))
        return {'tur': 'grid', 'cells': joylash(rng, rng.choice(KUB)), 'dims': [a, b, c]}
    if j == 'triangularPrism':
        t = rng.randrange(3); b = rng.randrange(3)
        return {'tur': 'prizma', 'uchlar': [[t, 't'], [b, 'b']], 'aylan': rng.randrange(4)}
    if j == 'squarePyramid': return {'tur': 'piramida', 'aylan': rng.randrange(4)}
    if j == 'cylinder':
        t = rng.randrange(12); b = rng.randrange(12)
        return {'tur': 'silindr', 'doiralar': [[t, 't'], [b, 'b']], 'aylan': rng.choice([0, 2])}
    return {'tur': 'konus', 'aylan': rng.randrange(4)}


def yoy_notogri(rng, j):
    """shu jismga o'xshaydi, lekin yig'ilmaydi"""
    if j == 'cube': return {'tur': 'grid', 'cells': joylash(rng, rng.choice(NOKUB_YAQIN))}
    if j == 'triangularPrism':
        s = rng.choice('tb'); a, b = rng.sample(range(3), 2)
        return {'tur': 'prizma', 'uchlar': [[a, s], [b, s]], 'aylan': rng.randrange(4)}
    if j == 'cylinder':
        s = rng.choice('tb'); a, b = rng.sample(range(12), 2)
        return {'tur': 'silindr', 'doiralar': [[a, s], [b, s]], 'aylan': rng.choice([0, 2])}
    raise ValueError(j)


def t_jism(rng, i, pref, j, pool):
    # kub ham to'g'ri burchakli parallelepiped — ikkalasi bir savolda variant bo'lmaydi (javob ikki xil bo'lib qoladi)
    opts = [j] + rng.sample([x for x in pool if x != j and {x, j} != {'cube', 'cuboid'}], 2); rng.shuffle(opts)
    return {'id': f'{pref}_{i:02d}', 'tur': 'jism', 'prompt': 'Bu yoyilmadan qaysi jism chiqadi?', 'yoy': yoy_jism(rng, j), 'target': j, 'options': opts}


def t_kubmi(rng, i, pref, j, ha):
    nom = {'cube': 'kub', 'triangularPrism': 'uchburchakli prizma', 'cylinder': 'silindr'}[j]
    return {'id': f'{pref}_{i:02d}', 'tur': 'kubmi', 'jism': j, 'prompt': f'Bu yoyilmadan {nom} yasab bo\'ladimi?',
            'yoy': yoy_jism(rng, j) if ha else yoy_notogri(rng, j), 'javob': bool(ha)}


def t_qarama(rng, i, pref):
    cells = joylash(rng, rng.choice(KUB)); b = rng.randrange(6)
    return {'id': f'{pref}_{i:02d}', 'tur': 'qarama', 'prompt': '★ belgili yoqning qarshisidagi yoqni bosing',
            'yoy': {'tur': 'grid', 'cells': cells}, 'belgi': b, 'javob': qarama(cells, b)}


def t_yoyilmasi(rng, i, pref, j):
    tog = yoy_jism(rng, j)
    boshqa = [x for x in JISMLAR if x != j and {x, j} != {'cube', 'cuboid'}]
    xato = []
    if j in ('cube', 'triangularPrism', 'cylinder'): xato.append(yoy_notogri(rng, j))
    for x in rng.sample(boshqa, 3):
        if len(xato) < 2: xato.append(yoy_jism(rng, x))
    v = [tog] + xato; rng.shuffle(v)
    return {'id': f'{pref}_{i:02d}', 'tur': 'yoyilmasi', 'jism': j, 'prompt': 'Bu jismning yoyilmasi qaysi?', 'variantlar': v, 'javob': v.index(tog)}


def t_sirt(rng, i, pref, katta=False):
    a, b, c = (rng.randint(2, 9), rng.randint(2, 7), rng.randint(2, 6)) if katta else (rng.randint(1, 5), rng.randint(1, 4), rng.randint(1, 4))
    if len({a, b, c}) < 2: c = c % 4 + 1 if not katta else c % 6 + 2
    S = 2 * (a * b + a * c + b * c)
    yarim = a * b + a * c + b * c; hajm = a * b * c
    opts = {S, yarim, S + 2 * a * b if S + 2 * a * b != S else S + 4, 2 * (a * b + a * c) + b * c}
    opts.discard(0)
    k = 2
    while len(opts) < 4: opts.add(S + k); k += 2
    if hajm not in opts and len(opts) > 4: pass
    o = sorted(list(opts))[:4] if S in sorted(list(opts))[:4] else sorted([S] + [x for x in opts if x != S][:3])
    assert S in o and len(set(o)) == 4
    return {'id': f'{pref}_{i:02d}', 'tur': 'sirt', 'prompt': 'Yoyilmaning (sirtning) yuzi necha kvadrat santimetr?',
            'yoy': {'tur': 'grid', 'cells': joylash(rng, rng.choice(KUB)), 'dims': [a, b, c], 'yoz': 1}, 'options': o, 'javob': S}


def tekshir(t):
    if t['tur'] == 'kubmi':
        y = t['yoy']
        if y['tur'] == 'grid': assert kubmi(y['cells']) == t['javob'], t
        if y['tur'] == 'prizma': assert ({s for _, s in y['uchlar']} == {'t', 'b'}) == t['javob']
        if y['tur'] == 'silindr': assert ({s for _, s in y['doiralar']} == {'t', 'b'}) == t['javob']
    if t['tur'] == 'qarama':
        assert t['javob'] != t['belgi'] and qarama(t['yoy']['cells'], t['javob']) == t['belgi']
    if t['tur'] in ('jism',) and t['yoy']['tur'] == 'grid': assert kubmi(t['yoy']['cells'])
    if t['tur'] == 'sirt':
        a, b, c = t['yoy']['dims']; assert t['javob'] == 2 * (a * b + a * c + b * c) and t['javob'] in t['options']
    if t['tur'] == 'yoyilmasi':
        assert len(t['variantlar']) == 3
        for k, v in enumerate(t['variantlar']):
            if v['tur'] == 'grid' and 'dims' not in v and k != t['javob'] and t['jism'] == 'cube': assert not kubmi(v['cells'])
    return t


def level(pref, m1, m2, seed):
    rng = random.Random(seed); out = []
    for spec in m1 + m2: out.append(tekshir(spec(rng, len(out) + 1, pref)))
    assert len(out) == 20
    return out


J = lambda j, pool=JISMLAR: (lambda r, i, p: t_jism(r, i, p, j, pool))
K = lambda j, ha: (lambda r, i, p: t_kubmi(r, i, p, j, ha))
Q = lambda r, i, p: t_qarama(r, i, p)
Y = lambda j: (lambda r, i, p: t_yoyilmasi(r, i, p, j))
S = lambda katta=False: (lambda r, i, p: t_sirt(r, i, p, katta))


def aralash(seed, *gr):
    r = random.Random(seed); x = [g for g in gr]; r.shuffle(x); return x


ODDIY = ['cube', 'cuboid', 'squarePyramid', 'cylinder', 'cone']
LEVELS = {
    'g1_c4_b58_l1': (lambda: (aralash(1, *[J(j, ODDIY) for j in ['cube', 'cuboid', 'cube', 'cuboid', 'squarePyramid', 'cylinder', 'cone', 'cube', 'cuboid', 'cylinder']]),
                              aralash(2, *[J(j, ODDIY) for j in ['cube', 'cuboid', 'cone', 'squarePyramid', 'cylinder', 'cube', 'cuboid', 'cone', 'cube', 'squarePyramid']]))),
    'g2_c4_b69_l1': (lambda: (aralash(3, *[J(j) for j in ['cube', 'cuboid', 'cube', 'cuboid', 'triangularPrism', 'squarePyramid', 'cube', 'cuboid', 'cylinder', 'cube']]),
                              aralash(4, *[K('cube', h) for h in [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]]))),
    'g3_c3_b43_l1': (lambda: (aralash(5, *[K('cube', h) for h in [1, 0, 1, 0, 1, 0, 1, 1, 0, 0]]),
                              aralash(6, Q, Q, Q, Q, Q, S(), S(), S(), S(), S()))),
    'g4_c4_b63_l1': (lambda: (aralash(7, *[J(j) for j in ['triangularPrism', 'cuboid', 'triangularPrism', 'cube', 'triangularPrism', 'squarePyramid', 'triangularPrism', 'cuboid', 'triangularPrism', 'cylinder']]),
                              aralash(8, *[K('triangularPrism', h) for h in [1, 0, 1, 0, 1, 0]], Y('triangularPrism'), Y('triangularPrism'), Y('cuboid'), Y('cube')))),
    'g4_c4_b65_l1': (lambda: (aralash(9, *[J(j) for j in ['squarePyramid', 'triangularPrism', 'squarePyramid', 'cube', 'squarePyramid', 'cone', 'squarePyramid', 'cuboid', 'squarePyramid', 'triangularPrism']]),
                              aralash(10, *[Y(j) for j in ['squarePyramid'] * 6 + ['triangularPrism', 'cube', 'cone', 'cuboid']]))),
    'g4_c4_b67_l1': (lambda: (aralash(11, *[J(j) for j in ['cylinder', 'cone', 'cylinder', 'cuboid', 'cylinder', 'triangularPrism', 'cylinder', 'cone', 'cylinder', 'squarePyramid']]),
                              aralash(12, *[K('cylinder', h) for h in [1, 0, 1, 0, 1, 0]], Y('cylinder'), Y('cylinder'), Y('cone'), Y('cylinder')))),
    'g4_c4_b68_l1': (lambda: (aralash(13, *[J(j) for j in ['cone', 'cylinder', 'cone', 'squarePyramid', 'cone', 'cylinder', 'cone', 'cube', 'cone', 'triangularPrism']]),
                              aralash(14, *[Y(j) for j in ['cone'] * 6 + ['cylinder', 'squarePyramid', 'cylinder', 'triangularPrism']]))),
    # yuqori sinflar
    'y6_yoyilma': (lambda: (aralash(15, *[K('cube', h) for h in [1, 0, 1, 0, 1]], Q, Q, Q, Q, Q),
                            aralash(16, *[S(True) for _ in range(6)], *[K(j, h) for j, h in [('triangularPrism', 0), ('cylinder', 0), ('triangularPrism', 1), ('cylinder', 1)]]))),
    'y6_jismlar': (lambda: (aralash(17, *[J(j) for j in ['triangularPrism', 'squarePyramid', 'cylinder', 'cone', 'cuboid', 'triangularPrism', 'squarePyramid', 'cylinder', 'cone', 'cube']]),
                            aralash(18, *[Y(j) for j in ['triangularPrism', 'squarePyramid', 'cylinder', 'cone', 'cube', 'cuboid', 'triangularPrism', 'cylinder', 'squarePyramid', 'cone']]))),
}

if __name__ == '__main__':
    print('hexomino 35, kub yoyilmasi', len(KUB), ', noto\'g\'ri (yaqin)', len(NOKUB_YAQIN))
    for k, (pref, f) in enumerate(LEVELS.items()):
        m1, m2 = f()
        b = level(pref.replace('_', ''), m1, m2, 100 + k)
        from collections import Counter
        print(pref, Counter(t['tur'] for t in b), Counter(t.get('target') or t.get('jism') for t in b if t['tur'] != 'sirt' and t['tur'] != 'qarama'))
        (BANKS / f'{pref}_tasks.json').write_text(json.dumps(b, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
