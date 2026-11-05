// Pure timing maths shared by the composition and the Node scripts
// (scripts/apmnu/*.mjs import this file directly, so keep it dependency-free).

export type Line = {
  id: string;
  id_text: string;
  /** id_text cut into caption-sized parts; each pairs with the English part at the same index. */
  id_parts: string[];
  /** Pronunciation override for TTS; falls back to id_text with the lexicon applied. */
  tts?: string;
  en: string[];
  audio: string;
  durationMs: number | null;
};

export type Scene = {
  id: string;
  title: string;
  component: string;
  /** Set to false to keep the on-screen subtitles off this scene (the .srt files still include it). */
  burnInCaptions?: boolean;
  assets: string[];
  padStartMs: number;
  padEndMs: number;
  verify?: string;
  display: Record<string, unknown>;
  lines: Line[];
};

export type ProfileData = {
  fps: number;
  width: number;
  height: number;
  /** Empty band (px) kept clear at the top of every scene, for logos added after rendering. */
  topSafe: number;
  maxDurationSec: number;
  transitionFrames: number;
  lineGapMs: number;
  voice: { engine: string; name: string; rate: number };
  scenes: Scene[];
};

export type TimedLine = Line & {
  /** Start frame relative to the scene. */
  from: number;
  durationInFrames: number;
};

export type TimedScene = Omit<Scene, "lines"> & {
  /** Start frame in the full video (transition overlap already subtracted). */
  start: number;
  durationInFrames: number;
  lines: TimedLine[];
};

export type CaptionEntry = {
  sceneId: string;
  /** English (the `Caption` text). */
  text: string;
  /** Indonesian, as spoken in the narration. */
  textId: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

const toFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const layoutScenes = (data: ProfileData): TimedScene[] => {
  const { fps, transitionFrames, lineGapMs } = data;
  let cursor = 0;
  return data.scenes.map((scene, i) => {
    let ms = scene.padStartMs;
    const lines = scene.lines.map((line, k) => {
      const duration = line.durationMs ?? 3000;
      const timed = { ...line, from: toFrames(ms, fps), durationInFrames: Math.max(1, toFrames(duration, fps)) };
      ms += duration + (k < scene.lines.length - 1 ? lineGapMs : 0);
      return timed;
    });
    ms += scene.padEndMs;
    // Every scene but the first is entered through a transition that eats into its start.
    const durationInFrames = Math.ceil((ms / 1000) * fps) + (i > 0 ? transitionFrames : 0);
    const start = cursor;
    cursor += durationInFrames - transitionFrames;
    const shifted = i > 0 ? lines.map((l) => ({ ...l, from: l.from + transitionFrames })) : lines;
    return { ...scene, start, durationInFrames, lines: shifted };
  });
};

export const totalFrames = (data: ProfileData) => {
  const scenes = layoutScenes(data);
  const last = scenes[scenes.length - 1];
  return last.start + last.durationInFrames;
};

/** Frame (relative to the scene) at which a line starts; used to cue visuals to the narration. */
export const cue = (scene: TimedScene, lineId: string, offsetFrames = 0) => {
  const line = scene.lines.find((l) => l.id === lineId);
  if (!line) throw new Error(`Unknown line ${lineId} in ${scene.id}`);
  return line.from + offsetFrames;
};

/**
 * Bilingual captions: English with its Indonesian counterpart. A multi-part line is
 * split by the character count of the Indonesian parts, since that is what is spoken.
 */
export const buildCaptions = (data: ProfileData): CaptionEntry[] => {
  const { fps } = data;
  const captions: CaptionEntry[] = [];
  for (const scene of layoutScenes(data)) {
    for (const line of scene.lines) {
      if (line.id_parts.length !== line.en.length) {
        throw new Error(`${line.id}: ${line.id_parts.length} id_parts but ${line.en.length} en parts`);
      }
      const startMs = ((scene.start + line.from) / fps) * 1000;
      const lineMs = line.durationMs ?? 3000;
      const chars = line.id_parts.reduce((a, t) => a + t.length, 0);
      let t = startMs;
      line.en.forEach((text, k) => {
        const share = (lineMs * line.id_parts[k].length) / chars;
        const endMs = k === line.en.length - 1 ? startMs + lineMs : t + share;
        captions.push({ sceneId: scene.id, text, textId: line.id_parts[k], startMs: Math.round(t), endMs: Math.round(endMs), timestampMs: null, confidence: null });
        t = endMs;
      });
    }
  }
  return captions;
};

/** Global frame ranges where narration is playing, for ducking the music. */
export const voiceRanges = (data: ProfileData) =>
  layoutScenes(data).flatMap((scene) =>
    scene.lines.map((l) => ({ from: scene.start + l.from, to: scene.start + l.from + l.durationInFrames })),
  );

/** Frame (relative to the scene) at which a line ends. */
export const lineEnd = (scene: TimedScene, lineId: string) => {
  const line = scene.lines.find((l) => l.id === lineId);
  if (!line) throw new Error(`Unknown line ${lineId} in ${scene.id}`);
  return line.from + line.durationInFrames;
};

/** Frame at a fraction of a line's duration, for cueing visuals to words late in a sentence. */
export const within = (scene: TimedScene, lineId: string, fraction: number) => {
  const line = scene.lines.find((l) => l.id === lineId);
  if (!line) throw new Error(`Unknown line ${lineId} in ${scene.id}`);
  return Math.round(line.from + line.durationInFrames * fraction);
};
