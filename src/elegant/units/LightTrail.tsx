import { AbsoluteFill, Easing, Interactive, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  lag: 40 + random(`spark-lag-${i}`) * 520,
  dy: (random(`spark-dy-${i}`) - 0.5) * 46,
  size: 2 + random(`spark-s-${i}`) * 3,
  phase: random(`spark-p-${i}`) * Math.PI * 2,
}));

const LightTrailInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const head = interpolate(frame, [0, durationInFrames], [-200, 2200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const envelope = interpolate(frame, [0, 10, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: envelope }}>
      <div
        style={{
          position: "absolute",
          left: head - 900,
          top: 520,
          width: 900,
          height: 40,
          background: "radial-gradient(ellipse 100% 50% at 100% 50%, rgba(242,215,122,0.35), rgba(242,215,122,0) 70%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: head - 760,
          top: 538,
          width: 760,
          height: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, rgba(242,215,122,0), rgba(216,173,54,0.7) 55%, #FFF6E3 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: head - 9,
          top: 530,
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#FFF6E3",
          boxShadow: "0 0 18px 6px rgba(255,246,227,0.85), 0 0 60px 24px rgba(242,215,122,0.45)",
        }}
      />
      {SPARKS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: head - s.lag,
            top: 540 + s.dy + Math.sin(frame / 6 + s.phase) * 4,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: "#F2D77A",
            boxShadow: "0 0 8px rgba(242,215,122,0.8)",
            opacity: (1 - s.lag / 600) * (0.5 + 0.5 * Math.sin(frame / 4 + s.phase)),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const LightTrail = Interactive.create({
  Component: LightTrailInner,
  layout: "absolute-fill",
  componentName: "ElegantLightTrail",
});
