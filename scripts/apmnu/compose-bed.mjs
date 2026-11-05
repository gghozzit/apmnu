// Music bed + SFX for the APMNU profile, cut to the scene timeline.
// `node --no-warnings scripts/apmnu/compose-bed.mjs` (rerun after tts.mjs changes durations)
//
// F major, warm and unhurried: ambient pad and piano for the opening, a light
// frame-drum pulse from scene 2, a build in Jombang, a D Hijaz qanun motif for
// Egypt, and a major-key resolution at the close.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { layoutScenes, totalFrames } from "../../src/apmnu/timeline.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const data = JSON.parse(readFileSync(resolve(root, "src/apmnu/data/scenes.json"), "utf8"));
const scenes = layoutScenes(data);
const at = Object.fromEntries(scenes.map((s) => [s.id, s.start / data.fps]));
const END = totalFrames(data) / data.fps;

const SR = 44100;
const TAU = Math.PI * 2;
const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const NOTE = { C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, "F#": 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
const n = (name, octave) => 12 * (octave + 1) + NOTE[name];

let seed = 424242;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const makeBuffers = (seconds) => {
  const len = Math.ceil(seconds * SR);
  return { L: new Float32Array(len), R: new Float32Array(len), len };
};

const add = (buf, i, v, pan) => {
  if (i < 0 || i >= buf.len) return;
  buf.L[i] += v * Math.cos((pan + 1) * Math.PI * 0.25);
  buf.R[i] += v * Math.sin((pan + 1) * Math.PI * 0.25);
};

// Band-limited saw wavetable for the pads.
const TABLE = 4096;
const SAW = new Float32Array(TABLE);
for (let h = 1; h <= 28; h++) for (let i = 0; i < TABLE; i++) SAW[i] += Math.sin((TAU * h * i) / TABLE) / h;

const pad = (buf, note, t0, t1, gain, pan = 0, attack = 1.4, release = 1.6) => {
  const f = midi(note);
  const s0 = Math.floor(t0 * SR);
  const s1 = Math.min(buf.len, Math.floor((t1 + release) * SR));
  [-6, 5].forEach((cents, v) => {
    const inc = (f * 2 ** (cents / 1200) * TABLE) / SR;
    let ph = rand() * TABLE;
    let lp = 0;
    for (let i = s0; i < s1; i++) {
      const t = (i - s0) / SR;
      const abs = i / SR;
      const env = Math.min(1, t / attack) ** 2 * (abs > t1 ? Math.max(0, 1 - (abs - t1) / release) ** 2 : 1);
      ph += inc * (1 + 0.002 * Math.sin(TAU * 4.7 * t + note));
      const x = SAW[Math.floor(ph) & (TABLE - 1)];
      lp += 0.06 * (x - lp);
      add(buf, i, lp * env * gain, pan + (v ? 0.25 : -0.25));
    }
  });
};

const piano = (buf, note, t0, gain, pan = 0, length = 3) => {
  const f = midi(note);
  const s0 = Math.floor(t0 * SR);
  const len = Math.floor(length * SR);
  const partials = [
    [1, 0.62],
    [2, 0.24],
    [3, 0.1],
    [4.01, 0.05],
  ];
  for (let j = 0; j < len; j++) {
    const t = j / SR;
    let v = 0;
    partials.forEach(([r, a], k) => {
      v += a * Math.sin(TAU * f * r * t) * Math.exp(-t * (1.1 + k * 0.9));
    });
    add(buf, s0 + j, v * gain * Math.min(1, j / 200), pan);
  }
};

const pluck = (buf, note, t0, gain, pan = 0, decay = 0.9965) => {
  const f = midi(note);
  const period = Math.max(2, Math.round(SR / f));
  const ring = new Float32Array(period);
  for (let k = 0; k < period; k++) ring[k] = rand() * 2 - 1;
  const s0 = Math.floor(t0 * SR);
  let idx = 0;
  let prev = 0;
  for (let j = 0; j < 3 * SR; j++) {
    const cur = ring[idx];
    ring[idx] = decay * 0.5 * (cur + ring[(idx + 1) % period]);
    idx = (idx + 1) % period;
    prev += 0.35 * (cur - prev);
    add(buf, s0 + j, prev * gain * Math.min(1, j / 40), pan);
  }
};

const drum = (buf, t0, gain, pitch = 78) => {
  const s0 = Math.floor(t0 * SR);
  let ph = 0;
  let lp = 0;
  for (let j = 0; j < 0.9 * SR; j++) {
    const t = j / SR;
    ph += (TAU * pitch * (1 + 0.5 * Math.exp(-t * 30))) / SR;
    lp += 0.08 * (rand() * 2 - 1 - lp);
    add(buf, s0 + j, (Math.sin(ph) * Math.exp(-t * 7) + lp * 1.5 * Math.exp(-t * 40)) * gain, 0);
  }
};

const tek = (buf, t0, gain, pan = 0.2) => {
  const s0 = Math.floor(t0 * SR);
  let hp = 0;
  let prevIn = 0;
  for (let j = 0; j < 0.12 * SR; j++) {
    const x = rand() * 2 - 1;
    hp = 0.85 * (hp + x - prevIn);
    prevIn = x;
    add(buf, s0 + j, hp * Math.exp(-(j / SR) * 45) * gain, pan);
  }
};

/* ------------------------------------------------------------------ */
/* Score                                                               */
/* ------------------------------------------------------------------ */

const bed = makeBuffers(END + 3);
const chord = {
  F: [n("F", 2), n("C", 3), n("A", 3), n("C", 4), n("G", 4)],
  Dm: [n("D", 2), n("A", 2), n("F", 3), n("A", 3), n("E", 4)],
  Bb: [n("Bb", 1), n("F", 2), n("D", 3), n("F", 3), n("C", 4)],
  C: [n("C", 2), n("G", 2), n("E", 3), n("G", 3), n("D", 4)],
  Am: [n("A", 1), n("E", 2), n("C", 3), n("E", 3), n("B", 3)],
  Dh: [n("D", 2), n("A", 2), n("D", 3), n("F#", 3), n("A", 3)],
  Gm: [n("G", 1), n("D", 2), n("Bb", 2), n("D", 3), n("A", 3)],
};

/** Lay a progression across [t0, t1), each chord `len` seconds. */
const progression = (names, t0, t1, len, padGain, arp) => {
  let t = t0;
  let k = 0;
  while (t < t1 - 0.5) {
    const name = names[k % names.length];
    const end = Math.min(t + len, t1);
    chord[name].forEach((note, j) => pad(bed, note, t, end, padGain * (j === 0 ? 1.3 : 0.8), (j - 2) * 0.3));
    if (arp) {
      const tones = chord[name].slice(2).map((x) => x + 12);
      for (let s = 0, tt = t + 0.1; tt < end - 0.2; s++, tt += arp.step) {
        if (arp.skip && s % arp.skip === arp.skip - 1) continue;
        piano(bed, tones[s % tones.length] + (s % 4 === 3 ? 12 : 0), tt, arp.gain, s % 2 ? 0.35 : -0.35);
      }
    }
    t = end;
    k++;
  }
};

const BEAT = 60 / 84;

// s01: ambient opening.
progression(["F"], 0, at.s02 + 1, 30, 0.05, null);
[n("A", 4), n("C", 5), n("G", 4), n("F", 4), n("C", 5), n("A", 4), n("G", 4)].forEach((note, i) =>
  piano(bed, note, 2.4 + i * 2.6, 0.12, i % 2 ? 0.3 : -0.3, 4),
);

// s02–s05: gentle progression with piano arpeggios and a soft pulse.
progression(["F", "Dm", "Bb", "C"], at.s02, at.s03, BEAT * 8, 0.045, { step: BEAT, gain: 0.07 });
progression(["Dm", "Bb", "F", "C"], at.s03, at.s04, BEAT * 8, 0.045, { step: BEAT / 2, gain: 0.055, skip: 4 });
progression(["Bb", "F", "C", "Dm"], at.s04, at.s05, BEAT * 8, 0.045, { step: BEAT / 2, gain: 0.05, skip: 3 });
progression(["F", "Am", "Bb", "C"], at.s05, at.s06, BEAT * 8, 0.045, { step: BEAT / 2, gain: 0.055 });
for (let t = at.s02 + BEAT * 8; t < at.s06; t += BEAT * 2) drum(bed, t, 0.18);

// s06: the build — denser arpeggio, pulse on every beat, a high string line.
progression(["Bb", "C", "Dm", "F"], at.s06, at.s07, BEAT * 8, 0.05, { step: BEAT / 2, gain: 0.065 });
for (let t = at.s06; t < at.s07 - BEAT; t += BEAT) {
  drum(bed, t, 0.2);
  tek(bed, t + BEAT / 2, 0.05);
}
for (let t = at.s06 + BEAT * 16; t < at.s07 - 2; t += BEAT * 16) pad(bed, n("F", 5), t, t + BEAT * 14, 0.018, 0.2, 2.5, 2);

// s07: D Hijaz colour for Egypt — drone, qanun phrases, dum-tek.
progression(["Dh", "Gm"], at.s07, at.s08, BEAT * 16, 0.045, null);
const hijaz = ["D", "Eb", "F#", "G", "A", "Bb", "C"];
const phrase = [4, 5, 4, 3, 2, 3, 1, 0, 2, 3, 4, 6, 5, 4, 3, 2];
for (let t = at.s07 + 1, i = 0; t < at.s08 - 1.5; t += BEAT / 2, i++) {
  if (i % 16 > 12) continue;
  const deg = phrase[i % phrase.length];
  pluck(bed, n(hijaz[deg], deg > 4 ? 4 : 4) + (deg <= 1 && i % 32 > 16 ? 12 : 0), t, 0.16, i % 2 ? 0.3 : -0.3);
}
for (let t = at.s07; t < at.s08 - BEAT; t += BEAT * 2) {
  drum(bed, t, 0.18, 70);
  tek(bed, t + BEAT, 0.05, -0.2);
  tek(bed, t + BEAT * 1.5, 0.035, 0.2);
}

// s08: bright return with growing counters.
progression(["F", "C", "Dm", "Bb"], at.s08, at.s09, BEAT * 8, 0.05, { step: BEAT / 2, gain: 0.065 });
for (let t = at.s08; t < at.s09; t += BEAT) drum(bed, t, 0.16);

// s09: resolution — Bb, C, then a held F major to the end.
const holdF = at.s09 + BEAT * 16;
progression(["Bb", "C"], at.s09, holdF, BEAT * 8, 0.05, { step: BEAT, gain: 0.06 });
chord.F.forEach((note, j) => pad(bed, note, holdF, END - 1.5, 0.05 * (j === 0 ? 1.3 : 0.8), (j - 2) * 0.3, 1, 2.5));
[n("F", 4), n("A", 4), n("C", 5), n("F", 5)].forEach((note, i) => piano(bed, note, holdF + i * 0.18, 0.11, i % 2 ? 0.3 : -0.3, 5));
drum(bed, holdF, 0.25);

/* ------------------------------------------------------------------ */
/* Mixing                                                              */
/* ------------------------------------------------------------------ */

const reverb = (input, offset) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({ buf: new Float32Array(d + offset), i: 0, store: 0 }));
  const allpasses = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
  const out = new Float32Array(input.length);
  for (let s = 0; s < input.length; s++) {
    const x = input[s] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.store = o * 0.7 + c.store * 0.3;
      c.buf[c.i] = x + c.store * 0.85;
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

const writeWav = (file, L, R, seconds, fadeIn, fadeOut, wet = 0.85) => {
  const len = Math.min(L.length, Math.ceil(seconds * SR));
  const wetL = reverb(L, 0);
  const wetR = reverb(R, 23);
  const mixL = new Float32Array(len);
  const mixR = new Float32Array(len);
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const fade = Math.min(1, t / fadeIn) * Math.min(1, Math.max(0, (seconds - t) / fadeOut));
    mixL[i] = (L[i] * 0.8 + wetL[i] * wet) * fade;
    mixR[i] = (R[i] * 0.8 + wetR[i] * wet) * fade;
    peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
  }
  const gain = 0.89 / (peak || 1);
  const out = Buffer.alloc(len * 4);
  for (let i = 0; i < len; i++) {
    out.writeInt16LE(Math.round(Math.tanh(mixL[i] * gain) * 32767), i * 4);
    out.writeInt16LE(Math.round(Math.tanh(mixR[i] * gain) * 32767), i * 4 + 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + out.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(2, 22);
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 4, 28);
  header.writeUInt16LE(4, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(out.length, 40);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.concat([header, out]));
};

/* Leave room for the male narration: RBJ biquads, a rumble high-pass and a broad
   cut around the voice's body so the bed can sit audibly under it. */
const biquad = (x, type, f0, q, gainDb = 0) => {
  const w0 = (TAU * f0) / SR;
  const alpha = Math.sin(w0) / (2 * q);
  const A = 10 ** (gainDb / 40);
  const cw = Math.cos(w0);
  let b0, b1, b2, a0, a1, a2;
  if (type === "hp") {
    b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2;
    a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
  } else {
    b0 = 1 + alpha * A; b1 = -2 * cw; b2 = 1 - alpha * A;
    a0 = 1 + alpha / A; a1 = -2 * cw; a2 = 1 - alpha / A;
  }
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const y = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y;
    x[i] = y;
  }
};
for (const ch of [bed.L, bed.R]) {
  biquad(ch, "hp", 60, 0.7);
  biquad(ch, "peak", 280, 0.8, -3.5);
}
writeWav(resolve(root, "public/apmnu/music/bed.wav"), bed.L, bed.R, END, 1.5, 3);
console.log(`bed.wav ${END.toFixed(1)}s`);

