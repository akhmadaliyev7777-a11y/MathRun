// 1–4 sinf mavzularining simulyatorlari (asosiy saytning lessons/ papkasida).
// Kalit: "sinf-chorak-blok"; name — mavzuning to'liq nomi (asosiy saytdagi «Interaktiv darslar» ro'yxati uchun). Simulyatori bor mavzu bosilganda avval simulyator ochiladi, ostida testlar.
// Simulyator fayli o'zgarsa — SIM_VER oshiriladi (brauzer yangisini yuklaydi).
// review: true — qizil nuqta (hali tekshirilmagan yoki kamchiligi bor); foydalanuvchi «tayyor» desa o'chiriladi.
export const SIM_VER = 13;
export const SIMS = {
  '4-1-2': { src: '../lessons/4-matematika-nomalum-had.html', title: "Noma'lum hadni topish", name: "Amallarning hadlari. Noma'lum hadni topish", review: true },
  '4-3-40': { src: '../lessons/4-matematika-qoldiqli-bolish.html', title: "Bo'lish: qoldiqsiz va qoldiqli", name: "Bo'lish. Qoldiqsiz va qoldiqli bo'lish" },
};
export const simFor = (grade, chorak, blok) => SIMS[`${grade}-${chorak}-${blok}`] || null;
