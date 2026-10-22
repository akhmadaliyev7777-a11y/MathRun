#!/usr/bin/env python3
"""Rasmga tayanadigan test savollariga rasm (SVG) qo'shadi va rasm/"yuqoridagi" ga tayanib qolgan savollarni
mustaqil qiladi. Qayta ishga tushirish xavfsiz (bir xil natija)."""
import json, glob, re

FILE = 'data/banks/{}_questions.json'
INK, TINT = '#1e2a78', '#eef0ff'


def apples(n):
    out = []
    for i in range(n):
        r, c = divmod(i, 5)
        x, y = 30 + c * 44, 30 + r * 46
        out.append(f'<circle cx="{x}" cy="{y}" r="17" fill="#e5484d" stroke="#9b1c20" stroke-width="2"/>'
                   f'<path d="M{x} {y-17} q2 -8 9 -10" stroke="#2f7d3b" stroke-width="3" fill="none" stroke-linecap="round"/>'
                   f'<ellipse cx="{x+8}" cy="{y-24}" rx="6" ry="3.5" fill="#43b05a" transform="rotate(-25 {x+8} {y-24})"/>')
    rows = (n + 4) // 5
    return f'<svg viewBox="0 0 250 {30 + rows * 46}" role="img" aria-label="Olmalar">{"".join(out)}</svg>'


SUN_GRASS = ('<svg viewBox="0 0 240 150" role="img" aria-label="Quyosh va o\'t">'
             '<rect width="240" height="150" fill="#dff1ff" rx="10"/><circle cx="120" cy="38" r="20" fill="#ffc933"/>'
             + ''.join(f'<line x1="{120+30*__import__("math").cos(a*0.785)}" y1="{38+30*__import__("math").sin(a*0.785)}" x2="{120+38*__import__("math").cos(a*0.785)}" y2="{38+38*__import__("math").sin(a*0.785)}" stroke="#ffc933" stroke-width="3" stroke-linecap="round"/>' for a in range(8))
             + '<rect y="110" width="240" height="40" fill="#5cb85c"/>'
             + ''.join(f'<path d="M{20+i*28} 150 l3 -20 l4 20" fill="#3f9a3f"/>' for i in range(9)) + '</svg>')

HOUSE = ('<svg viewBox="0 0 260 160" role="img" aria-label="Uy, it va mushuk">'
         '<rect width="260" height="160" fill="#dff1ff" rx="10"/><rect y="128" width="260" height="32" fill="#7ccf7c"/>'
         # mushuk — uyning orqasida (faqat bosh va quloqlari ko'rinadi)
         '<path d="M178 70 l7 -16 l8 12 l12 0 l8 -12 l7 16 v16 a22 22 0 0 1 -42 0 z" fill="#f2a650" stroke="#9b5b13" stroke-width="2"/>'
         '<circle cx="190" cy="82" r="2.5" fill="#222"/><circle cx="206" cy="82" r="2.5" fill="#222"/>'
         # uy
         '<rect x="70" y="72" width="120" height="68" fill="#fbe3b6" stroke="#8a5a1d" stroke-width="3"/>'
         '<polygon points="60,74 130,26 200,74" fill="#d64545" stroke="#8a2121" stroke-width="3" stroke-linejoin="round"/>'
         '<rect x="118" y="100" width="24" height="40" fill="#8a5a1d"/><rect x="82" y="86" width="22" height="20" fill="#bfe3ff" stroke="#8a5a1d" stroke-width="2"/>'
         # it — uyning oldida
         '<ellipse cx="40" cy="130" rx="26" ry="14" fill="#c98c4b" stroke="#6a4417" stroke-width="2"/><circle cx="62" cy="116" r="12" fill="#c98c4b" stroke="#6a4417" stroke-width="2"/>'
         '<path d="M56 106 l-4 -10 l10 4 z M70 108 l6 -8 l2 10 z" fill="#6a4417"/><circle cx="66" cy="114" r="2" fill="#222"/><circle cx="73" cy="118" r="3" fill="#222"/>'
         '</svg>')


