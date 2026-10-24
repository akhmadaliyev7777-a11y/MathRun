# 6-sinf matematika — ma'ruzalar va testlar rejasi

Kitoblar: D1, D2 — darslik 1/2-qism; M1, M2 — mashq daftari (`~/Desktop/maktab darsliklari/6-sinf ...`). Betlar: `python3 _reja/kitob.py 6:N` (mavzu → betlar `_reja/mavzular6.json`; PDF bet = kitob beti + 4).
Ish tartibi 5-sinfdagidek (`_reja/CLAUDE-ish-tartibi.md`): ma'ruza `maruza/6-<id>.html` (9 bo'lim, pastida «Mathlearn · 6-sinf matematika»), test `js/quizzes.js` → `"6|matematika|<id>"` 20+20, data.js da `test.html?sinf=6&fan=matematika&mavzu=<id>`.
30–31-mavzular (panjarada chizish, yoyilma) darslikda bor edi, saytda yo'q edi — 2026-10-24 da data.js ga qo'shildi.

#### ✅ 1. Algebraik ifodalar — D1 2–9; M1 1–8
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-algebraik-ifodalar.html. Yangi chizma: `data-model` (chizmali model: harfli bo'laklar, «?» punktir, ustida jami qavsi). O'z testi 20+20.
**Kitob bilan solishtirildi:** Eslang (tushirib qoldirilgan son, 4 amal) ✅; harf bilan noma'lum ✅; qo'shish/ayirish (ko'p, kam, ortiq, «… dan ayiring») ✅; ko'paytirish (5q, 1·q = q) ✅; bo'lish (p/3) ✅; jadval va chizma-model ✅; juftliklar bir xilmi ✅; to'g'ri to'rtburchak yuzi/bo'yi ✅; daftar: ikki qadamli ifodalar (narx, taqsimlash va yo'qotish, tejash, massa, lenta) ✅. Kitob sonlari (12 olma, 12 yosh, 5 marta 6 ruchka, 8 tugma, 12 000 : 3, 60 000 pitsa, 6 shisha, 48 : 8, 150 000 raketka) ishlatilmadi.
**Tekshiruv:** testlar.js 0 xato, 390/1100 px, KaTeX xatosiz.
**Simulyator uchun g'oyalar:** data.js simPlan (qutilar va kubiklar).

#### ✅  2. Algebraik ifodalarni soddalashtirish — D1 10–12; M1 9–10
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-ifodalarni-soddalashtirish.html. Yangi chizma: `data-plitka` (algebraik plitkalar: harfli had — uzun plitka, son — kvadrat; `data-kesish="1"` — ayrilganlari ustidan chiziladi). O'z testi 20+20 (javoblar harf o'rniga son qo'yib dastur bilan tekshirildi).
**Kitob bilan solishtirildi:** 2 usul (qutilar soni / hadlar yig'indisi) ✅; o'xshash hadlarni qo'shish, ayirish ✅; q = 1q ✅; 6y − 6y = 0 ✅; aralash ifoda (guruhlash, belgi bilan ko'chirish) ✅; plitkalar va chizma-model ✅; tushirib qoldirilgan had ✅; daftardagi barcha turlar ✅. Kitob misollari (6 va 3 quti, 2q + 2q, 5q + 3 − 2q + 2, 8h + 4 − 3h − 1, 3y + 2y − 4) ishlatilmadi.

#### ✅  3. Algebraik ifodaning qiymatini topish — D1 13–18; M1 11–18
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-ifoda-qiymatini-topish.html. O'z testi 20+20.
**Kitob bilan solishtirildi:** harf o'rniga son ✅; yashirin ko'paytirish ✅; jadval (bir ifoda — har xil qiymat) ✅; kasr ko'rinishidagi ifoda ✅; avval soddalashtirish ✅; masala: ifoda + qiymat (tasma farqi, uch quti, 5 marta ko'p — bo'laklar, o'rta arifmetik, shakl yuzi, yosh, qaytim, perimetr, stiker, hamyon, pechenye) ✅. Kitob sonlari (z = 8, y = 5, m = 3, Halima 8 tugma, 78 000, f = 140, 5 cm va w) ishlatilmadi.

