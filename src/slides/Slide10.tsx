import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { DetailsPanel, EventLabel, Portrait } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: gold frame draws in, then the event title is revealed. */
const Slide10IntroInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [durationInFrames - 45, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
        scale: interpolate(frame, [durationInFrames - 45, durationInFrames], [1, 1.12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
          output: "perceptual-scale",
        }),
      }}
    >
      <OrnamentFrame name="Ornament frame" from={3 * fps} />
      <TitleText
        name="Event title"
        from={5 * fps}
        line1="MALAM PENGANUGRAHAN"
        line2="FATIMAH AL-FIHRIYAH"
        line3="AWARDS"
      />
    </AbsoluteFill>
  );
};

export const Slide10Intro = Interactive.create({
  Component: Slide10IntroInner,
  layout: "absolute-fill",
  componentName: "Slide10Intro",
});

/* Profile: portrait and details panel enter one after the other. */
const Slide10ProfileInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <EventLabel name="Event label" from={0.4 * fps} label="MALAM PENGANUGRAHAN FATIMAH AL-FIHRIYAH AWARDS" />
      <Portrait
        name="Portrait"
        from={0.7 * fps}
        photo="profiles/sinta.jpg"
        photoWidth={636}
        photoHeight={848}
      />
      <DetailsPanel
        name="Details panel"
        from={1.2 * fps}
        personName="Dr. (H.C.) Dra. Hj. Sinta Nuriyah Wahid, M.Hum."
        items={[
            { role: "First Lady of the Republic of Indonesia", detail: "1999–2001" },
            { role: "Founder of Puan Amal Hayati Foundation", detail: "2001–Present" },
            { role: "Chairperson of Puan Amal Hayati Foundation", detail: "2001–Present" },
            { role: "Women's Empowerment Advocate", detail: "Since the 1990s" },
            { role: "Interfaith Dialogue and Tolerance Advocate", detail: "Since the 1990s" },
            { role: "Advocate for Women's Rights and Protection", detail: "2001–Present" },
            { role: "Member and Active Contributor to Various Women's Organizations and Forums", detail: "Various Periods" },
        ]}
        summary="Profile: A prominent Indonesian woman leader, former First Lady, and advocate for women's rights, women's empowerment, and pluralism."
        stagger={14}
      />
    </AbsoluteFill>
  );
};

export const Slide10Profile = Interactive.create({
  Component: Slide10ProfileInner,
  layout: "absolute-fill",
  componentName: "Slide10Profile",
});

/* Closing: the event identity returns at a faster pace. */
const Slide10ClosingInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 1 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <OrnamentFrame name="Ornament frame" from={0.4 * fps} speed={2.2} />
      <TitleText
        name="Event title"
        from={1.3 * fps}
        speed={2.2}
        line1="MALAM PENGANUGRAHAN"
        line2="FATIMAH AL-FIHRIYAH"
        line3="AWARDS"
      />
    </AbsoluteFill>
  );
};

export const Slide10Closing = Interactive.create({
  Component: Slide10ClosingInner,
  layout: "absolute-fill",
  componentName: "Slide10Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const Slide10: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <Slide10Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.5 * fps} durationInFrames={2.5 * fps} />
      <Slide10Profile name="Profile" from={10.5 * fps} durationInFrames={14 * fps} />
      <Slide10Closing name="Closing" from={23.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={28.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
