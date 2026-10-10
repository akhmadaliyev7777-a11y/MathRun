/*
  SITE_DATA — saytning butun mazmuni shu yerda saqlanadi.
  Yangi mavzu qo'shish uchun yangi sahifa yaratish SHART EMAS —
  faqat kerakli "topics" ro'yxatiga yangi obyekt qo'shing.

  Har bir mavzu (topic) tuzilishi — ikki xil ko'rinishda bo'lishi mumkin:

  1) ODDIY (bitta ma'ruza matni) — ko'pchilik mavzular hozircha shunday:
  {
    id: "unikal-id",          // URL uchun, lotin harflar, - bilan
    title: "Mavzu nomi",
    lecture: {
      text: "Ma'ruza/tushuntirish matni. Bir nechta paragraf bo'lishi mumkin.",
      embedUrl: null          // agar prezentatsiya (masalan Google Slides) bo'lsa, shu yerga link qo'ying
    },
    interactive: null,        // interaktiv HTML fayl tayyor bo'lsa: "lessons/fayl-nomi.html"
    test: null                // interaktiv test tayyor bo'lsa: "lessons/fayl-nomi.html"
  }

  2) MAVZUCHALARGA BO'LINGAN (darslikdagi bo'limlar bo'yicha) — bitta mavzu
  bir nechta kichik mavzuchadan (bo'limdan) iborat bo'lsa, "sections"
  ishlatiladi, "lecture.text" o'rniga:
  {
    id: "unikal-id",
    title: "Mavzu nomi",
    page: "45-bet",           // ixtiyoriy, darslikdagi sahifa/joyi
    sections: [
      { title: "Mavzucha nomi", text: null },   // text hali yozilmagan bo'lsa null
      { title: "Boshqa mavzucha", text: "Yozilgan ma'ruza matni..." }
    ],
    lecture: { embedUrl: null },  // ixtiyoriy — butun mavzuga oid prezentatsiya
    interactive: null,
    test: null
  }
  Har bir mavzuchaning "text" maydonini keyinroq to'ldirib borasiz —
  mavzu.html avtomatik har bir mavzuchani alohida ko'rsatadi, text hali
  yozilmagan bo'lsa "hali qo'shilmagan" deb ko'rsatiladi.

  interactive yoki test hali tayyor bo'lmasa — shunchaki null qoldiring,
  sahifada avtomatik "tez orada" deb ko'rsatiladi.
*/

// lessons/ dagi ko'rgazmalar versiyasi: fayl o'zgarsa oshiriladi — brauzer yangisini yuklaydi
const LESSON_VER = 44;

function sec(title) {
  return { title: title, text: null };
}

function secText(title, html) {
  return { title: title, text: html };
}

