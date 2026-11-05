import { Fragment } from "react";
import { AbsoluteFill, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Eyebrow, KenBurns, PhotoFrame, SceneVoice, Sfx, enter, windowOpacity } from "../components/Primitives";
import { BRAND, FONT, GOLD_TEXT } from "../theme";
import { cue, type TimedScene } from "../timeline";

type Webinar = {
  asset: string;
  series: string;
  title: string;
  date: string;
  mode: string;
  speakerLabel: string;
  speaker: string;
  role: string;
  /** Where the speaker's face sits in `face.asset` (pixels), for the round avatar crop. */
  face: { asset: string; w: number; h: number; cx: number; cy: number; r: number };
};

type Display = {
  eyebrow: string;
  headline: string;
  period: string;
  webinars: Webinar[];
};

const POSTER_SIZE: Record<string, [number, number]> = {
  "webinar-kartini": [1080, 1350],
  "webinar-hardiknas": [1280, 720],
  "webinar-brin": [1222, 1280],
};

/** Round crop of a face out of a larger picture. */
const Avatar: React.FC<{ readonly face: Webinar["face"]; readonly size: number }> = ({ face, size }) => {
  const s = size / (2 * face.r);
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flex: "0 0 auto",
        borderRadius: "50%",
        overflow: "hidden",
        background: "#F4F0E6",
        boxShadow: `0 0 0 3px ${BRAND.accent}, 0 16px 40px rgba(0,0,0,0.4)`,
      }}
    >
      <Img
        src={staticFile(`apmnu/assets/${face.asset}`)}
        style={{ position: "absolute", left: -(face.cx - face.r) * s, top: -(face.cy - face.r) * s, width: face.w * s, height: face.h * s, maxWidth: "none" }}
      />
    </div>
  );
};

/* Webinars: three posters fan in under the chapter title, then each webinar gets its poster, date and speaker. */
export const S05bWebinars: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const l01 = cue(scene, "s05b_l01");
  const at = [cue(scene, "s05b_l02"), cue(scene, "s05b_l03"), cue(scene, "s05b_l04")];
  const until = [at[1], at[2], D + 20];

  return (
    <AbsoluteFill>
      {/* Chapter: title and the three posters fanned out */}
      <AbsoluteFill style={{ alignItems: "center", opacity: windowOpacity(frame, 0, at[0] + 8, 14) }}>
        <Eyebrow start={l01 - 6} align="center" style={{ position: "absolute", top: 130, left: 0, right: 0 }}>
          {d.eyebrow}
        </Eyebrow>
        <div style={{ position: "absolute", top: 180, fontFamily: FONT.sans, fontWeight: 800, fontSize: 64, color: BRAND.ink, opacity: enter(frame, l01, 20) }}>
          {d.headline}
        </div>
        <div style={{ position: "absolute", top: 272, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, letterSpacing: "0.08em", color: BRAND.accent, opacity: enter(frame, l01 + 8, 20) }}>
          {d.period}
        </div>
        {d.webinars.map((w, i) => {
          const s = spring({ frame: frame - (l01 + 14 + i * 9), fps, config: { damping: 16 } });
          const x = 960 + (i - 1) * 400;
          return (
            <div
              key={w.asset}
              style={{
                position: "absolute",
                left: x - 170,
                top: 370,
                width: 340,
                height: 420,
                borderRadius: 18,
                overflow: "hidden",
                background: BRAND.deep,
                boxShadow: `0 0 0 1.5px ${BRAND.accent}aa, 0 30px 70px rgba(0,0,0,0.5)`,
                opacity: s,
                rotate: `${(i - 1) * 5 * s}deg`,
                translate: `0px ${(1 - s) * 90 + (i === 1 ? -14 : 10)}px`,
              }}
            >
              <Img src={staticFile(`apmnu/assets/${w.asset}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* One webinar at a time */}
      {d.webinars.map((w, i) => {
        const [pw, ph] = POSTER_SIZE[w.asset];
        const fit = Math.min(680 / pw, 720 / ph);
        const fw = Math.round(pw * fit);
        const fh = Math.round(ph * fit);
        const t = enter(frame, at[i], 22);
        return (
          <AbsoluteFill key={w.asset} style={{ opacity: windowOpacity(frame, at[i] - 6, until[i] + 10, 12) }}>
            <PhotoFrame
              left={150 + (680 - fw) / 2}
              top={130 + (720 - fh) / 2}
              width={fw}
              height={fh}
              radius={18}
              style={{ translate: `${(1 - t) * -40}px 0px` }}
            >
              <Sequence from={at[i] - 6} durationInFrames={until[i] - at[i] + 20} layout="none">
                <KenBurns src={`apmnu/assets/${w.asset}.jpg`} from={1} to={1.05} fit="contain" />
              </Sequence>
            </PhotoFrame>

            <div style={{ position: "absolute", left: 920, top: 170, width: 860, opacity: t, translate: `${(1 - t) * 40}px 0px` }}>
              <Eyebrow start={at[i] + 4}>{w.series}</Eyebrow>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: FONT.sans,
                  fontWeight: 800,
                  fontSize: 60,
                  lineHeight: 1.12,
                  paddingBottom: "0.08em",
                  textWrap: "balance",
                  color: "transparent",
                  backgroundImage: GOLD_TEXT,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {w.title}
              </div>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, opacity: enter(frame, at[i] + 12, 18) }}>
                <div style={{ padding: "8px 18px", borderRadius: 10, background: BRAND.accent, fontFamily: FONT.sans, fontWeight: 800, fontSize: 26, color: BRAND.deep }}>
                  {w.date}
                </div>
                <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 26, color: "rgba(245,241,230,0.85)" }}>{w.mode}</div>
              </div>
              <div
                style={{
                  marginTop: 44,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "22px 28px",
                  borderRadius: 22,
                  background: "rgba(4,51,29,0.72)",
                  border: "1px solid rgba(232,212,138,0.4)",
                  opacity: enter(frame, at[i] + 22, 20),
                  translate: `0px ${(1 - enter(frame, at[i] + 22, 24)) * 24}px`,
                }}
              >
                <Avatar face={w.face} size={140} />
                <div>
                  <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: BRAND.accent }}>{w.speakerLabel}</div>
                  <div style={{ marginTop: 8, fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: BRAND.ink }}>{w.speaker}</div>
                  <div style={{ marginTop: 6, fontFamily: FONT.sans, fontWeight: 500, fontSize: 23, lineHeight: 1.3, color: "rgba(245,241,230,0.85)" }}>{w.role}</div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        );
      })}

      {/* Sound: a pop per poster as they fan in; for each webinar a pop, a tick on the date and a soft chime for the speaker */}
      {d.webinars.map((w, i) => (
        <Sfx key={`fan-${w.asset}`} name="pop" at={l01 + 14 + i * 9} volume={0.3} rate={0.9 + i * 0.1} />
      ))}
      {at.map((a, i) => (
        <Fragment key={`w-${i}`}>
          <Sfx name="pop" at={a} volume={0.3} />
          <Sfx name="tick" at={a + 12} volume={0.3} />
          <Sfx name="chime" at={a + 22} volume={0.18} rate={1.1} />
        </Fragment>
      ))}
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
