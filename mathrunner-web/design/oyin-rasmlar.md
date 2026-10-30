# O'yin rasmlari — GPT uchun promptlar

Rasmlarni ChatGPT'da (rasm yasash) yasang va yuklab oling. Fayl nomini shu yerdagidek qilib Claude'ga yuboring —
u `assets/oyin/` papkasiga qo'yadi va `js/games/rasmlar.js` da ulaydi. Rasm kelguncha o'yin o'zi chizgan
oddiy ko'rinishda ishlab turadi.

**Umumiy qoidalar (hamma rasmga):**
- Uslub bir xil bo'lsin: yumshoq 3D multfilm (Pixar / Duolingo / Brilliant ruhida), yorqin, bolalarbop.
- Personaj, sayyora va meteoritning **orqa foni shaffof** bo'lsin (PNG, transparent background).
- Rasm ichida **hech qanday yozuv, harf yoki raqam bo'lmasin** — sonlarni sayt o'zi yozadi.
- Bir xil personajning hamma holatlari bitta suhbatda, ketma-ket yasalsin (yuzi va ranglari o'zgarmasin).

---

## 1. O'yin personaji — «Robi» (barcha o'yinlarda)

Kichik, do'stona kosmik robot-sayohatchi. Koinotda ham, o'rmonda ham, boshqa dunyolarda ham mos keladi.
(Boshqa personaj xohlasangiz — masalan tulki-sayohatchi yoki kichik kosmonavt bola — shu promptdagi tasvirni almashtiring.)

**Prompt (1-rasm — oddiy holat):**
> A cute small friendly robot explorer mascot for a children's math game. Rounded white-and-lavender body, big glossy
> dark visor face with two glowing cyan eyes and a small smile, a little antenna with a pink light on top, short arms,
> tiny jetpack. Soft 3D cartoon style like Pixar or Duolingo, bright clean colors, soft studio lighting.
> Full body, front 3/4 view, standing, waving slightly. Transparent background, no text. Square 1024×1024.

Keyin shu suhbatda, **xuddi shu robotning** yana uchta holati:
- **2 — xursand** (`robi-xursand.png`): «Same robot, very happy: eyes are happy arcs, big smile, one arm raised in celebration, small sparkles around. Transparent background, no text.»
- **3 — tushuntiradi** (`robi-tushuntiradi.png`): «Same robot, kindly explaining: pointing to the side with one hand, eyes slightly worried but friendly, eyebrows (light lines) tilted. Transparent background, no text.»
- **4 — o'ylaydi** (`robi-oylaydi.png`): «Same robot, thinking: one hand on chin, eyes looking up, a small question-mark-shaped light (no letters) above the head. Transparent background, no text.»

Fayllar: `robi-oddiy.png`, `robi-xursand.png`, `robi-tushuntiradi.png`, `robi-oylaydi.png`.

---

## 2. «To'plamlar» o'yini — koinot

**2.1 Orqa fon** (`venn-koinot.png`):
> A beautiful deep-space background for a children's game: dark navy-to-violet sky full of tiny stars, soft pink and
> blue nebula clouds, a few distant small planets near the edges, gentle glow. The CENTER must stay calm and fairly
> empty (game elements will be placed there). Soft cartoon style, not too busy, no text. Portrait 1080×1600.

**2.2 Birinchi sayyora** (`sayyora-binafsha.png`):
> A small cute glowing violet-purple planet with soft swirl patterns and a light atmosphere glow, cartoon 3D style,
> centered, transparent background, no text. Square 512×512.

**2.3 Ikkinchi sayyora** (`sayyora-olovrang.png`):
> A small cute glowing orange planet with a thin golden ring around it (like Saturn), warm atmosphere glow, cartoon 3D
> style, centered, transparent background, no text. Square 512×512.

**2.4 Meteorit** (`meteorit.png`):
> A single round cartoon meteorite rock, brown-grey with a few craters, slightly warm orange glowing edge, top-down
> front view, centered, fills most of the image, flat lighting so white numbers can be written on top of it.
> Transparent background, no text, no numbers. Square 512×512.

---

## Keyingi o'yinlar uchun dunyolar (rejada)
- Tartiblash — o'rmon (sonli vagonlar, poyezd)
- Saralash — kosmik zavod konveyeri
- Tarozi — sehrli bozor / qal'a
- Yoyilma — origami ustaxonasi
- Koordinata — xazina oroli xaritasi
Har birining promptlari o'sha o'yinga o'tganda yoziladi. **Musiqa** ham keyinroq qo'shiladi.