const SITE_DATA = {
  grades: [
    {
      id: "5",
      name: "5-sinf",
      subjects: [
        {
          id: "matematika",
          name: "Matematika",
          topics: [
            { id: "kop-xonali-sonlar", title: "1. Ko'p xonali sonlar (10 milliongacha): o'qish, yozish, xona birliklari", page: "4-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-kop-xonali-sonlar.html", test: "test.html?sinf=5&fan=matematika&mavzu=natural-sonlar", newSim: true, simPlan: "Tayyor (5 rejim): xona jadvali — har xonada +/−, raqam 9 dan oshsa keyingi xonaga o'tadi; bloklar — 10 ta blok birlashadi yoki ajraladi; o'qish va yozish — son ↔ so'z, 4 daraja; yoyish — xona birliklari yig'indisi qadamma-qadam; 60 soniyalik o'yin — xona, xona birligi va sinfni topish." },
            { id: "10-100-1000-kopaytirish-bolish", title: "2. Sonni 10, 100, 1000 ga ko'paytirish va bo'lish", page: "14-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-10-100-1000.html", test: "test.html?sinf=5&fan=matematika&mavzu=turt-amal", newSim: true, simPlan: "Tayyor (5 rejim): ko'paytirish — natija oxiriga qo'shiladigan nollar rang bilan; bo'lish — ikkala sondagi teng nollarning tagiga chiziladi, qoldiqli holatlar mashqi; teskari masalalar — noma'lum ko'paytuvchi yoki bo'linuvchini topish; hayotiy — o'lchov birliklarini almashtirish; 60 soniyalik o'yin." },
            { id: "onlik-yuzlik-minglik-kopaytirish-bolish", title: "3. Sonni o'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish", page: "19-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-10-100-1000.html", test: "test.html?sinf=5&fan=matematika&mavzu=turt-amal", newSim: true, simPlan: "Tayyor (2-mavzu simulyatori bilan umumiy): ko'paytuvchi va bo'luvchi sifatida 20, 300, 4 000 kabi sonlarni yozish mumkin — avval bir xonali songa ko'paytiriladi yoki bo'linadi, keyin nollar qo'shiladi yoki tashlanadi; har qadam rangli izoh bilan." },
            { id: "amallar-tartibi", title: "4. Amallarni bajarish tartibi (qavssiz va qavsli)", page: "29-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-amallar-tartibi.html", test: "test.html?sinf=5&fan=matematika&mavzu=turt-amal", newSim: true, simPlan: "Tayyor (5 rejim): qadamma-qadam — birinchi amalni tanlash, xato turi tushuntiriladi (chapdan o'ngga, × doim :dan oldin, + doim −dan oldin, qavs); tartibni belgilang — amallar ustiga 1, 2, 3; ikki yo'l — to'g'ri va xato yechim, adashish joyi ko'rsatiladi; qavs qo'ying — berilgan natijani hosil qilish; 60 soniyalik o'yin." },
            { id: "bolishni-kasr-korinishida", title: "5. Bo'lishni kasr ko'rinishida ifodalash", page: "46-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-bolishni-kasr-korinishida.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, simPlan: "Tayyor (5 rejim, o'quvchi o'zi bajaradi): kasr nimaga kerak — 3 pitsani 4 do'stga o'zi tarqatadi, butun son yetmasligini ko'radi, pitsani nechta teng bo'lakka bo'lishni tanlaydi yoki yozadi; doira bilan bo'lish — istalgan son, butun va bo'laklangan pitsalarni beradi, teng bo'lsa a : b = a/b; son o'qi — nuqtani sudrab a/b ni topadi; qoldiqli bo'lish — doirachalarni aylana bo'yicha tarqatadi, qoldiqni teng bo'laklarga bo'ladi, aralash sonni o'zi yozadi; 60 soniyalik o'yin." },
            { id: "oddiy-kasrni-onli-kasrga", title: "6. Oddiy kasrni o'nli kasrga aylantirish", page: "52-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-oddiy-kasrni-onli-kasrga.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, simPlan: "Tayyor (6 rejim): 100 katak — bo'laklar qora chiziq bilan, kataklarni sanash; maxrajni keltirish — maxraj ko'paytuvchilarga ajratiladi (20 = 2 × 2 × 5), har bir 2 ga bitta 5 juft qilinadi, yetishmayotgan ko'paytuvchini o'quvchi qo'shadi; ustun shaklida bo'lish — qadamma-qadam, vergul va 0 tushirish izohi bilan; son o'qi; hayotiy o'lchovlar; 60 soniyalik o'yin." },
            { id: "aralash-sonlarni-qoshish-ayirish", title: "7. Aralash sonlarni qo'shish va ayirish", page: "58-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-aralash-sonlar.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, review: "sariq", simPlan: "Tayyor (rejim: bir xil / har xil maxrajli; 3 daraja): qo'shish — butunlar, kasr qismlar (har xil maxrajda umumiy bo'lakka kesish), to'lgan doirani butunga aylantirish; ayirish — bo'lak yetmasa bitta butunni maydalash; son o'qida sakrash; hayotiy masalalar (xato turi aniqlanadi); 2-usul: noto'g'ri kasr orqali; 60 soniyalik o'yin." },
            { id: "kasrni-natural-songa-kopaytirish", title: "8. Kasrni natural songa ko'paytirish (to'g'ri va noto'g'ri kasr)", page: "65-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-kasrni-natural-songa-kopaytirish.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, review: "sariq", simPlan: "Tayyor (5 bo'lim, o'quvchi o'zi bajaradi): takroriy qo'shish — 2/5 ni 3 marta qo'shadi, doiralarda bo'laklar bo'yaladi, 2/5 × 3 = 2/5 + 2/5 + 2/5 (qavs ostida «3 marta»), javobni o'zi yozadi va butun qismini ajratadi; son o'qida sakrash — avval taxmin, keyin sakrash nuqtasini o'zi bosadi, 1 butun chizig'i bilan to'g'ri/noto'g'ri kasr; avval qisqartir — natural son va maxrajni umumiy bo'luvchiga qisqartiradi; masalalar va xatolar (maxrajni ko'paytirish xatosi doiralarda ko'rsatiladi); 60 soniyalik o'yin." },
            { id: "kasrni-kasrga-kopaytirish", title: "9. Kasrni kasrga ko'paytirish", page: "70-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-kasrni-kasrga-kopaytirish.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, review: "sariq", simPlan: "Tayyor (5 bo'lim, o'quvchi o'zi bajaradi): kvadratda ko'paytirish — eniga 1-kasr ustunlarini, bo'yiga 2-kasr qatorlarini o'zi bo'yaydi, ustma-ust yashil kataklarni sanaydi va qisqartiradi (surat × surat, maxraj × maxraj); qismning qismi — hayotiy masala, tasmada avval c/d, keyin uning a/b qismini o'zi belgilaydi; avval qisqartir — juftni (xochsimon ham) va bo'luvchini o'zi tanlaydi; taxmin va xatolar — natija katta/kichik, xato yechimlar, matnli masalalar; 60 soniyalik o'yin." },
            { id: "aralash-sonni-natural-songa", title: "10. Aralash sonni natural songa ko'paytirish", page: "79-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-aralash-sonni-natural-songa.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, review: true, simPlan: "Tayyor (4 bo'lim, o'quvchi o'zi bajaradi): 1-usul — aralash sonni k marta qo'shadi, butun doiralar va kasr bo'laklar alohida qatorga yig'iladi, butunlarni va kasrlarni alohida ko'paytirib, butunini ajratib, qo'shadi; 2-usul — noto'g'ri kasrga aylantiradi (doiralar bo'laklarga bo'linadi), suratni ko'paytiradi, butunini ajratadi, ikkala usul natijasi teng; masalalar va xatolar (faqat butun ko'paytirilgan, maxraj ham ko'paytirilgan, aylantirishda xato); 60 soniyalik o'yin." },
            { id: "qolgan-qismning-qismi", title: "11. Qolgan qismning qismi", page: "82-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-qolgan-qismning-qismi.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar", newSim: true, review: true, simPlan: "Tayyor (5 bo'lim, o'quvchi o'zi bajaradi): tasmada qadamma-qadam — butunni nechta bo'lakka bo'lishni tanlaydi, qismni bo'yaydi, hisoblaydi; qolgan qism yangi butun bo'lib pastga tushadi, uni bo'lib, qismini bo'yab hisoblaydi (butunni bo'lsa — ogohlantiradi), zanjir 120 → −40 → 80 → −20 → 60; kasr bilan — 1 − a/b, c/d × qolgan, T ning shu qismi (ikki yo'l — bir javob); butunning yoki qolganining — farqini tanlaydi, ikki tasma yonma-yon; masalalar 2 va 3 bosqichli; 60 soniyalik o'yin." },
            { id: "uchburchak-asosi-balandligi", title: "12. Uchburchakning asosi va balandligi", page: "91-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-uchburchak-asosi-balandligi.html", test: null, newSim: true, simPlan: "Tayyor (5 rejim): asos va balandlik — uchlarni sudrash, istalgan tomonni asos qilish, aylantirish, balandlik ichida / tashqarida / yon tomon bilan ustma-ust; uchta balandlik — o'tkir, to'g'ri, o'tmas uchburchakda; balandlikni chizing — burchak jonli ko'rinadi, 90° da yashil; qaysi biri balandlik — mediana, qiyshiq kesma va boshqa tomon balandligi orasidan tanlash; 60 soniyalik o'yin." },
            { id: "uchburchak-yuzi", title: "13. Uchburchakning yuzini topish", page: "96-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-uchburchak-yuzi.html", test: null, newSim: true, review: true, simPlan: "Tayyor (5 bo'lim, o'quvchi o'zi bajaradi): to'rtburchakning yarmi — katakli fonda asos va balandlikni sudraydi, ikkinchi nusxa 180° aylanib to'rtburchakni to'ldiradi, to'rtburchak va uchburchak yuzini yozadi; istalgan uchburchak — uchlarini sudraydi (o'tkir, to'g'ri, o'tmas — balandlik tashqarida), nusxa parallelogramm hosil qiladi, asos, balandlik, yuzni yozadi (yon tomonni balandlik deb olsa — ogohlantiradi); uchini sursak — taxmin, keyin sudrab yuz o'zgarmasligini ko'radi; masalalar va xatolar (yuz, balandlik, asosni topish; :2 esdan chiqishi, yon tomon); 60 soniyalik o'yin." },
            { id: "murakkab-shakllar-yuzi", title: "14. To'g'ri to'rtburchak va uchburchaklardan tuzilgan shakllarning yuzi", page: "103-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-murakkab-shakllar-yuzi.html", test: null, newSim: true, review: true, simPlan: "Tayyor (4 bo'lim, o'quvchi o'zi bajaradi): bo'laklarga ajratish — L, U, uy, trapetsiya, ramka shakllari katakli maydonda; kesish chizig'ini o'zi bosib tanlaydi (bir nechta usul), bo'laklar ranglanadi, har bir bo'lak yuzini va yig'indini yozadi, boshqa usulda ham shu javob; katta to'rtburchakdan ayirish — katta to'rtburchak, ortiqcha qism (qizil shtrix), ayirma; masalalar (xona plani, narx, perimetr bilan adashish); 60 soniyalik o'yin." },
            { id: "fazoviy-jismlar-hajmi", title: "15. Fazoviy jismlarning hajmi (kubiklar soni)", page: "111-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-hajm-kubiklar.html", test: "test.html?sinf=5&fan=matematika&mavzu=hajm", newSim: true, review: true, simPlan: "Tayyor (4 bo'lim, o'quvchi o'zi bajaradi): kubiklardan qurish — 3D (izometrik) maydonda katak yoki kubik ustini bosib kubik qo'yadi/oladi, aylantiradi, berilgan hajmdagi jismni bir necha xil shaklda quradi; sanab ko'ring — ko'rinmaydigan kubiklar bilan sanaydi, adashsa jism qatlamlarga ajraladi (har qatlam o'z rangida), qatlamlab sanab qo'shadi; qaysi biri katta — ikki jism hajmini solishtiradi (ba'zan teng); 60 soniyalik o'yin." },
            { id: "izometrik-panjarada-chizish", title: "16. Uch o'lchamli panjarada fazoviy jismlarni chizish", page: "115-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-izometrik-chizish.html", test: "test.html?sinf=5&fan=matematika&mavzu=hajm", newSim: true, review: true, simPlan: "Tayyor (4 bo'lim, o'quvchi o'zi bajaradi): kub va kuboid — chapda 3D jism, o'ngda izometrik nuqtali panjara; ikki nuqtani bosib qirra chizadi (faqat tik va ikki qiya yo'nalish), to'g'ri qirra yashil, noto'g'ri qizil, yordam — xira uzuq qirralar, ko'k nuqta — old pastki uch; kubiklardan jism — zina, L shakl, minora, pog'ona, 2×2×2 kub (yordamsiz); to'g'ri chizmani toping — to'g'ri, qirrasi yetishmaydigan, boshqa jism chizmasidan tanlaydi; 60 soniyalik o'yin." },
            { id: "jismning-korinishlari", title: "17. Jismning turli ko'rinishlari (old, yon, ust)", page: "118-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=hajm", simPlan: "Kubiklardan yasalgan jism aylantiriladi. O'quvchi kvadratli panjarada kataklarni bo'yab old, yon va ust ko'rinishlarni chizadi, so'ng to'g'ri javob bilan solishtiriladi. Teskari topshiriq: ko'rinishlarga qarab jismni qurish." },
            { id: "hajm-birliklari", title: "18. Hajm birliklari: sm³ va m³", page: "120-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=hajm", simPlan: "1 sm³ kubik va 1 m³ kub yonma-yon. 1 m³ qirrasi bo'ylab 100 ta sm kubik joylashadi → qatlam-qatlam 100 × 100 × 100 = 1 000 000 sm³ to'ladi. O'tkazish slayderi: m³ ↔ sm³." },
            { id: "kuboid-kub-hajmi", title: "19. Kuboid va kubning hajmi", page: "123-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=hajm", simPlan: "Kuboidning uzunligi, eni va balandligi slayderlar bilan o'zgaradi. Ichi birlik kubiklar bilan to'ladi: avval asos qatlami (uzunlik × eni), keyin qatlamlar balandlik bo'yicha takrorlanadi. V = a × b × c formulasi qiymatlar bilan yangilanib boradi." },
            { id: "suyuqlik-hajmi", title: "20. Suyuqlik hajmi: sm³, m³, litr, ml", page: "129-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=hajm", simPlan: "Shkalali idish (menzurka) va kuboid shaklidagi akvarium. Suv quyilganda sathi ko'tariladi, hajm ml va l da ko'rsatiladi. 1 l = 1000 sm³ = 1000 ml bog'lanishi 10 × 10 × 10 sm kub orqali tasvirlanadi." },
            { id: "nisbat-tushunchasi", title: "21. Nisbat tushunchasi", page: "140-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki xil narsa (masalan 6 ta olma, 4 ta nok). Nisbat 6 : 4 deb yoziladi; narsa qo'shilsa yoki olinsa nisbat yangilanadi. Tartib almashsa nisbat 4 : 6 bo'lishi alohida ko'rsatiladi." },
            { id: "teng-kuchli-nisbatlar", title: "22. Teng kuchli nisbatlar", page: "146-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Bitta guruh: 2 qizil : 3 ko'k. «Guruh qo'shish» bosilganda guruhlar takrorlanadi: 4 : 6, 6 : 9 ... Teskari yo'nalishda — umumiy bo'luvchiga bo'lib soddalashtirish. Yonida nisbatlar jadvali o'sib boradi." },
            { id: "nisbat-boshqa-miqdor", title: "23. Miqdor va nisbatga ko'ra boshqa miqdorni topish", page: "155-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Tasma modeli: nisbat 2 : 5, birinchi miqdor ma'lum (masalan 12). Tasmaning 2 bo'lagiga 12 yoziladi → 1 bo'lak = 6 → ikkinchi miqdor 5 × 6 = 30. Bo'laklar bosqichma-bosqich to'ladi." },
            { id: "nisbat-qismlarni-topish", title: "24. Jami miqdor va nisbatga ko'ra qismlarni topish", page: "157-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Jami miqdor (masalan 35 ta konfet) 3 : 4 nisbatda bo'linadi: tasma 7 bo'lakka bo'linadi, 1 bo'lak = 5, qismlar 15 va 20. Nisbat va jami miqdor slayder bilan o'zgaradi." },
            { id: "uchta-miqdor-nisbati", title: "25. Uchta miqdorning nisbati", page: "165-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uch rangli tasma (2 : 3 : 5). Rejimlar: jami ma'lum — qismlarni topish; bitta qism ma'lum — qolganlarini topish; ikkita nisbatni birlashtirish (a : b va b : c → a : b : c)." },
            { id: "onli-kasr-10-100-1000", title: "26. O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish", page: "2-qism, 4-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-onli-kasrlar.html", test: "test.html?sinf=5&fan=matematika&mavzu=onli-kasrlar", simPlan: "O'nli kasr xona jadvalida (butunlar, o'ndan, yuzdan, mingdan birlar). ×10, ×100, ×1000 va :10, :100, :1000 tugmalarida raqamlar suriladi, vergul joyi o'zgargandek ko'rinadi. Pastda tenglik yoziladi." },
            { id: "onli-kasr-onlik-yuzlik-minglik", title: "27. O'nli kasrni o'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish", page: "2-qism, 9-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=onli-kasrlar", simPlan: "0,3 × 40 bosqichma-bosqich: 40 = 4 × 10, avval 0,3 × 4 = 1,2 (tasmalar bilan), keyin ×10 bilan surish. Bo'lishda teskari tartib. Sonlar slayder bilan tanlanadi." },
            { id: "olchov-birliklarini-almashtirish", title: "28. O'lchov birliklarini almashtirish", page: "2-qism, 20-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=onli-kasrlar", simPlan: "Birliklar zinapoyasi: km → m → sm → mm, kg → g, l → ml. Qiymat kiritiladi; pastga tushganda ×10/×100/×1000, yuqoriga chiqqanda bo'linadi — vergul siljishi animatsiya bilan. Yonida lineyka va tarozi tasviri." },
            { id: "meyorni-topish", title: "29. Me'yorni topish", page: "2-qism, 34-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Do'kon: 5 ta daftar 15 000 so'm. Umumiy pul daftarlar soni bo'yicha teng guruhlarga bo'linadi → 1 ta daftar narxi (me'yor). Narsalar soni va umumiy narx slayder bilan o'zgaradi." },
            { id: "meyor-umumiy-miqdor", title: "30. Me'yorga ko'ra umumiy miqdorni topish", page: "2-qism, 38-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Me'yor ma'lum: 1 ta = 3000 so'm. Savatga narsa qo'shilgan sari umumiy narx hisoblagichda o'sadi; «soni — narxi» jadvalida to'g'ri proporsional o'sish ko'rinadi." },
            { id: "birliklar-sonini-topish", title: "31. Birliklar sonini topish", page: "2-qism, 43-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Pul miqdori va bitta narsaning narxi berilgan. Pullar narx bo'yicha guruhlarga ajratiladi — nechta narsa olish mumkinligi va qancha qoldiq qolishi ko'rinadi." },
            { id: "foiz-tushunchasi", title: "32. Foiz tushunchasi", page: "2-qism, 53-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-foiz-tushunchasi.html", test: "test.html?sinf=5&fan=matematika&mavzu=foizlar", newSim: true, simPlan: "100 katakli kvadrat: o'quvchi kataklarni bo'yaydi, foiz (masalan 37%) va 37/100 bir vaqtda yoziladi. Topshiriqlar: berilgan foizni bo'yash; bo'yalgan qismni foizda aytish." },
            { id: "kasr-onli-kasr-foiz", title: "33. Oddiy kasr, o'nli kasr va foiz orasidagi bog'lanish", page: "2-qism, 56-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=foizlar", simPlan: "Bitta miqdor uch ko'rinishda: oddiy kasr (3/4), o'nli kasr (0,75), foiz (75%) va 100 katakli kvadrat. Istalgan birini o'zgartirsa, qolgan ikkitasi va rasm darhol yangilanadi." },
            { id: "miqdorning-foizi", title: "34. Miqdorning foizi", page: "2-qism, 62-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=foizlar", simPlan: "Ikki qatorli foiz tasmasi: yuqorida 0% – 100%, pastda 0 – miqdor (masalan 240). Slayder foizni tanlaydi va mos qiymatni ko'rsatadi; hisoblash 10% va 1% orqali bosqichma-bosqich ko'rsatiladi." },
            { id: "qqs-chegirma-omonat", title: "35. QQS, chegirma va omonat foizi", page: "2-qism, 69-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=foizlar", simPlan: "Do'kon cheki: narx, chegirma % va QQS % slayderlari — yakuniy narx chekda qanday o'zgarishi. Bank rejimi: omonat summasi va yillik foiz, 1–3 yil bo'yicha o'sish ustunlarda." },
            { id: "ortacha-qiymat-tushunchasi", title: "36. O'rtacha qiymat tushunchasi", page: "2-qism, 79-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Har xil balandlikdagi kub ustunlari (masalan 5 kunlik harorat). O'quvchi baland ustundan kublarni past ustunlarga ko'chirib hammasini tenglashtiradi — tenglashgan balandlik o'rtacha qiymat. So'ng formula: yig'indi : soni." },
            { id: "ortacha-jami-soni", title: "37. O'rtacha qiymat, jami qiymat va son orasidagi bog'lanish", page: "2-qism, 83-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uch kattalik: o'rtacha qiymat, jami qiymat va soni — bittasi yashirin. Ustunlar va tenglashtirish chizig'i orqali yashirin qiymat topiladi. Qo'shimcha rejim: yangi qiymat qo'shilsa o'rtacha qanday o'zgaradi." },
            { id: "togri-chiziqdagi-burchaklar", title: "38. To'g'ri chiziqdagi burchaklar (yig'indisi 180°)", page: "2-qism, 92-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-burchaklar.html", test: "test.html?sinf=5&fan=matematika&mavzu=burchaklar", simPlan: "To'g'ri chiziqdagi nuqtadan 1–3 ta nur chiqadi, ular suriladi. Burchaklar rangli yoylar va gradus bilan ko'rinadi, yig'indisi doim 180° ekanligi ko'rsatiladi. Topshiriq: bitta burchak yashirin — uni topish." },
            { id: "vertikal-burchaklar", title: "39. Vertikal burchaklar", page: "2-qism, 96-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=burchaklar", simPlan: "Ikki kesishuvchi to'g'ri chiziq; birini aylantirganda qarama-qarshi (vertikal) burchaklar bir xil rangda va doim teng ekani, qo'shni burchaklar yig'indisi esa 180° ekani ko'rinadi." },
            { id: "nuqta-atrofidagi-burchaklar", title: "40. Nuqta atrofidagi burchaklar (yig'indisi 360°)", page: "2-qism, 100-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=burchaklar", simPlan: "Bitta nuqta atrofida 3–5 ta nur; nurlar surilganda burchaklar yig'indisi doim 360° (to'liq aylana) ekani ko'rinadi. Topshiriq: yashirin burchakni topish." },
            { id: "nomalum-burchaklarni-topish", title: "41. Noma'lum burchaklarni topish", page: "2-qism, 105-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=burchaklar", simPlan: "Aralash chizmalar: to'g'ri chiziqdagi, vertikal va nuqta atrofidagi burchaklar birga. O'quvchi avval qaysi qoidani qo'llashni tanlaydi, keyin qiymatni kiritadi; har bir qadam chizmada belgilanadi." },
            { id: "uchburchak-turlari", title: "42. Uchburchakning turlari", page: "2-qism, 111-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uchburchak uchlari sudraladi, tomonlar uzunligi va burchaklar real vaqtda ko'rinadi. Turi avtomatik aniqlanadi: tomonlari bo'yicha (teng tomonli, teng yonli, turli tomonli) va burchaklari bo'yicha (o'tkir, to'g'ri, o'tmas burchakli)." },
            { id: "uchburchaklarni-chizish", title: "43. Uchburchaklarni chizish", page: "2-qism, 118-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Virtual lineyka va transportir. Berilgan ma'lumot (ikki tomon va ular orasidagi burchak yoki bir tomon va ikki burchak) bo'yicha uchburchak qadamma-qadam chiziladi, har bir qadam tekshiriladi." },
            { id: "uchburchak-burchaklari", title: "44. Uchburchakning burchaklari (yig'indisi 180°)", page: "2-qism, 123-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uchburchakning uchta burchagi «yirtib» olinib, bitta nuqtada yonma-yon qo'yiladi — to'g'ri chiziq (180°) hosil bo'ladi. Uchlar surilsa ham yig'indi 180° qoladi. Topshiriq: ikki burchakdan uchinchisini topish." },
            { id: "parallelogramm-romb-trapetsiya", title: "45. Parallelogramm, romb va trapetsiyaning xossalari", page: "2-qism, 134-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Shakl tanlanadi: parallelogramm, romb yoki trapetsiya. Uchlari sudraladi, lekin shakl o'z turini saqlaydi; parallel tomonlar, teng tomonlar, teng burchaklar va diagonallar xossalari belgilar bilan ko'rsatiladi." },
            { id: "tortburchaklarni-chizish", title: "46. To'rtburchaklarni chizish", page: "2-qism, 144-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Lineyka, transportir va katakli fon yordamida berilgan o'lchamdagi to'rtburchak (parallelogramm, romb, trapetsiya) qadamma-qadam chiziladi, har bir qadam tekshiriladi." },
            { id: "tortburchak-nomalum-burchaklari", title: "47. To'rtburchakning noma'lum burchaklarini topish", page: "2-qism, 150-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "To'rtburchak chizmasida ba'zi burchaklar berilgan. Yig'indi 360° va shakl xossalari (qarama-qarshi burchaklar teng, qo'shni burchaklar yig'indisi 180°) yordamida noma'lum burchak topiladi; qo'llangan xossa chizmada yonib turadi." }
          ]
        }
      ]
    },
    {
      id: "6",
      name: "6-sinf",
      subjects: [
        {
          id: "matematika",
          name: "Matematika",
          topics: [
            { id: "algebraik-ifodalar", title: "1. Algebraik ifodalar", page: "3-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Qutilar (noma'lum son — x) va birlik kubiklar. O'quvchi «3 ta quti va yana 2 ta kubik» kabi holatni yig'adi, ifoda 3x + 2 deb yoziladi. Teskari rejim: ifoda berilgan — uni qutilar va kubiklar bilan qurish. Qutining ichini ochsa, x ga son qo'yilganini ko'radi." },
            { id: "ifodalarni-soddalashtirish", title: "2. Algebraik ifodalarni soddalashtirish", page: "10-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Algebra plitkalari: x — uzun ko'k plitka, 1 — kichik kvadrat, −x va −1 — qizil plitkalar. O'quvchi plitkalarni sudrab o'xshashlarini bitta guruhga yig'adi; qarama-qarshi plitkalar juftlashib yo'qoladi. Ifoda har qadamda qayta yoziladi: 2x + 3 + x − 1 → 3x + 2." },
            { id: "ifoda-qiymatini-topish", title: "3. Algebraik ifodaning qiymatini topish", page: "13-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/6-matematika-algebra.html", test: null, simPlan: "x slayderi (masalan 0–10). Ifodadagi har bir x o'rniga tanlangan son animatsiya bilan «tushadi», so'ng amallar tartibi bo'yicha hisoblanadi. Yonida jadval: x qiymatlari va ifodaning qiymatlari, o'sish nuqtalar bilan ko'rinadi." },
            { id: "tenglamalarni-yechish", title: "4. Tenglamalarni yechish", page: "19-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Pallali tarozi: chap pallada qutilar (x) va kubiklar, o'ngda kubiklar. O'quvchi ikkala palladan bir xil narsa olib tashlaydi yoki teng bo'lib chiqadi — tarozi muvozanatda qolishi kerak. Oxirida bitta quti = n ta kubik, ya'ni x = n. Har qadam tenglama ko'rinishida yoziladi." },
            { id: "kasrni-natural-songa-bolish", title: "5. To'g'ri kasrni natural songa bo'lish", page: "28-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Tasma: 3/4 qismi bo'yalgan. «: n» slayderi bo'yalgan qismni n ta teng bo'lakka bo'ladi, bitta bo'lak ajratib ko'rsatiladi: 3/4 : 2 = 3/8. Butun tasmaga nisbatan yangi bo'lak kattaligi kataklar orqali tekshiriladi." },
            { id: "natural-sonni-kasrga-bolish", title: "6. Natural sonni to'g'ri kasrga bo'lish", page: "33-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "«3 ta butunda nechta 1/4 bor?» — 3 ta tasma choraklarga bo'linadi va bo'laklar sanaladi (12 ta). Keyin 3/4 bilan: bo'laklar 3 tadan guruhlanadi (4 ta guruh). Shundan qoida chiqadi: 3 : 3/4 = 3 × 4/3." },
            { id: "kasrni-kasrga-bolish", title: "7. To'g'ri kasrni to'g'ri kasrga bo'lish", page: "36-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/6-matematika-oddiy-kasrlar.html", test: null, simPlan: "Ikki tasma ustma-ust: bo'linuvchi (3/4) va bo'luvchi (1/8). «3/4 ichiga 1/8 necha marta sig'adi?» — bo'luvchi tasma bo'linuvchi ustida ketma-ket qo'yiladi va sanaladi. Natija teskarisiga ko'paytirish qoidasi bilan solishtiriladi." },
            { id: "nisbat-va-kasr", title: "8. Nisbat va kasr", page: "55-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki rangli tasma: 2 : 3 nisbat. Bitta tasmadan «birinchi miqdor jamining 2/5 qismi», «birinchisi ikkinchisining 2/3 qismi» degan kasrlar o'qiladi. Nisbat slayder bilan o'zgaradi, kasrlar darhol yangilanadi." },
            { id: "uch-miqdor-nisbati", title: "9. Uch miqdor nisbati", page: "67-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uch rangli tasma (masalan 2 : 3 : 4). Rejimlar: jami ma'lum — har bir qismni topish; bitta qism ma'lum — qolganlarini topish; a : b va b : c nisbatlarini umumiy b orqali birlashtirish." },
            { id: "ozgaruvchan-nisbatlar", title: "10. O'zgaruvchan nisbatlar", page: "72-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki savat (masalan 3 : 5 nisbatda olma). Biriga olma qo'shilsa yoki olinsa, nisbat qanday o'zgarishi tasmalarda ko'rinadi. «Oldin» va «keyin» tasmalari yonma-yon turadi; o'zgarmagan miqdor orqali bo'laklar tenglashtiriladi." },
            { id: "sonni-foiziga-kora-topish", title: "11. Foizi va qismiga ko'ra sonning o'zini topish", page: "87-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Foiz tasmasi: yuqorida 0% – 100%, pastda miqdor. Faqat bir qism ma'lum (masalan 30% = 60). O'quvchi 30% dan 10% ga (60 : 3 = 20), so'ng 100% ga (20 × 10 = 200) qadamma-qadam o'tadi; tasma bo'laklari to'lib boradi." },
            { id: "osish-kamayish-foizi", title: "12. O'sish va kamayish foizi", page: "91-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki ustun: eski va yangi qiymat (masalan narx). Farq alohida rang bilan ko'rsatiladi; farq eski qiymatga nisbatan foizda hisoblanadi. Slayder bilan qiymat oshiriladi yoki kamaytiriladi, «+20%» yoki «−15%» yorlig'i yangilanadi." },
            { id: "shakllardagi-nomalum-burchaklar", title: "13. Geometrik shakllardagi noma'lum burchaklarni topish", page: "119-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uchburchak, to'rtburchak va kesishuvchi chiziqlardan iborat chizmalar. O'quvchi qaysi qoida ishlatilishini tanlaydi (uchburchak 180°, to'rtburchak 360°, vertikal, to'g'ri chiziqdagi burchaklar, teng yonli uchburchak), keyin qiymatni kiritadi; qo'llangan burchaklar chizmada yonadi." },
            { id: "doira-aylana-elementlari", title: "14. Doira va aylana elementlari", page: "129-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Aylana ustida nuqtalar sudraladi: markaz, radius, diametr, vatar, yoy, sektor ranglar bilan belgilanadi. Element nomini bosganda shakl ustida yonadi. Diametr doim ikki radiusga tengligi o'lchov bilan ko'rsatiladi." },
            { id: "aylana-uzunligi", title: "15. Aylananing uzunligi", page: "134-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Aylana to'g'ri chiziq bo'ylab «yoyiladi» (g'ildirak bir marta aylanadi). Uzunlik diametr bilan solishtiriladi — har doim 3 dan biroz ko'p marta (π ≈ 3,14). Radius slayderi bilan C = 2πr = πd formulasi qiymatlar bilan yangilanadi." },
            { id: "yarim-chorak-doira-perimetri", title: "16. Yarim va chorak doira perimetri", page: "140-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Doira yarim yoki chorak qismga kesiladi. Perimetr ikki qismdan iborat ekanligi ranglar bilan ko'rsatiladi: yoy (aylananing yarmi yoki choragi) va to'g'ri chiziqlar (diametr yoki ikkita radius). Odatiy xato — to'g'ri chiziqlarni unutish — alohida ko'rsatiladi." },
            { id: "doira-yuzi", title: "17. Doiraning yuzi", page: "145-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Doira 8, 16, 32 ta sektorga kesiladi va sektorlar navbatma-navbat terilib, to'g'ri to'rtburchakka yaqin shakl hosil bo'ladi: eni r, bo'yi πr. Sektorlar ko'paygani sari shakl aniqlashadi va S = πr² chiqadi." },
            { id: "yarim-chorak-doira-yuzi", title: "18. Yarim va chorak doira yuzi", page: "150-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "To'liq doira yuzidan yarim va chorak doira yuzi olinadi: shakl bo'laklarga kesilib, qaysi qismi qolgani ko'rsatiladi. Radius slayderi bilan S/2 va S/4 qiymatlari yangilanadi." },
            { id: "murakkab-shakllar-yuzi-perimetri", title: "19. Murakkab shakllarning yuzi va perimetri", page: "153-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "To'rtburchak va yarim/chorak doiralardan tuzilgan shakllar (stadion, eshik, gul). O'quvchi shaklni qismlarga ajratadi, yuz uchun qismlar qo'shiladi yoki ayiriladi; perimetr uchun faqat tashqi chegara bo'ylab yuriladi — chegara chizig'i animatsiya bilan yuradi." },
            { id: "tezlik-masofa-vaqt", title: "20. Tezlik, masofa va vaqt", page: "2-qism, 4-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/6-matematika-tezlik.html", test: null, simPlan: "Yo'lda harakatlanayotgan mashina, ostida vaqt shkalasi. Tezlik slayderi o'zgartirilganda har soatda bosib o'tilgan masofa bo'laklar bilan belgilanadi. «Masofa = tezlik × vaqt» uchburchagidan noma'lum kattalik tanlanadi va topiladi; birliklar (km/soat, m/min) almashtiriladi." },
            { id: "ikki-xil-tezlikdagi-harakat", title: "21. Ikki xil tezlikdagi harakat", page: "2-qism, 12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Yo'l ikki bo'lakdan iborat: avval bir tezlikda, keyin boshqa tezlikda. Masofa–vaqt grafigida ikki xil qiyalikdagi chiziq chiziladi; har bir bo'lak uchun masofa va vaqt alohida hisoblanib, jami topiladi." },
            { id: "ortacha-tezlik", title: "22. O'rtacha tezlik", page: "2-qism, 15-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki bo'lakli yo'l. O'rtacha tezlik = jami masofa : jami vaqt. Odatiy xato — ikki tezlikning o'rta arifmetigini olish — yonma-yon ko'rsatiladi va nega noto'g'ri ekani grafikda ko'rinadi." },
            { id: "ikki-jism-harakati", title: "23. Ikki jism harakati: uchrashish va quvib yetish", page: "2-qism, 20-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Bitta yo'lda ikki mashina. Rejimlar: qarama-qarshi yo'nalishda (yaqinlashish tezligi = tezliklar yig'indisi), bir yo'nalishda (quvib yetish, tezliklar farqi). Oradagi masofa har soatda qancha qisqarishi ko'rsatiladi." },
            { id: "kuboid-qirrasini-topish", title: "24. Kuboidning qirrasini topish", page: "2-qism, 29-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Hajmi va ikki qirrasi ma'lum kuboid. Asos qatlami (a × b ta kubik) quriladi, so'ng qatlamlar ustma-ust qo'yiladi — nechta qatlam sig'sa, shu balandlik: c = V : (a × b)." },
            { id: "kub-qirrasini-topish", title: "25. Kubning qirrasini topish", page: "2-qism, 35-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Kubiklardan 1³, 2³, 3³, 4³ ... kublar qurib boriladi, ularning hajmlari jadvalga yoziladi. Hajm berilganda (masalan 64) qaysi kub mos kelishi topiladi: qirra = ∛64 = 4." },
            { id: "kuboid-kub-yogi-yuzi", title: "26. Kuboid va kubning bir yog'i yuzini topish", page: "2-qism, 39-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Kuboidning hajmi va balandligi ma'lum. Kuboid gorizontal qatlamlarga kesiladi — bitta qatlamning (asosning) yuzi = V : balandlik. Yoq yuzi kataklar bilan bo'yaladi va yoyilmada ham ko'rsatiladi." },
            { id: "doiraviy-diagramma-tuzish", title: "27. Doiraviy diagrammada ma'lumotlarni taqdim etish", page: "2-qism, 54-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Jadvaldagi ma'lumotlar (masalan sinfning sevimli fanlari) doiraviy diagrammaga aylanadi: har bir qator foiz va gradusga o'tkaziladi (1% = 3,6°), sektorlar birin-ketin chiziladi. Jadvaldagi son o'zgarsa, sektorlar ham o'zgaradi." },
            { id: "doiraviy-diagramma-oqish", title: "28. Doiraviy diagrammani o'qish va talqin qilish", page: "2-qism, 57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Tayyor diagramma va jami miqdor. Sektor bosilsa uning foizi, gradusi va miqdori ko'rsatiladi. Savollar: eng katta qism, ikki qism farqi, berilgan sektorda nechta odam bor." },
            { id: "konus-silindr-prizma-piramida", title: "29. Konus, silindr, prizma va piramida", page: "2-qism, 75-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "3D jismlar aylantiriladi: asoslar, yon yoqlar, qirralar va uchlar ranglar bilan belgilanadi va sanaladi. Jismlarni xossalariga qarab guruhlash topshirig'i (asosi doira / ko'pburchak, uchi bor / yo'q)." },
            { id: "fazoviy-jismlarni-chizish", title: "30. Uch o'lchamli panjarada fazoviy jismlarni chizish", page: "2-qism, 78-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Chapda 3D jism (prizma, piramida, kuboid), o'ngda izometrik nuqtali panjara. O'quvchi nuqtalarni ulab jismni chizadi; ko'rinmas qirralar shtrix chiziq bilan chiziladi, to'g'ri chizilgan qirralar yashil rangga kiradi." },
            { id: "fazoviy-jismlar-yoyilmasi", title: "31. Fazoviy jismlarning yoyilmasi", page: "2-qism, 82-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/5-matematika-hajm.html", test: null, simPlan: "Jism animatsiya bilan «ochilib» tekis yoyilmaga aylanadi va qaytib yig'iladi. Topshiriq: bir nechta yoyilmadan qaysi biri kubga yig'iladi — tanlangan yoyilma yig'ilib ko'rsatiladi." }
          ]
        }
      ]
    },
    {
      id: "7",
      name: "7-sinf",
      subjects: [
        {
          id: "matematika-2026",
          name: "Matematika (2026-yil)",
          topics: [
            {
              id: "tub-sonlar-daraja", title: "1.1 Tub sonlar, tub ko'paytuvchilarga ajratish va daraja", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Har bir natural son o'zining bo'luvchilariga ega. <strong>Bo'luvchi</strong> — berilgan sonni qoldiqsiz bo'ladigan son. Masalan, 12 sonining bo'luvchilari: 1, 2, 3, 4, 6, 12.</p>"
                ),
                secText("Tub va murakkab sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> faqat 1 ga va o'ziga bo'linadigan (ya'ni aynan ikkita bo'luvchisi bor) 1 dan katta natural son <strong>tub son</strong> deyiladi. Ikkitadan ortiq bo'luvchisi bor son <strong>murakkab son</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2, 3, 5, 7, 11, 13, 17, 19 — tub sonlar. 4, 6, 8, 9, 10, 12 — murakkab sonlar. 1 soni na tub, na murakkab.</div>"
                ),
                secText("Tub ko'paytuvchilarga ajratish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har qanday murakkab sonni tub sonlarning ko'paytmasi ko'rinishida yozish mumkin. Buning uchun sonni eng kichik tub bo'luvchisiga ketma-ket bo'lib boramiz.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='150' viewBox='0 0 200 150'>" +
                      "<text x='100' y='18' font-size='14' text-anchor='middle' fill='#1f2433'>60</text>" +
                      "<line x1='95' y1='24' x2='60' y2='44' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='105' y1='24' x2='140' y2='44' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='55' y='58' font-size='13' text-anchor='middle' fill='#16a394'>2</text>" +
                      "<text x='145' y='58' font-size='14' text-anchor='middle' fill='#1f2433'>30</text>" +
                      "<line x1='140' y1='64' x2='110' y2='84' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='150' y1='64' x2='180' y2='84' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='105' y='98' font-size='13' text-anchor='middle' fill='#16a394'>2</text>" +
                      "<text x='185' y='98' font-size='14' text-anchor='middle' fill='#1f2433'>15</text>" +
                      "<line x1='180' y1='104' x2='150' y2='124' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='190' y1='104' x2='195' y2='124' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='145' y='138' font-size='13' text-anchor='middle' fill='#16a394'>3</text>" +
                      "<text x='195' y='138' font-size='13' text-anchor='middle' fill='#16a394'>5</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 60 = 2 · 2 · 3 · 5 = 2<sup>2</sup> · 3 · 5.</div>"
                ),
                secText("Daraja",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir xil ko'paytuvchilarning ko'paytmasi <strong>daraja</strong> ko'rinishida yoziladi: a<sup>n</sup> = a · a · … · a (n ta ko'paytuvchi). Bunda a — <strong>asos</strong>, n — <strong>ko'rsatkich</strong>.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2<sup>5</sup> = 2·2·2·2·2 = 32; &nbsp; 10<sup>3</sup> = 1000.</div>"
                ),
                secText("Darajaning xossalari",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>; &nbsp; a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup>; &nbsp; (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>; &nbsp; (ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup>; &nbsp; a<sup>0</sup> = 1 (a ≠ 0).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3<sup>2</sup> · 3<sup>4</sup> = 3<sup>6</sup> = 729; &nbsp; (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup> = 64.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ikki xonali eng katta sonni tub ko'paytuvchilarga ajrating. Uning nechta bo'luvchisi bor? (Maslahat: agar son p<sup>a</sup>·q<sup>b</sup> ko'rinishida bo'lsa, bo'luvchilari soni (a+1)(b+1) ga teng.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-matematika-tub-sonlar.html", test: null
            },
            {
              id: "ekub", title: "1.2 Eng katta umumiy bo'luvchi (EKUB)", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Ikki sonning har ikkisini ham qoldiqsiz bo'ladigan son ularning <strong>umumiy bo'luvchisi</strong> deyiladi. Masalan, 12 va 18 ning umumiy bo'luvchilari: 1, 2, 3, 6.</p>"
                ),
                secText("EKUB ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> berilgan sonlarning barcha umumiy bo'luvchilari ichida eng kattasi <strong>eng katta umumiy bo'luvchi</strong> (EKUB) deyiladi va EKUB(a; b) kabi belgilanadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> EKUB(12; 18) = 6.</div>"
                ),
                secText("EKUB ni tub ko'paytuvchilar orqali topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonlarni tub ko'paytuvchilarga ajratamiz. EKUB — <em>umumiy</em> tub ko'paytuvchilarni <em>eng kichik</em> darajalarda olib ko'paytirish natijasi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 24 = 2<sup>3</sup>·3, &nbsp; 36 = 2<sup>2</sup>·3<sup>2</sup>. Umumiylari: 2<sup>2</sup> va 3. EKUB(24; 36) = 2<sup>2</sup>·3 = 12.</div>"
                ),
                secText("O'zaro tub sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> EKUB(a; b) = 1 bo'lsa, a va b <strong>o'zaro tub sonlar</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 8 va 15 — o'zaro tub, chunki umumiy tub ko'paytuvchisi yo'q.</div>"
                ),
                secText("Tatbiqi — kasrni qisqartirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 24/36 kasrni qisqartirish uchun surat va maxrajni EKUB(24; 36) = 12 ga bo'lamiz: 24/36 = 2/3.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bog'da 48 ta olma va 36 ta nok bor. Ularni bir xil sonli, imkon qadar ko'p savatga baravar joylashtirmoqchimiz. Nechta savat kerak va har birida nechtadan meva bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-matematika-ekub.html", test: null
            },
            {
              id: "ekuk", title: "1.3 Eng kichik umumiy karrali (EKUK)", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Sonning <strong>karralilari</strong> — uni butun songa ko'paytirishdan hosil bo'ladigan sonlar. Masalan, 4 ning karralilari: 4, 8, 12, 16, 20, 24, …</p>"
                ),
                secText("EKUK ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> berilgan sonlarning umumiy karralilari ichida eng kichigi (noldan farqli) <strong>eng kichik umumiy karrali</strong> (EKUK) deyiladi: EKUK(a; b).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4 ning karralilari: 4, 8, <strong>12</strong>, … &nbsp; 6 ning karralilari: 6, <strong>12</strong>, … &nbsp; EKUK(4; 6) = 12.</div>"
                ),
                secText("EKUK ni tub ko'paytuvchilar orqali topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonlarni tub ko'paytuvchilarga ajratamiz. EKUK — uchraydigan <em>barcha</em> tub ko'paytuvchilarni <em>eng katta</em> darajalarda olib ko'paytirish natijasi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 8 = 2<sup>3</sup>, &nbsp; 12 = 2<sup>2</sup>·3. EKUK(8; 12) = 2<sup>3</sup>·3 = 24.</div>"
                ),
                secText("EKUB va EKUK orasidagi bog'lanish",
                  "<div class='lecture-rule'><strong>Formula:</strong> EKUB(a; b) · EKUK(a; b) = a · b.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a = 8, b = 12: EKUB = 4, EKUK = 24; &nbsp; 4·24 = 96 = 8·12.</div>"
                ),
                secText("Tatbiqi — kasrlarni umumiy maxrajga keltirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 1/8 + 1/12 ni hisoblash uchun umumiy maxraj EKUK(8; 12) = 24: &nbsp; 3/24 + 2/24 = 5/24.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bir bekatdan avtobus har 12 daqiqada, trolleybus har 18 daqiqada jo'naydi. Ular soat 8:00 da birga jo'nadi. Keyingi safar qachon birga jo'naydi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-matematika-ekuk.html", test: null
            },
            {
              id: "kvadrat-kub-ildiz", title: "1.4 Sonning kvadrat ildizi va kub ildizi", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Sonning <strong>kvadrati</strong> — uni o'ziga ko'paytirish: a<sup>2</sup> = a·a. Sonning <strong>kubi</strong> — a<sup>3</sup> = a·a·a. Masalan, 7<sup>2</sup> = 49, &nbsp; 4<sup>3</sup> = 64.</p>"
                ),
                secText("Kvadrat ildiz",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> manfiy bo'lmagan a soni uchun kvadrati a ga teng bo'lgan manfiy bo'lmagan son a ning <strong>kvadrat ildizi</strong> deyiladi: √a. Ya'ni (√a)<sup>2</sup> = a.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √49 = 7, chunki 7<sup>2</sup> = 49; &nbsp; √0 = 0; &nbsp; √1 = 1. Manfiy sondan kvadrat ildiz chiqmaydi.</div>"
                ),
                secText("To'liq kvadratlar",
                  "<div class='lecture-figure'><table style='border-collapse:collapse;text-align:center;font-size:.8rem;'>" +
                    "<tr style='color:#6b7280;'><td style='padding:4px 8px;'>n</td><td style='padding:4px 8px;'>1</td><td style='padding:4px 8px;'>2</td><td style='padding:4px 8px;'>3</td><td style='padding:4px 8px;'>4</td><td style='padding:4px 8px;'>5</td><td style='padding:4px 8px;'>6</td><td style='padding:4px 8px;'>7</td><td style='padding:4px 8px;'>8</td><td style='padding:4px 8px;'>9</td><td style='padding:4px 8px;'>10</td></tr>" +
                    "<tr style='font-weight:700;color:#4f5bd5;'><td style='padding:4px 8px;'>n<sup>2</sup></td><td style='padding:4px 8px;'>1</td><td style='padding:4px 8px;'>4</td><td style='padding:4px 8px;'>9</td><td style='padding:4px 8px;'>16</td><td style='padding:4px 8px;'>25</td><td style='padding:4px 8px;'>36</td><td style='padding:4px 8px;'>49</td><td style='padding:4px 8px;'>64</td><td style='padding:4px 8px;'>81</td><td style='padding:4px 8px;'>100</td></tr>" +
                  "</table></div>"
                ),
                secText("Kub ildiz",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kubi a ga teng bo'lgan son a ning <strong>kub ildizi</strong> deyiladi: <sup>3</sup>√a. Ya'ni (<sup>3</sup>√a)<sup>3</sup> = a. Kub ildiz manfiy sondan ham chiqadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> <sup>3</sup>√27 = 3; &nbsp; <sup>3</sup>√(−8) = −2, chunki (−2)<sup>3</sup> = −8.</div>"
                ),
                secText("Aniq bo'lmagan ildizlar",
                  "<p>Agar son to'liq kvadrat (yoki kub) bo'lmasa, ildiz butun yoki oddiy kasr bilan ifodalanmaydi — u <strong>irratsional</strong> sondir.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √2 ≈ 1,414… &nbsp; 1 va 2 orasida: 1<sup>2</sup> = 1 &lt; 2 &lt; 4 = 2<sup>2</sup>, demak 1 &lt; √2 &lt; 2.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tomoni butun son bo'lgan kvadratning yuzi 144 cm<sup>2</sup>. Tomoni qancha? Endi yuzi 200 cm<sup>2</sup> bo'lsa, tomonini butun songacha yaxlitlab ayting.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "manfiy-son-sonlar-oqi", title: "2.1 Manfiy son tushunchasi va sonlar o'qi", page: "27/31-bet",
              sections: [
                secText("Eslang",
                  "<p>Hozirgacha 0 va undan katta sonlar bilan ishladingiz. Ammo harorat 0° dan pastga tushishi, hisobda qarz bo'lishi mumkin. Bularni ifodalash uchun <strong>manfiy sonlar</strong> kiritiladi.</p>"
                ),
                secText("Sonlar o'qi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> boshi (0), yo'nalishi va birlik kesmasi ko'rsatilgan to'g'ri chiziq <strong>sonlar o'qi</strong> deyiladi. 0 dan o'ngda musbat, chapda manfiy sonlar joylashadi.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='320' height='60' viewBox='0 0 320 60'>" +
                      "<line x1='10' y1='30' x2='310' y2='30' stroke='#1f2433' stroke-width='2'/>" +
                      "<polygon points='310,30 300,25 300,35' fill='#1f2433'/>" +
                      "<polygon points='10,30 20,25 20,35' fill='#1f2433'/>" +
                      "<g font-size='11' text-anchor='middle' fill='#1f2433'>" +
                        "<line x1='40' y1='25' x2='40' y2='35' stroke='#1f2433' stroke-width='2'/><text x='40' y='50'>−4</text>" +
                        "<line x1='80' y1='25' x2='80' y2='35' stroke='#1f2433' stroke-width='2'/><text x='80' y='50'>−3</text>" +
                        "<line x1='120' y1='25' x2='120' y2='35' stroke='#1f2433' stroke-width='2'/><text x='120' y='50'>−2</text>" +
                        "<line x1='160' y1='25' x2='160' y2='35' stroke='#1f2433' stroke-width='2'/><text x='160' y='50'>−1</text>" +
                        "<circle cx='200' cy='30' r='4' fill='#4f5bd5'/><text x='200' y='50' fill='#4f5bd5'>0</text>" +
                        "<line x1='240' y1='25' x2='240' y2='35' stroke='#1f2433' stroke-width='2'/><text x='240' y='50'>1</text>" +
                        "<line x1='280' y1='25' x2='280' y2='35' stroke='#1f2433' stroke-width='2'/><text x='280' y='50'>2</text>" +
                      "</g>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Qarama-qarshi sonlar va modul",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> 0 dan bir xil uzoqlikda, turli tomonda yotgan sonlar <strong>qarama-qarshi</strong> sonlar (a va −a). Sonning 0 gacha bo'lgan masofasi uning <strong>moduli</strong> deyiladi: |a|.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> |−5| = 5, &nbsp; |5| = 5, &nbsp; |0| = 0. 7 ning qarama-qarshisi −7.</div>"
                ),
                secText("Butun sonlarni taqqoslash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonlar o'qida chaproqda turgan son kichik, o'ngroqda turgani katta. Har qanday manfiy son har qanday musbat sondan kichik; 0 dan ham kichik.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −5 &lt; −2, &nbsp; −1 &lt; 0 &lt; 3, &nbsp; −100 &lt; 1.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Kunduzi harorat +3°, kechasi −8° bo'ldi. Harorat necha gradusga o'zgardi? Sonlar o'qida bu o'zgarishni ko'rsating.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/6-matematika-musbat-manfiy-sonlar.html", test: null
            },
            {
              id: "butun-sonlar-qoshish-ayirish", title: "2.2 Butun sonlarni qo'shish va ayirish", page: "27/31-bet",
              sections: [
                secText("Bir xil ishorali sonlarni qo'shish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ishoralari bir xil bo'lgan sonlarni qo'shish uchun modullarini qo'shamiz, natijaga umumiy ishorani qo'yamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −3 + (−5) = −(3 + 5) = −8; &nbsp; 4 + 6 = 10.</div>"
                ),
                secText("Har xil ishorali sonlarni qo'shish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> katta modulidan kichik modulini ayiramiz, natijaga moduli katta bo'lgan sonning ishorasini qo'yamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −7 + 4 = −(7 − 4) = −3; &nbsp; 9 + (−2) = 7; &nbsp; −6 + 6 = 0.</div>"
                ),
                secText("Ayirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonni ayirish — uning qarama-qarshisini qo'shish bilan bir xil: a − b = a + (−b).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 − (−3) = 5 + 3 = 8; &nbsp; −4 − 7 = −4 + (−7) = −11; &nbsp; −2 − (−9) = −2 + 9 = 7.</div>"
                ),
                secText("Sonlar o'qida qo'shish",
                  "<div class='lecture-figure'>" +
                    "<svg width='320' height='70' viewBox='0 0 320 70'>" +
                      "<line x1='10' y1='45' x2='310' y2='45' stroke='#1f2433' stroke-width='2'/>" +
                      "<g font-size='11' text-anchor='middle' fill='#1f2433'>" +
                        "<line x1='60' y1='40' x2='60' y2='50' stroke='#1f2433' stroke-width='2'/><text x='60' y='64'>−2</text>" +
                        "<line x1='120' y1='40' x2='120' y2='50' stroke='#1f2433' stroke-width='2'/><text x='120' y='64'>0</text>" +
                        "<line x1='180' y1='40' x2='180' y2='50' stroke='#1f2433' stroke-width='2'/><text x='180' y='64'>2</text>" +
                        "<line x1='240' y1='40' x2='240' y2='50' stroke='#1f2433' stroke-width='2'/><text x='240' y='64'>4</text>" +
                      "</g>" +
                      "<path d='M120 30 Q150 8 180 30' fill='none' stroke='#16a394' stroke-width='2'/>" +
                      "<polygon points='180,30 172,26 174,34' fill='#16a394'/>" +
                      "<path d='M180 30 Q210 8 240 30' fill='none' stroke='#16a394' stroke-width='2'/>" +
                      "<polygon points='240,30 232,26 234,34' fill='#16a394'/>" +
                      "<text x='180' y='18' font-size='11' text-anchor='middle' fill='#16a394'>0 + 2 + 2 = 4</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Musbat sonni qo'shish — o'ngga siljish, manfiy sonni qo'shish — chapga siljish.</p>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Liftda odam 7-qavatdan 3 qavat pastga, keyin 8 qavat yuqoriga, so'ng 2 qavat pastga chiqdi. U nechanchi qavatda? Amalni butun sonlar qo'shindisi ko'rinishida yozing.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "butun-sonlar-kopaytirish-bolish", title: "2.3 Butun sonlarni ko'paytirish, bo'lish va ular ustida amallar", page: "27/31-bet",
              sections: [
                secText("Ishoralar qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ishoralari <em>bir xil</em> ikki sonning ko'paytmasi (va bo'linmasi) — <strong>musbat</strong>; ishoralari <em>har xil</em> bo'lsa — <strong>manfiy</strong>.</div>" +
                  "<div class='lecture-figure'><table style='border-collapse:collapse;text-align:center;font-weight:700;font-size:.85rem;'>" +
                    "<tr><td style='padding:6px 12px;'>(+)·(+) = +</td><td style='padding:6px 12px;'>(−)·(−) = +</td></tr>" +
                    "<tr><td style='padding:6px 12px;'>(+)·(−) = −</td><td style='padding:6px 12px;'>(−)·(+) = −</td></tr>" +
                  "</table></div>"
                ),
                secText("Ko'paytirish",
                  "<div class='lecture-example'><strong>Misol:</strong> −4 · 6 = −24; &nbsp; −5 · (−3) = 15; &nbsp; 7 · (−2) = −14; &nbsp; a · 0 = 0.</div>"
                ),
                secText("Bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bo'lishda ham xuddi shu ishoralar qoidasi ishlaydi. 0 ga bo'lish mumkin emas.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −20 : 4 = −5; &nbsp; −18 : (−3) = 6; &nbsp; 15 : (−5) = −3.</div>"
                ),
                secText("Bir nechta ko'paytuvchi va daraja",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ko'paytmadagi manfiy ko'paytuvchilar soni <em>juft</em> bo'lsa natija musbat, <em>toq</em> bo'lsa manfiy.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (−1)·(−2)·(−3) = −6 (toq); &nbsp; (−2)<sup>4</sup> = 16; &nbsp; (−2)<sup>3</sup> = −8.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>(−1)<sup>2026</sup> + (−1)<sup>2027</sup> ifodaning qiymatini hisoblang. Umuman, (−1)<sup>n</sup> qiymati n ning qanday bo'lishiga bog'liq?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "ratsional-irratsional-haqiqiy-sonlar", title: "2.4 Ratsional, irratsional va haqiqiy sonlar", page: "27/31-bet",
              sections: [
                secText("Ratsional sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> p/q ko'rinishida (p — butun son, q — natural son) yozish mumkin bo'lgan son <strong>ratsional son</strong> deyiladi. Barcha butun sonlar va oddiy kasrlar ratsionaldir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 = 5/1, &nbsp; −0,75 = −3/4, &nbsp; 2⅓ = 7/3 — hammasi ratsional.</div>"
                ),
                secText("Ratsional sonning o'nli ko'rinishi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har qanday ratsional son <em>chekli</em> yoki <em>cheksiz davriy</em> o'nli kasr ko'rinishida yoziladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1/4 = 0,25 (chekli); &nbsp; 1/3 = 0,333… = 0,(3) (davriy).</div>"
                ),
                secText("Irratsional sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> cheksiz <em>davriy bo'lmagan</em> o'nli kasr <strong>irratsional son</strong> deyiladi. Uni p/q ko'rinishida yozib bo'lmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √2 = 1,41421356…, &nbsp; π = 3,14159265…, &nbsp; <sup>3</sup>√5.</div>"
                ),
                secText("Haqiqiy sonlar",
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='120' viewBox='0 0 260 120'>" +
                      "<rect x='10' y='10' width='240' height='100' rx='10' fill='#f6f7fb' stroke='#1f2433'/>" +
                      "<text x='130' y='28' font-size='12' text-anchor='middle' fill='#1f2433'>Haqiqiy sonlar (R)</text>" +
                      "<rect x='25' y='38' width='140' height='60' rx='8' fill='#eef0fb' stroke='#4f5bd5'/>" +
                      "<text x='95' y='54' font-size='11' text-anchor='middle' fill='#4f5bd5'>Ratsional (Q)</text>" +
                      "<rect x='35' y='62' width='90' height='28' rx='6' fill='#e6f7f4' stroke='#16a394'/>" +
                      "<text x='80' y='80' font-size='10' text-anchor='middle' fill='#16a394'>Butun (Z)</text>" +
                      "<text x='205' y='70' font-size='11' text-anchor='middle' fill='#1f2433'>Irratsional</text>" +
                      "<text x='205' y='84' font-size='10' text-anchor='middle' fill='#1f2433'>√2, π</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ratsional va irratsional sonlar birgalikda <strong>haqiqiy sonlar</strong>ni tashkil qiladi. Sonlar o'qidagi har bir nuqtaga bitta haqiqiy son mos keladi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>0,1010010001… (har safar birlar orasida nollar soni bittaga ortadi) — bu son ratsionalmi yoki irratsionalmi? Nega?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "haqiqiy-sonlar-amallar", title: "2.5 Haqiqiy sonlar ustida amallar", page: "27/31-bet",
              sections: [
                secText("Amallarning asosiy xossalari",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a + b = b + a; &nbsp; ab = ba (o'rin almashtirish); &nbsp; (a + b) + c = a + (b + c); &nbsp; (ab)c = a(bc) (guruhlash); &nbsp; a(b + c) = ab + ac (taqsimot).</div>"
                ),
                secText("Nol va birning xossalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> a + 0 = a; &nbsp; a + (−a) = 0; &nbsp; a · 1 = a; &nbsp; a · (1/a) = 1 (a ≠ 0); &nbsp; a · 0 = 0.</div>"
                ),
                secText("Solishtirish va tartib",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ixtiyoriy ikki haqiqiy sondan biri ikkinchisiga teng yoki undan katta/kichik. Tengsizlikning ikkala tomoniga bir xil son qo'shsak, tengsizlik saqlanadi; musbat songa ko'paytirsak saqlanadi, manfiyga ko'paytirsak ishorasi teskari bo'ladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −3 &lt; 5 &nbsp;⇒&nbsp; −3·(−2) &gt; 5·(−2), ya'ni 6 &gt; −10.</div>"
                ),
                secText("Ildizli ifodalar bilan amallar",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> √a · √b = √(ab); &nbsp; √a : √b = √(a/b); &nbsp; (√a)<sup>2</sup> = a (a ≥ 0).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √2 · √8 = √16 = 4; &nbsp; √50 = √(25·2) = 5√2.</div>"
                ),
                secText("Taqribiy hisoblash",
                  "<div class='lecture-example'><strong>Misol:</strong> √2 + √3 ≈ 1,41 + 1,73 = 3,14 (yuzdan bir aniqlikda).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>√3 · √3 ratsionalmi? √2 + (−√2) ning qiymati qanday? Irratsional sonlar yig'indisi doim irratsional bo'ladimi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "xonagacha-yaxlitlash", title: "3.1 Sonlarni belgilangan xonasigacha yaxlitlash", page: "53/65-bet",
              sections: [
                secText("Yaxlitlash nima?",
                  "<p><strong>Yaxlitlash</strong> — sonni unga yaqin, ko'proq «yumaloq» son bilan almashtirish. Natija <strong>≈</strong> (taqriban teng) belgisi bilan yoziladi.</p>"
                ),
                secText("Yaxlitlash qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> yaxlitlanayotgan xonadan keyingi raqamga qaraymiz. Agar u <strong>5 dan kichik</strong> bo'lsa — xona raqami o'zgarmaydi (kam tomonga). Agar <strong>5 yoki undan katta</strong> bo'lsa — xona raqamiga 1 qo'shiladi (ortiq tomonga). Yaxlitlangan xonadan keyingi raqamlar nol bilan almashtiriladi yoki tashlab yuboriladi.</div>"
                ),
                secText("O'nli kasrlarni yaxlitlash",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='55' viewBox='0 0 300 55'>" +
                      "<line x1='20' y1='30' x2='280' y2='30' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='40' y1='25' x2='40' y2='35' stroke='#1f2433' stroke-width='2'/><text x='40' y='48' font-size='11' text-anchor='middle'>3,7</text>" +
                      "<line x1='260' y1='25' x2='260' y2='35' stroke='#1f2433' stroke-width='2'/><text x='260' y='48' font-size='11' text-anchor='middle'>3,8</text>" +
                      "<circle cx='216' cy='30' r='4' fill='#4f5bd5'/><text x='216' y='18' font-size='11' text-anchor='middle' fill='#4f5bd5'>3,74</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3,74 ≈ 3,7 (o'ndan birgacha, chunki keyingi raqam 4 &lt; 5); &nbsp; 12,865 ≈ 12,87 (yuzdan birgacha).</div>"
                ),
                secText("Katta sonlarni yaxlitlash",
                  "<div class='lecture-example'><strong>Misol:</strong> 2857 ≈ 2900 (yuzlargacha); &nbsp; 2857 ≈ 3000 (mingdargacha); &nbsp; 34 519 ≈ 34 520 (o'nlargacha).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bir sonni o'nlargacha yaxlitlaganda 750, yuzlargacha yaxlitlaganda 700 chiqdi. Bu son qanday oraliqda yotadi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "ahamiyatli-raqamgacha-yaxlitlash", title: "3.2 Sonlarni belgilangan ahamiyatli raqamgacha yaxlitlash", page: "53/65-bet",
              sections: [
                secText("Ahamiyatli raqam nima?",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> sonning birinchi noldan farqli raqamidan boshlab sanaladigan barcha raqamlari <strong>ahamiyatli raqamlar</strong> deyiladi. Boshidagi nollar ahamiyatli emas.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 0,004072 — ahamiyatli raqamlari: 4, 0, 7, 2 (jami 4 ta). 35 800 — ahamiyatli raqamlari: 3, 5, 8.</div>"
                ),
                secText("Ahamiyatli raqamgacha yaxlitlash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kerakli sondagi ahamiyatli raqamni qoldirib, keyingisiga qarab (5 dan kichik/katta) yaxlitlaymiz. Butun qismdagi tashlab yuborilgan raqamlar nol bilan almashtiriladi.</div>"
                ),
                secText("Misollar",
                  "<div class='lecture-example'><strong>Misol:</strong> 0,004072 ≈ 0,0041 (2 ta ahamiyatli raqam); &nbsp; 34 570 ≈ 35 000 (2 ta ahamiyatli raqam); &nbsp; 7,318 ≈ 7,32 (3 ta ahamiyatli raqam).</div>"
                ),
                secText("Xona va ahamiyatli raqam farqi",
                  "<p>«O'ngacha yaxlitlash» — aniq xona ko'rsatiladi. «Ikki ahamiyatli raqamgacha yaxlitlash» — sonning kattaligidan qat'i nazar, faqat ikkita ma'noli raqam qoldiriladi.</p>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Yorug'lik tezligi 299 792 458 m/s. Uni: a) 1 ta; b) 2 ta; d) 3 ta ahamiyatli raqamgacha yaxlitlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "chamalash", title: "3.3 Chamalash", page: "53/65-bet",
              sections: [
                secText("Chamalash nima?",
                  "<p><strong>Chamalash</strong> — sonlarni qulay yaxlitlab, hisobni tez va taxminan bajarish. U aniq javob emas, balki javobning taxminiy kattaligini bilish uchun kerak.</p>"
                ),
                secText("Chamalash qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> amaldagi har bir sonni hisoblash oson bo'ladigan «yumaloq» songa yaxlitlaymiz, so'ng amalni bajaramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 412 · 19 ≈ 400 · 20 = 8000 (aniq javob 7828 ga yaqin); &nbsp; 6187 : 29 ≈ 6000 : 30 = 200.</div>"
                ),
                secText("Javobni tekshirish uchun chamalash",
                  "<div class='lecture-example'><strong>Misol:</strong> hisoblab 38 · 52 = 1976 deb topdik. Chama: 40 · 50 = 2000. Javob 2000 ga yaqin — demak ishonchli.</div>"
                ),
                secText("Turmushda chamalash",
                  "<div class='lecture-example'><strong>Misol:</strong> do'konda 3 ta 2870 so'mlik, 2 ta 5100 so'mlik mahsulot. Chama: 3·3000 + 2·5000 = 19 000 so'm atrofida.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bir maktabda 28 sinf, har birida o'rtacha 26 o'quvchi. Maktabda taxminan nechta o'quvchi bor? Aniq son 728 dan qanchalik farq qiladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "algebraga-kirish", title: "4.1 Algebraga kirish", page: "71/89-bet",
              sections: [
                secText("O'zgaruvchi va harfiy ifoda",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> turli qiymatlar qabul qila oladigan harf <strong>o'zgaruvchi</strong> deyiladi. Sonlar, o'zgaruvchilar va amal belgilaridan tuzilgan yozuv <strong>harfiy (algebraik) ifoda</strong>dir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x + 5, &nbsp; a − b, &nbsp; 2(m + n) — algebraik ifodalar.</div>"
                ),
                secText("Had, koeffitsient, ozod had",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ifodadagi «+» yoki «−» bilan ajralgan qismlar <strong>hadlar</strong> deyiladi. O'zgaruvchi oldidagi son <strong>koeffitsient</strong>, o'zgaruvchisiz turgan son <strong>ozod had</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5x − 3y + 7 ifodasida: hadlar 5x, −3y, 7; koeffitsientlar 5 va −3; ozod had 7.</div>"
                ),
                secText("Ifodaning qiymatini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'zgaruvchi o'rniga berilgan sonni qo'yib, amallar tartibi bo'yicha hisoblaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2x + 3 ifodasida x = 4: &nbsp; 2·4 + 3 = 11. &nbsp; x = −1: &nbsp; 2·(−1) + 3 = 1.</div>"
                ),
                secText("Formulalar",
                  "<div class='lecture-rule'><strong>Formula</strong> — kattaliklar orasidagi bog'lanishni harflar bilan ifodalash.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> to'rtburchak perimetri P = 2(a + b); yuzi S = a·b; yo'l s = v·t.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>«Bir sonning uch baravaridan 4 ni ayirsak, 20 chiqadi» jumlasini algebraik ifoda (tenglama) shaklida yozing. O'zgaruvchini o'zingiz tanlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "chiziqli-ifodalarni-soddalashtirish", title: "4.2 Chiziqli ifodalarni soddalashtirish", page: "71/89-bet",
              sections: [
                secText("O'xshash hadlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> o'zgaruvchi qismi bir xil bo'lgan hadlar <strong>o'xshash hadlar</strong> deyiladi. Ozod hadlar ham o'zaro o'xshash.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5x va −2x — o'xshash; &nbsp; 7 va 3 — o'xshash; &nbsp; 5x va 5y — o'xshash emas.</div>"
                ),
                secText("O'xshash hadlarni ixchamlash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'xshash hadlarni qo'shish (ayirish) uchun ularning koeffitsientlarini qo'shamiz (ayiramiz), o'zgaruvchi qismini o'zgartirmaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5x + 3 − 2x + 7 = (5x − 2x) + (3 + 7) = 3x + 10.</div>"
                ),
                secText("Songa ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ifodani songa ko'paytirish uchun har bir hadni shu songa ko'paytiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3·(2x) = 6x; &nbsp; 4·(x + 2) = 4x + 8; &nbsp; −2·(3a − 1) = −6a + 2.</div>"
                ),
                secText("Bosqichli soddalashtirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 2(x + 3) + 3(2x − 1) = 2x + 6 + 6x − 3 = 8x + 3.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a(x + 1) + b(x − 1) ifodani soddalashtiring. Natija faqat ozod haddan iborat bo'lishi uchun a va b qanday bog'liq bo'lishi kerak?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "qavslarni-ochish", title: "4.3 Chiziqli ifodalarda qavslarni ochish", page: "71/89-bet",
              sections: [
                secText("Qavs oldida «+» bo'lsa",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs oldida «+» ishorasi (yoki hech narsa) tursa, qavs shundoqqina olib tashlanadi, hadlar ishorasi o'zgarmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a + (b − c) = a + b − c.</div>"
                ),
                secText("Qavs oldida «−» bo'lsa",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs oldida «−» ishorasi tursa, qavs olib tashlanganda ichidagi barcha hadlarning ishorasi qarama-qarshisiga o'zgaradi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a − (b − c) = a − b + c; &nbsp; 5 − (2x − 3) = 5 − 2x + 3 = 8 − 2x.</div>"
                ),
                secText("Ko'paytuvchi bilan qavsni ochish",
                  "<div class='lecture-rule'><strong>Formula (taqsimot qonuni):</strong> a(b + c) = ab + ac; &nbsp; a(b − c) = ab − ac.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3(2x − 5) = 6x − 15; &nbsp; −2(4 − 3y) = −8 + 6y.</div>"
                ),
                secText("Aralash misol",
                  "<div class='lecture-example'><strong>Misol:</strong> 4(x − 2) − 3(2x − 5) = 4x − 8 − 6x + 15 = −2x + 7.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>−(−(−(x − 1))) ifodani soddalashtiring. Nechta minus bo'lganda ifoda x − 1 ga, nechtasida 1 − x ga teng bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kopaytuvchilarga-ajratish", title: "4.4 Algebraik ifodalarni ko'paytuvchilarga ajratish", page: "71/89-bet",
              sections: [
                secText("Ko'paytuvchilarga ajratish nima?",
                  "<p><strong>Ko'paytuvchilarga ajratish</strong> — ko'phadni bir nechta ifodaning ko'paytmasi ko'rinishida yozish. Bu qavs ochishga teskari amal.</p>"
                ),
                secText("Umumiy ko'paytuvchini qavs tashqarisiga chiqarish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> barcha hadlarda uchraydigan umumiy ko'paytuvchini topib, qavs tashqarisiga chiqaramiz: ab + ac = a(b + c).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 6x + 9 = 3(2x + 3); &nbsp; 4a<sup>2</sup> − 8a = 4a(a − 2).</div>"
                ),
                secText("Guruhlash usuli",
                  "<div class='lecture-rule'><strong>Qoida:</strong> hadlarni umumiy ko'paytuvchisi bor guruhlarga ajratamiz, so'ng umumiy qavsni chiqaramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ax + ay + bx + by = a(x + y) + b(x + y) = (x + y)(a + b).</div>"
                ),
                secText("Qisqa ko'paytirish formulalari bilan",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b); &nbsp; a<sup>2</sup> ± 2ab + b<sup>2</sup> = (a ± b)<sup>2</sup>.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>2</sup> − 25 = (x − 5)(x + 5); &nbsp; x<sup>2</sup> + 6x + 9 = (x + 3)<sup>2</sup>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Interaktiv ko'rgazmadan foydalanib, 2x<sup>2</sup> + 4x + 2 ifodani to'liq ko'paytuvchilarga ajrating (avval umumiy ko'paytuvchi, keyin formulani qo'llang).</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-algebra-kopaytuvchilarga-ajratish.html", test: null
            },
            {
              id: "sodda-chiziqli-tenglamalar", title: "5.1 Sodda chiziqli tenglamalar", page: "101/123-bet",
              sections: [
                secText("Tenglama va uning ildizi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> o'zgaruvchi qatnashgan tenglik <strong>tenglama</strong> deyiladi. Tenglamani to'g'ri tenglikka aylantiradigan o'zgaruvchi qiymati uning <strong>ildizi</strong> (yechimi) deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x + 7 = 15 tenglamaning ildizi x = 8, chunki 8 + 7 = 15.</div>"
                ),
                secText("Teng kuchli almashtirishlar",
                  "<div class='lecture-figure'>" +
                    "<svg width='220' height='110' viewBox='0 0 220 110'>" +
                      "<line x1='110' y1='12' x2='110' y2='34' stroke='#1f2433' stroke-width='3'/>" +
                      "<line x1='35' y1='34' x2='185' y2='34' stroke='#1f2433' stroke-width='3'/>" +
                      "<line x1='55' y1='34' x2='40' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='55' y1='34' x2='70' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='165' y1='34' x2='150' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='165' y1='34' x2='180' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<ellipse cx='55' cy='72' rx='40' ry='15' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<ellipse cx='165' cy='72' rx='40' ry='15' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='55' y='77' font-size='12' text-anchor='middle' fill='#4f5bd5'>3x − 7</text>" +
                      "<text x='165' y='77' font-size='12' text-anchor='middle' fill='#16a394'>8</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> tenglamaning ikkala tomoniga bir xil sonni qo'shsak/ayirsak yoki noldan farqli bir xil songa ko'paytirsak/bo'lsak, ildizi o'zgarmaydi. Hadni bir tomondan ikkinchisiga <em>ishorasini o'zgartirib</em> o'tkazish mumkin.</div>"
                ),
                secText("Chiziqli tenglamani yechish",
                  "<div class='lecture-rule'><strong>Umumiy ko'rinishi:</strong> ax + b = 0 &nbsp;⇒&nbsp; x = −b/a (a ≠ 0 bo'lganda).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x − 7 = 8 &nbsp;⇒&nbsp; 3x = 15 &nbsp;⇒&nbsp; x = 5.</div>"
                ),
                secText("Tekshirish",
                  "<div class='lecture-example'><strong>Misol:</strong> x = 5 ni qo'yamiz: 3·5 − 7 = 8. To'g'ri, demak ildiz to'g'ri topilgan.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Interaktiv ko'rgazmadan foydalanib 5x + 3 = 2x + 18 tenglamani bosqichma-bosqich yeching. Har bir bosqichda qaysi almashtirishni qo'llaganingizni ayting.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-algebra-sodda-chiziqli-tenglamalar.html", test: null
            },
            {
              id: "qavs-kasr-chiziqli-tenglamalar", title: "5.2 Qavs va kasrlar qatnashgan chiziqli tenglamalar", page: "101/123-bet",
              sections: [
                secText("Qavsli tenglamalar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> avval barcha qavslarni ochamiz, o'xshash hadlarni ixchamlaymiz, so'ng o'zgaruvchili hadlarni bir tomonga, sonlarni ikkinchi tomonga o'tkazamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2(x − 3) = x + 4 &nbsp;⇒&nbsp; 2x − 6 = x + 4 &nbsp;⇒&nbsp; x = 10.</div>"
                ),
                secText("Kasr koeffitsientli tenglamalar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> tenglamaning ikkala tomonini barcha maxrajlarning umumiy karralisiga (EKUK) ko'paytiramiz — kasrlar yo'qoladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x/2 + x/3 = 5. Ikkala tomonni 6 ga ko'paytiramiz: 3x + 2x = 30 &nbsp;⇒&nbsp; 5x = 30 &nbsp;⇒&nbsp; x = 6.</div>"
                ),
                secText("Aralash misol",
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 1)/2 − (x − 2)/3 = 1. 6 ga ko'paytiramiz: 3(x + 1) − 2(x − 2) = 6 &nbsp;⇒&nbsp; 3x + 3 − 2x + 4 = 6 &nbsp;⇒&nbsp; x = −1.</div>"
                ),
                secText("Maxsus hollar",
                  "<div class='lecture-rule'><strong>Eslatma:</strong> soddalashtirishdan keyin 0·x = 0 chiqsa — cheksiz ko'p yechim; 0·x = 5 kabi (noto'g'ri tenglik) chiqsa — yechim yo'q.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>3(x − 2) − 2(x − 3) tenglamaning chap tomoni. O'ng tomonga qanday ifoda qo'ysak, tenglama <em>har qanday</em> x uchun to'g'ri bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "sodda-kasr-chiziqli-tenglamalar", title: "5.3 Sodda kasr-chiziqli tenglamalar", page: "101/123-bet",
              sections: [
                secText("Kasr-chiziqli tenglama nima?",
                  "<p>Maxrajida o'zgaruvchi qatnashgan tenglama <strong>kasr-chiziqli tenglama</strong> deyiladi. Masalan, 6/x = 3 &nbsp; yoki &nbsp; 1/(x − 2) = 5.</p>"
                ),
                secText("Yechish tartibi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> 1) maxraj noldan farqli degan shartni yozamiz (JCHS — joiz qiymatlar sohasi); 2) ikkala tomonni maxrajga ko'paytiramiz; 3) hosil bo'lgan chiziqli tenglamani yechamiz; 4) topilgan ildiz shartni qanoatlantirishini tekshiramiz.</div>"
                ),
                secText("Misol",
                  "<div class='lecture-example'><strong>Misol:</strong> 6/x = 3, &nbsp; x ≠ 0. Ikkala tomonni x ga ko'paytiramiz: 6 = 3x &nbsp;⇒&nbsp; x = 2. &nbsp; 2 ≠ 0 — javob: x = 2.</div>"
                ),
                secText("Chetki (begona) ildiz",
                  "<div class='lecture-example'><strong>Misol:</strong> 1/(x − 3) = 1/(x − 3) turidagi almashtirishdan keyin x = 3 chiqsa, u JCHS ga kirmaydi — begona ildiz, tashlab yuboriladi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>10/(x + 1) = 2 tenglamani yeching. Endi o'ng tomondagi 2 o'rniga 0 qo'ysangiz, tenglamaning yechimi bo'ladimi? Nega?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tenglama-matnli-masalalar", title: "5.4 Chiziqli tenglama tuzib yechiladigan matnli masalalar", page: "101/123-bet",
              sections: [
                secText("Masala yechish bosqichlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> 1) noma'lum kattalikni x deb belgilaymiz; 2) masaladagi shartga ko'ra tenglama tuzamiz; 3) tenglamani yechamiz; 4) topilgan qiymatni masala savoliga moslab javob yozamiz va shartga tekshiramiz.</div>"
                ),
                secText("Sonlarga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Ikki sonning yig'indisi 40, biri ikkinchisidan 6 ga katta. Kichigi x bo'lsa: x + (x + 6) = 40 &nbsp;⇒&nbsp; 2x = 34 &nbsp;⇒&nbsp; x = 17. Sonlar: 17 va 23.</div>"
                ),
                secText("Harakatga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Piyoda 5 km/soat, velosipedchi 15 km/soat. Ular bir vaqtda bir tomonga jo'nadi, velosipedchi 2 soat kech chiqdi. Velosipedchi piyodani necha soatdan keyin quvib yetadi? &nbsp; 5(t + 2) = 15t &nbsp;⇒&nbsp; 5t + 10 = 15t &nbsp;⇒&nbsp; t = 1 soat.</div>"
                ),
                secText("Yoshlarga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Otasi o'g'lidan 3 marta katta, 12 yildan keyin 2 marta katta bo'ladi. O'g'li x yosh: 3x + 12 = 2(x + 12) &nbsp;⇒&nbsp; x = 12.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Hovuzni birinchi quvur 6 soatda, ikkinchisi 3 soatda to'ldiradi. Ikkalasi birga ochilsa, hovuz necha soatda to'ladi? (Butun ishni 1 deb oling.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "nuqta-togri-chiziq-tekislik", title: "6.1 Nuqta, to'g'ri chiziq va tekislik", page: "127/145-bet",
              sections: [
                secText("Asosiy geometrik tushunchalar",
                  "<p><strong>Nuqta</strong>, <strong>to'g'ri chiziq</strong> va <strong>tekislik</strong> — geometriyaning eng sodda, ta'riflanmaydigan tushunchalari. Nuqta bosh harflar (A, B, C), to'g'ri chiziq kichik harf (a, b) yoki ikki nuqtasi bilan (AB) belgilanadi.</p>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='70' viewBox='0 0 260 70'>" +
                      "<line x1='15' y1='25' x2='120' y2='25' stroke='#1f2433' stroke-width='2'/>" +
                      "<circle cx='40' cy='25' r='3' fill='#4f5bd5'/><text x='40' y='16' font-size='11' text-anchor='middle'>A</text>" +
                      "<circle cx='95' cy='25' r='3' fill='#4f5bd5'/><text x='95' y='16' font-size='11' text-anchor='middle'>B</text>" +
                      "<text x='67' y='44' font-size='10' text-anchor='middle' fill='#6b7280'>kesma AB</text>" +
                      "<line x1='150' y1='25' x2='250' y2='25' stroke='#1f2433' stroke-width='2'/>" +
                      "<polygon points='250,25 242,21 242,29' fill='#1f2433'/>" +
                      "<circle cx='165' cy='25' r='3' fill='#16a394'/><text x='165' y='16' font-size='11' text-anchor='middle'>O</text>" +
                      "<text x='205' y='44' font-size='10' text-anchor='middle' fill='#6b7280'>OX nur</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Kesma, nur, to'g'ri chiziq",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ikki nuqta va ular orasidagi qism — <strong>kesma</strong>; bir nuqtadan boshlanib bir tomonga cheksiz davom etadigan qism — <strong>nur</strong>; ikkala tomonga cheksiz — <strong>to'g'ri chiziq</strong>.</div>"
                ),
                secText("Asosiy xossalar (aksiomalar)",
                  "<div class='lecture-rule'><strong>Aksioma:</strong> ixtiyoriy ikki nuqta orqali faqat bitta to'g'ri chiziq o'tkazish mumkin. Ikki to'g'ri chiziq yo bitta umumiy nuqtaga ega (kesishadi), yo umuman kesishmaydi (parallel), yoki ustma-ust tushadi.</div>"
                ),
                secText("Nuqtalarning joylashuvi",
                  "<div class='lecture-example'><strong>Misol:</strong> A, B, C nuqtalar bitta to'g'ri chiziqda yotsa, ular <strong>kollinear</strong> deyiladi. B nuqta A va C orasida bo'lsa: AB + BC = AC.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tekislikda 4 ta nuqta berilgan, ularning hech uchtasi bitta to'g'ri chiziqda yotmaydi. Ular orqali nechta har xil to'g'ri chiziq o'tkazish mumkin?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchaklar-tushunchasi", title: "6.2 Burchaklar", page: "127/145-bet",
              sections: [
                secText("Burchak ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> umumiy boshlang'ich nuqtaga (uchiga) ega ikki nurdan tuzilgan shakl <strong>burchak</strong> deyiladi. Nurlar — burchakning <strong>tomonlari</strong>. Belgilanishi: ∠AOB yoki ∠O.</div>"
                ),
                secText("Burchakni o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> burchak <strong>gradus</strong>da (°) transportir bilan o'lchanadi. To'liq burilish 360°, yoyiq burchak 180°.</div>"
                ),
                secText("Burchak turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='90' viewBox='0 0 300 90'>" +
                      "<g stroke='#4f5bd5' stroke-width='2' fill='none'>" +
                        "<path d='M30 75 L30 25'/><path d='M30 75 L70 55'/>" +
                        "<path d='M110 75 L110 25'/><path d='M110 75 L150 75'/>" +
                        "<path d='M190 75 L165 25'/><path d='M190 75 L240 75'/>" +
                      "</g>" +
                      "<text x='45' y='88' font-size='10' text-anchor='middle'>o'tkir &lt;90°</text>" +
                      "<text x='130' y='88' font-size='10' text-anchor='middle'>to'g'ri =90°</text>" +
                      "<text x='215' y='88' font-size='10' text-anchor='middle'>o'tmas &gt;90°</text>" +
                      "<rect x='110' y='63' width='12' height='12' fill='none' stroke='#16a394'/>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir</em> — 0° dan 90° gacha; <em>to'g'ri</em> — 90°; <em>o'tmas</em> — 90° dan 180° gacha; <em>yoyiq</em> — 180°.</div>"
                ),
                secText("Qo'shni va vertikal burchaklar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir tomoni umumiy, qolgan tomonlari qo'shni nurlar bo'lgan burchaklar <strong>qo'shni</strong> deyiladi — ularning yig'indisi 180°. Tomonlari o'zaro qo'shni nurlardan iborat burchaklar <strong>vertikal</strong> deyiladi — ular teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> qo'shni burchaklardan biri 115° bo'lsa, ikkinchisi 180° − 115° = 65°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ikki to'g'ri chiziq kesishganda hosil bo'lgan to'rt burchakdan biri 40°. Qolgan uchtasini toping. Vertikal burchaklarning tengligini tushuntiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallel-chiziqlar-kesuvchi", title: "6.3 Parallel to'g'ri chiziqlar va kesuvchi", page: "127/145-bet",
              sections: [
                secText("Parallel to'g'ri chiziqlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir tekislikda yotgan va kesishmaydigan ikki to'g'ri chiziq <strong>parallel</strong> deyiladi. Belgilanishi: a ∥ b.</div>"
                ),
                secText("Kesuvchi va hosil bo'lgan burchaklar",
                  "<div class='lecture-figure'>" +
                    "<svg width='240' height='120' viewBox='0 0 240 120'>" +
                      "<line x1='20' y1='40' x2='220' y2='40' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='20' y1='85' x2='220' y2='85' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='70' y1='15' x2='170' y2='110' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='96' y='34' font-size='10' fill='#16a394'>1</text>" +
                      "<text x='118' y='34' font-size='10' fill='#16a394'>2</text>" +
                      "<text x='128' y='58' font-size='10' fill='#16a394'>4</text>" +
                      "<text x='140' y='80' font-size='10' fill='#16a394'>5</text>" +
                      "<text x='162' y='80' font-size='10' fill='#16a394'>6</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ikki to'g'ri chiziqni kesib o'tuvchi uchinchi to'g'ri chiziq <strong>kesuvchi</strong>. U 8 ta burchak hosil qiladi: <em>mos</em>, <em>ichki almashinuvchi</em>, <em>ichki bir tomonli</em> burchaklar.</div>"
                ),
                secText("Parallellik alomatlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar kesuvchi bilan hosil bo'lgan <em>ichki almashinuvchi</em> burchaklar teng bo'lsa, YOKI <em>mos</em> burchaklar teng bo'lsa, YOKI <em>ichki bir tomonli</em> burchaklar yig'indisi 180° bo'lsa — to'g'ri chiziqlar parallel.</div>"
                ),
                secText("Parallel chiziqlarning xossasi",
                  "<div class='lecture-rule'><strong>Qoida (teskarisi):</strong> to'g'ri chiziqlar parallel bo'lsa, kesuvchi bilan hosil qilgan mos burchaklari teng, ichki almashinuvchilari teng, ichki bir tomonlilari yig'indisi 180°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a ∥ b, kesuvchi bilan hosil bo'lgan mos burchaklardan biri 70° bo'lsa, ikkinchisi ham 70°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a ∥ b. Kesuvchi bilan hosil bo'lgan ichki bir tomonli burchaklardan biri ikkinchisidan 40° katta. Har ikkala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchaklar-7sinf", title: "7.1 Uchburchaklar", page: "153/167-bet",
              sections: [
                secText("Uchburchak va uning elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir to'g'ri chiziqda yotmaydigan uch nuqta va ularni tutashtiruvchi uch kesmadan tuzilgan shakl <strong>uchburchak</strong> deyiladi. Elementlari: 3 ta uch, 3 ta tomon, 3 ta burchak.</div>"
                ),
                secText("Tomonlariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>turli tomonli</em> — barcha tomonlari har xil; <em>teng yonli</em> — ikki tomoni teng; <em>teng tomonli</em> — uchala tomoni teng.</div>"
                ),
                secText("Burchaklariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir burchakli</em> — hamma burchagi o'tkir; <em>to'g'ri burchakli</em> — bitta burchagi 90°; <em>o'tmas burchakli</em> — bitta burchagi o'tmas.</div>"
                ),
                secText("Ichki burchaklar yig'indisi",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='110' viewBox='0 0 200 110'>" +
                      "<polygon points='30,90 170,90 110,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='34' y='85' font-size='11' fill='#16a394'>∠A</text>" +
                      "<text x='150' y='85' font-size='11' fill='#16a394'>∠B</text>" +
                      "<text x='104' y='38' font-size='11' fill='#16a394'>∠C</text>" +
                      "<text x='100' y='106' font-size='10' text-anchor='middle' fill='#4f5bd5'>∠A + ∠B + ∠C = 180°</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning ichki burchaklari yig'indisi <strong>180°</strong> ga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ikki burchagi 50° va 70° bo'lsa, uchinchisi 180° − 50° − 70° = 60°.</div>"
                ),
                secText("Tashqi burchak",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning tashqi burchagi u bilan qo'shni bo'lmagan ikki ichki burchak yig'indisiga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ichki burchaklar 40° va 65° bo'lsa, ularga qo'shni bo'lmagan uchdan chiqqan tashqi burchak 40° + 65° = 105°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchak burchaklari 2 : 3 : 4 nisbatda. Har bir burchakni toping. Bu uchburchak qanday turga kiradi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tortburchaklar-7sinf", title: "7.2 To'rtburchaklar", page: "153/167-bet",
              sections: [
                secText("To'rtburchak va uning elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> hech uchtasi bir to'g'ri chiziqda yotmaydigan to'rt nuqta va ularni ketma-ket tutashtiruvchi to'rt kesmadan tuzilgan shakl <strong>to'rtburchak</strong>. Qarama-qarshi uchlarni tutashtiruvchi kesma — <strong>diagonal</strong>.</div>"
                ),
                secText("To'rtburchak turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='80' viewBox='0 0 300 80'>" +
                      "<polygon points='10,60 60,60 75,20 25,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='42' y='75' font-size='9' text-anchor='middle'>parallelogramm</text>" +
                      "<rect x='100' y='20' width='55' height='40' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='127' y='75' font-size='9' text-anchor='middle'>to'g'ri to'rtb.</text>" +
                      "<rect x='195' y='22' width='38' height='38' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='214' y='75' font-size='9' text-anchor='middle'>kvadrat</text>" +
                      "<polygon points='255,60 295,60 285,20 245,20' fill='none' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='272' y='75' font-size='9' text-anchor='middle'>trapetsiya</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>parallelogramm</em> — qarama-qarshi tomonlari parallel; <em>romb</em> — barcha tomonlari teng parallelogramm; <em>to'g'ri to'rtburchak</em> — barcha burchagi 90°; <em>kvadrat</em> — barcha tomoni teng va burchagi 90°; <em>trapetsiya</em> — faqat bir juft tomoni parallel.</div>"
                ),
                secText("Ichki burchaklar yig'indisi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> ixtiyoriy to'rtburchakning ichki burchaklari yig'indisi <strong>360°</strong>. (Diagonal uni ikki uchburchakka bo'ladi: 2·180°.)</div>"
                ),
                secText("Parallelogramm xossalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> parallelogrammda qarama-qarshi tomonlar teng, qarama-qarshi burchaklar teng, diagonallar kesishish nuqtasida teng ikkiga bo'linadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> parallelogrammning bir burchagi 110° bo'lsa, unga qo'shni burchagi 70°, qarama-qarshisi yana 110°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'rtburchak burchaklari 3 : 4 : 5 : 6 nisbatda. Har bir burchakni toping. Bu to'rtburchak trapetsiya bo'la oladimi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kopburchaklar", title: "7.3 Ko'pburchaklar", page: "153/167-bet",
              sections: [
                secText("Ko'pburchak ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ketma-ket tutashtirilgan kesmalardan tuzilgan yopiq siniq chiziq bilan chegaralangan shakl <strong>ko'pburchak</strong> deyiladi. n ta tomoni bo'lsa — <strong>n-burchak</strong>.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='90' viewBox='0 0 200 90'>" +
                      "<polygon points='45,15 80,40 66,80 24,80 10,40' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='45' y='88' font-size='9' text-anchor='middle'>5-burchak</text>" +
                      "<polygon points='140,15 170,32 170,65 140,82 110,65 110,32' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='140' y='88' font-size='9' text-anchor='middle'>6-burchak</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Qavariq ko'pburchak",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> har qanday tomoni davomida o'tkazilgan to'g'ri chiziq shaklni kesib o'tmasa, ko'pburchak <strong>qavariq</strong> deyiladi.</div>"
                ),
                secText("Ichki burchaklar yig'indisi",
                  "<div class='lecture-rule'><strong>Formula:</strong> qavariq n-burchakning ichki burchaklari yig'indisi S = (n − 2) · 180°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> beshburchak: (5 − 2)·180° = 540°; &nbsp; oltiburchak: (6 − 2)·180° = 720°.</div>"
                ),
                secText("Muntazam ko'pburchak va diagonallar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> barcha tomoni va burchagi teng ko'pburchak <strong>muntazam</strong> deyiladi. Muntazam n-burchakning har bir burchagi (n − 2)·180° / n. Diagonallar soni n(n − 3) / 2.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> muntazam oltiburchakning har bir burchagi 720° / 6 = 120°; diagonallari 6·3/2 = 9 ta.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Qavariq ko'pburchakning ichki burchaklari yig'indisi 1440°. Bu necha burchakli? Uning har bir burchagi teng bo'lsa, bittasi necha gradus?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tortburchak-yasash", title: "7.4 Uchburchak va to'rtburchaklarni yasash", page: "153/167-bet",
              sections: [
                secText("Yasash asboblari",
                  "<p>Geometrik yasashlar faqat <strong>sirkul</strong> va <strong>chizg'ich</strong> (bo'linmalarsiz) yordamida bajariladi. Sirkul bilan aylana va teng kesmalar, chizg'ich bilan to'g'ri chiziq o'tkaziladi.</p>"
                ),
                secText("Uchburchakni uch tomoni bo'yicha yasash",
                  "<div class='lecture-rule'><strong>Tartib:</strong> 1) bir tomonni (masalan AB) chizg'ich bilan o'tkazamiz; 2) A dan radiusi ikkinchi tomonga teng aylana yoyi; 3) B dan radiusi uchinchi tomonga teng aylana yoyi; 4) yoylar kesishgan nuqta C — uchburchak tayyor.</div>" +
                  "<div class='lecture-rule'><strong>Shart:</strong> yasash mumkin bo'lishi uchun har bir tomon qolgan ikki tomon yig'indisidan kichik bo'lishi kerak (uchburchak tengsizligi).</div>"
                ),
                secText("Ikki tomon va orasidagi burchak bo'yicha",
                  "<div class='lecture-rule'><strong>Tartib:</strong> berilgan burchakni yasaymiz; uning tomonlariga sirkul bilan berilgan uzunliklarni qo'yamiz; hosil bo'lgan ikki nuqtani tutashtiramiz.</div>"
                ),
                secText("Kvadrat yasash",
                  "<div class='lecture-rule'><strong>Tartib:</strong> AB tomonni o'tkazamiz; A va B nuqtalarda AB ga perpendikulyarlar tiklaymiz; ularga sirkul bilan AB ga teng kesmalar qo'yib, D va C nuqtalarni topamiz; ABCD — kvadrat.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tomonlari 3 sm, 4 sm, 8 sm bo'lgan uchburchak yasash mumkinmi? Javobingizni uchburchak tengsizligi bilan asoslang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
          ]
        },
        {
          id: "algebra",
          name: "Algebra (2022-yil)",
          topics: [
            { id: "sonli-ifodalar", title: "1. Sonli va algebraik ifodalar", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ifoda qurilmasi: sonlar, harflar va amal kartochkalari. O'quvchi ifoda yig'adi; faqat sonlardan iborat bo'lsa «sonli ifoda» deb qiymati darhol hisoblanadi, harf qo'shilsa «algebraik ifoda» bo'ladi va harfga son berish slayderi paydo bo'ladi. Ma'nosiz ifodalar (masalan 5 : 0) alohida ogohlantiriladi." },
            { id: "algebraik-tengliklar-formulalar", title: "2. Algebraik tengliklar, formulalar", page: "17-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Formula kartochkalari (S = a·b, P = 2(a + b), s = v·t). Shakl yoki harakat tasviri ostida formuladagi harflar slayder bilan o'zgaradi va natija yangilanadi. Teskari rejim: formuladan boshqa harfni ifodalash — kartochkalar tenglikning u tomoniga o'tkaziladi." },
            { id: "qavs-qoidasi-koeffitsiyent", title: "3. Qavslarni ochish qoidasi va koeffitsiyent", page: "20-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "To'g'ri to'rtburchak yuzi modeli: a(b + c) bitta to'rtburchak ikki qismga bo'linadi → ab + ac. Qavs oldida minus bo'lsa, qavs ichidagi har bir had rangi (ishorasi) almashadi — animatsiya bilan. Koeffitsiyent esa harf oldidagi son sifatida ajratib yoritiladi." },
            { id: "arifmetik-amallar-xossalari", title: "4. Arifmetik amallarning xossalari", page: "23-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Kubiklardan qatorlar: o'rin almashtirish (3 + 5 = 5 + 3), guruhlash ((2 + 3) + 4 = 2 + (3 + 4)) va taqsimot (3 · (2 + 4) = 3·2 + 3·4) xossalari kubiklarni surish orqali ko'rsatiladi. Har xossada sonlar o'rniga harflar qo'yilib, umumiy ko'rinishi yoziladi." },
            { id: "natural-korsatkichli-daraja", title: "5. Natural ko'rsatkichli daraja", page: "26-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Asos va ko'rsatkich slayderlari. 2⁵ = 2·2·2·2·2 ko'paytuvchilar qatori sifatida, o'sishi ustunlar bilan ko'rsatiladi. Kvadrat (a²) va kub (a³) uchun shakl ham chiziladi. Manfiy asosda ishora juft/toq ko'rsatkichga qarab qanday almashishi ko'rinadi." },
            { id: "daraja-xossalari", title: "6. Natural ko'rsatkichli darajaning xossalari", page: "30-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ko'paytuvchilar qatori: aᵐ · aⁿ da ikki qator bir qatorga qo'shiladi (m + n), aᵐ : aⁿ da bir xil ko'paytuvchilar juft-juft qisqaradi (m − n), (aᵐ)ⁿ da qator n marta takrorlanadi (m·n). (ab)ⁿ va (a/b)ⁿ uchun ko'paytuvchilar rangi bo'yicha qayta guruhlanadi." },
            { id: "birhad-standart-shakli", title: "7. Birhad va uning standart shakli", page: "34-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Aralash birhad (masalan 3a · 2b · a). O'quvchi sonli ko'paytuvchilarni oldinga, bir xil harflarni yonma-yon suradi; ular daraja ko'rinishiga yig'iladi → 6a²b. Koeffitsiyent va birhad darajasi alohida ko'rsatiladi." },
            { id: "birhadlarni-kopaytirish-bolish", title: "8. Birhadlarni ko'paytirish va bo'lish", page: "36-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki birhad kartochkasi. Ko'paytirishda koeffitsiyentlar alohida, bir xil harflar alohida guruhlanadi (darajalar qo'shiladi). Bo'lishda kasr ko'rinishida yozilib, bir xil ko'paytuvchilar juft-juft qisqaradi." },
            { id: "kophadlar-tushunchasi", title: "9. Ko'phadlar. O'xshash hadlarni ixchamlash", page: "38-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Algebra plitkalari: x², x va 1 plitkalari, manfiylari qizil. Ko'phad plitkalar to'plami sifatida chiqadi; o'quvchi o'xshash plitkalarni bir guruhga yig'adi, qarama-qarshilari juftlashib yo'qoladi → ko'phadning standart shakli." },
            { id: "kophadlarni-qoshish-ayirish", title: "10. Ko'phadlarni qo'shish va ayirish", page: "44-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki ko'phad plitkalar ko'rinishida. Qo'shishda hammasi bitta maydonga tushadi va o'xshashlar yig'iladi. Ayirishda ikkinchi ko'phad plitkalari avval «ag'dariladi» (ishorasi almashadi), keyin qo'shiladi — odatiy xato shu yerda ko'rinadi." },
            { id: "kophadlarni-kopaytirish", title: "11. Ko'phadlarni ko'paytirish", page: "46-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "To'g'ri to'rtburchak (yuz) modeli: tomonlari (a + b) va (c + d), har bir ichki katak bitta ko'paytma (ac, ad, bc, bd). Katakchalar to'ldirilgach, o'xshash hadlar yig'iladi. Tomon uzunliklari slayder bilan o'zgaradi." },
            { id: "kophadlarni-bolish", title: "12. Ko'phadlarni bo'lish", page: "50-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ko'phadni birhadga bo'lish: har bir had bo'luvchiga alohida bo'linadi — hadlar navbatma-navbat kasr ko'rinishiga o'tib qisqaradi. Yuz modelida: yuzi va bir tomoni ma'lum to'rtburchakning ikkinchi tomonini topish." },
            { id: "kophadni-kopaytuvchilarga-ajratish", title: "13. Ko'phadni ko'paytuvchilarga ajratish", page: "52-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Umumiy ko'paytuvchini qavsdan chiqarish: har bir hadda umumiy qism bir xil rang bilan yoritiladi va qavs oldiga «chiqib» ketadi. Guruhlash usuli: hadlar juftlarga bo'linib, har bir juftdan umumiy ko'paytuvchi chiqariladi. Natija qavslarni qayta ochib tekshiriladi." },
            { id: "yigindi-ayirma-kvadrati", title: "14. Yig'indining kvadrati va ayirmaning kvadrati", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Tomoni (a + b) bo'lgan kvadrat to'rt qismga bo'linadi: a², b² va ikkita ab. a va b slayderlar bilan o'zgaradi. Ayirma rejimida (a − b)² kvadrati katta kvadratdan ab bo'laklari kesib olinishi orqali ko'rsatiladi." },
            { id: "kvadratlar-ayirmasi", title: "15. Kvadratlar ayirmasi", page: "60-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "a² kvadratdan b² kvadrat kesib olinadi; qolgan L-shakl qirqilib, bo'laklar qayta terilganda tomonlari (a + b) va (a − b) bo'lgan to'rtburchak hosil bo'ladi. Shundan a² − b² = (a + b)(a − b)." },
            { id: "yigindi-ayirma-kubi", title: "16. Yig'indining kubi va ayirmaning kubi", page: "63-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Qirrasi (a + b) bo'lgan 3D kub 8 ta bo'lakka ajratiladi: a³, b³, uchta a²b va uchta ab² — bo'laklar rang bilan ajralib, alohida ochiladi. Kub aylantiriladi, bo'laklar sanalib (a + b)³ formulasi yig'iladi." },
            { id: "kublar-yigindisi-ayirmasi", title: "17. Kublar yig'indisi va ayirmasi", page: "66-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Formula kartochkalari: a³ + b³ = (a + b)(a² − ab + b²). O'quvchi o'ng tomonni yuz modeli bilan ko'paytirib chiqadi — o'xshash hadlar qisqarib, faqat a³ va b³ qolishi ko'rsatiladi. Sonli tekshiruv: a va b ga son qo'yiladi." },
            { id: "kopaytuvchilarga-ajratish-usullari", title: "18. Ko'paytuvchilarga ajratish usullari", page: "69-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/7-algebra-kopaytuvchilarga-ajratish.html", test: null, simPlan: "Ko'phad berilgan; o'quvchi usulni tanlaydi: qavsdan chiqarish, guruhlash yoki qisqa ko'paytirish formulasi. To'g'ri usul tanlansa, bosqichlar ochiladi va formula namunasi ko'phad ustiga «moslashtiriladi». Usullar ketma-ket qo'llanadigan ko'phadlar ham bor." },
            { id: "algebraik-kasr-qisqartirish", title: "19. Algebraik kasr. Kasrlarni qisqartirish", page: "75-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Surat va maxraj ko'paytuvchilarga ajratiladi, bir xil ko'paytuvchilar bir xil rangda yoritilib juft-juft qisqaradi. Kasr ma'nosiz bo'ladigan qiymatlar (maxraj 0) alohida belgilanadi. Odatiy xato — qo'shiluvchini qisqartirish — misol bilan ko'rsatiladi." },
            { id: "kasrlarni-umumiy-maxrajga-keltirish", title: "20. Algebraik kasrlarni umumiy maxrajga keltirish", page: "80-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Maxrajlar ko'paytuvchilarga ajratilib bloklar ko'rinishida chiqadi. Umumiy maxraj — har bir ko'paytuvchini eng ko'p sonda olgan blok to'plami. Har kasrga yetishmayotgan bloklar (qo'shimcha ko'paytuvchi) rangli qilib ko'rsatiladi." },
            { id: "kasrlarni-qoshish-ayirish", title: "21. Algebraik kasrlarni qo'shish va ayirish", page: "83-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Avval umumiy maxrajga keltirish (bloklar), so'ng suratlar qo'shiladi yoki ayiriladi. Ayirishda surat oldidagi minus butun suratga tegishli ekanligi qavs bilan yoritiladi. Natija oxirida qisqartiriladi." },
            { id: "kasrlarni-kopaytirish-bolish", title: "22. Algebraik kasrlarni ko'paytirish va bo'lish", page: "87-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ko'paytirishda surat va maxrajlar ko'paytuvchilarga ajratilib, kesishgan bir xil ko'paytuvchilar qisqaradi. Bo'lishda ikkinchi kasr animatsiya bilan «ag'dariladi» va ko'paytirishga aylanadi." },
            { id: "tenglama-va-ildizi", title: "23. Tenglama va uning ildizi", page: "95-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Tenglama va x slayderi: har bir qiymat qo'yilganda chap va o'ng tomon qiymatlari hisoblanadi, teng bo'lsa — ildiz. Ildizi yo'q (masalan 0·x = 5) va cheksiz ko'p (0·x = 0) tenglamalar ham ko'rsatiladi." },
            { id: "bir-nomalumli-chiziqli-tenglamalar", title: "24. Bir noma'lumli chiziqli tenglamalar", page: "97-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/7-algebra-sodda-chiziqli-tenglamalar.html", test: null, simPlan: "ax = b ko'rinishiga keltirish: tenglamaning ikkala tomonida bir xil amal bajariladi (tarozi muvozanati), har qadam yoziladi. a ≠ 0, a = 0 holatlari alohida ko'rinadi." },
            { id: "al-xorazmiy-usuli", title: "25. Tenglamalar yechishning al-Xorazmiy usuli", page: "101-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki amal: «al-jabr» — manfiy hadni tenglamaning boshqa tomoniga o'tkazib musbat qilish, «al-muqobala» — ikki tomondagi bir xil hadlarni qisqartirish. Hadlar kartochkalari sudralganda ishorasi almashishi animatsiya bilan ko'rsatiladi. Qisqa tarixiy ma'lumot bilan." },
            { id: "dekart-koordinatalar-sistemasi", title: "26. Dekart koordinatalar sistemasi", page: "112-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/6-matematika-koordinata-tekislik.html", test: null, simPlan: "To'rt choraklik koordinata tekisligi. Nuqta sudralganda (x; y) koordinatalari va chorak raqami yangilanadi. Topshiriqlar: berilgan nuqtani qo'yish, nuqtalarni ketma-ket ulab shakl chizish, o'qlarga nisbatan simmetrik nuqtani topish." },
            { id: "funksiya-tushunchasi-7sinf", title: "27. Funksiya tushunchasi", page: "115-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "«Funksiya mashinasi»: kirishga x tashlanadi, qoidaga ko'ra chiqishda y chiqadi. Natijalar jadvalga va koordinata tekisligiga nuqta bo'lib tushadi. Funksiya bo'lmagan moslik (bitta x ga ikki y) qizil bilan ko'rsatiladi." },
            { id: "chiziqli-funksiya", title: "28. Chiziqli funksiya", page: "120-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "y = kx + b grafigi: k va b slayderlari. k o'zgarganda to'g'ri chiziq og'adi (k > 0 o'sadi, k < 0 kamayadi), b o'zgarganda chiziq yuqoriga-pastga suriladi. Ikkita chiziq parallel bo'ladigan holat (k bir xil) alohida ko'rsatiladi." },
            { id: "tenglamalar-sistemasi", title: "29. Chiziqli tenglamalar sistemasi", page: "131-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki tenglamaning grafigi bitta tekislikda. Koeffitsiyentlar slayderlar bilan o'zgaradi; kesishish nuqtasi — sistemaning yechimi. Chiziqlar parallel (yechim yo'q) va ustma-ust tushgan (cheksiz ko'p yechim) holatlar ham ko'rsatiladi." },
            { id: "sistema-yechish-usullari", title: "30. Sistemani o'rniga qo'yish usulida yechish", page: "135-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Birinchi tenglamadan bitta noma'lum ifodalanadi (y = ...), so'ng bu ifoda kartochkasi ikkinchi tenglamadagi y ning ustiga «tushadi». Bir noma'lumli tenglama yechilib, javob birinchi tenglamaga qaytariladi. Yonidagi grafikda kesishish nuqtasi bilan tekshiriladi." },
            { id: "sistema-qoshish-usuli", title: "31. Sistemani qo'shish usulida yechish", page: "135-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Ikki tenglama ustma-ust yoziladi. Ko'paytiruvchi slayderi bilan bitta noma'lumning koeffitsiyentlari qarama-qarshi qilinadi, so'ng tenglamalar qo'shilganda o'sha noma'lum yo'qoladi. Qadam-baqadam yechim va grafikda tekshiruv." },
            { id: "kombinatorika-qoidalari", title: "32. Kombinatorikaning asosiy qoidalari", page: "146-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Kiyim tanlash: ko'ylaklar va shimlar. «Yoki» — qo'shish qoidasi (ko'ylak yoki kurtka), «va» — ko'paytirish qoidasi (ko'ylak va shim). Har bir variant juftlikda chiziladi, umumiy son daraxt yoki jadval bilan sanaladi." },
            { id: "kombinatorik-masalalar-turlari", title: "33. Kombinatorik masalalar turlari", page: "150-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Uchta rejim, rangli sharlar bilan: o'rin almashtirish (hammasini qatorga terish, n!), o'rinlashtirish (n tadan k tasini tartib bilan tanlash), guruhlash (tartibsiz tanlash). Har rejimda barcha variantlar ro'yxati ko'rsatiladi va takrorlanuvchilari belgilanadi." },
            { id: "kombinatorik-masalalar-usullari", title: "34. Kombinatorik masalalarni yechish usullari", page: "156-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null, simPlan: "Bitta masala uch usulda: barcha variantlarni ro'yxatlash, variantlar daraxti (shoxlar bosqichma-bosqich o'sadi) va jadval. Usullar yonma-yon ko'rsatiladi, natijalar bir xil ekani tekshiriladi." }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya (2022-yil)",
          topics: [
            {
              id: "eng-sodda-geometrik-shakllar", title: "Eng sodda geometrik shakllar", page: "8-bet",
              sections: [
                secText("Asosiy tushunchalar",
                  "<p><strong>Nuqta</strong> va <strong>to'g'ri chiziq</strong> — planimetriyaning ta'riflanmaydigan asosiy tushunchalari. Nuqta bosh harf bilan (A, B), to'g'ri chiziq kichik harf (a) yoki uning ikki nuqtasi bilan (AB) belgilanadi.</p>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='60' viewBox='0 0 260 60'>" +
                      "<line x1='10' y1='30' x2='250' y2='30' stroke='#1f2433' stroke-width='2'/>" +
                      "<polygon points='250,30 242,26 242,34' fill='#1f2433'/><polygon points='10,30 18,26 18,34' fill='#1f2433'/>" +
                      "<circle cx='70' cy='30' r='3' fill='#4f5bd5'/><text x='70' y='20' font-size='11' text-anchor='middle'>A</text>" +
                      "<circle cx='170' cy='30' r='3' fill='#4f5bd5'/><text x='170' y='20' font-size='11' text-anchor='middle'>B</text>" +
                      "<text x='230' y='24' font-size='11' fill='#6b7280'>a</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("To'g'ri chiziqning asosiy xossasi",
                  "<div class='lecture-rule'><strong>Aksioma:</strong> ixtiyoriy ikkita nuqta orqali bitta va faqat bitta to'g'ri chiziq o'tkazish mumkin.</div>" +
                  "<div class='lecture-rule'><strong>Aksioma:</strong> ikki to'g'ri chiziq yo bitta umumiy nuqtaga ega (kesishadi), yoki umuman umumiy nuqtaga ega emas.</div>"
                ),
                secText("Nur va kesma",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> to'g'ri chiziqning biror nuqtasi uni ikki <strong>nur</strong>ga ajratadi. To'g'ri chiziqning ikki nuqtasi va ular orasidagi qismi <strong>kesma</strong> deyiladi; bu nuqtalar kesmaning uchlaridir.</div>"
                ),
                secText("Nuqtalarning o'zaro joylashuvi",
                  "<div class='lecture-example'><strong>Misol:</strong> A, B, C nuqtalar bitta to'g'ri chiziqda yotsa va B ular orasida bo'lsa: AB + BC = AC.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tekislikda 5 ta nuqta berilgan, hech uchtasi bir to'g'ri chiziqda yotmaydi. Ular orqali jami nechta to'g'ri chiziq o'tkaziladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kesma-taqqoslash-olchash", title: "Kesma. Kesmalarni taqqoslash va o'lchash", page: "17-bet",
              sections: [
                secText("Kesmani o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kesma uzunligi tanlangan birlik kesma (mm, sm, m) necha marta joylashishini bildiradi. Har bir kesmaning aniq bir uzunligi (musbat son) bo'ladi.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='240' height='50' viewBox='0 0 240 50'>" +
                      "<line x1='20' y1='30' x2='200' y2='30' stroke='#4f5bd5' stroke-width='3'/>" +
                      "<line x1='20' y1='22' x2='20' y2='38' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='200' y1='22' x2='200' y2='38' stroke='#1f2433' stroke-width='2'/>" +
                      "<text x='20' y='16' font-size='11' text-anchor='middle'>A</text>" +
                      "<text x='200' y='16' font-size='11' text-anchor='middle'>B</text>" +
                      "<text x='110' y='47' font-size='10' text-anchor='middle' fill='#6b7280'>AB = 6 sm</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Kesmalarni taqqoslash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ikki kesmani taqqoslash uchun ularni ustma-ust qo'yamiz: bir uchlari va yo'nalishlari mos tushsa, ikkinchi uchlari ham mos tushsa — kesmalar teng. Aks holda ikkinchi uchi ichkarida qolgani kichik.</div>"
                ),
                secText("Kesmaning o'rtasi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesmani ikkita teng kesmaga bo'luvchi nuqta uning <strong>o'rtasi</strong> deyiladi. M — AB ning o'rtasi bo'lsa: AM = MB = AB / 2.</div>"
                ),
                secText("O'lchov birliklari",
                  "<div class='lecture-example'><strong>Misol:</strong> 1 m = 100 sm = 1000 mm. &nbsp; AB = 3 sm 5 mm = 35 mm.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>AC = 12 sm. B nuqta AC kesmada shunday yotadiki, AB dan BC 4 sm katta. AB va BC ni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchak-taqqoslash-olchash", title: "Burchak. Burchaklarni taqqoslash va o'lchash", page: "29-bet",
              sections: [
                secText("Burchak ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> umumiy boshlang'ich nuqtadan (uchdan) chiquvchi ikki nurdan iborat shakl <strong>burchak</strong> deyiladi. Nurlar — tomonlari. Belgilanishi: ∠AOB, ∠O yoki ∠1.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='170' height='110' viewBox='0 0 170 110'>" +
                      "<line x1='25' y1='90' x2='150' y2='90' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='25' y1='90' x2='130' y2='20' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<path d='M65 90 A40 40 0 0 0 52 62' fill='none' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='18' y='95' font-size='11'>O</text>" +
                      "<text x='150' y='103' font-size='11'>A</text>" +
                      "<text x='132' y='16' font-size='11'>B</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Burchakni o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> burchak <strong>transportir</strong> bilan gradusda (°) o'lchanadi. 1° — yoyiq burchakning 1/180 qismi. Har bir burchakning aniq gradus o'lchovi bor.</div>"
                ),
                secText("Burchaklarni taqqoslash va bissektrisa",
                  "<div class='lecture-rule'><strong>Qoida:</strong> gradus o'lchovi katta bo'lgan burchak katta. <strong>Bissektrisa</strong> — burchak uchidan chiqib, uni ikkita teng burchakka bo'luvchi nur.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ∠AOB = 80°, OC — bissektrisa bo'lsa: ∠AOC = ∠COB = 40°.</div>"
                ),
                secText("Burchaklarni qo'shish",
                  "<div class='lecture-example'><strong>Misol:</strong> OC nur ∠AOB ichida bo'lsa: ∠AOB = ∠AOC + ∠COB.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>∠AOB = 120°. Uning ichidan OC nur o'tkazilganda ∠AOC ∠COB dan 30° katta bo'ldi. Ikkala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchak-turlari", title: "Burchakning turlari", page: "45-bet",
              sections: [
                secText("Kattaligiga ko'ra turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='90' viewBox='0 0 300 90'>" +
                      "<g stroke='#4f5bd5' stroke-width='2' fill='none'>" +
                        "<path d='M25 75 L25 25'/><path d='M25 75 L65 58'/>" +
                        "<path d='M105 75 L105 25'/><path d='M105 75 L145 75'/>" +
                        "<path d='M185 75 L160 28'/><path d='M185 75 L235 75'/>" +
                        "<path d='M255 55 L295 55'/>" +
                      "</g>" +
                      "<rect x='105' y='63' width='11' height='11' fill='none' stroke='#16a394'/>" +
                      "<text x='40' y='88' font-size='9' text-anchor='middle'>o'tkir</text>" +
                      "<text x='120' y='88' font-size='9' text-anchor='middle'>to'g'ri</text>" +
                      "<text x='205' y='88' font-size='9' text-anchor='middle'>o'tmas</text>" +
                      "<text x='275' y='48' font-size='9' text-anchor='middle'>yoyiq</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir</em> burchak — 0° dan 90° gacha; <em>to'g'ri</em> — aniq 90°; <em>o'tmas</em> — 90° dan 180° gacha; <em>yoyiq</em> — aniq 180°.</div>"
                ),
                secText("Qo'shni burchaklar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bitta tomoni umumiy, qolgan ikki tomoni bir-birining davomi (qo'shni nurlar) bo'lgan burchaklar <strong>qo'shni</strong> deyiladi.</div>" +
                  "<div class='lecture-rule'><strong>Xossa:</strong> qo'shni burchaklar yig'indisi 180°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> biri 65° bo'lsa, qo'shnisi 180° − 65° = 115°.</div>"
                ),
                secText("Vertikal burchaklar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir burchakning tomonlari ikkinchisining tomonlari davomi bo'lgan burchaklar <strong>vertikal</strong> deyiladi.</div>" +
                  "<div class='lecture-rule'><strong>Xossa:</strong> vertikal burchaklar o'zaro teng.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ikki to'g'ri chiziq kesishganda hosil bo'lgan to'rt burchakdan ikkitasining yig'indisi 220°. Bu burchaklar qo'shnimi yoki vertikalmi? Barcha to'rt burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "perpendikulyar-togri-chiziqlar", title: "Perpendikulyar to'g'ri chiziqlar", page: "53-bet",
              sections: [
                secText("Ta'rif",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesishganda to'g'ri (90°) burchak hosil qiladigan ikki to'g'ri chiziq <strong>perpendikulyar</strong> deyiladi. Belgilanishi: a ⊥ b.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='140' height='110' viewBox='0 0 140 110'>" +
                      "<line x1='15' y1='70' x2='125' y2='70' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='70' y1='15' x2='70' y2='100' stroke='#1f2433' stroke-width='2'/>" +
                      "<rect x='70' y='55' width='14' height='14' fill='none' stroke='#16a394' stroke-width='1.5'/>" +
                      "<text x='120' y='84' font-size='11'>a</text><text x='58' y='22' font-size='11'>b</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Perpendikulyarning yagonaligi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> berilgan to'g'ri chiziqqa uning tashqarisidagi (yoki ustidagi) berilgan nuqtadan faqat bitta perpendikulyar to'g'ri chiziq o'tkazish mumkin.</div>"
                ),
                secText("Perpendikulyar va og'ma. Masofa",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> nuqtadan to'g'ri chiziqqa tushirilgan perpendikulyar kesmaning uzunligi shu nuqtadan to'g'ri chiziqgacha bo'lgan <strong>masofa</strong> deyiladi. Perpendikulyar har qanday og'madan qisqa.</div>"
                ),
                secText("O'rta perpendikulyar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesmaning o'rtasidan unga perpendikulyar o'tkazilgan to'g'ri chiziq <strong>o'rta perpendikulyar</strong> deyiladi. Uning har bir nuqtasi kesma uchlaridan teng uzoqlikda.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a ⊥ c va b ⊥ c bo'lsa, a va b to'g'ri chiziqlar o'zaro qanday joylashgan? Chizma bilan tushuntiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchaklar-turlari-elementlari", title: "Uchburchaklar, ularning turlari va elementlari", page: "72-bet",
              sections: [
                secText("Uchburchak va uning elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir to'g'ri chiziqda yotmaydigan uch nuqta (uchlar) va ularni juft-juft tutashtiruvchi uch kesmadan (tomonlar) tuzilgan shakl <strong>uchburchak</strong> deyiladi.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='120' viewBox='0 0 180 120'>" +
                      "<polygon points='20,100 160,100 60,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='12' y='110' font-size='11'>A</text>" +
                      "<text x='163' y='110' font-size='11'>B</text>" +
                      "<text x='52' y='16' font-size='11'>C</text>" +
                      "<text x='90' y='114' font-size='9' fill='#6b7280'>c</text>" +
                      "<text x='118' y='55' font-size='9' fill='#6b7280'>a</text>" +
                      "<text x='30' y='55' font-size='9' fill='#6b7280'>b</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Elementlari: 3 ta uch, 3 ta tomon, 3 ta ichki burchak. Perimetri P = a + b + c.</p>"
                ),
                secText("Tomonlariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>turli tomonli</em> — barcha tomonlari har xil; <em>teng yonli</em> — ikki tomoni (yon tomonlari) teng; <em>teng tomonli</em> — uchala tomoni teng.</div>"
                ),
                secText("Burchaklariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir burchakli</em> — hamma burchagi o'tkir; <em>to'g'ri burchakli</em> — bitta burchagi 90°; <em>o'tmas burchakli</em> — bitta burchagi o'tmas.</div>"
                ),
                secText("Uchburchakning muhim chiziqlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> uchdan qarama-qarshi tomonga tushirilgan perpendikulyar — <strong>balandlik</strong>; uchni qarama-qarshi tomon o'rtasi bilan tutashtiruvchi kesma — <strong>mediana</strong>; burchak bissektrisasining tomongacha bo'lgan qismi — <strong>bissektrisa</strong>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Teng tomonli uchburchak bir vaqtning o'zida teng yonli bo'ladimi? Teng yonli uchburchak har doim teng tomonli bo'ladimi? Javobingizni asoslang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tenglik-1", title: "Uchburchaklar tengligining birinchi alomati", page: "79-bet",
              sections: [
                secText("Teng uchburchaklar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ustma-ust qo'yganda to'la mos tushadigan uchburchaklar <strong>teng</strong> deyiladi. Teng uchburchaklarning mos tomonlari va mos burchaklari o'zaro teng.</div>"
                ),
                secText("Birinchi alomat (tomon — burchak — tomon)",
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='100' viewBox='0 0 260 100'>" +
                      "<polygon points='15,85 105,85 35,25' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='150,85 240,85 170,25' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='25' y='80' font-size='9' fill='#16a394'>∠</text>" +
                      "<text x='160' y='80' font-size='9' fill='#16a394'>∠</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> agar bir uchburchakning ikki tomoni va ular orasidagi burchagi ikkinchi uchburchakning mos ikki tomoni va ular orasidagi burchagiga teng bo'lsa, bunday uchburchaklar teng bo'ladi.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> AB = A₁B₁, AC = A₁C₁ va ∠A = ∠A₁ bo'lsa, △ABC = △A₁B₁C₁; demak BC = B₁C₁, ∠B = ∠B₁, ∠C = ∠C₁.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>AB va CD kesmalar O nuqtada kesishib, O ularning o'rtasi bo'lsin. △AOC = △BOD ekanini birinchi alomat yordamida isbotlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "teng-yonli-uchburchak-xossalari", title: "Teng yonli uchburchakning xossalari", page: "82-bet",
              sections: [
                secText("Ta'rif",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ikki tomoni teng bo'lgan uchburchak <strong>teng yonli</strong> deyiladi. Teng tomonlar — <strong>yon tomonlar</strong>, uchinchisi — <strong>asos</strong>.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='150' height='110' viewBox='0 0 150 110'>" +
                      "<polygon points='75,15 25,95 125,95' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='75' y1='15' x2='75' y2='95' stroke='#16a394' stroke-width='1.5' stroke-dasharray='4 3'/>" +
                      "<rect x='75' y='83' width='11' height='12' fill='none' stroke='#16a394'/>" +
                      "<text x='16' y='104' font-size='10'>B</text><text x='128' y='104' font-size='10'>C</text><text x='72' y='12' font-size='10'>A</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Asosidagi burchaklar xossasi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> teng yonli uchburchakning asosidagi burchaklari o'zaro teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> uchdagi burchak 40° bo'lsa, asosdagi har bir burchak (180° − 40°) : 2 = 70°.</div>"
                ),
                secText("Bissektrisa — mediana — balandlik",
                  "<div class='lecture-rule'><strong>Teorema:</strong> teng yonli uchburchakda uchidan asosga o'tkazilgan bissektrisa bir vaqtda mediana ham, balandlik ham, o'rta perpendikulyar ham bo'ladi.</div>"
                ),
                secText("Teng tomonli uchburchak",
                  "<div class='lecture-rule'><strong>Natija:</strong> teng tomonli uchburchakning barcha burchaklari teng va har biri 60° ga teng.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Teng yonli uchburchakning asosidagi burchagi yon tomondagi (uchidagi) burchakdan 30° katta. Uchala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tenglik-2", title: "Uchburchaklar tengligining ikkinchi alomati", page: "85-bet",
              sections: [
                secText("Ikkinchi alomat (burchak — tomon — burchak)",
                  "<div class='lecture-rule'><strong>Teorema:</strong> agar bir uchburchakning bir tomoni va unga yopishgan ikki burchagi ikkinchi uchburchakning mos tomoni va unga yopishgan ikki burchagiga teng bo'lsa, bunday uchburchaklar teng.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> AC = A₁C₁, ∠A = ∠A₁ va ∠C = ∠C₁ bo'lsa, △ABC = △A₁B₁C₁.</div>"
                ),
                secText("Amaliy tatbiqi",
                  "<div class='lecture-example'><strong>Misol:</strong> daryoning narigi qirg'og'idagi nuqtagacha masofani, qirg'oqda teng burchaklar va bir tomonni o'lchab, teng uchburchak yasash orqali topish mumkin.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>△ABC da AD — bissektrisa (D ∈ BC) va ∠ADB = ∠ADC bo'lsa, △ABD = △ACD ekanini isbotlang. Bundan qanday xulosa chiqadi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tenglik-3", title: "Uchburchaklar tengligining uchinchi alomati", page: "87-bet",
              sections: [
                secText("Uchinchi alomat (uch tomon)",
                  "<div class='lecture-rule'><strong>Teorema:</strong> agar bir uchburchakning uch tomoni ikkinchi uchburchakning mos uch tomoniga teng bo'lsa, bunday uchburchaklar teng.</div>"
                ),
                secText("Uchburchakning qat'iyligi",
                  "<div class='lecture-rule'><strong>Natija:</strong> uch tomoni bilan uchburchak yagona aniqlanadi — shakli o'zgarmaydi. Shu sababli uchburchak qurilishlarda mustahkam («qat'iy») shakl hisoblanadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> panjara, kran strelasi va ko'priklar uchburchakli to'rlardan yasaladi.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> AB = CD, BC = AD bo'lsa, △ABC = △CDA (AC — umumiy tomon); demak ∠B = ∠D.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'rtburchak ABCD da AB = CD va BC = AD. Bu to'rtburchak parallelogramm ekanini uchinchi alomat yordamida asoslang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallel-togri-chiziqlar-tushunchasi", title: "Parallel to'g'ri chiziqlar", page: "100-bet",
              sections: [
                secText("Ta'rif",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir tekislikda yotgan va kesishmaydigan ikki to'g'ri chiziq <strong>parallel</strong> deyiladi. Belgilanishi: a ∥ b.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='70' viewBox='0 0 200 70'>" +
                      "<line x1='15' y1='25' x2='185' y2='25' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='15' y1='50' x2='185' y2='50' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='188' y='22' font-size='10'>a</text><text x='188' y='47' font-size='10'>b</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Parallellik aksiomasi",
                  "<div class='lecture-rule'><strong>Aksioma:</strong> to'g'ri chiziq tashqarisidagi nuqtadan shu to'g'ri chiziqqa parallel bo'lgan faqat bitta to'g'ri chiziq o'tkazish mumkin.</div>"
                ),
                secText("Parallellikning xossalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar ikki to'g'ri chiziq uchinchisiga parallel bo'lsa, ular o'zaro ham parallel. Agar to'g'ri chiziq ikki parallel chiziqdan birini kessa, ikkinchisini ham albatta kesadi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Nima uchun bir tekislikda yotmagan (fazoviy) ikki kesishmaydigan to'g'ri chiziqni parallel deb bo'lmaydi? Misol keltiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallellik-alomatlari", title: "Ikki to'g'ri chiziqning parallellik alomatlari", page: "105-bet",
              sections: [
                secText("Kesuvchi va burchaklar",
                  "<div class='lecture-figure'>" +
                    "<svg width='230' height='130' viewBox='0 0 230 130'>" +
                      "<line x1='15' y1='45' x2='215' y2='45' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='15' y1='90' x2='215' y2='90' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='70' y1='15' x2='170' y2='120' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='96' y='38' font-size='9' fill='#16a394'>1</text><text x='120' y='38' font-size='9' fill='#16a394'>2</text>" +
                      "<text x='100' y='60' font-size='9' fill='#16a394'>3</text><text x='124' y='60' font-size='9' fill='#16a394'>4</text>" +
                      "<text x='118' y='84' font-size='9' fill='#16a394'>5</text><text x='142' y='84' font-size='9' fill='#16a394'>6</text>" +
                      "<text x='122' y='106' font-size='9' fill='#16a394'>7</text><text x='146' y='106' font-size='9' fill='#16a394'>8</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesuvchi 8 burchak hosil qiladi. <em>Ichki almashinuvchi</em>: 3 va 6, 4 va 5. <em>Ichki bir tomonli</em>: 3 va 5, 4 va 6. <em>Mos burchaklar</em>: 1 va 5, 2 va 6, 3 va 7, 4 va 8.</div>"
                ),
                secText("Parallellik alomatlari",
                  "<div class='lecture-rule'><strong>Teorema:</strong> ikki to'g'ri chiziqni kesuvchi kessa va: &nbsp; a) ichki almashinuvchi burchaklar teng bo'lsa, YOKI &nbsp; b) mos burchaklar teng bo'lsa, YOKI &nbsp; d) ichki bir tomonli burchaklar yig'indisi 180° bo'lsa — to'g'ri chiziqlar parallel.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> kesuvchi bilan hosil bo'lgan mos burchaklar 65° va 65° bo'lsa, chiziqlar parallel. Perpendikulyarlik orqali: a ⊥ c va b ⊥ c bo'lsa, a ∥ b.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ichki bir tomonli burchaklardan biri 110°, ikkinchisi 70°. To'g'ri chiziqlar parallelmi? Endi ikkalasi ham 90° bo'lsa-chi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kesuvchi-hosil-qilgan-burchaklar", title: "Ikki parallel to'g'ri chiziq va kesuvchi hosil qilgan burchaklar", page: "109-bet",
              sections: [
                secText("Parallel chiziqlar xossasi (teskari teorema)",
                  "<div class='lecture-rule'><strong>Teorema:</strong> ikki parallel to'g'ri chiziq kesuvchi bilan kesilganda: ichki almashinuvchi burchaklar teng; mos burchaklar teng; ichki bir tomonli burchaklar yig'indisi 180°.</div>"
                ),
                secText("Bitta burchakdan qolganlarini topish",
                  "<div class='lecture-figure'>" +
                    "<svg width='220' height='120' viewBox='0 0 220 120'>" +
                      "<line x1='15' y1='40' x2='205' y2='40' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='15' y1='85' x2='205' y2='85' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='60' y1='15' x2='160' y2='115' stroke='#1f2433' stroke-width='2'/>" +
                      "<text x='92' y='34' font-size='10' fill='#16a394'>70°</text>" +
                      "<text x='120' y='102' font-size='10' fill='#16a394'>70°</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a ∥ b, bir burchak 70° bo'lsa: unga mos va almashinuvchi burchaklar ham 70°, qo'shnilari esa 110°.</div>"
                ),
                secText("Amaliy qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> qurilishda parallel devorlarni bir chiziq (nur) bilan tekshirib, mos burchaklarning tengligiga qarab parallellikni nazorat qilinadi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a ∥ b. Kesuvchi bilan hosil bo'lgan ikkita mos burchak (2x + 10)° va (3x − 20)° ga teng. x ni va burchaklarni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-ichki-burchaklar-yigindisi", title: "Uchburchakning ichki burchaklari yig'indisi", page: "124-bet",
              sections: [
                secText("Teorema",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='110' viewBox='0 0 200 110'>" +
                      "<polygon points='30,90 170,90 110,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='70' y1='20' x2='150' y2='20' stroke='#16a394' stroke-width='1.5' stroke-dasharray='4 3'/>" +
                      "<text x='38' y='85' font-size='10' fill='#16a394'>1</text>" +
                      "<text x='155' y='85' font-size='10' fill='#16a394'>2</text>" +
                      "<text x='104' y='34' font-size='10' fill='#16a394'>3</text>" +
                      "<text x='100' y='106' font-size='9' text-anchor='middle' fill='#4f5bd5'>∠1 + ∠2 + ∠3 = 180°</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> har qanday uchburchakning ichki burchaklari yig'indisi <strong>180°</strong> ga teng. (Isbot: uchdan qarama-qarshi tomonga parallel to'g'ri chiziq o'tkazilib, almashinuvchi burchaklardan foydalaniladi.)</div>"
                ),
                secText("Natijalar",
                  "<div class='lecture-rule'><strong>Natijalar:</strong> uchburchakda ko'pi bilan bitta to'g'ri yoki o'tmas burchak bo'ladi; to'g'ri burchakli uchburchakning o'tkir burchaklari yig'indisi 90°; teng tomonli uchburchakning har bir burchagi 60°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> burchaklardan ikkitasi 55° va 65° bo'lsa, uchinchisi 180° − 120° = 60°.</div>"
                ),
                secText("Tashqi burchak teoremasi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning tashqi burchagi u bilan qo'shni bo'lmagan ikkita ichki burchak yig'indisiga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ichki burchaklar 50° va 60° bo'lsa, uchinchi uchdagi tashqi burchak 110°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchak burchaklari (x)°, (2x)°, (3x)° ko'rinishida. Har birini toping. To'rtburchak uchun burchaklar yig'indisi nechaga teng bo'lishini shu usulda tekshiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "togri-burchakli-uchburchaklar", title: "To'g'ri burchakli uchburchaklar", page: "131-bet",
              sections: [
                secText("Elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bitta burchagi 90° bo'lgan uchburchak <strong>to'g'ri burchakli</strong> deyiladi. To'g'ri burchak qarshisidagi tomon — <strong>gipotenuza</strong>, qolgan ikki tomon — <strong>katetlar</strong>.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='110' viewBox='0 0 160 110'>" +
                      "<polygon points='25,90 135,90 25,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<rect x='25' y='76' width='14' height='14' fill='none' stroke='#16a394'/>" +
                      "<text x='70' y='104' font-size='9' fill='#6b7280'>katet</text>" +
                      "<text x='2' y='58' font-size='9' fill='#6b7280'>katet</text>" +
                      "<text x='90' y='48' font-size='9' fill='#6b7280'>gipotenuza</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("O'tkir burchaklari",
                  "<div class='lecture-rule'><strong>Xossa:</strong> to'g'ri burchakli uchburchakning ikki o'tkir burchagi o'zaro to'ldiruvchi: ularning yig'indisi 90°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> bir o'tkir burchak 35° bo'lsa, ikkinchisi 55°.</div>"
                ),
                secText("30° li katet xossasi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> to'g'ri burchakli uchburchakda 30° li burchak qarshisidagi katet gipotenuzaning yarmiga teng. Teskarisi ham o'rinli.</div>"
                ),
                secText("Teng burchakli uchburchaklar tengligi alomatlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> to'g'ri burchakli uchburchaklar teng bo'ladi, agar: ikki kateti mos teng bo'lsa; kateti va gipotenuzasi mos teng bo'lsa; kateti va o'tkir burchagi mos teng bo'lsa; gipotenuzasi va o'tkir burchagi mos teng bo'lsa.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'g'ri burchakli uchburchakda bir o'tkir burchak ikkinchisidan 20° katta. Uchala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "bissektrisa-xossasi", title: "Burchak bissektrisasining xossasi", page: "135-bet",
              sections: [
                secText("Bissektrisa ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> burchakni ikkita teng burchakka bo'luvchi nur uning <strong>bissektrisasi</strong> deyiladi.</div>"
                ),
                secText("Asosiy xossa",
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='110' viewBox='0 0 180 110'>" +
                      "<line x1='20' y1='95' x2='165' y2='55' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='20' y1='95' x2='150' y2='95' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='20' y1='95' x2='170' y2='75' stroke='#16a394' stroke-width='2' stroke-dasharray='5 3'/>" +
                      "<circle cx='120' cy='83' r='3' fill='#1f2433'/>" +
                      "<line x1='120' y1='83' x2='112' y2='69' stroke='#6b7280' stroke-dasharray='2 2'/>" +
                      "<line x1='120' y1='83' x2='120' y2='95' stroke='#6b7280' stroke-dasharray='2 2'/>" +
                      "<text x='18' y='108' font-size='9'>O</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> burchak bissektrisasining har bir nuqtasi burchak tomonlaridan teng uzoqlikda joylashadi. Teskarisi: burchak tomonlaridan teng uzoqlikdagi ichki nuqta bissektrisada yotadi.</div>"
                ),
                secText("Uchburchak bissektrisalari",
                  "<div class='lecture-rule'><strong>Natija:</strong> uchburchakning uchta ichki bissektrisasi bitta nuqtada kesishadi. Bu nuqta uchburchakka <strong>ichki chizilgan aylana</strong> markazi bo'lib, uchala tomondan teng uzoqlikda.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>OM — ∠AOB ning bissektrisasi. M nuqtadan OA va OB tomonlarga MK va ML perpendikulyarlar tushirilgan. △OKM = △OLM ekanini isbotlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tomon-burchak-munosabatlar", title: "Uchburchakning tomonlari va burchaklari orasidagi munosabatlar", page: "138-bet",
              sections: [
                secText("Katta tomon — katta burchak",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning katta tomoni qarshisida katta burchak yotadi; katta burchak qarshisida katta tomon yotadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> AB &gt; BC &gt; AC bo'lsa, ∠C &gt; ∠A &gt; ∠B.</div>"
                ),
                secText("Uchburchak tengsizligi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning har bir tomoni qolgan ikki tomoni yig'indisidan kichik: a &lt; b + c, &nbsp; b &lt; a + c, &nbsp; c &lt; a + b.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3, 4, 8 uzunliklardan uchburchak yasab bo'lmaydi, chunki 3 + 4 = 7 &lt; 8.</div>"
                ),
                secText("Natijalar",
                  "<div class='lecture-rule'><strong>Natija:</strong> teng yonli uchburchakning asosi yon tomonlar yig'indisidan kichik. Ikki nuqtani tutashtiruvchi kesma har qanday siniq chiziqdan qisqa.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchakning ikki tomoni 5 sm va 9 sm. Uchinchi tomon butun son bo'lsa, u qanday qiymatlar qabul qilishi mumkin?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "sirkul-chizgich-yasash", title: "Sirkul va chizg'ich yordamida geometrik yasashga doir masalalar", page: "152-bet",
              sections: [
                secText("Yasash asboblari va shartlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> geometrik yasashda faqat ikki asbob ishlatiladi: <strong>chizg'ich</strong> (ikki nuqta orqali to'g'ri chiziq o'tkazish) va <strong>sirkul</strong> (markaz va radius bo'yicha aylana chizish). Chizg'ichda bo'linmalardan foydalanilmaydi.</div>"
                ),
                secText("Asosiy yasashlar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sirkul va chizg'ich bilan quyidagilar yasaladi: berilgan kesmaga teng kesma; berilgan burchakka teng burchak; burchak bissektrisasi; kesmaning o'rta perpendikulyari (va o'rtasi); berilgan to'g'ri chiziqqa perpendikulyar.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='90' viewBox='0 0 200 90'>" +
                      "<line x1='20' y1='60' x2='180' y2='60' stroke='#1f2433' stroke-width='2'/>" +
                      "<circle cx='70' cy='60' r='38' fill='none' stroke='#4f5bd5' stroke-dasharray='4 3'/>" +
                      "<circle cx='130' cy='60' r='38' fill='none' stroke='#16a394' stroke-dasharray='4 3'/>" +
                      "<line x1='100' y1='18' x2='100' y2='88' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<circle cx='70' cy='60' r='2.5' fill='#4f5bd5'/><circle cx='130' cy='60' r='2.5' fill='#16a394'/>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Uchburchak yasash",
                  "<div class='lecture-rule'><strong>Uch tomoni bo'yicha:</strong> BC tomonni chizamiz; B dan radiusi AB ga teng, C dan radiusi AC ga teng aylana yoylari o'tkazamiz; ularning kesishgan nuqtasi A. &nbsp; (Yasash mumkinligi shart: har tomon qolgan ikkitasi yig'indisidan kichik.)</div>" +
                  "<div class='lecture-rule'><strong>Ikki tomoni va orasidagi burchagi bo'yicha:</strong> berilgan burchakni yasaymiz, tomonlariga berilgan uzunliklarni sirkul bilan qo'yamiz, hosil bo'lgan nuqtalarni tutashtiramiz.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Faqat sirkul va chizg'ich bilan 90°, 45° va 60° li burchaklarni qanday yasash mumkin? Qadamlarni tavsiflang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
          ]
        }
      ]
    },
    {
      id: "8",
      name: "8-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "ratsional-kasrlar", title: "Ratsional kasrlar", lecture: { text: "Algebraik kasrlar ustida amallar.", embedUrl: null }, interactive: null, test: null },
            { id: "kvadrat-ildiz", title: "Kvadrat ildiz", lecture: { text: "Kvadrat ildiz tushunchasi va uning xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "kvadrat-tenglama", title: "Kvadrat tenglamalar", lecture: { text: "Kvadrat tenglamalarni yechish formulalari.", embedUrl: null }, interactive: null, test: null },
            { id: "kvadratga-keltirish", title: "Kvadrat tenglamalarga keltiriladigan tenglamalar", lecture: { text: "Murakkabroq tenglamalarni kvadrat tenglamaga keltirish.", embedUrl: null }, interactive: null, test: null },
            { id: "tengsizliklar", title: "Tengsizliklar", lecture: { text: "Chiziqli va kvadrat tengsizliklarni yechish.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "tortburchaklar", title: "To'rtburchaklar (parallelogramm, trapetsiya)", lecture: { text: "To'rtburchaklarning turlari va xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "yuzalar", title: "Yuzalar", lecture: { text: "Ko'pburchaklarning yuzini hisoblash formulalari.", embedUrl: null }, interactive: null, test: null },
            { id: "oxshash-uchburchaklar", title: "O'xshash uchburchaklar", lecture: { text: "Uchburchaklar o'xshashligi alomatlari.", embedUrl: null }, interactive: null, test: null },
            { id: "pifagor-teoremasi", title: "Pifagor teoremasi", lecture: { text: "To'g'ri burchakli uchburchak tomonlari orasidagi bog'lanish.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    },
    {
      id: "9",
      name: "9-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "kvadrat-funksiya", title: "Kvadrat funksiya", lecture: { text: "Kvadrat funksiya grafigi va xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "tenglamalar-tengsizliklar-sistemasi", title: "Tenglamalar va tengsizliklar sistemasi", lecture: { text: "Ikkinchi darajali sistemalarni yechish usullari.", embedUrl: null }, interactive: null, test: null },
            { id: "progressiya", title: "Arifmetik va geometrik progressiya", lecture: { text: "Progressiyalarning formulalari va qo'llanilishi.", embedUrl: null }, interactive: null, test: null },
            { id: "darajali-funksiya", title: "Darajali funksiya", lecture: { text: "Darajali funksiyaning xossalari va grafigi.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "vektorlar", title: "Vektorlar", lecture: { text: "Vektor tushunchasi va vektorlar ustida amallar.", embedUrl: null }, interactive: null, test: null },
            { id: "sinus-kosinus-teoremalari", title: "Sinuslar va kosinuslar teoremasi", lecture: { text: "Ixtiyoriy uchburchakda tomon va burchaklar orasidagi bog'lanish.", embedUrl: null }, interactive: null, test: null },
            { id: "muntazam-kopburchaklar", title: "Muntazam ko'pburchaklar", lecture: { text: "Muntazam ko'pburchaklarning xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "aylana-uzunligi-doira-yuzi", title: "Aylana uzunligi va doira yuzi", lecture: { text: "Pi soni orqali aylana va doira formulalarini hisoblash.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    },
    {
      id: "10",
      name: "10-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "trigonometrik-funksiyalar", title: "Trigonometrik funksiyalar (sinus, kosinus, tangens)", lecture: { text: "Burchak (gradus) va uzunlik (birlik aylana koordinatasi) orasidagi bog'lanish sifatida sinus va kosinus.", embedUrl: null }, interactive: "lessons/10-algebra-trigonometrik-funksiyalar.html", test: null },
            { id: "trigonometrik-tenglamalar", title: "Trigonometrik tenglamalar", lecture: { text: "Oddiy trigonometrik tenglamalarni yechish.", embedUrl: null }, interactive: null, test: null },
            { id: "korsatkichli-logarifmik", title: "Ko'rsatkichli va logarifmik funksiyalar", lecture: { text: "Ko'rsatkichli va logarifmik funksiyalarning xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "limit-tushunchasi", title: "Limit tushunchasi", lecture: { text: "Ketma-ketlik va funksiya limitiga kirish.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "fazoda-togri-chiziq-tekislik", title: "Fazoda to'g'ri chiziq va tekisliklar", lecture: { text: "Stereometriyaga kirish: fazoviy joylashuv holatlari.", embedUrl: null }, interactive: null, test: null },
            { id: "kopyoqlar", title: "Ko'pyoqlar (prizma, piramida)", lecture: { text: "Prizma va piramidaning tuzilishi va xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "parallellik-perpendikulyarlik", title: "Parallellik va perpendikulyarlik", lecture: { text: "Fazoda to'g'ri chiziq va tekisliklarning o'zaro joylashuvi.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    },
    {
      id: "11",
      name: "11-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "hosila", title: "Hosila va uning tatbiqlari", lecture: { text: "Hosila tushunchasi, funksiyani tekshirishda qo'llanilishi.", embedUrl: null }, interactive: null, test: null },
            { id: "integral", title: "Integral", lecture: { text: "Boshlang'ich funksiya va aniq integral.", embedUrl: null }, interactive: null, test: null },
            { id: "ehtimollar-nazariyasi", title: "Ehtimollar nazariyasi asoslari", lecture: { text: "Ehtimollikni hisoblashning asosiy usullari.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "aylanish-jismlari", title: "Aylanish jismlari (silindr, konus, shar)", lecture: { text: "Aylanish jismlarining tuzilishi va yoyilmasi.", embedUrl: null }, interactive: null, test: null },
            { id: "yuza-hajm", title: "Ko'pyoqlar va aylanish jismlarining yuzasi, hajmi", lecture: { text: "Fazoviy shakllarning yuza va hajmini hisoblash formulalari.", embedUrl: null }, interactive: null, test: null },
            { id: "fazoda-koordinatalar-vektor", title: "Koordinatalar va vektorlar metodi fazoda", lecture: { text: "Fazoviy masalalarni koordinata va vektor usulida yechish.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    }
  ]
};