/* ------------------------------------------------------------------ */
/* SFX                                                                 */
/* ------------------------------------------------------------------ */

const sfx = (name, seconds, render, wet = 0.4) => {
  const buf = makeBuffers(seconds + 0.6);
  render(buf);
  writeWav(resolve(root, `public/apmnu/sfx/${name}.wav`), buf.L, buf.R, seconds + 0.6, 0.005, 0.3, wet);
  console.log(`sfx/${name}.wav`);
};

// Soft whoosh: noise through a sweeping one-pole lowpass.
sfx("whoosh", 1.2, (buf) => {
  let lp = 0;
  for (let j = 0; j < 1.2 * SR; j++) {
    const p = j / (1.2 * SR);
    lp += (0.01 + 0.2 * Math.sin(Math.PI * p) ** 2) * (rand() * 2 - 1 - lp);
    add(buf, j, lp * Math.sin(Math.PI * p) ** 1.5, (p - 0.5) * 1.2);
  }
  piano(buf, n("C", 6), 0.75, 0.15, 0, 1.5);
  piano(buf, n("G", 6), 0.82, 0.1, 0.2, 1.5);
});

// Timeline tick: a short wooden blip.
sfx("tick", 0.25, (buf) => {
  for (let j = 0; j < 0.25 * SR; j++) {
    const t = j / SR;
    add(buf, j, (Math.sin(TAU * 1500 * t) * 0.6 + Math.sin(TAU * 2900 * t) * 0.25) * Math.exp(-t * 45), 0);
  }
});

