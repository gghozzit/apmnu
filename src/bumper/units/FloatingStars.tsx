import { AbsoluteFill, Interactive, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../theme";
import { starPolygon, starburst } from "../../elegant/geometry";

const W = 1920;
const H = 1080;

// Stars stay in the side bands so the centre (title, portrait, text) stays calm.
const STARS = Array.from({ length: 10 }, (_, i) => {
  const side = i % 2 === 0 ? 0 : 1;
  return {
    x: side === 0 ? 30 + random(`fs-x-${i}`) * 230 : W - 260 + random(`fs-x-${i}`) * 230,
    y: random(`fs-y-${i}`) * H,
    size: 6 + random(`fs-s-${i}`) * 9,
    speed: 10 + random(`fs-v-${i}`) * 16,
    spin: (random(`fs-r-${i}`) - 0.5) * 1.6,
    phase: random(`fs-p-${i}`) * Math.PI * 2,
    outline: random(`fs-o-${i}`) > 0.5,
  };
});

const FloatingStarsInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0.4 * fps, 1.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {STARS.map((s, i) => {
          const y = ((((s.y - t * s.speed) % (H + 60)) + H + 60) % (H + 60)) - 30;
          const x = s.x + Math.sin(t / 2 + s.phase) * 14;
          const twinkle = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.9 + s.phase));
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${frame * s.spin})`} opacity={twinkle}>
              {s.outline ? (
                <path d={starPolygon(0, 0, s.size, 8, 3)} fill="none" stroke={COLORS.champagne} strokeWidth={1} />
              ) : (
                <path d={starburst(0, 0, s.size, s.size * 0.42, 8)} fill={COLORS.champagne} />
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Small eight-point stars drifting upwards and turning along the side edges. */
export const FloatingStars = Interactive.create({
  Component: FloatingStarsInner,
  layout: "absolute-fill",
  componentName: "BumperFloatingStars",
});
