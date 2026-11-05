import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, FONT, GOLD_TEXT, clamp } from "../theme";
import type { TimedScene } from "../timeline";

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/** Opacity for an element visible in [from, to) with soft edges. */
export const windowOpacity = (frame: number, from: number, to: number, fade = 12) =>
  interpolate(frame, [from, from + fade, to - fade, to], [0, 1, 1, 0], clamp);

/** Eased 0→1 progress starting at `from`. */
export const enter = (frame: number, from: number, length = 18) =>
  interpolate(frame, [from, from + length], [0, 1], { ...clamp, easing: easeOut });

/* ------------------------------------------------------------------ */
/* Backdrop: NU green field, faint eight-point lattice, gold dust       */
/* ------------------------------------------------------------------ */

const DUST = Array.from({ length: 36 }, (_, i) => ({
  x: random(`ad-x-${i}`) * 1920,
  y: random(`ad-y-${i}`) * 1080,
  size: 1.5 + random(`ad-s-${i}`) * 2.5,
  speed: 4 + random(`ad-v-${i}`) * 10,
  phase: random(`ad-p-${i}`) * Math.PI * 2,
}));

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = 60;
  const r = 34;
  const s = r * Math.SQRT1_2;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 85% at 50% 42%, ${BRAND.primary} 0%, ${BRAND.primaryDark} 55%, ${BRAND.deep} 100%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="apmnu-lattice" width={120} height={120} patternUnits="userSpaceOnUse" patternTransform={`translate(${t * 6} ${t * 3})`}>
            <g fill="none" stroke={BRAND.accent} strokeWidth={0.8} opacity={0.35}>
              <polygon points={`${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`} />
              <polygon points={`${c - s},${c - s} ${c + s},${c - s} ${c + s},${c + s} ${c - s},${c + s}`} />
            </g>
          </pattern>
          <radialGradient id="apmnu-edge" cx="50%" cy="50%" r="72%">
            <stop offset="0.35" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <mask id="apmnu-edge-mask">
            <rect width={1920} height={1080} fill="url(#apmnu-edge)" />
          </mask>
        </defs>
        <rect width={1920} height={1080} fill="url(#apmnu-lattice)" mask="url(#apmnu-edge-mask)" />
      </svg>
      {DUST.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x + Math.sin(t / 2 + p.phase) * 12,
            top: (((p.y - t * p.speed) % 1080) + 1080) % 1080,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: BRAND.accent,
            opacity: 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2 + p.phase)),
            boxShadow: `0 0 ${p.size * 3}px rgba(232,212,138,0.5)`,
          }}
        />
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,10,5,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Photos                                                              */
/* ------------------------------------------------------------------ */

type KenBurnsProps = {
  readonly src: string;
  readonly from?: number;
  readonly to?: number;
  /** Pan in percent of the frame, applied over the clip. */
  readonly panX?: number;
  readonly panY?: number;
  readonly fit?: "cover" | "contain";
  readonly position?: string;
  readonly length?: number;
  readonly style?: React.CSSProperties;
};

/** Slow zoom and pan across a still. Frame 0 is the start of the enclosing sequence. */
export const KenBurns: React.FC<KenBurnsProps> = ({ src, from = 1, to = 1.08, panX = 0, panY = 0, fit = "cover", position = "50% 50%", length, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, length ?? durationInFrames], [0, 1], clamp);
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: position,
        scale: interpolate(p, [0, 1], [from, to], { output: "perceptual-scale" }),
        translate: `${panX * p}% ${panY * p}%`,
        ...style,
      }}
    />
  );
};

type FrameProps = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly radius?: number;
  readonly background?: string;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
};

/** Rounded photo frame with a thin gold keyline and soft shadow. */
export const PhotoFrame: React.FC<FrameProps> = ({ left, top, width, height, radius = 22, background = BRAND.deep, children, style }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: radius,
      overflow: "hidden",
      background,
      boxShadow: "0 30px 70px rgba(0,12,6,0.55)",
      ...style,
    }}
  >
    {children}
    <div style={{ position: "absolute", inset: 0, borderRadius: radius, boxShadow: `inset 0 0 0 1.5px ${BRAND.accent}aa, inset 0 0 0 8px rgba(4,51,29,0.35)` }} />
  </div>
);

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

