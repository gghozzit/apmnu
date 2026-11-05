import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Fragment, useMemo } from "react";
import { AbsoluteFill, type CalculateMetadataFunction, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionTrack } from "./components/CaptionTrack";
import { Backdrop, Sfx } from "./components/Primitives";
import { S01Hook } from "./scenes/S01Hook";
import { S02Who } from "./scenes/S02Who";
import { S03History } from "./scenes/S03History";
import { S04Values } from "./scenes/S04Values";
import { S05Leadership } from "./scenes/S05Leadership";
import { S05bWebinars } from "./scenes/S05bWebinars";
import { S06Jombang } from "./scenes/S06Jombang";
import { S07Egypt } from "./scenes/S07Egypt";
import { S08Achievements } from "./scenes/S08Achievements";
import { S09Closing } from "./scenes/S09Closing";
import { clamp } from "./theme";
import { layoutScenes, totalFrames, voiceRanges, type ProfileData, type TimedScene } from "./timeline";

export type ApmnuProfileProps = { readonly data: ProfileData };

const SCENES: Record<string, React.FC<{ readonly scene: TimedScene }>> = {
  S01Hook,
  S02Who,
  S03History,
  S04Values,
  S05Leadership,
  S05bWebinars,
  S06Jombang,
  S07Egypt,
  S08Achievements,
  S09Closing,
};

/**
 * Fits a scene into the area below the reserved top band, leaving that band empty for
 * logos added after rendering. Scaled from the bottom centre so the scene stays centred.
 */
const SceneFrame: React.FC<{ readonly topSafe: number; readonly children: React.ReactNode }> = ({ topSafe, children }) => {
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ scale: (height - topSafe) / height, transformOrigin: "50% 100%" }}>{children}</AbsoluteFill>
  );
};

// Bed RMS is about -18 dBFS at volume 1 and speech about -19 dBFS (VO_VOLUME 1).
// Under the voice the bed sits ~10 dB lower (~-29 dBFS); between lines it comes up to ~-22 dBFS.
const MUSIC_LEVEL = 0.65;
const MUSIC_UNDER_VOICE = 0.3;

export const calculateApmnuMetadata: CalculateMetadataFunction<ApmnuProfileProps> = ({ props }) => {
  const frames = totalFrames(props.data);
  if (frames > props.data.maxDurationSec * props.data.fps) {
    throw new Error(`Video is ${(frames / props.data.fps).toFixed(1)}s, over the ${props.data.maxDurationSec}s limit`);
  }
  return { durationInFrames: frames, fps: props.data.fps, width: props.data.width, height: props.data.height };
};

export const ApmnuProfile: React.FC<ApmnuProfileProps> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scenes = useMemo(() => layoutScenes(data), [data]);
  const ranges = useMemo(() => voiceRanges(data), [data]);
  const t = data.transitionFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Backdrop />
      <TransitionSeries name="Scenes">
        {scenes.map((scene, i) => {
          const Scene = SCENES[scene.component];
          return (
            <Fragment key={scene.id}>
              {i > 0 ? (
                <TransitionSeries.Transition
                  presentation={scene.id === "s03" ? slide({ direction: "from-right" }) : fade()}
                  timing={linearTiming({ durationInFrames: t })}
                />
              ) : null}
              <TransitionSeries.Sequence name={`${scene.id} ${scene.title}`} durationInFrames={scene.durationInFrames}>
                <SceneFrame topSafe={data.topSafe}>
                  <Scene scene={scene} />
                </SceneFrame>
              </TransitionSeries.Sequence>
            </Fragment>
          );
        })}
      </TransitionSeries>

      <Audio
        src={staticFile("apmnu/music/bed.wav")}
        volume={(f) => {
          let duck = 0;
          for (const r of ranges) duck = Math.max(duck, interpolate(f, [r.from - 8, r.from, r.to, r.to + 14], [0, 1, 1, 0], clamp));
          return interpolate(duck, [0, 1], [MUSIC_LEVEL, MUSIC_UNDER_VOICE]);
        }}
      />
      {scenes.slice(1).map((scene) => (
        <Sfx key={scene.id} name="whoosh" at={scene.start} volume={scene.id === "s03" ? 0.35 : 0.22} />
      ))}
      <CaptionTrack data={data} />
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: Math.max(interpolate(frame, [0, 40], [1, 0], clamp), interpolate(frame, [durationInFrames - 40, durationInFrames - 4], [0, 1], clamp)),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
