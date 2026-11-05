import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { DetailsPanel, EventLabel, Portrait } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: gold frame draws in, then the event title is revealed. */
const Slide08IntroInner: React.FC = () => {
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

export const Slide08Intro = Interactive.create({
  Component: Slide08IntroInner,
  layout: "absolute-fill",
  componentName: "Slide08Intro",
});

/* Profile: portrait and details panel enter one after the other. */
const Slide08ProfileInner: React.FC = () => {
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
        photo="profiles/khofifah.jpg"
        photoWidth={728}
        photoHeight={624}
      />
      <DetailsPanel
        name="Details panel"
        from={1.2 * fps}
        personName="Dr.(H.C.) Dra. Hj. Khofifah Indar Parawansa, M.Si."
        items={[
            { role: "Member of the Indonesian House of Representatives", detail: "Served for multiple terms" },
            { role: "State Minister for Women's Empowerment", detail: "1999–2001" },
            { role: "Minister of Social Affairs", detail: "2014–2018" },
            { role: "Governor of East Java", detail: "2019–2024" },
            { role: "National Chairperson of Muslimat NU", detail: "2000–2025 (Four Terms)" },
            { role: "Chairperson of the Advisory Board of Muslimat NU", detail: "2025–2030", emphasis: "(Current)" },
            { role: "Governor of East Java", detail: "2025–2030", emphasis: "(Current)" },
        ]}
        summary="Profile: A National Figure in Women's Empowerment, Public Service, and Leadership"
        stagger={14}
      />
    </AbsoluteFill>
  );
};

export const Slide08Profile = Interactive.create({
  Component: Slide08ProfileInner,
  layout: "absolute-fill",
  componentName: "Slide08Profile",
});

/* Closing: the event identity returns at a faster pace. */
const Slide08ClosingInner: React.FC = () => {
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

export const Slide08Closing = Interactive.create({
  Component: Slide08ClosingInner,
  layout: "absolute-fill",
  componentName: "Slide08Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const Slide08: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <Slide08Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.5 * fps} durationInFrames={2.5 * fps} />
      <Slide08Profile name="Profile" from={10.5 * fps} durationInFrames={15 * fps} />
      <Slide08Closing name="Closing" from={24.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={29.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
