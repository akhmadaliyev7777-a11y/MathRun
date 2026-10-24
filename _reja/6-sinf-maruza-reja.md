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

#### ✅ 6. Natural sonni to'g'ri kasrga bo'lish — D1 33–35; M1 41–48
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-natural-sonni-kasrga-bolish.html. Yangi chizma: `data-sigim="3:2/5"` (butunlar tasmada, bo'laklar bo'luvchi kattaligida guruhlanadi, chala guruh kasri yoziladi). O'z testi 20+20, 4 savolda chizma.
**Kitob bilan solishtirildi:** 1 butunda 1/b dan b ta ✅; n : 1/b = n·b ✅; n : a/b — bo'laklarni a tadan guruhlash ✅; bo'lish va ko'paytirish juftliklari (nimani payqadingiz) ✅; teskari kasr, n : a/b = n · b/a ✅; javob aralash son ✅; masalalar: nechta bolaga, necha bo'lak, nechta idish ✅; vaqt (soatdan soatgacha) ✅; «ko'pi bilan nechta» va «qancha qoladi» ✅; ikki chetida chiroq bor yo'l (oraliq − 1) ✅. kitobdan.py: 0 ta mos (3 : 3/4, 4 : 1/3, 4 : 3/5, 6 : 2/3, 13:00 almashtirildi).
**Tekshiruv:** tenglik.py (faqat atayin xato misollar), testlar.js 0 xato, 390/1100 px, KaTeX xatosiz.
**Simulyator uchun g'oyalar:** data.js simPlan (tasmalarni guruhlash).

#### ✅ 7. To'g'ri kasrni to'g'ri kasrga bo'lish (+ matnli masalalar) — D1 36–48; M1 49–66
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-kasrni-kasrga-bolish.html. Chizmalar: `data-sigim` (kasr : kasr), `data-model` (bo'laklar usuli). O'z testi 20+20, 5 savolda chizma.
**Kitob bilan solishtirildi:** bir xil maxraj — suratlarni bo'lish ✅; umumiy maxrajga keltirib bo'lish ✅; a/b : c/d = a/b · d/c ✅; javob 1 dan kichik / katta / aralash son ✅; juftliklar (nimani payqadingiz) ✅; masalalar: qadoqlash, vaqt oralig'i, yuz : en = bo'y, ko'pi bilan va qoldiq, qolganini bo'laklarga bo'lish ✅; matnli masalalar 2 usulda (bo'laklar va kasrlar): qolganining qismi + qolgan miqdor ✅, idish to'ldirish (oldin/keyin) ✅, ikki turdan bir xil sotildi ✅, qismning qismi yig'indisi ✅, idish+suv massasi ✅, pul zanjiri ✅; Matematika kundaligi (xatoni toping, chizma bilan) ✅; O'ylab ko'ring (ko'zoynakli o'g'il/qizlar) ✅. Qog'oz buklash amaliy topshirig'i kiritilmadi (qog'oz kerak). kitobdan.py: 0 ta mos (1/2 : 1/6, 2/5 : 1/10, 3/4 : 1/8 almashtirildi; «6 : 2» — oddiy juft).
**Tekshiruv:** tenglik.py (faqat atayin xato misollar va 2 ta o'qish xatosi), testlar.js 0 xato, 390/1100 px, KaTeX xatosiz.
**Simulyator uchun g'oyalar:** data.js simPlan (ikki tasma ustma-ust).

#### ✅ 8. Nisbat va kasr (+ matnli masalalar) — D1 52–66; M1 73–86
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-nisbat-va-kasr.html. Chizmalar: `data-tasma`, `data-model` (yangi: "qavs" — qator qismi ostida/ustida qavs, "ong" — o'ngda umumiy qavs, "chiziq" — punktir tik chiziqlar), `data-buyum`, `data-shakl`. O'z testi 20+20, chizmali savollar bilan.
**Kitob bilan solishtirildi:** Eslang (nisbat, qisqarmas ko'rinish, teng kuchli, bo'laklar usuli) ✅; A : B = a : b ⇔ A = a/b · B ✅; hadlar o'rnini almashtirish, «baravari» ✅; «n marta ko'p» ✅; qism : jami ✅; «har a taga b ta» ✅; javob qisqarmas, to'r/qutilarda donalarni sanash ✅; farq bo'laklarda ✅; bo'laklar usuli (ma'lum — qism, jami yoki farq) ✅; ikki miqdorning qismlari teng (suratlarni tenglashtirish) ✅; qism qismdan ortiq va jami ma'lum ✅; dastlab teng miqdorlar va sarf ✅; geometriyada nisbat (kvadrat yuzlari, shakl ichidagi sohalar) ✅; retseptni o'zgartirish ✅; daftardagi barcha turlar ✅. Ikki tekshiruv bosqichi: 38 + 21 kamchilik tuzatildi, kitobga o'xshash vaziyatlar (to'garak, pul 1/4 = 3/5, yong'oqlar, sarflagan : tejagan, tasma, bo'ylar) o'zimiznikiga almashtirildi. kitobdan.py: 22 ta oddiy «a : b» juft.
**Tekshiruv:** tenglik.py 109 to'g'ri / 0 xato, testlar.js 0 xato, 390/1100 px — barcha 56 ma'ruza qayta tekshirildi (chizma.js o'zgardi), KaTeX xatosiz.
**Simulyator uchun g'oyalar:** data.js simPlan (ikki rangli tasma, nisbat ↔ kasr slayder bilan).

