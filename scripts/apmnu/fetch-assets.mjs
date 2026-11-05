// Downloads the APMNU documentation assets into public/apmnu/assets/ and writes
// src/apmnu/data/assets.json. `node scripts/apmnu/fetch-assets.mjs`
//
// Media-owned photos (mediapetisi.net, NU Online) are listed but not downloaded
// until the newsroom grants permission. ANTARA content is never fetched.

import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = resolve(root, "public/apmnu/assets");
const manifestPath = resolve(root, "src/apmnu/data/assets.json");

const APMNU = "APMNU permission required";
const MEDIA = "media permission required";

const ASSETS = [
  { id: "logo", url: "https://apmnu.org/logo-apmnu.jpeg", sourcePage: "apmnu.org", caption: "Official logo", date: null, license: APMNU, sceneIds: ["s01", "s02", "s09"] },
  { id: "pengukuhan", url: "https://cdn.apmnu.site/galeri/pengukuhan-2.jpeg", sourcePage: "apmnu.org (og:image)", caption: "Board inauguration", date: "2026-02", license: APMNU, sceneIds: ["s01", "s03"] },
  { id: "khofifah", url: "https://apmnu.org/sambutan-khofifah.png", sourcePage: "apmnu.org", caption: "Chair of the Advisory Board", date: null, license: APMNU, sceneIds: ["s03", "s05"] },
  { id: "amany", url: "https://cdn.apmnu.site/galeri/sambutan-prof-amany-2.jpeg", sourcePage: "apmnu.org", caption: "General Chair", date: null, license: APMNU, sceneIds: ["s05"] },
  { id: "rakornas-mnu", url: "https://muslimatnu.or.id/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-07-at-11.57.36.jpeg", sourcePage: "muslimatnu.or.id (8 Feb 2026)", caption: "APMNU National Coordination Meeting", date: "2026-02-07", license: APMNU, sceneIds: ["s02", "s03", "s04"] },
  { id: "poster-seminar", url: "https://s3.apmnu.org/apmnu-storage/agenda/1787582021768-Screenshot%202026-08-24%20at%2021.31.14.png", sourcePage: "apmnu.org (agenda)", caption: "National Seminar poster", date: "2026-08", license: APMNU, sceneIds: ["s06"] },
  { id: "launch-website", url: "https://s3.apmnu.org/apmnu-storage/agenda/1787745208258-WhatsApp%20Image%202026-08-23%20at%207.01.13%20PM.jpeg", sourcePage: "apmnu.org (agenda)", caption: "Website launch", date: "2026-08-28", license: APMNU, sceneIds: ["s06"] },
  { id: "launch-buku", url: "https://s3.apmnu.org/apmnu-storage/agenda/1787745266506-WhatsApp%20Image%202026-08-23%20at%207.00.48%20PM.jpeg", sourcePage: "apmnu.org (agenda)", caption: "Book launch", date: "2026-08-28", license: APMNU, sceneIds: ["s06"] },
  { id: "launch-jurnal", url: "https://s3.apmnu.org/apmnu-storage/agenda/1787745321127-WhatsApp%20Image%202026-08-25%20at%2010.38.51%20AM.jpeg", sourcePage: "apmnu.org (agenda)", caption: "Journal launch", date: "2026-08-28", license: APMNU, sceneIds: ["s06"] },
  { id: "jurnal-logo", url: "https://journal.apmnu.org/public/journals/1/pageHeaderLogoImage_en.png", sourcePage: "journal.apmnu.org", caption: "Journal logo", date: null, license: APMNU, sceneIds: ["s06"] },
  { id: "jurnal-cover", url: "https://journal.apmnu.org/public/journals/1/cover_issue_1_en.jpg", sourcePage: "journal.apmnu.org", caption: "Vol. 1 No. 1 cover", date: null, license: APMNU, sceneIds: ["s06"] },
  { id: "poster-benchmark", url: "https://s3.apmnu.org/apmnu-storage/agenda/1791036389773-Poster%20Benchmarking%20Akademik%20Mesir%20dan%20Arab%20Saudi.png", sourcePage: "apmnu.org (agenda)", caption: "Academic Benchmarking poster", date: "2026-10", license: APMNU, sceneIds: ["s07"] },
  { id: "kbri-kairo", url: "https://s3.apmnu.org/apmnu-storage/post/image/fa9f870b-3ec8-4a99-901b-2c1a7ca81920/cover-fa9f870b-3ec8-4a99-901b-2c1a7ca81920.jpg?v=1792941053439", sourcePage: "apmnu.org (liputan)", caption: "Visit to the Indonesian Embassy in Cairo", date: "2026-10-15", license: APMNU, sceneIds: ["s07"] },
  { id: "pci-mesir", url: "https://s3.apmnu.org/apmnu-storage/post/image/221a99e2-d157-45fe-927d-1e9f1cc5c7bf/cover-221a99e2-d157-45fe-927d-1e9f1cc5c7bf.jpg?v=1792939958770", sourcePage: "apmnu.org (liputan)", caption: "PCI Muslimat NU Egypt inauguration", date: "2026-10-18", license: APMNU, sceneIds: ["s07"] },
  { id: "suez", url: "https://s3.apmnu.org/apmnu-storage/post/image/8793cdab-bf0d-4ba4-be1b-8a84801caf3e/cover-8793cdab-bf0d-4ba4-be1b-8a84801caf3e.jpg?v=1792938699240", sourcePage: "apmnu.org (liputan)", caption: "Suez Canal University visit", date: "2026-10-18", license: APMNU, sceneIds: ["s07", "s08"] },
  { id: "webinar-kartini", local: "bjombang/Legacy R.A. Kartini untuk Peradaban Bangsa.jpeg", sourcePage: "provided by APMNU", caption: "Webinar Perdana: Legacy R.A. Kartini untuk Peradaban Bangsa", date: "2026-04-21", license: APMNU, sceneIds: ["s05b"] },
  { id: "webinar-hardiknas", local: "bjombang/Pendidikan Inklusi dan Ramah Anak.jpeg", sourcePage: "provided by APMNU", caption: "Webinar Hardiknas: Pendidikan Inklusi & Ramah Anak", date: "2026-05-02", license: APMNU, sceneIds: ["s05b"] },
  { id: "webinar-brin", local: "bjombang/Kebangkitan Periset perempuan Indonesia.jpeg", sourcePage: "provided by APMNU", caption: "Webinar: Kebangkitan Riset Perempuan Indonesia", date: "2026-05-20", license: APMNU, sceneIds: ["s05b"] },
  { id: "liga-universitas", local: "bjombang/Mesir.jpeg", sourcePage: "provided by APMNU", caption: "Visit to the Islamic Universities League, Cairo", date: "2026-10", license: APMNU, sceneIds: ["s07"] },
  { id: "muri-1", local: "MURI/Muri1.jpeg", sourcePage: "provided by APMNU", caption: "Two MURI certificates presented to Muslimat NU", date: "2026-04-11", license: APMNU, sceneIds: ["s08"] },
  { id: "muri-organisasi", local: "MURI/Organisasi Kemasyarakatan dengan Anggota Profesor Perempuan Terbanyak.jpeg", sourcePage: "provided by APMNU", caption: "MURI certificate No. 12683/R.MURI/IV/2026", date: "2026-04-11", license: APMNU, sceneIds: ["s08"] },
  { id: "muri-forum", local: "MURI/Forum Nasional yang Melibatkan Profesor Perempuan dengan Disiplin Ilmu Terbanyak.jpeg", sourcePage: "provided by APMNU", caption: "MURI certificate No. 12684/R.MURI/IV/2026", date: "2026-04-11", license: APMNU, sceneIds: ["s08"] },
  { id: "seminar-foto", url: "https://mediapetisi.net/wp-content/uploads/2026/08/IMG-20260828-WA0031.jpg", sourcePage: "mediapetisi.net", caption: "APMNU chair with seminar participants", date: "2026-08-28", license: MEDIA, sceneIds: ["s06"], skip: true },
  { id: "presscon", url: "https://storage.nu.or.id/storage/post/16_9/mid/whatsapp-image-2026-08-28-at-151056_1787913724.webp", sourcePage: "NU Online Jatim", caption: "Launch press conference (Foto: NOJ/RS)", date: "2026-08-28", license: MEDIA, sceneIds: ["s06"], skip: true },
];

