# MathRun — interaktiv matematika sayti

Brilliant.org uslubida, matematikani interaktiv illyustratsiya va o'yinlar orqali o'rgatuvchi sayt.

## Tuzilishi

```
index.html          Bosh sahifa — sinflar ro'yxati
sinf.html           Bitta sinfning fan bo'limlari va mavzulari (?sinf=9)
mavzu.html          Bitta mavzu: ma'ruza + interaktiv ko'rgazma + test (?sinf=9&fan=algebra&mavzu=...)
korgazmalar.html    Barcha tayyor interaktiv ko'rgazmalar galereyasi
css/style.css       Umumiy dizayn
js/data.js          SAYTNING BUTUN MAZMUNI shu yerda — sinflar, fanlar, mavzular
js/quizzes.js       Har bir mavzu uchun 10 tadan interaktiv test savoli
js/main.js          Sahifalarni data.js asosida chizib beruvchi kod
js/quiz-engine.js   Interaktiv test (quiz) mantig'i — test.html shu bilan ishlaydi
js/layout.js        Sayt header va chapdan chiquvchi menyuni chizadi (barcha sahifalarda umumiy)
js/auth.js          Firebase login holatini kuzatish, menyuni shunga moslash
js/firebase-config.js  Firebase loyihangiz sozlamalari (o'zingiz to'ldirasiz)
test.html           Interaktiv test sahifasi (?sinf=5&fan=matematika&mavzu=...)
login.html          Kirish sahifasi
admin.html          Faqat admin uchun panel
lessons/            Claude Code'da yasalgan mustaqil interaktiv HTML darslar
```

Build qadam (npm, framework) yo'q — `index.html`ni to'g'ridan-to'g'ri brauzerda ochish kifoya.

## Yangi mavzu qanday qo'shiladi

1. `js/data.js` faylini oching.
2. Kerakli sinf → fan bo'limining `topics` ro'yxatiga yangi obyekt qo'shing:

```js
{
  id: "yangi-mavzu",
  title: "Mavzu nomi",
  lecture: { text: "Qisqacha tushuntirish matni.", embedUrl: null },
  interactive: null,
  test: null
}
```

Shu qadamning o'zi kifoya — yangi sahifa yaratish shart emas, `mavzu.html` avtomatik shu ma'lumot asosida ko'rsatadi.

## Interaktiv ko'rgazma yoki test qanday qo'shiladi

1. Claude Code'da mavzuga mos **mustaqil, bitta HTML fayl** yasang (masalan `lessons/9-geometriya-vektorlar.html`) — fayl o'zi ichida barcha CSS/JS'ni saqlashi kerak, tashqi faylga bog'liq bo'lmasin.
2. Faylni `lessons/` papkasiga joylashtiring.
3. `js/data.js`dagi tegishli mavzuda `interactive` (yoki `test`) maydoniga fayl yo'lini yozing:

```js
interactive: "lessons/9-geometriya-vektorlar.html"
```

Saqlangach, mavzu sahifasida ko'rgazma avtomatik `<iframe>` ichida ko'rinadi va "Interaktiv darslar" galereyasiga ham qo'shiladi.

## Ma'ruza/prezentatsiya qanday qo'shiladi

- Oddiy matn: `lecture.text` maydoniga yozing.
- Tashqi prezentatsiya (masalan Google Slides "embed" linki): `lecture.embedUrl` maydoniga qo'ying — matn o'rniga shu ko'rsatiladi.

## Diqqat

`js/data.js`dagi mavzular ro'yxati — boshlang'ich qoralama (standart maktab dasturi asosida). Ularni o'zingiz o'tayotgan darslikning aniq mavzu nomlariga moslab tahrirlashingiz kerak bo'ladi.

## Interaktiv test qanday qo'shiladi

1. `js/quizzes.js` faylini oching.
2. `"sinf|fan|mavzuId"` formatidagi kalit bilan (masalan `"5|matematika|foizlar"`) 10 tagacha savol qo'shing:

```js
"5|matematika|yangi-mavzu": [
  { level: 1, question: "Savol matni?", options: ["variant1", "variant2", "variant3"], answer: "variant1" },
  ...
]
```

`answer` qiymati `options` ichidagi so'zlardan biri bilan AYNAN bir xil bo'lishi kerak. Variantlar tartibi sahifada avtomatik aralashtiriladi, harf (a, b, c) yozilmaydi — foydalanuvchi to'g'ridan-to'g'ri javob matniga bosadi.

3. `js/data.js`dagi tegishli mavzuning `test` maydoniga havolani yozing:

```js
test: "test.html?sinf=5&fan=matematika&mavzu=yangi-mavzu"
```

## Firebase sozlash (Kirish / Admin panel uchun)

Hamburger menyudagi "Kirish" va "Admin panel" ishlashi uchun Firebase Authentication kerak. Buni faqat siz (admin) uchun bir marta sozlaysiz:

1. [Firebase Console](https://console.firebase.google.com)ga kiring, **"Add project"** orqali yangi loyiha yarating (bepul "Spark" tarifi yetarli).
2. Loyiha ichida **Build → Authentication → Get started** bosing, **"Email/Password"** usulini yoqing.
3. Xuddi shu bo'limda **"Users" → "Add user"** orqali o'zingiz uchun bitta hisob yarating (o'z email va parolingiz bilan) — shu admin hisobingiz bo'ladi.
4. Loyiha sozlamalariga o'ting (⚙️ belgisi → **Project settings**), pastga tushib **"Your apps"** bo'limida **"</>"** (Web) belgisini bosib ilova qo'shing.
5. Sizga ko'rsatiladigan `firebaseConfig` obyektidagi qiymatlarni `js/firebase-config.js` fayliga ko'chiring.
6. Xuddi shu faylda `ADMIN_EMAIL` qiymatini 3-qadamda yaratgan email bilan almashtiring.

Shu qadamlardan so'ng saytni qayta yuklang — hamburger menyudan o'sha email/parol bilan kirsangiz, "Admin panel" havolasi ko'rinadi. Boshqa hech kim (parolni bilmasa) admin panelga kira olmaydi.

**Diqqat:** hozircha admin panel faqat kontent holatini ko'rsatadi (qaysi mavzuda ma'ruza/ko'rgazma/test tayyorligini). Haqiqiy "brauzerdan fayl yuklash" funksiyasi hali yo'q — buning uchun keyingi bosqichda Firebase Storage/Firestore qo'shish kerak bo'ladi. Hozircha kontent avvalgidek `js/data.js`, `js/quizzes.js` va `lessons/` papkasi orqali qo'shiladi.

## Joylashtirish (hosting)

Build kerak emas — GitHub Pages yoki Netlify'ga papkani shunchaki yuklash yetarli.
