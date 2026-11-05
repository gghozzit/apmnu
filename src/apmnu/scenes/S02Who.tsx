import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { Eyebrow, KenBurns, SceneVoice, enter, windowOpacity, Sfx } from "../components/Primitives";
import { BRAND, FONT, GOLD_TEXT, clamp } from "../theme";
import { cue, within, type TimedScene } from "../timeline";

type Display = {
  fullName: string;
  acronym: string;
  tagline: string;
  disciplines: { id: IconName; label: string; en: string }[];
  family: string;
  mission: string;
  manhaj: string;
};

/* Who: the full name types out with its initials in gold, the acronym forms, then disciplines and identity. */
export const S02Who: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const l02 = cue(scene, "s02_l02");
  const l03 = cue(scene, "s02_l03");
  const l04 = cue(scene, "s02_l04");
  const acronymAt = within(scene, "s02_l01", 0.48);

  const typeStart = 20;
  const typed = Math.floor(interpolate(frame, [typeStart, typeStart + d.fullName.length * 1.4], [0, d.fullName.length], clamp));
  const initials = new Set(d.fullName.split("").flatMap((ch, i) => (i === 0 || d.fullName[i - 1] === " " ? [i] : [])));
  const lift = interpolate(frame, [l02, l02 + 24], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: 0.9,
          overflow: "hidden",
          WebkitMaskImage: "radial-gradient(ellipse 72% 72% at 50% 50%, #000 45%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 72% 72% at 50% 50%, #000 45%, transparent 100%)",
        }}
      >
        <KenBurns src="apmnu/assets/rakornas-mnu.jpg" from={1.08} to={1.16} panX={-2} length={D} style={{ filter: "blur(16px) brightness(0.5) saturate(0.8)" }} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,51,29,0.75), rgba(2,28,16,0.9))` }} />
      </AbsoluteFill>

      {/* Name and acronym */}
      <AbsoluteFill style={{ alignItems: "center", opacity: windowOpacity(frame, 0, l03 + 6, 14) }}>
        <div style={{ position: "absolute", top: 300 - lift * 90, textAlign: "center", width: 1700 }}>
          <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 60, color: BRAND.ink, whiteSpace: "pre" }}>
            {d.fullName.split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  opacity: i < typed ? 1 : 0,
                  color: initials.has(i) && frame > acronymAt - 20 ? BRAND.accent : undefined,
                }}
              >
                {ch}
              </span>
            ))}
            <span style={{ opacity: typed < d.fullName.length && frame % 20 < 10 ? 1 : 0, color: BRAND.accent }}>|</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            {d.acronym.split("").map((ch, i) => {
              const s = spring({ frame: frame - acronymAt - i * 5, fps, config: { damping: 14, mass: 0.8 } });
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontFamily: FONT.sans,
                    fontWeight: 800,
                    fontSize: 220,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    color: "transparent",
                    backgroundImage: GOLD_TEXT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    opacity: Math.min(1, s * 1.4),
                    scale: `${0.6 + 0.4 * s}`,
                    translate: `0px ${(1 - s) * -60}px`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: FONT.sans,
              fontWeight: 500,
              fontSize: 34,
              color: "rgba(245,241,230,0.85)",
              opacity: enter(frame, l02 + 14, 22),
            }}
          >
            {d.tagline}
          </div>
        </div>
      </AbsoluteFill>

      {/* Disciplines */}
        <AbsoluteFill style={{ opacity: windowOpacity(frame, l03 - 6, l04 + 12, 14) }}>
          <Eyebrow start={l03} align="center" style={{ position: "absolute", top: 150, left: 0, right: 0 }}>
            Beragam Disiplin Ilmu
          </Eyebrow>
          <div style={{ position: "absolute", top: 230, left: 270, width: 1380, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
            {d.disciplines.map((item, i) => {
              const at = within(scene, "s02_l03", 0.12 + i * 0.13);
              const s = spring({ frame: frame - at, fps, config: { damping: 18 } });
              return (
                <div
                  key={item.id}
                  style={{
                    height: 250,
                    borderRadius: 22,
                    background: "rgba(4,51,29,0.72)",
                    border: `1px solid rgba(232,212,138,0.35)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    opacity: s,
                    translate: `0px ${(1 - s) * 50}px`,
                    scale: `${0.9 + 0.1 * s}`,
                  }}
                >
                  <Icon name={item.id} size={76} start={at + 4} />
                  <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 36, color: BRAND.ink }}>{item.label}</div>
                  <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 22, color: BRAND.accent, letterSpacing: "0.06em" }}>{item.en}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

      {/* Identity within Muslimat NU */}
        <AbsoluteFill style={{ opacity: enter(frame, l04 + 6, 20) }}>
          <Img
            src={staticFile("apmnu/assets/logo.jpg")}
            style={{
              position: "absolute",
              left: 200,
              top: 250,
              width: 400,
              height: 400,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: `0 0 0 3px ${BRAND.accent}, 0 0 0 14px rgba(232,212,138,0.12), 0 30px 80px rgba(0,0,0,0.5)`,
              scale: `${0.9 + 0.1 * enter(frame, l04 + 6, 30)}`,
            }}
          />
          <div style={{ position: "absolute", left: 720, top: 260, width: 1020 }}>
            <Eyebrow start={l04 + 10}>{d.family}</Eyebrow>
            <div
              style={{
                marginTop: 28,
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 60,
                lineHeight: 1.18,
                color: BRAND.ink,
                opacity: enter(frame, within(scene, "s02_l04", 0.25), 24),
                translate: `0px ${(1 - enter(frame, within(scene, "s02_l04", 0.25), 24)) * 30}px`,
              }}
            >
              {d.mission}
            </div>
            <div
              style={{
                marginTop: 34,
                fontFamily: FONT.serif,
                fontStyle: "italic",
                fontSize: 46,
                color: "transparent",
                backgroundImage: GOLD_TEXT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                opacity: enter(frame, within(scene, "s02_l04", 0.7), 24),
              }}
            >
              {d.manhaj}
            </div>
          </div>
        </AbsoluteFill>

      {/* Sound: typing, a pop per acronym letter then a sparkle, a pop per discipline card, a chime for the logo */}
      <Sfx name="typing" at={typeStart} volume={0.35} />
      {d.acronym.split("").map((ch, i) => (
        <Sfx key={`${ch}${i}`} name="pop" at={acronymAt + i * 5} volume={0.4} rate={1 + i * 0.12} />
      ))}
      <Sfx name="shimmer" at={acronymAt + 26} volume={0.3} />
      {d.disciplines.map((item, i) => (
        <Sfx key={item.id} name="pop" at={within(scene, "s02_l03", 0.12 + i * 0.13)} volume={0.3} rate={0.9 + i * 0.08} />
      ))}
      <Sfx name="chime" at={l04 + 6} volume={0.3} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
