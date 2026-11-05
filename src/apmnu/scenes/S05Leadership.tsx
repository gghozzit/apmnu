import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { IndonesiaMap, PROVINCES } from "../components/GeoMap";
import { Counter, Eyebrow, KenBurns, LowerThird, PhotoFrame, SceneVoice, enter, windowOpacity, Sfx } from "../components/Primitives";
import { BRAND, FONT } from "../theme";
import { cue, within, type TimedScene } from "../timeline";

type Display = {
  amanyName: string;
  amanyRole: string;
  amanyRoleEn: string;
  amanyNote: string;
  boardCount: number;
  boardLabel: string;
  boardLabelEn: string;
  provincesLabel: string;
  khofifahName: string;
  khofifahRole: string;
};

/* Leadership: the General Chair's portrait card, then 60+ board members and a lit province map, then the patron. */
export const S05Leadership: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const d = scene.display as Display;
  const l01 = cue(scene, "s05_l01");
  const l02 = cue(scene, "s05_l02");
  const mapLit = Object.fromEntries(PROVINCES.map((p, i) => [p.id, within(scene, "s05_l02", 0.1) + i * 3]));
  const patronAt = within(scene, "s05_l02", 0.58);

  return (
    <AbsoluteFill>
      {/* General Chair */}
      <AbsoluteFill style={{ opacity: windowOpacity(frame, 0, l02 + 8, 16) }}>
        <PhotoFrame left={190} top={150} width={520} height={694} background="#F4F0E6" style={{ opacity: enter(frame, l01 - 10, 20) }}>
          <Sequence durationInFrames={l02 + 10} layout="none">
            <KenBurns src="apmnu/assets/amany.jpg" from={1} to={1.05} fit="cover" position="50% 20%" />
          </Sequence>
        </PhotoFrame>
        <Eyebrow start={l01} style={{ position: "absolute", left: 820, top: 300 }}>
          Kepemimpinan
        </Eyebrow>
        <LowerThird start={l01 + 10} name={d.amanyName} role={`${d.amanyRole} · ${d.amanyRoleEn}`} width={920} size={52} style={{ left: 820, top: 370 }} />
        <div
          style={{
            position: "absolute",
            left: 820,
            top: 600,
            width: 980,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: enter(frame, within(scene, "s05_l01", 0.6), 20),
          }}
        >
          <div style={{ width: 10, height: 10, rotate: "45deg", background: BRAND.accent, flex: "0 0 auto" }} />
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 26, color: "rgba(245,241,230,0.88)" }}>{d.amanyNote}</div>
        </div>
      </AbsoluteFill>

      {/* Board and reach */}
      <AbsoluteFill style={{ opacity: enter(frame, l02, 18) }}>
        <div style={{ position: "absolute", left: 160, top: 290, width: 560, opacity: windowOpacity(frame, l02, patronAt + 10, 14) }}>
          <Counter value={d.boardCount} start={l02 + 6} style={{ fontSize: 210 }} />
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 44, color: BRAND.ink, marginTop: 10 }}>{d.boardLabel}</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 24, color: BRAND.accent, marginTop: 6, letterSpacing: "0.06em" }}>{d.boardLabelEn}</div>
        </div>
        <div style={{ position: "absolute", left: 160, top: 260, width: 560, opacity: enter(frame, patronAt, 18) }}>
          <PhotoFrame left={0} top={0} width={240} height={240} radius={120}>
            <Img src={staticFile("apmnu/assets/khofifah.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </PhotoFrame>
          <LowerThird start={patronAt + 8} name={d.khofifahName} role={d.khofifahRole} width={560} size={30} style={{ left: 0, top: 280 }} />
        </div>
        <IndonesiaMap left={780} top={300} width={1040} start={l02} lit={mapLit} labels />
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 740,
            width: 1040,
            textAlign: "center",
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.06em",
            color: BRAND.accent,
            opacity: enter(frame, within(scene, "s05_l02", 0.3), 20),
          }}
        >
          {d.provincesLabel}
        </div>
      </AbsoluteFill>

      {/* Sound: portrait pop, counter ticks, pings as provinces light up, a chime for the patron */}
      <Sfx name="pop" at={l01 - 10} volume={0.35} />
      <Sfx name="chime" at={l01 + 10} volume={0.2} />
      <Sfx name="count" at={l02 + 6} volume={0.3} />
      {[0, 6, 12, 18, 24, 30].map((k, i) => (
        <Sfx key={k} name="ping" at={within(scene, "s05_l02", 0.1) + k * 3} volume={0.18} rate={0.9 + i * 0.07} />
      ))}
      <Sfx name="chime" at={patronAt + 8} volume={0.25} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
