// Yuqori sinflar (5–11) mavzulari uchun o'yin bosqichlari — «Fikrlash o'yinlari»da sinf bo'yicha chiqadi.
// curriculum.json faqat 1–4-sinf; bu yerdagilar unga qo'shilmaydi (boshlang'ich sinflar ro'yxati o'zgarmaydi).
const RANG = { 9: 'linear-gradient(160deg,#8a3b5c,#5a2440 55%,#341428)', 5: 'linear-gradient(160deg,#2f7d4f,#1c5233 55%,#0f3320)', 6: 'linear-gradient(160deg,#1f5f8b,#123a57 55%,#0a2236)', 7: 'linear-gradient(160deg,#5b2a86,#341552 55%,#1d0b30)' };
const L = (grade, fan, name, id, gameKind, mashqNomlari) => ({ grade, fan, name,
  level: { id, gameKind, count: 20, bank: `banks/${id}_tasks.json`, webSupported: true, ...(mashqNomlari ? { mashqNomlari } : {}) } });

export const YUQORI = [
  L(5, 'Matematika', '32. Foiz tushunchasi', 'y5_foiz', 'fractionStrip'),
  L(5, 'Matematika', "33. Oddiy kasr, o'nli kasr va foiz orasidagi bog'lanish", 'y5_kasr_foiz', 'fractionStrip'),
  L(5, 'Matematika', "38. To'g'ri chiziqdagi burchaklar", 'y5_burchak', 'protractor'),
  L(6, 'Matematika', '4. Tenglamalarni yechish', 'y6_tenglama', 'balanceScale'),
  L(6, 'Matematika', '23. Ikki jism harakati: uchrashish va quvib yetish', 'y6_harakat', 'motionLine'),
  L(6, 'Matematika', '29. Konus, silindr, prizma va piramida', 'y6_jismlar', 'netFold'),
  L(6, 'Matematika', '31. Fazoviy jismlarning yoyilmasi', 'y6_yoyilma', 'netFold'),
  L(7, 'Matematika', '5.1 Sodda chiziqli tenglamalar', 'y7_chiziqli', 'balanceScale'),
  L(7, 'Algebra', '25. Tenglamalar yechishning al-Xorazmiy usuli', 'y7a_xorazmiy', 'balanceScale'),
  L(7, 'Algebra', '26. Dekart koordinatalar sistemasi', 'y7a_dekart', 'coordinatePath'),
  L(9, 'Geometriya', "9. O'qqa nisbatan simmetriya", 'y9g_oq', 'symmetry'),
  L(9, 'Geometriya', '10. Markaziy simmetriya va burish', 'y9g_markaz', 'symmetry'),
];

// boshlang'ich sinflardagi {grade, chorak, block, level} ko'rinishida (o'yin, natija va qaytish sahifalari shuni kutadi)
export function yuqoriTopish(id) {
  const y = YUQORI.find(x => x.level.id === id);
  if (!y) return null;
  const block = { blok: 0, name: y.name, levels: [y.level] };
  const chorak = { chorak: 'y', roman: '', fan: y.fan, blocks: [block] };
  const grade = { grade: y.grade, yuqori: true, color: { head: RANG[y.grade] || RANG[7] }, choraks: [chorak] };
  return { grade, chorak, block, level: y.level };
}
