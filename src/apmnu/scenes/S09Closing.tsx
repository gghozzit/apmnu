import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneVoice, Sfx, enter, windowOpacity } from "../components/Primitives";
import { BRAND, FONT, GOLD_TEXT, clamp } from "../theme";
import { cue, within, type TimedScene } from "../timeline";

type Display = {
  slogan: string[];
  sloganFull: string;
};

/* Closing: the slogan in three words, then the logo alone, held until the fade to black. */
export const S09Closing: React.FC<{ readonly scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = scene.display as Display;
  const D = scene.durationInFrames;
  const l01 = cue(scene, "s09_l01");
  const l02 = cue(scene, "s09_l02");
  const wordAt = [0.3, 0.42, 0.58].map((f) => within(scene, "s09_l01", f));
  const iris = interpolate(frame, [l02, l02 + 30], [0, 52], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });

  return (
    <AbsoluteFill>
      {/* Slogan */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: windowOpacity(frame, 0, l02 + 6, 14) }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 40, color: BRAND.ink, opacity: enter(frame, l01, 20) }}>Untuk Muslimat NU yang</div>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 24 }}>
          {d.slogan.map((w, i) => {
            const s = spring({ frame: frame - wordAt[i], fps, config: { damping: 14 } });
            return (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                {i > 0 ? <div style={{ width: 14, height: 14, rotate: "45deg", background: BRAND.gold, opacity: s }} /> : null}
                <div
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 800,
                    fontSize: 116,
                    color: "transparent",
                    backgroundImage: GOLD_TEXT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    opacity: s,
                    translate: `0px ${(1 - s) * 50}px`,
                  }}
                >
                  {w}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 30, fontFamily: FONT.sans, fontWeight: 500, fontSize: 34, color: "rgba(245,241,230,0.85)", opacity: enter(frame, within(scene, "s09_l01", 0.72), 20) }}>
          bagi umat, bangsa, dan peradaban
        </div>
      </AbsoluteFill>

      {/* Logo alone: opens through an iris, then drifts in slowly until the video fades out */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: enter(frame, l02 - 4, 14) }}>
        <div
          style={{
            width: 520,
            height: 520,
            scale: interpolate(frame, [l02, D], [1, 1.05], { ...clamp, output: "perceptual-scale" }),
          }}
        >
          <Img
            src={staticFile("apmnu/assets/logo.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              clipPath: `circle(${iris}% at 50% 50%)`,
              boxShadow: `0 0 0 3px ${BRAND.accent}, 0 0 0 16px rgba(232,212,138,0.12), 0 30px 80px rgba(0,0,0,0.5)`,
            }}
          />
        </div>
      </AbsoluteFill>

      <Sfx name="whoosh" at={l02 - 12} volume={0.4} />
      {/* Sound: a pop per slogan word, a sparkle and a chime as the logo opens */}
      {wordAt.map((at, i) => (
        <Sfx key={i} name="pop" at={at} volume={0.4} rate={0.9 + i * 0.12} />
      ))}
      <Sfx name="shimmer" at={l02} volume={0.3} />
      <Sfx name="chime" at={l02 + 24} volume={0.25} />
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};
