/** Star polygon {n/step} outline, e.g. {8/3} for a classic eight-point star. */
export const starPolygon = (
  cx: number,
  cy: number,
  r: number,
  n: number,
  step: number,
  rotation = -Math.PI / 2,
) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = rotation + ((i * step) % n) * ((2 * Math.PI) / n);
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)} `;
  }
  return `${d}Z`;
};

/** Filled star with alternating outer/inner radius. */
export const starburst = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
  rotation = -Math.PI / 2,
) => {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rotation + (i * Math.PI) / points;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)} `;
  }
  return `${d}Z`;
};

export const diamond = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y}Z`;

/**
 * Right half of a rectangle with concave (scalloped) corners, starting at the
 * top centre and ending at the bottom centre. Mirror it for the left half.
 */
export const scallopedHalf = (
  cx: number,
  x2: number,
  y1: number,
  y2: number,
  r: number,
) =>
  `M${cx} ${y1} H${x2 - r} A${r} ${r} 0 0 0 ${x2} ${y1 + r} V${y2 - r} A${r} ${r} 0 0 0 ${x2 - r} ${y2} H${cx}`;
