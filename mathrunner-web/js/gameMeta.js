// Fikrlash o'yinlari ro'yxati — bosh sahifa va "Fikrlash o'yinlari" sahifasi uchun umumiy.
// art — kartochka rasmi (o'yin dunyosi, GPT; promptlar: design/oyin-kartochka-promptlar.md); bo'lmasa oddiy kartochka.
import { curriculum } from './app.js';
import { YUQORI } from './yuqori.js';

export const GAME_META = [
  { kind: 'set', art: 'assets/kartochka/set.webp', name: "To'plamlar (Venn)", desc: 'Har bir sonni to\'g\'ri to\'plamga (yoki hech qaysisiga) joylashtiring', icon: 'venn', color: 'var(--violet)', dark: '#5b3bbf' },
  { kind: 'numberOrder', art: 'assets/kartochka/numberOrder.webp', name: 'Tartiblash', desc: 'Sonlarni o\'sish yoki kamayish tartibida joylang', icon: 'sort', color: 'var(--green)', dark: '#2f9d57' },
  { kind: 'placeValue', art: 'assets/kartochka/placeValue.webp', name: 'Xona tarkibi', desc: 'Buyurtmaga ko\'ra konfetlarni xonalar bo\'yicha qutiga yig\'ing', icon: 'columns', color: 'var(--orange)', dark: '#c47a12' },
  { kind: 'balanceScale', art: 'assets/kartochka/balanceScale.webp', name: 'Tarozi', desc: 'Tarozi muvozanatidan noma\'lum og\'irlikni toping', icon: 'scale', color: 'var(--peri)', dark: '#3f56c4' },
  { kind: 'symmetry', art: 'assets/kartochka/symmetry.webp', name: 'Simmetriya', desc: 'Simmetriya o\'qiga nisbatan shaklni to\'ldiring', icon: 'mirror', color: 'var(--pink)', dark: '#c43fa6' },
  { kind: 'netFold', art: 'assets/kartochka/netFold.webp', name: 'Yoyilma', desc: 'Yoyilmani ko\'z oldingizda buklang: qaysi jism chiqadi, yig\'iladimi?', icon: 'net', color: '#C26A4A', dark: '#9a4f34' },
  { kind: 'equationGrid', art: 'assets/kartochka/equationGrid.webp', name: 'Jadval', desc: 'Bo\'sh katakni to\'g\'ri son bilan to\'ldiring', icon: 'grid', color: 'var(--amber, #E0A21E)', dark: '#b07d10' },
  { kind: 'algorithmConveyor', art: 'assets/kartochka/algorithmConveyor.webp', name: 'Saralash', desc: 'Har bir mulohaza uchun "Ha" yoki "Yo\'q"', icon: 'spark', color: 'var(--sky)', dark: '#2f7fb0' },
  { kind: 'fractionStrip', art: 'assets/kartochka/fractionStrip.webp', name: 'Ulush tasmasi', desc: "Devor va shakllarning kerakli qismini bo'yang: kasr, ulush, foiz", icon: 'frac', color: 'var(--pink)', dark: '#c43fa6' },
  { kind: 'coordinatePath', art: 'assets/kartochka/coordinatePath.webp', name: 'Koordinata', desc: 'Xazina oroli xaritasi: nuqtani toping, xazinani qazing, yo\'l chizing', icon: 'axes', color: 'var(--green)', dark: '#2f9d57' },
  { kind: 'motionLine', art: 'assets/kartochka/motionLine.webp', name: 'Harakat', desc: 'Slayder bilan uchrashish yoki quvib yetish vaqtini toping', icon: 'motion', color: 'var(--violet)', dark: '#5b3bbf' },
  { kind: 'protractor', art: 'assets/kartochka/protractor.webp', name: 'Transportir', desc: "Burchakni o'lchang yoki yasang", icon: 'angle', color: 'var(--orange)', dark: '#c47a12' },
];

export function levelsByKind() {
  const map = {};
  for (const g of curriculum().grades)
    for (const c of g.choraks)
      for (const b of c.blocks)
        for (const lv of b.levels)
          if (lv.webSupported && lv.gameKind !== 'test')
            (map[lv.gameKind] ||= []).push({ ...lv, grade: g.grade, chorak: c.chorak, block: b.blok });
  for (const y of YUQORI) (map[y.level.gameKind] ||= []).push({ ...y.level, grade: y.grade, yuqori: true });
  return map;
}
