# «Fikrlash o'yinlari» kartochkalari — GPT uchun promptlar

Har o'yin kartochkasi butunlay rasm bo'ladi (Arqon tortish kartochkasidek): rasm — o'yinning o'z «dunyosi», ustida pastda o'yin nomi va tavsifi.
Har promptda 4 ta rasm (2 × 2). Tayyor varaqni Claude'ga alohida xabar qilib yuboring — u kesadi va `assets/kartochka/` ga qo'yadi.

---

## 1-prompt — To'plamlar, Tartiblash, Xona tarkibi, Tarozi

```
Create ONE landscape image (1536×1024) split into a 2×2 grid of 4 equal scenes by thin light-gray dashed lines. Each scene is a separate illustration for a game card in a children's math website (ages 7–12). Keep each scene fully inside its own cell.

STYLE (same for all 4 scenes):
- Soft 3D cartoon style like Pixar / Duolingo / Brilliant, bright, friendly, rich colors, soft lighting, clean and not cluttered.
- Each scene fills its whole cell edge to edge (no white margins, no frames, no rounded corners).
- The main objects sit in the UPPER and MIDDLE part of the scene. The BOTTOM 35% of every scene is calm and simple (floor, ground, table top, or sky) and slightly darker — text will be placed over it.
- NO text, NO letters, NO numbers anywhere in the image.

SCENES:
1 (top-left) — "Sets": deep space with stars and soft violet nebula; two glowing cartoon planets (one violet, one orange) whose round transparent gravity fields overlap like two circles of a Venn diagram; a few small rocky meteorites with glowing tails fly toward the circles.
2 (top-right) — "Ordering": a cozy forest railway station: a small red steam locomotive with open wooden cargo wagons on the rails, tall pine trees, a wooden platform with wooden crates of different sizes lined up from smallest to largest, warm afternoon light.
3 (bottom-left) — "Place value": a candy factory: pink walls, mint-striped candy pipes, a purple candy machine with a glass dome full of candies; on a conveyor in front: a single mint candy, a clear roll of ten candies, a round tray of many candies and a wrapped gift box — growing in size from left to right.
4 (bottom-right) — "Balance scale": a magic market at dusk: blue domes and a minaret in the background, red-and-white striped awnings, glowing hanging lanterns; on a wooden counter a shiny copper balance scale in perfect balance, one pan holding glowing violet crystals, the other pan holding small iron weights.
```

---

## 2-prompt — Simmetriya, Yoyilma, Jadval, Saralash

```
Create ONE landscape image (1536×1024) split into a 2×2 grid of 4 equal scenes by thin light-gray dashed lines. Each scene is a separate illustration for a game card in a children's math website (ages 7–12). Keep each scene fully inside its own cell.

STYLE (same for all 4 scenes):
- Soft 3D cartoon style like Pixar / Duolingo / Brilliant, bright, friendly, rich colors, soft lighting, clean and not cluttered.
- Each scene fills its whole cell edge to edge (no white margins, no frames, no rounded corners).
- The main objects sit in the UPPER and MIDDLE part of the scene. The BOTTOM 35% of every scene is calm and simple (floor, ground, table top, water or sky) and slightly darker — text will be placed over it.
- NO text, NO letters, NO numbers anywhere in the image.

SCENES:
1 (top-left) — "Symmetry": a calm mountain lake at sunrise; snowy mountains and pine trees are perfectly mirrored in the still water; a large colorful butterfly with perfectly symmetrical wings sits on a reed at the water's edge.
2 (top-right) — "Nets of solids": an origami workshop on a warm wooden table: a green cutting mat, a pencil, a folded paper crane; in the center a colorful paper cube net (six squares in a cross shape) is folding itself up into a cube, the side flaps lifting in the air.
3 (bottom-left) — "Number grid": a treasure cave with rough stone walls and two burning torches; an old wooden treasure chest with iron bands and a big round padlock with a combination dial; a few gold coins glowing on the ground.
4 (bottom-right) — "Sorting": a friendly robot factory: metal walls, big turning gears and pipes; a conveyor belt carries small cardboard boxes; at the end of the belt two round bins, one glowing green with a check-mark symbol and one glowing red with a cross symbol.
```

---

## 3-prompt — Ulush tasmasi, Koordinata yo'li, Harakat, Transportir

```
Create ONE landscape image (1536×1024) split into a 2×2 grid of 4 equal scenes by thin light-gray dashed lines. Each scene is a separate illustration for a game card in a children's math website (ages 7–12). Keep each scene fully inside its own cell.

STYLE (same for all 4 scenes):
- Soft 3D cartoon style like Pixar / Duolingo / Brilliant, bright, friendly, rich colors, soft lighting, clean and not cluttered.
- Each scene fills its whole cell edge to edge (no white margins, no frames, no rounded corners).
- The main objects sit in the UPPER and MIDDLE part of the scene. The BOTTOM 35% of every scene is calm and simple (grass, ground, sand, road or sky) and slightly darker — text will be placed over it.
- NO text, NO letters, NO numbers anywhere in the image.

SCENES:
1 (top-left) — "Fraction strip": a sunny backyard with fluffy clouds and green grass; a wooden fence made of equal vertical planks, part of the planks freshly painted bright pink, the rest still plain wood; a paint bucket and a brush on the ground.
2 (top-right) — "Coordinate path": a small tropical island seen from above at an angle; on the sand a faint square grid of glowing dots; a dotted path jumps from dot to dot and ends at a red cross mark next to a small treasure chest; palm trees and turquoise water around.
3 (bottom-left) — "Motion": a winding country road through green hills; two cute cartoon cars (one blue, one orange) drive toward each other from opposite ends of the road, small speed lines behind them, a small town in the distance.
4 (bottom-right) — "Protractor": a hilltop at sunset; a giant transparent semicircular protractor stands on the hill like a rising sun; two golden light beams come out from its center forming an angle, with a glowing arc between them.
```
