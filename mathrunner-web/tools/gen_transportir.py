"""«Transportir» (Ulug'bek rasadxonasi) o'yini banklari.

Topshiriq (`tur`):
  olch    — burchak chizilgan, transportir qo'yilgan: necha gradus? `a`, `asos` ('o' — asos nur o'ngga, 'ch' — chapga), `options`, `javob`
  yasa    — teleskopni burab `a` gradusli burchak yasash (asos o'ngga yoki chapga)
  turi    — qanday burchak: o'tkir / to'g'ri / o'tmas / yoyiq. `a`, `options`, `javob`
  chama   — transportirsiz, chamalab: qaysi biri yaqin? `a`, `options` (bir-biridan ≥ 30° farqli), `javob`
  qoshni  — to'g'ri chiziqdagi qo'shni burchaklar (5-sinf): bittasi `a`, ikkinchisi? javob 180 − a
Ishga tushirish: python3 tools/gen_transportir.py  (tekshiruv ichida)
"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'


def turi_of(a): return "O'tkir" if a < 90 else "To'g'ri" if a == 90 else "O'tmas" if a < 180 else 'Yoyiq'


class Gen:
    def __init__(self, seed):
        self.r = random.Random(f'transportir-{seed}')
        self.used = set()

    def burchak(self, qadam=5, lo=10, hi=170, kalit=''):
        for _ in range(1000):
            a = self.r.randrange(lo, hi + 1, qadam) if qadam > 1 else self.r.randint(lo, hi)
            if a == 90 and self.r.random() < 0.7: continue
            if (kalit, a) not in self.used:
                self.used.add((kalit, a)); return a
        raise RuntimeError

    def opts(self, j, ex):
        out = [j]
        for e in ex:
            if 0 < e < 180 and all(abs(e - o) >= 5 for o in out): out.append(e)
            if len(out) == 4: break
        k = 10
        while len(out) < 4:
            for e in (j + k, j - k):
                if 0 < e < 180 and all(abs(e - o) >= 5 for o in out) and len(out) < 4: out.append(e)
            k += 5
        self.r.shuffle(out)
        return out

    def olch(self, asos='o', qadam=5):
        a = self.burchak(qadam, kalit='olch' + asos)
        ex = [180 - a] if abs(180 - 2 * a) >= 10 else []
        ex += [a + 10, a - 10, a + 5, a - 5]
        return {'tur': 'olch', 'a': a, 'asos': asos, 'options': self.opts(a, ex), 'javob': a}

    def yasa(self, asos='o', qadam=5):
        a = self.burchak(qadam, kalit='yasa' + asos)
        return {'tur': 'yasa', 'a': a, 'asos': asos}

    def turi(self, majbur=None):
        if majbur is not None: a = majbur
        else: a = self.burchak(5, 15, 165, kalit='turi')
        return {'tur': 'turi', 'a': a, 'asos': self.r.choice(['o', 'ch']), 'options': ["O'tkir", "To'g'ri", "O'tmas", 'Yoyiq'], 'javob': turi_of(a)}

    def chama(self):
        a = self.burchak(5, 20, 160, kalit='chama')
        out = [a]
        for _ in range(500):
            e = self.r.randrange(10, 171, 5)
            if all(abs(e - o) >= 30 for o in out): out.append(e)
            if len(out) == 4: break
        assert len(out) == 4
        self.r.shuffle(out)
        return {'tur': 'chama', 'a': a, 'asos': self.r.choice(['o', 'o', 'ch']), 'options': out, 'javob': a}

    def qoshni(self, qadam=5):
        a = self.burchak(qadam, 20, 160, kalit='qoshni')
        j = 180 - a
        ex = [a, 90 - a if a < 90 else a - 90, 360 - a if 360 - a < 180 else j + 20]
        return {'tur': 'qoshni', 'a': a, 'asos': 'o', 'options': self.opts(j, ex), 'javob': j}


def tekshir(t):
    a = t['a']
    assert 0 < a <= 180
    if 'options' in t:
        assert len(set(t['options'])) == 4 and t['options'].count(t['javob']) == 1
    tur = t['tur']
    if tur == 'olch': assert t['javob'] == a and all(0 < o < 180 for o in t['options'])
    if tur == 'turi': assert t['javob'] == turi_of(a)
    if tur == 'chama':
        o = sorted(t['options']); assert all(o[i + 1] - o[i] >= 30 for i in range(3)) and t['javob'] == a
    if tur == 'qoshni': assert t['javob'] + a == 180
    return True


def main():
    O = lambda asos='o', q=5: (lambda g: g.olch(asos, q))
    Y = lambda asos='o', q=5: (lambda g: g.yasa(asos, q))
    T = lambda m=None: (lambda g: g.turi(m))
    C = lambda g: g.chama()
    Q = lambda q=5: (lambda g: g.qoshni(q))
    rejalar = {
        # 4-sinf 72: burchakni transportir bilan o'lchash
        'g4_c4_b72_l1': [[O(), C, O(), T(), O('ch'), C, O(), T(90), O('ch'), T()],
                         [O('ch'), O('o', 1), C, O('ch', 1), T(180), O('o', 1), O('ch'), C, O('ch', 1), T()]],
        # 73: burchaklarni transportir yordamida yasash
        'g4_c4_b73_l1': [[Y(), Y(), O(), Y('ch'), C, Y(), Y('ch'), O('ch'), Y(), Y('o', 10)],
                         [Y('ch'), Y('o', 1), O('ch'), Y('ch', 1), Y(), T(), Y('o', 1), Y('ch'), O('o', 1), Y('ch', 1)]],
        # 5-sinf 38: to'g'ri chiziqdagi burchaklar
        'y5_burchak': [[Q(), O(), Q(), Y('ch'), Q(), O('ch'), Q(), Y(), Q(), T()],
                       [Q(1), O('o', 1), Q(1), Y('ch', 1), Q(1), Q(), O('ch', 1), Q(1), Y('o', 1), Q(1)]],
    }
    jami = 0
    for lid, reja in rejalar.items():
        g = Gen(lid); out = []
        for mashq in reja:
            assert len(mashq) == 10
            for f in mashq:
                t = f(g); tekshir(t); out.append(t)
        for i, t in enumerate(out, 1): t['id'] = f"{lid.replace('_', '')}_rasad_{i:02d}"
        (BANKS / f'{lid}_tasks.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
        jami += len(out); print(lid, len(out))
    print(f'Jami {jami} topshiriq, hammasi tekshirildi.')


if __name__ == '__main__':
    main()
