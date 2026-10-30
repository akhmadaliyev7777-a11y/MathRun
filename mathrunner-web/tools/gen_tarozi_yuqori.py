"""Tarozi o'yini — yuqori sinflar (6–7) uchun banklar.

6-sinf «4. Tenglamalarni yechish»: a·◆ + b = c (chap pallada figuralar va tosh, o'ngda tosh).
7-sinf «5.1 Sodda chiziqli tenglamalar» va Algebra «25. Al-Xorazmiy usuli»: a·◆ + b = c·◆ + d
(ikkala pallada figura — ikkala tomondan bir xil narsani olib tashlab yechiladi).
Har misol tekshiriladi: javob butun musbat, 4 ta variantdan faqat bittasi tarozini muvozanatga keltiradi.
Qayta ishlatish xavfsiz (seed qat'iy). Ishga tushirish: python3 tools/gen_tarozi_yuqori.py
"""
import json, random
from pathlib import Path

SHAKL = [('triangle', 'yellow', 'uchburchak'), ('circle', 'green', 'doira'), ('square', 'blue', 'kvadrat'),
         ('star', 'orange', 'yulduzcha'), ('hexagon', 'violet', 'oltiburchak')]
BANKS = Path(__file__).resolve().parent.parent / 'data' / 'banks'


def variantlar(rng, x, n, k, m, T):
    cand = {x - 1, x + 1, x + 2, x - 2, x + 3}
    # tipik xatolar: tosh ayirilmagan, figuralar soni noto'g'ri olingan
    if (T + k) % max(1, n - m) == 0: cand.add((T + k) // max(1, n - m))
    if m and T % n == 0: cand.add(T // n)
    if (T - k) % n == 0: cand.add((T - k) // n)
    cand = [v for v in cand if v > 0 and v != x and n * v + k != m * v + T]
    rng.shuffle(cand)
    return sorted([x] + cand[:3])


def misol(rng, i, n, m, k, x, pref):
    T = (n - m) * x + k
    sh, col, nom = SHAKL[i % len(SHAKL)]
    t = {'id': f'{pref}_{i + 1:02d}', 'prompt': f'Bitta {nom} necha kg?', 'shape': sh, 'shapeColor': col,
         'shapeCount': n, 'knownWeight': k, 'total': T, 'unit': 'kg'}
    if m: t['rightShapeCount'] = m
    t['options'] = variantlar(rng, x, n, k, m, T)
    # tekshiruv
    assert len(t['options']) == 4 and len(set(t['options'])) == 4, t
    ok = [v for v in t['options'] if n * v + k == m * v + T]
    assert ok == [x] and x > 0 and T > 0, t
    return t


def bank(pref, sozlama, seed):
    rng = random.Random(seed)
    out, seen = [], set()
    for mashq in sozlama:
        cnt = 0
        while cnt < 10:
            n, m, k, x = mashq(rng)
            key = (n, m, k, x)
            if key in seen or n <= m: continue
            seen.add(key)
            out.append(misol(rng, len(out), n, m, k, x, pref)); cnt += 1
    return out


R = lambda a, b: (lambda rng: rng.randint(a, b))
LEVELS = {
    # 6-sinf: a·◆ + b = c
    'y6_tenglama': [lambda r: (r.randint(2, 4), 0, r.randint(2, 15), r.randint(3, 12)),
                    lambda r: (r.randint(3, 6), 0, r.randint(5, 30), r.randint(5, 18))],
    # 7-sinf: a·◆ + b = c·◆ + d — avval o'ngda bitta figura, keyin ko'proq
    'y7_chiziqli': [lambda r: (r.randint(2, 4), 1, r.randint(0, 12), r.randint(3, 14)),
                    lambda r: (lambda m: (m + r.randint(1, 3), m, r.randint(2, 20), r.randint(4, 16)))(r.randint(1, 3))],
    # 7-sinf Algebra, al-Xorazmiy: al-muqobala — ikkala tomondagi bir xil hadlarni qisqartirish
    'y7a_xorazmiy': [lambda r: (lambda m: (m + r.randint(1, 2), m, r.randint(1, 15), r.randint(3, 15)))(r.randint(1, 2)),
                     lambda r: (lambda m: (m + r.randint(1, 4), m, r.randint(5, 25), r.randint(5, 20)))(r.randint(2, 4))],
}

if __name__ == '__main__':
    for i, (pref, s) in enumerate(LEVELS.items()):
        b = bank(pref, s, 2026 + i)
        assert len(b) == 20
        (BANKS / f'{pref}_tasks.json').write_text(json.dumps(b, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(pref, len(b), 'ta, eng katta jami', max(t['total'] for t in b), ', pallada eng ko\'p figura', max(t['shapeCount'] for t in b))
