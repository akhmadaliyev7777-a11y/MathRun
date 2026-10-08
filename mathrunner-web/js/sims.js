// 1–4 sinf mavzularining simulyatorlari (asosiy saytning lessons/ papkasida).
// Kalit: "sinf-chorak-blok". Simulyatori bor mavzu bosilganda avval simulyator ochiladi, ostida testlar.
// Simulyator fayli o'zgarsa — SIM_VER oshiriladi (brauzer yangisini yuklaydi).
export const SIM_VER = 9;
export const SIMS = {
  '4-3-40': { src: '../lessons/4-matematika-qoldiqli-bolish.html', title: "Bo'lish: qoldiqsiz va qoldiqli" },
};
export const simFor = (grade, chorak, blok) => SIMS[`${grade}-${chorak}-${blok}`] || null;
