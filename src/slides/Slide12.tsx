import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { DetailsPanel, EventLabel, Portrait } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: gold frame draws in, then the event title is revealed. */
const Slide12IntroInner: React.FC = () => {
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

export const Slide12Intro = Interactive.create({
  Component: Slide12IntroInner,
  layout: "absolute-fill",
  componentName: "Slide12Intro",
});

/* Profile: portrait and details panel enter one after the other. */
const Slide12ProfileInner: React.FC = () => {
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
        photo="profiles/bassima.jpg"
        photoWidth={736}
        photoHeight={768}
      />
      <DetailsPanel
        name="Details panel"
        from={1.2 * fps}
        personName="H.E. Dr. Bassima Hakkaoui"
        items={[
            { role: "Member of the House of Representatives of Morocco", separator: ": ", detail: "2002–2019" },
            { role: "Minister of Solidarity, Women, Family and Social Development", separator: ": ", detail: "2012–2019" },
            { role: "Minister of Communication & Government Spokesperson (Interim)", separator: ": ", detail: "2016–2017" },
            { role: "Politician, Justice and Development Party (PJD)", separator: ": ", detail: "sejak 2002" },
            { role: "Women's, Family, and Social Development Policy Expert", detail: "2012–2019" },
        ]}
        summary="Profile: Former Moroccan parliamentarian, former government minister, and prominent woman leader in social policy and women's empowerment."
        stagger={14}
      />
    </AbsoluteFill>
  );
};

export const Slide12Profile = Interactive.create({
  Component: Slide12ProfileInner,
  layout: "absolute-fill",
  componentName: "Slide12Profile",
});

/* Closing: the event identity returns at a faster pace. */
const Slide12ClosingInner: React.FC = () => {
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

export const Slide12Closing = Interactive.create({
  Component: Slide12ClosingInner,
  layout: "absolute-fill",
  componentName: "Slide12Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const Slide12: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <Slide12Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.5 * fps} durationInFrames={2.5 * fps} />
      <Slide12Profile name="Profile" from={10.5 * fps} durationInFrames={13 * fps} />
      <Slide12Closing name="Closing" from={22.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={27.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
