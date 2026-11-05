import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { ArchPortrait, EventRail, NameBlock, PanelFrame, RolesList, Summary } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: arch frame and medallion draw in, then the event title rises letter by letter. */
const ElegantSlide14IntroInner: React.FC = () => {
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

export const ElegantSlide14Intro = Interactive.create({
  Component: ElegantSlide14IntroInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide14Intro",
});

/* Profile: arch portrait, panel, name, roles and summary each enter on their own timeline item. */
const ElegantSlide14ProfileInner: React.FC = () => {
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
        photo="profiles/neziha.jpg"
        photoWidth={740}
        photoHeight={740}
        centerX={470}
        maxWidth={420}
        maxHeight={540}
      />
      <PanelFrame name="Panel" from={0.6 * fps} left={800} top={168} boxWidth={980} boxHeight={764} />
      <NameBlock
        name="Name"
        from={1.3 * fps}
        left={860}
        top={220}
        textWidth={860}
        size={54}
        personName="H.E. Neziha Labidi"
      />
      <RolesList
        name="Roles"
        from={2.3 * fps}
        left={860}
        top={335}
        textWidth={860}
        fontSize={24}
        gap={12}
        stagger={12}
        items={[
          { role: "Professor/Teacher in French educational institutions", separator: ": ", detail: "1987–1996" },
          { role: "Regional Councillor for Education, Culture and Training", separator: ": ", detail: "1995–1999" },
          { role: "Director of International Cooperation & External Relations, Ministry of Women and Family", separator: ": ", detail: "1999–2004" },
          { role: "Director of the Advancement of Women", separator: ": ", detail: "2005–2011" },
          { role: "Independent Consultant", separator: ": ", detail: "2011–2016" },
          { role: "Minister of Women, Family and Children of Tunisia", separator: ": ", detail: "2016–2020" },
          { role: "International speaker on women's empowerment", separator: ": ", detail: "setidaknya sejak 2017" },
        ]}
      />
      <Summary
        name="Summary"
        from={5.6 * fps}
        left={860}
        bottom={194}
        textWidth={860}
        fontSize={24}
        text="Profile: Former Tunisian minister, expert in women’s, family, and child policy, and a prominent advocate for women’s empowerment."
      />
    </AbsoluteFill>
  );
};

export const ElegantSlide14Profile = Interactive.create({
  Component: ElegantSlide14ProfileInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide14Profile",
});

/* Closing: the event identity returns at a quicker pace before fading to black. */
const ElegantSlide14ClosingInner: React.FC = () => {
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

export const ElegantSlide14Closing = Interactive.create({
  Component: ElegantSlide14ClosingInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide14Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const ElegantSlide14: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <ElegantSlide14Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.4 * fps} durationInFrames={2 * fps} />
      <ElegantSlide14Profile name="Profile" from={10.5 * fps} durationInFrames={14 * fps} />
      <ElegantSlide14Closing name="Closing" from={23.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={28.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
