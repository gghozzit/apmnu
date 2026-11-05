import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { ArchPortrait, EventRail, NameBlock, PanelFrame, RolesList, Summary } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: arch frame and medallion draw in, then the event title rises letter by letter. */
const ElegantSlide16IntroInner: React.FC = () => {
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
        scale: interpolate(frame, [durationInFrames - 45, durationInFrames], [1, 1.14], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
          output: "perceptual-scale",
        }),
      }}
    >
      <OrnamentFrame name="Ornament frame" from={2.5 * fps} />
      <TitleText
        name="Event title"
        from={4.6 * fps}
        line1="MALAM PENGANUGRAHAN"
        line2="FATIMAH AL-FIHRIYAH"
        line3="AWARDS"
      />
    </AbsoluteFill>
  );
};

export const ElegantSlide16Intro = Interactive.create({
  Component: ElegantSlide16IntroInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide16Intro",
});

/* Profile: arch portrait, panel, name, roles and summary each enter on their own timeline item. */
const ElegantSlide16ProfileInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(frame, [0, durationInFrames], [1, 1.03], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          output: "perceptual-scale",
        }),
      }}
    >
      <EventRail name="Event rail" from={0.3 * fps} label="MALAM PENGANUGRAHAN FATIMAH AL-FIHRIYAH AWARDS" />
      <ArchPortrait
        name="Portrait"
        from={0.2 * fps}
        photo="profiles/halimah.jpg"
        photoWidth={736}
        photoHeight={912}
        centerX={370}
        maxWidth={380}
        maxHeight={520}
      />
      <PanelFrame name="Panel" from={0.6 * fps} left={650} top={92} boxWidth={1180} boxHeight={896} />
      <NameBlock
        name="Name"
        from={1.3 * fps}
        left={706}
        top={128}
        textWidth={1068}
        size={46}
        personName="H.E. Halimah Yacob"
      />
      <RolesList
        name="Roles"
        from={2.3 * fps}
        left={706}
        top={232}
        textWidth={1068}
        fontSize={20}
        gap={6}
        stagger={12}
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
      />
      <Summary
        name="Summary"
        from={8 * fps}
        left={706}
        bottom={126}
        textWidth={1068}
        fontSize={20}
        text="Profile: Chancellor of Singapore University of Social Sciences (SUSS), former President of Singapore, former Speaker of Parliament, former Member of Parliament, and a prominent woman leader in labor relations and public service."
      />
    </AbsoluteFill>
  );
};

export const ElegantSlide16Profile = Interactive.create({
  Component: ElegantSlide16ProfileInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide16Profile",
});

/* Closing: the event identity returns at a quicker pace before fading to black. */
const ElegantSlide16ClosingInner: React.FC = () => {
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
      <OrnamentFrame name="Ornament frame" from={0.3 * fps} speed={1.8} />
      <TitleText
        name="Event title"
        from={1.5 * fps}
        speed={1.8}
        line1="MALAM PENGANUGRAHAN"
        line2="FATIMAH AL-FIHRIYAH"
        line3="AWARDS"
      />
    </AbsoluteFill>
  );
};

export const ElegantSlide16Closing = Interactive.create({
  Component: ElegantSlide16ClosingInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide16Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const ElegantSlide16: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <ElegantSlide16Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.4 * fps} durationInFrames={2 * fps} />
      <ElegantSlide16Profile name="Profile" from={10.5 * fps} durationInFrames={19.5 * fps} />
      <ElegantSlide16Closing name="Closing" from={29 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={34 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
