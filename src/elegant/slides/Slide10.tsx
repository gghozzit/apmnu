import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../units/Atmosphere";
import { Fade } from "../units/Fade";
import { LightTrail } from "../units/LightTrail";
import { OrnamentFrame } from "../units/OrnamentFrame";
import { ArchPortrait, EventRail, NameBlock, PanelFrame, RolesList, Summary } from "../units/ProfileUnits";
import { TitleText } from "../units/TitleText";

/* Intro: arch frame and medallion draw in, then the event title rises letter by letter. */
const ElegantSlide10IntroInner: React.FC = () => {
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

export const ElegantSlide10Intro = Interactive.create({
  Component: ElegantSlide10IntroInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide10Intro",
});

/* Profile: arch portrait, panel, name, roles and summary each enter on their own timeline item. */
const ElegantSlide10ProfileInner: React.FC = () => {
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
        photo="profiles/sinta.jpg"
        photoWidth={636}
        photoHeight={848}
        centerX={470}
        maxWidth={420}
        maxHeight={540}
      />
      <PanelFrame name="Panel" from={0.6 * fps} left={800} top={150} boxWidth={980} boxHeight={780} />
      <NameBlock
        name="Name"
        from={1.3 * fps}
        left={860}
        top={202}
        textWidth={860}
        size={54}
        personName="Dr. (H.C.) Dra. Hj. Sinta Nuriyah Wahid, M.Hum."
      />
      <RolesList
        name="Roles"
        from={2.3 * fps}
        left={860}
        top={390}
        textWidth={860}
        fontSize={24}
        gap={12}
        stagger={12}
        items={[
          { role: "First Lady of the Republic of Indonesia", detail: "1999–2001" },
          { role: "Founder of Puan Amal Hayati Foundation", detail: "2001–Present" },
          { role: "Chairperson of Puan Amal Hayati Foundation", detail: "2001–Present" },
          { role: "Women's Empowerment Advocate", detail: "Since the 1990s" },
          { role: "Interfaith Dialogue and Tolerance Advocate", detail: "Since the 1990s" },
          { role: "Advocate for Women's Rights and Protection", detail: "2001–Present" },
          { role: "Member and Active Contributor to Various Women's Organizations and Forums", detail: "Various Periods" },
        ]}
      />
      <Summary
        name="Summary"
        from={5.6 * fps}
        left={860}
        bottom={194}
        textWidth={860}
        fontSize={24}
        text="Profile: A prominent Indonesian woman leader, former First Lady, and advocate for women's rights, women's empowerment, and pluralism."
      />
    </AbsoluteFill>
  );
};

export const ElegantSlide10Profile = Interactive.create({
  Component: ElegantSlide10ProfileInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide10Profile",
});

/* Closing: the event identity returns at a quicker pace before fading to black. */
const ElegantSlide10ClosingInner: React.FC = () => {
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

export const ElegantSlide10Closing = Interactive.create({
  Component: ElegantSlide10ClosingInner,
  layout: "absolute-fill",
  componentName: "ElegantSlide10Closing",
});

/* Full video: every row below is an independent item on the timeline. */
export const ElegantSlide10: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <ElegantSlide10Intro name="Intro" durationInFrames={11 * fps} />
      <LightTrail name="Light trail" from={9.4 * fps} durationInFrames={2 * fps} />
      <ElegantSlide10Profile name="Profile" from={10.5 * fps} durationInFrames={14 * fps} />
      <ElegantSlide10Closing name="Closing" from={23.5 * fps} durationInFrames={6.5 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={2.5 * fps} />
      <Fade name="Fade to black" direction="out" from={28.5 * fps} durationInFrames={1.5 * fps} />
    </>
  );
};
