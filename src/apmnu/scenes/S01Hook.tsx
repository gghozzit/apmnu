import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { KenBurns, KineticWords, SceneVoice, Sfx, enter, windowOpacity } from "../components/Primitives";
import { BRAND, FONT, clamp } from "../theme";
import { cue, lineEnd, type TimedScene } from "../timeline";

type Display = { quote: string; quoteBy: string; orgName: string };

/* Hook: the founding quote word by word, the inauguration photo, then the logo opens through an iris. */
export const S01Hook: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const photoAt = cue(scene, "s01_l02");
  const logoAt = lineEnd(scene, "s01_l02") + 4;
  const quoteWords = d.quote.split(" ").length;
  const byAt = 18 + quoteWords * 4 + 8;
  const iris = interpolate(frame, [logoAt, logoAt + 32], [0, 52], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  const ring = interpolate(frame, [logoAt + 6, logoAt + 40], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: windowOpacity(frame, 8, photoAt + 24, 18) }}>
        <div style={{ width: 1400, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 120, lineHeight: 0.6, color: BRAND.gold, opacity: enter(frame, 10, 20) }}>“</div>
          <KineticWords
            text={d.quote}
            start={18}
            stagger={4}
            highlight={["dibumikan"]}
            style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 64, lineHeight: 1.35, color: BRAND.ink }}
          />
          <div
            style={{
              marginTop: 36,
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 28,
              letterSpacing: "0.12em",
              color: BRAND.accent,
              opacity: enter(frame, byAt, 20),
              translate: `0px ${(1 - enter(frame, byAt, 20)) * 16}px`,
            }}
          >
            — {d.quoteBy}
          </div>
        </div>
      </AbsoluteFill>

      <Sequence name="Inauguration photo" from={photoAt} durationInFrames={D - photoAt}>
        <AbsoluteFill style={{ opacity: enter(frame, photoAt, 24), overflow: "hidden", borderRadius: 24 }}>
          <KenBurns src="apmnu/assets/pengukuhan.jpg" from={1.02} to={1.12} panY={-2} />
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(2,28,16,0.25) 0%, rgba(2,28,16,0.15) 45%, rgba(2,28,16,0.85) 100%)`,
            }}
          />
          <AbsoluteFill style={{ backgroundColor: BRAND.deep, opacity: interpolate(frame, [logoAt - 10, logoAt + 20], [0, 0.78], clamp) }} />
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 80,
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: BRAND.accent,
              opacity: windowOpacity(frame, photoAt + 20, logoAt, 15),
            }}
          >
            Pengukuhan Pengurus APMNU · Surabaya, Februari 2026
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence name="Logo reveal" from={logoAt - 10} durationInFrames={D - logoAt + 10}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div style={{ position: "absolute", top: 170, width: 460, height: 460 }}>
            <svg width={560} height={560} viewBox="-50 -50 560 560" style={{ position: "absolute", left: -50, top: -50 }}>
              <circle cx={230} cy={230} r={248} fill="none" stroke={BRAND.accent} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={ring} />
              <circle cx={230} cy={230} r={262} fill="none" stroke={BRAND.gold} strokeWidth={1} opacity={0.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={ring} />
            </svg>
            <Img
              src={staticFile("apmnu/assets/logo.jpg")}
              style={{
                width: 460,
                height: 460,
                borderRadius: "50%",
                objectFit: "cover",
                clipPath: `circle(${iris}% at 50% 50%)`,
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: 680,
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: "0.1em",
              color: BRAND.ink,
              opacity: enter(frame, logoAt + 26, 22),
              translate: `0px ${(1 - enter(frame, logoAt + 26, 22)) * 18}px`,
            }}
          >
            {d.orgName}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sound: a hush on the first word, a riser that lands as the logo opens, then a sparkle */}
      <Sfx name="chime" at={20} volume={0.18} />
      <Sfx name="riser" at={logoAt - 66} volume={0.4} />
      <Sfx name="hit" at={logoAt} volume={0.5} />
      <Sfx name="shimmer" at={logoAt + 6} volume={0.3} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
