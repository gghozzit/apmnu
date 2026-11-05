import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { DetailsPanel, EventLabel, Portrait } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: gold frame draws in, then the event title is revealed. */
const Slide16IntroInner: React.FC = () => {
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

export const Slide16Intro = Interactive.create({
  Component: Slide16IntroInner,
  layout: "absolute-fill",
  componentName: "Slide16Intro",
});

/* Profile: portrait and details panel enter one after the other. */
const Slide16ProfileInner: React.FC = () => {
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
        photo="profiles/halimah.jpg"
        photoWidth={736}
        photoHeight={912} compact
      />
      <DetailsPanel
        name="Details panel"
        from={1.2 * fps}
        personName="H.E. Halimah Yacob"
        items={[
            { role: "National Trades Union Congress (NTUC)", separator: ": ", detail: "1978–2011" },
            { role: "Executive Secretary, United Workers of Electrical and Electronic Industries", separator: ": ", detail: "During her career at the National Trades Union Congress (NTUC)." },
            { role: "Director, Women's Development Secretariat", separator: ": ", detail: "During her career at the National Trades Union Congress (NTUC)." },
            { role: "Director, Legal Services Department, NTUC", separator: ": ", detail: "During her career at the National Trades Union Congress (NTUC)." },
            { role: "Deputy Secretary-General, NTUC", separator: ": ", detail: "During her career at the National Trades Union Congress (NTUC)." },
            { role: "Representative of Singapore, ILO Governing Body", separator: ": ", detail: "12 years" },
            { role: "Member of Parliament", separator: ": ", detail: "2001–2017" },
            { role: "Minister of State, Ministry of Community Development, Youth and Sports", separator: ": ", detail: "Prior to becoming Speaker of Parliament." },
            { role: "Speaker of Parliament of Singapore", separator: ": ", detail: "2013–2017" },
            { role: "President of the Republic of Singapore", separator: ": ", detail: "2017–2023" },
            { role: "First Woman President of Singapore", separator: ": ", detail: "2017–2023" },
            { role: "Chancellor, Singapore University of Social Sciences (SUSS)", separator: ": ", detail: "2023–now" },
            { role: "Honorary Professor, Nazarbayev University", separator: ": ", detail: "2023" },
        ]}
        summary="Profile: Chancellor of Singapore University of Social Sciences (SUSS), former President of Singapore, former Speaker of Parliament, former Member of Parliament, and a prominent woman leader in labor relations and public service."
        stagger={14} compact
      />
    </AbsoluteFill>
  );
};

export const Slide16Profile = Interactive.create({
  Component: Slide16ProfileInner,
  layout: "absolute-fill",
  componentName: "Slide16Profile",
});

/* Closing: the event identity returns at a faster pace. */
const Slide16ClosingInner: React.FC = () => {
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

export const Slide16Closing = Interactive.create({
  Component: Slide16ClosingInner,
  layout: "absolute-fill",
  componentName: "Slide16Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const Slide16: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <Slide16Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.5 * fps} durationInFrames={2.5 * fps} />
      <Slide16Profile name="Profile" from={10.5 * fps} durationInFrames={19.5 * fps} />
      <Slide16Closing name="Closing" from={29 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={34 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
