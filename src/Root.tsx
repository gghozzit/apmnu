import { Composition, Folder } from "remotion";
import { Slide08, Slide08Closing, Slide08Intro, Slide08Profile } from "./slides/Slide08";
import { Slide10, Slide10Closing, Slide10Intro, Slide10Profile } from "./slides/Slide10";
import { Slide12, Slide12Closing, Slide12Intro, Slide12Profile } from "./slides/Slide12";
import { Slide14, Slide14Closing, Slide14Intro, Slide14Profile } from "./slides/Slide14";
import { Slide16, Slide16Closing, Slide16Intro, Slide16Profile } from "./slides/Slide16";
// elegant-imports:start
import { ElegantSlide10, ElegantSlide10Closing, ElegantSlide10Intro, ElegantSlide10Profile } from "./elegant/slides/Slide10";
import { ElegantSlide12, ElegantSlide12Closing, ElegantSlide12Intro, ElegantSlide12Profile } from "./elegant/slides/Slide12";
import { ElegantSlide14, ElegantSlide14Closing, ElegantSlide14Intro, ElegantSlide14Profile } from "./elegant/slides/Slide14";
import { ElegantSlide16, ElegantSlide16Closing, ElegantSlide16Intro, ElegantSlide16Profile } from "./elegant/slides/Slide16";
// elegant-imports:end
// bumper-imports:start
import { BumperBassima } from "./bumper/speakers/Bassima";
import { BumperHalimah } from "./bumper/speakers/Halimah";
import { BumperKhofifah } from "./bumper/speakers/Khofifah";
import { BumperNeziha } from "./bumper/speakers/Neziha";
import { BumperSinta } from "./bumper/speakers/Sinta";
// bumper-imports:end
// apmnu-imports:start
import { ApmnuProfile, calculateApmnuMetadata } from "./apmnu/ApmnuProfile";
import apmnuScenes from "./apmnu/data/scenes.json";
import type { ProfileData } from "./apmnu/timeline";
// apmnu-imports:end

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Slide08-KhofifahIndarParawansa">
        <Composition
          id="Slide08-KhofifahIndarParawansa"
          component={Slide08}
          durationInFrames={930}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Slide08-Intro"
          component={Slide08Intro}
          durationInFrames={330}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide08-Profile"
          component={Slide08Profile}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide08-Closing"
          component={Slide08Closing}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
      </Folder>
      <Folder name="Slide10-SintaNuriyah">
        <Composition
          id="Slide10-SintaNuriyah"
          component={Slide10}
          durationInFrames={900}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Slide10-Intro"
          component={Slide10Intro}
          durationInFrames={330}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide10-Profile"
          component={Slide10Profile}
          durationInFrames={420}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide10-Closing"
          component={Slide10Closing}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
      </Folder>
      <Folder name="Slide12-BassimaHakkaoui">
        <Composition
          id="Slide12-BassimaHakkaoui"
          component={Slide12}
          durationInFrames={870}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Slide12-Intro"
          component={Slide12Intro}
          durationInFrames={330}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide12-Profile"
          component={Slide12Profile}
          durationInFrames={390}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide12-Closing"
          component={Slide12Closing}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
      </Folder>
      <Folder name="Slide14-NezihaLabidi">
        <Composition
          id="Slide14-NezihaLabidi"
          component={Slide14}
          durationInFrames={900}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Slide14-Intro"
          component={Slide14Intro}
          durationInFrames={330}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide14-Profile"
          component={Slide14Profile}
          durationInFrames={420}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide14-Closing"
          component={Slide14Closing}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
      </Folder>
      <Folder name="Slide16-HalimahYacob">
        <Composition
          id="Slide16-HalimahYacob"
          component={Slide16}
          durationInFrames={1065}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Slide16-Intro"
          component={Slide16Intro}
          durationInFrames={330}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide16-Profile"
          component={Slide16Profile}
          durationInFrames={585}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
        <Composition
          id="Slide16-Closing"
          component={Slide16Closing}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#075B3C" } }}
        />
      </Folder>
      {/* elegant:start */}
      <Folder name="Elegant">
        <Folder name="Elegant-Slide10-SintaNuriyah">
          <Composition
            id="Elegant-Slide10-SintaNuriyah"
            component={ElegantSlide10}
            durationInFrames={900}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Elegant-Slide10-Intro"
            component={ElegantSlide10Intro}
            durationInFrames={330}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide10-Profile"
            component={ElegantSlide10Profile}
            durationInFrames={420}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide10-Closing"
            component={ElegantSlide10Closing}
            durationInFrames={195}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
        </Folder>
        <Folder name="Elegant-Slide12-BassimaHakkaoui">
          <Composition
            id="Elegant-Slide12-BassimaHakkaoui"
            component={ElegantSlide12}
            durationInFrames={870}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Elegant-Slide12-Intro"
            component={ElegantSlide12Intro}
            durationInFrames={330}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide12-Profile"
            component={ElegantSlide12Profile}
            durationInFrames={390}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide12-Closing"
            component={ElegantSlide12Closing}
            durationInFrames={195}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
        </Folder>
        <Folder name="Elegant-Slide14-NezihaLabidi">
          <Composition
            id="Elegant-Slide14-NezihaLabidi"
            component={ElegantSlide14}
            durationInFrames={900}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Elegant-Slide14-Intro"
            component={ElegantSlide14Intro}
            durationInFrames={330}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide14-Profile"
            component={ElegantSlide14Profile}
            durationInFrames={420}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide14-Closing"
            component={ElegantSlide14Closing}
            durationInFrames={195}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
        </Folder>
        <Folder name="Elegant-Slide16-HalimahYacob">
          <Composition
            id="Elegant-Slide16-HalimahYacob"
            component={ElegantSlide16}
            durationInFrames={1065}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Elegant-Slide16-Intro"
            component={ElegantSlide16Intro}
            durationInFrames={330}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide16-Profile"
            component={ElegantSlide16Profile}
            durationInFrames={585}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
          <Composition
            id="Elegant-Slide16-Closing"
            component={ElegantSlide16Closing}
            durationInFrames={195}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#075B3C" } }}
          />
        </Folder>
      </Folder>
      {/* elegant:end */}
      {/* bumper:start */}
      <Folder name="Bumper16">
        <Composition id="Bumper16-01-KhofifahIndarParawansa" component={BumperKhofifah} durationInFrames={480} fps={30} width={1920} height={1080} />
        <Composition id="Bumper16-02-SintaNuriyah" component={BumperSinta} durationInFrames={480} fps={30} width={1920} height={1080} />
        <Composition id="Bumper16-03-BassimaHakkaoui" component={BumperBassima} durationInFrames={480} fps={30} width={1920} height={1080} />
        <Composition id="Bumper16-04-NezihaLabidi" component={BumperNeziha} durationInFrames={480} fps={30} width={1920} height={1080} />
        <Composition id="Bumper16-05-HalimahYacob" component={BumperHalimah} durationInFrames={480} fps={30} width={1920} height={1080} />
      </Folder>
      {/* bumper:end */}
      {/* apmnu:start */}
      <Folder name="APMNU">
        <Composition
          id="ApmnuProfile"
          component={ApmnuProfile}
          durationInFrames={8550}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ data: apmnuScenes as ProfileData }}
          calculateMetadata={calculateApmnuMetadata}
        />
      </Folder>
      {/* apmnu:end */}
    </>
  );
};
