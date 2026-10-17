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
