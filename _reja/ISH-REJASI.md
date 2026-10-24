# Mathlearn — ish rejasi

> Har bir qadam bajarilgach shu yerda belgilanadi (☑). Ikkala hisob ham shu rejaga qarab ishlaydi.
> Tarix (kim, qachon, nima qildi) — `_reja/ish-jurnali.md`.
> Ko'rish: VS Code'da shu fayl o'zi chiroyli ko'rinishda ochiladi va yangilanib turadi (yashil ✓ — bajarildi).
> Tekshirish: `python3 _reja/tools/reja_tekshir.py` — katakchalar saytning haqiqiy holatiga mosmi.

**Oxirgi yangilanish:** 2026-10-24 15:37 — «Mening natijalarim» tuzatildi va saytga chiqdi

---

## 1. Hozirgi ish — 6-sinf 8 va 9-mavzular

### 8. Nisbat va kasr (+ matnli masalalar)
- [x] Kitob betlarini o'rganish (darslik 52–66, mashq daftari 73–86): qoidalar va misol turlari ro'yxati
- [x] Ma'ruza yozish (9 bo'lim, chizmalar)
- [x] Test yozish: 1-test oson (20), 2-test qiyinroq (20), chizmali savollar bilan
- [x] Tekshiruv: barcha javoblarni qayta hisoblash
- [x] Tekshiruv: kitobdan ko'chirilmaganmi, hech bir qoida va misol turi tushib qolmaganmi
- [x] Tekshiruv: telefon (390 px) va kompyuter (1100 px) ko'rinishi
- [x] Tekshiruv: o'qituvchi va o'quvchi ko'zi bilan
- [x] 1-tekshiruv kamchiliklari tuzatildi (38 ta)
- [ ] 2-tekshiruv kamchiliklarini tuzatish (4 jiddiy — kitobga o'xshash masalalar, ~15 mayda) ← *hozir*
- [ ] Saytga ulash (mavzu sahifasi, test havolasi)
- [ ] Rejada belgilash, saytga chiqarish (push)

### 9. Uch miqdor nisbati
- [ ] Kitob betlarini o'rganish (darslik 67–71, mashq daftari 87–94) ← *hozir*
- [ ] Ma'ruza yozish
- [ ] Test yozish (20 + 20)
- [ ] Tekshiruvlar (hisob, kitob, ko'rinish, o'qituvchi)
- [ ] Tuzatish
- [ ] Saytga ulash va chiqarish (push)
- [ ] Ish jurnaliga yozuv

## 2. Saytni to'liq o'rganish (2026-10-24) — bajarildi
- [x] Bosh sahifa, menyu, qidiruv, havolalar (338 havola — hammasi ishlaydi)
- [x] 5-sinf sahifalari va ma'ruzalari
- [x] 6-sinf sahifalari va ma'ruzalari
- [x] Testlar (yechib ko'rish, natija, «Mening natijalarim»)
- [x] 1–4-sinflar bo'limi va o'yinlar
- [x] 7–11-sinflar va simulyatorlar
- [x] Topilgan kamchiliklar ro'yxati → foydalanuvchiga ko'rsatildi
- [x] Qaysilari tuzatilishini kelishish: 1–4-sinf teng javoblar, ichki belgilarni yashirish, 6-sinf ma'ruzalaridagi xatolar (simulyatorlarga tegilmaydi)
- [ ] Firestore «natijalar»dagi 9 ta sinov yozuvini o'chirish (tekshiruvchi 1–4-sinf testlarini yechib yuborgan; faqat Firebase Console'dan — foydalanuvchi)

### Topilgan kamchiliklar (tuzatish — kelishilgandan keyin)
**Jiddiy**
- [x] 1–4-sinf testida to'g'ri javob «xato» deyilardi («3/3» va «1») — 5 574 savol tekshirildi, 18 ta tuzatildi (12 test + 6 arqon tortish); tekshiruv dasturi `mathrunner-web/tools/teng_variantlar.py`
- [ ] ← *hozir* 1–4-sinf: yana 121 savolda «(… = 1, … = 2)» shifrli javoblar qolgan (52 test) — har birini ko'rib tuzatish kerak
- [ ] Arqon tortish o'yini telefonda o'ynab bo'lmaydi (ochkolar savolni yopadi, arqon ekrandan chiqadi)
- [ ] 10 ga yaqin eski simulyator telefonda sig'maydi yoki kesiladi (5-sinf 38, 6-sinf algebra/kasr/tezlik, 7-sinf, 10-sinf) — `lessons/` ga tegish uchun ruxsat kerak
- [ ] 7–11-sinflarda birorta test yo'q (109 mavzu)

**O'rta**
- [x] Ichki belgilar (rangli nuqtalar, legenda, «Simulyatsiya rejasi», kitob betlari, arqon tortishdagi fayl yozuvi) endi faqat admin kirganda ko'rinadi
- [ ] Bo'sh mavzular to'liqdek ko'rinadi (8–11-sinf bitta gapli «ma'ruza», 6-sinf 8–31, 7-sinf hisobi takrorlangan)
- [x] «Mening natijalarim» tuzatildi: qatorlar toza, kasr/chizmalar KaTeX bilan, 1-test/2-test belgisi, savolga sakrash panel ostida qolmaydi
- [ ] (8–9 dan keyin) 6-sinf «O'zingizni tekshiring» qatorlari telefonda siqiladi
- [ ] (8–9 dan keyin) 6-sinf 3-mavzu chizmasi: «4 bo'lak» qavsi 3 bo'lakni o'raydi
- [ ] (8–9 dan keyin) 6-sinf: formuladan keyingi «:» bo'lish belgisiga o'xshaydi (4-mavzuda 7 ta, 2-da 3 ta, 3 va 7-da 1 tadan)
- [ ] 5-sinf jadvallarining o'ng ustuni telefonda ko'rinmaydi (6 ta ma'ruza)
- [ ] Chizmalardagi yozuvlar telefonda juda mayda (test rasmlari, «sig'adi» chizmasi)
- [ ] Eskirgan matnlar (bosh sahifa «10 tagacha savol», info.html, «Home»)
- [ ] Qidiruv kirill yozuvi va imlo xatosini topmaydi

**Mayda**
- [ ] Chap chetda kulrang soya (yopiq menyu), ma'ruza oynasi pastidan 18–20 px kesiladi
- [ ] Telefonda test paneli katta (ekranning ~30%), natijada rasm savoldan oldin chiqadi
- [ ] O'z 404 sahifasi yo'q; sinf sahifalari sarlavhasi bir xil; Telegram'da havola rasmsiz
- [x] 1–4-sinf: shifrlangan savol g3_c2_b29_l2 tuzatildi
- [ ] 1–4-sinf: 3 842 savolda yechim yo'q, mayda ko'rinish xatolari

## 3. 6-sinf — barcha mavzular (31 ta)
Har safar 2 tadan mavzu; har 6 mavzudan keyin ish jurnaliga yozuv.

**Algebra**
- [x] 1. Algebraik ifodalar
- [x] 2. Algebraik ifodalarni soddalashtirish
- [x] 3. Algebraik ifodaning qiymatini topish
- [x] 4. Tenglamalarni yechish

**Kasrlarni bo'lish**
- [x] 5. To'g'ri kasrni natural songa bo'lish
- [x] 6. Natural sonni to'g'ri kasrga bo'lish
- [x] 7. To'g'ri kasrni to'g'ri kasrga bo'lish

**Nisbat**
- [ ] 8. Nisbat va kasr ← *hozir*
- [ ] 9. Uch miqdor nisbati ← *hozir*
- [ ] 10. O'zgaruvchan nisbatlar

**Foizlar**
- [ ] 11. Foizi va qismiga ko'ra sonning o'zini topish
- [ ] 12. O'sish va kamayish foizi

**Geometriya: burchaklar, doira**
- [ ] 13. Geometrik shakllardagi noma'lum burchaklar
- [ ] 14. Doira va aylana elementlari
- [ ] 15. Aylananing uzunligi
- [ ] 16. Yarim va chorak doira perimetri
- [ ] 17. Doiraning yuzi
- [ ] 18. Yarim va chorak doira yuzi
- [ ] 19. Murakkab shakllarning yuzi va perimetri

**Harakat**
- [ ] 20. Tezlik, masofa va vaqt
- [ ] 21. Ikki xil tezlikdagi harakat
- [ ] 22. O'rtacha tezlik
- [ ] 23. Ikki jism harakati: uchrashish va quvib yetish

**Kuboid va kub**
- [ ] 24. Kuboidning qirrasini topish
- [ ] 25. Kubning qirrasini topish
- [ ] 26. Kuboid va kubning bir yog'i yuzi

**Doiraviy diagramma**
- [ ] 27. Doiraviy diagrammada ma'lumotlarni taqdim etish
- [ ] 28. Doiraviy diagrammani o'qish va talqin qilish

**Fazoviy jismlar**
- [ ] 29. Konus, silindr, prizma va piramida
- [ ] 30. Uch o'lchamli panjarada fazoviy jismlarni chizish
- [ ] 31. Fazoviy jismlarning yoyilmasi

## 4. Keyingi ishlar (navbat kelganda)
- [ ] 7-sinf mavzu ikonkalari: 32/79 tayyor, keyingisi 9-prompt (Algebra 6–9)
- [ ] 5-sinf simulyatorlarini ma'ruzalarga moslab boyitish (foydalanuvchi qarori bilan)
- [ ] 6-sinf simulyatorlari (har mavzuda reja bor)
- [ ] Telegram orqali kirish (keyinroq)

---

### Belgilar
- [x] — bajarildi va saytda
- [ ] — hali qilinmagan
- ← *hozir* — ayni paytda ustida ishlanmoqda
