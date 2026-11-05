import { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, FONT, clamp } from "../theme";
import { buildCaptions, type ProfileData } from "../timeline";

/** Burned-in bilingual captions: English in italics on top, Indonesian in regular type below. */
export const CaptionTrack: React.FC<{ readonly data: ProfileData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const captions = useMemo(() => {
    const hidden = new Set(data.scenes.filter((s) => s.burnInCaptions === false).map((s) => s.id));
    return buildCaptions(data).filter((c) => !hidden.has(c.sceneId));
  }, [data]);
  const ms = (frame / fps) * 1000;
  const current = captions.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!current) return null;

  const fadeMs = 140;
  const opacity = interpolate(ms, [current.startMs, current.startMs + fadeMs, current.endMs - fadeMs, current.endMs], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 48, pointerEvents: "none" }}
      hidden
    >
      <div
        style={{
          maxWidth: 1560,
          padding: "10px 28px 12px",
          borderRadius: 12,
          background: BRAND.muted,
          backdropFilter: "blur(6px)",
          fontFamily: FONT.sans,
          fontSize: 28,
          lineHeight: 1.35,
          textAlign: "center",
          textWrap: "balance",
          opacity,
        }}
      >
        <div style={{ fontStyle: "italic", fontWeight: 500, color: BRAND.accent }}>{current.text}</div>
        <div style={{ fontStyle: "normal", fontWeight: 500, color: "#FFFFFF", marginTop: 2 }}>{current.textId}</div>
      </div>
    </AbsoluteFill>
  );
};