type KineticProps = {
  readonly text: string;
  readonly start: number;
  readonly stagger?: number;
  readonly highlight?: readonly string[];
  readonly style?: React.CSSProperties;
};

/** Words spring up one after another; words in `highlight` are set in gold. */
export const KineticWords: React.FC<KineticProps> = ({ text, start, stagger = 3, highlight = [], style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.28em", ...style }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - start - i * stagger, fps, config: { damping: 200 } });
        const gold = highlight.some((h) => w.toLowerCase().startsWith(h.toLowerCase()));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              translate: `0px ${(1 - s) * 26}px`,
              filter: `blur(${(1 - s) * 5}px)`,
              ...(gold ? { color: "transparent", backgroundImage: GOLD_TEXT, WebkitBackgroundClip: "text", backgroundClip: "text" } : null),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Eyebrow: React.FC<{ readonly children: React.ReactNode; readonly start: number; readonly align?: "left" | "center"; readonly style?: React.CSSProperties }> = ({
  children,
  start,
  align = "left",
  style,
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 20);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: align === "center" ? "center" : "flex-start", opacity: p, ...style }}>
      <div style={{ width: 56 * p, height: 2, background: BRAND.gold }} />
      <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: BRAND.accent }}>{children}</div>
      {align === "center" ? <div style={{ width: 56 * p, height: 2, background: BRAND.gold }} /> : null}
    </div>
  );
};

/** Name/role plate: gold bar wipes in, then the name and role slide up. */
export const LowerThird: React.FC<{
  readonly start: number;
  readonly name: string;
  readonly role: string;
  readonly note?: string;
  readonly width?: number;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ start, name, role, note, width = 760, size = 40, style }) => {
  const frame = useCurrentFrame();
  const bar = enter(frame, start, 16);
  const text = enter(frame, start + 6, 20);
  return (
    <div style={{ position: "absolute", width, ...style }}>
      <div style={{ height: 4, width: `${bar * 100}%`, background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.accent})`, borderRadius: 2 }} />
      <div style={{ overflow: "hidden", paddingTop: 16 }}>
        <div style={{ translate: `0px ${(1 - text) * 40}px`, opacity: text }}>
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: size, lineHeight: 1.2, color: BRAND.ink }}>{name}</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: Math.round(size * 0.65), marginTop: 8, color: BRAND.accent }}>{role}</div>
          {note ? <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 22, marginTop: 10, color: "rgba(245,241,230,0.78)" }}>{note}</div> : null}
        </div>
      </div>
    </div>
  );
};

/** Number that counts up with an eased curve. */
export const Counter: React.FC<{ readonly value: number; readonly start: number; readonly length?: number; readonly suffix?: string; readonly style?: React.CSSProperties }> = ({
  value,
  start,
  length = 45,
  suffix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const v = Math.round(interpolate(frame, [start, start + length], [0, value], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontVariantNumeric: "tabular-nums",
        color: "transparent",
        backgroundImage: GOLD_TEXT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        lineHeight: 1,
        ...style,
      }}
    >
      {v}
      {suffix}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Audio helpers                                                       */
/* ------------------------------------------------------------------ */

/** Narration level; the music bed is balanced against this in ApmnuProfile. */
export const VO_VOLUME = 1;

/** Plays every narration line of the scene at its cue. */
export const SceneVoice: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => (
  <>
    {scene.lines.map((line) => (
      <Sequence
        key={line.id}
        name={`VO ${line.id}`}
        from={line.from}
        durationInFrames={line.durationInFrames + 6}
        layout="none"
        hidden
      >
        <Audio src={staticFile(line.audio)} volume={VO_VOLUME} />
      </Sequence>
    ))}
  </>
);

export type SfxName =
  | "whoosh" | "tick" | "flip" | "click" | "pop" | "chime" | "ping" | "typing"
  | "riser" | "hit" | "shimmer" | "count" | "flyby";

/** One-shot sound effect cued at frame `at` of the enclosing sequence; `rate` shifts speed and pitch. */
export const Sfx: React.FC<{ readonly name: SfxName; readonly at: number; readonly volume?: number; readonly rate?: number }> = ({ name, at, volume = 0.5, rate = 1 }) => (
  <Sequence name={`SFX ${name}`} from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none">
    <Audio src={staticFile(`apmnu/sfx/${name}.wav`)} volume={volume} playbackRate={rate} />
  </Sequence>
);
