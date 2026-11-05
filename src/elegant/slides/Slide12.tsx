import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { ArchPortrait, EventRail, NameBlock, PanelFrame, RolesList, Summary } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: arch frame and medallion draw in, then the event title rises letter by letter. */
const ElegantSlide12IntroInner: React.FC = () => {
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

export const ElegantSlide12Intro = Interactive.create({
  Component: ElegantSlide12IntroInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide12Intro",
});

/* Profile: arch portrait, panel, name, roles and summary each enter on their own timeline item. */
const ElegantSlide12ProfileInner: React.FC = () => {
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
        photo="profiles/bassima.jpg"
        photoWidth={736}
        photoHeight={768}
        centerX={470}
        maxWidth={420}
        maxHeight={540}
      />
      <PanelFrame name="Panel" from={0.6 * fps} left={800} top={198} boxWidth={980} boxHeight={685} />
      <NameBlock
        name="Name"
        from={1.3 * fps}
        left={860}
        top={248}
        textWidth={860}
        size={54}
        personName="H.E. Dr. Bassima Hakkaoui"
      />
      <RolesList
        name="Roles"
        from={2.3 * fps}
        left={860}
        top={363}
        textWidth={860}
        fontSize={24}
        gap={12}
        stagger={12}
        items={[
          { role: "Member of the House of Representatives of Morocco", separator: ": ", detail: "2002–2019" },
          { role: "Minister of Solidarity, Women, Family and Social Development", separator: ": ", detail: "2012–2019" },
          { role: "Minister of Communication & Government Spokesperson (Interim)", separator: ": ", detail: "2016–2017" },
          { role: "Politician, Justice and Development Party (PJD)", separator: ": ", detail: "sejak 2002" },
          { role: "Women's, Family, and Social Development Policy Expert", detail: "2012–2019" },
        ]}
      />
      <Summary
        name="Summary"
        from={4.8 * fps}
        left={860}
        bottom={243}
        textWidth={860}
        fontSize={24}
        text="Profile: Former Moroccan parliamentarian, former government minister, and prominent woman leader in social policy and women's empowerment."
      />
    </AbsoluteFill>
  );
};

export const ElegantSlide12Profile = Interactive.create({
  Component: ElegantSlide12ProfileInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide12Profile",
});

/* Closing: the event identity returns at a quicker pace before fading to black. */
const ElegantSlide12ClosingInner: React.FC = () => {
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

export const ElegantSlide12Closing = Interactive.create({
  Component: ElegantSlide12ClosingInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide12Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const ElegantSlide12: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <ElegantSlide12Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.4 * fps} durationInFrames={2 * fps} />
      <ElegantSlide12Profile name="Profile" from={10.5 * fps} durationInFrames={13 * fps} />
      <ElegantSlide12Closing name="Closing" from={22.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={27.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