// Page flip: rustle with a quick swish.
sfx("flip", 0.45, (buf) => {
  let hp = 0;
  let prevIn = 0;
  for (let j = 0; j < 0.45 * SR; j++) {
    const p = j / (0.45 * SR);
    const x = rand() * 2 - 1;
    hp = 0.92 * (hp + x - prevIn);
    prevIn = x;
    add(buf, j, hp * Math.sin(Math.PI * p) ** 2 * (0.6 + 0.4 * Math.sin(p * 40)), (p - 0.5) * 0.8);
  }
});

// UI click.
sfx("click", 0.15, (buf) => {
  for (let j = 0; j < 0.15 * SR; j++) {
    const t = j / SR;
    add(buf, j, (Math.sin(TAU * 3200 * t) * Math.exp(-t * 120) + (rand() * 2 - 1) * Math.exp(-t * 300) * 0.4), 0);
  }
});

/* ---- Scene effects ---- */

const BELL = [[1, 1], [2.76, 0.45], [5.4, 0.22], [8.93, 0.1]];
const bellTone = (buf, f, t0, gain, length, pan = 0) => {
  const s0 = Math.floor(t0 * SR);
  for (let j = 0; j < length * SR; j++) {
    const t = j / SR;
    let v = 0;
    for (const [r, a] of BELL) v += a * Math.sin(TAU * f * r * t) * Math.exp(-t * (1.7 + r * 0.8));
    add(buf, s0 + j, v * gain * Math.min(1, j / 60), pan);
  }
};
const noiseBurst = (buf, t0, gain, decay, hp, pan = 0) => {
  const s0 = Math.floor(t0 * SR);
  let prevIn = 0;
  let prevOut = 0;
  for (let j = 0; j < 0.2 * SR; j++) {
    const x = rand() * 2 - 1;
    prevOut = hp * (prevOut + x - prevIn);
    prevIn = x;
    add(buf, s0 + j, prevOut * Math.exp(-(j / SR) * decay) * gain, pan);
  }
};