#### ✅ 9. Uch miqdor nisbati — D1 67–71; M1 87–94
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-uch-miqdor-nisbati.html. Chizmalar: yangi `data-birlash` (ikki nisbatni uch hadli nisbatga birlashtirish, EKUK bo'lakchalari bilan), `data-shakl` ga "ranglar", `data-model`, `data-buyum`. O'z testi 20+20, chizmali savollar bilan.
**Kitob bilan solishtirildi:** ikki nisbatni umumiy miqdor orqali birlashtirish (EKUK) ✅; bo'laklar modeli (nega EKUK) ✅; xususiy hollar (hadlar teng, biri ikkinchisiga bo'linadi) ✅; umumiy miqdor istalgan o'rinda ✅; kasr, «k marta ko'p/kam», «yarmi» bilan berilgan bog'lanish ✅; javob qisqarmas ✅; bitta miqdor / ayirma / yig'indi / jami ma'lum — miqdorlarni topish ✅; bir ayirmadan boshqa ayirmani topish ✅; uch hadli nisbatdan yangi nisbat va kasr ✅; shakl sohalari yuzi (diagonal — teng yarmilar, to'rtinchi soha) ✅; ustma-ust shakllar (umumiy qism) ✅; tekshirish ✅. Ikki tekshiruv bosqichi: 31 + 26 kamchilik; kitobga o'xshash 4 test savoli va erkak/ayol/bola vaziyati almashtirildi. kitobdan.py: 14 ta oddiy «a : b» juft.
**Tekshiruv:** tenglik.py 102 to'g'ri / 0 xato, testlar.js 0 xato, 390/1100 px — barcha 58 ma'ruza qayta tekshirildi (chizma.js o'zgardi), test sahifasi 20+20.
**Simulyator uchun g'oyalar:** data.js simPlan (uch rangli tasma, a : b va b : c ni umumiy b orqali birlashtirish).

