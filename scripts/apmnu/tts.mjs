// Voice-over: one WAV per narration line, then each line's durationMs is written
// back into src/apmnu/data/scenes.json.
// `node scripts/apmnu/tts.mjs` (add `--only s03_l01,s03_l02` to redo some lines)
//
// Voice: the built-in macOS Indonesian voice (Damayanti) is the clearest local
// base, so it is lowered into a male register with Praat's "Change gender"
// (scripts/apmnu/voice/male_voice.py; run voice/setup.sh once). Every line is then
// trimmed and levelled to the same speech loudness so the mix stays even.
// Swap this file for Azure (id-ID-ArdiNeural) or ElevenLabs if a cloud voice is
// available: the rest of the pipeline only needs public/<line.audio> and line.durationMs.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const scenesPath = resolve(root, "src/apmnu/data/scenes.json");
const data = JSON.parse(readFileSync(scenesPath, "utf8"));
const onlyArg = process.argv.indexOf("--only");
const only = onlyArg > -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;

const python = resolve(root, ".venv-tts/bin/python");
if (!existsSync(python)) throw new Error("Voice tools missing. Run: sh scripts/apmnu/voice/setup.sh");

const SR = 44100;
const { name, rate, male, targetRmsDb } = data.voice;
const TARGET_RMS = 10 ** (targetRmsDb / 20);
const PEAK = 10 ** (-1 / 20);
const KEEP_SILENCE = Math.round(0.06 * SR);

/** Pronunciation lexicon for lines without an explicit `tts` override. */
const lexicon = (text) =>
  text
    .replace(/\bAPMNU\b/g, "A Pe Em En U")
    .replace(/\bNU\b/g, "En U")
    .replace(/\bUIN\b/g, "U I N")
    .replace(/\bMURI\b/g, "Muri")
    .replace(/Jama'ah/g, "Jamaah")
    .replace(/[‘’'“”"]/g, "")
    .replace(/–/g, " dan ");

const readWav = (file) => {
  const buf = readFileSync(file);
  let off = 12;
  let fmt = null;
  while (off < buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === "fmt ") fmt = { channels: buf.readUInt16LE(off + 10), rate: buf.readUInt32LE(off + 12), bits: buf.readUInt16LE(off + 22) };
    if (id === "data") {
      if (!fmt || fmt.bits !== 16) throw new Error(`${file}: expected 16-bit PCM`);
      const frames = size / 2 / fmt.channels;
      const samples = new Float32Array(frames);
      for (let i = 0; i < frames; i++) samples[i] = buf.readInt16LE(off + 8 + i * 2 * fmt.channels) / 32768;
      return { samples, rate: fmt.rate };
    }
    off += 8 + size + (size % 2);
  }
  throw new Error(`${file}: no data chunk`);
};

const writeWav = (file, samples) => {
  const pcm = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  writeFileSync(file, Buffer.concat([header, pcm]));
};

/** Trim leading/trailing silence, then level to the target speech RMS (peak-limited). */
const master = (samples) => {
  const threshold = 0.01;
  let a = 0;
  let b = samples.length - 1;
  while (a < b && Math.abs(samples[a]) < threshold) a++;
  while (b > a && Math.abs(samples[b]) < threshold) b--;
  const cut = samples.slice(Math.max(0, a - KEEP_SILENCE), Math.min(samples.length, b + KEEP_SILENCE));
  let sum = 0;
  let count = 0;
  let peak = 0;
  for (const s of cut) {
    peak = Math.max(peak, Math.abs(s));
    if (Math.abs(s) > threshold) {
      sum += s * s;
      count++;
    }
  }
  const rms = Math.sqrt(sum / Math.max(1, count));
  const gain = Math.min(TARGET_RMS / rms, PEAK / peak);
  return cut.map((s) => s * gain);
};

const dir = resolve(root, "public/apmnu/vo");
mkdirSync(dir, { recursive: true });
const raw = resolve(dir, ".raw.wav");
const low = resolve(dir, ".male.wav");

let totalMs = 0;
let words = 0;
for (const scene of data.scenes) {
  for (const line of scene.lines) {
    words += line.id_text.split(/\s+/).length;
    if (only && !only.has(line.id)) {
      totalMs += line.durationMs ?? 0;
      continue;
    }
    const text = line.tts ?? lexicon(line.id_text);
    execFileSync("say", ["-v", name, "-r", String(rate), "--file-format=WAVE", `--data-format=LEI16@${SR}`, "-o", raw, text]);
    execFileSync(python, [
      resolve(root, "scripts/apmnu/voice/male_voice.py"),
      raw,
      low,
      "--pitch",
      String(male.pitch),
      "--formant",
      String(male.formant),
      "--range",
      String(male.range),
    ]);
    const { samples, rate: sr } = readWav(low);
    if (sr !== SR) throw new Error(`Unexpected sample rate ${sr}`);
    const out = master(samples);
    writeWav(resolve(root, "public", line.audio), out);
    line.durationMs = Math.round((out.length / SR) * 1000);
    totalMs += line.durationMs;
    console.log(`${line.id}  ${(line.durationMs / 1000).toFixed(2)}s`);
  }
}
rmSync(raw, { force: true });
rmSync(low, { force: true });

writeFileSync(scenesPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Speech ${(totalMs / 1000).toFixed(1)}s, ${words} words, ${((words / totalMs) * 60000).toFixed(0)} wpm`);
