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

## 3. «Tartiblash» o'yini — o'rmon va poyezd

**3.1 Orqa fon** (`orman-fon.png`):
> A bright cheerful cartoon forest landscape for a children's game: light blue sky with a few fluffy clouds and a soft
> sun in the top-right, rolling green hills, a row of rounded pine trees in the middle, green grass at the bottom with a
> straight railway track running left-to-right along the very bottom. Upper half calm and simple (game panels go there).
> Soft 3D cartoon style, no text. Portrait 1080×1600.

**3.2 Lokomotiv** (`lokomotiv.png`):
> A cute small red cartoon steam locomotive facing LEFT, side view, round chimney with a little white smoke puff,
> yellow details, big friendly wheels. Soft 3D cartoon style, transparent background, no text. 1024×768.

**3.3 Vagon** (`vagon.png`):
> A simple open cartoon train wagon (flatcar with low sides), side view, blue, two yellow wheels, empty, front plate
> area plain so a number can be written on it. Soft 3D cartoon style, transparent background, no text. 768×512.

**3.4 Yuk qutisi** (`quti.png`):
> A single wooden cargo crate, front view, light warm wood planks with darker frame, plain front face so a number can
> be written on it. Soft 3D cartoon style, transparent background, no text. 512×512.

---

## 4. «Jadval» o'yini — xazina g'ori

**4.1 Orqa fon** (`gor-fon.png`):
> A cozy cartoon treasure cave / old stone dungeon wall for a children's game: grey-purple stone bricks, two burning
> wall torches on the left and right sides with warm orange glow, a few small crystals in the corners. The center must
> stay calm and fairly empty (game panels go there). Soft 3D cartoon style, warm lighting, no text. Portrait 1080×1600.

**4.2 Xazina sandig'i — yopiq** (`sandiq-yopiq.png`) va **ochiq** (`sandiq-ochiq.png`):
> A cute cartoon wooden treasure chest with golden metal bands, front view, CLOSED. Soft 3D cartoon style,
> transparent background, no text. 768×640.
> (Ikkinchi rasm:) The same chest, OPEN, lid up, glowing gold coins and a few colorful gems inside, warm light coming out.

**4.3 Qulf** (`qulf-yopiq.png`, `qulf-ochiq.png`): a small golden padlock, front view, closed / the same padlock open
(shackle up) and turned green-gold. Transparent background, no text. 256×256.

---

## 5. «Saralash» o'yini — robot zavodi

**5.1 Orqa fon** (`zavod-fon.png`):
> A friendly cartoon robot factory interior for a children's game: blue-grey metal wall panels with rivets, a few pipes
> and big slowly turning gears near the top corners, soft cool lighting, a bit of warm light from lamps. The center must
> stay calm and simple (a conveyor belt will be placed there). Soft 3D cartoon style, no text. Portrait 1080×1600.

**5.2 Bunkerlar** (`bunker-ha.png`, `bunker-yoq.png`):
> A cartoon factory sorting bin / hopper with an open top, front view: one GREEN with a big white check mark sign
> (no letters), and the same bin RED with a big white X sign (no letters). Soft 3D cartoon style, transparent background,
> no text. 768×512 each.

---

## 6. Tarozi — sehrli bozor
**6.1 Fon** (`tarozi-bozor.png`):
> A magical oriental bazaar at dusk, seen from behind a wooden market counter: blue tiled domes and a slim minaret
> in the distance, a purple-orange evening sky with a crescent moon and a few stars, a red-and-cream striped awning
> at the top edge, a string of glowing colorful lanterns. The center must stay calm and simple (a brass balance scale
> will be placed there). Soft 3D cartoon style, no text, no people. Portrait 1080×1600.

**6.2 Kristallar** (`kristall-<shakl>.png` — uchburchak, doira, kvadrat, yulduz, oltiburchak):
> A single shiny magical gem crystal in the shape of a [triangle / round orb / square / five-point star / hexagon],
> [yellow / green / blue / orange / violet], faceted, softly glowing, front view. Soft 3D cartoon style,
> transparent background, no text. 512×512.

## 7. Xona tarkibi — shirinliklar fabrikasi
**7.1 Fon** (`xona-fabrika.png`):
> A cheerful candy factory interior: pastel pink striped walls, peppermint-striped pipes along the sides, a big purple
> gumball-style candy machine with a glass dome full of colorful candies, a wooden delivery cart. The center must stay
> calm and simple (a cardboard box will be placed there). Soft 3D cartoon style, no text. Portrait 1080×1600.

**7.2 Buyumlar** (`konfet.png`, `rulon.png`, `lagan.png`, `sovga-quti.png`):
> One red-and-white peppermint candy; a clear tube with exactly 10 peppermint candies stacked in one column (gold caps);
> a flat tray with exactly 10×10 small candies; a purple gift box with a yellow ribbon. Soft 3D cartoon style,
> transparent background, no text. 512×512 each.

## Keyingi o'yinlar uchun dunyolar (rejada)
- Yoyilma — origami ustaxonasi
- Koordinata — xazina oroli xaritasi
Har birining promptlari o'sha o'yinga o'tganda yoziladi. **Musiqa** ham keyinroq qo'shiladi.