#### ✅ 10. O'zgaruvchan nisbatlar — D1 72–82; M1 95–110
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-ozgaruvchan-nisbatlar.html. Chizma: yangi `data-ozgar` («oldin–keyin» tasmalari, tur bir/jami/farq/teng, EKUK bo'lakchalari), Python egizagi `_reja/tools/ozgar_svg.py` (test rasmlari). O'z testi 20+20, 6 ta chizmali savol.
**Kitob bilan solishtirildi:** uch tur — yagona o'zgarmas miqdor, o'zgarmas yig'indi, o'zgarmas ayirma ✅; tenglashtirish (EKUK, bo'lakcha) ✅; 1 bo'lak va ichki tekshiruv ✅; ma'lum son o'zgarish emas (bitta miqdor, jami, keyingi farq) ✅; 2 usul (chizmali model va jadval) ✅; dastlab teng ✅; «teng bo'ldi», «qismi», «marta» ✅; yosh ✅; qism : jami ✅; birlik (qutilar, qoplar) ✅; tekshirish ✅; daftardagi barcha turlar, M1-106 (takrorlash), M1-107 (amaliy), M1-108 (muammoli), M1-110 (kundalik) ✅. Kitob xatosi (D1-81 #7 — yechimsiz) to'g'ri shartda berildi. Tekshiruvda kitob qolipidagi 19 ta masala vaziyati almashtirildi. kitobdan.py: 15 ta oddiy juft.
**Tekshiruv:** tenglik.py 120 to'g'ri / 1 atayin xato, testlar.js 0 xato, 390/1100 px avtomatik (14 chizma).
**Simulyator uchun g'oyalar:** data.js simPlan (ikki savat, oldin/keyin tasmalari).

#### ✅ 11. Foizi va qismiga ko'ra sonning o'zini topish — D1 84–90; M1 111–122
**Holat (2026-10-24):** tayyor va push qilindi. Fayl: maruza/6-sonni-foiziga-kora-topish.html. Chizma: yangi `data-foizyol` (foiz zinasi: 30% → 10% → 100%, kasr qism, tasma), Python egizagi `_reja/tools/foizyol_svg.py`; `data-foizbar`, `data-foiz`, `data-model`, `data-kataklar`. O'z testi 20+20, 4 ta chizmali savol.
**Kitob bilan solishtirildi:** 1% orqali (eslatma) ✅; qulay foiz orqali (10%, 25% …) ✅; foizni kasrga aylantirib bo'lish (oddiy va o'nli) ✅; qismiga ko'ra sonni topish ✅; qolgan bo'lak foizi, kasr + foiz ✅; teskari chegirma ✅; teskari QQS (QQS miqdori → 12%, jami → 112%) ✅; teskari omonat (foyda, yil oxiridagi mablag') ✅; farq orqali ✅; 100% dan katta foiz ✅; butunni topmasdan boshqa foiz ✅; ketma-ket foizlar ✅; tekshirish va birlik ✅; Eslang turlari va daftardagi barcha turlar ✅. Kitob noaniqliklari (QQS «umumiy narxning 12%», «omonat foizi») ko'chirilmadi. Tekshiruvda: 1 ta noto'g'ri test javobi va 1 ta kasr chiqadigan savol tuzatildi, kitob qolipidagi 27 ta masala almashtirildi. kitobdan.py: 0.
**Tekshiruv:** tenglik.py 135 to'g'ri / 1 atayin xato, testlar.js 0 xato, hisob mustaqil qayta tekshirildi (0 xato), 390/1100 px avtomatik (25 chizma).
**Simulyator uchun g'oyalar:** data.js simPlan (foiz tasmasi, 30% → 10% → 100%).

#### ✅ 12. O'sish va kamayish foizi (+ matnli masalalar) — D1 91–112; M1 123–142
**Holat (2026-10-24):** tayyor va push qilindi — birinchi «ixcham» ma'ruza (4 qoida: o'zgarish foizi, yangi qiymat, dastlabki qiymat, ketma-ket o'zgarish). Fayl: maruza/6-osish-kamayish-foizi.html. Chizmalar: data-model, data-foizbar, data-foizyol, data-ustunli, data-buyum (yangi tur yo'q). O'z testi 20+20, 5 ta chizmali savol.
**Kitob bilan solishtirildi:** darslik va daftardagi asosiy misol turlari (o'sish/kamayish foizi, «qaraganda», yaxlitlash, diagramma, jadval, yangi qiymat 2 usulda, chegirma, dastlabki qiymat, ketma-ket o'zgarish, jami o'zgarishi, ulush o'zgarishi, idishlar) ✅. Kiritilmadi (mavzu asosi emas): zar o'yini, maosh/jamg'arma turlari, sof «farq orqali» (11-mavzuda bor). kitobdan.py: 0.
**Tekshiruv:** tenglik.py 59/0, testlar.js 0 xato, 390/1100 px.

#### ✅ 13. Geometrik shakllardagi noma'lum burchaklar — D1 116–126; M1 151–168
**Holat (2026-10-24):** tayyor va push qilindi — birinchi **5 qismli** ma'ruza (Mavzu · Misollar ishlash · Mustahkamlash · Mustaqil ish · Javoblar), qoidalar darslikdan aynan. Fayl: maruza/6-shakllardagi-nomalum-burchaklar.html. Chizmalar: data-shakl, data-nurlar (yangi tur yo'q); barcha 60 burchak koordinatalardan o'lchab tekshirildi. O'z testi 20+20, 16 ta chizmali savol (geometriya mavzusi).
**Kitob bilan solishtirildi:** Eslang qoidalari (to'g'ri chiziq, vertikal, nuqta atrofi, uchburchak 180°, teng tomonli, teng yonli, to'g'ri burchakli, kvadrat/to'g'ri to'rtburchak, parallelogramm/romb, trapetsiya) ✅; murakkab chizmada ketma-ket topish ✅; kvadrat/to'g'ri to'rtburchak + uchburchak ✅; parallelogramm + diagonal ✅; trapetsiya ichida teng yonli ✅; kvadrat + teng tomonli ✅; nuqta atrofidagi shakllar ✅; diagonallar kesishgan parallelogramm (testda) ✅; Matematika kundaligi (xatoni toping) ✅. Amaliy topshiriq (nuqtali panjarada chizish) kiritilmadi.
**Tekshiruv:** tenglik.py 41/0, testlar.js 0 xato, 390/1100 px; Jumavoy (past o'zlashtiruvchi o'quvchi) — 6 izoh tuzatildi (belgilar qanday o'qilishi, «yopishgan» so'zi, tiqilgan chizmalar, maslahatlar); Ibrohim ustoz — 2 jiddiy (oson-2 da «?» noto'g'ri burchakda, qiyin-15 daftardan ko'chirma) va 6 taklif tuzatildi (qiyin testda nisbatli savollar o'rniga chizmali ko'p qadamli masalalar).

#### ✅ 14. Doira va aylana elementlari — D1 128–133; M1 169–170
**Holat (2026-10-24):** tayyor va push qilindi (5 qismli). Fayl: maruza/6-doira-aylana-elementlari.html. Yangi chizma: `data-aylana` (markaz, radius, diametr, yarim/chorak doira, ichki kvadrat, qo'shimcha doiralar, ramka, o'lcham chizig'i). O'z testi 20+20, 9 ta chizmali savol.
**Kitob bilan solishtirildi:** yarim doira, chorak doira va ularning chegaralari ✅; aylana, markaz, radius, diametr ta'riflari ✅; diametr = 2 × radius, radius = diametr : 2 ✅; barcha radiuslar teng ✅; markazdan o'tmagan kesma diametr emas ✅; aylanaga ichki chizilgan kvadrat ✅; jadval ✅; g'ildirak (testda) ✅. Qog'oz buklash, ip bilan chizish (amaliy) kiritilmadi. Kitob sonlari (7 cm, 13 m, 15, 30 cm) almashtirildi.
**Tekshiruv:** tenglik.py 19/0, testlar.js 0 xato, 390/1100 px; Jumavoy — 7 izoh tuzatildi (yarim/chorak doira kesmasi — diametr/radius eslatmasi, tiqilgan chizmalar); Ibrohim ustoz — 4 jiddiy (oson-7 ikki javobli, qiyin-5/17 chizma zid va mavzudan tashqari) va 7 taklif tuzatildi (ma'ruzaga o'xshash test savollari almashtirildi, kitobdagi «CD», «18 cm» olib tashlandi).


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