#### ✅  4. Tenglamalarni yechish — D1 19–24; M1 19–32
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-tenglamalarni-yechish.html. Yangi chizma: `data-tarozi` (pallali tarozi: x qutilar va birlik toshlar, 24 tagacha donalab). O'z testi 20+20, 6 savolda chizma (tarozi, chizmali model); yechim emas variantlar dastur bilan tekshirildi.
**Kitob bilan solishtirildi:** tenglama, yechim, tekshirish ✅; bir qadamli (4 komponent) ✅; ikki qadamli (tarozi) ✅; bo'laklar usuli = tenglama ✅; «… ta ko'p», «… marta ko'p» ✅; ketma-ket sonlar ✅; yoshlar ✅; sehrli kvadrat ✅; kalendar ✅; kundalik (javobi ifoda bo'lgan masala) ✅. Kitob sonlari (7 + j = 18, 4 + 2k = 20, 70/14, 50/4 marta, 66, 48 yosh, 30 000, 60 tomoshabin, x + 3 = 8, 2b va 22 tuxum) ishlatilmadi.

#### ✅  5. To'g'ri kasrni natural songa bo'lish — D1 26–32; M1 33–40
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-kasrni-natural-songa-bolish.html. Yangi chizma: `data-ulush="a/b:n"` (doira: kasr qism n kishiga rangli bo'linadi, punktir — b·n mayda bo'lak). O'z testi 20+20, 5 savolda chizma (doira, to'g'ri to'rtburchak modeli).
**Kitob bilan solishtirildi:** Eslang (ko'paytirish, bo'linma — kasr) ✅; a/b : n = a/b · 1/n ✅; surat bo'linsa ✅; qisqartirish ✅; to'g'ri to'rtburchak modeli ✅; kasr miqdorni taqsimlash (sim, sharbat, kvadrat perimetri) ✅; daftardagi ikki qadamli masalalar ✅. Kitob misollari (1/2 : 2, 1/4 : 2, 4/5 : 4, 3/4 : 2, 3/4 : 5, 2/3 : 4 va daftar ro'yxati) ishlatilmadi.

#### ☐ 6. Natural sonni to'g'ri kasrga bo'lish — D1 33–35; M1 41–48

#### ☐ 7. To'g'ri kasrni to'g'ri kasrga bo'lish (+ matnli masalalar) — D1 36–48; M1 49–66

#### ☐ 8. Nisbat va kasr (+ matnli masalalar) — D1 52–66; M1 73–86

#### ☐ 9. Uch miqdor nisbati — D1 67–71; M1 87–94

#### ☐ 10. O'zgaruvchan nisbatlar — D1 72–82; M1 95–110

#### ☐ 11. Foizi va qismiga ko'ra sonning o'zini topish — D1 84–90; M1 111–122

#### ☐ 12. O'sish va kamayish foizi (+ matnli masalalar) — D1 91–112; M1 123–142

#### ☐ 13. Geometrik shakllardagi noma'lum burchaklar — D1 116–126; M1 151–168

#### ☐ 14. Doira va aylana elementlari — D1 128–133; M1 169–170

#### ☐ 15. Aylananing uzunligi — D1 134–139; M1 171–176

#### ☐ 16. Yarim va chorak doira perimetri — D1 140–144; M1 177–182

#### ☐ 17. Doiraning yuzi — D1 145–149; M1 183–184

#### ☐ 18. Yarim va chorak doira yuzi — D1 150–152; M1 185–186

#### ☐ 19. Murakkab shakllarning yuzi va perimetri — D1 153–162; M1 187–198

#### ☐ 20. Tezlik, masofa va vaqt — D2 2–11; M2 1–10

#### ☐ 21. Ikki xil tezlikdagi harakat — D2 12–14; M2 11–14

#### ☐ 22. O'rtacha tezlik — D2 15–19; M2 15–18

#### ☐ 23. Ikki jism harakati: uchrashish va quvib yetish — D2 20–26; M2 19–28

#### ☐ 24. Kuboidning qirrasini topish — D2 28–34; M2 29–34

#### ☐ 25. Kubning qirrasini topish — D2 35–38; M2 35–36

#### ☐ 26. Kuboid va kubning bir yog'i yuzi (+ matnli masalalar) — D2 39–48; M2 37–56

#### ☐ 27. Doiraviy diagrammada ma'lumotlarni taqdim etish — D2 52–56; M2 63–70

#### ☐ 28. Doiraviy diagrammani o'qish va talqin qilish — D2 57–72; M2 71–80

#### ☐ 29. Konus, silindr, prizma va piramida — D2 74–77; M2 81–84

#### ☐ 30. Uch o'lchamli panjarada fazoviy jismlarni chizish — D2 78–81; M2 85–88

#### ☐ 31. Fazoviy jismlarning yoyilmasi — D2 82–90; M2 89–100
