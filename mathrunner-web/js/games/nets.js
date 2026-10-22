// Fazoviy jismlarning yoyilmalari (SVG) — «Yoyilma» o'yini uchun.
const FILL = 'fill="#eef0ff" stroke="#1e2a78" stroke-width="2" stroke-linejoin="round"';
const rect = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${FILL} ${extra}/>`;
const poly = (pts) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${FILL}/>`;
const circ = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${FILL}/>`;

const NETS = {
  // 6 ta teng kvadrat: «xoch» shakli
  cube: () => {
    const c = 36, x0 = 30, y0 = 6, out = [];
    [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]].forEach(([i, j]) => out.push(rect(x0 + i * c, y0 + j * c, c, c)));
    return out.join('');
  },
  // 6 ta to'g'ri to'rtburchak: to'rtta yon yoq lenta bo'lib, ust va past yoqlar ularga yopishgan
  cuboid: () => {
    const x0 = 14, y0 = 6, w = [50, 32, 50, 32], hTop = 34, hMid = 46, out = [];
    out.push(rect(x0, y0, w[0], hTop), rect(x0, y0 + hTop + hMid, w[0], hTop));
    let x = x0;
    w.forEach(wi => { out.push(rect(x, y0 + hTop, wi, hMid)); x += wi; });
    return out.join('');
  },
  // kvadrat asos va to'rtta uchburchak
  squarePyramid: () => {
    const s = 44, cx = 90, cy = 75, h = 40, a = s / 2;
    return [
      rect(cx - a, cy - a, s, s),
      poly([[cx - a, cy - a], [cx + a, cy - a], [cx, cy - a - h]]),
      poly([[cx - a, cy + a], [cx + a, cy + a], [cx, cy + a + h]]),
      poly([[cx - a, cy - a], [cx - a, cy + a], [cx - a - h, cy]]),
      poly([[cx + a, cy - a], [cx + a, cy + a], [cx + a + h, cy]]),
    ].join('');
  },
  // uchta to'rtburchak lenta + ikkita uchburchak asos
  triangularPrism: () => {
    const w = 40, h = 56, x0 = 30, y0 = 46, t = 36, out = [];
    for (let i = 0; i < 3; i++) out.push(rect(x0 + i * w, y0, w, h));
    out.push(poly([[x0 + w, y0], [x0 + 2 * w, y0], [x0 + 1.5 * w, y0 - t]]));
    out.push(poly([[x0 + w, y0 + h], [x0 + 2 * w, y0 + h], [x0 + 1.5 * w, y0 + h + t]]));
    return out.join('');
  },
  // yon sirt — to'g'ri to'rtburchak, ikkita teng doira asos
  cylinder: () => [
    rect(24, 56, 132, 46),
    circ(56, 38, 18), circ(124, 120, 18),
  ].join(''),
  // yon sirt — doira sektori, asos — kichik doira (sektor yoyiga tegib turadi)
  cone: () => {
    const R = 56, r = 20, cx = 70, cy = 60, rad = (d) => d * Math.PI / 180;
    const pt = (d, rr) => [(cx + rr * Math.cos(rad(d))).toFixed(1), (cy + rr * Math.sin(rad(d))).toFixed(1)];
    const [x1, y1] = pt(-60, R), [x2, y2] = pt(180, R), [bx, by] = pt(60, R + r);
    return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 1 1 ${x2} ${y2} Z" ${FILL}/>` + circ(bx, by, r);
  },
};

export function netSVG(kind) {
  const draw = NETS[kind];
  if (!draw) return '';
  return `<svg viewBox="0 0 190 150" class="nf-svg" role="img" aria-label="Yoyilma">${draw()}</svg>`;
}