// Soft bubble pop for cards, letters and pills.
sfx("pop", 0.3, (buf) => {
  let ph = 0;
  for (let j = 0; j < 0.3 * SR; j++) {
    const t = j / SR;
    ph += (TAU * (420 + 520 * (1 - Math.exp(-t * 38)))) / SR;
    add(buf, j, Math.sin(ph) * Math.exp(-t * 26), 0);
  }
});

// Warm bell, for reveals and arrivals.
sfx("chime", 2.8, (buf) => {
  bellTone(buf, midi(n("C", 6)), 0, 1, 2.8);
  bellTone(buf, midi(n("G", 6)), 0.09, 0.35, 2.2, 0.3);
}, 0.55);

// Sonar ping with two fading echoes, for map pins and lit provinces.
sfx("ping", 1.6, (buf) => {
  [0, 0.22, 0.44].forEach((d, k) => {
    for (let j = 0; j < 0.7 * SR; j++) {
      const t = j / SR;
      add(buf, Math.floor((d + 0) * SR) + j, Math.sin(TAU * 1480 * t) * Math.exp(-t * 9) * 0.6 ** k, k % 2 ? 0.3 : -0.3);
    }
  });
}, 0.5);

// Typewriter keys while the name is typed out.
sfx("typing", 2.4, (buf) => {
  for (let k = 0; k < 22; k++) {
    const t0 = 0.08 + k * 0.1 + (rand() - 0.5) * 0.03;
    const g = 0.6 + rand() * 0.4;
    noiseBurst(buf, t0, g * 0.5, 120, 0.9, (rand() - 0.5) * 0.4);
    for (let j = 0; j < 0.03 * SR; j++) {
      const t = j / SR;
      add(buf, Math.floor(t0 * SR) + j, Math.sin(TAU * (1500 + rand() * 500) * t) * Math.exp(-t * 110) * g * 0.4, 0);
    }
  }
}, 0.25);

