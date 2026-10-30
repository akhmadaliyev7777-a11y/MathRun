"""«Ulush tasmasi» (bog'dagi devor) o'yini banklari.

Topshiriq (`tur`):
  boya   — d ta taxtadan a/b qismini bo'yash (d = b·k bo'lishi mumkin — teng kasr), kerak: n ta
  son    — N ta taxtaning a/b qismi (sonning ulushi), kerak: N : b · a
  qosh   — a/b allaqachon bo'yalgan (ko'k), yana c/b ni sariq bilan bo'yash; natija (a+c)/b
  ayir   — a/b bo'yalgan, c/b ni yuvib tashlash; natija (a−c)/b
  foiz   — d ta taxta (d = 4, 5, 10, 20), p% ni bo'yash; o'nli kasr bilan ham ("onli": "0,25")
  qaysi  — n ta taxta bo'yalgan, qaysi kasr/foiz/o'nli kasr? (`options` — matnlar, `javob`)
Har topshiriqda: d (taxtalar), n (oxirida bo'yalgan bo'lishi kerak), bosh (boshida bo'yalgan, qosh/ayir uchun).
Ishga tushirish: python3 tools/gen_ulush.py
"""
import json, random
from fractions import Fraction as F
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'


def boya(rng, b, a=None, k=1):
    a = a if a is not None else 1
    return {'tur': 'boya', 'kasr': [a, b], 'd': b * k, 'n': a * k}


