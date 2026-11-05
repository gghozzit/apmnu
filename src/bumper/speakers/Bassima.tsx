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
const BassimaProfileInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={profileStyle(frame, durationInFrames, fps)}>
      <EventRail name="Event rail" from={0.2 * fps} label={EVENT_TITLE.rail} ruleWidth={RAIL_RULE} />
      <SoftPortrait
        name="Portrait"
        photo="profiles/bassima.jpg"
        photoWidth={777}
        photoHeight={808}
        centerX={460}
        centerY={560}
        maxWidth={440}
        maxHeight={540}
        radius={36}
        feather={30}
      />
      <PanelFrame name="Panel" from={0.3 * fps} left={800} top={198} boxWidth={980} boxHeight={690} />
      <NameBlock
        name="Name"
        from={0.7 * fps}
        left={860}
        top={248}
        textWidth={860}
        size={52}
        personName="H.E. Dr. Bassima Hakkaoui"
      />
      <Roles
        name="Roles"
        from={1.3 * fps}
        left={860}
        top={366}
        textWidth={860}
        fontSize={22}
        gap={10}
        stagger={7}
        columns={1}
        columnGap={40}
        items={[
          { role: "Member of the House of Representatives of Morocco", separator: ": ", detail: "2002–2019" },
          { role: "Minister of Solidarity, Women, Family and Social Development", separator: ": ", detail: "2012–2019" },
          { role: "Minister of Communication & Government Spokesperson (Interim)", separator: ": ", detail: "2016–2017" },
          { role: "Politician, Justice and Development Party (PJD)", separator: ": ", detail: "Since 2002" },
          { role: "Women's, Family, and Social Development Policy Expert", detail: "2012–2019" },
        ]}
      />
      <Summary
        name="Summary"
        from={3 * fps}
        left={860}
        bottom={248}
        textWidth={860}
        fontSize={22}
        text="Profile: Former Moroccan parliamentarian, former government minister, and prominent woman leader in social policy and women's empowerment."
      />
    </AbsoluteFill>
  );
};

export const BassimaProfile = Interactive.create({
  Component: BassimaProfileInner,
  layout: "absolute-fill",
  componentName: "BumperBassimaProfile",
});

/* Full 16 s bumper: every row below is an independent item on the timeline. */
export const BumperBassima: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Atmosphere name="Atmosphere" />
      <RotatingRosettes name="Rotating rosettes" />
      <FloatingStars name="Floating stars" />
      <Lanterns name="Lanterns" />
      <BumperIntro name="Intro" durationInFrames={3.8 * fps} />
      <LightTrail name="Light trail" from={3.3 * fps} durationInFrames={1.1 * fps} />
      <BassimaProfile name="Profile" from={3.9 * fps} durationInFrames={9.5 * fps} />
      <BumperClosing name="Closing" from={13 * fps} durationInFrames={3 * fps} />
      <Fade name="Fade from black" direction="in" durationInFrames={0.8 * fps} />
      <Fade name="Fade to black" direction="out" from={15.2 * fps} durationInFrames={0.8 * fps} />
      <Audio src={staticFile(BUMPER_MUSIC)} />
    </>
  );
};
