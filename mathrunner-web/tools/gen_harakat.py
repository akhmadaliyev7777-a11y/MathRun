"""«Harakat» (dasht yo'li) o'yini banklari.

Har topshiriq: `tur` (harakat turi), `sor` (nima so'raladi), `savol` (matn), `yurganlar` — [{nom, rasm, v, x0, yon, t0}],
`yol` (yo'l uzunligi, km), `T` (animatsiya oxiri — soat, umumiy soat bo'yicha), `javob`, `birlik`, `options`,
`qishloq` — [chap, o'ng] nomlari (bo'lsa).
  tur: bitta (bitta yurgan), uchrash (bir-biriga qarab), ketish (qarama-qarshi tomonga), quv (quvib yetish), kech (kechikib chiqish)
  sor: t (vaqt), S (masofa), v (tezlik), qoldi (oradagi masofa), joy (quvib yetgan joy), oldin (oldinda qancha)
Ishga tushirish: python3 tools/gen_harakat.py  (tekshiruv ichida — javob qayta hisoblanadi)
"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'

QISHLOQ = ['Olmazor', "Bog'iston", 'Yangiobod', 'Tolzor', 'Chinorli', 'Gulzor', 'Sohilobod', 'Qumariq', 'Zarbuloq', 'Uzumzor', 'Archazor', "Do'stlik"]
# rasm: tezlik oralig'i (km/soat), nomlari
TRANSPORT = {
    'piyoda': ((3, 6), ['Piyoda', 'Sayyoh', 'Bobur', 'Malika']),
    'velosiped': ((10, 18), ['Velosipedchi', 'Jasur', 'Nilufar']),
    'moto': ((30, 60), ['Mototsiklchi']),
    'mashina': ((40, 90), ["Ko'k mashina", 'Qizil mashina', 'Oq mashina', 'Sariq taksi']),
    'avtobus': ((40, 70), ['Avtobus']),
    'yuk': ((30, 60), ['Yuk mashinasi']),
}
JUFT = [('mashina', 'mashina'), ('avtobus', 'mashina'), ('yuk', 'mashina'), ('velosiped', 'velosiped'), ('piyoda', 'piyoda'),
        ('velosiped', 'moto'), ('piyoda', 'velosiped'), ('yuk', 'avtobus'), ('moto', 'mashina')]


def son_opts(rng, j, ex):
    out = [j]
    for e in ex:
        if isinstance(e, int) and e > 0 and e not in out: out.append(e)
    k = 1
    while len(out) < 4:
        for c in (j + k, j - k):
            if c > 0 and c not in out and len(out) < 4: out.append(c)
        k += 1
    o = out[:4]
    rng.shuffle(o)
    return o


ISM = {'Bobur', 'Malika', 'Jasur', 'Nilufar'}


def kichik(nom): return nom if nom.split()[0] in ISM else nom[0].lower() + nom[1:]


def butun(a, b): return a // b if b and a % b == 0 else None


class Gen:
    def __init__(self, seed):
        self.r = random.Random(f'harakat-{seed}')
        self.used = set()

    def yurgan(self, rasm, v=None, nom=None, istisno=()):
        (lo, hi), nomlar = TRANSPORT[rasm]
        nom = nom or self.r.choice([n for n in nomlar if n not in istisno] or nomlar)
        if v is None:
            step = 1 if hi <= 20 else 5
            v = self.r.randrange(lo, hi + 1, step) if step == 1 else self.r.choice(range(lo, hi + 1, 5))
        return {'nom': nom, 'rasm': rasm, 'v': v}

    def juft(self, kerak_farq=False):
        a, b = self.r.choice(JUFT)
        for _ in range(200):
            A = self.yurgan(a); B = self.yurgan(b, istisno=(A['nom'],))
            if A['nom'] == B['nom']: continue
            if kerak_farq and A['v'] == B['v']: continue
            return A, B
        raise RuntimeError

    def qishloq(self): return self.r.sample(QISHLOQ, 2)

    def uniq(self, key):
        if key in self.used: return False
        self.used.add(key); return True

    # ---- bitta yurgan ----
    def bitta(self, sor):
        r = self.r
        for _ in range(500):
            rasm = r.choice(list(TRANSPORT)); A = self.yurgan(rasm); t = r.randint(2, 6); S = A['v'] * t
            if self.uniq(('bitta', sor, A['v'], t)): break
        q = self.qishloq(); n, v = A['nom'], A['v']
        A.update(x0=0, yon=1)
        if sor == 't':
            savol = f"{q[0]} va {q[1]} orasi {S} km. {n} {v} km/soat tezlikda {q[0]}dan yo'lga chiqdi. Necha soatda {q[1]}ga yetib boradi?"
            j, ex, b = t, [t + 1, t - 1, butun(S, v + 10)], 'soat'
        elif sor == 'S':
            savol = f"{n} {q[0]}dan {v} km/soat tezlikda {t} soat yurib, {q[1]}ga yetdi. Qishloqlar orasi necha km?"
            j, ex, b = S, [v + t, v * (t + 1), v * (t - 1)], 'km'
        else:
            savol = f"{q[0]} va {q[1]} orasi {S} km. {n} bu yo'lni {t} soatda bosib o'tdi. Uning tezligi qancha?"
            j, ex, b = v, [S - t, v + 5, v - 5, S * t if S * t < 1000 else None], 'km/soat'
        return {'tur': 'bitta', 'sor': sor, 'savol': savol, 'yurganlar': [A], 'yol': S, 'T': t, 'qishloq': q,
                'javob': j, 'birlik': b, 'options': son_opts(r, j, ex), 'kerak': {'S': S, 't': t, 'v': v}}

    # ---- bir-biriga qarab ----
    def uchrash(self, sor):
        r = self.r
        for _ in range(500):
            A, B = self.juft(); t = r.randint(2, 5); S = (A['v'] + B['v']) * t
            tt = r.randint(1, t - 1) if sor == 'qoldi' else t
            if S <= 600 and self.uniq(('uchrash', sor, A['v'], B['v'], t, tt)): break
        q = self.qishloq(); v1, v2 = A['v'], B['v']
        A.update(x0=0, yon=1); B.update(x0=S, yon=-1)
        kirish = f"{q[0]} va {q[1]} orasi {S} km. Bir vaqtda bir-biriga qarab {q[0]}dan {kichik(A['nom'])} ({v1} km/soat), {q[1]}dan {kichik(B['nom'])} ({v2} km/soat) yo'lga chiqdi."
        if sor == 't':
            savol, j, ex, b, T = kirish + ' Necha soatdan keyin uchrashadi?', t, [butun(S, abs(v1 - v2)), butun(S, v1), t + 1], 'soat', t
        elif sor == 'qoldi':
            j = S - (v1 + v2) * tt
            savol, ex, b, T = kirish + f' {tt} soatdan keyin ular orasida necha km qoladi?', [S - v1 * tt, S - v2 * tt, (v1 + v2) * tt], 'km', tt
        else:  # S
            kirish = f"{q[0]}dan {kichik(A['nom'])} ({v1} km/soat), {q[1]}dan {kichik(B['nom'])} ({v2} km/soat) bir vaqtda bir-biriga qarab yo'lga chiqdi va {t} soatdan keyin uchrashdi."
            savol, j, ex, b, T = kirish + ' Qishloqlar orasi necha km?', S, [v1 * t, v2 * t, abs(v1 - v2) * t, v1 + v2], 'km', t
        return {'tur': 'uchrash', 'sor': sor, 'savol': savol, 'yurganlar': [A, B], 'yol': S, 'T': T, 'qishloq': q,
                'javob': j, 'birlik': b, 'options': son_opts(r, j, ex)}

    # ---- qarama-qarshi tomonga ----
    def ketish(self, sor):
        r = self.r
        for _ in range(500):
            A, B = self.juft(); t = r.randint(2, 5); D = (A['v'] + B['v']) * t
            if D <= 600 and self.uniq(('ketish', sor, A['v'], B['v'], t)): break
        v1, v2 = A['v'], B['v']; x0 = v1 * t
        A.update(x0=x0, yon=-1); B.update(x0=x0, yon=1)
        bekat = r.choice(['avtobus bekatidan', "ko'prik yonidan", 'bozor oldidan', 'yoqilg\'i shoxobchasidan'])
        kirish = f"{A['nom']} ({v1} km/soat) va {kichik(B['nom'])} ({v2 if sor != 'v' else '?'} km/soat) bir vaqtda {bekat} qarama-qarshi tomonga yo'lga chiqdi."
        if sor == 'S':
            savol, j, ex, b = kirish + f' {t} soatdan keyin ular orasi necha km bo\'ladi?', D, [abs(v2 - v1) * t, v1 * t + v2, v1 + v2], 'km'
        elif sor == 't':
            savol, j, ex, b = kirish + f' Necha soatdan keyin ular orasi {D} km bo\'ladi?', t, [butun(D, abs(v2 - v1)), t + 1, t - 1], 'soat'
        else:
            savol, j, ex, b = kirish + f' {t} soatdan keyin ular orasi {D} km bo\'ldi. {kichik(B["nom"])}ning tezligi qancha?', v2, [D // t, D // t + v1, v2 + 5], 'km/soat'
        return {'tur': 'ketish', 'sor': sor, 'savol': savol, 'yurganlar': [A, B], 'yol': D, 'T': t,
                'javob': j, 'birlik': b, 'options': son_opts(r, j, ex)}

    # ---- quvib yetish ----
    def quv(self, sor):
        r = self.r
        for _ in range(500):
            A, B = self.juft(kerak_farq=True)
            if A['v'] > B['v']: A, B = B, A          # A — oldinda, sekin; B — orqada, tez
            t = r.randint(2, 6); d = (B['v'] - A['v']) * t
            tt = r.randint(1, t - 1) if sor == 'qoldi' else t
            if 6 <= d <= min(200, 4 * A['v']) and self.uniq(('quv', sor, A['v'], B['v'], t, tt)): break
        v1, v2 = A['v'], B['v']
        A.update(x0=d, yon=1); B.update(x0=0, yon=1)
        kirish = f"{A['nom']} {d} km oldinda, {v1} km/soat tezlikda ketyapti. Orqadan xuddi shu yo'ldan {kichik(B['nom'])} {v2} km/soat tezlikda yo'lga chiqdi."
        if sor == 't':
            savol, j, ex, b, T = kirish + ' Necha soatda quvib yetadi?', t, [butun(d, v1 + v2), butun(d, v2), t + 1], 'soat', t
        elif sor == 'qoldi':
            j = d - (v2 - v1) * tt
            savol, ex, b, T = kirish + f' {tt} soatdan keyin ular orasi necha km qoladi?', [d - v2 * tt, d + (v2 - v1) * tt, (v2 - v1) * tt], 'km', tt
        else:
            j = v2 * t
            savol, ex, b, T = kirish + f' {B["nom"]} uni o\'zi chiqqan joydan necha km uzoqda quvib yetadi?', [v1 * t, v2 * t + d, d], 'km', t
        L = max(d + v1 * T, v2 * T)
        return {'tur': 'quv', 'sor': sor, 'savol': savol, 'yurganlar': [A, B], 'yol': L, 'T': T,
                'javob': j, 'birlik': b, 'options': son_opts(r, j, ex)}

    # ---- kechikib chiqish ----
    def kech(self, sor):
        r = self.r
        for _ in range(500):
            A, B = self.juft(kerak_farq=True)
            if A['v'] > B['v']: A, B = B, A
            t0 = r.randint(1, 3)
            t = butun(A['v'] * t0, B['v'] - A['v'])
            if t and 1 <= t <= 6 and B['v'] * t <= 500 and self.uniq(('kech', sor, A['v'], B['v'], t0)): break
        v1, v2 = A['v'], B['v']
        q = self.qishloq()
        A.update(x0=0, yon=1); B.update(x0=0, yon=1, t0=t0)
        kirish = f"{A['nom']} {q[0]}dan {v1} km/soat tezlikda yo'lga chiqdi. {t0} soatdan keyin xuddi shu yo'ldan {kichik(B['nom'])} {v2} km/soat tezlikda chiqdi."
        if sor == 't':
            savol, j, ex, b, T = kirish + f' {B["nom"]} yo\'lga chiqqanidan necha soat o\'tib quvib yetadi?', t, [t + t0, butun(v1 * t0, v2), t + 1], 'soat', t0 + t
        elif sor == 'oldin':
            savol, j, ex, b, T = kirish + f' {B["nom"]} yo\'lga chiqqanda {kichik(A["nom"])} undan necha km oldinda edi?', v1 * t0, [v2 * t0, v1 + t0, v1 * (t0 + 1)], 'km', t0
        else:
            savol, j, ex, b, T = kirish + f' {q[0]}dan necha km uzoqda quvib yetadi?', v2 * t, [v1 * t, v2 * (t + t0), v1 * t0], 'km', t0 + t
        L = max(v1 * T, v2 * max(0, T - t0))
        return {'tur': 'kech', 'sor': sor, 'savol': savol, 'yurganlar': [A, B], 'yol': L, 'T': T, 'qishloq': [q[0], ''],
                'javob': j, 'birlik': b, 'options': son_opts(r, j, ex)}


def pos(y, h): return y['x0'] + y['yon'] * y['v'] * max(0, h - y.get('t0', 0))


def tekshir(t):
    y = t['yurganlar']; tur, sor, j = t['tur'], t['sor'], t['javob']
    assert len(set(t['options'])) == 4 and j in t['options'] and all(isinstance(o, int) and o > 0 for o in t['options']), t
    for a in y:
        for h in range(t['T'] + 1): assert -1e-9 <= pos(a, h) <= t['yol'] + 1e-9, (t, a, h)
    T = t['T']
    if tur == 'bitta':
        a = y[0]
        assert pos(a, T) == t['yol']
        assert j == {'t': T, 'S': t['yol'], 'v': a['v']}[sor]
    elif tur == 'uchrash':
        gap = pos(y[1], T) - pos(y[0], T)
        assert (gap == 0 and j == (T if sor == 't' else t['yol'])) if sor in ('t', 'S') else gap == j
        if sor == 't':        # undan oldin uchrashmagan
            assert all(pos(y[1], h) - pos(y[0], h) > 0 for h in range(T))
    elif tur == 'ketish':
        gap = pos(y[1], T) - pos(y[0], T)
        assert gap == t['yol'] and j == {'S': gap, 't': T, 'v': y[1]['v']}[sor]
    elif tur == 'quv':
        gap = pos(y[0], T) - pos(y[1], T)
        if sor == 'qoldi': assert gap == j > 0
        else:
            assert gap == 0 and all(pos(y[0], h) - pos(y[1], h) > 0 for h in range(T))
            assert j == (T if sor == 't' else pos(y[1], T))
    elif tur == 'kech':
        t0 = y[1]['t0']
        if sor == 'oldin': assert T == t0 and j == pos(y[0], t0) - pos(y[1], t0)
        else:
            assert pos(y[0], T) == pos(y[1], T) and all(pos(y[0], h) > pos(y[1], h) for h in range(t0, T))
            assert j == (T - t0 if sor == 't' else pos(y[1], T))
    return True


def main():
    G = lambda tur, sor: (lambda g: getattr(g, tur)(sor))
    rejalar = {
        # 4-sinf 26: yo'l, vaqt, tezlik
        'g4_c2_b26_l1': [[G('bitta', 't'), G('bitta', 'S'), G('bitta', 'v'), G('bitta', 't'), G('bitta', 'S')] * 2,
                         [G('bitta', 'v'), G('bitta', 't'), G('bitta', 'S'), G('bitta', 'v'), G('bitta', 't')] * 2],
        # 27: birgalikdagi harakat (yaqinlashish)
        'g4_c2_b27_l1': [[G('uchrash', 't'), G('uchrash', 'qoldi'), G('uchrash', 't'), G('uchrash', 'S'), G('uchrash', 't')] * 2,
                         [G('uchrash', 'qoldi'), G('uchrash', 'S'), G('uchrash', 't'), G('uchrash', 'qoldi'), G('uchrash', 't')] * 2],
        # 28: qarama-qarshi harakat
        'g4_c2_b28_l1': [[G('ketish', 'S'), G('ketish', 't'), G('ketish', 'S'), G('ketish', 'v'), G('ketish', 't')] * 2,
                         [G('ketish', 't'), G('ketish', 'S'), G('ketish', 'v'), G('ketish', 'S'), G('ketish', 't')] * 2],
        # 29: quvlama harakat
        'g4_c2_b29_l1': [[G('quv', 't'), G('quv', 'qoldi'), G('quv', 't'), G('quv', 'joy'), G('quv', 't')] * 2,
                         [G('quv', 'qoldi'), G('quv', 'joy'), G('quv', 't'), G('quv', 't'), G('quv', 'qoldi')] * 2],
        # 30: kechikishli harakat
        'g4_c2_b30_l1': [[G('kech', 'oldin'), G('kech', 't'), G('kech', 't'), G('kech', 'joy'), G('kech', 't')] * 2,
                         [G('kech', 't'), G('kech', 'oldin'), G('kech', 'joy'), G('kech', 't'), G('kech', 'joy')] * 2],
        # 6-sinf 23: ikki jism harakati — uchrashish va quvib yetish (aralash)
        'y6_harakat': [[G('uchrash', 't'), G('ketish', 'S'), G('quv', 't'), G('uchrash', 'qoldi'), G('kech', 't')] * 2,
                       [G('quv', 'qoldi'), G('uchrash', 'S'), G('kech', 'joy'), G('ketish', 'v'), G('quv', 'joy')] * 2],
    }
    jami = 0
    for lid, reja in rejalar.items():
        g = Gen(lid); out = []
        for mashq in reja:
            assert len(mashq) == 10
            for f in mashq:
                t = f(g); t.pop('kerak', None); tekshir(t); out.append(t)
        prefix = lid.replace('_', '')
        for i, t in enumerate(out, 1): t['id'] = f'{prefix}_yol_{i:02d}'
        (BANKS / f'{lid}_tasks.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
        jami += len(out)
        print(lid, len(out))
    print(f'Jami {jami} topshiriq, hammasi tekshirildi.')


if __name__ == '__main__':
    main()
