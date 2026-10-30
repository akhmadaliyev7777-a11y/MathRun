#!/usr/bin/env python3
"""O'yin bank fayllarini (data/banks/*_tasks.json) har bir o'yin darajasi uchun 20 ta topshiriqqa yetkazadi
(2 ta mashq x 10 ta). Bankdagi asl topshiriqlar o'zgarmaydi; yangilari oxiriga "_x01" ... id bilan qo'shiladi.
Qayta ishga tushirsa xavfsiz: oldingi "_xNN" topshiriqlar o'chirilib, bir xil natija bilan qaytadan yoziladi.
Har bir yangi topshiriq javobi hisoblab tekshiriladi (tenglik, Venn zonalari, tarozi...).

Ishga tushirish:  cd mathrunner-web && python3 tools/gen_games.py
Eslatma: curriculum.json'ni export_curriculum.py qayta yaratsa, shu skriptni undan keyin yana ishga tushiring."""
import json, random, re, math, sys
from collections import Counter

TARGET = 20
GEN = re.compile(r'_x\d\d$')
CUR = json.load(open('data/curriculum.json'))
LV = {}
for g in CUR['grades']:
    for ch in g['choraks']:
        for b in ch['blocks']:
            for l in b['levels']:
                LV[l['id']] = (l, b, g['grade'])


def sp(n):  # 12345 -> "12 345"
    return f'{n:,}'.replace(',', ' ')


def save(path, data, indent=2):
    with open(path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=indent)
        f.write('\n')


# ---------------------------------------------------------------- tartiblash
def fix_order_prompt(t):
    """prompt va ascending bir-biriga zid bo'lmasin (bankda ba'zi joylarda zid edi)"""
    p = t['prompt']
    if t['ascending']:
        p = p.replace('kamayish', "o'sish").replace("o'ngdan chapga", "chapdan o'ngga")
    else:
        p = p.replace("o'sish", 'kamayish').replace("chapdan o'ngga", "o'ngdan chapga")
    t['prompt'] = p


def gen_order(seeds, need, rng, lid):
    nums = [x for s in seeds for x in s['numbers']]
    lo, hi = min(nums), max(nums)
    n = Counter(len(s['numbers']) for s in seeds).most_common(1)[0][0]
    prompts = {True: [s['prompt'] for s in seeds if s['ascending']], False: [s['prompt'] for s in seeds if not s['ascending']]}
    used = {tuple(sorted(s['numbers'])) for s in seeds}
    out = []
    permute = lo >= 100 and all(len(str(x)) >= 3 for x in nums) and hi < 10 ** 7
    tries = 0
    while len(out) < need and tries < 5000:
        tries += 1
        asc = (len(seeds) + len(out)) % 2 == 0
        if permute:
            d = len(str(rng.choice(nums)))
            digs = [rng.randint(0, 9) for _ in range(d)]
            if len(set(digs)) < 3:
                continue
            vals = set()
            for _ in range(60):
                rng.shuffle(digs)
                if digs[0] != 0:
                    vals.add(int(''.join(map(str, digs))))
                if len(vals) == n:
                    break
            if len(vals) < n:
                continue
            vals = list(vals)
        else:
            if hi - lo + 1 < n:
                return None
            vals = rng.sample(range(lo, hi + 1), n)
        key = tuple(sorted(vals))
        if key in used:
            continue
        used.add(key)
        pr = prompts[asc] or [s['prompt'] for s in seeds]
        rng.shuffle(vals)
        out.append({'prompt': rng.choice(pr), 'numbers': vals, 'ascending': asc})
    return out if len(out) == need else None


