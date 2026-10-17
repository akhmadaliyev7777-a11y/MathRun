# Ma'ruza yasash — Claude uchun ish tartibi (5-sinf)

Bu fayl — men (Claude) har bir mavzuni qanday qilishim kerakligi. Batafsil mazmun: `_reja/5-sinf-maruza-reja.md`.
Foydalanuvchi: o'zbek tilida yozadi, dasturchi emas. Javoblar o'zbek tilida, qisqa, texnik so'zsiz.

## 0. Qat'iy qoidalar (buzilmaydi)
1. **Bir vaqtda bitta mavzu.** Tugatib, tekshirib, ko'rsatib, keyin keyingisi.
2. **Push faqat "push qil" deyilganda.** Undan oldin: `node --check` + skrinshot tekshiruvi OXIRGI tahrirdan keyin.
3. **Kitob matni/rasmi aynan ko'chirilmaydi.** Qoida mazmuni va atamalari aniq saqlanadi, so'zlari o'zimizniki. Misollar — o'z sonlarimiz va vaziyatlarimiz. Rasmlar — o'zimiz chizgan SVG. Saytda kitob nomi va betlari yozilmaydi.
4. **Hech bir qoida tushib qolmaydi.** Rejadagi "Qoidalar ro'yxati"ning har bandi ma'ruzada bo'lishi shart.
5. **Hech bir misol turi tushib qolmaydi.** "Misol turlari" + "Mashq daftaridan" ro'yxatlaridagi har tur kamida bitta mashq bo'ladi.
6. **Kitob xatolari ko'chirilmaydi** (rejaning C bo'limi).
7. **Simulyatorlarga (lessons/) tegilmaydi** — ma'ruzalar bosqichi tugaguncha. Har mavzuda simulyator uchun g'oyalarni rejaga yozib boraman.
8. Qoida mujmal bo'lmasin: qachon ishlaydi, nima qilinadi, natija qanday — uchalasi ham yozilsin. "Odatda", "ko'pincha" kabi so'z yo'q.

## 0a. 2026-10-17 dagi o'zgarishlar (hisobga olinadi)
- Sayt nomi **Mathlearn** (faqat M katta), domen **mathlearn.uz**. Ma'ruza pastidagi yozuv: `<p class="m-foot">Mathlearn · 5-sinf matematika</p>`.
- Mavzu sahifasida bosqichlar: **① Nazariya → ② Interaktiv panel → ③ Test** (tepaga yopishgan panel, bitta bo'lim ko'rinadi, iframe faqat ochilganda yuklanadi). Ma'ruza = 1-bosqich.
- Testda javobdan keyin izoh: `js/quizzes.js` da savolga `explain: "..."` qo'shiladi. Namuna: `5|matematika|oddiy-kasrlar` (10 ta izoh).
- MUAMMO: testlar bob bo'yicha umumiy (masalan 2–4-mavzular bitta `turt-amal`, 5–11 bitta `oddiy-kasrlar`), 21 mavzuda test yo'q. Mavzuga mos test kerakmi — foydalanuvchi qarori kutilmoqda.

## 1. Fayllar va asboblar
| Nima | Qayerda |
|---|---|
| Kitoblar | `~/Desktop/maktab darsliklari/` (D1, D2 darslik; M1, M2 mashq daftari) |
| Mavzu → betlar | `_reja/mavzular.json` |
| Betlarni o'qish | `python3 _reja/kitob.py N` (matn), `python3 _reja/kitob.py N --rasm <scratchpad>` (PNG, faqat ko'rish uchun) |
| Ma'ruza sahifalari | `maruza/5-<id>.html` |
| Umumiy andoza | `maruza/maruza.css`, `maruza/maruza.js` (KaTeX 0.16.11, javob tugmalari, iframe balandligi), `maruza/chizma.js` (SVG chizmalar) |
| Saytga ulash | `js/data.js` → mavzuning `lecture: { text: null, embedUrl: "maruza/5-<id>.html" }` |
| Versiya | `js/data.js` da `LESSON_VER` +1; `data.js?v=` ni barcha html larda +1 |
| Ko'k nuqta | lecture bo'lsa avtomatik chiqadi (js/main.js `reviewDot`) |

PDF bet = kitob beti + 4. Formulalar faqat KaTeX: `\frac{3}{5}`, `2\frac{1}{4}`, `a^3`, `\text{cm}^3`, `\approx`, `\perp`, `\parallel`, `\angle`.

## 2. Bitta mavzu — qadamlar
1. **O'qish.** `python3 _reja/kitob.py N` — darslik va daftar betlarini to'liq o'qiyman. Chizmali betlarni `--rasm` bilan ko'raman.
2. **Ro'yxatni tekshirish.** Rejadagi "Qoidalar ro'yxati" va "Misol turlari" to'liqmi — kerak bo'lsa rejani to'ldiraman.
3. **Yozish.** `maruza/5-<id>.html` — tuzilish (har mavzuda bir xil):
   1. Eslab olaylik (oldingi bilim)
   2. Qoidalar (ramkada) + har biridan keyin darhol namuna
   3. Rasmli tushuntirish (SVG)
   4. Namunalar — qadamma-qadam, kerak bo'lsa 2–3 usul
   5. Diqqat! — tipik xatolar
   6. Mashqlar — Oson / O'rta / Qiyin, "Javobni ko'rish"
   7. Matnli masalalar (chizmali model bilan)
   8. Qiyin masala / Xatoni toping (kitobdagi "O'ylab ko'ring", "Matematika kundaligi", "Muammoli topshiriq" turlari)
   9. O'zingizni tekshiring
