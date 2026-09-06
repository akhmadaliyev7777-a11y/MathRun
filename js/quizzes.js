/*
  QUIZ_DATA — har bir mavzu uchun 10 tadan savol, oson->qiyin tartibida.
  Kalit format: "sinf|fan|mavzuId" (data.js dagi id'larga mos).

  Har bir savol:
  {
    level: 1..10,
    question: "Savol matni",
    options: ["variant1", "variant2", ...],   // nechta bo'lsa, sahifada shuncha tugma chiqadi
    answer: "variant1"                         // options ichidagi qiymatlardan biri bilan AYNAN bir xil bo'lishi kerak
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
    { level: 1, question: "Doira 4 ta teng bo'lakka bo'lingan, 1 tasi bo'yalgan. Bo'yalgan qism qanday kasr bilan ifodalanadi?", options: ["1/4", "1/2", "1/3", "4/1"], answer: "1/4" },
    { level: 2, question: "3/5 kasrida maxraj nechaga teng?", options: ["5", "3", "8", "15"], answer: "5" },
    { level: 3, question: "Qaysi kasr to'g'ri kasr (surati maxrajidan kichik)?", options: ["3/7", "7/3", "5/5", "8/6"], answer: "3/7" },
    { level: 4, question: "1/4 va 3/4 kasrlaridan qaysi biri katta?", options: ["3/4", "1/4", "Teng", "Aniqlab bo'lmaydi"], answer: "3/4" },
    { level: 5, question: "2/9 + 4/9 = ?", options: ["6/9", "6/18", "2/9", "8/9"], answer: "6/9" },
    { level: 6, question: "7/10 - 3/10 = ?", options: ["4/10", "4/20", "10/10", "3/10"], answer: "4/10" },
    { level: 7, question: "17/5 kasrini aralash son ko'rinishida yozing.", options: ["3 va 2/5", "3 va 1/5", "2 va 3/5", "5 va 2/3"], answer: "3 va 2/5" },
    { level: 8, question: "2 va 1/3 aralash sonini noto'g'ri kasrga o'tkazing.", options: ["7/3", "6/3", "5/3", "8/3"], answer: "7/3" },
    { level: 9, question: "2 va 1/4 + 1 va 2/4 = ?", options: ["3 va 3/4", "3 va 1/4", "4", "3 va 2/4"], answer: "3 va 3/4" },
    { level: 10, question: "Matoning 3/8 qismi qizil, qolgani ko'k rangda bo'yalgan. Matoning necha qismi ko'k rangda?", options: ["5/8", "3/8", "1/8", "8/8"], answer: "5/8" }
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