# ---------------------------------------------------------------- xona tarkibi
def gen_place(seeds, need, rng, lid):
    vals = [s['targetNumber'] for s in seeds]
    lo, hi = min(vals), max(vals)
    used = set(vals)
    if 100 <= lo and hi < 1000:
        pool = [v for v in range(100, 1000) if v not in used]
        rng.shuffle(pool)
        zero = [v for v in pool if '0' in str(v)]
        pick = zero[:max(2, need // 4)]
        pick += [v for v in pool if v not in pick][:need - len(pick)]
        rng.shuffle(pick)
    else:
        pool = [v for v in range(lo, hi + 1) if v not in used]
        rng.shuffle(pool)
        pick = pool[:need]
        # son yetmasa (masalan 11–20) — bankdagi sonlar qayta ishlatiladi, ketma-ket takrorlanmaydi
        while len(pick) < need:
            extra = [v for v in range(lo, hi + 1) if v != (pick[-1] if pick else None)]
            pick.append(rng.choice(extra))
    if len(pick) < need:
        return None
    return [{'prompt': seeds[0]['prompt'], 'targetNumber': v} for v in pick]


# ---------------------------------------------------------------- Ha / Yo'q mulohazalar
def gen_conv(seeds, need, rng, lid):
    used = {s['text'] for s in seeds}
    out = []
    tries = 0
    while len(out) < need and tries < 20000:
        tries += 1
        ok = (len(out) % 2 == 0)  # navbat bilan Ha / Yo'q
        text = None
        if lid in ('g1_c1_b14_l1', 'g2_c3_b44_l1'):
            lo, hi = (1, 10) if lid.startswith('g1') else (4, 30)
            n = rng.randint(lo, hi)
            word = rng.choice(['juft', 'toq'])
            if ((n % 2 == 0) == (word == 'juft')) != ok:
                continue
            text = f'{n} {word} son'
        elif lid in ('g2_c3_b55_l1', 'g3_c2_b29_l1'):
            q = 'mi?' if lid.startswith('g3') else ''
            d = rng.randint(2, 9)
            if rng.random() < 0.5:
                m = d * rng.randint(2, 9) if ok else rng.randint(10, 60)
                if (m % d == 0) != ok or m == d:
                    continue
                text = f"{d} soni {m} ning bo'luvchisi{q}"
            else:
                x = d * rng.randint(2, 9) if ok else rng.randint(10, 60)
                if (x % d == 0) != ok:
                    continue
                text = f'{x} soni {d} ga karrali{q}'
        elif lid in ('g4_c1_b9_l1', 'g4_c1_b9_l2'):
            d = rng.choice([2, 5, 10] if lid.endswith('l1') else [3, 9])
            x = rng.randint(100, 9999)
            if (x % d == 0) != ok:
                continue
            text = f"{sp(x)} soni {d} ga bo'linadimi?"
        elif lid == 'g4_c2_b34_l1':
            kind = rng.choice(['*', '+', '-', '/'])
            if kind == '*':
                a, b = rng.randint(12, 79), rng.randint(3, 19); v = a * b; sym = '×'
            elif kind == '/':
                b = rng.randint(3, 9); v = rng.randint(30, 150); a = v * b; sym = '÷'
            elif kind == '+':
                a, b = rng.randint(120, 690), rng.randint(120, 390); v = a + b; sym = '+'
            else:
                a = rng.randint(400, 990); b = rng.randint(100, 390); v = a - b; sym = '−'
            step = 50 if v < 500 else 100
            T = round(v / step) * step + rng.choice([-1, 0, 1]) * step
            if T <= 0 or abs(v - T) < max(8, step * 0.12):
                continue
            gt = rng.random() < 0.5
            if ((v > T) if gt else (v < T)) != ok:
                continue
            text = f"{a} {sym} {b} {'>' if gt else '<'} {T}?"
        else:
            return None
        if text in used:
            continue
        used.add(text)
        out.append({'text': text, 'isTrue': ok})
    return out if len(out) == need else None


def verify_conv(t, lid):
    """Ha/Yo'q mulohazani matndan qayta hisoblab tekshiradi"""
    s = t['text']
    m = re.match(r'^(\d+) (juft|toq) son$', s)
    if m:
        n = int(m.group(1)); return ((n % 2 == 0) == (m.group(2) == 'juft')) == t['isTrue']
    m = re.match(r"^(\d+) soni (\d+) ning bo'luvchisi(?:mi\?)?$", s)
    if m:
        return (int(m.group(2)) % int(m.group(1)) == 0) == t['isTrue']
    m = re.match(r'^(\d+) soni (\d+) ga karrali(?:mi\?)?$', s)
    if m:
        return (int(m.group(1)) % int(m.group(2)) == 0) == t['isTrue']
    m = re.match(r"^([\d ]+) soni (\d+) ga bo'linadimi\?$", s)
    if m:
        return (int(m.group(1).replace(' ', '')) % int(m.group(2)) == 0) == t['isTrue']
    m = re.match(r'^(\d+) ([×÷+−]) (\d+) ([<>]) (\d+)\?$', s)
    if m:
        a, op, b, cmp_, T = int(m.group(1)), m.group(2), int(m.group(3)), m.group(4), int(m.group(5))
        v = {'×': a * b, '+': a + b, '−': a - b, '÷': a / b}[op]
        return ((v > T) if cmp_ == '>' else (v < T)) == t['isTrue']
    return False


# ---------------------------------------------------------------- Venn (to'plamlar)
def pred_of(name):
    s = name.strip().lower()
    m = re.match(r"^(\d+) ning bo'luvchilari$", s)
    if m:
        n = int(m.group(1)); return lambda x: n % x == 0 if x else False
    m = re.match(r"^(\d+) ga (?:karrali|bo'linadigan)(?: sonlar)?$", s)
    if m:
        n = int(m.group(1)); return lambda x: x % n == 0
    m = re.match(r'^(\d+) dan katta(?: sonlar)?$', s)
    if m:
        n = int(m.group(1)); return lambda x: x > n
    m = re.match(r'^(\d+) dan kichik(?: sonlar)?$', s)
    if m:
        n = int(m.group(1)); return lambda x: x < n
    m = re.match(r'^(\d+) ga teng son$', s)
    if m:
        n = int(m.group(1)); return lambda x: x == n
    if s == 'juft sonlar': return lambda x: x % 2 == 0
    if s == 'toq sonlar': return lambda x: x % 2 == 1
    if s in ('bir xonali sonlar', 'bir xonali'): return lambda x: 1 <= x <= 9
    if s == 'ikki xonali sonlar': return lambda x: 10 <= x <= 99
    if s == 'uch xonali sonlar': return lambda x: 100 <= x <= 999
    if s == 'juft bir xonali': return lambda x: x % 2 == 0 and 1 <= x <= 9
    return None


def zone(pa, pb, x):
    a, b = pa(x), pb(x)
    return 'both' if a and b else 'onlyA' if a else 'onlyB' if b else 'neither'


NAMES = ['Aziz', 'Bek', 'Dilnoza', 'Karim', 'Madina', 'Sardor', 'Zilola', 'Jasur', 'Malika', 'Otabek', 'Nigora', 'Ulugbek',
         'Shahlo', 'Farhod', 'Gulnoza', 'Behruz', 'Lola', 'Rustam', 'Kamola', 'Doniyor', 'Sevara', 'Anvar', 'Mohira', 'Timur']
ACTS = [("Futbolni yoqtiradiganlar", "Basketbolni yoqtiradiganlar"), ("It boqadiganlar", "Mushuk boqadiganlar"),
        ("Suzishni biladiganlar", "Velosiped haydashni biladiganlar"), ("Rasm to'garagiga qatnaydiganlar", "Musiqa to'garagiga qatnaydiganlar"),
        ("Shaxmat o'ynaydiganlar", "Shashka o'ynaydiganlar"), ("Ingliz tilini biladiganlar", "Rus tilini biladiganlar"),
        ("Olma yoqtiradiganlar", "Nok yoqtiradiganlar"), ("Kitob o'qishni yoqtiradiganlar", "Rasm chizishni yoqtiradiganlar"),
        ("Matematika to'garagiga qatnaydiganlar", "Ona tili to'garagiga qatnaydiganlar"), ("Choy ichadiganlar", "Sut ichadiganlar"),
        ("Bog'da ishlaganlar", "Kutubxonaga borganlar"), ("Tennis o'ynaydiganlar", "Stol tennisi o'ynaydiganlar")]


def gen_set_names(seeds, need, rng, lid):
    """ismli Venn: to'plamlarning a'zolari promptning o'zida yoziladi — savol yechiladigan bo'ladi"""
    out = []
    pairs = ACTS[:]
    rng.shuffle(pairs)
    for i in range(need):
        A, B = pairs[i % len(pairs)]
        k = rng.choice([5, 6, 6, 7, 8])
        people = rng.sample(NAMES, k)
        zones = ['both', 'onlyA', 'onlyB', 'neither'] + [rng.choice(['both', 'onlyA', 'onlyB', 'neither']) for _ in range(k - 4)]
        rng.shuffle(zones)
        a = [p for p, z in zip(people, zones) if z in ('both', 'onlyA')]
        b = [p for p, z in zip(people, zones) if z in ('both', 'onlyB')]
        prompt = f"{A}: {', '.join(a)}. {B}: {', '.join(b)}. Har bir bolani to'g'ri to'plamga (yoki hech qaysisiga) joylashtiring"
        out.append({'prompt': prompt, 'setAName': A, 'setBName': B, 'elements': [{'value': p, 'zone': z} for p, z in zip(people, zones)]})
    return out


def gen_set(seeds, need, rng, lid):
    if lid in ('g4_c1_b19_l1', 'g3_c4_b71_l1'):
        return gen_set_names(seeds, need, rng, lid)
    names = []
    for s in seeds:
        for nm in (s['setAName'], s['setBName']):
            if pred_of(nm) and nm not in names:
                names.append(nm)
    vals = [int(e['value']) for s in seeds for e in s['elements'] if str(e['value']).isdigit()]
    lo, hi = min(vals), max(vals)
    prompt = next((s['prompt'] for s in seeds if 'sonni' in s['prompt']), seeds[0]['prompt'])
    seedpairs = [(s['setAName'], s['setBName']) for s in seeds]
    allpairs = [(a, b) for a in names for b in names if a != b and (a, b) not in seedpairs]
    rng.shuffle(allpairs)
    pairs = allpairs + [p for p in seedpairs if pred_of(p[0]) and pred_of(p[1])]
    out = []
    pi = 0
    tries = 0
    big = lid.startswith('g3') or lid.startswith('g4')
    while len(out) < need and tries < 4000:
        tries += 1
        A, B = pairs[pi % len(pairs)]
        pi += 1
        pa, pb = pred_of(A), pred_of(B)
        step = 1 if hi < 60 else 5
        pool = [x for x in range(max(lo - 2, 1), hi + 8) if hi < 60 or x % step == 0 or rng.random() < 0.3]
        rng.shuffle(pool)
        bucket = {z: [x for x in pool if zone(pa, pb, x) == z] for z in ('both', 'onlyA', 'onlyB', 'neither')}
        if not (bucket['both'] and bucket['onlyA'] and bucket['onlyB']):
            continue
        k = rng.choice([6, 6, 7, 8]) if big else 6
        picks = [bucket['both'][0], bucket['onlyA'][0], bucket['onlyB'][0]]
        if bucket['neither']:
            picks.append(bucket['neither'][0])
        picks += [x for x in pool if x not in picks][:k - len(picks)]
        rng.shuffle(picks)
        out.append({'prompt': prompt, 'setAName': A, 'setBName': B,
                    'elements': [{'value': str(x), 'zone': zone(pa, pb, x)} for x in picks]})
    return out if len(out) == need else None


def fix_set_seeds(seeds):
    """bankdagi Venn topshiriqlarini tuzatadi: sonli to'plamlarda zona hisoblab qo'yiladi;
    shartsiz (ismli yoki ma'nosiz sonli) topshiriqlarga to'plam a'zolari promptga yoziladi."""
    fixed = []
    for s in seeds:
        seen, uniq = set(), []
        for e in s['elements']:                       # bir xil qiymat ikki marta bo'lsa o'yin tugamay qoladi
            if e['value'] in seen:
                fixed.append((s['id'], e['value'], 'takror element olib tashlandi')); continue
            seen.add(e['value']); uniq.append(e)
        s['elements'] = uniq
        pa, pb = pred_of(s['setAName']), pred_of(s['setBName'])
        if pa and pb:
            for e in s['elements']:
                if str(e['value']).isdigit():
                    z = zone(pa, pb, int(e['value']))
                    if z != e['zone']:
                        fixed.append((s['id'], e['value'], e['zone'], z)); e['zone'] = z
        elif ': ' not in s['prompt'].split("Har bir")[0]:
            a = [e['value'] for e in s['elements'] if e['zone'] in ('both', 'onlyA')]
            b = [e['value'] for e in s['elements'] if e['zone'] in ('both', 'onlyB')]
            who = 'bolani' if all(str(e['value']).isdigit() for e in s['elements']) else None
            pr = s['prompt']
            if who:
                pr = re.sub(r'Har bir \w+ni', 'Har bir bolani (raqami bo\'yicha)', pr)
                head = f"{s['setAName']}: {', '.join(a)}-raqamli bolalar. {s['setBName']}: {', '.join(b)}-raqamli bolalar. "
            else:
                head = f"{s['setAName']}: {', '.join(a)}. {s['setBName']}: {', '.join(b)}. "
            s['prompt'] = head + pr
            fixed.append((s['id'], 'shart promptga yozildi'))
    return fixed


# ---------------------------------------------------------------- tarozi
SHAPES = {'triangle': ('uchburchak', 'yellow'), 'circle': ('doira', 'green'), 'square': ('kvadrat', 'blue'),
          'star': ('yulduzcha', 'orange'), 'hexagon': ('oltiburchak', 'violet')}


def gen_balance(seeds, need, rng, lid):
    ws = [(s['total'] - s['knownWeight']) // s['shapeCount'] for s in seeds]
    counts = sorted({s['shapeCount'] for s in seeds})
    knowns = sorted({s['knownWeight'] for s in seeds})
    wlo, whi = min(ws), max(ws)
    steps = [abs(s['options'][1] - s['options'][0]) for s in seeds]
    step = math.gcd(*steps) if steps else 1
    unit = seeds[0].get('unit', 'kg')
    maxT = max(s['total'] for s in seeds)
    used = {(s['shape'], s['shapeCount'], s['knownWeight'], s['total']) for s in seeds}
    out = []
    tries = 0
    while len(out) < need and tries < 5000:
        tries += 1
        n = rng.choice(counts); k = rng.choice(knowns); w = rng.randint(wlo, whi)
        if step > 1:
            w = max(step, (w // step) * step)
        total = n * w + k
        if (n == 1 and k == 0) or total > maxT * 1.15 or total < 2:
            continue
        shape = rng.choice(list(SHAPES)); nm, color = SHAPES[shape]
        key = (shape, n, k, total)
        if key in used:
            continue
        pos = rng.randint(0, 3)
        opts = [w + (i - pos) * step for i in range(4)]
        if min(opts) < 1:
            continue
        used.add(key)
        hint = f'Tarozida {n} ta bir xil {nm}' + (f' va {k} {unit} li tosh turibdi' if k else ' turibdi')
        out.append({'prompt': f'Bitta {nm} necha {unit}?', 'hint': hint, 'shape': shape, 'shapeColor': color, 'shapeCount': n,
                    'knownWeight': k, 'total': total, 'options': opts, 'unit': unit})
    return out if len(out) == need else None


# ---------------------------------------------------------------- jadval (tenglamalar)
OPS = {'+': lambda a, b: a + b, '-': lambda a, b: a - b, '*': lambda a, b: a * b, '×': lambda a, b: a * b,
       '÷': lambda a, b: a // b if b and a % b == 0 else None}


def gen_grid(seeds, need, rng, lid):
    eqs = [e for s in seeds for e in s['equations']]
    stats = {}
    for e in eqs:
        st = stats.setdefault(e['operator'], {'a': [], 'b': [], 'r': []})
        st['a'].append(e['a']); st['b'].append(e['b']); st['r'].append(e['result'])
    ops = [e['operator'] for e in eqs]
    blanks = [e['blankSlot'] for e in eqs]
    sizes = [len(s['equations']) for s in seeds]
    prompts = {}
    for s in seeds:
        prompts.setdefault(len(s['equations']), s['prompt'])
    used = {(e['a'], e['operator'], e['b']) for e in eqs}

    def pick(vals):
        if len(vals) >= 6 and len(set(vals)) <= 3:
            return rng.choice(sorted(set(vals)))
        if max(vals) <= 12:
            return rng.randint(1, max(vals))
        d = len(str(rng.choice(vals)))
        v = rng.randint(10 ** (d - 1) if d > 1 else 1, 10 ** d - 1)
        if all(x % 100 == 0 for x in vals):
            v = (v // 100) * 100 or 100
        elif all(x % 10 == 0 for x in vals):
            v = (v // 10) * 10 or 10
        return v

    def make(op):
        st = stats[op]
        maxr = max(st['r'])
        for _ in range(600):
            if op == '÷':
                b = pick(st['b']); q = rng.randint(2, max(3, min(12, max(st['r']) + 3)))
                a = b * q
                if a > max(st['a']) * 1.2:
                    continue
            else:
                a = pick(st['a']); b = pick(st['b'])
                if (op == '-' and a <= b) or a > max(st['a']) or b > max(st['b']):
                    continue
            r = OPS[op](a, b)
            if r is None or r < 0 or r > maxr or (a, op, b) in used:
                continue
            used.add((a, op, b))
            return {'a': a, 'operator': op, 'b': b, 'result': r, 'blankSlot': rng.choice(blanks)}
        return None

    out = []
    for i in range(need):
        size = sizes[(len(seeds) + i) % len(sizes)]
        es = []
        for _ in range(size):
            e = make(rng.choice(ops))
            if not e:
                return None
            es.append(e)
        out.append({'prompt': prompts[size], 'equations': es})
    return out


# ---------------------------------------------------------------- simmetriya
def gen_sym(seeds, need, rng, lid):
    prompts = {s['axis']: s['prompt'] for s in seeds}
    hints = {s['axis']: s['hint'] for s in seeds}
    ns = [len(s['givenCells']) for s in seeds]
    kmin, kmax = max(4, min(ns)), min(6, max(ns))
    used = {(s['axis'], frozenset((c['x'], c['y']) for c in s['givenCells'])) for s in seeds}
    n = 5
    mid = n // 2

    def allowed(axis):
        cells = []
        for x in range(n):
            for y in range(n):
                if axis == 'vertical' and x < mid: cells.append((x, y))
                elif axis == 'horizontal' and y < mid: cells.append((x, y))
                elif axis == 'diagonalMain' and x < y: cells.append((x, y))
                elif axis == 'center' and (y < mid or (y == mid and x < mid)): cells.append((x, y))
        return cells

    kinds = list(dict.fromkeys(s['axis'] for s in seeds))
    out = []
    tries = 0
    while len(out) < need and tries < 5000:
        tries += 1
        axis = kinds[(len(seeds) + len(out)) % len(kinds)]
        cells = allowed(axis)
        k = rng.randint(kmin, max(kmin, kmax))
        cur = {rng.choice(cells)}
        while len(cur) < k:
            x, y = rng.choice(sorted(cur))
            nb = [(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))]
            nb = [c for c in nb if c in cells and c not in cur]
            if not nb:
                break
            cur.add(rng.choice(nb))
        if len(cur) < k or (axis, frozenset(cur)) in used:
            continue
        used.add((axis, frozenset(cur)))
        gc = sorted(cur, key=lambda c: (c[1], c[0]))
        out.append({'prompt': prompts[axis], 'hint': hints[axis], 'gridSize': n, 'axis': axis,
                    'givenCells': [{'x': x, 'y': y} for x, y in gc]})
    return out if len(out) == need else None


# ---------------------------------------------------------------- yoyilma
HINTS = {
    'cube': ["Kubning 6 ta bir xil kvadrat yog'i bor", "Kubning barcha yoqlari bir xil kvadrat", "Kubda 6 ta yoq, 12 ta qirra va 8 ta uch bor"],
    'cuboid': ["Parallelepipedning qarama-qarshi yoqlari teng to'rtburchak", "Parallelepipedda 6 ta yoq bor, ular to'g'ri to'rtburchak",
               "Parallelepipedda 12 ta qirra va 8 ta uch bor"],
    'squarePyramid': ["Piramidada 1 ta kvadrat asos va 4 ta uchburchak yon yoq bor", "Piramidaning hamma yon yoqlari bitta cho'qqida birlashadi",
                      "Kvadrat asosli piramidada 5 ta yoq bor"],
    'triangularPrism': ["Uchburchakli prizmada 2 ta uchburchak va 3 ta to'rtburchak bor", "Prizmada 2 ta teng uchburchak asos bor",
                        "Uchburchakli prizmada 9 ta qirra va 6 ta uch bor"],
    'cylinder': ["Silindr yoyilmasi — to'g'ri to'rtburchak va 2 ta doira", "Silindrning ikki asosi — teng doiralar",
                 "Silindr yon sirti yozilganda to'g'ri to'rtburchak bo'ladi"],
    'cone': ["Konus yoyilmasi — doira sektori va kichik doira", "Konusning bitta cho'qqisi va bitta doira asosi bor",
             "Konusda faqat 1 ta doira asos bor"],
}


def gen_net(seeds, need, rng, lid):
    tcount = Counter(s['target'] for s in seeds)
    pool = Counter(o for s in seeds for o in s['options'] if o != s['target'])
    prompt = Counter(s['prompt'] for s in seeds).most_common(1)[0][0]
    used = {(s['target'], frozenset(s['options']), s['hint']) for s in seeds}
    tl = sorted(tcount, key=lambda t: (-tcount[t], t))
    out = []
    tries = 0
    while len(out) < need and tries < 5000:
        tries += 1
        t = tl[(len(seeds) + len(out)) % len(tl)]
        dist = [d for d in pool if d != t]
        if len(dist) < 2:
            dist = [x for x in HINTS if x != t]
        opts = [t] + rng.sample(dist, 2)
        rng.shuffle(opts)
        hint = rng.choice(HINTS[t] + [s['hint'] for s in seeds if s['target'] == t])
        key = (t, frozenset(opts), hint)
        if key in used:
            continue
        used.add(key)
        out.append({'prompt': prompt, 'hint': hint, 'target': t, 'options': opts})
    return out if len(out) == need else None



# ---------------------------------------------------------------- kasr tasmasi
def gen_fraction(seeds, need, rng, lid):
    p0 = seeds[0]['prompt']
    used = {s['prompt'] for s in seeds}
    out = []
    if '+' in p0 or '−' in p0:                      # kasrlarni qo'shish / ayirish
        tries = 0
        while len(out) < need and tries < 2000:
            tries += 1
            d = rng.randint(3, 10); plus = len(out) % 2 == 0
            if plus:
                a = rng.randint(1, d - 2); b = rng.randint(1, d - 1 - a); r = a + b; sign = '+'
            else:
                a = rng.randint(2, d - 1); b = rng.randint(1, a - 1); r = a - b; sign = '−'
            prompt = f'{a}/{d} {sign} {b}/{d} = ? Tasmada javobni bo\'yang'
            if prompt in used: continue
            used.add(prompt); out.append({'prompt': prompt, 'denominator': d, 'numerator': r})
    elif '%' in p0:                                 # foizlar
        opts = [(p, 10) for p in range(10, 101, 10)] + [(25, 4), (50, 4), (75, 4), (20, 5), (40, 5), (60, 5), (80, 5)] + [(p, 20) for p in range(5, 100, 10)]
        rng.shuffle(opts)
        for pct, d in opts:
            prompt = f"{pct}% ni bo'yang (tasma {d} bo'lakka bo'lingan)"
            if prompt in used: continue
            used.add(prompt); out.append({'prompt': prompt, 'denominator': d, 'numerator': pct * d // 100})
            if len(out) == need: break
    else:                                           # oddiy ulush
        maxn = max(s['numerator'] for s in seeds)
        cand = [(n, d) for d in range(2, 11) for n in range(1, (d if maxn > 1 else 3))
                if n < d and f"Tasmaning {n}/{d} qismini bo'yang" not in used]
        rng.shuffle(cand)
        for n, d in cand[:need]:
            out.append({'prompt': f"Tasmaning {n}/{d} qismini bo'yang", 'denominator': d, 'numerator': n})
    return out if len(out) == need else None


# ---------------------------------------------------------------- koordinata yo'li
def gen_coord(seeds, need, rng, lid):
    sizes = sorted({s['gridSize'] for s in seeds})
    top = max(p[k] for s in seeds for p in s['points'] for k in ('x', 'y'))
    inclusive = top >= max(sizes)                   # g4: nuqtalar 0..gridSize; g3: 0..gridSize-1
    g3 = lid.startswith('g3')
    used = {tuple((p['x'], p['y']) for p in s['points']) for s in seeds}
    kinds = ['rect', 'tri', 'zig', 'hv'] if g3 else ['vseg', 'hseg', 'diag', 'tri', 'square', 'rect', 'path']
    out = []; tries = 0
    while len(out) < need and tries < 8000:
        tries += 1
        n = rng.choice(sizes); m = n if inclusive else n - 1      # eng katta koordinata
        kind = kinds[len(out) % len(kinds)]
        r = lambda a=0, b=None: rng.randint(a, m if b is None else b)
        if kind == 'vseg':
            x = r(); y1, y2 = sorted(rng.sample(range(0, m + 1), 2)); pts = [(x, y1), (x, y2)]; pr = 'Nuqtalarni bosib tik kesma torting'
        elif kind == 'hseg':
            y = r(); x1, x2 = sorted(rng.sample(range(0, m + 1), 2)); pts = [(x1, y), (x2, y)]; pr = 'Nuqtalarni bosib yotiq kesma torting'
        elif kind == 'diag':
            L = rng.randint(2, m); x0 = r(0, m - L); y0 = r(0, m - L); pts = [(x0 + i * (L // 2 or 1), y0 + i * (L // 2 or 1)) for i in range(3)]
            if pts[2][0] > m or pts[2][1] > m: continue
            pr = "Nuqtalarni ketma-ket bosing — qiya chiziq hosil bo'ladi"
        elif kind in ('tri',):
            a = (r(), r()); b = (r(), r()); c = (r(), r())
            if len({a, b, c}) < 3 or (b[0] - a[0]) * (c[1] - a[1]) == (c[0] - a[0]) * (b[1] - a[1]): continue
            pts = [a, b, c] + ([] if g3 else [a]); pr = 'Koordinatalarni ko\'rsatilgan tartibda bosing' if g3 else 'Koordinatalarni bosib uchburchak yasang'
        elif kind == 'square':
            L = rng.randint(2, m); x0 = r(0, m - L); y0 = r(0, m - L)
            pts = [(x0, y0), (x0 + L, y0), (x0 + L, y0 + L), (x0, y0 + L), (x0, y0)]; pr = "Koordinatalarni ketma-ket bosing — kvadrat hosil bo'ladi"
        elif kind == 'rect':
            w = rng.randint(1, m); h = rng.randint(1, m)
            if w == h: continue
            x0 = r(0, m - w); y0 = r(0, m - h)
            pts = [(x0, y0), (x0 + w, y0), (x0 + w, y0 + h), (x0, y0 + h)] + ([] if g3 else [(x0, y0)])
            pr = "Koordinatalarni ko'rsatilgan tartibda bosing" if g3 else "Koordinatalarni bosib to'g'ri to'rtburchak yasang"
        elif kind == 'zig':
            pts = [(r(), r()) for _ in range(rng.choice([3, 4]))]
            if any(pts[i] == pts[i + 1] for i in range(len(pts) - 1)) or len(set(pts)) < len(pts): continue
            pr = "Koordinatalarni ko'rsatilgan tartibda bosing"
        elif kind == 'hv':
            a = (r(), r()); b = (r(), a[1]); c = (b[0], r())
            if len({a, b, c}) < 3: continue
            pts = [a, b, c]; pr = "Koordinatalarni ko'rsatilgan tartibda bosing"
        else:  # path
            a = (r(), r()); b = (a[0], r()); c = (r(), b[1])
            if len({a, b, c}) < 3: continue
            pts = [a, b, c]; pr = 'Koordinatalarni ketma-ket bosing'
        if any(x > m or y > m or x < 0 or y < 0 for x, y in pts): continue
        key = tuple(pts)
        if key in used: continue
        used.add(key)
        out.append({'prompt': pr, 'gridSize': n, 'points': [{'x': x, 'y': y} for x, y in pts]})
    return out if len(out) == need else None


# ---------------------------------------------------------------- harakat chizig'i
MOVE_PAIRS = [("Ko'k mashina", "Qizil mashina"), ('Anvar', 'Bek'), ('1-velosipedchi', '2-velosipedchi'), ('1-avtomobil', '2-avtomobil'),
              ('1-poyezd', '2-poyezd'), ('Sariq mashina', 'Yashil mashina'), ('Sardor', 'Jasur'), ('Oq mashina', 'Qora mashina')]
CHASE_PAIRS = [('Oldingi mashina', 'Orqadagi mashina'), ('Piyoda', 'Velosipedchi'), ('Sekin mashina', 'Tez mashina'),
               ('Yuk mashinasi', 'Yengil mashina'), ('Oldingi poyezd', 'Orqadagi poyezd'), ('Sekin poyezd', 'Tez poyezd')]
CEIL10 = lambda x: int(math.ceil(x / 10.0) * 10)


def pos_at(r, h):
    return r['startPosition'] + r['direction'] * r['speed'] * max(0, h - r.get('startHour', 0))


def gen_motion(seeds, need, rng, lid):
    kind = lid.split('_')[2]            # b26 ... b30
    used = {(s['prompt'], s['runnerA']['speed'], s['runnerB']['speed'], s['runnerA']['startPosition'], s['answerHour']) for s in seeds}
    out = []; tries = 0
    while len(out) < need and tries < 8000:
        tries += 1
        t = rng.randint(2, 6)
        mh = t + rng.randint(1, 2)
        if kind == 'b26':
            v = rng.choice([8, 10, 12, 15, 20, 25, 30, 40, 45, 50]); s0 = rng.choice([0, 0, 0, 10, 20])
            L = s0 + v * t
            who = rng.choice(['Mashina', 'Poyezd', 'Avtobus', 'Velosipedchi'])
            if s0 == 0:
                prompt = f"{who} {v} km/soat tezlikda {L} km yo'lga chiqdi. U necha soatda manzilga yetadi?"
                hint = f'Slayderni {who.lower()} {L} km manzilga yetadigan soatga suring'
            else:
                prompt = f"{who} {s0}-chi kilometrdan boshlab {v} km/soat tezlikda yuradi. U {L}-chi kilometrga necha soatda yetadi?"
                hint = f'Slayderni {who.lower()} {L} km belgisiga yetadigan soatga suring'
            vb = rng.choice([x for x in (5, 8, 10, 12, 15) if x != v])
            A = {'label': who, 'startPosition': s0, 'speed': v, 'direction': 1}
            B = {'label': 'Hamroh', 'startPosition': rng.choice([0, 0, 5]), 'speed': vb, 'direction': 1}
        elif kind == 'b27':
            a, b = rng.randint(5, 35), rng.randint(5, 35); L = (a + b) * t
            if L > 300: continue
            la, lb = rng.choice(MOVE_PAIRS)
            word = 'mashina' if 'mashina' in la or 'avtomobil' in la else 'piyoda' if la in ('Anvar', 'Sardor') else 'velosipedchi' if 'velosiped' in la else 'poyezd'
            prompt = f'Ikki {word} bir-biriga qarab yo\'lga chiqdi. Ular necha soatdan keyin uchrashadi?'
            hint = 'Slayderni ular uchrashadigan soatga suring'
            A = {'label': la, 'startPosition': 0, 'speed': a, 'direction': 1}
            B = {'label': lb, 'startPosition': L, 'speed': b, 'direction': -1}
        elif kind == 'b28':
            a, b = rng.randint(10, 30), rng.randint(10, 30); D = (a + b) * t
            if D > 250: continue
            who, sing = rng.choice([('mashina', 'bir joydan qarama-qarshi tomonga jo\'nadi'), ('velosipedchi', "bir joydan qarama-qarshi yo'nalishda yo'lga chiqdi"),
                                    ('piyoda', "bir nuqtadan qarama-qarshi yo'nalishda yurdi"), ('avtomobil', 'bir shahardan qarama-qarshi tomonga jo\'nadi')])
            prompt = f"Ikki {who} {sing} ({a} va {b} km/soat). Necha soatdan keyin ular orasidagi masofa {D} km bo'ladi?"
            hint = f'Slayderni ular orasidagi masofa {D} km bo\'ladigan soatga suring'
            S0 = CEIL10(max(a, b) * mh)
            L = CEIL10(S0 + max(a, b) * mh)
            la, lb = (f'1-{who}', f'2-{who}')
            A = {'label': la, 'startPosition': S0, 'speed': a, 'direction': -1}
            B = {'label': lb, 'startPosition': S0, 'speed': b, 'direction': 1}
        elif kind == 'b29':
            a = rng.randint(5, 20); b = a + rng.randint(5, 20); gap = (b - a) * t
            if gap > 120: continue
            la, lb = rng.choice(CHASE_PAIRS)
            prompt = f'{lb} {la.lower()}ni necha soatdan keyin quvib yetadi?'
            hint = 'Slayderni quvib yetadigan soatga suring'
            L = CEIL10(max(b * mh, gap + a * mh))
            A = {'label': la, 'startPosition': gap, 'speed': a, 'direction': 1}
            B = {'label': lb, 'startPosition': 0, 'speed': b, 'direction': 1}
        else:  # b30 kechikishli
            h = rng.choice([1, 2, 2, 3]); a = rng.randint(8, 30); b = a + rng.randint(4, 20)
            if (b * h) % (b - a): continue
            t = b * h // (b - a)
            if t < h + 1 or t > 9: continue
            mh = t + rng.randint(1, 2)
            L = CEIL10(max(a * mh, b * (mh - h)))
            prompt = f"Birinchi mashina {h} soat oldin chiqdi. Ikkinchi mashina birinchisini necha soatda quvib yetadi?"
            hint = 'Slayderni quvib yetadigan soatga suring'
            A = {'label': '1-mashina', 'startPosition': 0, 'speed': a, 'direction': 1}
            B = {'label': '2-mashina', 'startPosition': 0, 'speed': b, 'direction': 1, 'startHour': h}
        task = {'prompt': prompt, 'hint': hint, 'roadLength': L, 'maxHours': mh, 'answerHour': t, 'runnerA': A, 'runnerB': B}
        key = (prompt, A['speed'], B['speed'], A['startPosition'], t)
        if key in used or not verify_motion(task, kind):
            continue
        used.add(key)
        out.append(task)
    return out if len(out) == need else None


def verify_motion(t, kind):
    A, B, ans, mh, L = t['runnerA'], t['runnerB'], t['answerHour'], t['maxHours'], t['roadLength']
    if not (1 <= ans < mh): return False
    hours = range(0, mh + 1)
    if kind == 'b26':
        first = next((h for h in hours if pos_at(A, h) >= L), None)
        ok = first == ans and pos_at(A, ans) == L
    elif kind == 'b28':
        D = int(re.search(r'masofa (\d+) km', t['prompt']).group(1))
        first = next((h for h in hours if abs(pos_at(A, h) - pos_at(B, h)) == D), None)
        ok = first == ans
    else:
        first = next((h for h in hours if h > 0 and pos_at(A, h) == pos_at(B, h)), None)
        ok = first == ans
    # barcha pozitsiyalar yo'l ichida (yoki chegaradan chiqmasin)
    inside = all(-0.001 <= pos_at(r, h) <= L + 0.001 for r in (A, B) for h in range(0, ans + 1))
    return ok and inside


# ---------------------------------------------------------------- transportir
def gen_protractor(seeds, need, rng, lid):
    mode = seeds[0]['mode']
    used = {s['targetDegrees'] for s in seeds}
    pool = [d for d in range(10, 171, 5) if d not in used and (d % 10 == 0 or rng.random() < 0.55)]
    rng.shuffle(pool)
    if len(pool) < need: return None
    out = []
    for d in pool[:need]:
        if mode == 'measure':
            out.append({'mode': 'measure', 'prompt': "Chizilgan burchakni transportir bilan o'lchang.", 'hint': "Harakatlanuvchi nurni sirli nur ustiga aniq keltiring", 'targetDegrees': d})
        else:
            kind = "to'g'ri burchak" if d == 90 else "o'tkir burchak" if d < 90 else "o'tmas burchak"
            out.append({'mode': 'construct', 'prompt': f"Transportir yordamida {d}° li {kind} yasang.", 'hint': f'Nurni {d}° ga qo\'ying', 'targetDegrees': d})
    return out


GENS = {'numberOrder': gen_order, 'placeValue': gen_place, 'algorithmConveyor': gen_conv, 'set': gen_set,
        'balanceScale': gen_balance, 'equationGrid': gen_grid, 'netFold': gen_net,
        'fractionStrip': gen_fraction}


# ---------------------------------------------------------------- tekshiruv
def verify(kind, t, lid):
    if kind == 'numberOrder':
        return len(set(t['numbers'])) == len(t['numbers'])
    if kind == 'set':
        pa, pb = pred_of(t['setAName']), pred_of(t['setBName'])
        if pa and pb:
            return all(zone(pa, pb, int(e['value'])) == e['zone'] for e in t['elements'])
        return len({e['value'] for e in t['elements']}) == len(t['elements'])
    if kind == 'balanceScale':
        w = (t['total'] - t['knownWeight']) / t['shapeCount']
        return w == int(w) and int(w) in t['options'] and len(set(t['options'])) == 4
    if kind == 'equationGrid':
        return all(OPS[e['operator']](e['a'], e['b']) == e['result'] for e in t['equations'])
    if kind == 'netFold':
        return t['target'] in t['options'] and len(set(t['options'])) == 3
    if kind == 'algorithmConveyor':
        return verify_conv(t, lid)
    if kind == 'fractionStrip':
        m = re.match(r'^(\d+)/(\d+) ([+−]) (\d+)/(\d+) =', t['prompt'])
        if m:
            a, d, op, b = int(m.group(1)), int(m.group(2)), m.group(3), int(m.group(4))
            return d == int(m.group(5)) == t['denominator'] and t['numerator'] == (a + b if op == '+' else a - b) and 0 < t['numerator'] < d
        return 0 < t['numerator'] <= t['denominator']
    if kind == 'coordinatePath':
        pts = [(p['x'], p['y']) for p in t['points']]
        return len(pts) >= 2 and all(a != b for a, b in zip(pts, pts[1:]))
    if kind == 'motionLine':
        return verify_motion(t, lid.split('_')[2])
    if kind == 'protractor':
        return 0 < t['targetDegrees'] < 180
    return True


def main():
    done = failed = 0
    for lid, (l, b, grade) in LV.items():
        kind = l['gameKind']
        if kind == 'test' or kind not in GENS:
            continue
        path = 'data/' + l['bank']
        bank = json.load(open(path))
        seeds = [x for x in bank if not GEN.search(x['id'])]
        if kind == 'numberOrder':
            for s in seeds:
                fix_order_prompt(s)
        if kind == 'set':
            for f in fix_set_seeds(seeds):
                print('  bankda tuzatildi:', f)
        need = TARGET - len(seeds)
        if need <= 0:
            save(path, seeds); l['count'] = len(seeds)
            continue
        rng = random.Random(f'20261021-{lid}')
        new = GENS[kind](seeds, need, rng, lid)
        if not new:
            print('XATO: yaratib bo\'lmadi', lid, kind); failed += 1
            continue
        prefix = re.sub(r'_\d+$', '', seeds[0]['id'])
        for i, t in enumerate(new, 1):
            t['id'] = f'{prefix}_x{i:02d}'
            if not verify(kind, t, lid):
                print('XATO: tekshiruvdan o\'tmadi', lid, t); sys.exit(1)
        save(path, seeds + new)
        l['count'] = len(seeds) + len(new)
        l['webSupported'] = True
        done += 1
    save('data/curriculum.json', CUR, 1)
    print('yangilandi:', done, 'daraja; yaratilmadi:', failed)


main()
