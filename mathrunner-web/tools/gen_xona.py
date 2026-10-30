"""«Xona tarkibi» (shirinliklar fabrikasi) o'yini banklari.

Buyurtma turlari (topshiriqdagi `buyurtma`):
  {"tur": "son"}                       — «234 ta konfet»
  {"tur": "soz", "matn": "..."}         — so'z bilan: «ikki yuz o'ttiz to'rt»
  {"tur": "xona", "x": [m, y, o, b]}    — xona birliklari (ba'zan 9 dan ko'p: «3 o'nlik 14 birlik» — mashina o'zi o'raydi)
  {"tur": "yigindi", "matn": "200 + 30 + 4"} — xona qo'shiluvchilari
Asl banklardagi 1-mashq sonlari saqlanadi (takrorlari almashtiriladi), 2-mashq — aralash buyurtmalar.
Yangi darajalar curriculum.json ga qo'shiladi. Qayta ishlatish xavfsiz. Ishga tushirish: python3 tools/gen_xona.py
"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANKS = ROOT / 'data' / 'banks'
BIR = ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"]
ON = ['', "o'n", 'yigirma', "o'ttiz", 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', "to'qson"]


def soz(n):
    m, y, o, b = n // 1000, n // 100 % 10, n // 10 % 10, n % 10
    q = []
    if m: q += [BIR[m], 'ming']
    if y: q += [BIR[y], 'yuz']
    if o: q.append(ON[o])
    if b: q.append(BIR[b])
    return ' '.join(q)


def sozdan(s):   # tekshiruv uchun teskari o'qish
    n, cur = 0, 0
    for w in s.split():
        if w in BIR: cur += BIR.index(w)
        elif w in ON: cur += 10 * ON.index(w)
        elif w == 'yuz': cur *= 100
        elif w == 'ming': n += cur * 1000; cur = 0
        else: raise ValueError(w)
    return n + cur


def xonalar(n): return [n // 1000, n // 100 % 10, n // 10 % 10, n % 10]


def yigindi(n):
    q = [str(d * 10 ** (3 - i)) for i, d in enumerate(xonalar(n)) if d]
    return ' + '.join(q)


def qayta(rng, n):
    """bitta xonadan birini pastki xonaga «ochib» beradi: 345 → 3 yuzlik 3 o'nlik 15 birlik (xonadan o'tish)"""
    x = xonalar(n)
    joy = [i for i in range(3) if x[i] > 0 and x[i + 1] <= 9]
    if not joy: return None
    i = rng.choice(joy)
    x[i] -= 1; x[i + 1] += 10
    return x


def misol(pref, i, n, b, prompt):
    t = {'id': f'{pref}_{i + 1:02d}', 'prompt': prompt, 'targetNumber': n}
    if b and b['tur'] != 'son': t['buyurtma'] = b
    # tekshiruv
    if b['tur'] == 'soz': assert sozdan(b['matn']) == n, (n, b)
    if b['tur'] == 'xona': assert sum(v * 10 ** (3 - j) for j, v in enumerate(b['x'])) == n and max(b['x']) <= 19, (n, b)
    if b['tur'] == 'yigindi': assert sum(int(v) for v in b['matn'].split(' + ')) == n, (n, b)
    return t


def turlab(rng, n, tur):
    if tur == 'soz': return {'tur': 'soz', 'matn': soz(n)}
    if tur == 'xona': return {'tur': 'xona', 'x': xonalar(n)}
    if tur == 'yigindi': return {'tur': 'yigindi', 'matn': yigindi(n)}
    if tur == 'qayta':
        x = qayta(rng, n)
        return {'tur': 'xona', 'x': x} if x else {'tur': 'xona', 'x': xonalar(n)}
    return {'tur': 'son'}


def bank(pref, prompt, m1, m2, seed, asl=None):
    """m1, m2: [(son, tur), …] — har mashqqa 10 tadan"""
    rng = random.Random(seed)
    out = [misol(pref, i, n, turlab(rng, n, tur), prompt) for i, (n, tur) in enumerate(m1 + m2)]
    assert len(out) == 20 and len({t['targetNumber'] for t in out[:10]}) == 10 and len({t['targetNumber'] for t in out[10:]}) == 10, pref
    return out


def tanla(rng, lo, hi, k, shart=lambda n: True, chiqar=()):
    pool = [n for n in range(lo, hi + 1) if shart(n) and n not in chiqar]
    return rng.sample(pool, k)


def asl_sonlar(fayl):
    t = json.loads((BANKS / fayl).read_text(encoding='utf-8'))
    seen, out = set(), []
    for x in t:
        if x['targetNumber'] not in seen: seen.add(x['targetNumber']); out.append(x['targetNumber'])
    return out


TURLAR2 = ['soz', 'soz', 'xona', 'xona', 'yigindi', 'yigindi', 'qayta', 'qayta', 'qayta', 'son']

if __name__ == '__main__':
    rng = random.Random(30)
    B = {}
    P1 = "Sonni o'nlik va birlik bloklaridan quring"
    P2 = "Sonni yuzlik, o'nlik va birlik bloklaridan quring"
    P4 = "Sonni ming, yuzlik, o'nlik va birlik bloklaridan quring"
    mix = lambda ns: list(zip(ns, rng.sample(TURLAR2, 10)))

    # 1-sinf 22-mavzu: 11–20
    a = list(range(11, 21)); rng.shuffle(a)
    b2 = tanla(rng, 11, 20, 10)
    m2 = list(zip(b2, ['soz', 'soz', 'soz', 'xona', 'xona', 'yigindi', 'yigindi', 'qayta', 'qayta', 'son']))
    m2 = [(n, 'xona' if t == 'yigindi' and n % 10 == 0 else t) for n, t in m2]
    B['g1_c2_b22_l1'] = bank('g1c2b22l1_pv', P1, [(n, 'son') for n in a], m2, 1)
    # 1-sinf 29-mavzu: 21–99
    a = asl_sonlar('g1_c2_b29_l1_tasks.json')[:10]
    B['g1_c2_b29_l1'] = bank('g1c2b29l1_pv', P1, [(n, 'son') for n in a], mix(tanla(rng, 21, 99, 10, chiqar=a)), 2)
    # 2-sinf 20-mavzu: uch xonali, 2-mashqda nolli sonlar ham
    a = asl_sonlar('g2_c2_b20_l1_tasks.json')[:10]
    b2 = tanla(rng, 101, 999, 6, chiqar=a) + tanla(rng, 101, 999, 4, lambda n: n % 10 == 0 or n // 10 % 10 == 0, a)
    B['g2_c2_b20_l1'] = bank('g2c2b20l1_pv', P2, [(n, 'son') for n in a], mix(b2), 3)
    # YANGI 2-sinf 5-mavzu: xona birliklari va xona qo'shiluvchilari (ikki xonali)
    a = tanla(rng, 21, 99, 10, lambda n: n % 10)
    b2 = tanla(rng, 21, 99, 10, lambda n: n % 10 and n >= 20, a)
    B['g2_c1_b5_l3'] = bank('g2c1b5l3_pv', P1, list(zip(a, ['xona'] * 5 + ['yigindi'] * 5)), list(zip(b2, ['qayta'] * 6 + ['soz'] * 2 + ['yigindi'] * 2)), 4)
    # YANGI 3-sinf 5-mavzu: ko'p xonali sonlar (ming), nollar bilan
    a = tanla(rng, 1001, 9999, 6) + tanla(rng, 1001, 9999, 4, lambda n: '0' in str(n)[1:])
    b2 = tanla(rng, 1001, 9999, 5, chiqar=a) + tanla(rng, 1001, 9999, 5, lambda n: str(n).count('0') >= 1, a)
    B['g3_c1_b5_l3'] = bank('g3c1b5l3_pv', P4, list(zip(a, ['son'] * 4 + ['soz'] * 3 + ['xona'] * 3)), mix(b2), 5)
    # YANGI 4-sinf 1-mavzu: joy qiymati — so'z, yig'indi, xonadan o'tgan buyurtmalar
    a = tanla(rng, 1001, 9999, 10)
    b2 = tanla(rng, 1001, 9999, 10, lambda n: '0' in str(n), a)
    B['g4_c1_b1_l3'] = bank('g4c1b1l3_pv', P4, list(zip(a, ['soz'] * 4 + ['yigindi'] * 3 + ['xona'] * 3)), list(zip(b2, ['qayta'] * 5 + ['soz'] * 3 + ['yigindi'] * 2)), 6)

    for lid, t in B.items():
        (BANKS / f'{lid}_tasks.json').write_text(json.dumps(t, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(lid, len(t), [x['targetNumber'] for x in t[:3]], [x.get('buyurtma') for x in t[10:13]])

    # yangi darajalarni curriculum.json ga qo'shish (bor bo'lsa — o'zgarmaydi)
    cp = ROOT / 'data' / 'curriculum.json'
    cur = json.loads(cp.read_text(encoding='utf-8'))
    yangi = {(2, 1, 5): 'g2_c1_b5_l3', (3, 1, 5): 'g3_c1_b5_l3', (4, 1, 1): 'g4_c1_b1_l3'}
    qoshildi = 0
    for g in cur['grades']:
        for c in g['choraks']:
            for b in c['blocks']:
                lid = yangi.get((g['grade'], c['chorak'], b['blok']))
                if lid and not any(l['id'] == lid for l in b['levels']):
                    b['levels'].append({'id': lid, 'level': len(b['levels']) + 1, 'gameKind': 'placeValue', 'count': 20,
                                        'bank': f'banks/{lid}_tasks.json', 'webSupported': True})
                    c['levelCount'] = c.get('levelCount', 0) + 1; g['levelCount'] = g.get('levelCount', 0) + 1
                    qoshildi += 1
    if qoshildi:
        tt = cur['totals']; tt['levels'] += qoshildi; tt['gameLevels'] += qoshildi; tt['gameTasks'] += 20 * qoshildi
        nl = '\n' if cp.read_text(encoding='utf-8').endswith('\n') else ''
        cp.write_text(json.dumps(cur, ensure_ascii=False, indent=1) + nl, encoding='utf-8')   # fayl 1 bo'sh joy bilan yozilgan
    print('curriculum: yangi daraja', qoshildi)
