# 5-sinf Matematika — ma'ruzalar rejasi

Ichki hujjat (saytga chiqmaydi, `_reja/` papkasi git'ga qo'shilmaydi).
Manba (faqat o'zimiz uchun): darslik 1-qism (D1), 2-qism (D2), mashq daftari 1-qism (M1), 2-qism (M2).
PDF bet = kitob beti + 4 (darsliklarda).

---

## A. Umumiy qoidalar (har bir mavzuga)

### A1. Mazmun
- **Qoidalar aniq bo'lsin.** Har bir qoida kitobdagi kabi to'liq: qachon ishlaydi, nima qilinadi, nima hosil bo'ladi. Atamalar darslikdagidek (surat, maxraj, teng kuchli kasr, aralash son, xona birligi, kuboid, cm, ℓ ...). Mujmal so'z ("odatda", "ko'pincha") ishlatilmaydi.
- **Kitobda qoida "qonuniyatni toping" savoli bilan berilgan bo'lsa** (masalan, ×10), biz uni aniq qoida qilib yozamiz va darhol namuna beramiz.
- **Hech bir qoida tushib qolmaydi.** Har mavzu uchun quyida "Qoidalar ro'yxati" bor — ma'ruza tayyor bo'lgach, har bandga ✅ qo'yiladi.
- **Misollar chetda qolmaydi.** Darslik va mashq daftaridagi har bir misol turi ma'ruzada bo'ladi (sonlari va vaziyati boshqa). Har mavzuda "Misol turlari" (darslik) va "Mashq daftaridan" (faqat daftarda bor turlar) ro'yxati bor.
- **"Matematika kundaligi" va "Muammoli topshiriq"** (mashq daftari) — ma'ruzada "O'ylab ko'ring" / "Xatoni toping" bloki bo'lib kiradi.
- **Takrorlash bo'limlari** (M1 101–114, 204–216; M2 97–114, 183–200) — bob oxiridagi mavzu ma'ruzasiga "Takrorlash" mashqlari sifatida taqsimlanadi.
- **Kitobdagi xatolar ko'chirilmaydi** (topilganlari pastda ⚠ bilan belgilangan).

### A2. Mualliflik huquqi
- Qoida va tushuntirishlar o'z so'zimiz bilan (mazmuni va atamalari o'zgarmaydi).
- Namuna va mashqlar — o'z sonlarimiz, o'z vaziyatlarimiz (ismlar, buyumlar).
- Rasmlar — o'zimiz chizgan SVG. Kitob qahramonlari, belgilari, sahifa ko'rinishi ishlatilmaydi.
- Saytda "kitob, falon bet" yozilmaydi. Bezak — sayt uslubi.

### A3. Texnik andoza (bir marta yasaladi, hamma mavzu shundan foydalanadi)
- `maruza/maruza.css` — umumiy uslub: Qoida, Namuna, Diqqat (tipik xato), Eslab olaylik, Mashq, Matnli masala, Qiyin masala, O'zingizni tekshiring qutilari.
- `maruza/maruza.js` — KaTeX (formula, kasr, daraja, cm², cm³, ≈, ⊥), "Javobni ko'rish", iframe balandligi.
- `maruza/chizma.js` — rasm yasovchi: doira/pitsa bo'laklari, tasma (bar model), son o'qi, katakli shakl, xona jadvali, burchak usulida bo'lish, ×k strelka sxemasi, izometrik kub/kuboid, burchak va uchburchak chizmasi, ustunli diagramma.
- Formulalar faqat KaTeX bilan: $\frac{3}{5}$, $2\frac{1}{4}$, $5^2$, $V = a \cdot b \cdot c$.
- Rasm sifati: hammasi vektor (SVG) — telefonda ham, kattalashtirganda ham tiniq. Rastr rasm kerak bo'lsa — 2× o'lcham, WebP.

### A4. Har bir ma'ruza tuzilishi
1. **Eslab olaylik** — oldingi bilim (kitobdagi "Eslang").
2. **Qoidalar** — rangli ramkada, har biridan keyin darhol namuna.
3. **Rasmli tushuntirish** — chizma bilan.
4. **Namunalar** — qadamma-qadam yechim, kerak bo'lsa 2–3 usul.
5. **Diqqat!** — tipik xatolar.
6. **Mashqlar** — Oson / O'rta / Qiyin, javobi ochiladi.
7. **Matnli masalalar** — chizmali model bilan.
8. **Qiyin masala** — kitobdagi "O'ylab ko'ring" turida.
9. **O'zingizni tekshiring** — "Men ... bilaman" ro'yxati.

### A5. Tekshiruv (har mavzu, 3 rol + texnik)
- **Matematika eksperti:** har qoida to'g'ri va to'liq; "Qoidalar ro'yxati" bilan solishtirish; barcha javoblar skript bilan hisoblab tekshiriladi; atamalar va birliklar.
- **Matematika ustozi (metodist):** oddiydan murakkabga; har qoidadan keyin namuna; darslik + mashq daftaridagi har misol turi bor; tipik xatolar ko'rsatilgan; 5-sinf tilida.
- **O'quvchi:** telefonda boshidan oxirigacha o'qib, har namunani tushunadimi; javob tugmalari ishlaydimi; rasm va kasrlar aniq ko'rinadimi.
- **Texnik:** sintaksis tekshiruvi, kompyuter + telefon skrinshot, gorizontal surilish yo'q, xato yo'q.
- Natija shu faylga yoziladi: mavzu yonida ✅ / kamchiliklar.

### A6. Ish tartibi
- Mavzuma-mavzu. Har mavzu: tayyorlash → 3 rol tekshiruvi → sizga ko'rsatish → "push qil".
- Bob tugagach — tanaffus, keyingi bob.
- Tayyor ma'ruzaga ko'k nuqta avtomatik chiqadi.
- Har mavzuda "Simulyator uchun g'oyalar" yig'ib boriladi (keyingi bosqich uchun).

### A7. Hal qilish kerak bo'lgan savollar
- Birliklar: darslikda **cm, m, ℓ, ml** (lotin). Saytdagi simulyatorlarda "sm" ham uchraydi. Ma'ruzalarda darslikdagidek **cm** yozishni taklif qilaman.
- 19.1/19.2: darslikda "kuboid" atamasi. Ma'ruzada "kuboid (to'g'ri burchakli parallelepiped)" deb ikkalasini berish.
- 6-mavzu ma'ruzasi hozir kitob nusxasi — yangi andozada birinchi bo'lib qayta qilinadi.

---

## B. Mavzuma-mavzu reja

Belgilar: ☐ — qilinmagan, ✅ — tayyor va tekshirilgan.

### 1-bob. Natural sonlar

#### ✅ 1. Ko'p xonali sonlar (10 milliongacha) — D1 2–12, M1 1–18
**Holat (2026-10-17):** tayyor, push qilindi (e60947f). Fayl: maruza/5-kop-xonali-sonlar.html. Test izohlari (`natural-sonlar`) — hali yo'q.
**Kitob bilan solishtirildi:** D1 2–12 va M1 1–18 band-band — 7 qoida (million, xona/sinf, o'qish-yozish, yoyish 2 xil, taqqoslash, yaxlitlash, ketma-ketlik) ✅; darslik turlari (tugmalar, raqam/so'z bilan, tushirib qoldirilgan, kartochka o'yini, jadval savollari, "qancha ko'p") ✅; daftar turlari (son o'qi harflar, eng yaqin son, toq/juft kartalar, kalkulyator, to'lov summasi so'z bilan, shakllar ketma-ketligi) ✅. Tushirildi: "internetdan xabar topish" (kundalik — saytga mos emas), shakllarda kesmalar soni (faqat nuqtalar).
**Tekshiruv:** javoblar dastur bilan (yaxlitlash, kartalar — barcha o'rin almashtirishlar, tartiblar) — xato 0; telefon/kompyuter — sig'adi, xato yo'q. Yangi chizmalar: data-xona, data-tugma, data-oq.
**Simulyator uchun g'oyalar:** tugmalarni sudrab son yasash; son o'qida nuqtani sudrab yaxlitlash; kartochkalardan son tuzish o'yini.
**Qoidalar ro'yxati:**
- Xonalar: birlar, o'nlar, yuzlar, minglar, o'n minglar, yuz minglar, millionlar. Sinflar: birlar sinfi, minglar sinfi, millionlar sinfi.
- Raqamning qiymati u turgan xonaga bog'liq (53 462 da 5 — o'n minglar xonasida, qiymati 50 000).
- 10 ta o'n ming = 100 000; 10 ta yuz ming = 1000 ta ming = 1 000 000 (1 million); 10 million = 10 000 000.
- Sonni xona qo'shiluvchilariga yoyish: 704 835 = 700 000 + 4000 + 800 + 30 + 5 = (7·100 000) + (4·1000) + (8·100) + (3·10) + (5·1); sinflar bo'yicha: 704 000 + 835.
- Ko'p xonali sonni o'qish/yozish: sinflar bo'yicha, o'ngdan 3 tadan ajratib yoziladi (3 594 627); yo'q xona o'rniga 0.
- Sonlarni taqqoslash: xonalar soni ko'p bo'lgan son katta; teng bo'lsa — chapdan xonama-xona. O'sish/kamayish tartibi.
- Yaxlitlash (o'nliklar, yuzliklar, minglar, ... gacha): keyingi raqam 5 va undan katta bo'lsa — oshadi, kichik bo'lsa — o'zgarmaydi. "Taqriban" (≈).
- Sonli ketma-ketlik qonuniyati (har safar +/− bir xil son).
**Misol turlari:** raqam bilan yozish; so'z bilan yozish; tushirib qoldirilgan qo'shiluvchi (491 862 = □ + 862); xona va qiymatni aniqlash; tartiblash; yaxlitlash jadvali; ketma-ketlik; hayotiy jadval (aholi soni) bo'yicha savollar; 7 ta kartochkadan son tuzish.
**Mashq daftaridan (qo'shimcha):** yoyilmadan son tuzish (400 000 + 625); raqam kartalaridan eng katta juft / eng kichik toq son, 800 000 ga / 1 000 000 ga / 5 000 000 ga eng yaqin son; son o'qida harflarga mos son; to'lov kvitansiyasidagi summani so'z bilan yozish; jadval (sayyohlar, 1 m² narxi — "qimmatroq/arzonroq/yaqin"); kalkulyatorda bir xonani 0 ga aylantirish (ayirma 6, 20 000, 700); nuqta-kesma shakllar ketma-ketligi (8-shakl, 21 nuqta).
**Rasmlar:** xona jadvali (rangli ustunlar), sonli tugmalar (xona kartochkalari), son o'qi.
**Qiyin masala:** jadvaldan "qaysi biri 5 millionga yaqin / 1 milliondan kam".

### 2-bob. Sonlar ustida to'rt amal

#### ✅ 2. Sonni 10, 100, 1000 ga ko'paytirish va bo'lish — D1 14–18, 21–25; M1 19–20, 25–26
**Holat (2026-10-17):** tayyor, push qilindi (e60947f). Fayl: maruza/5-10-100-1000-kopaytirish-bolish.html. Test izohlari (`turt-amal`, 2–4-mavzularga umumiy) — hali yo'q.
**Kitob bilan solishtirildi:** 5 qoida (×10; ×100/×1000 = 10 ga ketma-ket; :10/:100/:1000 faqat oxiridagi nollar; tekshirish; «marta ko'p/kam») ✅; darslik turlari (ko'paytiring/bo'ling, o'rin almashtirish, tushirib qoldirilgan, bosqichma-bosqich :10:10:10, turmushda «3 marta ko'p», «1000 marta ko'p») ✅ — «3 marta ko'p» ikkinchi tekshiruvda qo'shildi; daftar turlari (jadval ×10/×100/×1000, «10 marta ko'p» to'g'ri va teskari) ✅. Sonli tugmalar o'rniga raqamlar surilishi xona jadvalida (data-siljish).
**Tekshiruv:** javoblar dastur bilan — xato 0; 360/390/1100 px — sig'adi, xato yo'q.
**Simulyator uchun g'oyalar:** raqamlar surilishini animatsiya qilish (×10 bosilganda chapga siljiydi).
**Qoidalar ro'yxati:**
- Natural sonni 10 / 100 / 1000 ga ko'paytirish uchun uning o'ng tomoniga mos ravishda 1 / 2 / 3 ta nol yoziladi (100 = 10·10, 1000 = 10·10·10).
- Oxiri kamida 1 / 2 / 3 ta nol bilan tugagan sonni 10 / 100 / 1000 ga bo'lish uchun uning oxiridan mos ravishda 1 / 2 / 3 ta nol olib tashlanadi.
- Bo'lishni ko'paytirish bilan tekshirish: 2340 : 10 = 234, chunki 234·10 = 2340.
- O'rin almashtirish: 10·1243 = 1243·10.
**Misol turlari:** ko'paytiring/bo'ling; tushirib qoldirilgan son (648·□ = 6480, □:100 = 12); "marta ko'p" hayotiy masalalar (pul, stadion).
**Mashq daftaridan (qo'shimcha):** jadval (×10, ×100, ×1000 bir qatorda); "10 marta ko'p" teskari masala (Salim 63 500 — Vohid ?); ikki shahar aholisi.
**Rasmlar:** xona jadvalida raqamlar chapga/o'ngga suriladi (strelka).

#### ✅ 3. Sonni o'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish — D1 19–20, 26–28; M1 21–24, 27–30
**Holat (2026-10-17):** tayyor va push qilindi. Fayl: maruza/5-onlik-yuzlik-minglik-kopaytirish-bolish.html. O'z testi: `5|matematika|onlik-yuzlik-minglik-kopaytirish-bolish` (10 savol, izohli), data.js test havolasi shunga o'tkazildi.
**Kitob bilan solishtirildi:** 7 qoida (yaxlit son = bir xonali × 10/100/1000; ko'paytirish 2 qadam + qulay tartib + yaxlit son birinchi; bo'lish 2 qadam + qulay tartib; teng nollarni tashlash; bo'lishni tekshirish; chamalash ≈ va «maqbul javob»; jadval qonuniyati ×/:) ✅ — kitobdan 3 ta band qo'shildi (tekshirish, 3000×53 turi, jadval qonuniyati). Darslik turlari (qulay usulda ×/: o'nlik, yuzlik, minglikka; chamalash; jadval) ✅; daftar turlari (qulay usul + kalkulyator, ko'paytmasi teng ifodalar, bo'linmasi teng ifodalar) ✅.
**Tekshiruv:** ekspert — 76 tenglik skript bilan tekshirildi (xato 0), barcha mashq javoblari Python bilan; ustoz — har qoidadan keyin namuna, tipik xatolar 5 ta, oson/o'rta/qiyin; o'quvchi — telefon 390 px: zanjir, nollar, jadvallar ✅ (tuzatildi: ifodalar guruhi bir ustunga); texnik — node --check, xato yo'q, gorizontal surilish yo'q. Yangi chizmalar: data-zanjir, data-nollar (chizma.js).
**Simulyator uchun g'oyalar:** zanjir rejimi (son → ×bir xonali → ×10/100/1000, qadamlar o'rnini almashtirish); nollarni chizib tashlash o'yini (teng miqdorda!); chamalash o'yini — 3 javobdan maqbulini tanlash.
**Qoidalar ro'yxati:**
- 20, 300, 4000 kabi sonlar: 60 = 6·10, 400 = 4·100. Ko'paytirish: avval bir xonali songa, keyin 10/100/1000 ga (43·20 = 43·2·10 = 860).
- Bo'lish: avval 10/100/1000 ga, keyin bir xonali songa (540 : 60 = 540 : 10 : 6 = 9).
- Bo'linuvchi va bo'luvchi oxiridagi teng sondagi nollarni tashlash mumkin: 63 000 : 700 = 630 : 7.
- Javobni chamalab tekshirish: sonlarni yaxlitlab hisoblash (68·400 ≈ 70·400 = 28 000), "maqbul javob".
**Misol turlari:** qulay usulda ko'paytirish/bo'lish; chamalab tekshirish; jadval qonuniyati (×4, ×40, ×400, ×4000; :2, :20, :200, :2000).
**Mashq daftaridan (qo'shimcha):** ko'paytmasi teng ifodalarni topish (100 × 30 = 3 × 1000 ...); bo'linmasi teng ifodalarni topish (250 : 10 : 5 = 250 : 50 ...); avval qulay holatga keltirib, kalkulyator bilan tekshirish.
**Rasmlar:** ×10 strelkali zanjir; jadval.

#### ✅ 4. Amallarni bajarish tartibi (qavssiz va qavsli) + matnli masalalar — D1 29–44; M1 31–54
**Holat (2026-10-17):** tayyor va push qilindi. Fayl: maruza/5-amallar-tartibi.html. O'z testi: `5|matematika|amallar-tartibi` (10 savol, izohli).
**Kitob bilan solishtirildi:** 6 qoida (+/− chapdan o'ngga; ·/: chapdan o'ngga; qavssiz aralash; qavsli; kalkulyator; matnli masala bosqichlari + yosh farqi o'zgarmaydi) ✅. Kalkulyator qoidasi aniqlashtirildi: oddiy kalkulyatorlar tugma tartibida hisoblashi mumkin. Darslik turlari (qiymat, birinchi amal, tartib jadvali, belgi qo'yish, qavs qo'yish, narx/bo'lib to'lash/qopcha/yosh/«dastlab qancha»/perimetr/jadvalli masala) ✅; daftar turlari (4 yechimdan to'g'risini tanlash, oylik sarf, bo'lib to'lash, sovg'a taqsimlash, stakan va qoldiq, zallarni tenglash, qoldiq, narx tengligi, 3 bola puli, yoshlar yig'indisi, nabira 5 marta, markalar, ko'ylak/shim, quti+meva, stikerlar, ketma-ket kunlar, likopcha/olma, qulay yig'indi, tangalar, buzuq kalkulyator, ifoda tuzish) ✅; qiyin (ketma-ket sonlar, turnir, viktorina) ✅.
**Tekshiruv:** ekspert — 109 tenglik skript bilan (xato 0; 13 tasi atayin xato/qavs topshiriq/qoldiq), 40+ mashq va 30+ masala javobi Python bilan; «olmalar» shartiga «likopchalar bir xil» qo'shildi (aks holda 2 ham javob). 14 ta data-tartib natijasi va tartib raqamlari Python bilan solishtirildi ✅. O'quvchi — telefon 390 px: tuzatildi — tasma yozuvlari kattalashtirildi, «Diqqat» qatorlari telefonda bo'linadi. Texnik — node --check, xato yo'q, surilish yo'q. Yangi chizmalar: data-tartib, data-tasma.
**Simulyator uchun g'oyalar:** amallar ustiga tartib raqamini o'quvchi o'zi qo'yadi (chizma.js qadam() generatori tayyor); chizmali model quruvchi (bo'laklarni sudrab, farqni belgilash); «belgi qo'ying» o'yini.
**Qoidalar ro'yxati:**
- Faqat + va − bo'lsa: chapdan o'ngga ketma-ket.
- Faqat × va : bo'lsa: chapdan o'ngga ketma-ket.
- Qavssiz aralash ifoda: avval × va : (chapdan o'ngga), keyin + va − (chapdan o'ngga).
- Qavsli ifoda: avval qavs ichi, keyin × va :, keyin + va − (har biri chapdan o'ngga).
- Masalani bir nechta amal bilan ketma-ket yoki bitta ifoda bilan yechish (1-usul / 2-usul).
- Kalkulyator ham shu tartibda hisoblaydi.
- Matnli masala: chizmali model (bo'laklar); yosh farqi yillar o'tsa ham o'zgarmaydi; javobni chamalab tekshirish.
**Misol turlari:** qiymatni toping; birinchi amal tagiga chizish; amallar tartibi jadvali; tenglik to'g'ri bo'lishi uchun +, −, ×, : qo'yish; qavs qo'yish; ko'p bosqichli matnli masalalar (narx, bo'lib to'lash, qopchalar, yosh, "dastlab qancha pul bo'lgan"); perimetr bo'yicha en topish; jadvalli masala (chipta narxi).
**Mashq daftaridan (qo'shimcha):** to'g'ri yechimni 4 tadan tanlash (xato tartiblar ko'rsatilgan); 3 bosqichli matnli masalalar: oylik sarf, bo'lib to'lash, sovg'alarni taqsimlash, stakanlar va qoldiq, 2 zalni tenglash, loviya qoldig'i, narx tengligi (to'p ↔ poyabzal), 3 bola puli, yoshlar yig'indisi 65, nabira 5 marta, markalar sotilgach 4 marta, ko'ylak/shim narxi, quti + meva, stikerlar, ketma-ket kunlar (+2 soat, jami 40), "3 tadan qo'ysa 4 ortadi, 5 tadan qo'ysa 2 yetmaydi", 2 + 4 + ... + 70 yig'indisi, 200/500 so'mlik tangalar; kalkulyatorda 9 tugmasi ishlamasa 99 × 784.
**Qiyin masala:** ketma-ket 4 sonning yig'indisi 250; 10 tennischi necha o'yin; 20 savol, +8/−2 ball.
**Rasmlar:** amallar ustiga 1, 2, 3 raqamlar; chizmali model (bar model).

### 3-bob. Oddiy kasrlar

#### ✅ 5. Bo'lishni kasr ko'rinishida ifodalash — D1 46–51; M1 55–58
**Holat (2026-10-17):** tayyor va push qilindi. Fayl: maruza/5-bolishni-kasr-korinishida.html. O'z testi: `5|matematika|bolishni-kasr-korinishida` (10 savol, izohli).
**Kitob bilan solishtirildi:** 6 qoida (a : b = a/b; bir nechta butunni bo'lish — har butundan 1/b; qisqartirish; noto'g'ri kasr → aralash son: bo'linma/qoldiq/bo'luvchi; teskari a/b = a : b; bo'linma butun bo'lishi mumkin va o'rin almashtirish) ✅ — kitobdan 2 band qo'shildi (teskari yo'nalish, 12 m : 3 va 3 m : 12 juftligi). Darslik turlari (pitsa/tort/quymoq tarqatish, tasma, kasr ko'rinishida yozish + qisqartirish, aralash son) ✅; daftar turlari (bolalarga taqsimlash, aralash son, kasrni bo'linma ko'rinishida, shakar/arqon/suv masalalari, «necha marta uzun», 2 l × 3 quti → stakanlar) ✅.
**Tekshiruv:** ekspert — 39 tenglik skript bilan (kasrlar bilan; xato 0, 3 tasi atayin xato), barcha mashq/masala javoblari qo'lda va Python bilan; o'quvchi — telefon 390 px: pitsalar, ranglar, kasrlar ✅ («Diqqat»dagi kasrlar KaTeX ga o'tkazildi); texnik — node --check, xato yo'q, surilish yo'q. Yangi chizma: data-pitsa (usul="butun" bilan).
**Simulyator uchun g'oyalar:** bolalar sonini va pitsalar sonini o'zgartirib, ulushni rangda ko'rish (chizma.js pitsa tayyor); «avval butunlari» rejimi qadamma-qadam; «kim ko'p oladi?» o'yini; kam kesish topshirig'i.
**Qoidalar ro'yxati:**
- a : b = a/b (bo'linuvchi — surat, bo'luvchi — maxraj). 1 : 3 = 1/3; 2 : 3 = 2/3.
- Javobni qisqartirish: 2 : 4 = 2/4 = 1/2.
- Bo'linuvchi bo'luvchidan katta bo'lsa — noto'g'ri kasr, uni aralash songa aylantirish: 5 : 4 = 5/4 = 1 1/4.
- Har bir butun teng bo'laklarga bo'linadi; har bir bola har bir butundan 1/b qism oladi.
**Misol turlari:** pitsa/tort/quymoqni bolalarga tarqatish; tasma/arqonni teng bo'lish (6 m : 10 = 3/5 m); bo'lishni kasr ko'rinishida yozish; aralash son ko'rinishida yozish (7 : 4, 23 : 6).
**Mashq daftaridan (qo'shimcha):** kasrni natural sonlar bo'linmasi ko'rinishida yozish (5/6 = 5 : 6); "necha marta uzun" javobi aralash son (14 : 4); 3 quti × 2 ℓ sutni 15 stakanga.
**Rasmlar:** pitsalar va bo'laklar, tasma.

#### ✅ 6. Oddiy kasrni o'nli kasrga aylantirish — D1 52–55; M1 59–62
**Holat (2026-10-16):** yangi andozada qayta yasaldi, personajlar qo'shildi, push qilindi (e504d32). Test izohlari (`oddiy-kasrlar`, 5–11-mavzularga umumiy) ✅ 2026-10-17 (dc991dd).
**Tekshiruv:** ekspert — 6 qoida bandi ✅, barcha javoblar Fraction/Decimal bilan tekshirildi (xato 0), burchak usuli generatori 11 000+ misolda tekshirildi; ustoz — har qoidadan keyin namuna, darslik va daftar turlari bor, tipik xatolar 5 ta; o'quvchi — telefon 390 px: jadval, kasrlar, javob tugmalari ✅ (tuzatildi: mayda kasrlar, keng jadval, "Diqqat"dagi bo'linish); texnik — node --check, xato yo'q, gorizontal surilish yo'q, iframe balandligi to'g'ri.
**Simulyator uchun g'oyalar:** 1-usulda "nechaga ko'paytiramiz" jadvalidan tanlash; burchak usulida qadamma-qadam (generator tayyor: maruza/chizma.js bolish()); "tugaydimi?" o'yini (maxrajni 2 va 5 ga ajratish); yaxlitlash bosqichi.
**Qoidalar ro'yxati:**
- 1-usul: maxraji 10, 100 yoki 1000 bo'lgan teng kuchli kasrga keltirish (surat va maxraj bir xil songa ko'paytiriladi), keyin o'nli kasr qilib yozish.
- 2-usul: suratni maxrajga burchak usulida bo'lish.
- 3-usul (noto'g'ri kasr): butun qismini ajratish, keyin kasr qismini o'nli kasrga aylantirish (9/4 = 2 1/4 = 2,25).
- Maxrajda faqat 2 va 5 ko'paytuvchilari bo'lsa — bo'lish tugaydi; maxrajda 3, 7, ... bo'lsa — tugamaydi, javob yaxlitlanadi (o'ndan / yuzdan birlargacha).
- Qonuniyat: n/11 = 0,(9n) takrorlanadi.
**Misol turlari:** aylantiring (4/5, 6/125); yaxlitlab aylantiring (7/3, 13/7); hayotiy (3 ℓ sharbat 4 stakanga, 10 kg 8 idishga).
**Mashq daftaridan (qo'shimcha):** aralash son → o'nli kasr (5 8/11); qiyin yaxlitlash (211/23, 42/17); quvur, mix narxi, sim (yuzdan birgacha); kasrli miqdorlarni qo'shib o'nli kasrda yozish; 2 ℓ − 3/4 ℓ.
**Rasmlar:** ×k strelkali sxema, burchak usulida bo'lish, 100 katakli kvadrat.

#### ✅ 7. Aralash sonlarni qo'shish va ayirish (+ Eslang: kasrlarni qo'shish va ayirish) — D1 56–63; M1 63–70
**Holat (2026-10-17):** tayyor va push qilindi. Fayl: maruza/5-aralash-sonlarni-qoshish-ayirish.html. O'z testi: `5|matematika|aralash-sonlarni-qoshish-ayirish` (10 savol, izohli).
**Kitob bilan solishtirildi:** Eslang (teng va har xil maxraj, EKUK, noto'g'ri javob → aralash, butundan ayirish) + 8 qoida (qo'shish; kasr qismdan butun ajratish; butun son qo'shish; ayirish; kasr yetmasa butunni maydalash; butundan aralash; chamalash; 2-usul noto'g'ri kasr orqali) ✅ — kitobdan 2 band qo'shildi. Darslik turlari (qo'shing/ayiring, «ayirmani qo'shing», masofa a/b, mato 2 amal, tarvuz-handalak, kasrli doira) ✅; daftar turlari (Eslang mashqlari, butun − kasr, idish sig'imi, guruch, «kam masofa», arqon, bo'y, mato qoldig'i, ikkalasi birga, ishlatdi+quydi, 3 bosqichli sim, 3 xil mato) ✅.
**Tekshiruv:** ekspert — 44 tenglik skript bilan (xato 0; 7 tasi atayin xato/□/skript artefakti), barcha javoblar Fraction bilan oldindan hisoblangan; tarvuz-qovun tasmasi olib tashlandi (bo'laklar massaga mos emas edi). O'quvchi — telefon 390 px ✅ (tuzatildi: data-doira noto'g'ri kasr qismni ko'rsatmasdi — 2 5/4). Texnik — node --check, 7 ta ma'ruza regressiya tekshiruvi xatosiz. Yangi chizma: data-doira.
**Simulyator uchun g'oyalar:** kasrli doiralarni sudrab qo'shish va 6 ta bo'lakni butunga «yig'ish»; ayirishda butunni maydalash animatsiyasi; chamalash o'yini.
**Qoidalar ro'yxati:**
- Eslang: har xil maxrajli kasrlarni qo'shish/ayirish — maxrajlarning eng kichik umumiy karralisiga keltiriladi.
- Aralash sonlarni qo'shish: kasr qismlarni umumiy maxrajga keltirish → butunlarni qo'shish, kasrlarni qo'shish → kasr qism noto'g'ri bo'lsa, butunga aylantirish (2 17/12 = 3 5/12).
- Ayirish: kasr qism yetmasa, bitta butunni kasrga aylantirish (3 1/6 = 2 7/6).
- Butun sondan aralash sonni ayirish (4 − 1 3/8 = 3 8/8 − 1 3/8).
- Javobni chamalash (3 2/5 + 2 ≈ 5).
- 2-usul: noto'g'ri kasrga aylantirib hisoblash.
**Misol turlari:** qo'shing / ayiring; "ayirmani qo'shing" (aralash ifoda); masofa, mato, massa masalalari (chizmali model bilan); "qancha qoldi" (1 − 2/5 − 3/10).
**Mashq daftaridan (qo'shimcha):** Eslang: to'g'ri kasrlarni qo'shish/ayirish (butun − kasr: 4 − 1/3); aralash son + butun son, butun − aralash; idish sig'imi (bor + kerak); 3 bosqichli: ko'k sim − qizil − qora; 3 xil mato yig'indisi; ishlatdi + quydi.
**Rasmlar:** kasrli doira bo'laklari, tasma.

#### ✅ 8. Kasrni natural songa ko'paytirish (to'g'ri va noto'g'ri) (+ Eslang: to'plamning qismi) — D1 64–69; M1 71–78
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-kasrni-natural-songa-kopaytirish.html. O'z testi: `5|matematika|kasrni-natural-songa-kopaytirish` (10 savol, izohli).
**Kitob bilan solishtirildi:** 7 qoida (Eslang: qism va qismiga ko'ra butun; «n ning a/b qismi» = ko'paytirish; surat × son, maxraj o'zgarmaydi; oldin qisqartirish; javob → aralash son; noto'g'ri kasr × son; qolgan qism) ✅ — «qolgan qism» alohida qoida ramkasi bo'ldi. Darslik turlari (sharlar, tomoshabinlar → sport zali, tugmalar, «o'g'il bolalar nechta» qolgan qism, kvadrat perimetri, stakanlardagi suyuqlik, oqib ketgan suv) ✅; daftar turlari (doirachalar guruhlari rasmdan, qismiga ko'ra butun — namuna va mashq, javob-harf o'yini «KITOB», qayta ishlanadigan chiqindi, 1/2 + 1/3 + qolgan qism — shirinliklar namuna va masala) ✅. Kitob sonlari (12 ning 3/4, 2/5·12, 3/2·2, 1/4·5, 10·3/5, 150·2/3, 150·1/3, 4·7/3, 9·3/5, tasma 2/5 = 6 m, 2/7·3) va kitob ismlari/vaziyatlari (Kamola, marka, konsert) o'z sonlarimiz va vaziyatlarimizga almashtirildi.
**Tekshiruv:** ekspert — 66 tenglik skript bilan (xato 3 — hammasi atayin xato: Diqqat va «Xatoni toping»), test javoblari Fraction bilan; kitob juftlari skript bilan qidirildi — 0. O'quvchi — telefon 390 px va 1100 px: surilish yo'q, KaTeX ✅, xato yo'q. Matnli masalalar 13 tadan 10 taga qisqartirildi. Yangi: data-qism ga data-izoh="0" (rasmli mashqda hisob yashiriladi).
**Simulyator uchun g'oyalar:** sharlarni guruhlarga sudrab ajratish va kerakli guruhlarni bo'yash; «avval qisqartir» tugmasi bilan qisqartirish animatsiyasi; doira bo'laklarini yig'ib aralash son hosil qilish; javob-harf o'yini.
**Qoidalar ro'yxati:**
- Eslang: sonning qismini topish (12 ning 3/4 qismi: 12 : 4 · 3); qismiga ko'ra butunni topish (2/5 qismi 6 m → butun 15 m).
- "n ning a/b qismi" = n · a/b.
- Kasrni natural songa ko'paytirish: surati shu songa ko'paytiriladi, maxraji o'zgarmaydi (a/b · n = a·n / b).
- Ko'paytirishdan oldin qisqartirish (10 · 3/5 = 2 · 3).
- Natija noto'g'ri kasr bo'lsa — aralash son ko'rinishida yozish.
- Noto'g'ri kasrni natural songa ko'paytirish — xuddi shunday (4 · 7/3 = 28/3 = 9 1/3).
- Qolgan qism: 1 − 2/3 = 1/3 (bolalar soni).
**Misol turlari:** to'plamning qismi (sharlar, tomoshabinlar, tugmalar); "katta yoshlilar nechta" (qolgan qism); kvadrat perimetri (tomoni 5/8 m); stakanlardagi suv; idishdan oqib ketgan suv.
**Mashq daftaridan (qo'shimcha):** Eslang: doirachalarni guruhlarga ajratib qismni topish; qismiga ko'ra butunni topish (4/7 qismi 32 ta → jami); javobga mos harflardan so'z tuzish (o'yin); qayta ishlanadigan chiqindi; 1/2 + 1/3 + qolgan qism (shirinliklar).
**Qo'shimcha qoida (ma'ruzada alohida):** qolgan qismni ikki usulda topish — butundan ayirish yoki butunni (1 − a/b) ga ko'paytirish.
**Rasmlar:** doirachalar guruhlari, tasma modeli.

#### ✅ 9. Kasrni kasrga ko'paytirish — D1 70–78; M1 79–84
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-kasrni-kasrga-kopaytirish.html. O'z testi: `5|matematika|kasrni-kasrga-kopaytirish` (10 savol, izohli).
**Kitob bilan solishtirildi:** 7 qoida (kasrning qismi = ko'paytirish; surat×surat, maxraj×maxraj; javobni qisqartirish; oldin/xochsimon qisqartirish; to'g'ri × noto'g'ri va noto'g'ri × noto'g'ri — javob aralash son; ko'paytma kattaligi: to'g'ri kasrga — kamayadi, 1 dan kattaga — ortadi, 1 ga tengga — o'zgarmaydi; ko'paytma 1 dan katta/kichik — to'plamlar) ✅ — 5- va 6-qoida alohida ramka qilindi. Darslik turlari (tort/qog'oz buklab shtrixlash, un, sharbat, uzum, kvadrat yuzi, jamg'arma, teatr — katta/bola/qiz/o'g'il, ikki usulda, tez hisoblash) ✅; daftar turlari (chizmada shtrixlash — mashq va javobda rasm, natural son × kasr — Eslang mashqi, qizil va dumaloq tugmalar, suzishni biladigan o'g'il bolalar, bir tomoni noto'g'ri kasr bo'lgan to'rtburchak yuzi 7/4 × 2/3 + amaliy bo'yash, ichimlik qoldig'i) ✅. Kitob sonlari (1/2·1/3, 1/3·2/3, 2/6·1/2, 1/2·4/5, 1/2·2/3, 3/4·1/3, 2/3·1/5, 2/5·2/3, 3/2·1/2, 2/3·3/4, 9/10·2/3, 3/4·8/7, 5/4·3/2, 6/4·8/3, p77 to'plamlari) va ismlar (Kamola, Akmal, Madina-qog'oz, Lobar opa, Zafar) almashtirildi; qisqartirishdan keyingi oraliq juftlar ham kitobnikiga to'g'ri kelmaydi.
**Tekshiruv:** ekspert — 68 tenglik skript bilan (xato 5 — atayin xato va □ topshiriq), test javoblari Fraction bilan; kitob juftlari skript bilan qidirildi — 0. O'quvchi — telefon 390 px va 1100 px: surilish yo'q, KaTeX ✅, yuza chizmalari (2 butunli 5/3 va 7/4 ham) o'qiladi. Yangi chizma: data-yuza (a > b bo'lsa bir nechta butun to'rtburchak).
**Simulyator uchun g'oyalar:** qog'ozni tikkasiga va yotig'iga «buklash» tugmalari, kataklarni sanab kasr hosil qilish; ko'paytuvchini 1 dan kichik/katta qilib surganda ko'paytma qanday o'zgarishini ko'rsatuvchi slayder; xochsimon qisqartirish o'yini.
**Qoidalar ro'yxati:**
- "a/b ning c/d qismi" = a/b · c/d.
- Ikki kasrni ko'paytirish: surat suratga, maxraj maxrajga ko'paytiriladi, natija qisqarmas ko'rinishga keltiriladi.
- 2-usul: ko'paytirishdan oldin qisqartirish (xochsimon ham).
- To'g'ri × noto'g'ri, noto'g'ri × noto'g'ri — xuddi shu qoida; natija aralash songa aylantiriladi.
- Ko'paytma kattaligi: to'g'ri kasrga ko'paytirsak — son kamayadi; 1 dan katta kasrga ko'paytirsak — ortadi (kalkulyatorli to'plamlar).
**Misol turlari:** pitsa/qog'oz bukish (to'g'ri to'rtburchakda shtrixlash); un, suv, uzum masalalari; kvadrat yuzi (4/5 m); "jamg'armaning qancha qismi"; kinoteatr (katta/bola/qiz/o'g'il); ikki usulda toping; tezlik o'yini.
**Mashq daftaridan (qo'shimcha):** ko'paytmani chizmada shtrixlab ko'rsatish (1/2 ning 2/3 qismi); natural son × kasr (10 · 2/3, 12 · 4/5); "qizil va dumaloq" tugmalar; suzishni biladigan o'g'il bolalar ulushi; to'g'ri to'rtburchak yuzi (8/5 m × 3/4 m) — 1 m kvadratda 2/5 × 3/4 bo'yash (amaliy).
**Rasmlar:** to'g'ri to'rtburchakda ustma-ust bo'yash (eniga va bo'yiga).

#### ✅ 10. Aralash sonni natural songa ko'paytirish — D1 79–81; M1 85–88
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-aralash-sonni-natural-songa.html. O'z testi: `5|matematika|aralash-sonni-natural-songa` (10 savol, izohli).
**Kitob bilan solishtirildi:** 4 qoida (1-usul noto'g'ri kasr orqali; oldin qisqartirish; 2-usul qismlarga ajratib — kasr qismdan butun ajratish bilan; chamalash + o'rin almashtirish) ✅ — har biri alohida ramka va namuna. Darslik turlari (non bo'lish — doiralar, kvadrat perimetri, kunlik suv × kunlar, narx, yer maydoni yuzi, blok massasi, shishalar sig'imi, ikki usulda hisoblash) ✅; daftar turlari (doiralar bilan tekshirish — mashq, ko'paytmani javobi bilan juftlash, «2 marta og'ir» vazn, 3 kvadratdan to'g'ri to'rtburchak perimetri, ko'rpacha matosi, ko'p shishadagi sharbat) ✅. Kitob sonlari (1 1/2·3, 3 3/4·4, 7·2 5/8, 2 1/2·4, 5 1/3·6, 4 2/5·10, 3·4 2/9, 9·7 5/6, juftlik va «Bajaring» misollari, 60 000 · 3 1/2) va vaziyatlari (pirog, o'simliklarni sug'orish, Nodira) almashtirildi; kitob juftlari skript bilan qidirildi — 0.
**Tekshiruv:** ekspert — 55 tenglik skript bilan (6 «XATO» — 5 tasi atayin xato, 1 tasi □ topshiriq), barcha javoblar oldindan Fraction bilan; o'quvchi — telefon 390 px va 1100 px: surilish yo'q, KaTeX ✅, xato yo'q; tuzatildi — mashq sarlavhasidagi formula alohida qatorga chiqarildi.
**Simulyator uchun g'oyalar:** doiralarni ko'paytirib, bo'laklarni yig'ib butun hosil qilish; 1-usul / 2-usul tugmalari bilan bir misolni ikki yo'l bilan ko'rsatish; chamalash o'yini — javob qaysi oraliqda.
**Qoidalar ro'yxati:**
- 1-usul: aralash sonni noto'g'ri kasrga aylantirib, so'ng ko'paytirish (1 1/2 · 3 = 3/2 · 3 = 9/2 = 4 1/2).
- 2-usul: butun va kasr qismini alohida ko'paytirib, qo'shish (2 1/2 · 4 = 8 + 2 = 10).
- Ko'paytirishdan oldin qisqartirish (15/4 · 4 = 15).
- Chamalab tekshirish (2 5/8 · 7 — 14 va 21 orasida).
**Misol turlari:** pirog, kvadrat perimetri, sug'orish suvi (7 kun), g'isht massasi, idishlar sig'imi, yer maydoni yuzi (4 2/5 · 8), narx (3 1/2 kg · 60 000).
**Mashq daftaridan (qo'shimcha):** rasm yordamida tekshirish (1 1/2 · 2); ko'paytmani javobi bilan tutashtirish; otaning vazni (2 marta); 3 kvadratdan tuzilgan to'g'ri to'rtburchak perimetri; ko'rpacha matosi; 25 shisha × 1 1/2 ℓ.
**Rasmlar:** doiralar qatori, kvadrat.

#### ✅ 11. Qolgan qismning qismi + matnli masalalar — D1 82–88; M1 89–100
**Kompyuterdagi tekshiruv (2026-10-18):** rejadagi «Qiyin masala» (suzishni biladiganlar) yo'q edi — «O'ylab ko'ring» ga o'z sonlarimiz bilan qo'shildi (35 o'quvchi, 3/7 qiz, 2/3 va 3/4).
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-qolgan-qismning-qismi.html. O'z testi: `5|matematika|qolgan-qismning-qismi` (10 savol, izohli).
**Kitob bilan solishtirildi:** 6 qoida (qolgan qism; qolganning qismi = (1 − a/b)·c/d; miqdorga aylantirish — 2 usulda; qismiga ko'ra butun; chizma-model va bo'laklar farqi; «qismi» va «miqdor» farqi — daftardagi Matematika kundaligidan alohida qoida qilindi) ✅. Darslik turlari (tasma, pul sarflash, o'quvchilar — qiz/o'g'il/to'garak, bo'laklar farqi bilan jami — musobaqa, uch rangli munchoqlar, «marta ko'p» — lager, masofa velosiped/piyoda, kompot, qismiga ko'ra butun) ✅; daftar turlari (5 ta tasmali «qolganning qismi» — chizmali javob bilan, «1/6 qismi 15 bo'lgan sonning 2/3 qismi», aralash sonli tomorqa perimetri va yuzi, qolgan pulga ko'ra dastlabki pul — 2 ta, o'naqay/chapaqay farqi, ikki xil somsa qoldig'i, Kundalik «qismi va miqdor») ✅; qiyin masala (to'garak — o'g'il/qiz ulushlari) ✅. Kitob sonlari va vaziyatlari (1/6 sariq, 1/4 + 1/2, Jahongir, Sardor 60 000, 480 o'quvchi, konsert 147, 1701, tugmalar 144, p87 masalalari, 40 o'quvchi suzish) almashtirildi.
**Tekshiruv:** ekspert — 89 tenglik skript bilan (1 «XATO» — atayin xato); barcha javoblar oldindan Fraction bilan, musobaqa masalasi yagona javobli ekani tekshirildi (N = 90); «qism = miqdor» yozuvlari «→» ga o'tkazildi. O'quvchi — telefon 390 px va 1100 px: surilish yo'q, KaTeX ✅, tasma chizmalari o'qiladi.
**Simulyator uchun g'oyalar:** tasmani bosqichma-bosqich bo'yash (avval qism, keyin qolganning qismi — bo'laklar o'zi maydalanadi); «farq = 18» kabi masalalarda bo'laklarni sudrab tenglashtirish; qolgan pulga ko'ra orqaga hisoblash o'yini.
**Qoidalar ro'yxati:**
- Qolgan qism = 1 − ishlatilgan qism.
- Qolgan qismning c/d qismi = (1 − a/b) · c/d (butunga nisbatan).
- Natijani miqdorga aylantirish: butun miqdorga ko'paytirish (2/5 · 60 000).
- "Qismiga ko'ra butunni topish" (18 000 — pulning 3/10 qismi → butun).
- Bo'laklar (birlik) usuli: chizmali modelda bo'laklar farqi (3 bo'lak − 1 bo'lak = 42).
**Misol turlari:** tasma; pul sarflash (yo'lkira, ovqat); o'quvchilar (qiz/o'g'il/ko'zoynak); konsert zali (ayollar/erkaklar/bolalar); tugmalar ranglari (Q, K, Y, O); masofa (yugurib/yurib); ichimlik.
**Mashq daftaridan (qo'shimcha):** chizmada "qolgan qism"ni belgilab, uning qismini topish (5 ta namuna); 1/5 qismi 24 bo'lgan sonning 1/4 qismi; yer maydoni (aralash sonlar bilan) perimetr va yuz; qolgan pulga ko'ra dastlabki pulni topish (telefon/sumka, 60 000 qoldi); o'naqay/chapaqay farqi 272; ikki tur somsa — har biridan qism berilgan, 60 ta qoldi; Rashid: shim + qolganining 4/7 qismi + 1/9 qism ortdi → dastlabki pul. Matematika kundaligi: "suvning 1/4 qismi" va "1/4 ℓ" farqi.
**Qiyin masala:** 40 o'quvchi, 2/5 qiz, suzishni biladiganlar.
**Rasmlar:** tasma — qolgan qism pastga tushib, yana bo'linadi.

### 4-bob. Uchburchakning yuzi

#### ✅ 12. Uchburchakning asosi va balandligi (+ Eslang: kvadrat va to'g'ri to'rtburchak) — D1 90–95; M1 115–118
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-uchburchak-asosi-balandligi.html. O'z testi: `5|matematika|uchburchak-asosi-balandligi` (10 savol, izohli), data.js da test havolasi qo'shildi.
**Kitob bilan solishtirildi:** Eslang (to'g'ri to'rtburchak bo'yi/eni, kvadrat, yuzlar, perpendikulyar ⊥) + 6 qoida (3 uch/3 tomon/3 burchak; asos — istalgan tomon, balandlik — qarshi uchdan perpendikulyar; uchta balandlik; to'g'ri burchakli — tomon bilan ustma-ust; o'tmas — asos davomiga; chizg'ich bilan aniqlash) ✅ — «uchta balandlik» va «chizg'ich bilan» alohida qoida qilindi. Darslik turlari (berilgan asosga balandlik, berilgan balandlikka asos, «VW balandlikmi?» 2 holat, chizg'ich bilan aniqlash, katakli qog'ozda 3 xil chizish) ✅; daftar turlari (bitta uchburchakda har uch asosga balandlik — jadval va mashq, balandlikka mos asos, Eslang: burchaklari to'g'ri murakkab shakl yuzi — namuna + 2 mashq) ✅. Kitob harflari va shakllari (ABC, DEF, WXY, EFG, PQR, KLM, STV, ACE) ishlatilmadi.
**Tekshiruv:** ekspert — 13 tenglik (xato 0), yuzlar va balandlik asoslari koordinatalar bilan hisoblangan (perpendikulyar asosi dastur bilan topiladi); o'quvchi — telefon 390 px va 1100 px: tuzatildi — tomon yozuvlari chetdan chiqib kesilardi (chet kengaytirildi), «asos» yozuvi balandlik belgisi ustiga tushardi (chetga surildi), botiq shakllarda yozuvlar ichkariga tushardi (tashqi tomon shakl yo'nalishidan topiladi). Texnik — 12 ta ma'ruza regressiya tekshiruvi xatosiz. Yangi chizma: data-geo.
**Simulyator uchun g'oyalar:** uchburchak uchini sudrash — balandlik o'zi qayta chiziladi, o'tmasga o'tganda asos davomi paydo bo'ladi; asosni bosib tanlash va unga balandlikni o'quvchi chizishi; «qaysi kesma balandlik?» o'yini.
**Qoidalar ro'yxati:**
- Eslang: to'g'ri to'rtburchak (bo'yi, eni), kvadrat; yuzi = bo'yi × eni, kvadrat yuzi = tomoni × tomoni; perpendikulyar (⊥) — to'g'ri burchak ostida kesishadi.
- Uchburchakning 3 ta tomoni, 3 ta burchagi, 3 ta uchi bor.
- Asos — istalgan tomon bo'lishi mumkin.
- Balandlik — asos qarshisidagi uchdan asosga (yoki uning davomiga) tushirilgan perpendikulyar kesma; balandlik ⊥ asos.
- To'g'ri burchakli uchburchakda balandlik yon tomon bilan ustma-ust tushadi; o'tmas burchakli uchburchakda tashqariga tushishi mumkin.
**Misol turlari:** berilgan asosga balandlikni toping; berilgan balandlikka asosni toping; "BD balandlikmi?"; to'g'ri burchakli chizg'ich bilan aniqlash; katakli qog'ozda chizish.
**Mashq daftaridan (qo'shimcha):** bitta uchburchakda har uch asosga mos balandlik (ACE: AC, CE, AE); balandlikka mos asos (STV); Eslang: murakkab to'g'ri burchakli shakl yuzi ("barcha kesmalar to'g'ri burchak ostida").
**Rasmlar:** uchburchaklar (o'tkir, to'g'ri, o'tmas), to'g'ri burchak belgisi.

#### ✅ 13. Uchburchakning yuzini topish — D1 96–102; M1 119–122
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-uchburchak-yuzi.html. O'z testi: `5|matematika|uchburchak-yuzi` (10 savol, izohli), data.js da test havolasi qo'shildi. data.js dagi `review: "sariq"` belgisiga tegilmadi.
**Kitob bilan solishtirildi:** 5 qoida (mos to'g'ri to'rtburchak: bo'yi — asos, eni — balandlik; yuz — yarmi, o'tkir/to'g'ri/o'tmas uchun alohida ko'rsatildi; S = ½·a·h va bir xil birlik; teng asos va balandlik — teng yuz, balandlik ortsa yuz ortadi; ortiqcha o'lchamlar) ✅ — «ortiqcha o'lchamlar» alohida qoida qilindi. Darslik turlari (katakli fonda yuz, formulaga qo'yish, ortiqcha o'lchamli chizmalar — 4 ta, jadval, yuzi 18 cm² bo'lgan 3 xil uchburchak, to'g'ri to'rtburchak ichidagi uchburchak) ✅; daftar turlari (katakli panjarada asos/balandlikni sanab yuz — 3 ta mashq, ortiqcha uchinchi tomon) ✅; qo'shimcha: noma'lum asos/balandlikni topish, «necha marta ortadi». Kitob sonlari (6×4→12, 4×4→8, 2×4→4, 4·3, 10·6, 7·16, 24·10, 8·6, 5-12-13, 14·6, 102-bet shakllari, 20 cm²) dastur bilan qidirildi — 0.
**Tekshiruv:** ekspert — 44 tenglik (xato 0), barcha yuzlar Fraction bilan, chizmalardagi tomon uzunliklari Pifagor bo'yicha butun (9-12-15, 7-24-25, 5-12-13 va 16-12-20, 6-8-10) — chizma o'lchamlarga mos. O'quvchi — telefon 390 px va 1100 px: tuzatildi — 5 ustunli jadval telefonga sig'masdi (4 ustunga qisqartirildi, jadvallar surib ko'riladigan qutida), balandlik yozuvi qo'shni tomon yozuvini bosardi (data-geo ga «MH-» — yozuvni narigi tomonga o'tkazish), namuna sarlavhasida a/h katta harfga aylanardi. Texnik — 13 ta ma'ruza regressiya tekshiruvi xatosiz. data-geo ga yangi: "ramka" (punktir mos to'rtburchak).
**Simulyator uchun g'oyalar:** uchburchakni mos to'rtburchak ichida «qirqib» bo'sh joylarga ko'chirish animatsiyasi; uchni parallel chiziq bo'ylab sudrab, yuz o'zgarmasligini ko'rsatish; asos/balandlik slayderlari — yuz va to'rtburchak yuzi yonma-yon.
**Qoidalar ro'yxati:**
- Uchburchakka mos to'g'ri to'rtburchak: asosi — bo'yi, balandligi — eni.
- Uchburchakning yuzi unga mos to'g'ri to'rtburchak yuzining yarmiga teng.
- S = ½ × asosi × balandligi; yuz birligi — cm², m².
- Asosi va balandligi teng uchburchaklarning yuzlari teng; balandlik ortsa — yuz ortadi.
**Misol turlari:** katakli fonda yuz; formulaga qo'yish (4 va 3, 10 va 6 ...); bo'yalgan uchburchaklar (ortiqcha o'lchamlar berilgan — keragini tanlash); jadval (asos, balandlik, yuz, mos to'g'ri to'rtburchak); yuzi 20 cm² bo'lgan 3 xil uchburchak.
**Mashq daftaridan (qo'shimcha):** katakli panjarada (1 cm) bo'yalgan uchburchak yuzi — asos va balandlikni o'zi sanaydi; ortiqcha uchinchi tomon berilgan uchburchaklar (26, 28, 20 cm).
**Rasmlar:** uchburchak + mos to'g'ri to'rtburchak, 1 cm katakli panjara.

#### ✅ 14. To'g'ri to'rtburchak va uchburchaklardan tuzilgan shakllarning yuzi — D1 103–108; M1 123–138
**Kompyuterdagi tekshiruv (2026-10-18):** «ichma-ich kvadratlar» chizmasida «12 cm» yozuvi L nuqta nomi ustiga tushib, telefonda kesilardi — yozuv chizmadan olib tashlandi (o'lcham matnda bor).
**Holat (2026-10-17):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-murakkab-shakllar-yuzi.html. O'z testi: `5|matematika|murakkab-shakllar-yuzi` (10 savol, izohli), data.js da test havolasi qo'shildi. data.js dagi `review: true` belgisiga tegilmadi.
**Kitob bilan solishtirildi:** 4 qoida (1-usul bo'laklarga ajratib qo'shish; 2-usul katta to'rtburchakdan ayirish; noma'lum tomonni topish; ikki usulda javob bir xil — tekshirish) ✅. Darslik turlari (kvadrat + uchburchak, to'rtburchakdan uchburchak chiqarish — burchagi kesilgan, uy shakli: uchburchak + to'rtburchak + kvadrat, ichma-ich kvadratlar, katagi 2 cm panjara va nuqtali panjara, ikki kvadratdagi uchburchak — 2 usul, to'g'ri burchakli trapetsiya shakllari) ✅; daftar turlari (kvadrat ichida DE = EC, ikki uchburchak yuzlari 2 marta, diagonallari perpendikulyar to'rtburchak, 4 ta to'g'ri burchakli uchburchak + kvadrat → katta kvadrat tomoni, to'rtburchak yuzidan eni va uchdan biriga qurilgan uchburchak, ikki kvadrat birlashmasidagi uchburchak) ✅; qiyin masala (ustma-ust qo'yilgan ikki kvadrat) ✅. Kitob shakllari va sonlari (10×6 + kvadrat 6, 12×8, 16×18, xoch 15/5/3, uy 5/4/6, 105–107-bet shakllari, 12/6/4 kvadratlar, 8 cm li kvadratlar, 6×8 → kvadrat) ishlatilmadi.
**Tekshiruv:** ekspert — 58 tenglik (xato 0; avval 3 ta «XATO» — matndagi «3:» kabi ikki nuqta skriptda bo'lish deb o'qilgan, jumlalar o'zgartirildi), barcha yuzlar ikki usulda hisoblangan; o'quvchi — telefon 390 px va 1100 px: tuzatildi — «12 cm» yozuvi K nuqta nomi ustiga tushardi. Texnik — 14 ta ma'ruza regressiya tekshiruvi xatosiz. data-geo ga yangi: "oq" (kesib olingan oq qism).
**Simulyator uchun g'oyalar:** shaklni punktir bilan o'quvchi o'zi bo'laklarga ajratadi (har xil ajratishda javob bir xil); «to'ldirish» tugmasi — ramka va ortiqcha qism rangda; panjarada uchlarini sudrab uchburchak yasash va yuzni 2-usulda sanash.
**Qoidalar ro'yxati:**
- 1-usul: shaklni bo'laklarga ajratib, bo'laklar yuzini qo'shish.
- 2-usul: katta to'g'ri to'rtburchak yuzidan ortiqcha qism yuzini ayirish.
- Noma'lum tomonni topish (RU = 10 − 6).
- Har ikki usulda javob bir xil chiqadi.
**Misol turlari:** kvadrat + uchburchak; to'g'ri to'rtburchakdan uchburchak chiqarish; uy shakli (uchburchak + to'g'ri to'rtburchak + kvadrat); ichma-ich kvadratlar; nuqtali panjarada uchburchak; bir nechta kvadratdan tuzilgan shakldagi uchburchak (2 usulda).
**Mashq daftaridan (qo'shimcha):** kvadrat ichida DE = EC; ikki uchburchak yuzlari 2 marta; diagonallari perpendikulyar to'rtburchak (AE, CE, BE = DE); 4 ta to'g'ri burchakli uchburchak + kvadrat; BC = CD = DE, to'g'ri to'rtburchak yuzi 80 cm² → BDF; ikki kvadrat birlashmasi (17 va 13 cm) → ACE; 6 × 8 uchburchakdan 4 tasi → katta kvadrat tomoni.
**Qiyin masala:** 8 cm li ikki kvadrat — C shakl yuzi.
**Rasmlar:** rangli bo'laklar, shtrixlangan ortiqcha qism.

### 5-bob. Hajm

#### ✅ 15. Fazoviy jismlarning hajmi (birlik kublar) (+ Eslang: kub, kuboid, hajm, sig'im) — D1 110–114; M1 139–140
**Holat (2026-10-18):** tayyor (bulut sessiyasi), kompyuterdagi sessiya tekshirib main ga qo'shdi (2026-10-18). Fayl: maruza/5-fazoviy-jismlar-hajmi.html. O'z testi: `5|matematika|fazoviy-jismlar-hajmi` (10 savol, izohli), data.js da test havolasi qo'shildi. Yangi chizma: `data-kub` (izometrik birlik kubchalar, chizma.js). data.js dagi `review: true` tegilmadi.
**Kitob bilan solishtirildi:** 4 qoida (birlik kub; hajm = kublar soni; turli shakl — bir xil hajm; Eslang: kub/kuboid/hajm/sig'im) ✅. Misol turlari (kublarni sanash, hajmlarni taqqoslash, berilgan kubchalardan turli jism yasash) ✅. Mashq daftari (M1) berilmagan — reja ro'yxati bo'yicha: 12 va 18 ta kubdan kuboidlar jadvali ✅ (16 ta emas, o'z sonlarimiz). Kitobdagi sonlar/ismlar ko'chirilmadi.
**Tekshiruv:** tenglik.py — 25 to'g'ri, xato 0; telefon 390 px va kompyuter 1100 px: gorizontal siljish yo'q, KaTeX yuklandi, xato yo'q; barcha kubcha sonlari qo'lda va chizma bo'yicha tekshirildi; kuboidlar soni (12 → 4 xil, 18 → 4 xil, 6 → 2 xil) sanab chiqildi.
**Simulyator uchun g'oyalar:** tayyor `lessons/5-matematika-hajm-kubiklar.html` bor (tegilmaydi).
**Qoidalar ro'yxati:**
- Eslang: kubning 6 ta kvadrat yog'i bor, barcha qirralari teng; kuboidning 6 ta to'g'ri to'rtburchak (yoki 4 ta to'g'ri to'rtburchak va 2 ta kvadrat) yog'i bor; suyuqlik hajmi ℓ, ml da; sig'im — idishni to'ldiradigan suyuqlik hajmi.
- Birlik kub: 1 birlik × 1 birlik × 1 birlik, hajmi 1 kub birlik.
- Jism hajmi = undagi birlik kublar soni.
- Turli shakldagi jismlar bir xil hajmga ega bo'lishi mumkin.
**Misol turlari:** kublarni sanash; hajmlarni taqqoslash; berilgan kubchalardan turli jism yasash.
**Mashq daftaridan (qo'shimcha):** 16 ta birlik kubdan 4 xil kuboid (jadval: bo'yi, eni, balandligi, hajmi).
**Rasmlar:** izometrik kubchalar.

#### ✅ 16. Uch o'lchamli panjarada fazoviy jismlarni chizish — D1 115–117; M1 141–142
**Holat (2026-10-18):** tayyor (bulut sessiyasi). Fayl: maruza/5-izometrik-panjarada-chizish.html. O'z testi: `5|matematika|izometrik-panjarada-chizish` (10 savol, izohli); data.js da ma'ruza va test havolasi ulandi. Yangi chizma: `data-panjara` (nuqtali izometrik panjarada kuboid, bosqichlar, ko'rinmas qirralar, birlik bo'linishi; chizma.js). Kitob bilan solishtirildi (D1 115–117): barcha qoidalar (3 yo'nalish, kub, kuboid, ikki xil joylashuv) va misol turlari bor; sonlar o'zimizniki. Mashq daftari M1 141–142 berilmagan — reja ro'yxati bo'yicha (tik ustun, yassi taxta, kub, ikki xil joylashuv) o'z sonlarimiz bilan. Tekshiruv: tenglik.py 18/0, kitobdan.py 0, node --check, 390/1100 px to'g'ri, xato yo'q; barcha 5-*.html ma'ruzalari chizma.js?v=25 bilan xatosiz ochildi. `review: true` tegilmadi. Simulyator: tayyor lessons/5-matematika-izometrik-chizish.html bor (tegilmaydi).
**Qoidalar ro'yxati:**
- Uch o'lchamli (izometrik) nuqtali panjarada qirralar 3 yo'nalishda: tik va ikki qiya.
- Kubning 3 ta o'lchami teng; kuboid — bo'yi, eni, balandligi.
- Bir jismni turli joylashuvda chizish mumkin (3×3×2 kuboid ikki xil).
**Misol turlari:** 1, 2, 4 birlikli kub; 1×3×1, 4×2×3, 5×5×3 kuboid; ikki xil joylashuv.
**Mashq daftaridan (qo'shimcha):** berilgan o'lchamlar (4×1×3, 3×3×3, 2×2×5, 1×6×2, 4×3×3, 5×4×1) bo'yicha izometrik chizish.
**Rasmlar:** izometrik panjara, bosqichma-bosqich chizish.

#### ✅ 17. Jismning turli ko'rinishlari (old, yon, ust) — D1 118–119; M1 143–144
**Holat (2026-10-18):** tayyor (bulut sessiyasi). Fayl: maruza/5-jismning-korinishlari.html. O'z testi: `5|matematika|jismning-korinishlari` (10 savol, izohli); data.js da ma'ruza va test havolasi ulandi. Yangi chizmalar: `data-korinish` (jismning yuqoridan/olddan/yondan ko'rinishlari kvadratli panjarada) va `data-kub` ga `data-strelka` (qarash strelkalari). Qoidalarga 2 ta qo'shildi: ko'rinishlar o'lchamlari bo'yicha mos keladi; bir xil ko'rinishga har xil jism mos kelishi mumkin (eng kam/eng ko'p kubcha). Ko'rinishga qarab topiladigan hamma masalalar bir javobli ekani kompyuterda sanab tekshirildi. Kitob bilan solishtirildi (D1 118–119): 2 qoida va ikkala misol turi (3 ko'rinishni chizish; ko'rinishga qarab jismni topish) bor; jismlar o'zimizniki. M1 143–144 berilmagan — reja bo'yicha (6 ta jism uchun 3 ko'rinish) o'z jismlarim bilan. Tekshiruv: tenglik.py 9/0, kitobdan.py 0, node --check, 390/1100 px to'g'ri, xato yo'q; barcha 5-*.html chizma.js?v=26 bilan xatosiz ochildi. Simulyator uchun g'oya: jismni aylantirib, kvadratli panjarada ko'rinishlarni o'zi bo'yaydi, so'ng solishtiriladi (reja ro'yxati bo'yicha).
**Qoidalar ro'yxati:**
- Yuqoridan, olddan, yondan ko'rinish — kvadratli panjarada ko'rinadigan kvadrat yuzlar.
- Ko'rinishlar soni jism shakliga bog'liq; orqadagi kubchalar ko'rinishda chiqmaydi.
**Misol turlari:** jismning 3 ko'rinishini chizish; ko'rinishga qarab jismni topish.
**Mashq daftaridan (qo'shimcha):** 6 ta jism uchun 3 ko'rinishni kvadratli panjarada chizish.
**Rasmlar:** izometrik jism + 3 ta kvadrat panjara, ko'z belgisi.

#### ✅ 18. Hajmni cm³ va m³ da o'lchash — D1 120–122; M1 145–146
**Holat (2026-10-18):** tayyor (bulut sessiyasi). Fayl: maruza/5-hajm-birliklari.html. O'z testi: `5|matematika|hajm-birliklari` (10 savol, izohli); data.js da ma'ruza va test havolasi ulandi. Yangi chizma kerak bo'lmadi (data-kub); 1 m³ va 5-sinf o'quvchisi rasmi — sahifaning o'zida kichik SVG. Qoidalarga 4-qoida qo'shildi (har xil birlikdagi hajmlarni taqqoslash: m³ > cm³); «1 m³ = 1 000 000 cm³» — O'ylab ko'ring bo'limida (100·100·100). Kitob bilan solishtirildi (D1 120–122): 3 qoida va barcha misol turlari bor (cm³ va m³ da sanash; eng katta / teng hajmlilar); jismlar, harflar va sonlar o'zimizniki. M1 145–146 berilmagan — reja bo'yicha. Tekshiruv: tenglik.py 23/0, kitobdan.py 0, node --check, 390/1100 px to'g'ri, xato yo'q. Simulyator uchun g'oya: 1 cm³ va 1 m³ yonma-yon, qirra bo'ylab 100 ta kubcha, m³ ↔ cm³ slayderi (reja ro'yxati).
**Qoidalar ro'yxati:**
- Qirrasi 1 cm bo'lgan kubning hajmi 1 cm³ (santimetr kub).
- Qirrasi 1 m bo'lgan kubning hajmi 1 m³ (metr kub); 1 m = 100 cm.
- Jism hajmi = birlik kublar soni × 1 cm³ (yoki m³).
**Misol turlari:** kubchalarni sanab cm³/m³ da yozish; eng katta / teng hajmlilar.
**Mashq daftaridan (qo'shimcha):** qirrasi 1 m kublardan jism hajmi (m³); eng kichik / teng hajmlar.
**Rasmlar:** 1 cm³ va 1 m³ taqqoslash (odam bo'yi bilan).

#### ✅ 19.1. Kuboid (to'g'ri burchakli parallelepiped) hajmi — D1 123–128; M1 147–150
**Holat (2026-10-18):** tayyor (bulut sessiyasi). Fayl: maruza/5-kuboid-kub-hajmi.html (kuboid; kub — 19.2 da alohida). O'z testi: `5|matematika|kuboid-kub-hajmi` (10 savol, izohli); data.js da ma'ruza va test havolasi ulandi. Yangi chizma kerak bo'lmadi (data-kub, ajratilgan qatlamlar). **Qoidalar ro'yxati (19.1):** kuboid qatlamlarga bo'linadi (qatlamda bo'yi × eni kubcha, qatlamlar soni = balandlik); V = bo'yi × eni × balandligi; o'lchamlar bir xil birlikda, hajm cm³/m³ da (1 m = 100 cm); V = asos yuzi × balandlik, yuz (cm²) va hajm (cm³) farqi. **Misol turlari:** jadval (sanab topilgan hajm ↔ o'lchamlar); formula bilan (cm va m); asosi kvadrat kuboid; kuboid idish (qirralar bo'ylab kubchalar); noma'lum o'lchamni topish; idishning bo'sh qismi (3/4 muz); har xil birlik; ikki marta katta kub; bir nechta kub hajmiga teng kuboid; ustma-ust bloklar; matnli masalalar (kuzov, akvarium, quti, xona, chuqur, ikki idish). Kitob bilan solishtirildi (D1 123–128, kub qismi 19.2 ga qoldi): formula, jadval, idish, yuz–hajm farqi bor; sonlar o'zimizniki. Konteyner jadvali (33,150 m³) kitobdagi «Turmushda matematika» — sonlarisiz, o'z mashinasi bilan almashtirildi. M1 147–150 berilmagan. Tekshiruv: tenglik.py 49/0, kitobdan.py 0, node --check, 390/1100 px to'g'ri, xato yo'q. Simulyator: tayyor lessons/5-matematika-parallelepiped.html bor (tegilmaydi).
**Mashq daftaridan (qo'shimcha):** jadval (o'lchamlar → hajm); kub hajmi kuboiddan 2 marta katta → kuboid hajmi; kuboid hajmi 6 ta kub hajmiga teng → bitta kub; kuboidni 3 blokka bo'lib ustma-ust qo'yish; qisman kubchalar bilan to'ldirilgan idishning bo'sh qismi; Matematika kundaligi: muz bo'lagi hajmi (idishning 3/4 qismi).

#### ✅ 19.2. Kub hajmi — D1 123–128; M1 147–150
**Holat (2026-10-18):** tayyor (bulut sessiyasi). Fayl: maruza/5-kub-hajmi.html. O'z testi: `5|matematika|kub-hajmi` (10 savol, izohli); data.js da ma'ruza va test havolasi ulandi. Yangi chizma kerak bo'lmadi (data-kub). **Qoidalar (19.2):** V = qirrasi × qirrasi × qirrasi (a³); kub qatlamlarga bo'linadi (qatlamda a·a, qatlamlar a ta); birlik cm³/m³; yuz (a·a, cm²) va hajm (a·a·a, cm³) farqi; kub va kuboid farqi (uchala o'lcham teng). **Misol turlari:** qirra bo'yicha hajm (5 cm, 7 m, 3 cm); qatlamlab (4); jadval qirra → yuz, hajm (1–6); hajmdan qirrani topish; kub va kuboidni taqqoslash; bo'yalgan kub; teng hajmli kuboid; kub shaklidagi quti ichiga kubiklar. Kitob bilan solishtirildi (D1 124, 126–128: kub jadvali, 2 cm va 3 m kublar, 6 cm kub, kvadrat yuzi va kub hajmi farqi): hammasi bor, sonlar o'zimizniki; kitobdagi W/X/Y/Z harflari va 8 cm³/27 m³ misollari almashtirildi. Gazeta o'ramlari amaliy mashqi 19.1 «O'ylab ko'ring» da. M1 147–150 berilmagan. Tekshiruv: tenglik.py 48 ta to'g'ri (1 ta «xato» — Diqqat dagi atayin xato misol), kitobdan.py 0, node --check, 390/1100 px to'g'ri, xato yo'q. Qirralar yig'indisi va sirt yuzi bu darslik mavzusida yo'q — qo'shilmadi (qaror kutilmoqda).
**Qoidalar ro'yxati:**
- Kuboid hajmi = bo'yi × eni × balandligi (V = a·b·c).
- Kub hajmi = qirrasi × qirrasi × qirrasi (V = a·a·a = a³).
- Hajm birligi — kub birlik (cm³, m³); o'lchamlar bir xil birlikda bo'lishi kerak.
- Kvadrat yuzi (cm²) va kub hajmi (cm³) farqi.
- Kuboid qatlamlarga bo'linadi: bir qatlamdagi kubchalar = bo'yi × eni; qatlamlar soni = balandligi.
**Misol turlari:** jadval (sanab topilgan hajm va o'lchamlar); formula bilan (3×2×3, 12×8×4); kub (2, 3, 6 cm); asosi kvadrat kuboid; shisha idish hajmi; konteyner (hayotiy).
**Eslatma:** 19.1/19.2 simulyatorlarida qirralar yig'indisi va sirt yuzi bor — bu darslikda shu mavzuda yo'q; ma'ruzada qo'shimcha sifatida berish mumkin (qaror kerak).
**Rasmlar:** qatlamli kuboid, kub.

#### ✅ 20. Suyuqlik hajmi: cm³, m³, litr, ml + matnli masalalar — D1 129–138; M1 151–164
**Holat (2026-10-18):** tayyor (bulut sessiyasi; foydalanuvchi so'rovi bilan 16–19 dan oldin qilindi). Fayl: maruza/5-suyuqlik-hajmi.html. O'z testi: `5|matematika|suyuqlik-hajmi` (10 savol, izohli); data.js da test havolasi umumiy `hajm` o'rniga shu mavzuniki. Yangi chizmalar (chizma.js): `data-idish` (suvli kuboid idish, suv sathi va bo'sh qism o'lchamlari bilan), `data-menzurka` (o'lchov idishi). data.js dagi sarlavha «sm³» → «cm³». `review` belgilariga tegilmadi.
**Kitob bilan solishtirildi:** 4 qoida (1 ml = 1 cm³, 1 ℓ = 1000 cm³, qirrasi 10 cm kub; suv hajmi = bo'yi × eni × sath; to'ldirish 2 usulda; idishning qismi to'ldirilgan) ✅. Darslik misol turlari: almashtirishlar, idishdagi suv, to'ldirish (2 usul), hovuz (m³), stakanlar, chelak bilan necha marta, oldin suv bor edi + 2/3 qism, bir idishdan boshqasiga, «2 baravar katta» fikri, qatlamli jism qonuniyati ✅. Mashq daftari (M1 151–160, 162) turlari: ℓ ml → cm³, cm³ → ℓ ml, sath bo'yicha hajm, asosi kvadrat idish sig'imi (m³), sathdan yarmigacha, qismi to'la → to'ldirish, to'kib sath qolguncha, kuboiddan kubga, qismi to'la + quyildi → toshib ketgan suv ✅. Qonuniyat masalasi o'z variantimiz (markazlashgan 1, 3×3, 5×5 ... qatlamli minora, 5-minora = 165). M1 161 (16 kubdan kuboidlar) 15-mavzuda, M1 164 (muz) 19.1 rejasida. Kitob xatosi (7680 − 320) ko'chirilmadi. kitobdan.py: kitob bilan bir xil ifoda 0.
**Tekshiruv:** tenglik.py — 80 to'g'ri, xato 0 (Diqqat'dagi xato javoblar yozuvda, hisob emas); barcha javoblar Python bilan alohida hisoblandi; test javoblari variantlar ichida; telefon 390 px va kompyuter 1100 px: gorizontal siljish yo'q, KaTeX yuklandi, xato yo'q; chizma.js/maruza.css o'zgargani uchun 16 ta ma'ruza qayta ochib tekshirildi — xato yo'q.
**Simulyator uchun g'oyalar:** kuboid akvarium — o'lchamlari va suv sathi surgichlar bilan o'zgaradi, hajm cm³ va ℓ/ml da; menzurkadan akvariumga quyish (sath qancha ko'tariladi); «necha stakan/necha chelak» o'yini; qatlamli minora qonuniyati jadvali.
**Qoidalar ro'yxati:**
- 1 ml = 1 cm³; 1 ℓ = 1000 ml = 1000 cm³; qirrasi 10 cm bo'lgan kubga 1 ℓ sig'adi.
- Idishdagi suv hajmi = bo'yi × eni × suv sathi balandligi.
- To'ldirish uchun kerak suv = idish hajmi − suv hajmi (yoki bo'sh qism balandligi bilan).
- Idishning qismi (yarmi, 2/3, 4/5) to'ldirilgan holat.
**Misol turlari:** ml ↔ cm³ ↔ ℓ almashtirish (8 ℓ 34 ml); idishdagi suv; to'ldirish uchun kerak suv (2 usul); hovuz sig'imi; stakanlarga quyish (nechta stakan); ko'za bilan necha marta; bir idishdan boshqasiga quyish; "2 baravar katta" fikrini tekshirish.
**Mashq daftaridan (qo'shimcha):** ℓ ml → cm³ (3 ℓ 248 ml, 8 ℓ 7 ml); cm³ → ℓ va ml (3744 cm³ = 3 ℓ 744 ml); suv sathi bo'yicha hajm; asosi kvadrat idish sig'imi; 2 cm dan yarmigacha to'ldirish; 4/7, 5/6 qismdagi suv; to'kib, sath 9 cm qolguncha; kuboiddan kubga quyish; idish 3/5 to'la + 2 ℓ → toshib ketgan suv (ml).
**Qiyin masala:** qatlam qo'shib boriladigan kub jismlar — 6-jism hajmi (qonuniyat).
⚠ Kitob xatosi: 2-usulda "7680 − 320 = 4480" (to'g'risi 7680 − 3200).
**Rasmlar:** suv sathli idish, menzurka.

### 6-bob. Nisbatlar

#### ☐ 21. Nisbat tushunchasi — D1 140–145; M1 165–168
**Qoidalar ro'yxati:**
- Ikki miqdorni taqqoslash: a : b ("a ga b" deb o'qiladi).
- Tartib muhim: ko'k : qizil = 4 : 1, qizil : ko'k = 1 : 4.
- Nisbatda o'lchov birliklari yozilmaydi (5 kg : 6 kg → 5 : 6); miqdorlar bir xil birlikda bo'lishi kerak.
- Qismning butunga nisbati (qizil : jami = 3 : 8).
- "4 marta ko'p" → 4 : 1.
**Misol turlari:** rasmdan nisbat; massa/hajm nisbati; qismning jamiga nisbati; to'g'ri to'rtburchak bo'yi : eni, bo'yi : perimetri; katakli rasm; ichimlik retsepti (qaysi biri shirinroq).
**Mashq daftaridan (qo'shimcha):** nisbatni chizma-model bilan tasvirlash (P : Q = 6 : 5); jadvaldan nisbat (stikerlar); "4 marta, 2 marta ko'p" → qismning jamiga nisbati.
**Rasmlar:** buyumlar qatori, ikki qatorli bo'lak modeli.

#### ☐ 22. Teng kuchli nisbatlar — D1 146–154; M1 169–178
**Qoidalar ro'yxati:**
- Nisbatning ikkala hadini bir xil songa ko'paytirsak yoki bo'lsak, teng kuchli nisbat hosil bo'ladi (12 : 8 = 6 : 4 = 3 : 2).
- Qisqarmas shakl: hadlar eng katta umumiy bo'luvchiga bo'linadi (4 : 8 → 1 : 2); 2 : 4 hali qisqarmas emas.
- Teng kuchli nisbatdagi noma'lum had (5 : 20 = 1 : □; 2 : 3 = □ : 18) — teng kuchli kasrlardagidek.
- Kasr va nisbat bog'lanishi: 1/4 = 6/24 ↔ 1 : 4 = 6 : 24.
**Misol turlari:** guruhlarga ajratish; qisqarmas shaklga keltirish; noma'lum had; hayotiy (sinfdagi qiz/o'g'il, markalar, pullar); retsept (5 piyola un : 2 bo'lak sariyog' — 3 ta tort).
**Mashq daftaridan (qo'shimcha):** rasmdan guruhlarga ajratib qisqarmas shakl (namuna); 100 ml : 60 ml, 36 m : 48 m; yoshlar nisbati 6 yildan keyin (12 va 16); 8×8 katakli qog'oz (yana 8 katak bo'yaldi); so'zlar bilan nisbat yozish (mototsikl : mashina = 5 : 6); noma'lum hadli tengliklar (16 : □ = □ : 21 kabi).
**Rasmlar:** guruhlarga ajratilgan shakllar.

#### ☐ 23. Miqdor va nisbatga ko'ra boshqa miqdorni topish — D1 155–156; M1 179–180
**Qoidalar ro'yxati:**
- 1-usul: teng kuchli nisbat (4 : 5 = 800 : □, ×200).
- 2-usul: bo'laklar usuli (4 bo'lak = 800 → 1 bo'lak = 200 → 5 bo'lak = 1000).
- Jami miqdorni topish (3 + 4 = 7 bo'lak).
**Misol turlari:** idishlardagi suv, markalar, jadval (nisbat — biri — jami), jo'natmalar massasi, tasmalar, pul, maktabdagi o'g'il/qiz.
**Mashq daftaridan (qo'shimcha):** sovg'a to'plamlari (2 o'chirg'ich : 5 qalam — 4 to'plam, 30 qalam, 18 o'chirg'ich); sayohat qutisi (4 pasta : 3 cho'tka); ferma (tovuq : o'rdak, jami).
**Rasmlar:** bo'lak modeli.

#### ☐ 24. Jami miqdor va nisbatga ko'ra qismlarni topish + ikki miqdor nisbatiga doir matnli masalalar — D1 157–164; M1 181–188
**Qoidalar ro'yxati:**
- Jami bo'laklar soni = nisbat hadlari yig'indisi (3 : 5 → 8 bo'lak).
- 1 bo'lak = jami : bo'laklar soni; har bir qism = 1 bo'lak × o'z hadi.
- Tekshirish: qismlar yig'indisi = jami, nisbati = berilgan nisbat.
- Farq berilgan masala: hadlar farqi bo'laklari (5 : 3, farq 16 → 2 bo'lak = 16).
- Bir xil narsalar takrorlansa (3 bola chiptasi + 2 kattalar) — bo'laklarni sanash (19 bo'lak).
**Misol turlari:** pishiriqlarni bo'lish; olmalarni xaltalarga; pulni bo'lish (jadval); sharbatni bo'lish; o'g'il/qiz; pechenye; chiptalar narxi; yosh (ota : o'g'il); tasmani bo'lish; ruchkalar aksiyasi; ustunli diagramma.
**Mashq daftaridan (qo'shimcha):** 1 ℓ sharbatni 3 : 5 bo'lish (ml da); "har 7 tadan 4 tasi" — 35 dan nechta; farq 46 000 (7 : 5); Humoyunda 2 marta ko'p; yoshlar 5 yil oldin; vazn nisbati; ertaklar farqi 245; ip 72 cm, 24 cm bo'lak; X, Y, Z yuklar (2 marta, 1 : 3).
**Rasmlar:** bo'lak modeli, ustunli diagramma.

#### ☐ 25. Uchta miqdorning nisbati + matnli masalalar — D1 165–172; M1 189–203
**Qoidalar ro'yxati:**
- a : b : c — uch miqdorni taqqoslash.
- Qisqarmas shakl: uchala had umumiy bo'luvchiga bo'linadi (4 : 6 : 12 = 2 : 3 : 6).
- Noma'lum had (2 : 4 : 5 = 8 : □ : 20).
- Bo'laklar usuli: eng qisqa / eng uzun / farq (3 : 2 : 5, eng qisqasi 14 m).
**Misol turlari:** qisqarmas shakl; tushirib qoldirilgan hadlar; mevalar massasi; kinoteatr; arqon; uchburchak tomonlari; stikerlar; pullar; kvadrat qismlari yuzi.
**Mashq daftaridan (qo'shimcha):** 3 shakl yuzlari nisbati (78 : 48 : 18); jadvaldan 3 bolaning markalari nisbati; teng kuchli uch hadli nisbatlarda 2 ta noma'lum; ichimlik retsepti (2 : 4 : 12, 6 stakan); qolgan tugmalar nisbati; kupon aksiyasi (30 000 so'm → 2000 chegirma + 3 kupon); vaznlar zanjiri (3 marta, 2 marta); kvadrat qismlari (B : C = 3 : 8); kinoteatr farqi 45; 3 : 3 : 2; nisbat o'zgarishi (Sardor 1500 sarfladi); to'g'ri to'rtburchakni 2 : 3 : 5 yuzlarga bo'lish (amaliy); A : B = 2 : 5, B − C = 12 cm²; Kundalik: "A va B sinfdagi bolalar soni turlicha bo'lishi mumkinmi?"
**Qiyin masala:** ingliz : o'zbek kitoblar = 2 : 5, farq 15 → jami.
⚠ Kitob xatosi: "Bahora 108 so'm olgan" (to'g'risi 108 000 so'm).
**Rasmlar:** uch qatorli bo'lak modeli.

### 7-bob. O'nli kasrlar (2-qism)

#### ☐ 26. O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish (+ Eslang: o'nli kasrlar) — D2 2–8, 12–16; M2 1–8, 13–16
**Qoidalar ro'yxati:**
- Eslang: o'nli kasr xonalari (o'ndan birlar, yuzdan birlar, mingdan birlar), xona yoyilmasi (0,1 + 0,03 + 0,004 = 0,134); ustun usulida qo'shish/ayirish (vergul tagiga vergul); o'nli kasrni natural songa ko'paytirish va bo'lish (yaxlitlash bilan); aralash son ↔ o'nli kasr (3 2/5 = 3,4; 8,25 = 8 1/4).
- O'nli kasrni 10 / 100 / 1000 ga ko'paytirish uchun vergul mos ravishda 1 / 2 / 3 xona o'ngga suriladi.
- Xona yetmasa, oxiriga nol yoziladi (5,8 · 1000 = 5800).
- 10 / 100 / 1000 ga bo'lish uchun vergul 1 / 2 / 3 xona chapga suriladi; xona yetmasa, oldiga nol yoziladi (3 : 100 = 0,03; 2 : 1000 = 0,002).
- Natural sonni 10/100/1000 ga bo'lish ham shunday: 4 = 4,0 → 0,4.
- Xona jadvalida raqamlar o'ngga / chapga siljiydi (vergul joyida).
**Misol turlari:** ko'paytiring/bo'ling; tushirib qoldirilgan ko'paytuvchi/bo'luvchi (0,105 · □ = 1,05; 8,5 : □ = 0,085); jadval (:10, :100, :1000).
**Mashq daftaridan (qo'shimcha):** Eslang: sonli tugmalardan o'nli kasr yozish (10 + 0,2 + 0,005); qo'shish, ayirish, natural songa ko'paytirish, yaxlitlab bo'lish; o'nli kasr → qisqarmas oddiy kasr (2,125); xona jadvalida ×10/×100/×1000 va :10/:100/:1000 ni to'ldirish; tushirib qoldirilgan son (× 2,674 = 2674).
**Rasmlar:** o'nli xona jadvali, vergul siljishi animatsion strelka.

#### ☐ 27. O'nli kasrni o'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish — D2 9–11, 17–18; M2 9–12, 17–20
**Qoidalar ro'yxati:**
- 2,3 · 20 = 2,3 · 2 · 10 (yoki 2,3 · 10 · 2) — tartib farqi yo'q.
- 6,085 · 500 = 6,085 · 100 · 5.
- 6,3 : 30 = 6,3 : 3 : 10 (yoki : 10 : 3).
- Hayotiy: massa × son (mixlar, sovun qutilari), sig'im × son.
**Misol turlari:** ko'paytiring; bo'ling; jadval (×20, ×200, ×2000; :20, :200, :2000); "jami miqdor" jadvali.
**Mashq daftaridan (qo'shimcha):** g'ishtlar massasi (×100), tasmalar uzunligi (×50), ichimlik (×30), kitoblar (×4000); g'isht (570 kg : 200), tasma (39,6 m : 30), chipta narxi (2 250 000 : 50).
**Rasmlar:** ikki bosqichli strelka zanjiri.

#### ☐ 28. O'lchov birliklarini almashtirish + matnli masalalar (+ Eslang: birliklar) — D2 19–32; M2 21–40
**Qoidalar ro'yxati:**
- 1 m = 100 cm; 1 km = 1000 m; 1 kg = 1000 g; 1 ℓ = 1000 ml.
- Katta birlikdan kichikka: ko'paytiriladi (4,7 m = 470 cm); kichikdan kattaga: bo'linadi (78 cm = 0,78 m).
- Ikki birlikli yozuvni bitta birlikka: 6 m 47 cm = 6,47 m; 7 ℓ 5 ml = 7,005 ℓ (nollar!).
- Teskari: 5,04 m = 5 m 4 cm; 8,35 km = 8 km 350 m.
- Son o'qida ikki birlik (km va m) yonma-yon.
- Matnli masalalarda avval birliklarni bir xil qilish; chamalab tekshirish; kalkulyator tugmalari ketma-ketligi.
**Misol turlari:** son o'qidan o'qish; almashtirish (8 tur); loto o'yini (teng miqdorlar); masalalar: idishdan quyish, sim bo'laklari (cm da), yuz → perimetr, vazn (ikki juftlik yig'indisi), quti + un + shakar, sharbat stakanlarga, tasmalar, kolba (1/4 qismi), ikki idish tenglashishi, qiyma/kotlet, guruch, gulkaram/karam, sumkalar narxi.
**Mashq daftaridan (qo'shimcha):** ikki birlikli → bir birlik (10 m 5 cm = 10,05 m; 23 kg 25 g); bir birlik → ikki birlik (105,475 ℓ); qaytim (100 − 38,10 ming); yuz (42,8 × 23); 439 614 : 28; qog'ozsochiq (g → kg); idishlar (ml va ℓ aralash); shakar qayta joylash; ikki son (yig'indisi 112,5, 5 marta); idishlar tenglashishi; 3 vazn (farqlar berilgan); haftalik yig'ish (ish kuni / dam olish kuni); qog'ozjild va ruchka (2 tenglama); simdan to'g'ri to'rtburchak (2,1 m, bo'yi 45 cm); perimetr bo'ylab yugurish — to'xtash joylari va qisqa masofa (amaliy); 8 futbolkaga yetmadi / 5 tadan ortdi; Kundalik: 0,2 × 0,3 = 0,6 xatosi (to'g'risi 0,06).
**Qiyin masala:** uch qizning puli (farqlar berilgan).
**Rasmlar:** ikki shkalali son o'qi, o'lchov idishi.

### 8-bob. Me'yor

#### ☐ 29. Me'yorni topish — D2 34–37; M2 41–44
**Qoidalar ro'yxati:**
- Me'yor — vaqt (yoki boshqa) birligida bajarilgan ish miqdori: me'yor = umumiy miqdor : birliklar soni.
- Yozilishi: 120 sahifa/min, 1,5 ℓ/soat, 23 000 so'm/kg.
- Narxlarni taqqoslash: 1 kg (1 m, 1 dona) narxiga keltirib solishtirish — qaysi qadoq arzon.
- Grafikdan me'yorni o'qish.
**Misol turlari:** printer, jo'mrak, kukun qadoqlari, hovuz, mebel korxonasi, grafik, atlas narxi; yurak urishi (amaliy).
**Mashq daftaridan (qo'shimcha):** gilam 1 m² narxi; benzin (km/ℓ); avtoturargoh soati; so'z terish; nusxalash; ish haqi; chipta; jo'mrak (ℓ/min); Kundalik: printerlar tezligini taqqoslash (X: 5 min — 400, Y: 8 min — 600) — Akmalning xatosi.
**Rasmlar:** "5 min → 600 sahifa, 1 min → ?" strelkali sxema; chiziqli grafik.

#### ☐ 30. Me'yorga ko'ra umumiy miqdorni topish — D2 38–42; M2 45–50
**Qoidalar ro'yxati:**
- Umumiy miqdor = me'yor × birliklar soni.
- Avval 1 birlikka keltirish, keyin ko'paytirish (2 min → 10 °C, 1 min → 5 °C, 7 min → 35 °C).
- Birliklarni moslash (1 soat = 60 min).
- Tarif jadvallari: "…gacha" (pochta), "dastlabki 1 soat + keyingi har yarim soat" (avtoturargoh), bosqichli tarif (taksi).
**Misol turlari:** ish haqi, harorat, banka ishlab chiqarish, pochta, avtoturargoh (kun/tun), panjara narxi (perimetr × narx), qo'ng'iroq narxi, changyutkich, taksi.
**Mashq daftaridan (qo'shimcha):** hovuzdan oqish (1 min va 4 min); stul (1 kun va 11 kun); printer (sekund → minut); retsept (700 g un : 10 tuxum → 15 tuxum); avtoturargoh va velosiped ijarasi (vaqt oralig'i); pochta (har biri alohida); qo'shimcha ish soatlari haqi.
**Rasmlar:** strelkali sxema, vaqt chizig'i (10:00 → 12:30).

#### ☐ 31. Birliklar sonini topish + matnli masalalar — D2 43–50; M2 51–64
**Qoidalar ro'yxati:**
- Birliklar soni (vaqt) = umumiy miqdor : me'yor.
- 1 birlik ish uchun ketgan vaqt (1/50 min) orqali ham topiladi.
- Uch miqdor bog'liq: me'yor, umumiy miqdor, birliklar soni — ikkitasi ma'lum bo'lsa, uchinchisi topiladi.
- Hajm masalalari: idish hajmi (cm³ → ℓ) : quyilish me'yori (ℓ/min) = vaqt.
**Misol turlari:** so'z yozish, idish to'lishi, detal, qo'g'irchoq, kafel narxi, jadvallar (yozish vaqti, o'chirg'ichlar soni), ish soatlari, ijara; benzin (km/ℓ, narx), do'lana (100 g narxi), sekundiga ml, printer (10 s), restoran taqqoslash, grafikdan tezlik.
**Mashq daftaridan (qo'shimcha):** ish haqi → soat; detal; kafel (m²); gilos (100 g narxi → kg); grafikdan jo'mrak tezligi va 40 ℓ vaqti; valyuta kursi grafigi; sayohat narxlari jadvali (kattalar/bolalar, lyuks); idishning 3/4 qismi oqishi; 1/3 to'la idish to'lishi; arzon xarid (5 tasi / 10 tasi narxi, 55 ta olma); konteyner (9:10 dan 9:30 gacha 3,3 ℓ, 50 min); 1400 banka/min × 5 soat; Kundalik: printerlarni taqqoslash.
**Qiyin masala:** ikki idish, ikki jo'mrak — to'lish vaqtlari farqi.
**Rasmlar:** uchburchak "me'yor — miqdor — vaqt" sxemasi, idish.

### 9-bob. Foizlar

#### ☐ 32. Foiz tushunchasi (+ Eslang: bir butunning qismlari) — D2 52–55; M2 65–68
**Qoidalar ro'yxati:**
- Eslang: 100 katakli kvadratda qism: 25/100 = 0,25 = 1/4; kasrni maxraji 100 bo'lgan kasrga keltirish.
- 1% = 1/100 (yuzdan bir). a% = a/100. Belgisi: %.
- Bir butun = 100%. Qolgan qism: 100% − 12% = 88%.
- O'nli kasr → foiz: 0,91 = 91/100 = 91%.
**Misol turlari:** bo'yalgan kataklar foizi; erkak/ayol tomoshabinlar; kasr → foiz; o'nli kasr → foiz; pulning necha foizi ishlatilgan/qolgan; hayotiy e'lonlar (chegirma, QQS, omonat).
**Mashq daftaridan (qo'shimcha):** bo'yalgan/bo'yalmagan qismni oddiy va o'nli kasrda; maxraji 100 bo'lgan kasrga keltirish (□/4 = □/100); 0,7 = □/100; berilgan foizni bo'yash (9%, 73%); "100 dan 85 = □%"; jadval (foiz — oddiy kasr — o'nli kasr).
**Rasmlar:** 100 katakli kvadrat (bir nechta rang).

#### ☐ 33. Oddiy kasr, o'nli kasr va foiz orasidagi bog'lanish — D2 56–61; M2 69–72
**Qoidalar ro'yxati:**
- Kasr → foiz: 1-usul — maxraji 100 bo'lgan kasrga keltirish; 2-usul — kasrni 100% ga ko'paytirish (3/5 · 100% = 60%).
- Maxraj 100 dan katta bo'lsa — qisqartirish (16/200 = 8/100 = 8%).
- Bo'linmasa — yaxlitlash (3/22 ≈ 13,64%).
- O'nli kasr → foiz: 100% ga ko'paytirish (0,7 = 70%).
- Foiz → oddiy kasr: a/100 va qisqartirish (75% = 3/4; 6% = 3/50).
- Foiz → o'nli kasr: 100 ga bo'lish (7% = 0,07).
- Foizlar tasmasi: 0% ↔ 0, 50% ↔ 0,5, 100% ↔ 1.
**Misol turlari:** 3 yo'nalishli almashtirish; 100 va 200 katakli to'r; foiz tasmasida o'qish; "O'zbekiston aholisining necha foizi shaharda".
**Mashq daftaridan (qo'shimcha):** kasrlarni tasmada bo'yash va foizda yozish (30%, 7%); foiz ↔ kasr ↔ o'nli kasr juftlarini chiziq bilan tutashtirish; 400 katakli xarita — hayvon qafaslari foizi (amaliy).
**Rasmlar:** foiz tasmasi (o'lchov tasmasi), uchburchak kasr ↔ o'nli ↔ foiz.

#### ☐ 34. Miqdorning foizi + matnli masalalar — D2 62–68; M2 73–84
**Qoidalar ro'yxati:**
- Sonning a% ini topish: 1-usul — a/100 · son; 2-usul — 1% = son : 100, keyin × a.
- Bir son ikkinchisining necha foizi: (qism : butun) · 100% (60 : 200 · 100% = 30%).
- Qolgan qism foizi: 100% − a%.
- Foiz farqi orqali (70% − 25% = 45% → 45% · 80).
**Misol turlari:** maktabdagi qizlar; rus tilidagi kitoblar; kg/ml foizi (37,5%); sport anjomi (sarflangan / qolgan); hayvonlar ko'rgazmasi; jadvaldan sinf foizi; javon ulushlari; konsert; basketbol; maosh sarfi; chiptalar (kasr + foiz aralash); o'g'il/qiz farqi.
**Mashq daftaridan (qo'shimcha):** "necha foizi" (320 so'mning necha foizi 80 so'm); piyoda qatnaydiganlar, mevali tortlar, marafon, so'rovnoma; tayoqning bo'yalgan qismi; test natijasi; tortlar (soni va foizi aralash); bog' maydoni 160 qism; 24 soatlik kun rejimi (o'ndan birgacha yaxlitlash); ikki yuguruvchi farqi (m da); maoshdan tejalgan; jadvaldan oq munchoqlar foizi; "4 marta ko'p" → necha foiz; 25% olmali, farq 90 → qulupnayli; 20% ko'k = 60 ta → qizillar (qismiga ko'ra butun).
**Rasmlar:** foiz tasmasi bilan bar model (0% — 100%).

#### ☐ 35. QQS, chegirma va omonat foizi + matnli masalalar — D2 69–77; M2 85–96
**Qoidalar ro'yxati:**
- QQS — mahsulot/xizmatga qo'shiladigan soliq (darslikda 12%). QQS miqdori = narxning 12%; jami = narx + QQS (= narxning 112%).
- Chegirma = narxning a%; yangi narx = narx − chegirma (= narxning (100 − a)%).
- Omonat foizi: yillik foyda = omonatning a%; yil oxiridagi mablag' = omonat + foyda.
- Jadvaldagi oraliqqa qarab foizni tanlash (10 001–20 000 → 1%).
- Xarid chekini o'qish.
**Misol turlari:** QQS miqdori va jami narx; chegirma va yangi narx; omonat (A/B bank taqqoslash); ikki do'kon chegirmasi taqqoslash; restoran (ish kunlari chegirmasi); omonatni ikki bankka bo'lish.
**Mashq daftaridan (qo'shimcha):** jadval: buyum — QQS — jami; chegirma jadvali; omonat jadvali (2%, 3%, 1,5%); 2,5% omonat; "15% chegirma" vs "100 000 so'm chegirma" (qaysi do'kon arzon); Kundalik: 8 kitobni alohida yoki birdaniga sotib olish (10% chegirma — farq yo'q).
**Qiyin masala:** guldon — 20% va 30% chegirma farqi.
**Rasmlar:** xarid cheki (o'zimiz chizamiz), foiz tasmasi (100% → 112%, 100% → 70%).

### 10-bob. O'rtacha qiymat

#### ☐ 36. O'rtacha qiymat tushunchasi — D2 79–82; M2 115–118
**Qoidalar ro'yxati:**
- O'rtacha qiymat — miqdorlarni teng taqsimlaganda har biriga to'g'ri keladigan qiymat.
- O'rtacha qiymat = miqdorlarning jami qiymati : miqdorlar soni.
- 0 ham miqdor sifatida sanaladi (10, 8, 0 → soni 3).
- O'rtacha qiymat eng kichik va eng katta qiymat orasida bo'ladi.
**Misol turlari:** likopchalardagi shirinliklar/kublar (ko'chirib tenglash); test ballari (o'nli javob); diagrammadagi suv hajmi; sonlar va miqdorlar o'rtachasi (o'nli kasrlar bilan); jamg'arma diagrammasi.
**Mashq daftaridan (qo'shimcha):** 0 qatnashgan to'plam o'rtachasi (9, 17, 0, 14); o'nli kasrli uzunlik va ml; kunlik kulcha savdosi; ovqat narxi; jadvaldan massa; ustunli diagrammadan ball va somsalar.
**Rasmlar:** likopchalar (ko'chirish strelkasi), ustunli diagramma va o'rtacha chizig'i.

#### ☐ 37. O'rtacha qiymat, jami qiymat va son orasidagi bog'lanish — D2 83–89; M2 119–130
**Qoidalar ro'yxati:**
- Jami qiymat = o'rtacha qiymat × miqdorlar soni.
- Miqdorlar soni = jami qiymat : o'rtacha qiymat.
- Noma'lum bitta qiymat = jami − ma'lum qiymatlar yig'indisi.
- Ikkitasi ma'lum bo'lsa, uchinchisi topiladi.
**Misol turlari:** tasmalar, bolalar massasi, kitoblar soni, talaba yoshi, diagrammadan noma'lum ball, grafik (bemorlar, shanba kuni), siyoh to'kilgan imtihon varag'i, jadvallar, xayriya, non, yirtilgan chek.
**Mashq daftaridan (qo'shimcha):** karta/futbolka/kitob — jami qiymat; sumkalar/tasmalar/idishlar — soni; jadvalni to'ldirish (soni — o'rtacha — jami); 4 sonning o'rtachasi berilgan → noma'lum son; basketbol davrlari; 4- va 5-test teng ball; ko'chat ekish guruhlari (jadval); chiziqli diagramma (dekabrdagi tortlar); yirtilgan diagramma (aprel); kartochkadan 4-sonni tanlash (o'rtacha 92); uzunlikka sakrash — eng katta o'rtacha; ip bilan guruhning o'rtacha bo'yi (amaliy); Kundalik: "o'rtacha 4 ta" — har oy 4 tami?
**Qiyin masala:** siyoh to'kilgan varaq — farq eng ko'pi / eng kamida.
**Rasmlar:** diagramma, "o'rtacha — jami — soni" uchburchagi.

### 11-bob. Burchaklar

#### ☐ 38. To'g'ri chiziqdagi burchaklar (+ Eslang: burchakning gradus o'lchovi) — D2 91–95; M2 131–136
**Qoidalar ro'yxati:**
- Eslang: burchak transportir bilan o'lchanadi (0° dan, ichki yoki tashqi shkala); o'tkir (< 90°), to'g'ri (= 90°), o'tmas (90° dan katta, 180° dan kichik).
- To'g'ri chiziqdagi burchaklar yig'indisi 180°.
- Ikki burchak bo'lsa — qo'shni burchaklar.
- Noma'lum burchak = 180° − ma'lumlar; teng burchaklar bo'lsa — bo'lish (∠c = ∠d → 150° : 2).
- Uch burchak yig'indisi 180° bo'lsa, tashqi nurlar to'g'ri chiziq hosil qiladi (JKL to'g'ri chiziqmi?).
**Misol turlari:** o'lchash; noma'lum burchak (1, 2, 3 ta); teng burchaklar.
**Mashq daftaridan (qo'shimcha):** Eslang: burchakni nomlash (∠ABC) va o'lchash; to'g'ri chiziqda burchaklar nomini yozib tenglik tuzish; 2 to'g'ri chiziq va teng burchaklar bilan noma'lum.
⚠ Kitob xatosi: "30° + 1500°" (to'g'risi 150°).
**Rasmlar:** transportir (interaktiv emas, aniq SVG), to'g'ri chiziqda nurlar.

#### ☐ 39. Vertikal burchaklar — D2 96–99; M2 137–140
**Qoidalar ro'yxati:**
- Ikki to'g'ri chiziq kesishganda qarama-qarshi hosil bo'lgan burchaklar — vertikal burchaklar.
- Vertikal burchaklar o'zaro teng.
- Yonma-yon burchaklar (qo'shni) yig'indisi 180°.
- Vertikal bo'lmagan teng burchaklar ham bo'lishi mumkin (∠EOF = ∠DOC vertikalmi?).
**Misol turlari:** noma'lum burchaklarni topish (2 va 3 to'g'ri chiziq); qaysi burchak teng; hayotiy (dazmol taxtasi, qaychi).
**Mashq daftaridan (qo'shimcha):** "∠a = ∠b o'rinlimi? Ha / Yo'q" (vertikal yoki emas); vertikal juftlarni nomlash; 3 ta to'g'ri chiziq kesishgan; ∠ROT = ∠TOQ.
**Rasmlar:** kesishuvchi chiziqlar, teng burchaklar bir xil rangda.

#### ☐ 40. Nuqta atrofidagi burchaklar — D2 100–104; M2 141–142
**Qoidalar ro'yxati:**
- Nuqta atrofida bir marta to'liq aylanish — 360°.
- Nuqta atrofidagi burchaklar yig'indisi 360°.
- Perpendikulyar chiziqlar: 4 · 90° = 360°.
- Noma'lum = 360° − ma'lumlar; teng burchaklar bo'lsa — bo'lish.
**Misol turlari:** noma'lum burchak (to'g'ri burchak belgisi bilan), aylanada 4 radius, ∠w = 128° bo'lganda yig'indi.
**Mashq daftaridan (qo'shimcha):** nuqta atrofida 204°, 222° kabi katta burchaklar bilan noma'lum.
**Rasmlar:** nuqta atrofida rangli sektorlar.

#### ☐ 41. Noma'lum burchaklarni topish — D2 105–109; M2 143–150
**Qoidalar ro'yxati:**
- Uch xossani birga qo'llash: to'g'ri chiziqdagi (180°), vertikal (teng), nuqta atrofidagi (360°).
- Har qadamda qaysi xossa ishlatilganini yozish.
- Teng burchaklar (∠a = ∠b = ∠c) — umumiy yig'indini bo'lish.
**Misol turlari:** 3 ta to'g'ri chiziq kesishgan; to'g'ri burchak + teng burchaklar; amaliy (qog'oz buklash).
**Mashq daftaridan (qo'shimcha):** ∠POM = 118°, ∠LOP = ∠LON; to'g'ri burchak bilan; 3 ta to'g'ri chiziq; ∠AOE = ∠AOC; ∠POS = 120°, ∠QOR = 140° → ∠ROS; kvadrat diagonali (45°) bilan; Kundalik: ikki bolaning yechim tartibi (∠c avval).
**Qiyin masala:** MON to'g'ri chiziq, ∠MOP = 134°, ∠NOQ = 132° → ∠w.
**Rasmlar:** murakkab chizmalar, xossa yorliqlari.

### 12-bob. Uchburchakning xossalari

#### ☐ 42. Uchburchakning turlari — D2 111–117; M2 151–154
**Qoidalar ro'yxati:**
- Teng tomonli: 3 tomoni teng, 3 burchagi teng, har biri 60°.
- Teng yonli: 2 tomoni teng, teng tomonlar qarshisidagi 2 burchagi teng.
- To'g'ri burchakli: bitta burchagi 90°, qolgan ikkitasi yig'indisi 90°.
- O'tkir burchakli: barcha burchaklari o'tkir (< 90°).
- O'tmas burchakli: bitta burchagi o'tmas (90° < α < 180°).
- Tomonlariga ko'ra va burchaklariga ko'ra turlar; bir uchburchak ikki turga kirishi mumkin (o'tmas burchakli teng yonli).
**Misol turlari:** teng tomon/burchaklarni yozish; burchaklarga qarab turini aniqlash; tasniflash; "mos" uchburchaklar o'yini.
**Mashq daftaridan (qo'shimcha):** bo'sh joyni to'ldirish (teng tomonli — 60°, teng yonli — teng tomon); tomon/burchak o'lchamlariga qarab jadvalga joylash (5 tur); kvadrat va to'g'ri to'rtburchakni diagonal bo'yicha bo'lganda hosil bo'lgan uchburchak turlari (✓); Kundalik: "ikkita to'g'ri burchakli uchburchak bo'ladimi? bitta to'g'ri + bitta o'tmas?"
**Rasmlar:** turlar jadvali, teng tomon belgilari (shtrixlar), yoy belgilari.

#### ☐ 43. Uchburchaklarni chizish — D2 118–122; M2 155–156
**Qoidalar ro'yxati:**
- Katakli daftarda: to'g'ri burchakli (AC ⊥ BC), teng yonli (DE = DF), o'tkir, o'tmas.
- Bir tomon va ikki burchak bo'yicha (BC = 5 cm, ∠B = 50°, ∠C = 45°): kesma → transportir B da → transportir C da → kesishish nuqtasi A.
- Ikki tomon va ular orasidagi burchak (PQ = 5, QR = 6, ∠Q = 60°).
- To'g'ri burchakli teng yonli (uchburchakli chizg'ich bilan perpendikulyar).
- Avval chamalab (qo'lda) chizma, keyin aniq chizma.
**Misol turlari:** 3 xil chizish; berilgan o'lchamlar bo'yicha.
**Mashq daftaridan (qo'shimcha):** BC = 6 cm, 40°, 55°; teng tomonli 5 cm; to'g'ri burchakli 6 va 3 cm; teng yonli 4 cm, 135°; xomaki chizma → aniq chizma; WY = 10, WX = 7, ∠W = 75° (amaliy).
**Rasmlar:** bosqichma-bosqich chizish (1-qadam, 2-qadam ...).

#### ☐ 44. Uchburchakning burchaklari (yig'indisi 180°) — D2 123–131; M2 157–164
**Qoidalar ro'yxati:**
- Uchburchak burchaklari yig'indisi 180° (buklab ko'rsatish: 3 burchak to'g'ri chiziqda).
- Noma'lum burchak = 180° − ikki burchak.
- Teng yonlida: asosdagi burchaklar teng → (180° − uchdagi) : 2; yoki 180° − 2·asosdagi.
- To'g'ri burchakli teng yonlida — 45°.
- Bir nechta uchburchakli shakl: to'g'ri chiziqdagi burchaklar bilan birga (tashqi burchak).
**Misol turlari:** noma'lum burchak; teng yonli; teng tomonli + teng yonli; to'g'ri chiziq + uchburchak (2 usul).
**Mashq daftaridan (qo'shimcha):** bir nechta uchburchakli shakllar: teng tomonli + to'g'ri chiziq; ikki to'g'ri burchak; PS = RS; teng tomonli + teng yonli; ikki teng yonli (JKL, MKL); uch teng burchak (∠VSW = ∠VSU = ∠UST).
**Qiyin masala:** teng yonli ABC + teng tomonli DBC → ∠ACD.
**Rasmlar:** uchburchak burchaklarini "yirtib" to'g'ri chiziqqa qo'yish.

### 13-bob. Parallelogramm, romb va trapetsiya

#### ☐ 45. Parallelogramm, romb va trapetsiyaning xossalari (+ Eslang: kvadrat va to'g'ri to'rtburchak) — D2 133–143; M2 165–172
**Qoidalar ro'yxati:**
- Eslang: kvadrat — 4 to'g'ri burchak, 4 teng tomon, qarama-qarshi tomonlari parallel; to'g'ri to'rtburchak — 4 to'g'ri burchak, qarama-qarshi tomonlari teng va parallel.
- Parallelogramm: qarama-qarshi tomonlari teng va parallel (AB = DC, AB ∥ DC); qarama-qarshi burchaklari teng; bir tomoniga yopishgan burchaklari yig'indisi 180°.
- Romb: 4 tomoni teng; qarama-qarshi tomonlari parallel; qarama-qarshi burchaklari teng; bir tomoniga yopishgan burchaklar yig'indisi 180°.
- Trapetsiya: faqat bir juft qarama-qarshi tomoni parallel (asoslar), qolgan ikkitasi — yon tomonlar; har bir yon tomoniga yopishgan burchaklar yig'indisi 180°.
- Xossalar jadvali (5 shakl × 6 xossa).
**Misol turlari:** tomon/burchak tengliklarini to'ldirish; ikki to'g'ri burchakli trapetsiya; teng yonli trapetsiya; xossalar jadvali; tangram.
**Mashq daftaridan (qo'shimcha):** Eslang: kvadrat/to'g'ri to'rtburchak noma'lum tomonlari; diagonal bilan noma'lum burchak (51°, 45°, 44° va 15°); parallelogramm/romb tomon va burchaklarini to'ldirish; trapetsiyada parallel juftni yozish (||); 4 ta to'g'ri burchakli uchburchakdan parallelogramm, 3 tasidan trapetsiya (amaliy); Kundalik: to'rtburchak burchaklari yig'indisi 180° × 2 = 360°.
**Rasmlar:** har shakl uchun belgilangan teng tomon / parallel strelkalar / burchak yoylari.

#### ☐ 46. To'rtburchaklarni chizish — D2 144–149; M2 173–176
**Qoidalar ro'yxati:**
- Katakli daftarda: parallelogramm (AD = BC = 6 cm, AD ∥ BC), romb, trapetsiya (PS = 5, QR = 8, PS ∥ QR).
- Berilgan o'lchamlar bo'yicha: parallelogramm (AB = 3, BC = 5, ∠B = 50°); trapetsiya (WX = XY = 4, ∠X = 110°, ∠Y = 120°); rombni parallelogramm kabi chizish.
- Parallel kesma — chizg'ich va uchburchakli chizg'ich bilan.
**Misol turlari:** kesmalarni to'ldirib shaklni chizish; o'lcham bo'yicha chizish.
**Mashq daftaridan (qo'shimcha):** ikki tomoni chizilgan shaklni to'ldirish (parallelogramm 5 va 7 cm, 60°; romb 4,5 cm, 40°; trapetsiya 12, 5, 5 cm, 125°, 134°); o'lcham bo'yicha 5 ta shakl (xomaki nusxa bilan).
**Rasmlar:** bosqichma-bosqich chizish.

#### ☐ 47. To'rtburchakning noma'lum burchaklarini topish — D2 150–156; M2 177–182
**Qoidalar ro'yxati:**
- Parallelogramm/romb: qarama-qarshi burchaklar teng; qo'shni burchaklar yig'indisi 180°.
- Trapetsiya: yon tomonga yopishgan burchaklar yig'indisi 180°.
- Diagonal bilan hosil bo'lgan uchburchaklar (burchaklar yig'indisi 180°, teng yonli uchburchak).
- To'rtburchak burchaklari yig'indisi 360° (rombda 280° berilgan → 80°).
**Misol turlari:** parallelogramm, romb, trapetsiya burchaklari; diagonalli masalalar; to'g'ri chiziq davomi bilan.
**Mashq daftaridan (qo'shimcha):** parallelogramm diagonali bilan (55°, 52°); romb (65°, 138°); 5 burchakli shakl (PQRST) ichidagi trapetsiya; trapetsiya + teng tomonli uchburchak; parallelogramm + to'g'ri chiziq; trapetsiya + teng yonli + to'g'ri chiziq; romb + teng yonli (34°, 160°).
**Qiyin masala:** trapetsiya + teng yonli ADG → ∠x.
**Rasmlar:** diagonalli shakllar, rangli burchaklar.

---

## C. Kitobda topilgan xatolar (ko'chirilmaydi)
- M2 55-bet (PDF 59): "380 00 so'm" → 380 000 so'm.
- D1 133-bet (PDF 137): "7680 − 320 = 4480" → 7680 − 3200.
- D1 169-bet (PDF 173): "Bahora 108 so'm olgan" → 108 000 so'm.
- D2 35-bet (PDF 39): "69 0000 ÷ 3" → 69 000 ÷ 3.
- D2 93-bet (PDF 97): "30° + 1500°" → 30° + 150°.

## D. Navbat
1. Umumiy andoza: maruza.css, maruza.js, chizma.js (bir marta).
2. 6-mavzu — yangi andozada qayta (namuna, sizga ko'rsatiladi).
3. 1-bob → 2-bob → ... → 13-bob, mavzuma-mavzu.
**Qoidalar ro'yxati:**
- Eslang: kubning 6 ta kvadrat yog'i bor, barcha qirralari teng; kuboidning 6 ta to'g'ri to'rtburchak (yoki 4 ta to'g'ri to'rtburchak va 2 ta kvadrat) yog'i bor; suyuqlik hajmi ℓ, ml da; sig'im — idishni to'ldiradigan suyuqlik hajmi.
- Birlik kub: 1 birlik × 1 birlik × 1 birlik, hajmi 1 kub birlik.
- Jism hajmi = undagi birlik kublar soni.
- Turli shakldagi jismlar bir xil hajmga ega bo'lishi mumkin.
**Misol turlari:** kublarni sanash; hajmlarni taqqoslash; berilgan kubchalardan turli jism yasash.
**Mashq daftaridan (qo'shimcha):** 16 ta birlik kubdan 4 xil kuboid (jadval: bo'yi, eni, balandligi, hajmi).
**Rasmlar:** izometrik kubchalar.

#### ✅ 16. Uch o'lchamli panjarada fazoviy jismlarni chizish — D1 115–117; M1 141–142
**Qoidalar ro'yxati:**
- Uch o'lchamli (izometrik) nuqtali panjarada qirralar 3 yo'nalishda: tik va ikki qiya.
- Kubning 3 ta o'lchami teng; kuboid — bo'yi, eni, balandligi.
- Bir jismni turli joylashuvda chizish mumkin (3×3×2 kuboid ikki xil).
**Misol turlari:** 1, 2, 4 birlikli kub; 1×3×1, 4×2×3, 5×5×3 kuboid; ikki xil joylashuv.
**Mashq daftaridan (qo'shimcha):** berilgan o'lchamlar (4×1×3, 3×3×3, 2×2×5, 1×6×2, 4×3×3, 5×4×1) bo'yicha izometrik chizish.
**Rasmlar:** izometrik panjara, bosqichma-bosqich chizish.

#### ✅ 17. Jismning turli ko'rinishlari (old, yon, ust) — D1 118–119; M1 143–144
**Qoidalar ro'yxati:**
- Yuqoridan, olddan, yondan ko'rinish — kvadratli panjarada ko'rinadigan kvadrat yuzlar.
- Ko'rinishlar soni jism shakliga bog'liq; orqadagi kubchalar ko'rinishda chiqmaydi.
**Misol turlari:** jismning 3 ko'rinishini chizish; ko'rinishga qarab jismni topish.
**Mashq daftaridan (qo'shimcha):** 6 ta jism uchun 3 ko'rinishni kvadratli panjarada chizish.
**Rasmlar:** izometrik jism + 3 ta kvadrat panjara, ko'z belgisi.

#### ✅ 18. Hajmni cm³ va m³ da o'lchash — D1 120–122; M1 145–146
**Qoidalar ro'yxati:**
- Qirrasi 1 cm bo'lgan kubning hajmi 1 cm³ (santimetr kub).
- Qirrasi 1 m bo'lgan kubning hajmi 1 m³ (metr kub); 1 m = 100 cm.
- Jism hajmi = birlik kublar soni × 1 cm³ (yoki m³).
**Misol turlari:** kubchalarni sanab cm³/m³ da yozish; eng katta / teng hajmlilar.
**Mashq daftaridan (qo'shimcha):** qirrasi 1 m kublardan jism hajmi (m³); eng kichik / teng hajmlar.
**Rasmlar:** 1 cm³ va 1 m³ taqqoslash (odam bo'yi bilan).

#### ✅ 19.1. Kuboid (to'g'ri burchakli parallelepiped) hajmi — D1 123–128; M1 147–150
**Mashq daftaridan (qo'shimcha):** jadval (o'lchamlar → hajm); kub hajmi kuboiddan 2 marta katta → kuboid hajmi; kuboid hajmi 6 ta kub hajmiga teng → bitta kub; kuboidni 3 blokka bo'lib ustma-ust qo'yish; qisman kubchalar bilan to'ldirilgan idishning bo'sh qismi; Matematika kundaligi: muz bo'lagi hajmi (idishning 3/4 qismi).

#### ✅ 19.2. Kub hajmi — D1 123–128; M1 147–150
**Qoidalar ro'yxati:**
- Kuboid hajmi = bo'yi × eni × balandligi (V = a·b·c).
- Kub hajmi = qirrasi × qirrasi × qirrasi (V = a·a·a = a³).
- Hajm birligi — kub birlik (cm³, m³); o'lchamlar bir xil birlikda bo'lishi kerak.
- Kvadrat yuzi (cm²) va kub hajmi (cm³) farqi.
- Kuboid qatlamlarga bo'linadi: bir qatlamdagi kubchalar = bo'yi × eni; qatlamlar soni = balandligi.
**Misol turlari:** jadval (sanab topilgan hajm va o'lchamlar); formula bilan (3×2×3, 12×8×4); kub (2, 3, 6 cm); asosi kvadrat kuboid; shisha idish hajmi; konteyner (hayotiy).
**Eslatma:** 19.1/19.2 simulyatorlarida qirralar yig'indisi va sirt yuzi bor — bu darslikda shu mavzuda yo'q; ma'ruzada qo'shimcha sifatida berish mumkin (qaror kerak).
**Rasmlar:** qatlamli kuboid, kub.

#### ☐ 20. Suyuqlik hajmi: cm³, m³, litr, ml + matnli masalalar — D1 129–138; M1 151–164
**Qoidalar ro'yxati:**
- 1 ml = 1 cm³; 1 ℓ = 1000 ml = 1000 cm³; qirrasi 10 cm bo'lgan kubga 1 ℓ sig'adi.
- Idishdagi suv hajmi = bo'yi × eni × suv sathi balandligi.
- To'ldirish uchun kerak suv = idish hajmi − suv hajmi (yoki bo'sh qism balandligi bilan).
- Idishning qismi (yarmi, 2/3, 4/5) to'ldirilgan holat.
**Misol turlari:** ml ↔ cm³ ↔ ℓ almashtirish (8 ℓ 34 ml); idishdagi suv; to'ldirish uchun kerak suv (2 usul); hovuz sig'imi; stakanlarga quyish (nechta stakan); ko'za bilan necha marta; bir idishdan boshqasiga quyish; "2 baravar katta" fikrini tekshirish.
**Mashq daftaridan (qo'shimcha):** ℓ ml → cm³ (3 ℓ 248 ml, 8 ℓ 7 ml); cm³ → ℓ va ml (3744 cm³ = 3 ℓ 744 ml); suv sathi bo'yicha hajm; asosi kvadrat idish sig'imi; 2 cm dan yarmigacha to'ldirish; 4/7, 5/6 qismdagi suv; to'kib, sath 9 cm qolguncha; kuboiddan kubga quyish; idish 3/5 to'la + 2 ℓ → toshib ketgan suv (ml).
**Qiyin masala:** qatlam qo'shib boriladigan kub jismlar — 6-jism hajmi (qonuniyat).
⚠ Kitob xatosi: 2-usulda "7680 − 320 = 4480" (to'g'risi 7680 − 3200).
**Rasmlar:** suv sathli idish, menzurka.

### 6-bob. Nisbatlar

#### ☐ 21. Nisbat tushunchasi — D1 140–145; M1 165–168
**Qoidalar ro'yxati:**
- Ikki miqdorni taqqoslash: a : b ("a ga b" deb o'qiladi).
- Tartib muhim: ko'k : qizil = 4 : 1, qizil : ko'k = 1 : 4.
- Nisbatda o'lchov birliklari yozilmaydi (5 kg : 6 kg → 5 : 6); miqdorlar bir xil birlikda bo'lishi kerak.
- Qismning butunga nisbati (qizil : jami = 3 : 8).
- "4 marta ko'p" → 4 : 1.
**Misol turlari:** rasmdan nisbat; massa/hajm nisbati; qismning jamiga nisbati; to'g'ri to'rtburchak bo'yi : eni, bo'yi : perimetri; katakli rasm; ichimlik retsepti (qaysi biri shirinroq).
**Mashq daftaridan (qo'shimcha):** nisbatni chizma-model bilan tasvirlash (P : Q = 6 : 5); jadvaldan nisbat (stikerlar); "4 marta, 2 marta ko'p" → qismning jamiga nisbati.
**Rasmlar:** buyumlar qatori, ikki qatorli bo'lak modeli.

#### ☐ 22. Teng kuchli nisbatlar — D1 146–154; M1 169–178
**Qoidalar ro'yxati:**
- Nisbatning ikkala hadini bir xil songa ko'paytirsak yoki bo'lsak, teng kuchli nisbat hosil bo'ladi (12 : 8 = 6 : 4 = 3 : 2).
- Qisqarmas shakl: hadlar eng katta umumiy bo'luvchiga bo'linadi (4 : 8 → 1 : 2); 2 : 4 hali qisqarmas emas.
- Teng kuchli nisbatdagi noma'lum had (5 : 20 = 1 : □; 2 : 3 = □ : 18) — teng kuchli kasrlardagidek.
- Kasr va nisbat bog'lanishi: 1/4 = 6/24 ↔ 1 : 4 = 6 : 24.
**Misol turlari:** guruhlarga ajratish; qisqarmas shaklga keltirish; noma'lum had; hayotiy (sinfdagi qiz/o'g'il, markalar, pullar); retsept (5 piyola un : 2 bo'lak sariyog' — 3 ta tort).
**Mashq daftaridan (qo'shimcha):** rasmdan guruhlarga ajratib qisqarmas shakl (namuna); 100 ml : 60 ml, 36 m : 48 m; yoshlar nisbati 6 yildan keyin (12 va 16); 8×8 katakli qog'oz (yana 8 katak bo'yaldi); so'zlar bilan nisbat yozish (mototsikl : mashina = 5 : 6); noma'lum hadli tengliklar (16 : □ = □ : 21 kabi).
**Rasmlar:** guruhlarga ajratilgan shakllar.

#### ☐ 23. Miqdor va nisbatga ko'ra boshqa miqdorni topish — D1 155–156; M1 179–180
**Qoidalar ro'yxati:**
- 1-usul: teng kuchli nisbat (4 : 5 = 800 : □, ×200).
- 2-usul: bo'laklar usuli (4 bo'lak = 800 → 1 bo'lak = 200 → 5 bo'lak = 1000).
- Jami miqdorni topish (3 + 4 = 7 bo'lak).
**Misol turlari:** idishlardagi suv, markalar, jadval (nisbat — biri — jami), jo'natmalar massasi, tasmalar, pul, maktabdagi o'g'il/qiz.
**Mashq daftaridan (qo'shimcha):** sovg'a to'plamlari (2 o'chirg'ich : 5 qalam — 4 to'plam, 30 qalam, 18 o'chirg'ich); sayohat qutisi (4 pasta : 3 cho'tka); ferma (tovuq : o'rdak, jami).
**Rasmlar:** bo'lak modeli.

#### ☐ 24. Jami miqdor va nisbatga ko'ra qismlarni topish + ikki miqdor nisbatiga doir matnli masalalar — D1 157–164; M1 181–188
**Qoidalar ro'yxati:**
- Jami bo'laklar soni = nisbat hadlari yig'indisi (3 : 5 → 8 bo'lak).
- 1 bo'lak = jami : bo'laklar soni; har bir qism = 1 bo'lak × o'z hadi.
- Tekshirish: qismlar yig'indisi = jami, nisbati = berilgan nisbat.
- Farq berilgan masala: hadlar farqi bo'laklari (5 : 3, farq 16 → 2 bo'lak = 16).
- Bir xil narsalar takrorlansa (3 bola chiptasi + 2 kattalar) — bo'laklarni sanash (19 bo'lak).
**Misol turlari:** pishiriqlarni bo'lish; olmalarni xaltalarga; pulni bo'lish (jadval); sharbatni bo'lish; o'g'il/qiz; pechenye; chiptalar narxi; yosh (ota : o'g'il); tasmani bo'lish; ruchkalar aksiyasi; ustunli diagramma.
**Mashq daftaridan (qo'shimcha):** 1 ℓ sharbatni 3 : 5 bo'lish (ml da); "har 7 tadan 4 tasi" — 35 dan nechta; farq 46 000 (7 : 5); Humoyunda 2 marta ko'p; yoshlar 5 yil oldin; vazn nisbati; ertaklar farqi 245; ip 72 cm, 24 cm bo'lak; X, Y, Z yuklar (2 marta, 1 : 3).
**Rasmlar:** bo'lak modeli, ustunli diagramma.

#### ☐ 25. Uchta miqdorning nisbati + matnli masalalar — D1 165–172; M1 189–203
**Qoidalar ro'yxati:**
- a : b : c — uch miqdorni taqqoslash.
- Qisqarmas shakl: uchala had umumiy bo'luvchiga bo'linadi (4 : 6 : 12 = 2 : 3 : 6).
- Noma'lum had (2 : 4 : 5 = 8 : □ : 20).
- Bo'laklar usuli: eng qisqa / eng uzun / farq (3 : 2 : 5, eng qisqasi 14 m).
**Misol turlari:** qisqarmas shakl; tushirib qoldirilgan hadlar; mevalar massasi; kinoteatr; arqon; uchburchak tomonlari; stikerlar; pullar; kvadrat qismlari yuzi.
**Mashq daftaridan (qo'shimcha):** 3 shakl yuzlari nisbati (78 : 48 : 18); jadvaldan 3 bolaning markalari nisbati; teng kuchli uch hadli nisbatlarda 2 ta noma'lum; ichimlik retsepti (2 : 4 : 12, 6 stakan); qolgan tugmalar nisbati; kupon aksiyasi (30 000 so'm → 2000 chegirma + 3 kupon); vaznlar zanjiri (3 marta, 2 marta); kvadrat qismlari (B : C = 3 : 8); kinoteatr farqi 45; 3 : 3 : 2; nisbat o'zgarishi (Sardor 1500 sarfladi); to'g'ri to'rtburchakni 2 : 3 : 5 yuzlarga bo'lish (amaliy); A : B = 2 : 5, B − C = 12 cm²; Kundalik: "A va B sinfdagi bolalar soni turlicha bo'lishi mumkinmi?"
**Qiyin masala:** ingliz : o'zbek kitoblar = 2 : 5, farq 15 → jami.
⚠ Kitob xatosi: "Bahora 108 so'm olgan" (to'g'risi 108 000 so'm).
**Rasmlar:** uch qatorli bo'lak modeli.

### 7-bob. O'nli kasrlar (2-qism)

#### ☐ 26. O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish (+ Eslang: o'nli kasrlar) — D2 2–8, 12–16; M2 1–8, 13–16
**Qoidalar ro'yxati:**
- Eslang: o'nli kasr xonalari (o'ndan birlar, yuzdan birlar, mingdan birlar), xona yoyilmasi (0,1 + 0,03 + 0,004 = 0,134); ustun usulida qo'shish/ayirish (vergul tagiga vergul); o'nli kasrni natural songa ko'paytirish va bo'lish (yaxlitlash bilan); aralash son ↔ o'nli kasr (3 2/5 = 3,4; 8,25 = 8 1/4).
- O'nli kasrni 10 / 100 / 1000 ga ko'paytirish uchun vergul mos ravishda 1 / 2 / 3 xona o'ngga suriladi.
- Xona yetmasa, oxiriga nol yoziladi (5,8 · 1000 = 5800).
- 10 / 100 / 1000 ga bo'lish uchun vergul 1 / 2 / 3 xona chapga suriladi; xona yetmasa, oldiga nol yoziladi (3 : 100 = 0,03; 2 : 1000 = 0,002).
- Natural sonni 10/100/1000 ga bo'lish ham shunday: 4 = 4,0 → 0,4.
- Xona jadvalida raqamlar o'ngga / chapga siljiydi (vergul joyida).
**Misol turlari:** ko'paytiring/bo'ling; tushirib qoldirilgan ko'paytuvchi/bo'luvchi (0,105 · □ = 1,05; 8,5 : □ = 0,085); jadval (:10, :100, :1000).
**Mashq daftaridan (qo'shimcha):** Eslang: sonli tugmalardan o'nli kasr yozish (10 + 0,2 + 0,005); qo'shish, ayirish, natural songa ko'paytirish, yaxlitlab bo'lish; o'nli kasr → qisqarmas oddiy kasr (2,125); xona jadvalida ×10/×100/×1000 va :10/:100/:1000 ni to'ldirish; tushirib qoldirilgan son (× 2,674 = 2674).
**Rasmlar:** o'nli xona jadvali, vergul siljishi animatsion strelka.

#### ☐ 27. O'nli kasrni o'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish — D2 9–11, 17–18; M2 9–12, 17–20
**Qoidalar ro'yxati:**
- 2,3 · 20 = 2,3 · 2 · 10 (yoki 2,3 · 10 · 2) — tartib farqi yo'q.
- 6,085 · 500 = 6,085 · 100 · 5.
- 6,3 : 30 = 6,3 : 3 : 10 (yoki : 10 : 3).
- Hayotiy: massa × son (mixlar, sovun qutilari), sig'im × son.
**Misol turlari:** ko'paytiring; bo'ling; jadval (×20, ×200, ×2000; :20, :200, :2000); "jami miqdor" jadvali.
**Mashq daftaridan (qo'shimcha):** g'ishtlar massasi (×100), tasmalar uzunligi (×50), ichimlik (×30), kitoblar (×4000); g'isht (570 kg : 200), tasma (39,6 m : 30), chipta narxi (2 250 000 : 50).
**Rasmlar:** ikki bosqichli strelka zanjiri.

#### ☐ 28. O'lchov birliklarini almashtirish + matnli masalalar (+ Eslang: birliklar) — D2 19–32; M2 21–40
**Qoidalar ro'yxati:**
- 1 m = 100 cm; 1 km = 1000 m; 1 kg = 1000 g; 1 ℓ = 1000 ml.
- Katta birlikdan kichikka: ko'paytiriladi (4,7 m = 470 cm); kichikdan kattaga: bo'linadi (78 cm = 0,78 m).
- Ikki birlikli yozuvni bitta birlikka: 6 m 47 cm = 6,47 m; 7 ℓ 5 ml = 7,005 ℓ (nollar!).
- Teskari: 5,04 m = 5 m 4 cm; 8,35 km = 8 km 350 m.
- Son o'qida ikki birlik (km va m) yonma-yon.
- Matnli masalalarda avval birliklarni bir xil qilish; chamalab tekshirish; kalkulyator tugmalari ketma-ketligi.
**Misol turlari:** son o'qidan o'qish; almashtirish (8 tur); loto o'yini (teng miqdorlar); masalalar: idishdan quyish, sim bo'laklari (cm da), yuz → perimetr, vazn (ikki juftlik yig'indisi), quti + un + shakar, sharbat stakanlarga, tasmalar, kolba (1/4 qismi), ikki idish tenglashishi, qiyma/kotlet, guruch, gulkaram/karam, sumkalar narxi.
**Mashq daftaridan (qo'shimcha):** ikki birlikli → bir birlik (10 m 5 cm = 10,05 m; 23 kg 25 g); bir birlik → ikki birlik (105,475 ℓ); qaytim (100 − 38,10 ming); yuz (42,8 × 23); 439 614 : 28; qog'ozsochiq (g → kg); idishlar (ml va ℓ aralash); shakar qayta joylash; ikki son (yig'indisi 112,5, 5 marta); idishlar tenglashishi; 3 vazn (farqlar berilgan); haftalik yig'ish (ish kuni / dam olish kuni); qog'ozjild va ruchka (2 tenglama); simdan to'g'ri to'rtburchak (2,1 m, bo'yi 45 cm); perimetr bo'ylab yugurish — to'xtash joylari va qisqa masofa (amaliy); 8 futbolkaga yetmadi / 5 tadan ortdi; Kundalik: 0,2 × 0,3 = 0,6 xatosi (to'g'risi 0,06).
**Qiyin masala:** uch qizning puli (farqlar berilgan).
**Rasmlar:** ikki shkalali son o'qi, o'lchov idishi.

### 8-bob. Me'yor

#### ☐ 29. Me'yorni topish — D2 34–37; M2 41–44
**Qoidalar ro'yxati:**
- Me'yor — vaqt (yoki boshqa) birligida bajarilgan ish miqdori: me'yor = umumiy miqdor : birliklar soni.
- Yozilishi: 120 sahifa/min, 1,5 ℓ/soat, 23 000 so'm/kg.
- Narxlarni taqqoslash: 1 kg (1 m, 1 dona) narxiga keltirib solishtirish — qaysi qadoq arzon.
- Grafikdan me'yorni o'qish.
**Misol turlari:** printer, jo'mrak, kukun qadoqlari, hovuz, mebel korxonasi, grafik, atlas narxi; yurak urishi (amaliy).
**Mashq daftaridan (qo'shimcha):** gilam 1 m² narxi; benzin (km/ℓ); avtoturargoh soati; so'z terish; nusxalash; ish haqi; chipta; jo'mrak (ℓ/min); Kundalik: printerlar tezligini taqqoslash (X: 5 min — 400, Y: 8 min — 600) — Akmalning xatosi.
**Rasmlar:** "5 min → 600 sahifa, 1 min → ?" strelkali sxema; chiziqli grafik.

#### ☐ 30. Me'yorga ko'ra umumiy miqdorni topish — D2 38–42; M2 45–50
**Qoidalar ro'yxati:**
- Umumiy miqdor = me'yor × birliklar soni.
- Avval 1 birlikka keltirish, keyin ko'paytirish (2 min → 10 °C, 1 min → 5 °C, 7 min → 35 °C).
- Birliklarni moslash (1 soat = 60 min).
- Tarif jadvallari: "…gacha" (pochta), "dastlabki 1 soat + keyingi har yarim soat" (avtoturargoh), bosqichli tarif (taksi).
**Misol turlari:** ish haqi, harorat, banka ishlab chiqarish, pochta, avtoturargoh (kun/tun), panjara narxi (perimetr × narx), qo'ng'iroq narxi, changyutkich, taksi.
**Mashq daftaridan (qo'shimcha):** hovuzdan oqish (1 min va 4 min); stul (1 kun va 11 kun); printer (sekund → minut); retsept (700 g un : 10 tuxum → 15 tuxum); avtoturargoh va velosiped ijarasi (vaqt oralig'i); pochta (har biri alohida); qo'shimcha ish soatlari haqi.
**Rasmlar:** strelkali sxema, vaqt chizig'i (10:00 → 12:30).

#### ☐ 31. Birliklar sonini topish + matnli masalalar — D2 43–50; M2 51–64
**Qoidalar ro'yxati:**
- Birliklar soni (vaqt) = umumiy miqdor : me'yor.
- 1 birlik ish uchun ketgan vaqt (1/50 min) orqali ham topiladi.
- Uch miqdor bog'liq: me'yor, umumiy miqdor, birliklar soni — ikkitasi ma'lum bo'lsa, uchinchisi topiladi.
- Hajm masalalari: idish hajmi (cm³ → ℓ) : quyilish me'yori (ℓ/min) = vaqt.
**Misol turlari:** so'z yozish, idish to'lishi, detal, qo'g'irchoq, kafel narxi, jadvallar (yozish vaqti, o'chirg'ichlar soni), ish soatlari, ijara; benzin (km/ℓ, narx), do'lana (100 g narxi), sekundiga ml, printer (10 s), restoran taqqoslash, grafikdan tezlik.
**Mashq daftaridan (qo'shimcha):** ish haqi → soat; detal; kafel (m²); gilos (100 g narxi → kg); grafikdan jo'mrak tezligi va 40 ℓ vaqti; valyuta kursi grafigi; sayohat narxlari jadvali (kattalar/bolalar, lyuks); idishning 3/4 qismi oqishi; 1/3 to'la idish to'lishi; arzon xarid (5 tasi / 10 tasi narxi, 55 ta olma); konteyner (9:10 dan 9:30 gacha 3,3 ℓ, 50 min); 1400 banka/min × 5 soat; Kundalik: printerlarni taqqoslash.
**Qiyin masala:** ikki idish, ikki jo'mrak — to'lish vaqtlari farqi.
**Rasmlar:** uchburchak "me'yor — miqdor — vaqt" sxemasi, idish.

### 9-bob. Foizlar

#### ☐ 32. Foiz tushunchasi (+ Eslang: bir butunning qismlari) — D2 52–55; M2 65–68
**Qoidalar ro'yxati:**
- Eslang: 100 katakli kvadratda qism: 25/100 = 0,25 = 1/4; kasrni maxraji 100 bo'lgan kasrga keltirish.
- 1% = 1/100 (yuzdan bir). a% = a/100. Belgisi: %.
- Bir butun = 100%. Qolgan qism: 100% − 12% = 88%.
- O'nli kasr → foiz: 0,91 = 91/100 = 91%.
**Misol turlari:** bo'yalgan kataklar foizi; erkak/ayol tomoshabinlar; kasr → foiz; o'nli kasr → foiz; pulning necha foizi ishlatilgan/qolgan; hayotiy e'lonlar (chegirma, QQS, omonat).
**Mashq daftaridan (qo'shimcha):** bo'yalgan/bo'yalmagan qismni oddiy va o'nli kasrda; maxraji 100 bo'lgan kasrga keltirish (□/4 = □/100); 0,7 = □/100; berilgan foizni bo'yash (9%, 73%); "100 dan 85 = □%"; jadval (foiz — oddiy kasr — o'nli kasr).
**Rasmlar:** 100 katakli kvadrat (bir nechta rang).

#### ☐ 33. Oddiy kasr, o'nli kasr va foiz orasidagi bog'lanish — D2 56–61; M2 69–72
**Qoidalar ro'yxati:**
- Kasr → foiz: 1-usul — maxraji 100 bo'lgan kasrga keltirish; 2-usul — kasrni 100% ga ko'paytirish (3/5 · 100% = 60%).
- Maxraj 100 dan katta bo'lsa — qisqartirish (16/200 = 8/100 = 8%).
- Bo'linmasa — yaxlitlash (3/22 ≈ 13,64%).
- O'nli kasr → foiz: 100% ga ko'paytirish (0,7 = 70%).
- Foiz → oddiy kasr: a/100 va qisqartirish (75% = 3/4; 6% = 3/50).
- Foiz → o'nli kasr: 100 ga bo'lish (7% = 0,07).
- Foizlar tasmasi: 0% ↔ 0, 50% ↔ 0,5, 100% ↔ 1.
**Misol turlari:** 3 yo'nalishli almashtirish; 100 va 200 katakli to'r; foiz tasmasida o'qish; "O'zbekiston aholisining necha foizi shaharda".
**Mashq daftaridan (qo'shimcha):** kasrlarni tasmada bo'yash va foizda yozish (30%, 7%); foiz ↔ kasr ↔ o'nli kasr juftlarini chiziq bilan tutashtirish; 400 katakli xarita — hayvon qafaslari foizi (amaliy).
**Rasmlar:** foiz tasmasi (o'lchov tasmasi), uchburchak kasr ↔ o'nli ↔ foiz.

#### ☐ 34. Miqdorning foizi + matnli masalalar — D2 62–68; M2 73–84
**Qoidalar ro'yxati:**
- Sonning a% ini topish: 1-usul — a/100 · son; 2-usul — 1% = son : 100, keyin × a.
- Bir son ikkinchisining necha foizi: (qism : butun) · 100% (60 : 200 · 100% = 30%).
- Qolgan qism foizi: 100% − a%.
- Foiz farqi orqali (70% − 25% = 45% → 45% · 80).
**Misol turlari:** maktabdagi qizlar; rus tilidagi kitoblar; kg/ml foizi (37,5%); sport anjomi (sarflangan / qolgan); hayvonlar ko'rgazmasi; jadvaldan sinf foizi; javon ulushlari; konsert; basketbol; maosh sarfi; chiptalar (kasr + foiz aralash); o'g'il/qiz farqi.
**Mashq daftaridan (qo'shimcha):** "necha foizi" (320 so'mning necha foizi 80 so'm); piyoda qatnaydiganlar, mevali tortlar, marafon, so'rovnoma; tayoqning bo'yalgan qismi; test natijasi; tortlar (soni va foizi aralash); bog' maydoni 160 qism; 24 soatlik kun rejimi (o'ndan birgacha yaxlitlash); ikki yuguruvchi farqi (m da); maoshdan tejalgan; jadvaldan oq munchoqlar foizi; "4 marta ko'p" → necha foiz; 25% olmali, farq 90 → qulupnayli; 20% ko'k = 60 ta → qizillar (qismiga ko'ra butun).
**Rasmlar:** foiz tasmasi bilan bar model (0% — 100%).

#### ☐ 35. QQS, chegirma va omonat foizi + matnli masalalar — D2 69–77; M2 85–96
**Qoidalar ro'yxati:**
- QQS — mahsulot/xizmatga qo'shiladigan soliq (darslikda 12%). QQS miqdori = narxning 12%; jami = narx + QQS (= narxning 112%).
- Chegirma = narxning a%; yangi narx = narx − chegirma (= narxning (100 − a)%).
- Omonat foizi: yillik foyda = omonatning a%; yil oxiridagi mablag' = omonat + foyda.
- Jadvaldagi oraliqqa qarab foizni tanlash (10 001–20 000 → 1%).
- Xarid chekini o'qish.
**Misol turlari:** QQS miqdori va jami narx; chegirma va yangi narx; omonat (A/B bank taqqoslash); ikki do'kon chegirmasi taqqoslash; restoran (ish kunlari chegirmasi); omonatni ikki bankka bo'lish.
**Mashq daftaridan (qo'shimcha):** jadval: buyum — QQS — jami; chegirma jadvali; omonat jadvali (2%, 3%, 1,5%); 2,5% omonat; "15% chegirma" vs "100 000 so'm chegirma" (qaysi do'kon arzon); Kundalik: 8 kitobni alohida yoki birdaniga sotib olish (10% chegirma — farq yo'q).
**Qiyin masala:** guldon — 20% va 30% chegirma farqi.
**Rasmlar:** xarid cheki (o'zimiz chizamiz), foiz tasmasi (100% → 112%, 100% → 70%).

### 10-bob. O'rtacha qiymat

#### ☐ 36. O'rtacha qiymat tushunchasi — D2 79–82; M2 115–118
**Qoidalar ro'yxati:**
- O'rtacha qiymat — miqdorlarni teng taqsimlaganda har biriga to'g'ri keladigan qiymat.
- O'rtacha qiymat = miqdorlarning jami qiymati : miqdorlar soni.
- 0 ham miqdor sifatida sanaladi (10, 8, 0 → soni 3).
- O'rtacha qiymat eng kichik va eng katta qiymat orasida bo'ladi.
**Misol turlari:** likopchalardagi shirinliklar/kublar (ko'chirib tenglash); test ballari (o'nli javob); diagrammadagi suv hajmi; sonlar va miqdorlar o'rtachasi (o'nli kasrlar bilan); jamg'arma diagrammasi.
**Mashq daftaridan (qo'shimcha):** 0 qatnashgan to'plam o'rtachasi (9, 17, 0, 14); o'nli kasrli uzunlik va ml; kunlik kulcha savdosi; ovqat narxi; jadvaldan massa; ustunli diagrammadan ball va somsalar.
**Rasmlar:** likopchalar (ko'chirish strelkasi), ustunli diagramma va o'rtacha chizig'i.

#### ☐ 37. O'rtacha qiymat, jami qiymat va son orasidagi bog'lanish — D2 83–89; M2 119–130
**Qoidalar ro'yxati:**
- Jami qiymat = o'rtacha qiymat × miqdorlar soni.
- Miqdorlar soni = jami qiymat : o'rtacha qiymat.
- Noma'lum bitta qiymat = jami − ma'lum qiymatlar yig'indisi.
- Ikkitasi ma'lum bo'lsa, uchinchisi topiladi.
**Misol turlari:** tasmalar, bolalar massasi, kitoblar soni, talaba yoshi, diagrammadan noma'lum ball, grafik (bemorlar, shanba kuni), siyoh to'kilgan imtihon varag'i, jadvallar, xayriya, non, yirtilgan chek.
**Mashq daftaridan (qo'shimcha):** karta/futbolka/kitob — jami qiymat; sumkalar/tasmalar/idishlar — soni; jadvalni to'ldirish (soni — o'rtacha — jami); 4 sonning o'rtachasi berilgan → noma'lum son; basketbol davrlari; 4- va 5-test teng ball; ko'chat ekish guruhlari (jadval); chiziqli diagramma (dekabrdagi tortlar); yirtilgan diagramma (aprel); kartochkadan 4-sonni tanlash (o'rtacha 92); uzunlikka sakrash — eng katta o'rtacha; ip bilan guruhning o'rtacha bo'yi (amaliy); Kundalik: "o'rtacha 4 ta" — har oy 4 tami?
**Qiyin masala:** siyoh to'kilgan varaq — farq eng ko'pi / eng kamida.
**Rasmlar:** diagramma, "o'rtacha — jami — soni" uchburchagi.

### 11-bob. Burchaklar

#### ☐ 38. To'g'ri chiziqdagi burchaklar (+ Eslang: burchakning gradus o'lchovi) — D2 91–95; M2 131–136
**Qoidalar ro'yxati:**
- Eslang: burchak transportir bilan o'lchanadi (0° dan, ichki yoki tashqi shkala); o'tkir (< 90°), to'g'ri (= 90°), o'tmas (90° dan katta, 180° dan kichik).
- To'g'ri chiziqdagi burchaklar yig'indisi 180°.
- Ikki burchak bo'lsa — qo'shni burchaklar.
- Noma'lum burchak = 180° − ma'lumlar; teng burchaklar bo'lsa — bo'lish (∠c = ∠d → 150° : 2).
- Uch burchak yig'indisi 180° bo'lsa, tashqi nurlar to'g'ri chiziq hosil qiladi (JKL to'g'ri chiziqmi?).
**Misol turlari:** o'lchash; noma'lum burchak (1, 2, 3 ta); teng burchaklar.
**Mashq daftaridan (qo'shimcha):** Eslang: burchakni nomlash (∠ABC) va o'lchash; to'g'ri chiziqda burchaklar nomini yozib tenglik tuzish; 2 to'g'ri chiziq va teng burchaklar bilan noma'lum.
⚠ Kitob xatosi: "30° + 1500°" (to'g'risi 150°).
**Rasmlar:** transportir (interaktiv emas, aniq SVG), to'g'ri chiziqda nurlar.

#### ☐ 39. Vertikal burchaklar — D2 96–99; M2 137–140
**Qoidalar ro'yxati:**
- Ikki to'g'ri chiziq kesishganda qarama-qarshi hosil bo'lgan burchaklar — vertikal burchaklar.
- Vertikal burchaklar o'zaro teng.
- Yonma-yon burchaklar (qo'shni) yig'indisi 180°.
- Vertikal bo'lmagan teng burchaklar ham bo'lishi mumkin (∠EOF = ∠DOC vertikalmi?).
**Misol turlari:** noma'lum burchaklarni topish (2 va 3 to'g'ri chiziq); qaysi burchak teng; hayotiy (dazmol taxtasi, qaychi).
**Mashq daftaridan (qo'shimcha):** "∠a = ∠b o'rinlimi? Ha / Yo'q" (vertikal yoki emas); vertikal juftlarni nomlash; 3 ta to'g'ri chiziq kesishgan; ∠ROT = ∠TOQ.
**Rasmlar:** kesishuvchi chiziqlar, teng burchaklar bir xil rangda.

#### ☐ 40. Nuqta atrofidagi burchaklar — D2 100–104; M2 141–142
**Qoidalar ro'yxati:**
- Nuqta atrofida bir marta to'liq aylanish — 360°.
- Nuqta atrofidagi burchaklar yig'indisi 360°.
- Perpendikulyar chiziqlar: 4 · 90° = 360°.
- Noma'lum = 360° − ma'lumlar; teng burchaklar bo'lsa — bo'lish.
**Misol turlari:** noma'lum burchak (to'g'ri burchak belgisi bilan), aylanada 4 radius, ∠w = 128° bo'lganda yig'indi.
**Mashq daftaridan (qo'shimcha):** nuqta atrofida 204°, 222° kabi katta burchaklar bilan noma'lum.
**Rasmlar:** nuqta atrofida rangli sektorlar.

#### ☐ 41. Noma'lum burchaklarni topish — D2 105–109; M2 143–150
**Qoidalar ro'yxati:**
- Uch xossani birga qo'llash: to'g'ri chiziqdagi (180°), vertikal (teng), nuqta atrofidagi (360°).
- Har qadamda qaysi xossa ishlatilganini yozish.
- Teng burchaklar (∠a = ∠b = ∠c) — umumiy yig'indini bo'lish.
**Misol turlari:** 3 ta to'g'ri chiziq kesishgan; to'g'ri burchak + teng burchaklar; amaliy (qog'oz buklash).
**Mashq daftaridan (qo'shimcha):** ∠POM = 118°, ∠LOP = ∠LON; to'g'ri burchak bilan; 3 ta to'g'ri chiziq; ∠AOE = ∠AOC; ∠POS = 120°, ∠QOR = 140° → ∠ROS; kvadrat diagonali (45°) bilan; Kundalik: ikki bolaning yechim tartibi (∠c avval).
**Qiyin masala:** MON to'g'ri chiziq, ∠MOP = 134°, ∠NOQ = 132° → ∠w.
**Rasmlar:** murakkab chizmalar, xossa yorliqlari.

### 12-bob. Uchburchakning xossalari

#### ☐ 42. Uchburchakning turlari — D2 111–117; M2 151–154
**Qoidalar ro'yxati:**
- Teng tomonli: 3 tomoni teng, 3 burchagi teng, har biri 60°.
- Teng yonli: 2 tomoni teng, teng tomonlar qarshisidagi 2 burchagi teng.
- To'g'ri burchakli: bitta burchagi 90°, qolgan ikkitasi yig'indisi 90°.
- O'tkir burchakli: barcha burchaklari o'tkir (< 90°).
- O'tmas burchakli: bitta burchagi o'tmas (90° < α < 180°).
- Tomonlariga ko'ra va burchaklariga ko'ra turlar; bir uchburchak ikki turga kirishi mumkin (o'tmas burchakli teng yonli).
**Misol turlari:** teng tomon/burchaklarni yozish; burchaklarga qarab turini aniqlash; tasniflash; "mos" uchburchaklar o'yini.
**Mashq daftaridan (qo'shimcha):** bo'sh joyni to'ldirish (teng tomonli — 60°, teng yonli — teng tomon); tomon/burchak o'lchamlariga qarab jadvalga joylash (5 tur); kvadrat va to'g'ri to'rtburchakni diagonal bo'yicha bo'lganda hosil bo'lgan uchburchak turlari (✓); Kundalik: "ikkita to'g'ri burchakli uchburchak bo'ladimi? bitta to'g'ri + bitta o'tmas?"
**Rasmlar:** turlar jadvali, teng tomon belgilari (shtrixlar), yoy belgilari.

#### ☐ 43. Uchburchaklarni chizish — D2 118–122; M2 155–156
**Qoidalar ro'yxati:**
- Katakli daftarda: to'g'ri burchakli (AC ⊥ BC), teng yonli (DE = DF), o'tkir, o'tmas.
- Bir tomon va ikki burchak bo'yicha (BC = 5 cm, ∠B = 50°, ∠C = 45°): kesma → transportir B da → transportir C da → kesishish nuqtasi A.
- Ikki tomon va ular orasidagi burchak (PQ = 5, QR = 6, ∠Q = 60°).
- To'g'ri burchakli teng yonli (uchburchakli chizg'ich bilan perpendikulyar).
- Avval chamalab (qo'lda) chizma, keyin aniq chizma.
**Misol turlari:** 3 xil chizish; berilgan o'lchamlar bo'yicha.
**Mashq daftaridan (qo'shimcha):** BC = 6 cm, 40°, 55°; teng tomonli 5 cm; to'g'ri burchakli 6 va 3 cm; teng yonli 4 cm, 135°; xomaki chizma → aniq chizma; WY = 10, WX = 7, ∠W = 75° (amaliy).
**Rasmlar:** bosqichma-bosqich chizish (1-qadam, 2-qadam ...).

#### ☐ 44. Uchburchakning burchaklari (yig'indisi 180°) — D2 123–131; M2 157–164
**Qoidalar ro'yxati:**
- Uchburchak burchaklari yig'indisi 180° (buklab ko'rsatish: 3 burchak to'g'ri chiziqda).
- Noma'lum burchak = 180° − ikki burchak.
- Teng yonlida: asosdagi burchaklar teng → (180° − uchdagi) : 2; yoki 180° − 2·asosdagi.
- To'g'ri burchakli teng yonlida — 45°.
- Bir nechta uchburchakli shakl: to'g'ri chiziqdagi burchaklar bilan birga (tashqi burchak).
**Misol turlari:** noma'lum burchak; teng yonli; teng tomonli + teng yonli; to'g'ri chiziq + uchburchak (2 usul).
**Mashq daftaridan (qo'shimcha):** bir nechta uchburchakli shakllar: teng tomonli + to'g'ri chiziq; ikki to'g'ri burchak; PS = RS; teng tomonli + teng yonli; ikki teng yonli (JKL, MKL); uch teng burchak (∠VSW = ∠VSU = ∠UST).
**Qiyin masala:** teng yonli ABC + teng tomonli DBC → ∠ACD.
**Rasmlar:** uchburchak burchaklarini "yirtib" to'g'ri chiziqqa qo'yish.

### 13-bob. Parallelogramm, romb va trapetsiya

#### ☐ 45. Parallelogramm, romb va trapetsiyaning xossalari (+ Eslang: kvadrat va to'g'ri to'rtburchak) — D2 133–143; M2 165–172
**Qoidalar ro'yxati:**
- Eslang: kvadrat — 4 to'g'ri burchak, 4 teng tomon, qarama-qarshi tomonlari parallel; to'g'ri to'rtburchak — 4 to'g'ri burchak, qarama-qarshi tomonlari teng va parallel.
- Parallelogramm: qarama-qarshi tomonlari teng va parallel (AB = DC, AB ∥ DC); qarama-qarshi burchaklari teng; bir tomoniga yopishgan burchaklari yig'indisi 180°.
- Romb: 4 tomoni teng; qarama-qarshi tomonlari parallel; qarama-qarshi burchaklari teng; bir tomoniga yopishgan burchaklar yig'indisi 180°.
- Trapetsiya: faqat bir juft qarama-qarshi tomoni parallel (asoslar), qolgan ikkitasi — yon tomonlar; har bir yon tomoniga yopishgan burchaklar yig'indisi 180°.
- Xossalar jadvali (5 shakl × 6 xossa).
**Misol turlari:** tomon/burchak tengliklarini to'ldirish; ikki to'g'ri burchakli trapetsiya; teng yonli trapetsiya; xossalar jadvali; tangram.
**Mashq daftaridan (qo'shimcha):** Eslang: kvadrat/to'g'ri to'rtburchak noma'lum tomonlari; diagonal bilan noma'lum burchak (51°, 45°, 44° va 15°); parallelogramm/romb tomon va burchaklarini to'ldirish; trapetsiyada parallel juftni yozish (||); 4 ta to'g'ri burchakli uchburchakdan parallelogramm, 3 tasidan trapetsiya (amaliy); Kundalik: to'rtburchak burchaklari yig'indisi 180° × 2 = 360°.
**Rasmlar:** har shakl uchun belgilangan teng tomon / parallel strelkalar / burchak yoylari.

#### ☐ 46. To'rtburchaklarni chizish — D2 144–149; M2 173–176
**Qoidalar ro'yxati:**
- Katakli daftarda: parallelogramm (AD = BC = 6 cm, AD ∥ BC), romb, trapetsiya (PS = 5, QR = 8, PS ∥ QR).
- Berilgan o'lchamlar bo'yicha: parallelogramm (AB = 3, BC = 5, ∠B = 50°); trapetsiya (WX = XY = 4, ∠X = 110°, ∠Y = 120°); rombni parallelogramm kabi chizish.
- Parallel kesma — chizg'ich va uchburchakli chizg'ich bilan.
**Misol turlari:** kesmalarni to'ldirib shaklni chizish; o'lcham bo'yicha chizish.
**Mashq daftaridan (qo'shimcha):** ikki tomoni chizilgan shaklni to'ldirish (parallelogramm 5 va 7 cm, 60°; romb 4,5 cm, 40°; trapetsiya 12, 5, 5 cm, 125°, 134°); o'lcham bo'yicha 5 ta shakl (xomaki nusxa bilan).
**Rasmlar:** bosqichma-bosqich chizish.

#### ☐ 47. To'rtburchakning noma'lum burchaklarini topish — D2 150–156; M2 177–182
**Qoidalar ro'yxati:**
- Parallelogramm/romb: qarama-qarshi burchaklar teng; qo'shni burchaklar yig'indisi 180°.
- Trapetsiya: yon tomonga yopishgan burchaklar yig'indisi 180°.
- Diagonal bilan hosil bo'lgan uchburchaklar (burchaklar yig'indisi 180°, teng yonli uchburchak).
- To'rtburchak burchaklari yig'indisi 360° (rombda 280° berilgan → 80°).
**Misol turlari:** parallelogramm, romb, trapetsiya burchaklari; diagonalli masalalar; to'g'ri chiziq davomi bilan.
**Mashq daftaridan (qo'shimcha):** parallelogramm diagonali bilan (55°, 52°); romb (65°, 138°); 5 burchakli shakl (PQRST) ichidagi trapetsiya; trapetsiya + teng tomonli uchburchak; parallelogramm + to'g'ri chiziq; trapetsiya + teng yonli + to'g'ri chiziq; romb + teng yonli (34°, 160°).
**Qiyin masala:** trapetsiya + teng yonli ADG → ∠x.
**Rasmlar:** diagonalli shakllar, rangli burchaklar.

---

## C. Kitobda topilgan xatolar (ko'chirilmaydi)
- M2 55-bet (PDF 59): "380 00 so'm" → 380 000 so'm.
- D1 133-bet (PDF 137): "7680 − 320 = 4480" → 7680 − 3200.
- D1 169-bet (PDF 173): "Bahora 108 so'm olgan" → 108 000 so'm.
- D2 35-bet (PDF 39): "69 0000 ÷ 3" → 69 000 ÷ 3.
- D2 93-bet (PDF 97): "30° + 1500°" → 30° + 150°.

## D. Navbat
1. Umumiy andoza: maruza.css, maruza.js, chizma.js (bir marta).
2. 6-mavzu — yangi andozada qayta (namuna, sizga ko'rsatiladi).
3. 1-bob → 2-bob → ... → 13-bob, mavzuma-mavzu.