4. **Javoblarni hisoblash.** Barcha javoblarni Python (`fractions.Fraction`, `decimal`) bilan alohida hisoblab, sahifadagi bilan solishtiraman.
5. **Kitob bilan qayta solishtirish** (foydalanuvchi talabi — har safar!): tayyor sahifani `kitob.py N` matni bilan band-band solishtiraman: har bir qoida, har bir darslik va daftar misol turi sahifada bormi. Natija rejaga va hisobotga.
5b. **3 rol tekshiruvi** (natijani rejaga yozaman):
   - Ekspert: har qoida to'g'ri va to'liq; ro'yxatning har bandi ✅; birliklar, atamalar.
   - Ustoz: oddiydan murakkabga; har qoidadan keyin namuna; barcha misol turlari bor; 5-sinf tili.
   - O'quvchi: telefon (390 px) skrinshotida boshidan oxirigacha — tushunarlimi, kasrlar va rasmlar tiniqmi, tugmalar ishlaydimi.
   - Texnik: `node --check` (js va sahifadagi script), Playwright — kompyuter 1100 px + telefon 390 px, `scrollWidth` = ekran kengligi, `pageerror` yo'q.
5c. **Test izohlari.** Mavzu testidagi har savolga `explain` — o'z so'zimiz bilan, qoidaga tayanib, 1–2 gap. Javobni yana bir bor hisoblab tekshiraman. Test bir necha mavzuga umumiy bo'lsa — izoh bir marta yoziladi.
6. **Ulash.** data.js `embedUrl`, `LESSON_VER` +1, `data.js?v=` +1 → qayta `node --check`.
7. **Ko'rsatish.** Foydalanuvchiga: nima qilindi, qaysi qoidalar va misol turlari kirdi, kitobda topilgan xato bo'lsa — qisqa. Havola: `http://localhost:8765/mavzu.html?sinf=5&fan=matematika&mavzu=<id>` (server: `python3 -m http.server 8765`).
8. **Rejada belgilash.** `☐` → `✅`, sana, tekshiruv natijasi, "Simulyator uchun g'oyalar".
9. **Push** — faqat "push qil" dan keyin.

## 3a. Personajlar (maruza/personaj/*.webp)
Bor: aziz, madina, ustoz (to'liq bo'y); aziz-tushuntiradi, aziz-oylaydi, aziz-diqqat, aziz-yozadi; madina-tushuntiradi, madina-oylaydi; ustoz-tushuntiradi, ustoz-oylaydi.
Ishlatish: bo'lim sarlavhasidan keyin `<div class="gap [ong]"><img src="personaj/NOM.webp" ...><div class="pufak">qisqa gap</div></div>` — o'z so'zimiz bilan, 1–2 gap.
Andoza (6-mavzu): Eslab — madina-oylaydi; Qoidalar — ustoz-tushuntiradi; Rasm — aziz-tushuntiradi; Diqqat — aziz-diqqat; Mashq — aziz-yozadi; O'ylab ko'ring — ustoz-oylaydi; Tekshiring — madina-tushuntiradi.
Yangi rasm kelsa: ~/Desktop/personajlar/N.png → `python3 _reja/personaj.py N` (_reja/personaj.py dagi NOMLAR).

## 3. Ranglar va uslub
- Sayt uslubi (kitobnikidan farqli): Nunito Sans; ramkalar — Qoida (ko'k chap chiziq), Namuna (kulrang fon), Diqqat (to'q sariq), Mashq (yashil raqam), Qiyin masala (binafsha).
- Kasr ranglari simulyatorlardagidek: surat — ko'k, maxraj — to'q sariq, natija — yashil.
- Kitob qahramonlari, belgilari, sahifa tartibi takrorlanmaydi.

## 4. Navbat
1. ✅ Umumiy andoza (maruza.css, maruza.js, chizma.js) — 2026-10-16.
2. ✅ 6-mavzu yangi andozada (namuna sahifa — yangi mavzular shu fayl tuzilishidan nusxa olinadi).
3. 1-mavzudan boshlab tartib bilan: 1 → 2 → … → 47 (6 dan tashqari). Bob tugaganda foydalanuvchiga xabar.
   Yangi chizma turi kerak bo'lsa — chizma.js ga qo'shaman (data-* atribut), boshqa mavzularda ham ishlatiladi.

## 5. Ochiq savollar (javob kelmaguncha standart: cm; ikkala nom; "qo'shimcha" sifatida)
- Birlik: "cm" (darslikdagidek) yoki "sm"?
- 19.1: "kuboid (to'g'ri burchakli parallelepiped)" deb ikkalasini berishmi?
- 19.1/19.2 ga qirralar yig'indisi va sirt yuzi "qo'shimcha" sifatida kirsinmi?
