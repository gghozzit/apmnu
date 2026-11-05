import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { WorldArc } from "../components/GeoMap";
import { Eyebrow, KenBurns, PhotoFrame, SceneVoice, Sfx, enter, windowOpacity } from "../components/Primitives";
import { BRAND, FONT } from "../theme";
import { cue, type TimedScene } from "../timeline";

type Display = {
  program: string;
  /** `line` is the narration line the visit appears on; `position` anchors the crop (and zoom) so nobody is cut off. */
  stops: { asset: string; place: string; detail: string; date: string; line: string; position?: string }[];
};

/* Egypt: an arc from Jakarta to Cairo and Ismailia beside the programme poster, then the three visits. */
export const S07Egypt: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const l01 = cue(scene, "s07_l01");
  const l02 = cue(scene, "s07_l02");
  const stopAt = d.stops.map((stop) => cue(scene, stop.line));
  const stopEnd = stopAt.map((_, i) => stopAt[i + 1] ?? D + 20);

  return (
    <AbsoluteFill>
      {/* Map and programme */}
      <AbsoluteFill style={{ opacity: windowOpacity(frame, 0, stopAt[0] + 10, 16) }}>
        <Eyebrow start={l01} style={{ position: "absolute", left: 120, top: 100 }}>
          Kiprah Internasional
        </Eyebrow>
        <div style={{ position: "absolute", left: 120, top: 150, fontFamily: FONT.sans, fontWeight: 800, fontSize: 44, color: BRAND.ink, opacity: enter(frame, l02, 20) }}>
          {d.program}
        </div>
        <WorldArc left={110} top={260} width={1060} start={0} arcAt={l01 + 10} arcLength={l02 - l01 + 50} />
        <PhotoFrame
          left={1300}
          top={150}
          width={460}
          height={690}
          style={{ opacity: enter(frame, l02 + 10, 20), translate: `0px ${(1 - enter(frame, l02 + 10, 24)) * 40}px` }}
        >
          <Img src={staticFile("apmnu/assets/poster-benchmark.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </PhotoFrame>
      </AbsoluteFill>

      {/* Visits */}
      {d.stops.map((stop, i) => (
        <AbsoluteFill key={stop.asset} style={{ opacity: windowOpacity(frame, stopAt[i], stopEnd[i] + 12, 14) }}>
          <PhotoFrame left={110} top={90} width={1700} height={756}>
            <Sequence from={stopAt[i]} durationInFrames={stopEnd[i] - stopAt[i] + 12} layout="none">
              <KenBurns
                src={`apmnu/assets/${stop.asset}.jpg`}
                from={1.03}
                to={1.12}
                panX={i % 2 ? 1.5 : -1.5}
                position={stop.position}
                style={stop.position ? { transformOrigin: stop.position } : undefined}
              />
            </Sequence>
            <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(2,28,16,0.85) 0%, rgba(2,28,16,0.35) 40%, rgba(2,28,16,0) 65%)" }} />
          </PhotoFrame>
          <div style={{ position: "absolute", left: 170, top: 560, width: 760, opacity: enter(frame, stopAt[i] + 10, 20), translate: `${(1 - enter(frame, stopAt[i] + 10, 24)) * -30}px 0px` }}>
            <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 8, background: BRAND.accent, fontFamily: FONT.sans, fontWeight: 800, fontSize: 22, color: BRAND.deep, letterSpacing: "0.08em" }}>
              {stop.date}
            </div>
            <div style={{ marginTop: 16, fontFamily: FONT.sans, fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: BRAND.ink, textShadow: "0 3px 16px rgba(0,0,0,0.5)" }}>{stop.place}</div>
            <div style={{ marginTop: 10, fontFamily: FONT.sans, fontWeight: 600, fontSize: 28, color: BRAND.accent }}>{stop.detail}</div>
          </div>
        </AbsoluteFill>
      ))}

      {/* Sound: the flight pass-by, a pop for the poster, a ping and chime on arrival, a tick for each visit date */}
      <Sfx name="flyby" at={l01 + 10} volume={0.3} />
      <Sfx name="pop" at={l02 + 10} volume={0.3} />
      <Sfx name="ping" at={l02 + 60} volume={0.3} rate={0.9} />
      <Sfx name="chime" at={l02 + 60} volume={0.22} />
      {stopAt.map((at, i) => (
        <Sfx key={i} name="tick" at={at + 10} volume={0.3} />
      ))}
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
