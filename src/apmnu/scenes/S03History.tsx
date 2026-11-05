import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { IndonesiaMap } from "../components/GeoMap";
import { Eyebrow, KenBurns, LowerThird, PhotoFrame, SceneVoice, Sfx, enter, windowOpacity } from "../components/Primitives";
import { BRAND, FONT, clamp } from "../theme";
import { cue, type TimedScene } from "../timeline";

type Display = {
  milestones: { title: string; place: string; note: string }[];
  khofifahName: string;
  khofifahRole: string;
  khofifahRoleEn: string;
};

const NODE_X = [260, 960, 1660];

/* History: a three-point timeline across the top; Samarinda → Surabaya on the map, then the Surabaya photos. */
export const S03History: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const l01 = cue(scene, "s03_l01");
  const l02 = cue(scene, "s03_l02");
  const l03 = cue(scene, "s03_l03");
  const l04 = cue(scene, "s03_l04");
  const nodeAt = [l01 + 10, l03 + 10, l04 + 10];
  const progress = interpolate(frame, [nodeAt[0], nodeAt[1], nodeAt[1] + 1, nodeAt[2]], [0, 0.5, 0.5, 1], clamp);

  return (
    <AbsoluteFill>
      {/* Timeline */}
      <svg width={1920} height={140} style={{ position: "absolute", top: 70, left: 0, overflow: "visible" }}>
        <line x1={NODE_X[0]} y1={40} x2={NODE_X[2]} y2={40} stroke="rgba(232,212,138,0.25)" strokeWidth={2} />
        <line x1={NODE_X[0]} y1={40} x2={NODE_X[0] + (NODE_X[2] - NODE_X[0]) * progress} y2={40} stroke={BRAND.accent} strokeWidth={3} />
        {NODE_X.map((x, i) => {
          const s = spring({ frame: frame - nodeAt[i], fps, config: { damping: 12 } });
          return (
            <g key={i}>
              <circle cx={x} cy={40} r={12} fill={BRAND.deep} stroke="rgba(232,212,138,0.4)" strokeWidth={2} />
              <circle cx={x} cy={40} r={12 * s} fill={BRAND.accent} />
              <circle cx={x} cy={40} r={12 + 14 * s} fill="none" stroke={BRAND.accent} strokeWidth={1} opacity={0.4 * s} />
            </g>
          );
        })}
      </svg>
      {d.milestones.map((m, i) => {
        const p = enter(frame, nodeAt[i] + 4, 18);
        return (
          <div key={m.title} style={{ position: "absolute", top: 140, left: NODE_X[i] - 250, width: 500, textAlign: "center", opacity: 0.25 + 0.75 * p }}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, color: BRAND.ink }}>{m.title}</div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 21, color: BRAND.accent, marginTop: 4 }}>{m.place}</div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 19, color: "rgba(245,241,230,0.7)", marginTop: 2, opacity: p }}>{m.note}</div>
          </div>
        );
      })}

      {/* Phase A: map + Khofifah */}
      <AbsoluteFill style={{ opacity: windowOpacity(frame, 0, l03 + 8, 16) }}>
        <IndonesiaMap
          left={70}
          top={330}
          width={1000}
          start={8}
          labels
          pins={[
            { id: "kaltim", label: "Samarinda", at: l01 + 24 },
            { id: "jatim", label: "Surabaya", at: l02 + 34 },
          ]}
          arcs={[{ from: "kaltim", to: "jatim", start: l02, length: 36 }]}
        />
        <PhotoFrame left={1190} top={300} width={300} height={300} radius={150} style={{ opacity: enter(frame, l01 + 30, 20), scale: `${0.92 + 0.08 * enter(frame, l01 + 30, 24)}` }}>
          <Img src={staticFile("apmnu/assets/khofifah.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </PhotoFrame>
        <LowerThird start={l01 + 44} name={d.khofifahName} role={d.khofifahRole} note={d.khofifahRoleEn} width={640} size={32} style={{ left: 1140, top: 630 }} />
      </AbsoluteFill>

      {/* Phase B: Surabaya photos */}
        <AbsoluteFill style={{ opacity: enter(frame, l03, 20) }}>
          <div style={{ position: "absolute", left: 130, top: 360, width: 600 }}>
            {[
              { m: d.milestones[1], from: l03, to: l04 + 6 },
              { m: d.milestones[2], from: l04, to: D + 20 },
            ].map(({ m, from, to }) => (
              <div key={m.title} style={{ position: "absolute", top: 0, left: 0, width: 600, opacity: windowOpacity(frame, from, to, 12) }}>
                <Eyebrow start={from + 4}>{m.place}</Eyebrow>
                <div style={{ marginTop: 22, fontFamily: FONT.sans, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: BRAND.ink }}>{m.title}</div>
                <div style={{ marginTop: 18, fontFamily: FONT.sans, fontWeight: 500, fontSize: 30, color: BRAND.accent }}>{m.note}</div>
              </div>
            ))}
          </div>
          <PhotoFrame left={800} top={300} width={990} height={540}>
            <AbsoluteFill style={{ opacity: windowOpacity(frame, l03, l04 + 14, 1) }}>
              <Sequence from={l03} durationInFrames={l04 - l03 + 14} layout="none">
                <KenBurns src="apmnu/assets/rakornas-mnu.jpg" from={1.04} to={1.14} panX={-2} />
              </Sequence>
            </AbsoluteFill>
            <AbsoluteFill style={{ opacity: enter(frame, l04, 14) }}>
              <Sequence from={l04} durationInFrames={D - l04} layout="none">
                <KenBurns src="apmnu/assets/pengukuhan.jpg" from={1.02} to={1.12} panX={2} />
              </Sequence>
            </AbsoluteFill>
          </PhotoFrame>
        </AbsoluteFill>

      {nodeAt.map((at, i) => (
        <Sfx key={i} name="tick" at={at} volume={0.35} />
      ))}
      {/* Sound: portrait pop, map pings and the arc's swish */}
      <Sfx name="pop" at={l01 + 30} volume={0.35} />
      <Sfx name="ping" at={l01 + 24} volume={0.3} />
      <Sfx name="whoosh" at={l02} volume={0.3} rate={1.5} />
      <Sfx name="ping" at={l02 + 34} volume={0.3} rate={1.2} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
