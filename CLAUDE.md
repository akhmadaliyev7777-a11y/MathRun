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

## Fayllar
| Nima | Qayerda |
|---|---|
| Reja (47 mavzu: qoidalar ro'yxati, misol turlari, holat ✅/☐) | `_reja/5-sinf-maruza-reja.md` |
| Har mavzu ish tartibi (batafsil) | `_reja/CLAUDE-ish-tartibi.md` — **mavzuni boshlashdan oldin o'qing** |
| Mavzu → kitob betlari | `_reja/mavzular.json` |
| Kitob betlarini o'qish | `python3 _reja/kitob.py N` (matn), `... N --rasm DIR` (PNG). Kerak: `pip install pymupdf` |
| Tengliklarni tekshirish | `python3 _reja/tools/tenglik.py maruza/5-<id>.html` |
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

**Navbat:** 8-mavzu «Kasrni natural songa ko'paytirish» (id `kasrni-natural-songa-kopaytirish`, D1 64–69, M1 71–78), keyin 9, 10, ... 47 tartib bilan. Alohida vazifa: 1, 2, 6-mavzularga o'z testi (10 savol, izohli).

## Chizmalar (`maruza/chizma.js`, HTML'da `data-*` atribut)
`data-xk` (kasrni ×k), `data-ld` (burchak usulida bo'lish), `data-kataklar`, `data-sonoqi`, `data-xona`, `data-tugma`, `data-oq`, `data-siljish`, `data-zanjir="43/x2/x10"`, `data-nollar="63000/700"`, `data-tartib="80 - 5 * (6 + 4) : 2"` (amallar tartibi raqamlari + qadamlar), `data-tasma="Otasi:3|Qizi:1" data-farq="..."` (chizmali model), `data-pitsa="3/5" [data-usul="butun"]`, `data-doira="2 3/4" [data-rang]`. Yangi tur kerak bo'lsa — shu faylga qo'shing (boshqa mavzularda ham ishlaydi) va fayl boshidagi ro'yxatga yozing.

## Tez-tez uchragan xatolar (oldini oling)
- Chizmali modelda bo'laklar soni haqiqiy miqdorga mos kelmasa — chizmani qo'ymang.
- Masala sharti bir nechta javobga mos kelmasin (brute-force bilan tekshiring).
- Telefonda uzun qatorlar: `.misollar.qator` (bir ustun), «Diqqat» qatorlari o'zi bo'linadi.
- «·» belgisini misollar orasida ajratuvchi qilib ishlatmang (ko'paytirish bilan adashadi).
