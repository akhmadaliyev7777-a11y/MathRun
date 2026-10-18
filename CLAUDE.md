# Mathlearn — Claude uchun yo'riqnoma

Bu fayl har sessiya boshida o'qiladi. Ish shu yerdan davom etadi.

## Loyiha
- **Mathlearn** (faqat M katta) — 1–11-sinflar uchun interaktiv matematika sayti, **mathlearn.uz** (GitHub Pages, `main` shoxining ildizi, build yo'q — oddiy statik HTML/CSS/JS).
- Foydalanuvchi o'zbek tilida yozadi, dasturchi emas. Javoblar **o'zbek tilida, qisqa, texnik so'zsiz**.
- Hozirgi asosiy ish: **5-sinf mavzulari uchun ma'ruzalar** (Nazariya) va har mavzuning **o'z testi**.

## Qat'iy qoidalar
1. **Push faqat foydalanuvchi «push qil» deganda.** Undan oldin o'zgarishni tayyorlab, tekshirib, nima qilinganini tushuntirib, so'rash.
2. **Oxirgi tahrirdan keyin** sintaksis tekshiruvi: `for f in js/*.js maruza/*.js; do node --check $f; done`. `lessons/*.html` dagi bir qatorli skriptlarga `//` izoh yozilmaydi (qatorning qolgani o'chib, sahifa ishlamay qoladi) — faqat `/* */`.
3. **Kitob matni/rasmi aynan ko'chirilmaydi.** Qoida mazmuni va atamalari aniq, so'zlari o'zimizniki; misollar — o'z sonlarimiz; rasmlar — `maruza/chizma.js` chizgan SVG. Saytda kitob nomi va betlari yozilmaydi.
4. **Kitob PDF'lari hech qachon commit qilinmaydi** — ular faqat `_kitob/` papkasida (`.gitignore` da).
5. **Bir vaqtda bitta mavzu.** Yozish → tekshirish → foydalanuvchiga ko'rsatish → keyingisi.
6. `lessons/` (simulyatorlar) va `mathrunner-web/` (1–4-sinf) ga **tegilmaydi** — ma'ruzalar bosqichi tugaguncha.
7. `js/data.js` dagi `review: true` / `review: "sariq"` (qizil/sariq nuqta) faqat foydalanuvchi «tayyor» desa olib tashlanadi.
8. Ichki nomlar o'zgartirilmaydi: localStorage kaliti `mathrun-progress-v1`, postMessage turi `mathrun:height`, `mathrunner-web/` papkasi.

## Ishlash qoidalari (foydalanuvchi bilan kelishilgan, 2026-10-18)
- **Shox:** `main` da ishlanadi (8–15-mavzular allaqachon `main` da). Mavzu tayyor bo'lgach foydalanuvchidan **push qilishga ruxsat so'rang**; ruxsat bo'lmasa push qilmang.
- **Kitobdan ko'chirma taassuroti bo'lmasin:** kitobdagi aynan bir xil ifoda, son-juftlik, ism va vaziyatlarni o'zimizniki bilan almashtiring. Qoida mazmuni va atamalari — aniq, so'zlari — o'zimizniki.
- **Birinchi o'rinda — sifat, ikkinchisida — token.** Maqsad: ish sifati tushmasin va foydalanuvchining haftalik/oylik limiti kechagidek tez tugab qolmasin (ko'proq mavzu ishlansin). Sifat tushadigan bo'lsa, tejash qoidalarini buzish mumkin: ko'proq o'qing, qayta yozing, qayta tekshiring.
  - **Hech qachon qisqartirilmaydi:** tenglik.py, javoblarni Python bilan hisoblash, masala bir javobli ekanini tekshirish, 390/1100 px ko'rish tekshiruvi, kitobdan ko'chirmaslik.
  - **Kitobdan ko'chirma:** kitob bilan aynan mos tushgan son, ifoda, ism va vaziyatlar **albatta** almashtiriladi (`python3 _reja/tools/kitobdan.py` bilan toping, butun kitobni qayta o'qimang). Mos kelmagan misollarga tegmang. Chizmalar: biroz o'zgartirish yetarli bo'lsa — shuni qiling, sifati past chizmani qaytadan yasang.
  - **Kuchliroq model (Opus):** modelni o'zingiz almashtira olmaysiz. Qiyin mavzuda (masalan 18–20: yangi chizma turi, murakkab hisob) yoki Sonnet takror xato qilsa, foydalanuvchiga «bu mavzuga /model bilan Opus kerak» deb ayting va sababini bir gapda yozing. Oddiy mavzularda Sonnet.
  - **Chegara:** bir mavzu uchun o'rtacha ish hajmidan (bir sessiyada 1–2 mavzu) sezilarli oshib ketsangiz — to'xtab, foydalanuvchiga ayting va so'rang; bir ma'ruzani ikki martadan ortiq butunlay qayta yozmang.
