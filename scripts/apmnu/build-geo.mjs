// Land shapes for the APMNU maps from Natural Earth (public domain), projected
// equirectangularly into the same bounds GeoMap.tsx uses, simplified, and saved
// as SVG path strings in degree units. `node scripts/apmnu/build-geo.mjs`

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cacheDir = resolve(root, "node_modules/.cache/apmnu-geo");
const outPath = resolve(root, "src/apmnu/data/geo.json");

const SOURCES = {
  "10m": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
  "50m": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson",
};

/** Must match ID_BOUNDS / W_BOUNDS in src/apmnu/components/GeoMap.tsx. */
const MAPS = {
  indonesia: { source: "10m", bounds: { lonMin: 94, lonMax: 142, latMin: -11.5, latMax: 6.8 }, tolerance: 0.025, minArea: 0.004, margin: 2 },
  world: { source: "50m", bounds: { lonMin: 15, lonMax: 125, latMin: -18, latMax: 45 }, tolerance: 0.12, minArea: 0.08, margin: 4 },
};

const load = async (key) => {
  mkdirSync(cacheDir, { recursive: true });
  const file = resolve(cacheDir, `${key}.geojson`);
  if (!existsSync(file)) {
    console.log(`Downloading Natural Earth ${key}…`);
    const res = await fetch(SOURCES[key]);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${SOURCES[key]}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(readFileSync(file, "utf8"));
};

const sqSegDist = (p, a, b) => {
  let [x, y] = a;
  let dx = b[0] - x;
  let dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) [x, y] = b;
    else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
};

/** Iterative Douglas–Peucker. */
const simplify = (pts, tol) => {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  const sq = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = sqSegDist(pts[i], pts[a], pts[b]);
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > sq) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
};

const ringArea = (pts) => {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]);
  return Math.abs(a / 2);
};

const build = (geo, { bounds, tolerance, minArea, margin }) => {
  const inBox = (pts) => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [x, y] of pts) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return maxX >= bounds.lonMin - margin && minX <= bounds.lonMax + margin && maxY >= bounds.latMin - margin && minY <= bounds.latMax + margin;
  };

  const countries = [];
  for (const f of geo.features) {
    const iso = f.properties.ADM0_A3;
    const name = f.properties.NAME;
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [];
    let d = "";
    for (const poly of polys) {
      poly.forEach((ring, k) => {
        if (!inBox(ring) || (k === 0 && ringArea(ring) < minArea)) return;
        const pts = simplify(ring, tolerance);
        if (pts.length < 4) return;
        d += pts
          .map(([lon, lat], i) => `${i === 0 ? "M" : "L"}${(lon - bounds.lonMin).toFixed(3).replace(/\.?0+$/, "")} ${(bounds.latMax - lat).toFixed(3).replace(/\.?0+$/, "")}`)
          .join("");
        d += "Z";
      });
    }
    if (d) countries.push({ iso, name, d });
  }
  return { bounds, countries };
};

const out = {};
for (const [key, cfg] of Object.entries(MAPS)) {
  out[key] = build(await load(cfg.source), cfg);
  console.log(`${key}: ${out[key].countries.map((c) => c.iso).join(" ")}`);
}
writeFileSync(outPath, `${JSON.stringify(out)}\n`);
console.log(`Wrote ${outPath} (${(readFileSync(outPath).length / 1024).toFixed(0)} KB)`);
