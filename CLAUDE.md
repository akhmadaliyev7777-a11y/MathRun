# Mathlearn — Claude uchun yo'riqnoma

Bu fayl har sessiya boshida o'qiladi. Ish shu yerdan davom etadi.

## Loyiha
- **Mathlearn** (faqat M katta) — 1–11-sinflar uchun interaktiv matematika sayti, **mathlearn.uz** (GitHub Pages, `main` shoxining ildizi, build yo'q — oddiy statik HTML/CSS/JS).
- Foydalanuvchi o'zbek tilida yozadi, dasturchi emas. Javoblar **o'zbek tilida, qisqa, texnik so'zsiz**.
- Hozirgi asosiy ish: **5-sinf mavzulari uchun ma'ruzalar** (Nazariya) va har mavzuning **o'z testi**.

## Qat'iy qoidalar
1. **Push — faqat foydalanuvchi tasdiqlagandan keyin (foydalanuvchi qarori, 2026-10-25; avvalgi «so'rovsiz push» bekor).** Mavzu tayyor bo'lib, barcha tekshiruvlar (tenglik.py, `node --check`, testlar.js, 390/1100 px, kitobdan ko'chirmaslik) xatosiz o'tgach — lokal serverni ishga tushirib (`python3 -m http.server 8765`), foydalanuvchiga mavzu va test havolalarini (`http://localhost:8765/mavzu.html?sinf=…&fan=matematika&mavzu=…`, `test.html?…`) va qisqa hisobotni ko'rsating; foydalanuvchi «tasdiqlayman / yukla» desagina `main` ga push qiling. Tekshiruv o'tmasa — ko'rsatishdan oldin tuzating.
2. **Oxirgi tahrirdan keyin** sintaksis tekshiruvi: `for f in js/*.js maruza/*.js; do node --check $f; done`. `lessons/*.html` dagi bir qatorli skriptlarga `//` izoh yozilmaydi (qatorning qolgani o'chib, sahifa ishlamay qoladi) — faqat `/* */`.
3. **Kitob matni/rasmi aynan ko'chirilmaydi.** Qoida mazmuni va atamalari aniq, so'zlari o'zimizniki; misollar — o'z sonlarimiz; rasmlar — `maruza/chizma.js` chizgan SVG. Saytda kitob nomi va betlari yozilmaydi.
4. **Kitob PDF'lari hech qachon commit qilinmaydi** — ular faqat `_kitob/` papkasida (`.gitignore` da).
5. **Bir vaqtda bitta mavzu.** Yozish → tekshirish → foydalanuvchiga ko'rsatish → keyingisi.
6. `lessons/` (simulyatorlar) ga **tegilmaydi** — ma'ruzalar bosqichi tugaguncha. `mathrunner-web/` (1–4-sinf) ga faqat foydalanuvchi so'raganda tegiladi. **2026-10-24: 1–4-sinf ishlari TO'XTATILDI** — keyinroq boshidan darslik bo'yicha qilinadi (avval mavzular, keyin testlar, interaktiv darslar); hozir faqat yuqori sinflar (5–11). Kamchiliklar: arqon tortish telefonda, ba'zi savollar yechimni matnda aytadi, 5 testda takror savol, 3 842 savolda yechim yo'q (2026-10-22: testlar yuqori sinf dizayniga o'tkazildi, o'yinlar 20 topshiriqli — `mathrunner-web/CLAUDE.md` oxirgi bo'lim). **2026-10-30 dan istisno: «Fikrlash o'yinlari» (1–4-sinf o'yinlari) foydalanuvchi so'rovi bilan qayta qurilmoqda** — pastdagi «O'yinlar» bo'limi.
7. `js/data.js` dagi `review: true` / `review: "sariq"` (qizil/sariq nuqta) faqat foydalanuvchi «tayyor» desa olib tashlanadi.
8. Ichki nomlar o'zgartirilmaydi: localStorage kaliti `mathrun-progress-v1`, postMessage turi `mathrun:height`, `mathrunner-web/` papkasi.
9. **Ma'ruza ichi o'zi aylanmaydi (foydalanuvchi qarori, 2026-10-20):** ma'ruza iframe ichida ochilganda sahifa aylanmaydi, faqat tashqi sahifa aylanadi (telefonda surish silliq bo'lishi uchun). Bu `js/main.js` dagi `scrolling="no"` va `maruza/maruza.js` dagi `overflow:hidden` orqali barcha ma'ruzalarga avtomatik ishlaydi — yangi mavzuda yangi `maruza/5-*.html` da `maruza.js` ulangan bo'lsa yetarli. Bu ikki joyni o'chirmang.

## Ish jurnali (foydalanuvchi qarori, 2026-10-24)
Loyihada **ikki kishi, ikki hisob** navbatma-navbat ishlaydi. **Sessiya boshida `_reja/ish-jurnali.md` ni o'qing** — oxirgi kim, qayerga kelgani shu yerda.
- Har 6 ta tugagan mavzudan keyin va sessiya tugayotganda (yoki «to'xta» deyilganda) jurnalga yangi yozuv (eng tepaga): sana va vaqt, hisob, nima qilindi, nima chala, navbatdagi ish; «Hozir qayerdamiz» va «n / 6» hisobini yangilang.
- **Kunlik ish — admin panelda (foydalanuvchi qarori, 2026-10-27; 2026-10-28 dan: HAR BIR PUSHda):** har bir push oldidan (shu push bilan birga) `js/kunlik.js` dagi `KUNLIK` ro'yxatiga bugungi kun qo'shiladi yoki to'ldiriladi (eng tepaga): `sana`, `qisqa` (bir gap), `ishlar: [["bo'lim", "nima qilindi"]]` — bo'lim: 5-sinf, 6-sinf, 7-sinf, 8-sinf, 1–4-sinf, Interaktiv, Sayt, Admin, Ish tartibi. Sodda o'zbekcha, texnik so'zsiz, mavzu raqami va nomi bilan. O'zgarganda `admin.html` da `kunlik.js?v=` +1. Admin panel → «Kunlik ish» (#kunlik).
- Jonli checkbox-reja (ISH-REJASI.md) 2026-10-24 da foydalanuvchi so'rovi bilan olib tashlandi (ortiqcha token) — foydalanuvchiga ish oxirida qisqa umumiy hisobot yetarli; o'zingiz uchun sodda reja yetarli.

## Ma'ruza hajmi — kitobdagidek, ixcham (foydalanuvchi qarori, 2026-10-24)
Foydalanuvchi: «ma'ruza qismi juda ko'p, qoidalar ko'payib ketyapti, qo'shimcha qoidalar murakkablashib ketyapti — kitobdagi mavzularga o'xshasin, lekin kitobdan ko'chirilganga o'xshamasin (mualliflik huquqi)». Shuning uchun (12-mavzudan boshlab):
- **Eslab qolinadigan narsa — ko'pi bilan 3–4 ta** (o'quvchi bitta mavzudan 2–3 narsani eslab qoladi; loyiha mutaxassislar uchun emas, o'quvchilar uchun — ko'riboq tushunadigan darajada sodda).
- **Qoidalar — faqat darslikning o'zi shu mavzuda o'rgatgan qoida/usullar** (3–4 ta), o'z so'zimiz bilan. O'zimizdan qo'shimcha qoida o'ylab topilmaydi, bitta g'oya bir nechta qoidaga bo'linmaydi; xususiy holat — namuna yoki «Diqqat» bandi.
- **Ixcham:** Eslab olaylik 2–4 band; har qoida — qisqa ramka + bitta namuna; Namunalar 2–3; Diqqat 3–5; Mashqlar ≈ 4 oson + 4 o'rta + 3 qiyin; Matnli masalalar 4–6; O'ylab ko'ring 1–2; O'zingizni tekshiring 3–5. Har kitob misol turi bir marta — ko'p variant shart emas.
- **Asosiy maqsad — o'quvchi mavzuni o'zi mustaqil o'qib tugata olsin** (iqtidorli ham, past o'zlashtiruvchi ham). «Ustoz, sodda tushuntirib bering» — shu talab. Tushuntirish yo'li, tartibi va modellari uchun **kitobga tayaning** (kitob shuning uchun berilgan); qisqa sodda gaplar, kundalik so'zlar, bitta ramkada bitta g'oya, ko'p harfli umumiy formulalar faqat kitobda bo'lsa; avval oson misol, keyin qoida. Kitob mavzusida yo'q narsa kiritilmaydi. Qisqaroq — yaxshiroq. Test: oson — past o'zlashtiruvchi ham yecha oladi, qiyin — kuchlilar uchun.
- Mazmun va tartib kitob mavzusiga o'xshasin, lekin so'zlar, sonlar, ismlar, vaziyatlar va gap qoliplari o'zimizniki (mualliflik huquqi). Test 20+20 va saviyali bo'lib qoladi.

## Yangi ma'ruza tuzilishi — 5 qism (foydalanuvchi qarori, 2026-10-24; sinov: 6-sinf 13–14-mavzular, yoqsa — qolganlari ham)
- **Qoida va ta'riflar — kitobdan aynan olinadi** (foydalanuvchi: «kitobda yaxshi yozilgan»). Bu 3-qoidaning istisnosi: faqat qoida/ta'rif matni. Misollar, masalalar, sonlar, ismlar, vaziyatlar va rasmlar — avvalgidek o'zimizniki (kitobdan.py tekshiruvi qoladi).
- **Sahifa 5 qismga aniq ajratiladi** (har qism katta sarlavha bilan):
  1. **Mavzu** — qoida/ta'rif/formula → darhol unga mos **2 ta misol, ikki xil turda** (`<div class="misol-juft">` — keng ekranda yonma-yon). Personajlar (qiz Madina, boyo'g'li ustoz, bola Aziz) — mazmunli qisqa gaplar bilan. Hajmi **2–3 bet, ko'pi bilan 4** (A4 bosma bet).
  2. **Misollar ishlash** — 2–3 namuna, bosqichma-bosqich, sodda (har qadam — bitta harakat va sababi).
  3. **Mustahkamlash** — mashqlar (osondan qiyinga).
  4. **Mustaqil ish** — o'quvchi o'zi yechadigan topshiriqlar.
  5. **Javoblar** — 3 va 4-qism javoblari (qisqa yechim bilan), alohida qismda.
- **Sahifada ichki reja/izoh so'zlari bo'lmaydi (foydalanuvchi, 2026-10-24):** qism sarlavhasi faqat «1-qism · Mavzu» kabi; ostiga «Qoidalar va har biriga bitta misol», «Osondan qiyinga» kabi tushuntirish yozilmaydi — bu sun'iy intellekt rejasi bo'lib ko'rinadi. O'quvchiga faqat mazmun ko'rinsin.
- **2026-10-25: 6-sinf 1–14 shu tuzilishga o'tkazildi — yangi mavzular ham shunday.** Kitobda qoida matni bo'lmasa (faqat ishlangan misol) — qoida gapi o'ylab topilmaydi, ramka «Usul · …» deb belgilanib, kitob qadamlari bizning sonlarda sxema qilib beriladi. Pufaklar ko'pi bilan 4 ta, har xil, 3/4/5-qism sarlavhasi ostida emas; «Men avval … qilaman», «Javobingiz boshqacha chiqdimi?», keyingi bo'limni e'lon qiluvchi gaplar yo'q. Mashq/test talab qiladigan har usul 1–2-qismda ko'rsatilgan bo'lsin. Test ma'ruza bilan birga moslanadi (ma'ruzada yo'q usul, ma'ruza nusxasi, kitob qolipi — almashtiriladi). Tekshiruv: Jumavoy + Ibrohim ustoz (bitta agent); **«Anti sun'iylik»** (sun'iy ko'rinadigan gaplar) vazifasi ham Ibrohim ustozda — alohida agent yo'q (foydalanuvchi, 2026-10-25, token tejash).
- **Mavzu va Misollar ishlash vazifasi (foydalanuvchi, 2026-10-25):** 1-qism «Mavzu» umumiy bo'ladi — tushuntirish, qoidalar va shu qoidalarga oid misollar. Darslikning tushuntirish qismida («Qarang va o'rganing» va h.k.) ko'rsatilgan misollar Mavzu qismida qoladi, chiqarib tashlanmaydi (sonlari o'zimizniki). Darslikda mustaqil ishlash uchun berilgan misollar (mashqlar, mashq daftari) Mavzu qismiga kirmaydi — ularning turlari 2-qism «Misollar ishlash»da yechish jarayonida tushuntiriladi — lekin u ham ko'p bo'lmaydi: kerakli usullar, misol yoki shart o'zgarsa nima o'zgarishi va nima qilish kerakligi ko'rsatiladi.
- **Mashqlar qisqartirilmaydi (foydalanuvchi, 2026-10-25):** ixchamlik faqat tushuntirish qismiga (qoidalar, bayon, pufaklar) tegishli. Mustahkamlash, Mustaqil ish, ishlangan misollar va matnli masalalar soni kamaytirilmaydi; kitob soni/qolipi bo'lsa — o'chirilmaydi, o'zimizniki bilan almashtiriladi. 5-sinf 13-mavzudan boshlab mavzular qayta yozilmaydi: bitta agent tekshirib, joyida tuzatadi.
- **Ikki tekshiruvchi (rol):** tayyor sahifani avval **Jumavoy** (past o'zlashtiruvchi 6-sinf o'quvchisi — qayerda tushunmaydi, qayerda qotib qoladi) tekshiradi, keyin **Ibrohim ustoz** (20 yillik tajribali matematika o'qituvchisi — to'g'rilik, soddalik, ketma-ketlik, kitobga mosligi). Ularning izohlari tuzatiladi, hisobotda qisqa aytiladi.

## Yengil ish tartibi — token va vaqtni tejash (foydalanuvchi qarori, 2026-10-24)
Foydalanuvchi: «ko'p token ishlatma, ishni soddaroq qil, bitta mavzuga ko'p vaqt sarflama». 10–11-mavzularda bir mavzu ~1 soat va 0,5–1 mln token ketdi (4 tekshiruvchi × 2 bosqich) — bu ortiqcha. Endi har mavzu:
1. **Bitta yozuvchi** (oddiy mavzuda Sonnet): kitob matnini o'qiydi (rasm faqat kerakli 2–3 bet), ma'ruza + 20+20 test yozadi — boshidanoq `_reja/CLAUDE-ish-tartibi.md` 0-bo'lim 9–11 qoidalariga amal qilib (kitob qolipi ko'chirilmaydi). Yangi chizma turi faqat juda zarur bo'lsa; mavjudlari bilan ishlash afzal.
2. **Avtomatik tekshiruvlar** (yozuvchi o'zi): tenglik.py, kitobdan.py, testlar.js, node --check, 390/1100 px ning avtomatik o'lchovi (scrollWidth, KaTeX, chizmalar) — skrinshotlar faqat yangi/o'zgargan chizmalarga.
3. **Bitta tekshiruvchi** (hisob + kitobga o'xshashlik + til birga, qisqa hisobot). Ikkinchi tekshiruv bosqichi YO'Q — faqat jiddiy xato tuzatilgandan keyin avtomatik tekshiruvlar qayta.
4. Ulash, versiyalar, push — asosiy sessiya. Barcha ma'ruzalarni qayta ko'rish faqat chizma.js/maruza.css o'zgarganda (avtomatik, skrinshotsiz).
**Lekin sifat birinchi (foydalanuvchi, 2026-10-24): «tokenni tejash uchun ish sifatsiz bo'lmasin; testlar ham saviyali bo'lsin; kerak bo'lganda token va yaxshi modellarni ishlat».** Ya'ni:
- Tejaladigan narsa — takroriy ish (4 parallel tekshiruvchi, ikkinchi bosqich, ortiqcha skrinshot). Tejalmaydigan narsa — hisobni Python bilan tekshirish, bitta javoblilik, kitob qolipini ko'chirmaslik, 390/1100 tekshiruvi, mustaqil tekshiruvchi.
- **Model:** qiyin mavzu, yangi chizma turi, murakkab test yoki tekshiruvchi jiddiy xato topgan bo'lsa — Opus; oddiy mavzu — Sonnet. Jiddiy xato (noto'g'ri javob, ko'chirma) topilsa — tuzatilgach o'sha joylar qayta tekshiriladi.
- **Testlar saviyali:** qiyin test haqiqatan ko'nikma talab qilsin (ikki-uch qadamli, tipik xatoga tuzoq), oson test esa tushunishni tekshirsin; javob shartdan darhol ko'rinmasin; savollar ma'ruza mashqlari nusxasi bo'lmasin.

## Ishlash qoidalari (foydalanuvchi bilan kelishilgan, 2026-10-18)
- **Shox — har doim `main` ga (foydalanuvchi qarori, 2026-10-18):** sessiya qaysi shoxda ochilgan bo'lsa ham (masalan `claude/...`), tayyor ish **`main` ga** yuklanadi — sayt shundan chiqadi. Tartib:
  1. **Sessiya boshida:** `git fetch origin` va `git branch -r` — boshqa shoxlarda `main` ga qo'shilmagan mavzu bormi (`git log --oneline origin/main..origin/<shox>`)? Bo'lsa — foydalanuvchiga ayting va uni `main` ga birlashtiring (ikkala tomondagi ish saqlanadi; `?v=` versiyalar kattasidan +1). Keyin ishni eng so'nggi `main` ustida boshlang.
  2. **Mavzu tayyor, tekshirilgan va foydalanuvchi tasdiqlagach** (2026-10-25 dan): `git push origin HEAD:main` (o'z shoxingizga ham push qilsa bo'ladi). Push oldidan `git fetch origin main`; `main` oldinga ketgan bo'lsa — avval birlashtiring, qayta tekshiring, keyin push.
  3. Boshqa sessiya «main ga kompyuterdagi sessiya qo'shadi» deb kutmasin — endi har sessiya o'zi `main` ga qo'shadi.
- **Kitobdan ko'chirma taassuroti bo'lmasin:** kitobdagi aynan bir xil ifoda, son-juftlik, ism va vaziyatlarni o'zimizniki bilan almashtiring. Qoida mazmuni va atamalari — aniq, so'zlari — o'zimizniki.
- **Birinchi o'rinda — sifat, ikkinchisida — token.** Maqsad: ish sifati tushmasin va foydalanuvchining haftalik/oylik limiti kechagidek tez tugab qolmasin (ko'proq mavzu ishlansin). Sifat tushadigan bo'lsa, tejash qoidalarini buzish mumkin: ko'proq o'qing, qayta yozing, qayta tekshiring.
  - **Hech qachon qisqartirilmaydi:** tenglik.py, javoblarni Python bilan hisoblash, masala bir javobli ekanini tekshirish, 390/1100 px ko'rish tekshiruvi, kitobdan ko'chirmaslik.
  - **Kitobdan ko'chirma:** kitob bilan aynan mos tushgan son, ifoda, ism va vaziyatlar **albatta** almashtiriladi (`python3 _reja/tools/kitobdan.py` bilan toping, butun kitobni qayta o'qimang). Mos kelmagan misollarga tegmang. Chizmalar: biroz o'zgartirish yetarli bo'lsa — shuni qiling, sifati past chizmani qaytadan yasang.
  - **Kuchliroq model (Opus):** modelni o'zingiz almashtira olmaysiz. Qiyin mavzuda (masalan 18–20: yangi chizma turi, murakkab hisob) yoki Sonnet takror xato qilsa, foydalanuvchiga «bu mavzuga /model bilan Opus kerak» deb ayting va sababini bir gapda yozing. Oddiy mavzularda Sonnet.
  - **Chegara:** bir mavzu uchun o'rtacha ish hajmidan (bir sessiyada 1–2 mavzu) sezilarli oshib ketsangiz — to'xtab, foydalanuvchiga ayting va so'rang; bir ma'ruzani ikki martadan ortiq butunlay qayta yozmang.
- **Tejash (sessiya):** bir sessiyada bitta-ikkita mavzu; keyingisini yangi sessiyada boshlang. Kitob PDF'ini va rasmlarni faqat kerakli betlar bo'yicha o'qing. Barcha ma'ruzalarni qayta tekshirish faqat `chizma.js`/`maruza.css` o'zgarganda kerak. Oddiy ish uchun Sonnet yetarli.
- **Kitoblar:** PDF'lar GitHub'da yo'q — yangi sessiyada foydalanuvchi qayta yuklaydi. Ba'zan faqat bir bo'lagi keladi (masalan D1 135–171, M1 165–202 betlari): unda `kitob.py` ishlamaydi — PDF'ni pymupdf bilan to'g'ridan-to'g'ri o'qing (indeks = kitob beti − bo'lakning birinchi beti; D1 bo'lagi skaner, matni chala — kerakli betlarni rasm qilib ko'ring). Mashq daftarlari (M1, M2) hali berilmagan — reja ro'yxatlari bilan ishlang va hisobotda ayting.
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
| Testlar | `js/quizzes.js` → `QUIZ_DATA`; test dvigateli — `js/quiz-core.js` (umumiy, 1–4-sinf ham), `js/quiz-engine.js` (5–11 adapteri) |

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
5. **Mavzuning o'z testi — 2 ta test, har biri 20 savol (foydalanuvchi qarori, 2026-10-21):** `js/quizzes.js` da kalit `"5|matematika|<topic id>"`, qiymat `{ oson: [20 savol], qiyin: [20 savol] }`. **1-test (oson)** — mavzu tushunilganini tekshiradi; **2-test (qiyinroq)** — ko'nikma hosil qiladi. Har savol: `question`, `options` (aniq 4 ta), `answer` (`options` dan biri bilan aynan bir xil), `explain` — yechim (o'z so'zimiz, 1–3 gap, qadamlari bilan). Test sahifasida 20 savol bitta sahifada chiqadi (dizayn — `css/test.css`, `js/quiz-engine.js`: yuqorida suzib yuruvchi panel «Belgilandi n/20» + sariq «Testni yakunlash», 2×2 javoblar, «Saqlash»; natijada doira, To'g'ri/Xato/Vaqt, «Sizning javobingiz / To'g'ri javob», «Yechimni ko'rish»). **Formulalar KaTeX bilan:** matndagi `3/8`, `2 3/5`, `a/40`, `2^3` o'zi kasr/daraja bo'lib chiqadi; murakkab ifodani `\( ... \)` ichida yozing (JS satrida ikki marta: `"\\(\\frac{a+b}{2}\\)"`). Savolga chizma kerak bo'lsa — `rasm: '<svg…>'`. Eski 10 savollik ro'yxat (massiv) ham ishlaydi — u «1-test» bo'lib chiqadi; mavzuga qaytilganda 20+20 ga o'tkaziladi. Savollar bir javobli ekanini va javoblarni Python bilan tekshiring. **Majburiy tekshiruv (har test yozilgach):** `NODE_PATH=<scratchpad>/node_modules node _reja/tools/testlar.js` (oldin scratchpad'da `npm i katex@0.16.11`) — tuzilish (20+20, 4 ta har xil javob, answer, yechim), har bir kasr/daraja formulaga to'liq aylanganini (chala «?/10», «x^2» — XATO) va har formula KaTeX'da chizilishini tekshiradi; 0 xato bo'lmaguncha push qilinmaydi. Kasrning surati yoki maxraji son emas bo'lsa ham (`?/10`, `□/7`, `a/40`, `(7 · 5)/(20 · 5)`) o'zi formulaga aylanadi; boshqa murakkab ifodalar — `\( ... \)` ichida.
6. **Ulash** — `js/data.js` da mavzuga `lecture: { text: null, embedUrl: "maruza/5-<id>.html" }` va `test: "test.html?sinf=5&fan=matematika&mavzu=<id>"`; `LESSON_VER` +1; barcha `*.html` da `data.js?v=` +1; `test.html` da `quizzes.js?v=` +1. `chizma.js`/`maruza.css` o'zgarsa — barcha `maruza/5-*.html` da `?v=` +1.
7. **Kitob bilan qayta solishtirish** — har qoida va har misol turi sahifada bormi; natija rejaga va hisobotga.
8. **Ko'rish tekshiruvi** — imkon bo'lsa brauzerda (Playwright/Chromium) telefon 390 px va kompyuter 1100 px: `scrollWidth` = ekran kengligi, KaTeX yuklangan, xato yo'q, rasmlar o'qiladi. Imkon bo'lmasa — foydalanuvchiga telefonda ochib ko'rishni so'rash.
9. **Rejada belgilash** — `☐` → `✅`, sana, «Kitob bilan solishtirildi», «Tekshiruv», «Simulyator uchun g'oyalar».
10. Tekshiruvlar xatosiz bo'lsa — foydalanuvchiga lokal havolalar va qisqa hisobot ko'rsatiladi; tasdiqlagach `main` ga push (2026-10-25 dan).

## Holat (2026-10-18)
5-sinf, 47 mavzu. Saytda (main ga qo'shilgan, 2026-10-18):

| Mavzu | Ma'ruza | O'z testi |
|---|---|---|
| 1. Ko'p xonali sonlar | ✅ | ✅ 20+20 (2026-10-23) |
| 2. 10, 100, 1000 ga ko'paytirish va bo'lish | ✅ | ✅ 20+20 (2026-10-23) |
| 3. O'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish | ✅ | ✅ 20+20 |
| 4. Amallarni bajarish tartibi | ✅ | ✅ 20+20 |
| 5. Bo'lishni kasr ko'rinishida ifodalash | ✅ | ✅ 20+20 |
| 6. Oddiy kasrni o'nli kasrga aylantirish | ✅ | ✅ **20+20 (yangi format, namuna)** 2026-10-21 |
| 7. Aralash sonlarni qo'shish va ayirish | ✅ | ✅ 20+20 |
| 8. Kasrni natural songa ko'paytirish | ✅ | ✅ 20+20 |
| 9. Kasrni kasrga ko'paytirish | ✅ | ✅ 20+20 |
| 10. Aralash sonni natural songa ko'paytirish | ✅ | ✅ 20+20 |
| 11. Qolgan qismning qismi + matnli masalalar | ✅ | ✅ 20+20 |
| 12. Uchburchakning asosi va balandligi | ✅ | ✅ 20+20 (chizmali) |
| 13. Uchburchakning yuzini topish | ✅ | ✅ 20+20 (chizmali) |
| 14. To'g'ri to'rtburchak va uchburchaklardan tuzilgan shakllarning yuzi | ✅ | ✅ 20+20 (chizmali) |
| 15. Fazoviy jismlarning hajmi | ✅ | ✅ 20+20 (chizmali) |
| 16. Uch o'lchamli panjarada fazoviy jismlarni chizish | ✅ | ✅ 20+20 (chizmali) |
| 17. Jismning turli ko'rinishlari (old, yon, ust) | ✅ | ✅ 20+20 (chizmali) |
| 18. Hajmni cm³ va m³ da o'lchash | ✅ | ✅ 20+20 (chizmali) |
| 19.1. Kuboid hajmi | ✅ | ✅ 20+20 (chizmali) |
| 19.2. Kub hajmi | ✅ | ✅ 20+20 (chizmali) |
| 20. Suyuqlik hajmi | ✅ | ✅ 20+20 (chizmali) |
| 21. Nisbat tushunchasi | ✅ | ✅ 20+20 |
| 22. Teng kuchli nisbatlar | ✅ | ✅ 20+20 |
| 23. Miqdor va nisbatga ko'ra boshqa miqdorni topish | ✅ | ✅ 20+20 |
| 24. Jami miqdor va nisbatga ko'ra qismlarni topish | ✅ | ✅ 20+20 |
| 25. Uchta miqdorning nisbati | ✅ | ✅ 20+20 |
| 26. O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish | ✅ (D2 bilan solishtirildi) | ✅ 20+20 |
| 27. O'nli kasrni o'nlik, yuzlik, mingliklarga ko'paytirish va bo'lish | ✅ | ✅ 20+20 |
| 28. O'lchov birliklarini almashtirish + matnli masalalar | ✅ | ✅ 20+20 |
| 29. Me'yorni topish | ✅ | ✅ 20+20 |
| 30. Me'yorga ko'ra umumiy miqdorni topish | ✅ | ✅ 20+20 |
| 31. Birliklar sonini topish + matnli masalalar | ✅ | ✅ 20+20 |
| 32. Foiz tushunchasi | ✅ | ✅ 20+20 |
| 33. Oddiy kasr, o'nli kasr va foiz orasidagi bog'lanish | ✅ | ✅ 20+20 |
| 34. Miqdorning foizi + matnli masalalar | ✅ | ✅ 20+20 |
| 35. QQS, chegirma va omonat foizi | ✅ | ✅ 20+20 |
| 36. O'rtacha qiymat tushunchasi | ✅ | ✅ 20+20 |
| 37. O'rtacha qiymat, jami qiymat va son orasidagi bog'lanish | ✅ | ✅ 20+20 |
| 38. To'g'ri chiziqdagi burchaklar | ✅ | ✅ 20+20 (chizmali) |
| 39. Vertikal burchaklar | ✅ | ✅ 20+20 (chizmali) |
| 40. Nuqta atrofidagi burchaklar | ✅ | ✅ 20+20 (chizmali) |
| 41. Noma'lum burchaklarni topish | ✅ | ✅ 20+20 (chizmali) |
| 42. Uchburchakning turlari | ✅ | ✅ 20+20 (chizmali) |
| 43. Uchburchaklarni chizish | ✅ | ✅ 20+20 (chizmali) |
| 44. Uchburchakning burchaklari (yig'indisi 180°) | ✅ | ✅ 20+20 (chizmali) |
| 45. Parallelogramm, romb va trapetsiyaning xossalari | ✅ | ✅ 20+20 (chizmali) |
| 46. To'rtburchaklarni chizish | ✅ | ✅ 20+20 (chizmali) |
| 47. To'rtburchakning noma'lum burchaklarini topish | ✅ | ✅ 20+20 (chizmali) |

**5-sinf ma'ruzalari tugadi (47/47, 2026-10-23).** **Barcha 47 mavzuda o'z testi 20+20 (2026-10-24).** Qolgan ishlar: simulyatorlar (foydalanuvchi qaroriga ko'ra). 12-bob «Uchburchaklar» (42–44) 2026-10-23 da tugadi. 11-bob «Burchaklar» (38–41) 2026-10-23 da tugadi. **Geometriya testlarida chizmali savollar bo'lsin (foydalanuvchi talabi 2026-10-23):** savolga `rasm: '<svg…>'`; burchaklar uchun `_reja/tools/burchak_svg.py` (`nurlar(...)`), uchburchak/to'rtburchak uchun `_reja/tools/shakl_svg.py` (`shakl(...)`, ma'ruzadagi `data-shakl` bilan bir xil), test blokini Python bilan yasash qulay. 10-bob «O'rtacha qiymat» (36–37) 2026-10-23 da tugadi. 9-bob «Foizlar» (32–35) 2026-10-23 da tugadi. **Kitoblar kompyuterda bor:** `~/Desktop/maktab darsliklari/` (to'liq D1, D2, M1, M2) — `python3 _reja/kitob.py N` o'zi topadi (bulut sessiyasida yo'q — u yerda foydalanuvchi yuklaydi). 23–25-mavzular darslik D1 155–172 bilan solishtirilgan; 26-mavzu D2 bilan qayta solishtirildi (2026-10-24); mashq daftarlari M1 hali berilmagan. 8–15-mavzular 2026-10-18 da kompyuterdagi sessiya tekshirib, main ga qo'shdi. Yangi ishni avval boshqa shoxlarni tekshirib (yuqoridagi «Shox» qoidasi), eng so'nggi `main` ustida boshla; tayyor ish `main` ga push qilinadi. Alohida vazifa: barcha mavzularga 20+20 testlar (yangi format, yuqoridagi 5-qadam); avval 1, 2-mavzular (o'z testi umuman yo'q). **Namuna — 6-mavzu** (`5|matematika|oddiy-kasrni-onli-kasrga` quizzes.js da): savollar va qadamma-qadam yechimlar (`explain`, qadamlar `<br>` bilan, javob `<b>` bilan) shunday yoziladi.

## 6-sinf (2026-10-24 dan)
Reja: `_reja/6-sinf-maruza-reja.md` (31 mavzu, betlar bilan). Betlar: `python3 _reja/kitob.py 6:N`. Ish tartibi 5-sinfdagidek; ma'ruza `maruza/6-<id>.html`, test kaliti `"6|matematika|<id>"` (20+20). **6-sinf 31/31 TUGADI (2026-10-28)** — hammasi 5 qismli, 20+20 test, PDF; 17–31 bitta yozuvchi + bitta mustaqil tekshiruvchi, ikki-uch mavzu parallel. Yangi chizmalar: `data-doirayuz`, `data-yol`, `data-spidometr`, `data-harakat`, `data-kuboid`, `data-diagramma`, `data-jism`, `data-izo`, `data-yoyilma` (sintaksisi — chizma.js boshida). Foydalanuvchi: 2 tadan mavzu, chizmalar va testlar mukammal, keyin to'xtash. Chizmalar: `data-model` (algebra chizmali modeli), `data-plitka` (algebraik plitkalar), `data-tarozi` (pallali tarozi), `data-ulush` (kasrni n kishiga bo'lish, doira), `data-sigim="3:2/5"` / `"3/4:1/6"` (bo'luvchi necha marta sig'adi — tasmada guruhlar, chala guruh kasri); `data-model` ga "qavs", "ong", "chiziq" (8-mavzu); `data-birlash="Sariq:3,Yashil:4|Yashil:5,Qizil:2"` (ikki nisbatni uch hadli nisbatga birlashtirish, 9-mavzu); `data-shakl` ga "ranglar"; `data-ozgar="A:2|B:3 > A:4|B:9" data-tur="bir|jami|farq|teng"` (o'zgaruvchan nisbat, oldin–keyin; Python: `_reja/tools/ozgar_svg.py`); `data-foizyol="30:60" [data-orqali] [data-tasma="1"] [data-yoz="?"|"??"]` yoki `"3/8:57"` (foiz zinasi — qismdan butunni topish; Python: `_reja/tools/foizyol_svg.py`). `data-aylana='{"nuqta":{"A":90},"markaz":"O","kesma":[["O","A","#d6454f","5 cm"]]}'` (doira/aylana: markaz, radius, diametr, "tur" yarim/chorak/aylana, "ichki" kvadrat, "doiralar", "ramka", "olchov", "izoh" — 14-mavzu; test rasmlari `chizma_svg.py` bilan). Ikonkalar: 6-sinf 31/31, 7-sinf 79/79 tayyor (2026-10-25; «Icon dizayner» agenti kesadi va tekshiradi, foydalanuvchi GPT varaqlarini alohida xabar qilib tashlaydi — ish paytida tashlangan rasm faylga tushmaydi). Testlarda mavzuga mos 1–6 ta chizmali savol (foydalanuvchi talabi).

## 8–11-sinf mavzu ro'yxatlari (2026-10-29)
Foydalanuvchi yuborgan darslik mundarijalari bo'yicha `js/data.js` ga qo'yildi (eski umumiy nomlar o'rniga): 8-sinf algebra 31 (§1–31; tayyor «Sonning moduli» — 17), geometriya 37; 9-sinf algebra 38, geometriya 35 («O'xshash uchburchaklar» — 2); 10-sinf algebra va analiz asoslari 29 (trigonometriya interaktiv darsi — 23), geometriya 17; 11-sinf algebra 24 (1–2-qism, «2-qism, N-bet»), geometriya 12. Takrorlash, amaliy mashq, nazorat ishi, test, loyiha, «Masalalar yechish» darslari alohida mavzu qilinmadi; ko'p soatli darslar — bitta mavzu, saytda ketma-ket raqam. Rejalar: `_reja/{8,9,10,11}-sinf-{algebra,geometriya}-reja.md`, betlar: `_reja/mavzular{8,8g,9,9g,10,10g,11,11g}.json`. Boblar admin panelda — `js/admin.js` `CHAPTERS`. **Kitob PDF'lari hali yo'q** — ma'ruzalar PDF kelgach.

## O'yinlar — «Fikrlash o'yinlari» qayta qurilmoqda (foydalanuvchi qarori, 2026-10-30)
To'liq qoidalar va har o'yin tafsiloti — **`mathrunner-web/CLAUDE.md`** oxirgi bo'lim; GPT rasm promptlari — `mathrunner-web/design/oyin-rasmlar.md`. Qisqacha:
- **Maqsad:** o'yin o'yinligicha qoladi (dars emas), lekin o'sha turdagi misollarni tushunish va yechishni osonlashtiradi. Ko'rinish — Brilliant.org darajasida; har o'yin o'z «dunyosi»da (koinot, o'rmon, g'or, zavod…), oddiy uzuq chiziqlar emas — «narsa»ga o'xshasin.
- **Har o'yin alohida**, bittadan: qurish → brauzerda to'liq o'ynab tekshirish → foydalanuvchiga rasm (telefon/kompyuter) → «yukla» desa `main` ga. Bank javoblari Python bilan tekshiriladi.
- **Umumiy:** yuraklar, ochko, kombo, «⚡ Tez!», ovoz (zamonaviy ikonka), o'yin personaji **Robi** (kosmik robot; ma'ruzadagi Madina/Aziz/ustoz emas) — har javobdan keyin darhol to'g'ri/xato va **bir qatorli sabab**. O'yinga kirishdan oldin sinf va mavzu tanlanadi (`#/games/<tur>`). Rasmlarni foydalanuvchi GPT'da yasaydi; kelguncha kod chizadi (`js/games/rasmlar.js`). **Keyinroq musiqa** qo'shiladi.
- **Tayyor va saytda (2026-10-30):** 1) To'plamlar — koinot: sayyoralarning tortishish maydonlari, sonlar — meteoritlar; 2) Tartiblash — o'rmondagi bekat va bug' poyezdi, kasrlar bilan (4-sinf 43-mavzu; 46-mavzuga yangi o'yin: «Maxrajlari bir xil» / «Suratlari bir xil»); 3) Jadval — xazina g'ori, qulf-tenglamalar, xatoda amal hadlari qoidasi; 4) Saralash — robot zavodi, quvur-eshikli konveyer, parallelepiped karton quti, «Ha»/«Yo'q» bunkerlari.
- **Navbatda:** Tarozi, Xona tarkibi, Yoyilma, Ulush tasmasi, Koordinata, Harakat, Transportir, Simmetriya; Arqon tortish telefonda.
- Foydalanuvchining aniq talablari (o'zgartirilmaydi): vagonlar biz tomondan ochiq, kasrlar hamma joyda ustunli (slash emas), kasrda doira-bo'lak yo'q, bekat tabiiy, konveyer chetlarida temir havo quvuriga o'xshash qora eshiklar, buyum — haqiqiy parallelepiped, misol uning ustida.

## A4 varaqlar va PDF (2026-10-26)
- **Ma'ruza:** `<body data-a4>` (`maruza/maruza.js` → `a4()`, `maruza/maruza.css`): kompyuterda (≥ 826 px) raqamlangan oq A4 varaqlar, telefonda oddiy. Hozircha 6-sinf 15, 16-mavzularda; yangi 6-sinf mavzular ham shunday. `misol-juft` varaqlar orasida bo'linmaydi; ichida keng jadval bo'lsa — `misol-ustun` (ustma-ust) ishlating, aks holda PDF'da kesiladi.
- **PDF — oldindan yasalgan fayllar** (foydalanuvchi qarori: chop etish oynasi emas, fayl brauzerning PDF oynasida ochilsin, yuklab olinganda mavzu nomi bilan saqlansin): `pdf/<sinf>-sinf <Mavzu nomi>.pdf`, testlar `... 1-test.pdf` / `... 2-test.pdf`, ro'yxat `pdf/royxat.json`. Tugmalar («PDF yuklab olish», «1-test — PDF», «2-test — PDF») faylni yangi oynada ochadi; fayl bo'lmasa — eski chop etish usuli.
- **Varaqlarni zich to'ldirish (foydalanuvchi, 2026-10-26):** avval yuqoridagi varaqlar to'ldiriladi — sig'masa blok 80% gacha kichraytiriladi (`kichrayt`), bo'linadigan quti/ro'yxat varaqda joy ko'p bo'lsa bo'linadi, shundan keyingina keyingi varaqqa o'tiladi; personaj pufagi varaq pastida qolishi mumkin. «5-qism · Javoblar» yangi varaqdan.
- **Yasash (mavzu yoki test o'zgarsa — push oldidan majburiy):** `python3 _reja/tools/pdf_yasash.py` (hammasi) yoki `python3 _reja/tools/pdf_yasash.py 6-<id>` / `"test:6|matematika|<id>"`. O'zgarmagan fayl qayta yozilmaydi.
- Push oldidan foydalanuvchiga localhost:8765 havolalari beriladi (brauzerni o'zimiz ochmaymiz — foydalanuvchi qarori).

## Firebase (2026-10-21)
Loyiha `mathlearn-bd240`, kalitlar `js/firebase-config.js` da, admin — `ADMIN_EMAIL`. Faqat Email/Password kirish. `admin.html` faqat admin kirganda ochiladi (`guardAdminPage` — `js/auth.js`). Admin kirishi: `login.html` yoki ☰ → «Muallif uchun kirish» (menyu pastida, kichik). Chap menyu: O'rganish (Bosh sahifa, Sinflar, Interaktiv darslar, Fikrlash o'yinlari) + Mathlearn haqida; Sozlamalar menyudan olingan (sahifa bo'sh). Yuqoridagi «Kirish» tugmasi — o'quvchilar **Google bilan** kiradi (`js/auth.js`: kirish oynasi, ism + menyu). Kirganda `mathrun-progress-v1` (yutuqlar) va `mathlearn-natijalar-v1` (o'quvchining o'z test natijalari, `saveLocalResult` — `js/natija.js`) Firestore `users/<uid>` bilan birlashtiriladi (REST, kutubxonasiz). «Mening natijalarim» — `mening.html`, `js/mening.js` (kirmasa ham shu qurilmadagilar ko'rinadi). Telegram orqali kirish — keyinroq (server tekshiruvi kerak, Blaze tarifi).
- **Admin panel** (`admin.html`, `js/admin.js`, `css/admin.css`): «Bugungi ish» (navbatdagi mavzu, `review` mavzular, o'z testi yo'qlar, izohlar), boblar bo'yicha jadval (5-sinf boblari — `CHAPTERS` admin.js da), filtr/qidiruv, mavzu yon oynasi. Yangi bob/mavzu qo'shilsa jadval o'zi yangilanadi.
- **Firestore** (qoidalar — `firestore.rules`, Console'ga qo'lda qo'yiladi): `izohlar` — foydalanuvchining mavzular bo'yicha izohlari (admin panelda «Claude uchun nusxalash» → sessiyaga joylaydi); `natijalar` — testni tugatgan o'quvchining nomsiz javoblari (`js/natija.js`, test.html). Savollar o'zgarsa eski natijalar imzo (`quizHash`) bo'yicha ajratiladi. `xabarlar` — mavzu sahifasi pastidagi «Kamchilik topdingizmi?» (`js/xabar.js`, `css/xabar.css`): har kim yozadi (bo'lim, matn, ism), admin panelda izohlar bilan birga chiqadi va «Claude uchun nusxalash» ga qo'shiladi. Foydalanuvchi shu ro'yxatni joylasa — har bir kamchilikni tekshirib tuzating.

## Chizmalar (`maruza/chizma.js`, HTML'da `data-*` atribut)
`data-xk` (kasrni ×k), `data-ld` (burchak usulida bo'lish), `data-kataklar`, `data-sonoqi`, `data-xona`, `data-tugma`, `data-oq`, `data-siljish`, `data-zanjir="43/x2/x10"`, `data-nollar="63000/700"`, `data-tartib="80 - 5 * (6 + 4) : 2"` (amallar tartibi raqamlari + qadamlar), `data-tasma="Otasi:3|Qizi:1" data-farq="..."` (chizmali model), `data-pitsa="3/5" [data-usul="butun"]`, `data-doira="2 3/4" [data-rang]`, `data-qism="14/5/7" [data-yozuv="ko'k"] [data-izoh="0"]` (sonning qismi: n ta narsa b ta guruhga, a tasi bo'yalgan; n > 40 — tasma; izoh="0" — hisobsiz, mashq uchun), `data-yuza="1/4/2/3"` (a/b ning c/d qismi — to'g'ri to'rtburchakda bo'yash va shtrixlash; a > b bo'lsa bir nechta butun), `data-qolgan="1/6/2/5" [data-yozuv="1/6|Qolgan qism|?"]` (tasma: a/b qism bo'yalgan, qolganning c/d qismi belgilangan). `data-kub="3x2x2" | "3,2,1|3,2,1"` [data-yozuv="bo'yi|eni|balandligi"] [data-rang] [data-ajrat="1"] [data-son="1"] [data-olcham] (birlik kubchalardan izometrik jism: kuboid "b x e x h" yoki ustundagi kubchalar soni, qatorlar "|" bilan; ajrat — qatlamlar ajratiladi, son — ustdan ko'rinish). `data-ikki="km/m/1000/0/3/0.5" [data-nuqta="A:1500,B:2500"]` (ikki shkalali son o'qi: yuqorida katta birlik, pastda kichik; nuqtalar kichik birlikda, faqat harf). `data-meyor="6 min|1170 tugma" [data-yoz="?"]` (me'yor sxemasi: k birlik → jami, 1 birlik → jami : k), `data-meyor="1 soat|16 000 so'm" data-kop="8"` (teskari sxema ×k), `data-vaqt="09:30|12:00" [data-bosh="60"] [data-qadam="30"]` (vaqt chizig'i), `data-uchburchak="Jami miqdor|Me'yor|Birliklar soni"` (uch miqdor sxemasi), `data-grafik="1:12,2:24,3:36" data-x data-y [data-xmax] [data-ymax] [data-yqadam] [data-xqadam] [data-bosh="30"] [data-nom]` (chiziqli grafik; bosh — 0 dan boshlanmasa tik o'qdagi boshlang'ich qiymat), `data-idish="40x25x30" [data-suv="18"] [data-yozuv="bo'yi|eni|balandligi|suv sathi|bo'sh qism"]` (suvli shisha idish), `data-menzurka="600/1000"` (o'lchov idishi). `data-foiz="60" [data-pastki="hammasi"] [data-sor="20,40"] [data-mayda="1"] [data-belgi="1"]` (foiz tasmasi 0%–100% va o'nli kasrlar). `data-foizbar="Qizlar:55|O'g'il bolalar:45" [data-jami="600 o'quvchi"] [data-qiymat="?|"]` (foizli tasma modeli: bo'laklar, foizlari, qiymatlari; yig'indi 100 dan oshsa — masalan QQS 112% — tasma cho'ziladi). `data-chek="Kurtka:420000|Shim:180000" [data-chegirma="10"] [data-qqs="12"] [data-nom]` (xarid cheki — jami, chegirma, QQS, to'lanadi o'zi hisoblanadi). `data-likop="4,9,5" [data-nom]` (likopchalarda teng taqsimlash — o'rtacha qiymat). `data-ustunli` ga `[data-ortacha="290"] [data-qiymat="1"]` (o'rtacha chizig'i, ustun qiymatlari). `data-nurlar='{"nur":{"A":180,"B":0,"C":55},"yoy":[["B","C","55°"]],"markaz":"O","transportir":1}'` (bir nuqtadan chiqqan nurlar: yo'nalish gradusda, yoylar yozuv bilan, "90°" — kvadratcha, "_1" — nomsiz nur, transportir). `data-kataklar` ga `[data-ranglar="ko'k:24,sariq:31"] [data-joylash="ustun|aralash"]` (ko'p rangli to'r). `data-buyum="Doiralar:doira:ko'k:6|Kvadratlar:kvadrat:sariq:4" [data-guruh="2"] [data-olcham]` (nisbat uchun buyumlar qatori: shakl doira/kvadrat/uchburchak/romb/yulduz; guruh — punktir ramkali guruhlar), `data-kataklar` ga `[data-ustun="6"]`. `data-geo='{"katak":[7,5],"nuqta":{"M":[0,0],"N":[7,0],"P":[3,5]},"shakl":["MNP"],"asos":"MN","bal":["P","MN","D"],"uzun":{"MN":"7 cm"}}'` (geometriya: katakli fon, uchlar, ko'pburchaklar, qizil asos, balandlik — asosi avtomatik topiladi, davomi punktir, to'g'ri burchak belgisi; "kesma":[["P","Q","tik","R"]], "tik":["C"], "ramka":["ABCD"] (punktir mos to'rtburchak), "oq":["DEC"] (kesib olingan oq qism), "uzun":{"MH-":"..."} (yozuv narigi tomonda), "yashir", "olcham" — to'liq ro'yxat chizma.js boshida). `data-shakl` ga bir nechta uchburchak: "shakllar":["ABC","ACD"], "yoy":[["B","A","C","40°",rang,radius]], "tik":["BAC"], "diag":[["C","D","togri"]], "joy":{"A":[dx,dy]}, "par":{"AB":1,"DC":1} (parallel strelkalar). Matnda «∥» o'rniga KaTeX `\\(AB \\parallel DC\\)`. `data-yasash='{"tur":"bb","nom":["B","C","A"],"asos":5,"burchak":[50,45],"qadam":2}'` (uchburchakni qadamma-qadam chizish: bb — tomon va 2 burchak, tbt — 2 tomon va orasidagi burchak ("burchak":60,"tomon":5), tik — uchburchakli chizg'ich; "xomaki":1 — qo'lda chizilgandek; to'rtburchak: "tur":"pg" — parallelogramm/romb (asos, tomon, burchak) yoki "tr" — trapetsiya (asos, tomon, "burchak":[chap, o'ng]), nom 4 ta). `data-oraliq='{"yech":"(-∞;-1]U[3;+∞)","masofa":[[0,-2,"|−2|"]],"nuqta":[[7,"x₁"]],"qatlam":["(-∞;5)"],"yozuv":{"3":"a"},"eni":300}'` (son o'qi — modul va tengsizliklar, 8-sinf: yechimlar to'plami oraliq yozuvida, kvadrat qavs — bo'yalgan nuqta, nur — strelka; masofa strelkalari, nuqtalar, sistema qatlamlari; test rasmi uchun `"eni":300` va `chizma_svg.py`). `data-hayot='{"tur":"termometr|havo|lift|km|ombor|qop", ...,"ifoda":"|t − 36,6| ≤ 0,5"}'` (hayotiy rasm — modul va |x − a| ≤ d kundalik hayotda: tibbiy/ko'cha termometri, lift qavatlari, km ustunlari, dori ombori, un qoplari; yashil — ruxsat etilgan, qizil — tashqari, pastida formula lavhasi; parametrlar chizma.js boshida; 8-sinf «Sonning moduli» mavzusida). Yangi tur kerak bo'lsa — shu faylga qo'shing (boshqa mavzularda ham ishlaydi) va fayl boshidagi ro'yxatga yozing.

## Tez-tez uchragan xatolar (oldini oling)
- **Kitob masalasining qolipi** (vaziyat + gap tuzilishi + savol) son/ism almashtirilib qoldirilsa ham ko'chirma hisoblanadi — vaziyatni o'zgartiring (`_reja/CLAUDE-ish-tartibi.md` 0-bo'lim 9–11). Har mavzuda mustaqil «kitob» tekshiruvchisi bilan qattiq solishtiring.
- Chizmali modelda bo'laklar soni haqiqiy miqdorga mos kelmasa — chizmani qo'ymang.
- Masala sharti bir nechta javobga mos kelmasin (brute-force bilan tekshiring).
- Telefonda uzun qatorlar: `.misollar.qator` (bir ustun), «Diqqat» qatorlari o'zi bo'linadi.
- «·» belgisini misollar orasida ajratuvchi qilib ishlatmang (ko'paytirish bilan adashadi).
