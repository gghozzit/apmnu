import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  readonly direction: "in" | "out";
};

const FadeInner: React.FC<Props> = ({ direction }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        pointerEvents: "none",
        opacity: interpolate(
          frame,
          [0, durationInFrames],
          direction === "in" ? [1, 0] : [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    />
  );
};

/** Black overlay: `direction="in"` fades from black, `"out"` fades to black over the item's duration. */
export const Fade = Interactive.create({
  Component: FadeInner,
  layout: "absolute-fill",
  componentName: "Fade",
});
