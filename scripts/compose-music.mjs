// Synthesises the 16-second bumper theme into public/music/bumper-theme.wav.
// Pure Node, no dependencies: `node scripts/compose-music.mjs`.
//
// Key: G harmonic minor (D Hijaz colour). Cues line up with the video timeline:
//   0.0  drone + string swell        1.2  timpani + harp arpeggio (title)
//   3.3  shimmer riser (light trail)  3.9  profile: Gm – Eb – Cm – D
//  13.0  closing: D → Gm cadence     16.0 silence

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DURATION = 16;
const N = SR * DURATION;
const L = new Float32Array(N);
const R = new Float32Array(N);
const TAU = Math.PI * 2;

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const NOTE = { C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, "F#": 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
const n = (name, octave) => 12 * (octave + 1) + NOTE[name];

// Deterministic noise so every run produces the same file.
let seed = 1234567;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const add = (i, v, pan) => {
  if (i < 0 || i >= N) return;
  L[i] += v * Math.cos((pan + 1) * Math.PI * 0.25);
  R[i] += v * Math.sin((pan + 1) * Math.PI * 0.25);
};

/** Smooth ensemble-strings note: detuned additive saws, slow attack and release. */
const strings = (note, start, end, gain, pan = 0, attack = 0.9, release = 1.3) => {
  const f = midi(note);
  const s0 = Math.floor(start * SR);
  const s1 = Math.floor((end + release) * SR);
  const voices = [-7, 0, 6];
  const harmonics = Math.max(1, Math.min(10, Math.floor(5000 / f)));
  const phases = voices.map(() => rand() * TAU);
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const abs = i / SR;
    const env =
      Math.min(1, t / attack) ** 2 * (abs > end ? Math.max(0, 1 - (abs - end) / release) ** 2 : 1);
    if (env <= 0) continue;
    const vibrato = 1 + 0.0025 * Math.sin(TAU * 5.1 * t + note);
    let v = 0;
    voices.forEach((cents, k) => {
      const fk = f * 2 ** (cents / 1200) * vibrato;
      const ph = TAU * fk * t + phases[k];
      for (let h = 1; h <= harmonics; h++) v += Math.sin(ph * h) / (h * h * 0.6 + h * 0.4);
    });
    add(i, (v / voices.length) * env * gain, pan + 0.15 * Math.sin(t * 0.7 + note));
  }
};

/** Plucked qanun/harp tone via Karplus–Strong. */
const pluck = (note, start, gain, pan = 0, decay = 0.996) => {
  const f = midi(note);
  const period = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(period);
  for (let k = 0; k < period; k++) buf[k] = rand() * 2 - 1;
  const s0 = Math.floor(start * SR);
  const len = Math.floor(3.2 * SR);
  let idx = 0;
  let prev = 0;
  for (let j = 0; j < len; j++) {
    const cur = buf[idx];
    const next = buf[(idx + 1) % period];
    buf[idx] = decay * 0.5 * (cur + next);
    idx = (idx + 1) % period;
    // One-pole lowpass rounds off the attack.
    prev = prev + 0.35 * (cur - prev);
    add(s0 + j, prev * gain * Math.min(1, j / 40), pan);
  }
};

/** Bell / shimmer: inharmonic partials with exponential decay. */
const bell = (note, start, gain, pan = 0, length = 2.6) => {
  const f = midi(note);
  const partials = [
    [1, 1],
    [2.76, 0.45],
    [5.4, 0.22],
    [8.93, 0.1],
  ];
  const s0 = Math.floor(start * SR);
  const len = Math.floor(length * SR);
  for (let j = 0; j < len; j++) {
    const t = j / SR;
    let v = 0;
    for (const [ratio, amp] of partials) v += amp * Math.sin(TAU * f * ratio * t) * Math.exp(-t * (1.6 + ratio * 0.7));
    add(s0 + j, v * gain * Math.min(1, j / 60), pan);
  }
};

/** Soft orchestral timpani: pitch-dropping sine plus a muffled noise thump. */
const timpani = (note, start, gain) => {
  const f = midi(note);
  const s0 = Math.floor(start * SR);
  const len = Math.floor(2.4 * SR);
  let lp = 0;
  let ph = 0;
  for (let j = 0; j < len; j++) {
    const t = j / SR;
    ph += (TAU * f * (1 + 0.18 * Math.exp(-t * 18))) / SR;
    lp += 0.04 * (rand() * 2 - 1 - lp);
    const v = Math.sin(ph) * Math.exp(-t * 1.6) + lp * 3 * Math.exp(-t * 9);
    add(s0 + j, v * gain * Math.min(1, j / 30), 0);
  }
};

/** Filtered-noise swell whose brightness rises with it. */
const riser = (start, end, gain) => {
  const s0 = Math.floor(start * SR);
  const s1 = Math.floor(end * SR);
  let lpL = 0;
  let lpR = 0;
  for (let i = s0; i < s1; i++) {
    const p = (i - s0) / (s1 - s0);
    const cutoff = 0.01 + 0.12 * p * p;
    lpL += cutoff * (rand() * 2 - 1 - lpL);
    lpR += cutoff * (rand() * 2 - 1 - lpR);
    const env = Math.sin(Math.PI * p) ** 1.5 * gain;
    L[i] += lpL * env;
    R[i] += lpR * env;
  }
};

/* ------------------------------------------------------------------ */
/* Score                                                               */
/* ------------------------------------------------------------------ */