const extOf = (url, contentType) => {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  const m = (url.startsWith("http") ? decodeURIComponent(new URL(url).pathname) : url).match(/\.(\w+)$/);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
};

const dims = (file) => {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  return {
    width: Number(out.match(/pixelWidth: (\d+)/)?.[1] ?? 0),
    height: Number(out.match(/pixelHeight: (\d+)/)?.[1] ?? 0),
  };
};

mkdirSync(outDir, { recursive: true });
mkdirSync(dirname(manifestPath), { recursive: true });

const manifest = [];
for (const asset of ASSETS) {
  const { skip, ...entry } = asset;
  if (skip) {
    manifest.push({ ...entry, file: null, status: "skipped: awaiting media permission" });
    console.log(`skip  ${asset.id}`);
    continue;
  }
  if (entry.local) {
    const src = resolve(root, entry.local);
    const rel = `apmnu/assets/${asset.id}.${extOf(src, null)}`;
    copyFileSync(src, resolve(root, "public", rel));
    const { width, height } = dims(resolve(root, "public", rel));
    manifest.push({ ...entry, file: rel, width, height, bytes: statSync(resolve(root, "public", rel)).size, lowres: width < 1280, status: "ok (local)" });
    console.log(`local ${asset.id} ${width}x${height}`);
    continue;
  }
  try {
    const res = await fetch(asset.url, { headers: { "User-Agent": "Mozilla/5.0 (APMNU profile production)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 20 * 1024) throw new Error(`too small (${buf.length} bytes)`);
    const ext = extOf(asset.url, res.headers.get("content-type"));
    const rel = `apmnu/assets/${asset.id}.${ext}`;
    const abs = resolve(root, "public", rel);
    writeFileSync(abs, buf);
    const { width, height } = dims(abs);
    manifest.push({ ...entry, file: rel, width, height, bytes: statSync(abs).size, lowres: width < 1280, status: "ok" });
    console.log(`ok    ${asset.id} ${width}x${height}${width < 1280 ? " (lowres)" : ""}`);
  } catch (err) {
    manifest.push({ ...entry, file: null, status: `failed: ${err.message}` });
    console.log(`FAIL  ${asset.id}: ${err.message}`);
  }
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifest: ${manifestPath}`);
