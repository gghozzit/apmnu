import { Audio } from "@remotion/media";
import { AbsoluteFill, Interactive, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Atmosphere } from "../../elegant/units/Atmosphere";
import { Fade } from "../../elegant/units/Fade";
import { LightTrail } from "../../elegant/units/LightTrail";
import { EventRail, NameBlock, PanelFrame, Summary } from "../../elegant/units/ProfileUnits";
import { BumperClosing, BumperIntro, profileStyle } from "../BumperScenes";
import { BUMPER_MUSIC, EVENT_TITLE, RAIL_RULE } from "../event";
import { FloatingStars } from "../units/FloatingStars";
import { Lanterns } from "../units/Lanterns";
import { Roles } from "../units/Roles";
import { RotatingRosettes } from "../units/RotatingRosettes";
import { SoftPortrait } from "../units/SoftPortrait";

/* Profile (9.5 s): framed portrait, panel, name, roles and summary each enter on their own timeline item. */
const HalimahProfileInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={profileStyle(frame, durationInFrames, fps)}>
      <EventRail name="Event rail" from={0.2 * fps} label={EVENT_TITLE.rail} ruleWidth={RAIL_RULE} />
      <SoftPortrait
        name="Portrait"
        photo="profiles/halimah.jpg"
        photoWidth={665}
        photoHeight={822}
        centerX={460}
        centerY={560}
        maxWidth={440}
        maxHeight={540}
        radius={36}
        feather={30}
      />
      <PanelFrame name="Panel" from={0.3 * fps} left={800} top={168} boxWidth={980} boxHeight={764} />
      <NameBlock
        name="Name"
        from={0.7 * fps}
        left={860}
        top={218}
        textWidth={860}
        size={52}
        personName="H.E. Halimah Yacob"
      />
      <Roles
        name="Roles"
        from={1.3 * fps}
        left={860}
        top={336}
        textWidth={860}
        fontSize={22}
        gap={10}
        stagger={7}
        columns={1}
        columnGap={36}
        items={[
          { role: "National Trades Union Congress (NTUC)", separator: ": ", detail: "1978–2011" },
          { role: "Member of Parliament", separator: ": ", detail: "2001–2017" },
          { role: "Minister of State, Ministry of Community Development, Youth and Sports", detail: "" },
          { role: "Speaker of Parliament of Singapore", separator: ": ", detail: "2013–2017" },
          { role: "President of the Republic of Singapore", separator: ": ", detail: "2017–2023" },
          { role: "First Woman President of Singapore", separator: ": ", detail: "2017–2023" },
          { role: "Chancellor, Singapore University of Social Sciences (SUSS)", separator: ": ", detail: "2023–Present" },
        ]}
      />
      <Summary
        name="Summary"
        from={3.3 * fps}
        left={860}
        bottom={200}
        textWidth={860}
        fontSize={22}
        text="Profile: Chancellor of Singapore University of Social Sciences (SUSS), former President of Singapore, former Speaker of Parliament, former Member of Parliament, and a prominent woman leader in labor relations and public service."
      />
    </AbsoluteFill>
  );
};

export const HalimahProfile = Interactive.create({
  Component: HalimahProfileInner,
  layout: "absolute-fill",
  componentName: "BumperHalimahProfile",
});

/* Full 16 s bumper: every row below is an independent item on the timeline. */
export const BumperHalimah: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <RotatingRosettes name="Rotating rosettes" />
      <FloatingStars name="Floating stars" />
      <Lanterns name="Lanterns" />
      <BumperIntro name="Intro" durationInFrames={3.8 * fps} />
      <LightTrail name="Light trail" from={3.3 * fps} durationInFrames={1.1 * fps} />
      <HalimahProfile name="Profile" from={3.9 * fps} durationInFrames={9.5 * fps} />
      <BumperClosing name="Closing" from={13 * fps} durationInFrames={3 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={0.8 * fps} />
      <Fade name="Fade to black" direction="out" from={15.2 * fps} durationInFrames={0.8 * fps} />
      <Audio src={staticFile(BUMPER_MUSIC)} />
    </>
  );
};
