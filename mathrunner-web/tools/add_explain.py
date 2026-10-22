#!/usr/bin/env python3
"""Test banklariga (data/banks/*_questions.json) avtomatik yechim (explain) qo'shadi.
Faqat hisoblab topiladigan savollarga: "a + b = ?", qavsli/ko'p amalli misollar, "Taqqoslang: A __ B".
Yechim to'g'ri javob bilan mos kelmasa — yozilmaydi. Qayta ishga tushirsa ham xavfsiz (explain qayta yoziladi)."""
import json, glob, re, sys
from fractions import Fraction

NUM = r'\d{1,3}(?: \d{3})+|\d+(?:,\d+)?'
TOK = re.compile(r'\s*(?:(' + NUM + r')|([+\-−×*·:÷()]))')

def fmt(x):
    if isinstance(x, Fraction):
        if x.denominator != 1: return None
        x = x.numerator
    s = f'{x:,}'.replace(',', ' ')
    return s

def parse(expr):
    pos = 0; toks = []
    expr = expr.strip()
    while pos < len(expr):
        m = TOK.match(expr, pos)
        if not m: return None
        toks.append(('n', Fraction(m.group(1).replace(' ', '').replace(',', '.'))) if m.group(1) else ('o', m.group(2)))
        pos = m.end()
    return toks

OPN = {'+': '+', '-': '-', '−': '-', '×': '*', '*': '*', '·': '*', ':': '/', '÷': '/'}
SHOW = {'+': '+', '-': '−', '*': '×', '/': ':'}

def norm(toks): return [('o', OPN.get(v, v)) if k == 'o' else (k, v) for k, v in toks]

def steps(toks):
    """qadamlar ro'yxati: har qadam — (matn, ...) ; ketma-ket ko'rinish"""
    toks = norm(toks)
    out = []
    def render(ts):
        r = []
        for k, v in ts:
            r.append(fmt(v) if k == 'n' else (SHOW.get(v, v)))
        # (460) -> 460: qavs ichida bitta son qolsa qavs tushiriladi
        for i in range(len(r) - 3, -1, -1):
            if r[i] == '(' and r[i + 2] == ')' and r[i + 1] not in '()': r[i:i + 3] = [r[i + 1]]
        return ' '.join(r).replace('( ', '(').replace(' )', ')')
    def apply(a, o, b):
        if o == '+': return a + b
        if o == '-': return a - b
        if o == '*': return a * b
        if o == '/': return a / b if b else None
    guard = 0
    while len(toks) > 1 and guard < 20:
        guard += 1
        # eng ichki qavs
        idx = None
        for i, t in enumerate(toks):
            if t == ('o', '('): idx = i
            if t == ('o', ')') and idx is not None:
                inner = toks[idx + 1:i]; break
        else:
            inner = None
        if inner is not None:
            if len(inner) == 1:  # (5) -> 5
                toks[idx:i + 1] = inner; continue
            sub = inner; base = idx + 1
        else:
            sub = toks; base = 0
        # birinchi * yoki / bo'lsa shuni, aks holda birinchi + yoki -
        pick = None
        for j, t in enumerate(sub):
            if t[0] == 'o' and t[1] in '*/': pick = j; break
        if pick is None:
            for j, t in enumerate(sub):
                if t[0] == 'o' and t[1] in '+-': pick = j; break
        if pick is None or pick == 0 or pick + 1 >= len(sub) or sub[pick - 1][0] != 'n' or sub[pick + 1][0] != 'n': return None
        r = apply(sub[pick - 1][1], sub[pick][1], sub[pick + 1][1])
        if r is None or r < 0 or r.denominator != 1: return None
        k0 = base + pick - 1
        toks[k0:k0 + 3] = [('n', r)]
        out.append(render(toks))
    return out, (toks[0][1] if toks and toks[0][0] == 'n' else None), render

def solve_arith(q, ans):
    m = re.match(r'^\s*(.+?)\s*=\s*\?\s*$', q)
    if not m: return None
    expr = m.group(1)
    if not re.fullmatch(r'[\d\s+\-−×*·:÷(),]+', expr): return None
    toks = parse(expr)
    if not toks or not any(k == 'o' and v in '+-−×*·:÷' for k, v in toks): return None
    res = steps(toks)
    if not res: return None
    st, val, render = res
    if val is None or fmt(val) is None: return None
    if fmt(val).replace(' ', '') != str(ans).replace(' ', ''): return None
    first = render(norm(toks))
    chain = ' = '.join([first] + st) if st else first
    # 1 qadamli misol: "a + b = c"
    return chain if len(st) <= 1 and '(' not in first else f'{chain}<br>Javob: <b>{fmt(val)}</b>'

def solve_compare(q, ans):
    m = re.match(r'^Taqqoslang:\s*(.+?)\s*__\s*(.+?)\s*$', q)
    if not m: return None
    vals = []
    for side in m.groups():
        toks = parse(side)
        if not toks: return None
        if len(toks) == 1 and toks[0][0] == 'n': vals.append((fmt(toks[0][1]), toks[0][1])); continue
        res = steps(toks)
        if not res or res[1] is None: return None
        vals.append((res[1], res[1]))
    (_, a), (_, b) = vals
    if isinstance(a, str) or isinstance(b, str): return None
    sym = '>' if a > b else '<' if a < b else '='
    if sym != str(ans).strip(): return None
    sa, sb = [m.group(i) for i in (1, 2)]
    if re.fullmatch(NUM, sa) and re.fullmatch(NUM, sb):
        return f'{fmt(a)} {sym} {fmt(b)}, demak javob: <b>{sym}</b>'
    return f'Avval ikkala tomonni hisoblaymiz: {sa} = {fmt(a)}, {sb} = {fmt(b)}.<br>{fmt(a)} {sym} {fmt(b)}, demak javob: <b>{sym}</b>'

def main():
    tot = got = 0
    for f in sorted(glob.glob('data/banks/*_questions.json')):
        d = json.load(open(f)); ch = False
        for x in d:
            tot += 1
            e = solve_arith(x['question'], x['correctAnswer']) or solve_compare(x['question'], x['correctAnswer'])
            if e:
                got += 1
                if x.get('explain') != e: x['explain'] = e; ch = True
            elif 'explain' in x and x.get('explain', '').startswith('Avval') is False and False:
                pass
        if ch: json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2); open(f, 'a').write('\n')
    print('savol', tot, 'yechimli', got)
main()
