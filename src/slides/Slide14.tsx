import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { DetailsPanel, EventLabel, Portrait } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: gold frame draws in, then the event title is revealed. */
const Slide14IntroInner: React.FC = () => {
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

export const Slide14Intro = Interactive.create({
  Component: Slide14IntroInner,
  layout: "absolute-fill",
  componentName: "Slide14Intro",
});

/* Profile: portrait and details panel enter one after the other. */
const Slide14ProfileInner: React.FC = () => {
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
        photo="profiles/neziha.jpg"
        photoWidth={740}
        photoHeight={740}
      />
      <DetailsPanel
        name="Details panel"
        from={1.2 * fps}
        personName="H.E. Neziha Labidi"
        items={[
            { role: "Professor/Teacher in French educational institutions", separator: ": ", detail: "1987–1996" },
            { role: "Regional Councillor for Education, Culture and Training", separator: ": ", detail: "1995–1999" },
            { role: "Director of International Cooperation & External Relations, Ministry of Women and Family", separator: ": ", detail: "1999–2004" },
            { role: "Director of the Advancement of Women", separator: ": ", detail: "2005–2011" },
            { role: "Independent Consultant", separator: ": ", detail: "2011–2016" },
            { role: "Minister of Women, Family and Children of Tunisia", separator: ": ", detail: "2016–2020" },
            { role: "International speaker on women's empowerment", separator: ": ", detail: "setidaknya sejak 2017" },
        ]}
        summary="Profile: Former Tunisian minister, expert in women’s, family, and child policy, and a prominent advocate for women’s empowerment."
        stagger={14}
      />
    </AbsoluteFill>
  );
};

export const Slide14Profile = Interactive.create({
  Component: Slide14ProfileInner,
  layout: "absolute-fill",
  componentName: "Slide14Profile",
});

/* Closing: the event identity returns at a faster pace. */
const Slide14ClosingInner: React.FC = () => {
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

export const Slide14Closing = Interactive.create({
  Component: Slide14ClosingInner,
  layout: "absolute-fill",
  componentName: "Slide14Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const Slide14: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <Slide14Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.5 * fps} durationInFrames={2.5 * fps} />
      <Slide14Profile name="Profile" from={10.5 * fps} durationInFrames={14 * fps} />
      <Slide14Closing name="Closing" from={23.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={28.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
