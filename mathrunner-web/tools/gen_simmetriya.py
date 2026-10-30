"""«Simmetriya» (koshinpaz ustaxonasi) o'yini banklari.

Panel n × n katak (x — o'ngga, y — pastga). Katak rangi 1..3 (lojuvard, feruza, oltin).
Topshiriq (`tur`):
  toldir — `berilgan` kataklar (qulflangan) + `almash` (V — tik o'q, H — yotiq o'q, D — diagonal ↘, D2 — diagonal ↙,
           C — markaziy simmetriya, R90 — markaz atrofida 90° burish soat strelkasi bo'yicha). Kerak: berilganlarning tasviri (`kerak`).
  qaysi  — to'liq naqsh, 4 ta chiziq (1 V, 2 H, 3 D, 4 D2): qaysi biri simmetriya o'qi? `javob` — o'q nomi (bittasi)
  nechta — to'liq naqshning nechta simmetriya o'qi bor (V, H, D, D2 dan)? `javob` 0/1/2/4
Ishga tushirish: python3 tools/gen_simmetriya.py  (tekshiruv ichida)
"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'


def akslantir(p, almash, n):
    x, y = p
    return {'V': (n - 1 - x, y), 'H': (x, n - 1 - y), 'D': (y, x), 'D2': (n - 1 - y, n - 1 - x),
            'C': (n - 1 - x, n - 1 - y), 'R90': (n - 1 - y, x)}[almash]


def simmetrikmi(naqsh, oq, n):
    return all(naqsh.get(akslantir(p, oq, n)) == c for p, c in naqsh.items())


def oqlar(naqsh, n): return [o for o in ('V', 'H', 'D', 'D2') if simmetrikmi(naqsh, o, n)]


def soha(almash, n):
    """Berilgan kataklar joylashadigan qism."""
    h = n // 2
    if almash in ('V', 'C'): return [(x, y) for x in range(h) for y in range(n)]
    if almash == 'H': return [(x, y) for x in range(n) for y in range(h)]
    if almash == 'D': return [(x, y) for x in range(n) for y in range(n) if x < y]
    if almash == 'D2': return [(x, y) for x in range(n) for y in range(n) if x + y < n - 1]
    if almash == 'R90': return [(x, y) for x in range(h) for y in range(h)]


class Gen:
    def __init__(self, seed):
        self.r = random.Random(f'simmetriya-{seed}')
        self.used = set()

    def boyoq(self, joylar, k, zich, bog=True):
        """Bog'langan (bir-biriga tegib turgan) tasodifiy shakl — naqshga o'xshasin."""
        r = self.r
        joylar = set(joylar)
        jami = max(3, round(len(joylar) * zich))
        bosh = r.choice(sorted(joylar))
        out = {bosh}
        while len(out) < jami:
            if bog:
                cand = sorted({(x + dx, y + dy) for x, y in out for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if (x + dx, y + dy) in joylar} - out)
            else:
                cand = sorted(joylar - out)
            if not cand: break
            out.add(r.choice(cand))
        return {p: r.randint(1, k) for p in sorted(out)}

    def toldir(self, almash, n, k=1, zich=0.35):
        for _ in range(500):
            b = self.boyoq(soha(almash, n), k, zich)
            kerak = {akslantir(p, almash, n): c for p, c in b.items()}
            kerak = {p: c for p, c in kerak.items() if p not in b}
            if len(kerak) < 2: continue
            key = ('t', almash, n, tuple(sorted(b.items())))
            if key in self.used: continue
            self.used.add(key)
            return {'tur': 'toldir', 'n': n, 'almash': almash, 'ranglar': k,
                    'berilgan': [[x, y, c] for (x, y), c in sorted(b.items())], 'kerak': [[x, y, c] for (x, y), c in sorted(kerak.items())]}
        raise RuntimeError

    def toliq(self, oq, n, k, zich):
        b = self.boyoq(soha(oq, n), k, zich)
        naqsh = dict(b)
        for p, c in b.items(): naqsh[akslantir(p, oq, n)] = c
        if oq == 'D' or oq == 'D2':     # diagonal kataklari ham bo'lishi mumkin
            for i in range(n):
                p = (i, i) if oq == 'D' else (n - 1 - i, i)
                if self.r.random() < 0.3: naqsh[p] = self.r.randint(1, k)
        return naqsh

    def qaysi(self, n=6, k=2):
        for _ in range(2000):
            oq = self.r.choice(['V', 'H', 'D', 'D2'])
            naqsh = self.toliq(oq, n, k, 0.45)
            if oqlar(naqsh, n) != [oq]: continue
            key = ('q', tuple(sorted(naqsh.items())))
            if key in self.used: continue
            self.used.add(key)
            return {'tur': 'qaysi', 'n': n, 'ranglar': k, 'naqsh': [[x, y, c] for (x, y), c in sorted(naqsh.items())], 'javob': oq}
        raise RuntimeError

    def nechta(self, soni, n=6, k=2):
        r = self.r
        for _ in range(5000):
            if soni == 0:
                naqsh = self.boyoq([(x, y) for x in range(n) for y in range(n)], k, 0.35)
            elif soni == 1:
                naqsh = self.toliq(r.choice(['V', 'H', 'D', 'D2']), n, k, 0.45)
            elif soni == 2:
                juft = r.choice([('V', 'H'), ('D', 'D2')])
                naqsh = self.toliq(juft[0], n, k, 0.45)
                naqsh.update({akslantir(p, juft[1], n): c for p, c in list(naqsh.items())})
            else:
                h = n // 2
                uchb = [(x, y) for x in range(h) for y in range(h) if y >= x]     # 1/8 qism
                b = self.boyoq(uchb, k, 0.5)
                naqsh = dict(b)
                for _ in range(3):
                    for o in ('V', 'H', 'D'):
                        naqsh.update({akslantir(p, o, n): c for p, c in list(naqsh.items())})
            if len(oqlar(naqsh, n)) != soni or len(naqsh) < 4: continue
            key = ('n', tuple(sorted(naqsh.items())))
            if key in self.used: continue
            self.used.add(key)
            return {'tur': 'nechta', 'n': n, 'ranglar': k, 'naqsh': [[x, y, c] for (x, y), c in sorted(naqsh.items())], 'options': [0, 1, 2, 4], 'javob': soni}
        raise RuntimeError


def tekshir(t):
    n = t['n']
    if t['tur'] == 'toldir':
        b = {(x, y): c for x, y, c in t['berilgan']}
        kerak = {(x, y): c for x, y, c in t['kerak']}
        assert kerak and all(p not in b for p in kerak)
        full = {**b, **kerak}
        oq = t['almash']
        if oq == 'R90':
            assert {akslantir(p, oq, n): c for p, c in b.items()} == {p: c for p, c in kerak.items()} or all(akslantir(p, oq, n) in full for p in b)
        else:
            assert simmetrikmi(full, oq, n), t
        assert all(0 <= x < n and 0 <= y < n for x, y in list(b) + list(kerak))
    else:
        naqsh = {(x, y): c for x, y, c in t['naqsh']}
        o = oqlar(naqsh, n)
        if t['tur'] == 'qaysi': assert o == [t['javob']]
        else: assert len(o) == t['javob'] and t['javob'] in t['options']
    return True


def main():
    T = lambda a, n=6, k=1, z=0.35: (lambda g: g.toldir(a, n, k, z))
    Q = lambda n=6, k=2: (lambda g: g.qaysi(n, k))
    N = lambda s, n=6, k=2: (lambda g: g.nechta(s, n, k))
    rejalar = {
        # 1-sinf 57: simmetriya o'qi (tik / yotiq / diagonal)
        'g1_c4_b57_l1': [[T('V'), T('V'), T('H'), Q(6, 1), T('V'), T('H'), Q(6, 1), T('V'), T('H'), Q(6, 1)],
                         [T('H'), T('V'), Q(6, 1), T('D', 5), T('V'), T('H'), Q(6, 1), T('D', 5), T('V'), Q(6, 1)]],
        # 3-sinf 32: simmetriya o'qi
        'g3_c2_b32_l1': [[T('V', 6, 2), T('H', 6, 2), Q(), T('V', 6, 2), N(1), T('H', 6, 2), Q(), N(2), T('V', 8, 2), Q()],
                         [T('H', 8, 2), N(0), T('V', 8, 2), Q(), N(2), T('D', 6, 2), N(4), T('H', 8, 2), Q(), N(1)]],
        # 3-sinf 53: o'qli simmetriya, simmetrik shakllar
        'g3_c3_b53_l1': [[T('V', 8, 2), Q(), T('H', 8, 2), N(2), T('D', 6, 2), Q(), T('V', 8, 3), N(0), T('D2', 6, 2), Q()],
                         [T('H', 8, 3), N(4), T('D', 7, 2), Q(), T('V', 8, 3), N(1), T('D2', 7, 2), N(2), T('H', 8, 3), Q()]],
        # 4-sinf 60: simmetriya (o'q va markaziy)
        'g4_c4_b60_l1': [[T('V', 8, 2), T('C', 6, 2), Q(), T('H', 8, 2), T('C', 6, 2), N(2), T('D', 7, 2), T('C', 8, 2), Q(), N(4)],
                         [T('C', 8, 3), T('D2', 7, 2), N(1), T('C', 8, 2), Q(), T('V', 8, 3), N(0), T('C', 8, 3), T('H', 8, 3), N(2)]],
        # 9-sinf geometriya 9: o'qqa nisbatan simmetriya
        'y9g_oq': [[T('V', 8, 3, .3), T('D', 8, 2, .3), Q(8), T('H', 8, 3, .3), N(2, 8), T('D2', 8, 3, .3), Q(8), N(4, 8), T('D', 8, 3, .3), N(1, 8)],
                   [T('D2', 8, 3, .3), N(0, 8), T('V', 8, 3, .3), Q(8), T('D', 8, 3, .3), N(2, 8), T('H', 8, 3, .3), Q(8), N(4, 8), T('D2', 8, 3, .3)]],
        # 9-sinf geometriya 10: markaziy simmetriya va burish
        'y9g_markaz': [[T('C', 8, 2, .3), T('R90', 8, 2, .45), T('C', 8, 3, .3), T('R90', 8, 2, .45), T('C', 8, 3, .3), T('R90', 8, 3, .45), N(2, 8), T('C', 8, 3, .3), T('R90', 8, 3, .45), N(4, 8)],
                       [T('R90', 8, 3, .5), T('C', 8, 3, .35), T('R90', 8, 3, .5), T('C', 8, 3, .35), N(0, 8), T('R90', 8, 3, .5), T('C', 8, 3, .35), T('R90', 8, 3, .5), T('C', 8, 3, .35), N(2, 8)]],
    }
    jami = 0
    for lid, reja in rejalar.items():
        g = Gen(lid); out = []
        for mashq in reja:
            assert len(mashq) == 10
            for f in mashq:
                t = f(g); tekshir(t); out.append(t)
        for i, t in enumerate(out, 1): t['id'] = f"{lid.replace('_', '')}_koshin_{i:02d}"
        (BANKS / f'{lid}_tasks.json').write_text(json.dumps(out, ensure_ascii=False) .replace('}, {', '},\n {') + '\n')
        jami += len(out); print(lid, len(out))
    print(f'Jami {jami} topshiriq, hammasi tekshirildi.')


if __name__ == '__main__':
    main()
