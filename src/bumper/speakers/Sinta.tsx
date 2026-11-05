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
const SintaProfileInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={profileStyle(frame, durationInFrames, fps)}>
      <EventRail name="Event rail" from={0.2 * fps} label={EVENT_TITLE.rail} ruleWidth={RAIL_RULE} />
      <SoftPortrait
        name="Portrait"
        photo="profiles/sinta.jpg"
        photoWidth={612}
        photoHeight={816}
        centerX={460}
        centerY={560}
        maxWidth={420}
        maxHeight={540}
        radius={36}
        feather={30}
      />
      <PanelFrame name="Panel" from={0.3 * fps} left={800} top={150} boxWidth={980} boxHeight={790} />
      <NameBlock
        name="Name"
        from={0.7 * fps}
        left={860}
        top={200}
        textWidth={860}
        size={52}
        personName="Dr. (H.C.) Dra. Hj. Sinta Nuriyah Wahid, M.Hum."
      />
      <Roles
        name="Roles"
        from={1.3 * fps}
        left={860}
        top={386}
        textWidth={860}
        fontSize={22}
        gap={10}
        stagger={7}
        columns={1}
        columnGap={40}
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
        from={3.3 * fps}
        left={860}
        bottom={200}
        textWidth={860}
        fontSize={22}
        text="Profile: A prominent Indonesian woman leader, former First Lady, and advocate for women's rights, women's empowerment, and pluralism."
      />
    </AbsoluteFill>
  );
};

export const SintaProfile = Interactive.create({
  Component: SintaProfileInner,
  layout: "absolute-fill",
  componentName: "BumperSintaProfile",
});

/* Full 16 s bumper: every row below is an independent item on the timeline. */
export const BumperSinta: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <RotatingRosettes name="Rotating rosettes" />
      <FloatingStars name="Floating stars" />
      <Lanterns name="Lanterns" />
      <BumperIntro name="Intro" durationInFrames={3.8 * fps} />
      <LightTrail name="Light trail" from={3.3 * fps} durationInFrames={1.1 * fps} />
      <SintaProfile name="Profile" from={3.9 * fps} durationInFrames={9.5 * fps} />
      <BumperClosing name="Closing" from={13 * fps} durationInFrames={3 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={0.8 * fps} />
      <Fade name="Fade to black" direction="out" from={15.2 * fps} durationInFrames={0.8 * fps} />
      <Audio src={staticFile(BUMPER_MUSIC)} />
    </>
  );
};