def son(rng, N, a, b):
    assert N % b == 0
    return {'tur': 'son', 'kasr': [a, b], 'd': N, 'n': N // b * a}


def qosh(rng, a, c, b, ayir=False):
    if ayir: return {'tur': 'ayir', 'kasrlar': [[a, b], [c, b]], 'd': b, 'bosh': a, 'n': a - c}
    return {'tur': 'qosh', 'kasrlar': [[a, b], [c, b]], 'd': b, 'bosh': a, 'n': a + c}


def onli(x):
    s = f'{x:.2f}'.rstrip('0').rstrip('.')
    return s.replace('.', ',')


def foiz(rng, d, p, onlida=False):
    n = F(p, 100) * d
    assert n.denominator == 1
    t = {'tur': 'foiz', 'foiz': p, 'd': d, 'n': int(n)}
    if onlida: t['onli'] = onli(p / 100)
    return t


# ---- shakl: har xil kattalikdagi bo'laklar (Brilliant «Combining Parts» g'oyasi) ----
# Bo'laklar «panjara» koordinatalarida: kvadrat — oddiy, oltiburchak va uchburchak — 60° li panjara
# (e1 = (1, 0), e2 = (1/2, √3/2)); yuzlar nisbati affin almashtirishda saqlanadi, shuning uchun aniq kasr.
def yuz(P):
    s = F(0)
    for i in range(len(P)):
        x1, y1 = P[i]; x2, y2 = P[(i + 1) % len(P)]
        s += F(x1) * F(y2) - F(x2) * F(y1)
    return abs(s) / 2


def orta(a, b): return (F(a[0] + b[0]) / 2, F(a[1] + b[1]) / 2)


def uch_bol(rng, P, rejim):
    A, B, C = P
    if rejim == 'yarim':
        i = rng.randrange(3); V = P[i]; X, Y = P[(i + 1) % 3], P[(i + 2) % 3]; M = orta(X, Y)
        return [[V, X, M], [V, M, Y]]
    ab, bc, ca = orta(A, B), orta(B, C), orta(C, A)
    return [[A, ab, ca], [ab, B, bc], [ca, bc, C], [ab, bc, ca]]


def tort_bol(rng, P):
    (x0, y0), _, (x1, y1), _ = P
    r = rng.random()
    if r < .35 and max(x1 - x0, y1 - y0) <= 2 * min(x1 - x0, y1 - y0):   # diagonal — ikki uchburchak (ingichka bo'lmasin)
        return [[(x0, y0), (x1, y0), (x1, y1)], [(x0, y0), (x1, y1), (x0, y1)]] if rng.random() < .5 else [[(x0, y0), (x1, y0), (x0, y1)], [(x1, y0), (x1, y1), (x0, y1)]]
    tik = (x1 - x0) >= (y1 - y0) if rng.random() < .8 else (x1 - x0) < (y1 - y0)
    if tik and (x1 - x0) % 2 == 0:
        m = (x0 + x1) // 2; return [[(x0, y0), (m, y0), (m, y1), (x0, y1)], [(m, y0), (x1, y0), (x1, y1), (m, y1)]]
    if (y1 - y0) % 2 == 0:
        m = (y0 + y1) // 2; return [[(x0, y0), (x1, y0), (x1, m), (x0, m)], [(x0, m), (x1, m), (x1, y1), (x0, y1)]]
    return [P]


def shakl_bolaklar(rng, tur):
    if tur == 'kv':
        S = 12
        if rng.random() < .5: q = [[(0, 0), (6, 0), (6, 12), (0, 12)], [(6, 0), (12, 0), (12, 12), (6, 12)]]
        else: q = [[(x, 0), (x + 4, 0), (x + 4, 12), (x, 12)] for x in (0, 4, 8)]
        for _ in range(rng.randint(2, 3)):
            tortlar = [k for k, P in enumerate(q) if len(P) == 4]
            if not tortlar: break
            i = rng.choice(tortlar); P = q[i]
            yangi = tort_bol(rng, P)
            q = q[:i] + yangi + q[i + 1:]
        return q
    if tur == 'olti':
        V = [(2, 0), (0, 2), (-2, 2), (-2, 0), (0, -2), (2, -2)]
        q = [[(0, 0), V[i], V[(i + 1) % 6]] for i in range(6)]
        if rng.random() < .5:   # ikki qo'shni uchburchak — romb
            i = rng.randrange(6); q = [x for k, x in enumerate(q) if k not in (i, (i + 1) % 6)] + [[(0, 0), V[i], V[(i + 1) % 6], V[(i + 2) % 6]]]
        for _ in range(rng.randint(1, 3)):
            uchlar = [k for k, P in enumerate(q) if len(P) == 3 and yuz(P) >= 1]
            i = rng.choice(uchlar); q = q[:i] + uch_bol(rng, q[i], rng.choice(['yarim', 'yarim', 'tort'])) + q[i + 1:]
        return q
    q = uch_bol(rng, [(0, 0), (4, 0), (0, 4)], 'tort')
    for _ in range(rng.randint(1, 3)):
        uchlar = [k for k, P in enumerate(q) if yuz(P) >= 1]
        i = rng.choice(uchlar); q = q[:i] + uch_bol(rng, q[i], rng.choice(['yarim', 'yarim', 'tort'])) + q[i + 1:]
    return q


def shakl(rng, tur, maqsadlar):
    for _ in range(400):
        q = shakl_bolaklar(rng, tur)
        if not 5 <= len(q) <= 9: continue
        Y = [yuz(P) for P in q]; J = sum(Y); fr = [y / J for y in Y]
        if len(set(fr)) < 2: continue
        rng.shuffle(maqsadlar)
        for m in maqsadlar:
            m = F(m)
            yech = [s for s in range(1, 1 << len(q)) if sum(fr[i] for i in range(len(q)) if s >> i & 1) == m]
            if not yech: continue
            # faqat sanab topib bo'lmasin: shuncha sonli boshqa to'plam ham bor, lekin yig'indisi boshqa
            k = bin(yech[0]).count('1')
            if all(sum(fr[i] for i in range(len(q)) if s >> i & 1) == m for s in range(1, 1 << len(q)) if bin(s).count('1') == k): continue
            s0 = rng.choice(yech)
            return {'tur': 'shakl', 'shakl': tur, 'kasr': [m.numerator, m.denominator],
                    'bolaklar': [[[float(x), float(y)] for x, y in P] for P in q],
                    'ulush': [[f.numerator, f.denominator] for f in fr],
                    'yechim': [i for i in range(len(q)) if s0 >> i & 1], 'd': len(q), 'n': len([i for i in range(len(q)) if s0 >> i & 1])}
    raise RuntimeError('shakl topilmadi')


def kasr_matn(a, b): return f'{a}/{b}'


def qaysi(rng, d, n, shakl='kasr'):
    """bo'yalgan qism qaysi? shakl: kasr | foiz | onli"""
    q = F(n, d)
    if shakl == 'kasr':
        tog = kasr_matn(n, d)
        xato = {kasr_matn(d - n, d) if d - n != n else kasr_matn(n, d + 1), kasr_matn(n, d + n), kasr_matn(d, n) if n > 1 else kasr_matn(n + 1, d), kasr_matn(n + 1, d), kasr_matn(n - 1, d) if n > 1 else kasr_matn(n, d - 1)}
        xato = [x for x in xato if F(*map(int, x.split('/'))) != q and x != tog]
    elif shakl == 'foiz':
        p = q * 100; assert p.denominator == 1
        tog = f'{int(p)}%'
        xato = list({f'{n}%', f'{int(100 - p)}%' if p != 50 else f'{int(p) + 10}%', f'{n * 10}%' if n * 10 != p else f'{int(p) + 5}%', f'{d}%'} - {tog})
    else:
        tog = onli(float(q))
        xato = list({onli(n / 10) if onli(n / 10) != tog else onli(n / 100), f'{n},{d}', onli(float(1 - q)) if q != F(1, 2) else onli(float(q) + .1), onli(n / 100)} - {tog})
    rng.shuffle(xato)
    o = [tog] + xato[:3]; rng.shuffle(o)
    assert len(set(o)) == 4, o
    return {'tur': 'qaysi', 'shakl': shakl, 'd': d, 'n': n, 'options': o, 'javob': tog}


def tekshir(t):
    d, n = t['d'], t['n']
    assert 0 <= n <= d and 2 <= d <= 20, (t['tur'], d, n)
    if t['tur'] == 'boya': assert F(*t['kasr']) == F(n, d)
    if t['tur'] == 'son': assert F(*t['kasr']) * d == n
    if t['tur'] in ('qosh', 'ayir'):
        (a, b), (c, b2) = t['kasrlar']; assert b == b2 == d and t['bosh'] == a
        assert n == (a + c if t['tur'] == 'qosh' else a - c) and 0 < n <= d
    if t['tur'] == 'foiz': assert F(t['foiz'], 100) * d == n
    if t['tur'] == 'shakl':
        Y = [yuz([(F(x), F(y)) for x, y in P]) for P in t['bolaklar']]; J = sum(Y)
        assert [[(y / J).numerator, (y / J).denominator] for y in Y] == t['ulush'] and sum(Y) > 0
        assert sum(Y[i] / J for i in t['yechim']) == F(*t['kasr'])
    if t['tur'] == 'qaysi':
        assert t['javob'] in t['options'] and len(set(t['options'])) == 4
        # faqat bittasi bo'yalgan qismga teng
        def qiymat(s):
            if s.endswith('%'): return F(int(s[:-1]), 100)
            if '/' in s: a, b = s.split('/'); return F(int(a), int(b))
            return F(s.replace(',', '.'))
        assert sum(qiymat(o) == F(n, d) for o in t['options']) == 1, t
    return t


def level(pref, specs):
    out = []
    for i, t in enumerate(specs):
        t = dict(t); t['id'] = f'{pref}_{i + 1:02d}'
        out.append(tekshir(t))
    assert len(out) == 20, (pref, len(out))
    # bir mashqda bir xil topshiriq takrorlanmasin
    for m in (out[:10], out[10:]):
        keys = [json.dumps({k: v for k, v in t.items() if k not in ('id', 'options')}, sort_keys=True) for t in m]
        assert len(set(keys)) == 10, pref
    return out


def mix(rng, xs): xs = list(xs); rng.shuffle(xs); return xs


if __name__ == '__main__':
    r = random.Random(41)
    L = {}
    # 3-sinf 33: ulushlar — birlik kasrlar, keyin bo'yalganini o'qish
    L['g3_c2_b33_l1'] = mix(r, [boya(r, b) for b in [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]]) + mix(r, [qaysi(r, d, 1) for d in [3, 4, 5, 6]] + [boya(r, b, a) for b, a in [(4, 3), (5, 2), (8, 3)]] + [shakl(r, 'kv', ['1/2', '1/4', '1/3']), shakl(r, 'olti', ['1/2', '1/3']), shakl(r, 'uch', ['1/2', '1/4'])])
    # 3-sinf 45: butunning ulushlari, teng kasrlar (yarmi = 4/8)
    L['g3_c3_b45_l1'] = mix(r, [boya(r, b, a) for b, a in [(2, 1), (4, 3), (3, 2), (5, 4), (6, 1), (8, 5), (10, 7), (7, 3), (9, 4), (12, 5)]]) + mix(r, [boya(r, b, a, k) for b, a, k in [(2, 1, 4), (3, 1, 2), (4, 1, 2), (3, 2, 3), (4, 3, 2)]] + [qaysi(r, 8, 6)] + [shakl(r, t, m) for t, m in [('olti', ['1/2', '2/3', '1/3']), ('kv', ['1/2', '3/4', '1/3']), ('uch', ['1/4', '1/2', '3/4']), ('olti', ['1/2', '5/6', '1/3'])]])
    # 3-sinf 46: sonning ulushini topish (1/n)
    L['g3_c3_b46_l1'] = mix(r, [son(r, N, 1, b) for N, b in [(6, 2), (8, 4), (9, 3), (10, 5), (12, 3), (12, 4), (15, 5), (16, 8), (18, 6), (20, 4)]]) + mix(r, [son(r, N, 1, b) for N, b in [(12, 2), (14, 7), (16, 4), (18, 3), (20, 5), (15, 3)]] + [son(r, N, a, b) for N, a, b in [(12, 2, 3), (10, 3, 5), (16, 3, 4), (20, 3, 10)]])
    # 4-sinf 41: ulush va qismlar, sonning qismini topish
    L['g4_c3_b41_l1'] = mix(r, [boya(r, b, a) for b, a in [(4, 3), (5, 3), (8, 7), (9, 5)]] + [qaysi(r, d, n) for d, n in [(7, 5), (9, 4), (12, 7)]] + [shakl(r, t, m) for t, m in [('kv', ['3/4', '2/3', '5/6']), ('olti', ['2/3', '5/6', '1/2']), ('uch', ['3/4', '1/2'])]]) + mix(r, [son(r, N, a, b) for N, a, b in [(12, 3, 4), (15, 2, 3), (18, 5, 6), (20, 3, 4), (16, 5, 8), (14, 3, 7), (10, 4, 5), (20, 7, 10), (18, 4, 9), (12, 5, 6)]])
    # 4-sinf 48: maxrajlari bir xil kasrlarni qo'shish va ayirish
    L['g4_c3_b48_l1'] = mix(r, [qosh(r, a, c, b) for a, c, b in [(1, 2, 4), (2, 2, 5), (3, 4, 9), (1, 4, 6), (2, 3, 8), (5, 3, 10), (1, 1, 3), (4, 2, 7), (2, 5, 12), (3, 3, 8)]]) + mix(r, [qosh(r, a, c, b, True) for a, c, b in [(3, 1, 4), (4, 2, 5), (7, 3, 9), (5, 4, 6), (6, 1, 8), (9, 5, 10), (2, 1, 3), (6, 4, 7), (11, 6, 12)]] + [qosh(r, 3, 4, 10)])
    # 4-sinf 57: foizlar
    L['g4_c3_b57_l1'] = mix(r, [foiz(r, 10, p) for p in [50, 30, 70, 10, 90, 20, 60, 100]] + [foiz(r, 4, 25), foiz(r, 4, 75)]) + mix(r, [foiz(r, 20, p) for p in [5, 15, 35, 45, 65]] + [foiz(r, 5, 40), foiz(r, 5, 80)] + [qaysi(r, 10, 3, 'foiz'), qaysi(r, 4, 1, 'foiz'), qaysi(r, 20, 9, 'foiz')])
    # 5-sinf 32: foiz tushunchasi
    L['y5_foiz'] = mix(r, [foiz(r, 10, p) for p in [40, 80, 10, 60]] + [foiz(r, 20, p) for p in [25, 55, 85, 5]] + [foiz(r, 4, 50), foiz(r, 5, 60)]) + mix(r, [qaysi(r, d, n, 'foiz') for d, n in [(10, 7), (20, 13), (4, 3), (5, 2), (20, 1), (10, 2)]] + [foiz(r, 20, 75), foiz(r, 20, 35), foiz(r, 5, 20), foiz(r, 10, 90)])
    # 5-sinf 33: oddiy kasr, o'nli kasr va foiz
    L['y5_kasr_foiz'] = mix(r, [qaysi(r, d, n, s) for d, n, s in [(10, 3, 'onli'), (4, 1, 'onli'), (5, 2, 'onli'), (20, 7, 'onli'), (4, 3, 'foiz'), (5, 4, 'foiz'), (20, 11, 'foiz'), (10, 9, 'onli'), (2, 1, 'foiz'), (20, 3, 'onli')]]) + mix(r, [foiz(r, 20, p, True) for p in [25, 35, 60, 15, 95]] + [foiz(r, 10, p, True) for p in [70, 20]] + [foiz(r, 4, 75, True), foiz(r, 5, 40, True), foiz(r, 20, 50, True)])

    for lid, specs in L.items():
        b = level(lid.replace('_', ''), specs)
        (BANKS / f'{lid}_tasks.json').write_text(json.dumps(b, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
        from collections import Counter
        print(lid, Counter(t['tur'] for t in b), 'eng ko\'p taxta', max(t['d'] for t in b))