- **Tejash (sessiya):** bir sessiyada bitta-ikkita mavzu; keyingisini yangi sessiyada boshlang. Kitob PDF'ini va rasmlarni faqat kerakli betlar bo'yicha o'qing. Barcha ma'ruzalarni qayta tekshirish faqat `chizma.js`/`maruza.css` o'zgarganda kerak. Oddiy ish uchun Sonnet yetarli.
- **Kitoblar:** PDF'lar GitHub'da yo'q — yangi sessiyada foydalanuvchi qayta yuklaydi (16–20-mavzular: kitob betlari 103–134). Mashq daftarlari (M1, M2) hali berilmagan — reja ro'yxatlari bilan ishlang va hisobotda ayting.
- **Tekshiruv:** `python3 _reja/tools/tenglik.py`, `node --check`, 390 va 1100 px (Playwright, KaTeX'ni `scratchpad/node_modules/katex` dan `page.route` bilan berish; server: `python3 -m http.server`, o'chirish: `pkill -f "http.serve[r] 8765"`).
- **Hisobot:** har mavzudan keyin qisqa, texnik so'zsiz o'zbekcha hisobot.

## Fayllar
| Nima | Qayerda |
|---|---|
| Reja (47 mavzu: qoidalar ro'yxati, misol turlari, holat ✅/☐) | `_reja/5-sinf-maruza-reja.md` |
| Har mavzu ish tartibi (batafsil) | `_reja/CLAUDE-ish-tartibi.md` — **mavzuni boshlashdan oldin o'qing** |
| Mavzu → kitob betlari | `_reja/mavzular.json` |
| Kitob betlarini o'qish | `python3 _reja/kitob.py N` (matn), `... N --rasm DIR` (PNG). Kerak: `pip install pymupdf` |
| Tengliklarni tekshirish | `python3 _reja/tools/tenglik.py maruza/5-<id>.html` |
| Kitob sonlari ko'chirilmaganini tekshirish | `python3 _reja/kitob.py N > /tmp/kN.txt; python3 _reja/tools/kitobdan.py /tmp/kN.txt maruza/5-<id>.html` (bir xil «son amal son» juftlarini ko'rsatadi; ½·a·h kabi formulalar va tasodifiy oddiy juftlar normal — namuna va masalalar kitobdagidek bo'lmasin) |
| Ma'ruza sahifalari | `maruza/5-<id>.html` (namuna: `maruza/5-aralash-sonlarni-qoshish-ayirish.html`) |
| Umumiy andoza | `maruza/maruza.css`, `maruza/maruza.js` (KaTeX, javob tugmalari, iframe balandligi), `maruza/chizma.js` (chizmalar — ro'yxati fayl boshida) |
| Personajlar | `maruza/personaj/*.webp` (aziz, madina, ustoz + holatlari — `_reja/CLAUDE-ish-tartibi.md` 3a) |
| Mavzular ro'yxati | `js/data.js` → `SITE_DATA` (5-sinf matematika `topics`) |
| Testlar | `js/quizzes.js` → `QUIZ_DATA` |

### Kitoblar (foydalanuvchi yuklaydi)
Foydalanuvchi PDF'larni sessiyaga yuklaydi. Ularni **`_kitob/`** papkasiga shu nomlar bilan qo'ying:
- `5-sinf matematika 1-qism darslik.pdf` (D1)
- `5-sinf matematika 2-qism darslik.pdf` (D2)
- `5-sinf matematika 1-qism mashq daftar.pdf` (M1)
- `5-sinf matematika 2-qism mashq daftari.pdf` (M2)

PDF beti = kitob beti + 4. Agar nomlar boshqacha bo'lsa — faylni qayta nomlang (kitob.py dagi `FAYL`). Kitob yo'q bo'lsa, rejadagi «Qoidalar ro'yxati» va «Misol turlari» bilan ishlang va buni foydalanuvchiga ayting.

## Bitta mavzu — qadamlar (qisqacha; to'liq: `_reja/CLAUDE-ish-tartibi.md` 2-bo'lim)
1. Rejadagi mavzu bo'limini va `python3 _reja/kitob.py N` ni to'liq o'qish; ro'yxatda yo'q qoida/misol turi bo'lsa — rejaga qo'shish.
2. `maruza/5-<id>.html` ni yozish (tuzilish har mavzuda bir xil): 1 Eslab olaylik → 2 Qoidalar (har biridan keyin namuna) → 3 Rasmda ko'ramiz → 4 Namunalar → 5 Diqqat! (xato → to'g'ri) → 6 Mashqlar (Oson/O'rta/Qiyin, «Javobni ko'rish») → 7 Matnli masalalar → 8 O'ylab ko'ring → 9 O'zingizni tekshiring. Pastida: `<p class="m-foot">Mathlearn · 5-sinf matematika</p>`.
3. Formulalar faqat KaTeX: `\(\frac{3}{5}\)`, aralash son `\(2\frac{1}{3}\)`, `\cdot`, `:`. Kasr ranglari: `\sur{}` ko'k, `\mx{}` to'q sariq, `\nat{}` yashil natija. Katta sonlar: `22 200` (bo'sh joy bilan, maruza.js o'zi to'g'rilaydi).
4. **Barcha javoblarni** Python (`fractions.Fraction`) bilan alohida hisoblash; `_reja/tools/tenglik.py` bilan sahifani tekshirish (atayin xato misollardan boshqa XATO bo'lmasin).
5. **Mavzuning o'z testi** — `js/quizzes.js` da kalit `"5|matematika|<topic id>"`, 10 savol (level 1–10, osondan qiyinga), har birida `explain` (o'z so'zimiz, 1–2 gap). `answer` `options` dagi qiymatlardan biri bilan aynan bir xil.
6. **Ulash** — `js/data.js` da mavzuga `lecture: { text: null, embedUrl: "maruza/5-<id>.html" }` va `test: "test.html?sinf=5&fan=matematika&mavzu=<id>"`; `LESSON_VER` +1; barcha `*.html` da `data.js?v=` +1; `test.html` da `quizzes.js?v=` +1. `chizma.js`/`maruza.css` o'zgarsa — barcha `maruza/5-*.html` da `?v=` +1.
7. **Kitob bilan qayta solishtirish** — har qoida va har misol turi sahifada bormi; natija rejaga va hisobotga.
8. **Ko'rish tekshiruvi** — imkon bo'lsa brauzerda (Playwright/Chromium) telefon 390 px va kompyuter 1100 px: `scrollWidth` = ekran kengligi, KaTeX yuklangan, xato yo'q, rasmlar o'qiladi. Imkon bo'lmasa — foydalanuvchiga telefonda ochib ko'rishni so'rash.
9. **Rejada belgilash** — `☐` → `✅`, sana, «Kitob bilan solishtirildi», «Tekshiruv», «Simulyator uchun g'oyalar».
10. Foydalanuvchiga qisqa hisobot (nima kirdi, nima tekshirildi, nima tuzatildi) va «push qil» kutish.

## Holat (2026-10-17)
5-sinf, 47 mavzu. Saytda (push qilingan, `03970a8`):

| Mavzu | Ma'ruza | O'z testi |
|---|---|---|
| 1. Ko'p xonali sonlar | ✅ | ☐ (umumiy `natural-sonlar` testi, izohsiz) |
| 2. 10, 100, 1000 ga ko'paytirish va bo'lish | ✅ | ☐ (umumiy `turt-amal` testi, izohsiz) |
| 3. O'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish | ✅ | ✅ |
| 4. Amallarni bajarish tartibi | ✅ | ✅ |
| 5. Bo'lishni kasr ko'rinishida ifodalash | ✅ | ✅ |
| 6. Oddiy kasrni o'nli kasrga aylantirish | ✅ | ☐ (umumiy `oddiy-kasrlar` testi, izohli) |
| 7. Aralash sonlarni qo'shish va ayirish | ✅ | ✅ |
| 8. Kasrni natural songa ko'paytirish | ✅ | ✅ |
| 9. Kasrni kasrga ko'paytirish | ✅ | ✅ |
| 10. Aralash sonni natural songa ko'paytirish | ✅ | ✅ |
| 11. Qolgan qismning qismi + matnli masalalar | ✅ | ✅ |
| 12. Uchburchakning asosi va balandligi | ✅ | ✅ |
| 13. Uchburchakning yuzini topish | ✅ | ✅ |
| 14. To'g'ri to'rtburchak va uchburchaklardan tuzilgan shakllarning yuzi | ✅ | ✅ |
| 15. Fazoviy jismlarning hajmi | ✅ | ✅ |
| 20. Suyuqlik hajmi (16–19 hali yo'q; foydalanuvchi so'rovi bilan oldinroq) | ✅ (push kutilmoqda) | ✅ |

**Navbat:** 16-mavzu «Uch o'lchamli panjarada fazoviy jismlarni chizish» (id `izometrik-panjarada-chizish`, D1 115–117, M1 141–142; kitob betlari 103–134 foydalanuvchi yuborgan PDF'da bor), keyin 17, ... 47 tartib bilan. 8–15-mavzular 2026-10-18 da kompyuterdagi sessiya tekshirib, main ga qo'shdi. Yangi ishni avval `git fetch origin main` qilib, eng so'nggi main ustida boshla; ishni o'z shoxingga push qil — main ga kompyuterdagi sessiya qo'shadi. Alohida vazifa: 1, 2, 6-mavzularga o'z testi (10 savol, izohli).

## Chizmalar (`maruza/chizma.js`, HTML'da `data-*` atribut)
`data-xk` (kasrni ×k), `data-ld` (burchak usulida bo'lish), `data-kataklar`, `data-sonoqi`, `data-xona`, `data-tugma`, `data-oq`, `data-siljish`, `data-zanjir="43/x2/x10"`, `data-nollar="63000/700"`, `data-tartib="80 - 5 * (6 + 4) : 2"` (amallar tartibi raqamlari + qadamlar), `data-tasma="Otasi:3|Qizi:1" data-farq="..."` (chizmali model), `data-pitsa="3/5" [data-usul="butun"]`, `data-doira="2 3/4" [data-rang]`, `data-qism="14/5/7" [data-yozuv="ko'k"] [data-izoh="0"]` (sonning qismi: n ta narsa b ta guruhga, a tasi bo'yalgan; n > 40 — tasma; izoh="0" — hisobsiz, mashq uchun), `data-yuza="1/4/2/3"` (a/b ning c/d qismi — to'g'ri to'rtburchakda bo'yash va shtrixlash; a > b bo'lsa bir nechta butun), `data-qolgan="1/6/2/5" [data-yozuv="1/6|Qolgan qism|?"]` (tasma: a/b qism bo'yalgan, qolganning c/d qismi belgilangan). `data-kub="3x2x2" | "3,2,1|3,2,1"` [data-yozuv="bo'yi|eni|balandligi"] [data-rang] [data-ajrat="1"] [data-son="1"] [data-olcham] (birlik kubchalardan izometrik jism: kuboid "b x e x h" yoki ustundagi kubchalar soni, qatorlar "|" bilan; ajrat — qatlamlar ajratiladi, son — ustdan ko'rinish). `data-idish="40x25x30" [data-suv="18"] [data-yozuv="bo'yi|eni|balandligi|suv sathi|bo'sh qism"]` (suvli shisha idish), `data-menzurka="600/1000"` (o'lchov idishi). `data-geo='{"katak":[7,5],"nuqta":{"M":[0,0],"N":[7,0],"P":[3,5]},"shakl":["MNP"],"asos":"MN","bal":["P","MN","D"],"uzun":{"MN":"7 cm"}}'` (geometriya: katakli fon, uchlar, ko'pburchaklar, qizil asos, balandlik — asosi avtomatik topiladi, davomi punktir, to'g'ri burchak belgisi; "kesma":[["P","Q","tik","R"]], "tik":["C"], "ramka":["ABCD"] (punktir mos to'rtburchak), "oq":["DEC"] (kesib olingan oq qism), "uzun":{"MH-":"..."} (yozuv narigi tomonda), "yashir", "olcham" — to'liq ro'yxat chizma.js boshida). Yangi tur kerak bo'lsa — shu faylga qo'shing (boshqa mavzularda ham ishlaydi) va fayl boshidagi ro'yxatga yozing.

## Tez-tez uchragan xatolar (oldini oling)
- Chizmali modelda bo'laklar soni haqiqiy miqdorga mos kelmasa — chizmani qo'ymang.
- Masala sharti bir nechta javobga mos kelmasin (brute-force bilan tekshiring).
- Telefonda uzun qatorlar: `.misollar.qator` (bir ustun), «Diqqat» qatorlari o'zi bo'linadi.
- «·» belgisini misollar orasida ajratuvchi qilib ishlatmang (ko'paytirish bilan adashadi).
