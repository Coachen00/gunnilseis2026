// One-shot konverterare: PNG/JPG → WebP (och stora bilder också AVIF).
// Skapar bilder bredvid originalen så de gamla kan ligga kvar som fallback
// tills alla referenser bytts.
//
// Kör: node scripts/convert-images.mjs
//
// Output per bild "foo.png":
//   foo.webp          (alltid)
//   foo.avif          (om originalet är >100 KB)
//   foo@1x.webp       (om originalet är >800px brett — för srcset)
//   foo@2x.webp       (om originalet är >1600px brett)
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse, relative } from "node:path";

const ROOT = new URL("../src/assets/", import.meta.url).pathname.replace(/^\/(\w):\//, "$1:/");

const QUALITY = { webp: 80, avif: 60 };

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield p;
  }
}

function fmtKB(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

let totalOrig = 0;
let totalNew = 0;
const before = [];

for await (const file of walk(ROOT)) {
  const info = await stat(file);
  totalOrig += info.size;
  const { dir, name } = parse(file);
  const webpOut = join(dir, `${name}.webp`);

  const meta = await sharp(file).metadata();
  const width = meta.width || 0;

  // Bas-WebP
  await sharp(file).webp({ quality: QUALITY.webp, effort: 5 }).toFile(webpOut);
  const webpInfo = await stat(webpOut);
  totalNew += webpInfo.size;

  const rel = relative(ROOT, file).replace(/\\/g, "/");
  before.push({ rel, orig: info.size, webp: webpInfo.size, width });

  // AVIF för tunga bilder
  if (info.size > 100 * 1024) {
    const avifOut = join(dir, `${name}.avif`);
    await sharp(file).avif({ quality: QUALITY.avif, effort: 4 }).toFile(avifOut);
  }

  // Mindre srcset-variant om originalet är brett
  if (width >= 1600) {
    await sharp(file)
      .resize({ width: 1280 })
      .webp({ quality: QUALITY.webp, effort: 5 })
      .toFile(join(dir, `${name}@1280.webp`));
  }
  if (width >= 1280) {
    await sharp(file)
      .resize({ width: 800 })
      .webp({ quality: QUALITY.webp, effort: 5 })
      .toFile(join(dir, `${name}@800.webp`));
  }
}

console.log("\nBild-pipeline klar.");
console.log(`Original PNG/JPG total: ${fmtKB(totalOrig)}`);
console.log(`WebP-baselines total:    ${fmtKB(totalNew)}`);
console.log(
  `Reduktion: ${Math.round(((totalOrig - totalNew) / totalOrig) * 100)}% (WebP-baseline ensam)`,
);
console.log(`\n${before.length} bilder konverterade.`);
const top = [...before].sort((a, b) => b.orig - a.orig).slice(0, 10);
console.log("\nTopp-10 originalstorlek → WebP:");
for (const b of top) {
  const pct = Math.round(((b.orig - b.webp) / b.orig) * 100);
  console.log(`  ${b.rel.padEnd(48)} ${fmtKB(b.orig).padStart(8)} → ${fmtKB(b.webp).padStart(8)} (-${pct}%)`);
}