def table_svg(rows):
    h = 36 + 32 * len(rows)
    out = [f'<rect width="250" height="{h}" fill="#fff" rx="8" stroke="{INK}" stroke-width="2"/>',
           f'<rect width="250" height="34" fill="{TINT}" rx="8"/>',
           f'<text x="14" y="23" font-weight="800" font-size="14" fill="{INK}">Kun</text><text x="170" y="23" font-weight="800" font-size="14" fill="{INK}">Sotildi (dona)</text>']
    for i, (a, b) in enumerate(rows):
        y = 34 + i * 32
        out.append(f'<line x1="0" y1="{y}" x2="250" y2="{y}" stroke="#c9cef5"/><text x="14" y="{y+22}" font-size="15" fill="#222">{a}</text><text x="190" y="{y+22}" font-size="15" font-weight="700" fill="#222">{b}</text>')
    return f'<svg viewBox="0 0 250 {h}" role="img" aria-label="Jadval">{"".join(out)}</svg>'


def pictogram(n, per):
    cars = ''.join(f'<text x="{8+i*44}" y="38" font-size="32">🚗</text>' for i in range(n))
    return (f'<svg viewBox="0 0 {16+n*44} 78" role="img" aria-label="Piktogramma">'
            f'<rect width="{16+n*44}" height="78" fill="#fff" rx="8" stroke="{INK}" stroke-width="2"/>{cars}'
            f'<text x="10" y="66" font-size="13" font-weight="700" fill="{INK}">🚗 = {per} ta mashina</text></svg>')


def patch(fid, qid, **kw):
    path = FILE.format(fid)
    d = json.load(open(path))
    for x in d:
        if x['id'] == qid:
            x.update(kw)
            break
    else:
        raise SystemExit(f'topilmadi: {fid} {qid}')
    json.dump(d, open(path, 'w'), ensure_ascii=False, indent=2); open(path, 'a').write('\n')


# 1-sinf: olmalarni sanash — rasmdagi olmalar savolning o'zida yozilmaydi
for i, n in enumerate([3, 5, 7, 2, 6, 8, 4, 9], 1):
    patch('g1_c1_b2_l1', f's1c1b2l1_{i:02d}', question='Rasmdagi olmalar nechta?', rasm=apples(n))
patch('g1_c1_b1_l2', 's1c1b1l2_01', question='Rasmga qarang. Quyosh qayerda?', rasm=SUN_GRASS)
patch('g1_c1_b1_l2', 's1c1b1l2_05', question="Rasmga qarang. Uyning orqasida kim turibdi?", rasm=HOUSE)
# «Yuqoridagi ...» ga tayanib qolgan savollar — mustaqil
patch('g1_c3_b37_l1', 's1c3b37l1_05', question='"Anvarda 5 ta olma bor edi, 3 ta olma qo\'shildi. Nechta bo\'ldi?" Masalaning javobi qancha?')
patch('g1_c4_b60_l3', 's1c4b60l3_04', question="Ikki qutida a tadan va 8 tadan olma bor. a = 12 bo'lsa, jami nechta olma?")
patch('g2_c1_b18_l1', 's2c1b18l1_02', question="Jadvalga qarang. Eng ko'p qaysi kuni sotildi?",
      rasm=table_svg([('dushanba', 12), ('seshanba', 15), ('chorshanba', 9)]))
patch('g2_c1_b18_l1', 's2c1b18l1_05', question="Alida 8 ta, Valida 5 ta, Sardorda 11 ta marka bor. Uchalasida jami nechta marka (8 + 5 + 11)?")
patch('g2_c1_b18_l1', 's2c1b18l1_08', question="Bahorda 18, yozda 24, kuzda 12 kun yomg'ir yog'di. Kuzda yozdagidan necha kun kam yomg'ir yog'di?")
# piktogramma
d = json.load(open(FILE.format('g4_c1_b11_l2')))
pid = next(x['id'] for x in d if x['question'].startswith('Piktogrammada 1 ta'))
patch('g4_c1_b11_l2', pid, question="Piktogrammada 1 ta belgi 5 ta mashinani bildiradi. 4 ta belgi nechta mashinani bildiradi?", rasm=pictogram(4, 5))
print('tayyor')
