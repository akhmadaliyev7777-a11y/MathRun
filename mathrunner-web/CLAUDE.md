# mathrunner-web loyihasi — ishlash qoidalari

## Foydalanuvchi haqida
Foydalanuvchi fundamental dasturlashni bilmaydi, faqat prompt orqali ishlaydi. Shuning uchun:
- Texnik tushuntirishlarni sodda, kundalik tilda ber (jargon ishlatma yoki darrov izohla).
- Kodni ko'rsatib "o'zi tushunib oladi" deb hisoblama — nima o'zgarganini oddiy so'zlar bilan ayt.

## Ish tartibi
1. **Kichik qadamlar bilan bor.** Katta so'rovni (masalan "butun o'yinni qayta yoz") bir nechta kichik, mustaqil bosqichlarga bo'lib taklif qil.
2. **Har bir o'zgarishni sinab ko'r.** UI/frontend o'zgarishlarida kodni yozgandan keyin brauzerda ochib, asosiy va chekka holatlarni tekshir. Agar sinab bo'lmasa, buni ochiq ayt — "ishladi" deb da'vo qilma.
3. **Yaxshi natijadan keyin commit taklif qil.** Foydalanuvchi git tushunchalarini yaxshi bilmaydi — u uchun commit "saqlash nuqtasi" vazifasini bajaradi. Har safar biror narsa yaxshi ishlagach, "buni saqlab qo'yaymi (commit)?" deb so'ra.
4. **Faqat so'ralganda kengaytir.** Bitta bag-fix so'ralsa, atrofidagi kodni refaktor qilib yubormaslik kerak (umumiy qoida, lekin bu loyihada ayniqsa muhim — foydalanuvchi keraksiz o'zgarishlarni kuzata olmaydi).

## Loyiha haqida
- Bu — o'zbek tilidagi bolalar uchun matematik ta'lim o'yini (arqon tortish, va boshqa mini-o'yinlar).
- Matnlar, savollar bazasi va UI o'zbek tilida bo'lishi kerak.
- `assets/` papkasida rasm resurslari bor (masalan personajlar uchun PNG rasmlar).

## 1–4-sinf test va mashq formati (2026-10-22, foydalanuvchi qarori)
- **Test darajalari** (mavzuda 1–3 ta, har biri 10 savol) mavzular ro'yxatida «1-test», «2-test», «3-test» tugmasi. Bosilsa `#/test/<levelId>` — yuqori sinflardagidek bitta sahifa (`js/screens/quiz.js`, dizayn `../css/test.css`): «Belgilandi n/10» + «Testni yakunlash», natijada doira, To'g'ri/Xato/Vaqt, «Sizning javobingiz / To'g'ri javob», «Yechimni ko'rish». Darajasi aniq ajratilgan testlar bo'lsa — `js/topicTitles.js` dagi `TEST_DARAJA` ga `"<levelId>": "oson" | "qiyin"` yoziladi, tugma «Oson test» / «Qiyin test» bo'lib chiqadi (hozircha ajratilmagan).
- **Yechimlar:** `explain` maydoni bank faylida; hisoblab topiladigan savollarga (misol, taqqoslash — ~1200 ta) `python3 tools/add_explain.py` o'zi yozadi. Qolgan savollarda faqat to'g'ri javob ko'rsatiladi — yechim matnlari hali yo'q (keyingi ish).
- **O'yinlar** test formatiga ko'chirilmaydi; har o'yin darajasi 20 topshiriq = «1-mashq» + «2-mashq» (har biri 10). `#/play/<levelId>/<mashq>`. O'yin tepasida «N-mashq · Topshiriq i / 10» doim ko'rinadi. Banklarni 20 taga yetkazish: `python3 tools/gen_games.py` (asl topshiriqlar qoladi, yangilari `_x01…` id bilan; qayta ishlatish xavfsiz; `export_curriculum.py` banklarni qayta yozsa — shundan keyin ishga tushiring). Hamma 73 o'yin darajasi veb-da ishlaydi (kasr tasmasi, koordinata, harakat, transportir — `js/games/more.js`; yoyilma rasmlari — `js/games/nets.js`; umumiy qobiq — `js/games/shell.js`). Topshiriqning o'z ko'rsatmasi (`prompt`) o'yin tepasida o'zi almashadi. Venn taxtasi kenglikka qarab hisoblanadi (telefonda sig'adi).
- **Rasmli savollar:** bank savolida ixtiyoriy `rasm` (SVG) maydoni — test sahifasida savol yonida chiqadi. `python3 tools/add_rasm.py` rasmga tayanadigan savollarga rasm qo'shadi va «yuqoridagi…» deb boshlanadigan savollarni mustaqil qiladi (yangi shunday savol topilsa shu skriptga qo'shing).
- Ma'lumot fayllari o'zgarsa `js/util.js` dagi `DATA_VER` va `index.html` dagi `curriculum.json?v=` ni oshiring.
