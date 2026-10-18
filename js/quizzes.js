/*
  QUIZ_DATA — har bir mavzu uchun 10 tadan savol, oson->qiyin tartibida.
  Kalit format: "sinf|fan|mavzuId" (data.js dagi id'larga mos).

  Har bir savol:
  {
    level: 1..10,
    question: "Savol matni",
    options: ["variant1", "variant2", ...],   // nechta bo'lsa, sahifada shuncha tugma chiqadi
    answer: "variant1",                        // options ichidagi qiymatlardan biri bilan AYNAN bir xil bo'lishi kerak
    explain: "Nega shunday — qisqa izoh"       // ixtiyoriy: javobdan keyin ko'rsatiladi
  }

  Variantlar tartibi sahifada avtomatik aralashtiriladi — options ro'yxatidagi
  tartib muhim emas, faqat "answer" options ichida borligi kifoya.
*/

const QUIZ_DATA = {
  "5|matematika|natural-sonlar": [
    { level: 1, question: "Natural sonlar qatorida eng kichik son qaysi?", options: ["0", "1", "-1", "10"], answer: "1" },
    { level: 2, question: "127 sonida 7 raqami nechani bildiradi?", options: ["7 ta birlik", "7 ta o'nlik", "7 ta yuzlik", "7 ta minglik"], answer: "7 ta birlik" },
    { level: 3, question: "472 sonida 7 raqami nechani bildiradi?", options: ["7 ta birlik", "7 ta o'nlik", "7 ta yuzlik", "7 ta minglik"], answer: "7 ta o'nlik" },
    { level: 4, question: "780 sonida 7 raqami nechani bildiradi?", options: ["7 ta birlik", "7 ta o'nlik", "7 ta yuzlik", "7 ta minglik"], answer: "7 ta yuzlik" },
    { level: 5, question: "1 000 000 soni qanday nomlanadi?", options: ["Bir million", "Bir milliard", "Bir ming", "Bir yuz ming"], answer: "Bir million" },
    { level: 6, question: "Qaysi son katta: 45 678 yoki 45 687?", options: ["45 678", "45 687", "Ikkalasi teng", "Aniqlab bo'lmaydi"], answer: "45 687" },
    { level: 7, question: "3 405 210 sonida nechta ming bor?", options: ["3405", "3", "405", "210"], answer: "3405" },
    { level: 8, question: "29 405 378 613 sonida nechta milliard bor?", options: ["613", "378", "405", "29"], answer: "29" },
    { level: 9, question: "358 902 sonida yuzlar xonasida turgan raqam nechaga teng?", options: ["9", "0", "8", "5"], answer: "9" },
    { level: 10, question: "10 000 000 ga eng yaqin butun sonlardan qaysi biri undan katta?", options: ["10 000 001", "9 999 999", "10 000 000", "1 000 000"], answer: "10 000 001" }
  ],

  // 3-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|onlik-yuzlik-minglik-kopaytirish-bolish": [
    { level: 1, question: "300 sonini bir xonali son va 100 ning ko'paytmasi shaklida yozing.", options: ["3 × 100", "30 × 100", "3 × 10", "300 × 100"], answer: "3 × 100", explain: "300 da ikkita nol bor, demak u 3 ta yuz: 300 = 3 × 100." },
    { level: 2, question: "23 × 30 = ?", options: ["690", "69", "6900", "530"], answer: "690", explain: "Avval 3 ga, keyin 10 ga ko'paytiramiz: 23 × 3 = 69, 69 × 10 = 690." },
    { level: 3, question: "45 × 200 = ?", options: ["9000", "900", "90 000", "4500"], answer: "9000", explain: "45 × 2 = 90, so'ng 100 ga ko'paytiramiz — ikkita nol yozamiz: 90 × 100 = 9000." },
    { level: 4, question: "3000 × 12 = ?", options: ["36 000", "3600", "360 000", "15 000"], answer: "36 000", explain: "O'rinlarini almashtiramiz: 12 × 3 × 1000 = 36 × 1000 = 36 000." },
    { level: 5, question: "480 : 60 = ?", options: ["8", "80", "48", "6"], answer: "8", explain: "Avval 10 ga, keyin 6 ga bo'lamiz: 480 : 10 = 48, 48 : 6 = 8. Tekshirish: 8 × 60 = 480." },
    { level: 6, question: "5600 : 700 = ?", options: ["8", "80", "800", "56"], answer: "8", explain: "Ikkala sondan ikkitadan nol tashlaymiz: 5600 : 700 = 56 : 7 = 8." },
    { level: 7, question: "36 000 : 400 = ?", options: ["90", "9", "900", "9000"], answer: "90", explain: "Bo'luvchida ikkita nol bor — bo'linuvchidan ham ikkitasini tashlaymiz: 360 : 4 = 90. Bo'linuvchidagi uchinchi nol qoladi." },
    { level: 8, question: "Qaysi ifoda 63 000 : 900 ga teng?", options: ["630 : 9", "63 : 9", "6300 : 9", "63 000 : 9"], answer: "630 : 9", explain: "Nollar faqat teng miqdorda tashlanadi: 900 da ikkita nol, shuning uchun 63 000 dan ham ikkitasi — 630 : 9 = 70." },
    { level: 9, question: "312 × 400 ning chamalangan (taxminiy) qiymati qaysi?", options: ["≈ 120 000", "≈ 12 000", "≈ 1 200 000", "≈ 160 000"], answer: "≈ 120 000", explain: "312 ni yaxlitlaymiz: 312 ≈ 300. 300 × 400 = 120 000. Aniq javob 124 800 — unga yaqin." },
    { level: 10, question: "Bir yashikka 40 kg olma sig'adi. 2800 kg olmani joylash uchun nechta yashik kerak?", options: ["70", "7", "700", "112 000"], answer: "70", explain: "2800 : 40 = 280 : 4 = 70 yashik. Tekshirish: 70 × 40 = 2800. 112 000 — bu ko'paytirilgan, bo'lish kerak edi." }
  ],
  // 4-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|amallar-tartibi": [
    { level: 1, question: "25 − 8 + 6 = ?", options: ["23", "11", "19", "39"], answer: "23", explain: "Faqat qo'shish va ayirish — chapdan o'ngga: 25 − 8 = 17, 17 + 6 = 23. 11 chiqqan bo'lsa, 8 + 6 avval qo'shilgan — bu xato." },
    { level: 2, question: "48 : 6 · 2 = ?", options: ["16", "4", "24", "12"], answer: "16", explain: "Faqat ko'paytirish va bo'lish — chapdan o'ngga: 48 : 6 = 8, 8 · 2 = 16. 6 · 2 ni avval hisoblash xato." },
    { level: 3, question: "10 + 4 · 5 = ?", options: ["30", "70", "19", "50"], answer: "30", explain: "Avval ko'paytirish: 4 · 5 = 20, keyin qo'shish: 10 + 20 = 30." },
    { level: 4, question: "50 − 30 : 5 = ?", options: ["44", "4", "40", "20"], answer: "44", explain: "Avval bo'lish: 30 : 5 = 6, keyin ayirish: 50 − 6 = 44." },
    { level: 5, question: "6 · (7 − 3) = ?", options: ["24", "39", "45", "18"], answer: "24", explain: "Avval qavs ichi: 7 − 3 = 4, keyin 6 · 4 = 24." },
    { level: 6, question: "36 : 4 · 3 = ?", options: ["27", "3", "12", "48"], answer: "27", explain: "Ko'paytirish va bo'lish teng huquqli — chapdan o'ngga: 36 : 4 = 9, 9 · 3 = 27. 36 : 12 = 3 — xato tartib." },
    { level: 7, question: "18 + 30 : (8 − 2) · 3 ifodada qaysi amal birinchi bajariladi?", options: ["8 − 2", "18 + 30", "30 : 8", "2 · 3"], answer: "8 − 2", explain: "Qavs ichidagi amal doim birinchi: 8 − 2 = 6. Keyin 30 : 6 = 5, 5 · 3 = 15, so'ng 18 + 15 = 33." },
    { level: 8, question: "80 − 5 · (6 + 4) : 2 = ?", options: ["55", "375", "25", "77"], answer: "55", explain: "Qavs: 6 + 4 = 10; ko'paytirish: 5 · 10 = 50; bo'lish: 50 : 2 = 25; ayirish: 80 − 25 = 55." },
    { level: 9, question: "4 ta qutining har birida 12 tadan olma bor edi. 18 ta olma yeyildi. Nechta olma qoldi?", options: ["30", "48", "66", "24"], answer: "30", explain: "Ifoda: 4 · 12 − 18. Avval ko'paytirish: 48, keyin ayirish: 48 − 18 = 30." },
    { level: 10, question: "Ota 40 yoshda, o'g'li 10 yoshda. Necha yildan keyin ota o'g'lidan 3 marta katta bo'ladi?", options: ["5", "10", "15", "20"], answer: "5", explain: "Yosh farqi o'zgarmaydi: 40 − 10 = 30. Ota 3 bo'lak, o'g'il 1 bo'lak, farq 2 bo'lak: 30 : 2 = 15 — o'g'il 15 yoshda bo'ladi, ya'ni 5 yildan keyin (45 va 15)." }
  ],
  // 5-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|bolishni-kasr-korinishida": [
    { level: 1, question: "1 : 6 ni kasr ko'rinishida yozing.", options: ["1/6", "6/1", "6", "1/7"], answer: "1/6", explain: "Bo'linuvchi (1) — surat, bo'luvchi (6) — maxraj: 1 : 6 = 1/6." },
    { level: 2, question: "3 ta pitsa 8 bolaga teng bo'lindi. Har bir bola pitsaning qancha qismini oladi?", options: ["3/8", "8/3", "1/8", "3/11"], answer: "3/8", explain: "Har bir pitsa 8 bo'lakka kesiladi, har bir bola har pitsadan 1 bo'lak — jami 3 bo'lak: 3 : 8 = 3/8." },
    { level: 3, question: "5/9 kasrni bo'linma ko'rinishida yozing.", options: ["5 : 9", "9 : 5", "5 · 9", "9 − 5"], answer: "5 : 9", explain: "Kasr chizig'i — bo'lish belgisi: surat bo'linadi, maxraj bo'luvchi. 5/9 = 5 : 9." },
    { level: 4, question: "4 : 8 natijasini qisqartirilgan kasr ko'rinishida yozing.", options: ["1/2", "2", "1/4", "8/4"], answer: "1/2", explain: "4 : 8 = 4/8. Surat va maxrajni 4 ga bo'lamiz: 4/8 = 1/2." },
    { level: 5, question: "7 : 4 ni aralash son ko'rinishida yozing.", options: ["1 3/4", "3 1/4", "1 4/7", "1 1/4"], answer: "1 3/4", explain: "7 : 4 = 1 (qoldiq 3). Butun qism 1, surat — qoldiq 3, maxraj — bo'luvchi 4: 1 3/4." },
    { level: 6, question: "13 : 5 = ?", options: ["2 3/5", "3 2/5", "2 5/3", "2 1/5"], answer: "2 3/5", explain: "13 : 5 = 2 (qoldiq 3), chunki 5 · 2 + 3 = 13. Demak 13/5 = 2 3/5." },
    { level: 7, question: "2 m lenta 5 ta teng bo'lakka bo'lindi. Har bir bo'lak necha metr?", options: ["2/5 m", "5/2 m", "2 1/2 m", "1/5 m"], answer: "2/5 m", explain: "Uzunlikni bo'laklar soniga bo'lamiz: 2 : 5 = 2/5 m. 5 : 2 — sonlar almashib qolgan." },
    { level: 8, question: "□ : 6 = 5/6 bo'lsa, □ nechaga teng?", options: ["5", "6", "30", "1"], answer: "5", explain: "Surat — bo'linuvchi: 5 : 6 = 5/6. Demak □ = 5." },
    { level: 9, question: "9 litr suv 2 ta idishga teng quyildi. Har bir idishda necha litr suv bor?", options: ["4 1/2 l", "4 l", "2/9 l", "9 1/2 l"], answer: "4 1/2 l", explain: "9 : 2 = 4 (qoldiq 1): 9/2 = 4 1/2 litr." },
    { level: 10, question: "Kim ko'proq oladi: 2 ta shokoladni 3 bola bo'lishsa yoki 2 ta shokoladni 5 bola bo'lishsa?", options: ["3 boladan har biri", "5 boladan har biri", "Teng oladi", "Aniqlab bo'lmaydi"], answer: "3 boladan har biri", explain: "2/3 va 2/5: shokolad bir xil, bolalar kam bo'lsa, har biriga ko'proq tegadi. 2/3 > 2/5." }
  ],
  // 7-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|aralash-sonlarni-qoshish-ayirish": [
    { level: 1, question: "1/2 + 1/3 = ?", options: ["5/6", "2/5", "2/6", "1/5"], answer: "5/6", explain: "Umumiy maxraj 6: 1/2 = 3/6, 1/3 = 2/6. 3/6 + 2/6 = 5/6. Maxrajlar qo'shilmaydi!" },
    { level: 2, question: "3/4 − 1/6 = ?", options: ["7/12", "2/10", "1/2", "5/12"], answer: "7/12", explain: "4 va 6 ning eng kichik umumiy karralisi 12: 9/12 − 2/12 = 7/12." },
    { level: 3, question: "1 1/5 + 2 2/5 = ?", options: ["3 3/5", "3 3/10", "2 3/5", "3 2/5"], answer: "3 3/5", explain: "Butunlar: 1 + 2 = 3, kasrlar: 1/5 + 2/5 = 3/5. Javob 3 3/5." },
    { level: 4, question: "4 + 2 3/8 = ?", options: ["6 3/8", "2 3/8", "6 5/8", "4 3/8"], answer: "6 3/8", explain: "Butun son faqat butun qismga qo'shiladi: 4 + 2 = 6, kasr qism 3/8 o'zgarmaydi." },
    { level: 5, question: "2 1/2 + 1 1/4 = ?", options: ["3 3/4", "3 2/6", "3 1/2", "4 1/4"], answer: "3 3/4", explain: "1/2 = 2/4. 2 2/4 + 1 1/4 = 3 3/4." },
    { level: 6, question: "1 3/4 + 1 1/2 = ?", options: ["3 1/4", "2 4/6", "2 1/4", "3 3/4"], answer: "3 1/4", explain: "1 3/4 + 1 2/4 = 2 5/4. Kasr qism noto'g'ri: 5/4 = 1 1/4, demak 2 + 1 1/4 = 3 1/4." },
    { level: 7, question: "5 − 1 2/7 = ?", options: ["3 5/7", "4 2/7", "4 5/7", "3 2/7"], answer: "3 5/7", explain: "Bitta butunni yettidan birlarga maydalaymiz: 5 = 4 7/7. 4 7/7 − 1 2/7 = 3 5/7." },
    { level: 8, question: "4 1/3 − 1 2/3 = ?", options: ["2 2/3", "3 1/3", "3 2/3", "2 1/3"], answer: "2 2/3", explain: "1/3 dan 2/3 ni ayirib bo'lmaydi: 4 1/3 = 3 4/3. 3 4/3 − 1 2/3 = 2 2/3." },
    { level: 9, question: "3 7/8 + 2 1/9 ni chamalang.", options: ["≈ 6", "≈ 5", "≈ 7", "≈ 4"], answer: "≈ 6", explain: "3 7/8 ≈ 4, 2 1/9 ≈ 2: 4 + 2 = 6. Aniq javob 5 71/72 — haqiqatan 6 ga juda yaqin." },
    { level: 10, question: "6 1/4 m simdan 2 1/2 m kesib olindi. Necha metr sim qoldi?", options: ["3 3/4 m", "4 1/4 m", "4 3/4 m", "3 1/4 m"], answer: "3 3/4 m", explain: "6 1/4 − 2 2/4: kasr yetmaydi, 6 1/4 = 5 5/4. 5 5/4 − 2 2/4 = 3 3/4 m. Chamalash: 6 − 3 = 3 ✓" }
  ],
  // 8-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|kasrni-natural-songa-kopaytirish": [
    { level: 1, question: "2/9 · 4 = ?", options: ["8/9", "8/36", "6/9", "2/36"], answer: "8/9", explain: "Suratni songa ko'paytiramiz, maxraj o'zgarmaydi: 2 · 4 = 8, maxraj 9. 8/36 — maxraj ham ko'paytirilgan (xato)." },
    { level: 2, question: "28 ning 3/4 qismi nechaga teng?", options: ["21", "7", "84", "12"], answer: "21", explain: "28 ni 4 ta teng bo'lakka bo'lamiz: 28 : 4 = 7 (bitta bo'lak). 3 ta bo'lak: 7 · 3 = 21. 7 — faqat bitta bo'lak." },
    { level: 3, question: "Qaysi yozuv to'g'ri?", options: ["3/5 · 2 = 6/5", "3/5 · 2 = 6/10", "3/5 · 2 = 3/10", "3/5 · 2 = 5/7"], answer: "3/5 · 2 = 6/5", explain: "Faqat surat ko'paytiriladi: 3 · 2 = 6, maxraj 5 o'zgarmaydi. 6/10 da maxraj ham ko'paytirilgan — bu xato." },
    { level: 4, question: "5 nafar bola uchdan bir bo'lakdan pirog yedi. Ular qancha pirog yegan? (1/3 · 5)", options: ["1 2/3", "5/15", "1 1/3", "5 1/3"], answer: "1 2/3", explain: "1/3 · 5 = 5/3. 5 ta uchdan birdan 3 tasi bitta butun pirog, 2 tasi ortadi: 5/3 = 1 2/3." },
    { level: 5, question: "14 · 5/7 ni qisqartirib hisoblang.", options: ["10", "70", "10/7", "2"], answer: "10", explain: "14 va 7 ni 7 ga qisqartiramiz: 2 · 5 = 10. Tekshirish: 14 ning 5/7 qismi — 14 : 7 · 5 = 10. 2 — bitta bo'lak, javob emas." },
    { level: 6, question: "3/7 · 5 = ?", options: ["2 1/7", "15/35", "1 1/7", "2 2/7"], answer: "2 1/7", explain: "3 · 5 = 15, maxraj 7: 15/7. 15 : 7 = 2 (qoldiq 1), demak 2 1/7. 15/35 — maxraj ham ko'paytirilgan." },
    { level: 7, question: "5/3 · 3 = ?", options: ["5", "15/9", "1 2/3", "8/3"], answer: "5", explain: "3 va 3 ni qisqartiramiz: 5 · 1 = 5. Uchta «bir butun va uchdan ikki» — beshta butun. 15/9 — maxraj ham ko'paytirilgan." },
    { level: 8, question: "3 · 9/4 = ?", options: ["6 3/4", "27/12", "6 1/4", "3 3/4"], answer: "6 3/4", explain: "3 · 9 = 27, maxraj 4: 27/4. 27 : 4 = 6 (qoldiq 3), demak 6 3/4." },
    { level: 9, question: "Zalda 180 nafar o'quvchi bor, ularning 4/9 qismi qizlar. Zalda nechta o'g'il bola bor?", options: ["100", "80", "20", "405"], answer: "100", explain: "Qizlar: 180 : 9 · 4 = 80. O'g'il bolalar: 180 − 80 = 100. Yoki o'g'il bolalar 5/9 qism: 180 : 9 · 5 = 100. 80 — qizlar soni." },
    { level: 10, question: "Kvadratning tomoni 5/6 m. Uning perimetrini toping.", options: ["3 1/3 m", "20/24 m", "2 1/2 m", "1 2/3 m"], answer: "3 1/3 m", explain: "Kvadratning 4 ta tomoni teng: 5/6 · 4 = 20/6 = 10/3 = 3 1/3 m. 2 1/2 m — 3 ta tomon, 1 2/3 m — 2 ta tomon." }
  ],
  // 9-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|kasrni-kasrga-kopaytirish": [
    { level: 1, question: "1/4 · 1/3 = ?", options: ["1/12", "2/7", "2/12", "1/7"], answer: "1/12", explain: "Surat suratga, maxraj maxrajga ko'paytiriladi: 1 · 1 = 1, 4 · 3 = 12. 2/7 — qo'shib yuborilgan (xato)." },
    { level: 2, question: "2/3 · 4/5 = ?", options: ["8/15", "6/8", "8/5", "6/15"], answer: "8/15", explain: "2 · 4 = 8 — surat, 3 · 5 = 15 — maxraj. 8/5 — maxraj ko'paytirilmagan." },
    { level: 3, question: "5/6 ning 2/5 qismi nechaga teng?", options: ["1/3", "13/30", "7/11", "10/11"], answer: "1/3", explain: "«Ning qismi» — ko'paytirish: 5/6 · 2/5 = 10/30 = 1/3. 13/30 — ayirib yuborilgan (5/6 − 2/5)." },
    { level: 4, question: "Qaysi yozuv to'g'ri?", options: ["2/5 · 3/4 = 6/20", "2/5 · 3/4 = 6/4", "2/5 · 3/4 = 5/9", "2/5 · 3/4 = 6/9"], answer: "2/5 · 3/4 = 6/20", explain: "2 · 3 = 6, 5 · 4 = 20. 6/20 ni qisqartirsak 3/10 bo'ladi. 6/4 da maxraj ko'paytirilmagan, 5/9 da qo'shib yuborilgan." },
    { level: 5, question: "1/3 · 6/7 = ?", options: ["2/7", "7/10", "6/10", "1/7"], answer: "2/7", explain: "Avval 6 va 3 ni 3 ga qisqartiramiz: 1/1 · 2/7 = 2/7. Yoki 6/21 = 2/7. 7/10 — qo'shib yuborilgan." },
    { level: 6, question: "4/5 · 15/8 = ?", options: ["1 1/2", "19/13", "60/13", "1 1/4"], answer: "1 1/2", explain: "Noto'g'ri kasr ham shu qoida bilan ko'paytiriladi. 4 va 8 ni 4 ga, 15 va 5 ni 5 ga qisqartiramiz: 1/1 · 3/2 = 3/2 = 1 1/2." },
    { level: 7, question: "7/4 · 5/3 = ?", options: ["2 11/12", "12/7", "2 1/12", "1 11/12"], answer: "2 11/12", explain: "Qisqartiradigan son yo'q: 7 · 5 = 35, 4 · 3 = 12. 35/12 = 2 11/12. Ikkala kasr 1 dan katta — ko'paytma ham 1 dan katta." },
    { level: 8, question: "Gulnora opada 5/6 kg un bor edi. U unning 2/5 qismini ishlatdi. Qancha un qoldi?", options: ["1/2 kg", "1/3 kg", "13/30 kg", "2/5 kg"], answer: "1/2 kg", explain: "Ishlatdi: 5/6 · 2/5 = 1/3 kg. Qoldi: 5/6 − 1/3 = 3/6 = 1/2 kg. 1/3 kg — ishlatilgani, qolgani emas." },
    { level: 9, question: "To'g'ri to'rtburchakning tomonlari 3/4 m va 2/5 m. Uning yuzi qancha?", options: ["3/10 m²", "5/9 m²", "6/9 m²", "1 3/20 m²"], answer: "3/10 m²", explain: "Yuz = bo'yi · eni: 3/4 · 2/5 = 6/20 = 3/10 m². 1 3/20 — tomonlar yig'indisi, yuz emas." },
    { level: 10, question: "Hisoblamasdan ayting: 3/4 · 7/6 natijasi qanday?", options: ["3/4 dan katta", "3/4 dan kichik", "3/4 ga teng", "1/2 dan kichik"], answer: "3/4 dan katta", explain: "7/6 > 1 — sonni 1 dan katta kasrga ko'paytirsak, son ortadi. Haqiqatan 3/4 · 7/6 = 7/8 > 3/4." }
  ],
  // 10-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|aralash-sonni-natural-songa": [
    { level: 1, question: "3 2/7 ni noto'g'ri kasrga aylantiring.", options: ["23/7", "5/7", "13/7", "21/7"], answer: "23/7", explain: "Butun × maxraj + surat: 3 · 7 + 2 = 23 — yangi surat, maxraj 7 o'zgarmaydi. 5/7 — butun maxrajga ko'paytirilmagan (3 + 2)." },
    { level: 2, question: "1 2/3 · 4 = ?", options: ["6 2/3", "4 2/3", "20/12", "6 1/3"], answer: "6 2/3", explain: "1 2/3 = 5/3. 5/3 · 4 = 20/3 = 6 2/3. 4 2/3 — faqat butun qism ko'paytirilgan, 20/12 — maxraj ham ko'paytirilgan." },
    { level: 3, question: "2 1/5 · 3 = ?", options: ["6 3/5", "6 1/5", "2 3/5", "6 3/15"], answer: "6 3/5", explain: "2 · 3 = 6 va 1/5 · 3 = 3/5. Jami 6 3/5. 6 1/5 — kasr qism ko'paytirilmagan." },
    { level: 4, question: "Kvadratning tomoni 2 3/8 m. Uning perimetri qancha?", options: ["9 1/2 m", "8 3/8 m", "9 3/8 m", "4 3/4 m"], answer: "9 1/2 m", explain: "2 3/8 · 4 = 8 + 3/8 · 4 = 8 + 3/2 = 9 1/2 m. 4 3/4 m — faqat ikki tomon yig'indisi." },
    { level: 5, question: "3 1/4 · 8 ni qismlarga ajratib hisoblang.", options: ["26", "24 1/4", "24 2/8", "25"], answer: "26", explain: "3 · 8 = 24, 1/4 · 8 = 2. 24 + 2 = 26. 24 1/4 — kasr qism 8 ga ko'paytirilmagan." },
    { level: 6, question: "2 5/6 · 6 = ?", options: ["17", "12 5/6", "12 30/36", "16"], answer: "17", explain: "2 5/6 = 17/6. 6 va 6 ni qisqartiramiz: 17 · 1 = 17. Yoki 2 · 6 + 5/6 · 6 = 12 + 5 = 17." },
    { level: 7, question: "6 · 3 4/9 ning qiymati qaysi oraliqda?", options: ["18 va 24 orasida", "6 va 18 orasida", "24 va 30 orasida", "3 va 4 orasida"], answer: "18 va 24 orasida", explain: "6 · 3 = 18, 6 · 4 = 24 — javob shu ikki son orasida. Aniq javob: 62/3 = 20 2/3." },
    { level: 8, question: "1 4/7 · 3 = ?", options: ["4 5/7", "3 4/7", "3 12/7", "4 2/7"], answer: "4 5/7", explain: "1 · 3 = 3, 4/7 · 3 = 12/7 = 1 5/7. 3 + 1 5/7 = 4 5/7. 3 12/7 — kasr qismdan butun ajratilmagan." },
    { level: 9, question: "1 kg gilos 48 000 so'm. 2 1/4 kg gilos qancha turadi?", options: ["108 000 so'm", "96 000 so'm", "100 000 so'm", "120 000 so'm"], answer: "108 000 so'm", explain: "48 000 · 2 = 96 000, 48 000 · 1/4 = 12 000. Jami 108 000 so'm. 96 000 — chorak kilogramm hisobga olinmagan." },
    { level: 10, question: "Bekzodning vazni 38 1/4 kg, otasining vazni undan 2 marta ko'p. Otasining vazni necha kilogramm?", options: ["76 1/2 kg", "76 1/4 kg", "40 1/4 kg", "77 kg"], answer: "76 1/2 kg", explain: "38 · 2 = 76, 1/4 · 2 = 1/2. Jami 76 1/2 kg. 40 1/4 — «2 marta ko'p» o'rniga 2 qo'shilgan." }
  ],
  // 11-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|qolgan-qismning-qismi": [
    { level: 1, question: "Tasmaning 2/5 qismi bo'yalgan. Bo'yalmagan qismi tasmaning qancha qismi?", options: ["3/5", "2/5", "5/5", "2/3"], answer: "3/5", explain: "Butun tasma — 1 = 5/5. 5/5 − 2/5 = 3/5." },
    { level: 2, question: "Tasmaning 1/5 qismi bo'yalgan. Bo'yalmagan qismining 3/8 qismi butun tasmaning qancha qismi?", options: ["3/10", "3/8", "3/40", "4/13"], answer: "3/10", explain: "Bo'yalmagan qism: 1 − 1/5 = 4/5. 4/5 · 3/8 = 12/40 = 3/10. 3/8 — bu qolgan qismning qismi, butunniki emas; 3/40 — bo'yalgan qismdan olingan." },
    { level: 3, question: "Tasmaning 1/3 qismi bo'yalgan. Bo'yalmagan qismining 1/4 qismi tasmaning qancha qismi?", options: ["1/6", "1/12", "1/4", "7/12"], answer: "1/6", explain: "Bo'yalmagan qism 2/3. Uning 1/4 qismi: 2/3 · 1/4 = 2/12 = 1/6. 1/12 — bo'yalgan qismdan olingan (xato)." },
    { level: 4, question: "Nilufar pulining 1/4 qismiga daftarlar, qolgan pulining 2/3 qismiga kitob oldi. Kitobga pulining qancha qismini sarfladi?", options: ["1/2", "2/3", "1/6", "11/12"], answer: "1/2", explain: "Qolgan: 3/4. Uning 2/3 qismi: 3/4 · 2/3 = 1/2. 1/6 — qolgan qism o'rniga 1/4 dan olingan." },
    { level: 5, question: "Munchoqlarning 1/3 qismi qizil, 1/6 qismi yashil. Qolgan munchoqlar qancha qismni tashkil etadi?", options: ["1/2", "7/9", "5/6", "2/9"], answer: "1/2", explain: "1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2. Qolgan: 1 − 1/2 = 1/2. 7/9 — maxrajlar qo'shib yuborilgan (1/3 + 1/6 = 2/9 deb)." },
    { level: 6, question: "Otabek 24 000 so'mga futbolka oldi — bu uning pulining 2/5 qismi. Dastlab qancha puli bor edi?", options: ["60 000 so'm", "9 600 so'm", "48 000 so'm", "36 000 so'm"], answer: "60 000 so'm", explain: "2 bo'lak = 24 000, 1 bo'lak = 12 000. 5 bo'lak = 60 000 so'm. 9 600 — 24 000 ning 2/5 qismi olingan (xato)." },
    { level: 7, question: "560 nafar o'quvchining 4/7 qismi qizlar. O'g'il bolalar nechta?", options: ["240", "320", "80", "420"], answer: "240", explain: "O'g'il bolalar: 1 − 4/7 = 3/7 qism. 560 : 7 · 3 = 240. 320 — qizlar soni." },
    { level: 8, question: "Nilufarda 80 000 so'm bor edi. Pulining 1/4 qismiga daftarlar, qolganining 2/3 qismiga kitob oldi. Unda qancha pul qoldi?", options: ["20 000 so'm", "40 000 so'm", "60 000 so'm", "10 000 so'm"], answer: "20 000 so'm", explain: "Daftarlar 20 000, qolgan 60 000. Kitob 40 000, qoldi 60 000 − 40 000 = 20 000 so'm. 40 000 — kitob narxi." },
    { level: 9, question: "Do'kondagi olmaning 3/8 qismi sotildi, 150 kg qoldi. Do'konda qancha olma bor edi?", options: ["240 kg", "400 kg", "90 kg", "225 kg"], answer: "240 kg", explain: "Qolgan qism 5/8 = 150 kg. 1 bo'lak = 30 kg, 8 bo'lak = 240 kg. 400 kg — 150 kg ni sotilgan qism (3/8) deb hisoblangan." },
    { level: 10, question: "Ishtirokchilarning 2/5 qismi o'quvchilar, qolganlarining 2/3 qismi talabalar, qolgani kattalar. Talabalar kattalardan 18 nafar ko'p. Jami nechta ishtirokchi bor?", options: ["90", "54", "72", "45"], answer: "90", explain: "Tasma 5 bo'lak: o'quvchilar 2, talabalar 2, kattalar 1. Farq 1 bo'lak = 18. Jami 5 · 18 = 90." }
  ],
  // 12-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|uchburchak-asosi-balandligi": [
    { level: 1, question: "Uchburchakning nechta uchi, nechta tomoni va nechta burchagi bor?", options: ["3 ta uchi, 3 ta tomoni, 3 ta burchagi", "3 ta uchi, 3 ta tomoni, 6 ta burchagi", "4 ta uchi, 4 ta tomoni, 4 ta burchagi", "3 ta uchi, 6 ta tomoni, 3 ta burchagi"], answer: "3 ta uchi, 3 ta tomoni, 3 ta burchagi", explain: "Uchburchak — uchta uchi bor shakl: uchlarni tutashtiruvchi 3 ta tomon va har bir uchda bittadan — 3 ta burchak." },
    { level: 2, question: "Bo'yi 9 cm, eni 5 cm bo'lgan to'g'ri to'rtburchakning yuzi qancha?", options: ["45 cm²", "28 cm²", "14 cm²", "45 cm"], answer: "45 cm²", explain: "Yuz = bo'yi × eni = 9 · 5 = 45 cm². 28 cm — perimetr, yuz emas; yuz birligi cm²." },
    { level: 3, question: "KLMN to'g'ri to'rtburchakda KL tomonga qaysi tomonlar perpendikulyar?", options: ["KN va LM", "faqat MN", "KL va MN", "hech biri"], answer: "KN va LM", explain: "To'g'ri to'rtburchakning har bir burchagi to'g'ri: KL tomon K uchida KN bilan, L uchida LM bilan to'g'ri burchak hosil qiladi. MN esa KL ga parallel." },
    { level: 4, question: "Uchburchakning asosi qaysi tomoni bo'lishi mumkin?", options: ["istalgan tomoni", "faqat pastdagi gorizontal tomoni", "faqat eng uzun tomoni", "faqat eng qisqa tomoni"], answer: "istalgan tomoni", explain: "Asos — uchburchakning istalgan tomoni. Chizma qanday burilgan bo'lishidan qat'i nazar, uchala tomondan birini asos qilib olish mumkin." },
    { level: 5, question: "Uchburchakning balandligi asosga nisbatan qanday joylashadi?", options: ["asosga perpendikulyar", "asosga parallel", "asosning o'rtasidan o'tadi", "asos bilan ustma-ust"], answer: "asosga perpendikulyar", explain: "Balandlik asosga (yoki uning davomiga) to'g'ri burchak ostida tushadi: balandlik ⊥ asos. O'rtasiga tushishi shart emas." },
    { level: 6, question: "MNP uchburchakda MN — asos. Balandlik qaysi nuqtadan tushiriladi?", options: ["P uchidan", "M uchidan", "N uchidan", "MN ning o'rtasidan"], answer: "P uchidan", explain: "Balandlik asos qarshisidagi uchdan tushiriladi. MN qarshisidagi uch — P." },
    { level: 7, question: "DKL uchburchakda ∠K = 90°. KL — asos bo'lsa, balandlik qaysi kesma?", options: ["DK", "DL", "KL", "balandlik yo'q"], answer: "DK", explain: "To'g'ri burchakli uchburchakda DK ⊥ KL, shuning uchun balandlik DK tomon bilan ustma-ust tushadi." },
    { level: 8, question: "O'tmas burchakka yopishgan tomon asos bo'lsa, balandlik qayerga tushadi?", options: ["asosning davomiga, uchburchakdan tashqariga", "har doim asosning o'rtasiga", "uchburchak ichiga", "hech qayerga tushmaydi"], answer: "asosning davomiga, uchburchakdan tashqariga", explain: "O'tmas burchak tufayli qarshi uchdan tushirilgan perpendikulyar asosning o'ziga emas, davomiga tushadi — asosni punktir bilan uzaytiramiz." },
    { level: 9, question: "Uchburchakning nechta balandligi bor?", options: ["3 ta", "1 ta", "2 ta", "6 ta"], answer: "3 ta", explain: "Har bir tomon asos bo'lishi mumkin va har biriga qarshi uchdan bittadan balandlik tushiriladi: 3 ta tomon — 3 ta balandlik." },
    { level: 10, question: "8 cm × 5 cm to'g'ri to'rtburchakning burchagidan 3 cm × 2 cm bo'lagi kesib olindi. Qolgan shaklning yuzi qancha?", options: ["34 cm²", "40 cm²", "46 cm²", "6 cm²"], answer: "34 cm²", explain: "Butun to'rtburchak: 8 · 5 = 40 cm². Kesilgan bo'lak: 3 · 2 = 6 cm². Qoldi: 40 − 6 = 34 cm². 46 — qo'shib yuborilgan." }
  ],
  // 13-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|uchburchak-yuzi": [
    { level: 1, question: "Uchburchakka mos to'g'ri to'rtburchakning bo'yi va eni nimaga teng?", options: ["bo'yi — asosga, eni — balandlikka", "bo'yi va eni — ikki yon tomonga", "bo'yi — balandlikka, eni — yon tomonga", "bo'yi — perimetrga, eni — asosga"], answer: "bo'yi — asosga, eni — balandlikka", explain: "Uchburchakning asosi to'rtburchakning bir tomonida yotadi, uchi qarama-qarshi tomonda — shuning uchun bo'yi asosga, eni balandlikka teng." },
    { level: 2, question: "Uchburchakning yuzi mos to'g'ri to'rtburchak yuzining qanchasiga teng?", options: ["yarmiga", "o'ziga teng", "ikki baravariga", "choragiga"], answer: "yarmiga", explain: "Uchburchakdan tashqaridagi bo'laklar uchburchakning o'zi bilan teng — u to'rtburchakning aynan yarmini egallaydi." },
    { level: 3, question: "Asosi 8 cm, balandligi 7 cm bo'lgan uchburchakning yuzi qancha?", options: ["28 cm²", "56 cm²", "15 cm²", "28 cm"], answer: "28 cm²", explain: "S = ½ · 8 · 7 = 56 : 2 = 28 cm². 56 — yarmi olinmagan; yuz birligi cm²." },
    { level: 4, question: "Asosi 12 m, balandligi 9 m bo'lgan uchburchakning yuzi qancha?", options: ["54 m²", "108 m²", "21 m²", "42 m²"], answer: "54 m²", explain: "S = ½ · 12 · 9 = 108 : 2 = 54 m². 21 — asos va balandlik qo'shilgan (xato)." },
    { level: 5, question: "Uchburchakka mos to'g'ri to'rtburchakning yuzi 40 cm². Uchburchakning yuzi qancha?", options: ["20 cm²", "40 cm²", "80 cm²", "10 cm²"], answer: "20 cm²", explain: "Uchburchakning yuzi mos to'g'ri to'rtburchak yuzining yarmi: 40 : 2 = 20 cm²." },
    { level: 6, question: "To'g'ri burchakli uchburchakning tomonlari 7 cm, 24 cm va 25 cm (to'g'ri burchak 7 va 24 cm li tomonlar orasida). Yuzi qancha?", options: ["84 cm²", "168 cm²", "300 cm²", "4200 cm²"], answer: "84 cm²", explain: "7 va 24 cm li tomonlar o'zaro perpendikulyar: biri asos, ikkinchisi balandlik. S = ½ · 24 · 7 = 84 cm². 25 cm — ortiqcha o'lcham." },
    { level: 7, question: "Asoslari teng va balandliklari teng ikki uchburchakning yuzlari haqida nima deyish mumkin?", options: ["yuzlari teng", "shakliga qarab har xil", "uchi qayerdaligiga qarab har xil", "taqqoslab bo'lmaydi"], answer: "yuzlari teng", explain: "Yuz faqat asos va balandlikka bog'liq: S = ½ · a · h. Ular teng bo'lsa, shakli har xil bo'lsa ham yuzlar teng." },
    { level: 8, question: "Asos o'zgarmadi, balandlik 2 marta ortdi. Uchburchakning yuzi qanday o'zgaradi?", options: ["2 marta ortadi", "4 marta ortadi", "o'zgarmaydi", "2 marta kamayadi"], answer: "2 marta ortadi", explain: "S = ½ · a · h da h 2 marta ortsa, ko'paytma ham 2 marta ortadi. 4 marta — asos ham, balandlik ham 2 marta ortganda." },
    { level: 9, question: "Asosi 4 m, balandligi 50 cm bo'lgan uchburchakning yuzi necha cm²?", options: ["10 000 cm²", "100 cm²", "20 000 cm²", "1000 cm²"], answer: "10 000 cm²", explain: "Birliklarni bir xil qilamiz: 4 m = 400 cm. S = ½ · 400 · 50 = 10 000 cm². 100 — metr va santimetr aralashtirilgan." },
    { level: 10, question: "Uchburchakning yuzi 36 cm², asosi 12 cm. Shu asosga tushirilgan balandlik qancha?", options: ["6 cm", "3 cm", "24 cm", "432 cm"], answer: "6 cm", explain: "½ · 12 · h = 36, demak 12 · h = 72, h = 72 : 12 = 6 cm. 3 cm — ½ hisobga olinmagan (36 : 12)." }
  ],
  // 14-mavzu o'z testi (ma'ruzaga mos)
  "5|matematika|murakkab-shakllar-yuzi": [
    { level: 1, question: "Murakkab shaklning yuzini 1-usulda qanday topamiz?", options: ["bo'laklarga ajratib, yuzlarini qo'shamiz", "tomonlarini qo'shamiz", "eng uzun tomonni ikkiga ko'paytiramiz", "faqat eng katta bo'lakni olamiz"], answer: "bo'laklarga ajratib, yuzlarini qo'shamiz", explain: "Shakl to'g'ri to'rtburchak, kvadrat va uchburchaklarga ajratiladi, so'ng ularning yuzlari qo'shiladi. Tomonlar yig'indisi — perimetr, yuz emas." },
    { level: 2, question: "2-usulda nima qilinadi?", options: ["katta to'g'ri to'rtburchakdan ortiqcha qism ayiriladi", "bo'laklar yuzlari ko'paytiriladi", "ortiqcha qism qo'shiladi", "perimetr ikkiga bo'linadi"], answer: "katta to'g'ri to'rtburchakdan ortiqcha qism ayiriladi", explain: "Shakl katta to'g'ri to'rtburchakka to'ldiriladi va undan shaklga kirmagan qism ayiriladi." },
    { level: 3, question: "Shakl 7 cm × 5 cm to'g'ri to'rtburchak va asosi 4 cm, balandligi 5 cm bo'lgan uchburchakdan iborat. Yuzi qancha?", options: ["45 cm²", "55 cm²", "35 cm²", "21 cm²"], answer: "45 cm²", explain: "7 · 5 = 35 va ½ · 4 · 5 = 10. Jami 45 cm². 55 — uchburchakda ½ unutilgan." },
    { level: 4, question: "To'g'ri to'rtburchakning bo'yi 11 cm, uning ustki tomonining bir qismi 7 cm. Qolgan qismi necha cm?", options: ["4 cm", "18 cm", "7 cm", "11 cm"], answer: "4 cm", explain: "Qarama-qarshi tomonlar teng: 11 − 7 = 4 cm. 18 — ayirish o'rniga qo'shilgan." },
    { level: 5, question: "10 cm × 8 cm to'g'ri to'rtburchakning burchagidan tomonlari 4 cm va 3 cm bo'lgan to'g'ri burchakli uchburchak kesib olindi. Qolgan shaklning yuzi?", options: ["74 cm²", "68 cm²", "86 cm²", "80 cm²"], answer: "74 cm²", explain: "80 − ½ · 4 · 3 = 80 − 6 = 74 cm². 68 — uchburchakda ½ unutilgan (80 − 12)." },
    { level: 6, question: "Uy shakli: 6 m × 4 m devor, tomoni 4 m kvadrat ayvon va asosi 6 m, balandligi 3 m tom. Umumiy yuz?", options: ["49 m²", "58 m²", "40 m²", "13 m²"], answer: "49 m²", explain: "24 + 16 + ½ · 6 · 3 = 24 + 16 + 9 = 49 m². 58 — tomda ½ unutilgan." },
    { level: 7, question: "Tomoni 12 cm kvadratning tomonlari o'rtalari tutashtirildi. Ichki kvadratning yuzi?", options: ["72 cm²", "36 cm²", "144 cm²", "108 cm²"], answer: "72 cm²", explain: "144 dan 4 ta burchak uchburchagini ayiramiz: 4 · ½ · 6 · 6 = 72. 144 − 72 = 72 cm² — katta kvadratning yarmi." },
    { level: 8, question: "L shaklning tashqi o'lchamlari 10 cm × 8 cm, burchagidan 6 cm × 5 cm qism chiqarilgan. Yuzi?", options: ["50 cm²", "62 cm²", "80 cm²", "110 cm²"], answer: "50 cm²", explain: "2-usul: 80 − 30 = 50 cm². 62 — bo'laklarga ajratishda ustma-ust qism ikki marta sanalgan." },
    { level: 9, question: "To'rtburchakning diagonallari perpendikulyar: biri 10 cm, ikkinchisi 8 cm. Yuzi qancha?", options: ["40 cm²", "80 cm²", "18 cm²", "20 cm²"], answer: "40 cm²", explain: "Diagonal to'rtburchakni ikki uchburchakka bo'ladi: har biri ½ · 10 · 4 = 20. Jami 40 cm². 80 — ½ hisobga olinmagan." },
    { level: 10, question: "Panjara katagining tomoni 2 cm. Uchburchakning asosi 4 katak, balandligi 3 katak. Yuzi necha cm²?", options: ["24 cm²", "6 cm²", "12 cm²", "48 cm²"], answer: "24 cm²", explain: "Asos 8 cm, balandlik 6 cm: ½ · 8 · 6 = 24 cm². 6 — kataklar soni, har katak esa 4 cm²." }
  ],
  "5|matematika|fazoviy-jismlar-hajmi": [
    { level: 1, question: "Birlik kubning hajmi qancha?", options: ["1 kub birlik", "6 kub birlik", "3 kub birlik", "1 kvadrat birlik"], answer: "1 kub birlik", explain: "Birlik kubning bo'yi, eni va balandligi 1 birlikdan, hajmi esa 1 kub birlik. Kvadrat birlik — yuz o'lchovi." },
    { level: 2, question: "Kubning nechta yog'i bor va ular qanday shaklda?", options: ["6 ta, hammasi kvadrat", "4 ta, hammasi kvadrat", "6 ta, hammasi to'g'ri to'rtburchak (kvadrat emas)", "8 ta, hammasi kvadrat"], answer: "6 ta, hammasi kvadrat", explain: "Kubning 6 ta yog'i bor va hammasi bir xil kvadrat." },
    { level: 3, question: "Jism 9 ta birlik kubdan yasalgan. Uning hajmi qancha?", options: ["9 kub birlik", "18 kub birlik", "3 kub birlik", "6 kub birlik"], answer: "9 kub birlik", explain: "Jismning hajmi undagi birlik kublar soniga teng: 9 kub birlik." },
    { level: 4, question: "Kuboid ikki qatlamdan iborat, har qatlamda 3 tadan 2 qator kubcha bor. Hajmi qancha?", options: ["12 kub birlik", "6 kub birlik", "10 kub birlik", "5 kub birlik"], answer: "12 kub birlik", explain: "Bir qatlamda 3 · 2 = 6 ta, ikki qatlamda 6 + 6 = 12 ta kubcha. 6 — faqat bitta qatlam." },
    { level: 5, question: "Zina 3 ta pog'onadan iborat: balandliklari 1, 2 va 3 kubcha, eni 2 kubcha. Nechta birlik kub kerak?", options: ["12", "6", "9", "18"], answer: "12", explain: "Bir qatorda 1 + 2 + 3 = 6, qatorlar 2 ta: 6 + 6 = 12. 6 — faqat bitta qator." },
    { level: 6, question: "P jism 8 ta, Q jism 5 ta, R jism 8 ta birlik kubdan yasalgan. To'g'ri javobni tanlang.", options: ["P va R hajmi teng, Q kichik", "Faqat P eng katta", "Hammasining hajmi teng", "Q eng katta"], answer: "P va R hajmi teng, Q kichik", explain: "Hajm kubchalar soniga bog'liq, shaklga emas: P = R = 8, Q = 5 — eng kichik." },
    { level: 7, question: "Qirrasi 3 birlik bo'lgan kubning hajmi qancha?", options: ["27 kub birlik", "9 kub birlik", "12 kub birlik", "6 kub birlik"], answer: "27 kub birlik", explain: "Bir qatlamda 3 · 3 = 9 ta, qatlamlar 3 ta: 9 + 9 + 9 = 27. 9 — faqat bitta qatlam." },
    { level: 8, question: "Idishning sig'imi 2 ℓ, unda 750 ml suv bor. To'ldirish uchun yana qancha suv kerak?", options: ["1250 ml", "1750 ml", "1500 ml", "2750 ml"], answer: "1250 ml", explain: "2 ℓ = 2000 ml; 2000 − 750 = 1250 ml." },
    { level: 9, question: "18 ta birlik kubdan nechta xil kuboid yasash mumkin (aylantirilgani bir xil hisoblanadi)?", options: ["4", "3", "6", "2"], answer: "4", explain: "18 ni ko'paytma ko'rinishida yozamiz: 18×1×1, 9×2×1, 6×3×1, 3×3×2 — jami 4 xil." },
    { level: 10, question: "27 ta kubchadan qirrasi 3 bo'lgan kub yasab, tashqi yoqlari bo'yaldi. Bo'yalmagan kubchalar nechta?", options: ["1", "0", "6", "3"], answer: "1", explain: "Faqat o'rtadagi kubcha hamma tomondan o'ralgan, uning birorta yog'i bo'yalmaydi." }
  ],
  "5|matematika|izometrik-panjarada-chizish": [
    { level: 1, question: "Uch o'lchamli (izometrik) nuqtali panjarada qirralar nechta yo'nalishda chiziladi?", options: ["3 ta", "2 ta", "4 ta", "6 ta"], answer: "3 ta", explain: "Faqat uch yo'nalish: tik chiziq, chapga-yuqoriga qiya chiziq va o'ngga-yuqoriga qiya chiziq. Yotiq (gorizontal) chiziq ishlatilmaydi." },
    { level: 2, question: "Panjarada jismning balandligi qanday chiziladi?", options: ["Tik chiziq bilan", "Yotiq chiziq bilan", "Chapga-yuqoriga qiya chiziq bilan", "O'ngga-yuqoriga qiya chiziq bilan"], answer: "Tik chiziq bilan", explain: "Balandlik tik chiziladi — bitta ustundagi nuqtalar bo'ylab. Qiya chiziqlar bo'yi va enini ko'rsatadi." },
    { level: 3, question: "Kuboid chizmasida 12 ta qirradan nechtasi ko'rinadi?", options: ["9 ta", "12 ta", "6 ta", "8 ta"], answer: "9 ta", explain: "Orqadagi 3 ta qirra ko'rinmaydi, shuning uchun 12 − 3 = 9 ta qirra yaxlit chiziq bilan chiziladi." },
    { level: 4, question: "Qirrasi 4 birlik bo'lgan kubni chizishda har yo'nalishda necha oraliq olinadi?", options: ["Hamma yo'nalishda 4 oraliqdan", "Tikda 4, qiyalarda 2 oraliqdan", "Faqat tik qirrada 4 oraliq", "Tikda 2, qiyalarda 4 oraliqdan"], answer: "Hamma yo'nalishda 4 oraliqdan", explain: "Kubning bo'yi, eni va balandligi teng, shuning uchun tik ham, ikki qiya qirra ham 4 oraliqdan chiziladi." },
    { level: 5, question: "Bo'yi 5, eni 2, balandligi 3 bo'lgan kuboid chizilmoqda. Tik qirra necha oraliq bo'ladi?", options: ["3", "5", "2", "10"], answer: "3", explain: "Tik qirra balandlikni ko'rsatadi, balandlik 3 — demak 3 oraliq. 5 — bo'yi, 2 — eni." },
    { level: 6, question: "Chizmadagi qirra uchlari bilan 5 ta nuqtadan o'tadi. Uning uzunligi necha birlik?", options: ["4", "5", "6", "3"], answer: "4", explain: "5 nuqta orasida 4 oraliq bor, 1 oraliq = 1 birlik. Nuqtalar soni har doim uzunlikdan 1 ta ko'p." },
    { level: 7, question: "O'lchamlari 4, 3 va 2 bo'lgan kuboidni balandlik qilib har xil o'lchamni olib chizamiz. Nechta xil joylashuv chiqadi?", options: ["3", "2", "6", "1"], answer: "3", explain: "Balandlik 4, 3 yoki 2 bo'lishi mumkin — 3 xil joylashuv. Jismning o'zi bitta, faqat qo'yilishi boshqa." },
    { level: 8, question: "Chizmada 1 birlik haqiqatda 2 cm. Chizmadagi kuboid: bo'yi 6, eni 3, balandligi 4 birlik. Haqiqiy balandligi necha cm?", options: ["8 cm", "4 cm", "12 cm", "6 cm"], answer: "8 cm", explain: "Balandligi 4 birlik, har birlik 2 cm: 4 · 2 = 8 cm. 12 cm — bo'yining 6 birlik ekanini 2 ga ko'paytirganda chiqadi." },
    { level: 9, question: "Bo'yi 5, eni 3, balandligi 2 bo'lgan kuboid chizmasida faqat ko'rinadigan 9 ta qirra chizilgan. Ularning jami uzunligi necha birlik?", options: ["30", "10", "45", "20"], answer: "30", explain: "Tik qirralar: 3 · 2 = 6; bo'yi bo'yicha 3 ta: 3 · 5 = 15; eni bo'yicha 3 ta: 3 · 3 = 9. Jami 6 + 15 + 9 = 30 birlik." },
    { level: 10, question: "Bir kuboid yotgan holda 5 × 2 × 2, boshqasi tik turgan holda 2 × 2 × 5 o'lchamda chizildi. To'g'ri javobni tanlang.", options: ["Bitta jism, hajmi 20 kub birlik", "Har xil jism, hajmlari har xil", "Ikkalasi har xil jism, lekin hajmi 20", "Bitta jism, hajmi 10 kub birlik"], answer: "Bitta jism, hajmi 20 kub birlik", explain: "O'lchamlar to'plami bir xil (5, 2, 2) — bu bitta jism, faqat qo'yilishi boshqa. Hajmi: 2 · 2 = 4 kubcha, 5 qatlam — 4 · 5 = 20 kub birlik." }
  ],
  "5|matematika|jismning-korinishlari": [
    { level: 1, question: "Jismning ko'rinishlari qaysi uch tomondan chiziladi?", options: ["Yuqoridan, olddan, yondan", "Faqat yuqoridan", "Pastdan, orqadan, yuqoridan", "Faqat olddan"], answer: "Yuqoridan, olddan, yondan", explain: "Jismga uch tomondan qaraymiz: yuqoridan, olddan va yondan. Har tomondan ko'ringan yoqlar kvadratli panjarada chiziladi." },
    { level: 2, question: "Yuqoridan ko'rinishda jismning old tomoni qayerda chiziladi?", options: ["Pastda", "Tepada", "Chapda", "O'ngda"], answer: "Pastda", explain: "Yuqoridan ko'rinishda old tomon pastda, orqa tomon tepada turadi." },
    { level: 3, question: "3 ta kubchadan minora yasaldi (ular ustma-ust turibdi). Yuqoridan nechta kvadrat ko'rinadi?", options: ["1", "3", "2", "0"], answer: "1", explain: "Uchala kubcha bir-birining ustida, yuqoridan faqat eng ustki kubchaning yog'i ko'rinadi — 1 ta kvadrat." },
    { level: 4, question: "2 × 2 × 2 kubdan (8 ta kubcha) olddan nechta kvadrat ko'rinadi?", options: ["4", "8", "2", "6"], answer: "4", explain: "Olddan faqat old qatlam ko'rinadi: 2 · 2 = 4 ta kvadrat. Orqadagi 4 ta kubcha ko'rinmaydi." },
    { level: 5, question: "Zinaning eni 1 kubcha, pog'onalari 1, 2 va 3 kubcha baland. Olddan nechta kvadrat ko'rinadi?", options: ["6", "3", "9", "5"], answer: "6", explain: "Olddan har pog'onaning balandligicha kvadrat ko'rinadi: 1 + 2 + 3 = 6 ta." },
    { level: 6, question: "Jism 7 ta kubchadan yasalgan. Yuqoridan 5 ta kvadrat ko'rinadi. Nechta kubcha boshqa kubchalar ustida turibdi?", options: ["2", "5", "7", "12"], answer: "2", explain: "Har bir ko'ringan kvadratning ostida kamida 1 ta kubcha bor: 5 ta. Qolgan 7 − 5 = 2 ta kubcha boshqalarning ustida." },
    { level: 7, question: "Kuboidning bo'yi 5, eni 2, balandligi 3 kubcha. Olddan ko'rinishi nechta kvadratdan iborat?", options: ["15", "10", "6", "30"], answer: "15", explain: "Olddan bo'yi va balandlik ko'rinadi: 5 · 3 = 15. 10 — yuqoridan, 6 — yondan ko'rinish, 30 — hajm." },
    { level: 8, question: "Kuboidning bo'yi 4, eni 3, balandligi 2 kubcha; har kubchaning qirrasi 3 cm. Yondan ko'rinishining yuzi necha cm²?", options: ["54 cm²", "72 cm²", "36 cm²", "18 cm²"], answer: "54 cm²", explain: "Yondan eni va balandlik ko'rinadi: 3 · 2 = 6 kvadrat. Har kvadrat 3 · 3 = 9 cm²; 6 · 9 = 54 cm²." },
    { level: 9, question: "Jismning yuqoridan ko'rinishida 3 ustun va 2 qator bor. Olddan ko'rinishda nechta ustun bo'lishi kerak?", options: ["3", "2", "4", "6"], answer: "3", explain: "Yuqoridan va olddan ko'rinishda ustunlar soni bir xil bo'ladi — 3 ta. Qatorlar soni (2) yondan ko'rinishdagi ustunlar soniga teng." },
    { level: 10, question: "Jismning uchala ko'rinishi to'la 2 × 2 kvadrat. Jism eng kamida va eng ko'pi bilan nechta kubchadan iborat?", options: ["6 va 8", "4 va 8", "4 va 6", "8 va 10"], answer: "6 va 8", explain: "Eng ko'pi — 2 × 2 × 2 kub, 8 ta. Eng kami: 4 ta ustun bor, ikkita qarama-qarshi ustun 2 ta baland bo'lsa, 1 + 2 + 2 + 1 = 6 ta kubcha yetadi." }
  ],
  "5|matematika|turt-amal": [
    { level: 1, question: "7 + 5 = ?", options: ["11", "12", "13", "10"], answer: "12" },
    { level: 2, question: "15 - 6 = ?", options: ["8", "9", "10", "7"], answer: "9" },
    { level: 3, question: "6 × 7 = ?", options: ["42", "36", "48", "40"], answer: "42" },
    { level: 4, question: "56 : 8 = ?", options: ["7", "6", "8", "9"], answer: "7" },
    { level: 5, question: "34 × 10 = ?", options: ["340", "34", "3400", "304"], answer: "340" },
    { level: 6, question: "34 × 100 = ?", options: ["3400", "340", "34000", "304"], answer: "3400" },
    { level: 7, question: "4800 : 100 = ?", options: ["48", "480", "4.8", "8"], answer: "48" },
    { level: 8, question: "124 + 89 = ?", options: ["213", "203", "214", "223"], answer: "213" },
    { level: 9, question: "560 - 275 = ?", options: ["285", "295", "275", "315"], answer: "285" },
    { level: 10, question: "125 × 4 = ?", options: ["500", "450", "520", "480"], answer: "500" },
    { level: 11, question: "144 : 12 = ?", options: ["12", "11", "14", "13"], answer: "12" },
    { level: 12, question: "84 ni 5 ga bo'lganda qoldiq nechaga teng?", options: ["4", "3", "5", "2"], answer: "4" },
    { level: 13, question: "x + 18 = 40 tenglamada x nechaga teng?", options: ["22", "58", "20", "24"], answer: "22" },
    { level: 14, question: "45 - x = 19 tenglamada x nechaga teng?", options: ["26", "64", "24", "28"], answer: "26" },
    { level: 15, question: "12 + 6 × (8 - 5) amalning natijasini toping (qavs birinchi bajariladi).", options: ["30", "54", "24", "36"], answer: "30" },
    { level: 16, question: "(12 + 6) × 8 - 5 amalning natijasini toping.", options: ["139", "144", "135", "149"], answer: "139" },
    { level: 17, question: "7 ning kvadrati nechaga teng?", options: ["49", "14", "21", "56"], answer: "49" },
    { level: 18, question: "3 ning kubi nechaga teng?", options: ["27", "9", "6", "81"], answer: "27" },
    { level: 19, question: "Anvar 235 ta, Bobur esa Anvardan 48 ta kam olma terdi. Bobur nechta olma terdi?", options: ["187", "283", "197", "177"], answer: "187" },
    { level: 20, question: "Bir sonni 126 ga qo'shganda 300 hosil bo'ldi. Shu sondan 89 ni ayirsak, natija nechaga teng bo'ladi?", options: ["85", "95", "75", "89"], answer: "85" }
  ],

  "5|matematika|hajm": [
    { level: 1, question: "To'g'ri to'rtburchakning yuzini topish formulasi qaysi?", options: ["S = a × b", "S = a + b", "S = 2(a+b)", "S = a × a"], answer: "S = a × b" },
    { level: 2, question: "Tomonlari 4 sm va 6 sm bo'lgan to'g'ri to'rtburchakning yuzini toping.", options: ["24 sm²", "20 sm²", "10 sm²", "48 sm²"], answer: "24 sm²" },
    { level: 3, question: "Tomoni 5 sm bo'lgan kvadratning yuzini toping.", options: ["25 sm²", "20 sm²", "10 sm²", "15 sm²"], answer: "25 sm²" },
    { level: 4, question: "1 m² necha sm² ga teng?", options: ["10000 sm²", "1000 sm²", "100 sm²", "100000 sm²"], answer: "10000 sm²" },
    { level: 5, question: "To'g'ri burchakli parallelepipedning hajmi qanday formula bilan topiladi?", options: ["V = a × b × c", "V = a + b + c", "V = 2(a+b+c)", "V = a × b"], answer: "V = a × b × c" },
    { level: 6, question: "Qirralari 2 sm, 3 sm, 4 sm bo'lgan to'g'ri burchakli parallelepipedning hajmini toping.", options: ["24 sm³", "9 sm³", "20 sm³", "12 sm³"], answer: "24 sm³" },
    { level: 7, question: "Qirrasi 3 sm bo'lgan kubning hajmini toping.", options: ["27 sm³", "9 sm³", "6 sm³", "18 sm³"], answer: "27 sm³" },
    { level: 8, question: "1 dm³ necha sm³ ga teng?", options: ["1000 sm³", "100 sm³", "10 sm³", "10000 sm³"], answer: "1000 sm³" },
    { level: 9, question: "Uzunligi 8 m, eni 5 m bo'lgan xona polining yuzini toping.", options: ["40 m²", "13 m²", "45 m²", "35 m²"], answer: "40 m²" },
    { level: 10, question: "Asosi 6 sm × 4 sm bo'lgan, balandligi 5 sm bo'lgan to'g'ri burchakli parallelepipedning hajmini toping.", options: ["120 sm³", "110 sm³", "100 sm³", "130 sm³"], answer: "120 sm³" }
  ],

  "5|matematika|oddiy-kasrlar": [
    { level: 1, question: "Doira 4 ta teng bo'lakka bo'lingan, 1 tasi bo'yalgan. Bo'yalgan qism qanday kasr bilan ifodalanadi?", options: ["1/4", "1/2", "1/3", "4/1"], answer: "1/4", explain: "Maxraj — butun nechta teng bo'lakka bo'linganini (4), surat — nechtasi olinganini (1) ko'rsatadi." },
    { level: 2, question: "3/5 kasrida maxraj nechaga teng?", options: ["5", "3", "8", "15"], answer: "5", explain: "Kasr chizig'ining ostidagi son — maxraj. 3/5 da surat 3, maxraj 5." },
    { level: 3, question: "Qaysi kasr to'g'ri kasr (surati maxrajidan kichik)?", options: ["3/7", "7/3", "5/5", "8/6"], answer: "3/7", explain: "To'g'ri kasrda surat maxrajdan kichik bo'ladi: 3 < 7. 7/3 va 8/6 da surat katta, 5/5 esa 1 ga teng." },
    { level: 4, question: "1/4 va 3/4 kasrlaridan qaysi biri katta?", options: ["3/4", "1/4", "Teng", "Aniqlab bo'lmaydi"], answer: "3/4", explain: "Maxrajlari teng kasrlardan surati katta bo'lgani katta: 3 > 1, demak 3/4 > 1/4." },
    { level: 5, question: "2/9 + 4/9 = ?", options: ["6/9", "6/18", "2/9", "8/9"], answer: "6/9", explain: "Maxrajlari teng kasrlarni qo'shganda suratlar qo'shiladi, maxraj o'zgarmaydi: 2 + 4 = 6, maxraj 9." },
    { level: 6, question: "7/10 - 3/10 = ?", options: ["4/10", "4/20", "10/10", "3/10"], answer: "4/10", explain: "Maxrajlari teng kasrlarni ayirganda suratlar ayiriladi, maxraj o'zgarmaydi: 7 − 3 = 4, maxraj 10." },
    { level: 7, question: "17/5 kasrini aralash son ko'rinishida yozing.", options: ["3 va 2/5", "3 va 1/5", "2 va 3/5", "5 va 2/3"], answer: "3 va 2/5", explain: "17 ni 5 ga bo'lamiz: 17 = 5 · 3 + 2. Butun qism 3, qoldiq 2 surat bo'ladi: 3 va 2/5." },
    { level: 8, question: "2 va 1/3 aralash sonini noto'g'ri kasrga o'tkazing.", options: ["7/3", "6/3", "5/3", "8/3"], answer: "7/3", explain: "Butun qismni maxrajga ko'paytirib, suratni qo'shamiz: 2 · 3 + 1 = 7. Maxraj o'zgarmaydi: 7/3." },
    { level: 9, question: "2 va 1/4 + 1 va 2/4 = ?", options: ["3 va 3/4", "3 va 1/4", "4", "3 va 2/4"], answer: "3 va 3/4", explain: "Butunlarni alohida, kasrlarni alohida qo'shamiz: 2 + 1 = 3 va 1/4 + 2/4 = 3/4." },
    { level: 10, question: "Matoning 3/8 qismi qizil, qolgani ko'k rangda bo'yalgan. Matoning necha qismi ko'k rangda?", options: ["5/8", "3/8", "1/8", "8/8"], answer: "5/8", explain: "Butun mato — 8/8. Qizildan qolgani: 8/8 − 3/8 = 5/8." }
  ],

  "5|matematika|onli-kasrlar": [
    { level: 1, question: "0,7 o'nli kasrini oddiy kasr ko'rinishida yozing.", options: ["7/10", "7/100", "70/10", "7/1"], answer: "7/10" },
    { level: 2, question: "0,5 va 0,7 dan qaysi biri katta?", options: ["0,7", "0,5", "Teng", "Aniqlab bo'lmaydi"], answer: "0,7" },
    { level: 3, question: "3,4 + 2,5 = ?", options: ["5,9", "5,8", "6,9", "5,7"], answer: "5,9" },
    { level: 4, question: "7,8 - 3,2 = ?", options: ["4,6", "4,5", "4,7", "3,6"], answer: "4,6" },
    { level: 5, question: "0,25 va 0,250 kasrlarini taqqoslang.", options: ["Teng", "0,25 katta", "0,250 katta", "Aniqlab bo'lmaydi"], answer: "Teng" },
    { level: 6, question: "12,345 sonini o'ndan bir xonagacha yaxlitlang.", options: ["12,3", "12,4", "12,35", "12,5"], answer: "12,3" },
    { level: 7, question: "5,6 + 4,45 = ?", options: ["10,05", "10,5", "9,05", "10,15"], answer: "10,05" },
    { level: 8, question: "10 - 3,25 = ?", options: ["6,75", "7,75", "6,25", "6,85"], answer: "6,75" },
    { level: 9, question: "0,004 kasrida 4 raqami qaysi xonada turibdi?", options: ["Mingdan ulush", "O'ndan ulush", "Yuzdan ulush", "Birlar"], answer: "Mingdan ulush" },
    { level: 10, question: "Bir metr matodan 0,35 metrini kesib oldilar. Matoning necha metri qoldi?", options: ["0,65 m", "0,45 m", "0,75 m", "0,55 m"], answer: "0,65 m" },
    { level: 11, question: "2,5 × 10 = ?", options: ["25", "2,5", "250", "0,25"], answer: "25" },
    { level: 12, question: "3,4 × 2 = ?", options: ["6,8", "6,4", "7,8", "5,8"], answer: "6,8" },
    { level: 13, question: "4,8 : 4 = ?", options: ["1,2", "1,4", "2,2", "0,12"], answer: "1,2" },
    { level: 14, question: "0,6 × 0,3 = ?", options: ["0,18", "0,9", "1,8", "0,09"], answer: "0,18" },
    { level: 15, question: "7,2 : 0,8 = ?", options: ["9", "0,9", "90", "0,09"], answer: "9" },
    { level: 16, question: "1,25 × 100 = ?", options: ["125", "12,5", "1250", "0,125"], answer: "125" },
    { level: 17, question: "0,45 : 5 = ?", options: ["0,09", "0,9", "9", "0,009"], answer: "0,09" },
    { level: 18, question: "3,2 × 1,5 = ?", options: ["4,8", "3,7", "4,5", "5,2"], answer: "4,8" },
    { level: 19, question: "6, 9, 12 sonlarining o'rta arifmetigini toping.", options: ["9", "27", "3", "10"], answer: "9" },
    { level: 20, question: "1 kg olma narxi 12 500 so'm. 2,5 kg olma narxi qancha bo'ladi?", options: ["31 250 so'm", "30 000 so'm", "25 000 so'm", "32 500 so'm"], answer: "31 250 so'm" }
  ],

  "5|matematika|foizlar": [
    { level: 1, question: "1% qanday kasrga teng?", options: ["1/100", "1/10", "10/100", "1/1000"], answer: "1/100" },
    { level: 2, question: "50% ni oddiy kasr ko'rinishida yozing.", options: ["1/2", "1/4", "1/5", "2/1"], answer: "1/2" },
    { level: 3, question: "200 ning 10% i nechaga teng?", options: ["20", "2", "10", "100"], answer: "20" },
    { level: 4, question: "300 ning 25% i nechaga teng?", options: ["75", "25", "50", "100"], answer: "75" },
    { level: 5, question: "Sinfda 40 ta o'quvchidan 25% i sport to'garagiga qatnaydi. Nechta o'quvchi sport to'garagiga qatnaydi?", options: ["10", "15", "20", "25"], answer: "10" },
    { level: 6, question: "Bir tovarning narxi 80 000 so'm edi, 10% ga arzonlashtirildi. Tovarning yangi narxi qancha bo'ladi?", options: ["72 000 so'm", "70 000 so'm", "8 000 so'm", "88 000 so'm"], answer: "72 000 so'm" },
    { level: 7, question: "Sinfdagi o'quvchilarning 60% qizlar bo'lib, bu 24 nafarni tashkil qiladi. Sinfda jami nechta o'quvchi bor?", options: ["40", "36", "44", "48"], answer: "40" }
  ],

  "5|matematika|burchaklar": [
    { level: 1, question: "To'g'ri burchak necha gradus?", options: ["90°", "180°", "45°", "120°"], answer: "90°" },
    { level: 2, question: "Yoyiq burchak necha gradus?", options: ["180°", "90°", "360°", "270°"], answer: "180°" },
    { level: 3, question: "Burchaklarni o'lchash uchun ishlatiladigan asbob nima deb ataladi?", options: ["Transportir", "Chizg'ich", "Sirkul", "Burchakometr"], answer: "Transportir" },
    { level: 4, question: "O'tkir burchak necha gradusdan kichik bo'ladi?", options: ["90° dan kichik", "90° dan katta", "180° ga teng", "0° ga teng"], answer: "90° dan kichik" },
    { level: 5, question: "O'tmas burchak qanday burchak?", options: ["90° dan katta, 180° dan kichik", "90° dan kichik", "180° ga teng", "0° ga teng"], answer: "90° dan katta, 180° dan kichik" },
    { level: 6, question: "To'g'ri chiziqda joylashgan ikki burchakning yig'indisi necha gradus bo'ladi?", options: ["180°", "90°", "360°", "270°"], answer: "180°" },
    { level: 7, question: "Vertikal burchaklar bir-biriga nisbatan qanday bo'ladi?", options: ["Teng", "Yig'indisi 180°", "Yig'indisi 90°", "Har xil"], answer: "Teng" },
    { level: 8, question: "Bir nuqta atrofidagi barcha burchaklar yig'indisi necha gradus bo'ladi?", options: ["360°", "180°", "90°", "270°"], answer: "360°" }
  ]
};
