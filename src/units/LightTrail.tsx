import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const LightTrailInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 538,
          width: 1000,
          height: 4,
          borderRadius: 4,
          background:
            "linear-gradient(90deg, rgba(242,215,122,0), #F2D77A 70%, #FFF6E3 100%)",
          boxShadow: "0 0 24px 6px rgba(242,215,122,0.4)",
          opacity: interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, durationInFrames], ["-1000px 0px", "1920px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }),
        }}
      />
    </AbsoluteFill>
  );
};

export const LightTrail = Interactive.create({
  Component: LightTrailInner,
  layout: "absolute-fill",
  componentName: "LightTrail",
});
