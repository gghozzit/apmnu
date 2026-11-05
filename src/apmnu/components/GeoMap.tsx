import { interpolate, useCurrentFrame } from "remotion";
import geo from "../data/geo.json";
import { BRAND, FONT, clamp } from "../theme";

/* Maps on an equirectangular projection. Land shapes come from Natural Earth
   (scripts/apmnu/build-geo.mjs, paths in degree units); places are real coordinates. */

type LandData = { bounds: { lonMin: number; lonMax: number; latMin: number; latMax: number }; countries: { iso: string; name: string; d: string }[] };

/** Country outlines draw in, then fills fade up; `focus` countries are lit in brand colours. */
const Land: React.FC<{ readonly land: LandData; readonly scale: number; readonly width: number; readonly height: number; readonly start: number; readonly focus: string[]; readonly id: string; readonly fadeFrom?: number }> = ({
  land,
  scale,
  width,
  height,
  start,
  focus,
  id,
  fadeFrom = 0.72,
}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [start, start + 45], [1, 0], { ...clamp, easing: (t) => 1 - (1 - t) ** 2 });
  const fill = interpolate(frame, [start + 20, start + 55], [0, 1], clamp);
  return (
    <>
      <defs>
        {/* Feathered edge so neighbouring land fades out instead of being cut at the frame. */}
        <radialGradient id={`land-fade-${id}`} cx="50%" cy="50%" r="62%">
          <stop offset={fadeFrom} stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id={`land-mask-${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={`url(#land-fade-${id})`} />
        </mask>
        <linearGradient id={`land-focus-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C8A52" />
          <stop offset="1" stopColor="#0E6B3D" />
        </linearGradient>
      </defs>
      <g mask={`url(#land-mask-${id})`}>
        <g transform={`scale(${scale})`}>
          {land.countries.map((c) => {
            const lit = focus.includes(c.iso);
            return (
              <path
                key={c.iso}
                d={c.d}
                fill={lit ? `url(#land-focus-${id})` : "rgba(232,212,138,0.07)"}
                fillOpacity={fill}
                stroke={lit ? BRAND.accent : "rgba(232,212,138,0.28)"}
                strokeWidth={(lit ? 1.4 : 0.8) / scale}
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={draw}
              />
            );
          })}
        </g>
      </g>
    </>
  );
};

type Place = { id: string; name: string; lat: number; lon: number; group: string };

export const PROVINCES: Place[] = [
  { id: "aceh", name: "Banda Aceh", lat: 5.55, lon: 95.32, group: "sumatera" },
  { id: "sumut", name: "Medan", lat: 3.59, lon: 98.67, group: "sumatera" },
  { id: "sumbar", name: "Padang", lat: -0.95, lon: 100.35, group: "sumatera" },
  { id: "riau", name: "Pekanbaru", lat: 0.51, lon: 101.45, group: "sumatera" },
  { id: "kepri", name: "Tanjung Pinang", lat: 0.92, lon: 104.45, group: "sumatera" },
  { id: "jambi", name: "Jambi", lat: -1.61, lon: 103.61, group: "sumatera" },
  { id: "bengkulu", name: "Bengkulu", lat: -3.8, lon: 102.27, group: "sumatera" },
  { id: "sumsel", name: "Palembang", lat: -2.98, lon: 104.75, group: "sumatera" },
  { id: "babel", name: "Pangkal Pinang", lat: -2.13, lon: 106.11, group: "sumatera" },
  { id: "lampung", name: "Bandar Lampung", lat: -5.45, lon: 105.27, group: "sumatera" },
  { id: "banten", name: "Serang", lat: -6.12, lon: 106.15, group: "jawa" },
  { id: "jakarta", name: "Jakarta", lat: -6.2, lon: 106.85, group: "jawa" },
  { id: "jabar", name: "Bandung", lat: -6.92, lon: 107.61, group: "jawa" },
  { id: "jateng", name: "Semarang", lat: -6.97, lon: 110.42, group: "jawa" },
  { id: "diy", name: "Yogyakarta", lat: -7.8, lon: 110.36, group: "jawa" },
  { id: "jatim", name: "Surabaya", lat: -7.25, lon: 112.75, group: "jawa" },
  { id: "bali", name: "Denpasar", lat: -8.65, lon: 115.22, group: "nusa" },
  { id: "ntb", name: "Mataram", lat: -8.58, lon: 116.12, group: "nusa" },
  { id: "ntt", name: "Kupang", lat: -10.17, lon: 123.6, group: "nusa" },
  { id: "kalbar", name: "Pontianak", lat: -0.03, lon: 109.33, group: "kalimantan" },
  { id: "kalteng", name: "Palangka Raya", lat: -2.21, lon: 113.92, group: "kalimantan" },
  { id: "kalsel", name: "Banjarbaru", lat: -3.44, lon: 114.83, group: "kalimantan" },
  { id: "kaltim", name: "Samarinda", lat: -0.5, lon: 117.15, group: "kalimantan" },
  { id: "kaltara", name: "Tanjung Selor", lat: 2.84, lon: 117.37, group: "kalimantan" },
  { id: "sulut", name: "Manado", lat: 1.47, lon: 124.84, group: "sulawesi" },
  { id: "gorontalo", name: "Gorontalo", lat: 0.54, lon: 123.06, group: "sulawesi" },
  { id: "sulteng", name: "Palu", lat: -0.9, lon: 119.87, group: "sulawesi" },
  { id: "sulbar", name: "Mamuju", lat: -2.68, lon: 118.89, group: "sulawesi" },
  { id: "sulsel", name: "Makassar", lat: -5.14, lon: 119.42, group: "sulawesi" },
  { id: "sultra", name: "Kendari", lat: -3.99, lon: 122.51, group: "sulawesi" },
  { id: "malut", name: "Sofifi", lat: 0.74, lon: 127.56, group: "maluku" },
  { id: "maluku", name: "Ambon", lat: -3.7, lon: 128.18, group: "maluku" },
  { id: "papbar", name: "Manokwari", lat: -0.86, lon: 134.08, group: "papua" },
  { id: "papbd", name: "Sorong", lat: -0.88, lon: 131.25, group: "papua" },
  { id: "papua", name: "Jayapura", lat: -2.53, lon: 140.72, group: "papua" },
  { id: "papteng", name: "Nabire", lat: -3.37, lon: 135.5, group: "papua" },
  { id: "pappeg", name: "Wamena", lat: -4.1, lon: 138.95, group: "papua" },
  { id: "papsel", name: "Merauke", lat: -8.49, lon: 140.4, group: "papua" },
];

const GROUP_LABELS = [
  { name: "SUMATERA", lat: 1.6, lon: 97.2 },
  { name: "JAWA", lat: -8.9, lon: 109.2 },
  { name: "KALIMANTAN", lat: 1.3, lon: 112.4 },
  { name: "SULAWESI", lat: -6.6, lon: 121.5 },
  { name: "MALUKU", lat: -5.4, lon: 128.2 },
  { name: "PAPUA", lat: -5.9, lon: 137.6 },
  { name: "NUSA TENGGARA", lat: -10.6, lon: 118.8 },
];

const ID_BOUNDS = { lonMin: 94, lonMax: 142, latMin: -11.5, latMax: 6.8 };

type Pin = { id: string; label: string; at: number };
type Arc = { from: string; to: string; start: number; length: number };

type IndonesiaMapProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  /** Frame when the base dots appear. */
  readonly start: number;
  /** Province ids that light up, with the frame they light at. */
  readonly lit?: Record<string, number>;
  readonly pins?: Pin[];
  readonly arcs?: Arc[];
  readonly labels?: boolean;
};

export const IndonesiaMap: React.FC<IndonesiaMapProps> = ({ left, top, width, start, lit = {}, pins = [], arcs = [], labels = true }) => {
  const frame = useCurrentFrame();
  const scale = width / (ID_BOUNDS.lonMax - ID_BOUNDS.lonMin);
  const height = (ID_BOUNDS.latMax - ID_BOUNDS.latMin) * scale;
  const xy = (lat: number, lon: number) => [(lon - ID_BOUNDS.lonMin) * scale, (ID_BOUNDS.latMax - lat) * scale] as const;
  const byId = Object.fromEntries(PROVINCES.map((p) => [p.id, p]));

  return (
    <svg width={width} height={height} style={{ position: "absolute", left, top, overflow: "visible" }}>
      <Land land={geo.indonesia as LandData} scale={scale} width={width} height={height} start={start} focus={["IDN"]} id="id" />
      {labels
        ? GROUP_LABELS.map((g) => {
            const [x, y] = xy(g.lat, g.lon);
            return (
              <text
                key={g.name}
                x={x}
                y={y}
                textAnchor="middle"
                fill={BRAND.accent}
                opacity={0.35 * interpolate(frame, [start + 10, start + 40], [0, 1], clamp)}
                style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: Math.max(11, scale * 0.42), letterSpacing: "0.2em" }}
              >
                {g.name}
              </text>
            );
          })
        : null}
      {PROVINCES.map((p, i) => {
        const [x, y] = xy(p.lat, p.lon);
        const appear = interpolate(frame, [start + i * 0.8, start + i * 0.8 + 10], [0, 1], clamp);
        const litAt = lit[p.id];
        const glow = litAt === undefined ? 0 : interpolate(frame, [litAt, litAt + 12], [0, 1], clamp);
        const pulse = glow > 0 ? 0.75 + 0.25 * Math.sin((frame - litAt) / 8) : 0;
        return (
          <g key={p.id} opacity={appear}>
            {glow > 0 ? <circle cx={x} cy={y} r={scale * 0.9 * glow} fill={BRAND.accent} opacity={0.18 * pulse} /> : null}
            <circle cx={x} cy={y} r={scale * 0.21 + glow * scale * 0.1} fill={glow > 0 ? BRAND.accent : "rgba(232,212,138,0.45)"} />
          </g>
        );
      })}
      {arcs.map((a) => {
        const [x1, y1] = xy(byId[a.from].lat, byId[a.from].lon);
        const [x2, y2] = xy(byId[a.to].lat, byId[a.to].lon);
        const mx = (x1 + x2) / 2;
        const my = Math.min(y1, y2) - Math.hypot(x2 - x1, y2 - y1) * 0.35;
        const p = interpolate(frame, [a.start, a.start + a.length], [1, 0], clamp);
        return (
          <path
            key={`${a.from}-${a.to}`}
            d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
            fill="none"
            stroke={BRAND.accent}
            strokeWidth={2.4}
            strokeDasharray="1 1"
            pathLength={1}
            strokeDashoffset={p}
            strokeLinecap="round"
          />
        );
      })}
      {pins.map((pin) => {
        const p = byId[pin.id];
        const [x, y] = xy(p.lat, p.lon);
        const s = interpolate(frame, [pin.at, pin.at + 14], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
        const ring = ((frame - pin.at) % 45) / 45;
        return (
          <g key={pin.id} opacity={s}>
            <circle cx={x} cy={y} r={8 + ring * 26} fill="none" stroke={BRAND.accent} strokeWidth={1.5} opacity={frame > pin.at ? 1 - ring : 0} />
            <circle cx={x} cy={y} r={8 * s} fill={BRAND.accent} stroke={BRAND.deep} strokeWidth={2} />
            <text x={x + 16} y={y - 14} fill={BRAND.ink} style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 26 }}>
              {pin.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* World strip: Jakarta → Cairo → Ismailia                             */
/* ------------------------------------------------------------------ */

const CITIES = {
  jakarta: { name: "Jakarta", lat: -6.2, lon: 106.85 },
  cairo: { name: "Kairo", lat: 30.04, lon: 31.24 },
  ismailia: { name: "Ismailiyah", lat: 30.6, lon: 32.27 },
};

const W_BOUNDS = { lonMin: 15, lonMax: 125, latMin: -18, latMax: 45 };

export const WorldArc: React.FC<{ readonly left: number; readonly top: number; readonly width: number; readonly start: number; readonly arcAt: number; readonly arcLength: number }> = ({
  left,
  top,
  width,
  start,
  arcAt,
  arcLength,
}) => {
  const frame = useCurrentFrame();
  const scale = width / (W_BOUNDS.lonMax - W_BOUNDS.lonMin);
  const height = (W_BOUNDS.latMax - W_BOUNDS.latMin) * scale;
  const xy = (lat: number, lon: number) => [(lon - W_BOUNDS.lonMin) * scale, (W_BOUNDS.latMax - lat) * scale] as const;
  const grid = interpolate(frame, [start, start + 30], [0, 1], clamp);
  const [jx, jy] = xy(CITIES.jakarta.lat, CITIES.jakarta.lon);
  const [cx, cy] = xy(CITIES.cairo.lat, CITIES.cairo.lon);
  const [ix, iy] = xy(CITIES.ismailia.lat, CITIES.ismailia.lon);
  const draw = interpolate(frame, [arcAt, arcAt + arcLength], [1, 0], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const arrived = interpolate(frame, [arcAt + arcLength - 6, arcAt + arcLength + 10], [0, 1], clamp);

  const lons = [];
  for (let lon = 30; lon <= 120; lon += 15) lons.push(lon);
  const lats = [];
  for (let lat = -15; lat <= 45; lat += 15) lats.push(lat);

  return (
    <svg width={width} height={height} style={{ position: "absolute", left, top, overflow: "visible" }}>
      <Land land={geo.world as LandData} scale={scale} width={width} height={height} start={start} focus={["IDN", "EGY"]} id="world" fadeFrom={0.42} />
      <g stroke={BRAND.accent} strokeWidth={0.8} opacity={0.18 * grid}>
        {lons.map((lon) => {
          const [x] = xy(0, lon);
          return <line key={`lon${lon}`} x1={x} y1={0} x2={x} y2={height} strokeDasharray="2 6" />;
        })}
        {lats.map((lat) => {
          const [, y] = xy(lat, 0);
          return <line key={`lat${lat}`} x1={0} y1={y} x2={width} y2={y} strokeDasharray={lat === 0 ? undefined : "2 6"} />;
        })}
      </g>
      <text x={8} y={xy(0, 0)[1] - 8} fill={BRAND.accent} opacity={0.4 * grid} style={{ fontFamily: FONT.sans, fontSize: 16, letterSpacing: "0.2em" }}>
        EKUATOR
      </text>
      <path
        d={`M${jx} ${jy} Q${(jx + cx) / 2} ${Math.min(jy, cy) - 260} ${cx} ${cy}`}
        fill="none"
        stroke={BRAND.accent}
        strokeWidth={3}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={draw}
      />
      {[
        { x: jx, y: jy, label: CITIES.jakarta.name, show: grid, dx: 18, dy: 8 },
        { x: cx, y: cy, label: CITIES.cairo.name, show: arrived, dx: -18, dy: 40, anchor: "end" as const },
        { x: ix, y: iy, label: CITIES.ismailia.name, show: arrived, dx: 18, dy: -16 },
      ].map((c) => (
        <g key={c.label} opacity={c.show}>
          <circle cx={c.x} cy={c.y} r={22} fill={BRAND.accent} opacity={0.15} />
          <circle cx={c.x} cy={c.y} r={7} fill={BRAND.accent} stroke={BRAND.deep} strokeWidth={2} />
          <text x={c.x + c.dx} y={c.y + c.dy} textAnchor={c.anchor ?? "start"} fill={BRAND.ink} style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 28 }}>
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
