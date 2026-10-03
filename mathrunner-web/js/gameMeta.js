// Fikrlash o'yinlari ro'yxati — bosh sahifa va "Fikrlash o'yinlari" sahifasi uchun umumiy.
import { curriculum } from './app.js';

export const GAME_META = [
  { kind: 'set', name: "To'plamlar (Venn)", desc: 'Har bir sonni to\'g\'ri to\'plamga (yoki hech qaysisiga) joylashtiring', icon: 'venn', color: 'var(--violet)', dark: '#5b3bbf' },
  { kind: 'numberOrder', name: 'Tartiblash', desc: 'Sonlarni o\'sish yoki kamayish tartibida joylang', icon: 'sort', color: 'var(--green)', dark: '#2f9d57' },
  { kind: 'placeValue', name: 'Xona tarkibi', desc: 'Yuzlik / o\'nlik / birlik bloklaridan maqsad sonni quring', icon: 'columns', color: 'var(--orange)', dark: '#c47a12' },
  { kind: 'balanceScale', name: 'Tarozi', desc: 'Tarozi muvozanatidan noma\'lum og\'irlikni toping', icon: 'scale', color: 'var(--peri)', dark: '#3f56c4' },
  { kind: 'symmetry', name: 'Simmetriya', desc: 'Simmetriya o\'qiga nisbatan shaklni to\'ldiring', icon: 'mirror', color: 'var(--pink)', dark: '#c43fa6' },
  { kind: 'netFold', name: 'Yoyilma', desc: 'Bu yoyilma qaysi hajmli shaklni hosil qiladi?', icon: 'net', color: '#C26A4A', dark: '#9a4f34' },
  { kind: 'equationGrid', name: 'Jadval', desc: 'Bo\'sh katakni to\'g\'ri son bilan to\'ldiring', icon: 'grid', color: 'var(--amber, #E0A21E)', dark: '#b07d10' },
  { kind: 'algorithmConveyor', name: 'Saralash', desc: 'Har bir mulohaza uchun "Ha" yoki "Yo\'q"', icon: 'spark', color: 'var(--sky)', dark: '#2f7fb0' },
];

export function levelsByKind() {
  const map = {};
  for (const g of curriculum().grades)
    for (const c of g.choraks)
      for (const b of c.blocks)
        for (const lv of b.levels)
          if (lv.webSupported && lv.gameKind !== 'test')
            (map[lv.gameKind] ||= []).push({ ...lv, grade: g.grade, chorak: c.chorak, block: b.blok });
  return map;
}
