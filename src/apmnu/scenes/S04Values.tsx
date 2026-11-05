import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { Eyebrow, KineticWords, SceneVoice, enter, windowOpacity, Sfx } from "../components/Primitives";
import { BRAND, FONT, clamp } from "../theme";
import { cue, within, type TimedScene } from "../timeline";

type Display = {
  headline: string;
  pillars: { id: IconName; label: string; en: string }[];
  network: string;
  waqf: string;
  waqfEn: string;
};

const NODES = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { x: 960 + Math.cos(a) * 820, y: 560 + Math.sin(a) * 330 };
});

/* Direction & values: headline, four pillars rise, a pulsing network ring, then productive waqf. */
export const S04Values: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene.display as Display;
  const l01 = cue(scene, "s04_l01");
  const l03 = cue(scene, "s04_l03");
  const networkAt = within(scene, "s04_l02", 0.72);
  const net = interpolate(frame, [networkAt, networkAt + 40], [0, 1], clamp);
  const settle = interpolate(frame, [l03, l03 + 24], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: net * (1 - 0.5 * settle) }}>
        {NODES.map((a, i) => {
          const b = NODES[(i + 3) % NODES.length];
          const pulse = 0.5 + 0.5 * Math.sin(frame / 14 + i);
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BRAND.accent} strokeWidth={0.8} opacity={0.18} />
              <circle cx={a.x} cy={a.y} r={5 + pulse * 3} fill={BRAND.accent} opacity={0.35 + 0.4 * pulse} />
              <circle cx={a.x} cy={a.y} r={14 + pulse * 10} fill="none" stroke={BRAND.accent} opacity={0.15 * pulse} />
            </g>
          );
        })}
        <ellipse cx={960} cy={560} rx={820} ry={330} fill="none" stroke={BRAND.accent} strokeWidth={1} opacity={0.2} strokeDasharray="4 10" />
      </svg>

      <Eyebrow start={6} align="center" style={{ position: "absolute", top: 110, left: 0, right: 0 }}>
        Arah &amp; Nilai
      </Eyebrow>
      <div style={{ position: "absolute", top: 170, left: 260, width: 1400 }}>
        <KineticWords
          text={d.headline}
          start={l01 + 4}
          stagger={3}
          highlight={["Ahlussunnah", "wal", "Jamaah"]}
          style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 54, lineHeight: 1.2, color: BRAND.ink }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 380 - settle * 30,
          left: 180,
          width: 1560,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
        }}
      >
        {d.pillars.map((p, i) => {
          const at = within(scene, "s04_l02", 0.08 + i * 0.14);
          const s = spring({ frame: frame - at, fps, config: { damping: 16 } });
          return (
            <div
              key={p.id}
              style={{
                height: 290,
                borderRadius: 24,
                background: "linear-gradient(180deg, rgba(10,92,52,0.85), rgba(4,51,29,0.9))",
                border: "1px solid rgba(232,212,138,0.4)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "0 20px",
                textAlign: "center",
                opacity: s,
                translate: `0px ${(1 - s) * 120}px`,
              }}
            >
              <Icon name={p.id} size={84} start={at + 6} />
              <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, lineHeight: 1.15, color: BRAND.ink }}>{p.label}</div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 21, color: BRAND.accent, letterSpacing: "0.06em" }}>{p.en}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: "0.08em",
          color: BRAND.accent,
          opacity: windowOpacity(frame, networkAt + 10, l03 + 10, 14),
        }}
      >
        {d.network}
      </div>

      <div style={{ position: "absolute", top: 710, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: enter(frame, l03 + 8, 20) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "18px 40px 18px 26px",
            borderRadius: 999,
            background: "rgba(232,212,138,0.12)",
            border: `1.5px solid ${BRAND.accent}`,
            scale: `${0.9 + 0.1 * enter(frame, l03 + 8, 24)}`,
          }}
        >
          <Icon name="wakaf" size={58} start={l03 + 10} />
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 40, color: BRAND.ink }}>{d.waqf}</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 24, color: BRAND.accent }}>· {d.waqfEn}</div>
        </div>
      </div>

      {/* Sound: a low pop as each pillar rises, a ping for the network, a chime for the waqf */}
      {d.pillars.map((p, i) => (
        <Sfx key={p.id} name="pop" at={within(scene, "s04_l02", 0.08 + i * 0.14)} volume={0.35} rate={0.75 + i * 0.1} />
      ))}
      <Sfx name="ping" at={networkAt} volume={0.25} />
      <Sfx name="chime" at={l03 + 8} volume={0.3} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
