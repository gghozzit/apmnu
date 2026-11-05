// Writes the bilingual captions from the same timing the composition uses:
//   captions.en.json / captions.en.srt   English only (Caption[] for @remotion/captions)
//   captions.id.srt                      Indonesian only
//   captions.bilingual.srt               English, then Indonesian on a second line
// `node --no-warnings scripts/apmnu/build-captions.mjs`

import { serializeSrt } from "@remotion/captions";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCaptions } from "../../src/apmnu/timeline.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const data = JSON.parse(readFileSync(resolve(root, "src/apmnu/data/scenes.json"), "utf8"));
const captions = buildCaptions(data);
const outDir = resolve(root, "public/apmnu/captions");
mkdirSync(outDir, { recursive: true });

const problems = [];
captions.forEach((c, i) => {
  const seconds = (c.endMs - c.startMs) / 1000;
  if (c.text.length / seconds > 21) problems.push(`${i + 1}: EN ${(c.text.length / seconds).toFixed(1)} chars/s "${c.text}"`);
  if (c.textId.length / seconds > 24) problems.push(`${i + 1}: ID ${(c.textId.length / seconds).toFixed(1)} chars/s "${c.textId}"`);
  if (seconds < 1.0) problems.push(`${i + 1}: only ${seconds.toFixed(2)}s "${c.text}"`);
  if (i > 0 && c.startMs < captions[i - 1].endMs) problems.push(`${i + 1}: overlaps previous caption`);
});

const srt = (pick) => serializeSrt({ lines: captions.map((c) => [{ ...c, text: pick(c) }]) });
const en = captions.map(({ textId, sceneId, ...caption }) => caption);

writeFileSync(resolve(outDir, "captions.en.json"), `${JSON.stringify(en, null, 2)}\n`);
writeFileSync(resolve(outDir, "captions.en.srt"), srt((c) => c.text));
writeFileSync(resolve(outDir, "captions.id.srt"), srt((c) => c.textId));
writeFileSync(resolve(outDir, "captions.bilingual.srt"), srt((c) => `${c.text}\n${c.textId}`));
console.log(`${captions.length} captions written to ${outDir}`);
if (problems.length) console.log(`Check:\n  ${problems.join("\n  ")}`);