// Rising swell that leads into a reveal; it stops dead at 2.2 s so a hit can land on the cut.
sfx("riser", 2.4, (buf) => {
  let lp = 0;
  let ph = 0;
  for (let j = 0; j < 2.4 * SR; j++) {
    const t = j / SR;
    const p = Math.min(1, t / 2.2);
    const env = t > 2.2 ? Math.max(0, 1 - (t - 2.2) / 0.08) : p ** 2.2;
    lp += (0.01 + 0.3 * p * p) * (rand() * 2 - 1 - lp);
    ph += (TAU * (180 + 700 * p * p)) / SR;
    add(buf, j, (lp * 1.4 + Math.sin(ph) * 0.18 * p) * env, (p - 0.5) * 0.6);
  }
}, 0.5);

// Soft low hit with a high bell: lands on a reveal.
sfx("hit", 2.4, (buf) => {
  let ph = 0;
  let lp = 0;
  for (let j = 0; j < 2 * SR; j++) {
    const t = j / SR;
    ph += (TAU * (46 + 50 * Math.exp(-t * 16))) / SR;
    lp += 0.05 * (rand() * 2 - 1 - lp);
    add(buf, j, Math.sin(ph) * Math.exp(-t * 2.4) * 1.0 + lp * 2.2 * Math.exp(-t * 14), 0);
  }
  bellTone(buf, midi(n("F", 6)), 0.02, 0.25, 2.2, 0.2);
}, 0.55);

// Rising sparkle run, for logos and the acronym forming.
sfx("shimmer", 3, (buf) => {
  const scale = [n("D", 6), n("F", 6), n("G", 6), n("A", 6), n("C", 7), n("D", 7), n("F", 7), n("G", 7)];
  for (let k = 0; k < 16; k++) {
    const t0 = 0.04 + k * 0.07 + rand() * 0.02;
    bellTone(buf, midi(scale[Math.min(scale.length - 1, Math.floor(k / 2))]) , t0, 0.12 + 0.5 * Math.sin(Math.PI * (k / 20)), 1.3, k % 2 ? 0.6 : -0.6);
  }
}, 0.6);

// Counting ticks that start quick and slow to a stop, for the number counters.
sfx("count", 1.9, (buf) => {
  const N = 30;
  for (let k = 0; k < N; k++) {
    const u = k / N;
    const t0 = 1.5 * (1 - (1 - u) ** 2.2);
    for (let j = 0; j < 0.03 * SR; j++) {
      const t = j / SR;
      add(buf, Math.floor(t0 * SR) + j, Math.sin(TAU * (1900 + 700 * u) * t) * Math.exp(-t * 130) * (0.55 + 0.45 * u), 0);
    }
  }
}, 0.2);

// Long pass-by for the flight arc.
sfx("flyby", 4, (buf) => {
  let lp = 0;
  let ph = 0;
  for (let j = 0; j < 4 * SR; j++) {
    const t = j / SR;
    const p = t / 4;
    const env = Math.sin(Math.PI * p) ** 2;
    lp += (0.012 + 0.12 * Math.sin(Math.PI * p)) * (rand() * 2 - 1 - lp);
    ph += (TAU * (110 + 70 * Math.sin(Math.PI * p))) / SR;
    add(buf, j, (lp * 1.6 + Math.sin(ph) * 0.12) * env, -0.9 + 1.8 * p);
  }
}, 0.5);