// Intro: D drone and a slow open-fifth swell.
strings(n("D", 2), 0, 3.6, 0.16, 0, 1.6, 1.4);
strings(n("A", 2), 0.3, 3.6, 0.1, -0.3, 1.6, 1.4);
strings(n("D", 3), 0.6, 3.6, 0.09, 0.3, 1.4, 1.4);
strings(n("F#", 4), 1.2, 3.6, 0.05, -0.4, 1.2, 1.2);
strings(n("A", 4), 1.2, 3.6, 0.05, 0.4, 1.2, 1.2);

// Title reveal.
timpani(n("D", 2), 1.15, 0.5);
[n("D", 4), n("Eb", 4), n("F#", 4), n("G", 4), n("A", 4), n("D", 5)].forEach((note, i) =>
  pluck(note, 1.2 + i * 0.11, 0.42, i % 2 ? 0.45 : -0.45),
);
bell(n("A", 6), 1.75, 0.06, 0.3);
bell(n("D", 7), 2.05, 0.04, -0.3);

// Light trail.
riser(2.9, 4.1, 0.55);
bell(n("F#", 6), 3.75, 0.05, 0.5, 2);
bell(n("A", 6), 3.85, 0.045, -0.5, 2);

// Profile bed: Gm – Eb – Cm – D, 2.4 s each.
const chords = [
  { at: 3.9, bass: n("G", 2), tones: [n("G", 3), n("Bb", 3), n("D", 4)] },
  { at: 6.3, bass: n("Eb", 2), tones: [n("Eb", 3), n("G", 3), n("Bb", 3)] },
  { at: 8.7, bass: n("C", 2), tones: [n("C", 3), n("Eb", 3), n("G", 3)] },
  { at: 11.1, bass: n("D", 2), tones: [n("D", 3), n("F#", 3), n("A", 3)] },
];
chords.forEach(({ at, bass, tones }, ci) => {
  const end = at + (ci === chords.length - 1 ? 1.9 : 2.4);
  strings(bass, at, end, 0.14, 0, 0.7, 1.1);
  tones.forEach((note, k) => strings(note, at + 0.05 * k, end, 0.06, (k - 1) * 0.5, 0.8, 1.1));
});

// Qanun melody over the profile, in G harmonic minor.
const melody = [
  [4.2, "D", 5], [4.6, "Eb", 5], [5.0, "D", 5], [5.4, "C", 5], [5.8, "Bb", 4],
  [6.6, "G", 4], [7.0, "Bb", 4], [7.4, "C", 5], [7.8, "D", 5], [8.2, "Eb", 5],
  [9.0, "G", 5], [9.4, "F#", 5], [9.8, "Eb", 5], [10.2, "D", 5], [10.6, "C", 5],
  [11.4, "A", 4], [11.8, "Bb", 4], [12.2, "C", 5], [12.6, "D", 5], [12.85, "F#", 5],
];
melody.forEach(([at, name, oct], i) => pluck(n(name, oct), at, 0.3, i % 2 ? 0.3 : -0.3, 0.9965));
// A soft octave echo on phrase starts.
[4.2, 6.6, 9.0, 11.4].forEach((at, i) => pluck(n(["D", "G", "G", "A"][i], 4), at, 0.16, 0));

// Closing: dominant resolves home with a final hit.
timpani(n("G", 1), 13.05, 0.55);
strings(n("G", 2), 13.0, 15.0, 0.16, 0, 0.35, 1.0);
[n("G", 3), n("Bb", 3), n("D", 4), n("A", 4)].forEach((note, k) =>
  strings(note, 13.0 + k * 0.04, 15.0, 0.06, (k - 1.5) * 0.4, 0.4, 1.0),
);
[n("G", 4), n("Bb", 4), n("D", 5), n("G", 5)].forEach((note, i) =>
  pluck(note, 13.05 + i * 0.09, 0.36, i % 2 ? 0.4 : -0.4),
);
bell(n("G", 6), 13.5, 0.06, 0.2, 2.5);
bell(n("D", 7), 13.9, 0.04, -0.2, 2.1);

/* ------------------------------------------------------------------ */
/* Reverb (Freeverb-style) and mastering                               */
/* ------------------------------------------------------------------ */

const reverb = (input, offset) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({
    buf: new Float32Array(d + offset),
    i: 0,
    store: 0,
  }));
  const allpasses = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
  const out = new Float32Array(N);
  const feedback = 0.86;
  const damp = 0.3;
  for (let s = 0; s < N; s++) {
    const x = input[s] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.store = o * (1 - damp) + c.store * damp;
      c.buf[c.i] = x + c.store * feedback;
      c.i = (c.i + 1) % c.buf.length;
      y += o;
    }
    for (const a of allpasses) {
      const b = a.buf[a.i];
      a.buf[a.i] = y + b * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      y = b - y;
    }
    out[s] = y;
  }
  return out;
};

const wetL = reverb(L, 0);
const wetR = reverb(R, 23);
const mixL = new Float32Array(N);
const mixR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 0.25) * Math.min(1, Math.max(0, (DURATION - t) / 1.6));
  mixL[i] = (L[i] * 0.78 + wetL[i] * 0.9) * fade;
  mixR[i] = (R[i] * 0.78 + wetR[i] * 0.9) * fade;
}

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
const gain = 0.89 / peak; // about -1 dBFS

const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  // Gentle soft clip keeps transients round.
  const l = Math.tanh(mixL[i] * gain * 1.1) / Math.tanh(1.1);
  const r = Math.tanh(mixR[i] * gain * 1.1) / Math.tanh(1.1);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, l)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, r)) * 32767), i * 4 + 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/music/bumper-theme.wav");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.concat([header, data]));
console.log(`Wrote ${out} (${DURATION}s, peak gain ${gain.toFixed(2)})`);
