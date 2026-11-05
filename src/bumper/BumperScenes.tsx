import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OrnamentFrame } from "../elegant/units/OrnamentFrame";
import { TitleText } from "../elegant/units/TitleText";
import { EVENT_TITLE } from "./event";

/** Third title line is long ("IN SURABAYA, INDONESIA"), so it is set smaller to match the width of line 2. */
const LINE3 = { size: 44, spacing: 0.34, rule: 150 };

/* Intro (3.8 s): arch frame draws in quickly, the title rises, holds, then pushes past the camera. */
const BumperIntroInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = [durationInFrames - 0.55 * fps, durationInFrames];

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, exit, [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
        scale: interpolate(frame, exit, [1, 1.12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
          output: "perceptual-scale",
        }),
      }}
    >
      <OrnamentFrame name="Ornament frame" from={0.2 * fps} speed={2} />
      <TitleText
        name="Event title"
        from={0.8 * fps}
        speed={1.7}
        line1={EVENT_TITLE.line1}
        line2={EVENT_TITLE.line2}
        line3={EVENT_TITLE.line3}
        line3Size={LINE3.size}
        line3Spacing={LINE3.spacing}
        ruleWidth={LINE3.rule}
      />
    </AbsoluteFill>
  );
};

export const BumperIntro = Interactive.create({
  Component: BumperIntroInner,
  layout: "absolute-fill",
  componentName: "BumperIntro",
});

/* Closing (3 s): the event identity returns fast and holds until the fade to black. */
const BumperClosingInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <OrnamentFrame name="Ornament frame" from={0.1 * fps} speed={2.4} />
      <TitleText
        name="Event title"
        from={0.3 * fps}
        speed={2.2}
        line1={EVENT_TITLE.line1}
        line2={EVENT_TITLE.line2}
        line3={EVENT_TITLE.line3}
        line3Size={LINE3.size}
        line3Spacing={LINE3.spacing}
        ruleWidth={LINE3.rule}
      />
    </AbsoluteFill>
  );
};

export const BumperClosing = Interactive.create({
  Component: BumperClosingInner,
  layout: "absolute-fill",
  componentName: "BumperClosing",
});

/* Shared profile wrapper: slow push-in and a short fade at the end. */
export const profileStyle = (frame: number, durationInFrames: number, fps: number): React.CSSProperties => ({
  opacity: interpolate(frame, [durationInFrames - 0.5 * fps, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  scale: interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  }),
});
