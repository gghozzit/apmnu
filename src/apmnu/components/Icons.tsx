import { interpolate, useCurrentFrame } from "remotion";
import { BRAND, clamp } from "../theme";

/** 24×24 line icons, each a list of path strings. */
const ICONS: Record<string, string[]> = {
  agama: ["M3 5.5C6 4.5 9 4.8 12 6.5C15 4.8 18 4.5 21 5.5V19C18 18 15 18.3 12 20C9 18.3 6 18 3 19Z", "M12 6.5V20"],
  sosial: [
    "M5 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
    "M13 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
    "M2.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5",
    "M10.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5",
  ],
  hukum: ["M12 3v17", "M7 20.5h10", "M4.5 7h15", "M6.5 7L3.5 13h6Z", "M17.5 7l-3 6h6Z", "M3.5 13a3 2 0 0 0 6 0", "M14.5 13a3 2 0 0 0 6 0"],
  ekonomi: ["M3 21h18", "M6 18v-4", "M11 18v-7", "M16 18v-5", "M4 10l5-4 4 3 7-5", "M17 4h3v3"],
  kesehatan: ["M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-3a4.5 4.5 0 0 1 9 3c-2 4.5-9 9-9 9Z", "M5.5 12h3l1.5-2.5 2 5 1.5-2.5h5"],
  sains: [
    "M12 12m-1.4 0a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0-2.8 0",
    "M3 12a9 3.6 0 1 0 18 0a9 3.6 0 1 0-18 0",
    "M7.5 4.2a9 3.6 60 1 0 9 15.6a9 3.6 60 1 0-9-15.6",
    "M16.5 4.2a9 3.6-60 1 0-9 15.6a9 3.6-60 1 0 9-15.6",
  ],
  pendidikan: ["M2 9l10-5 10 5-10 5Z", "M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5", "M22 9v6"],
  riset: ["M10 10m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0", "M14.5 14.5L21 21", "M7 10h6", "M10 7v6"],
  advokasi: ["M3 10v4h3l8 5V5L6 10Z", "M17 9a4 4 0 0 1 0 6", "M19.5 6.5a7.5 7.5 0 0 1 0 11"],
  pemberdayaan: ["M12 21v-8", "M12 13c0-4 3-6 7-6 0 4-3 6-7 6Z", "M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z", "M7 21h10"],
  wakaf: ["M3.5 21h17", "M5.5 21v-7h13v7", "M8 14a4 4 0 0 1 8 0", "M12 6.5V10", "M10.5 21v-3.5a1.5 1.5 0 0 1 3 0V21"],
  sertifikat: ["M4 3h16v12H4Z", "M7.5 7h9", "M7.5 10.5h5", "M15.5 13.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0", "M14 15.5l-1 5.5 2.5-1.5 2.5 1.5-1-5.5"],
  jejaring: [
    "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0",
    "M3 12h18",
    "M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9",
    "M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9",
  ],
  buku: ["M4 4.5h6.5a2.5 2.5 0 0 1 1.5.5 2.5 2.5 0 0 1 1.5-.5H20V19h-6.5a2 2 0 0 0-1.5.6 2 2 0 0 0-1.5-.6H4Z", "M12 5v14.5"],
  web: ["M3 5h18v14H3Z", "M3 8.5h18", "M5.5 6.8h.01", "M7.5 6.8h.01", "M7 12h10", "M7 15h6"],
  jurnal: ["M6 3h10l3 3v15H6Z", "M16 3v3h3", "M9 10h7", "M9 13h7", "M9 16h4"],
};

export type IconName = keyof typeof ICONS;

/** Line icon whose strokes draw in from `start`. */
export const Icon: React.FC<{ readonly name: IconName; readonly size: number; readonly start?: number; readonly color?: string; readonly stroke?: number }> = ({
  name,
  size,
  start = 0,
  color = BRAND.accent,
  stroke = 1.5,
}) => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [start, start + 24], [1, 0], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
      {ICONS[name].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={drawn}
        />
      ))}
    </svg>
  );
};
