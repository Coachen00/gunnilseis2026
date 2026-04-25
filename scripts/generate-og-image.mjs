// One-shot generator för Open Graph share image (1200x630).
// Kör: node scripts/generate-og-image.mjs
// Output: public/og-image.png + public/og-image.jpg (fallback för äldre crawlers)
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const W = 1200;
const H = 630;

// Brand-tokens (samma HSL som tailwind.config.ts → gunnilse.*, src/index.css → --background)
const BG = "#0b1118";          // --background HSL(215 30% 6%)
const NAVY = "#0a3a73";        // gunnilse.navy HSL(212 85% 24%)
const SHIELD_BLUE = "#3245a5"; // gunnilse.shield HSL(231 45% 35%)
const GOLD = "#ecbb33";        // gunnilse.gold HSL(47 84% 57%)
const FG = "#f3f4f6";          // foreground HSL(220 20% 96%)
const MUTED = "#919aab";       // muted-foreground

// Lucide Shield path (samma som ikonen i hero)
const SHIELD_PATH = "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="vignette" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="${NAVY}" stop-opacity="0.45"/>
      <stop offset="55%" stop-color="${NAVY}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomfade" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Bas + vignette + fades -->
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="200" fill="url(#topfade)"/>
  <rect y="${H - 200}" width="${W}" height="200" fill="url(#bottomfade)"/>

  <!-- Subtil grid (ljus opacitet) -->
  <g opacity="0.05" stroke="${FG}" stroke-width="1">
    <line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}"/>
    <line x1="${W / 2}" y1="0" x2="${W / 2}" y2="${H}"/>
  </g>

  <!-- Top eyebrow: thin gold line + GUNNILSE IS + thin gold line -->
  <g transform="translate(${W / 2}, 130)">
    <line x1="-220" y1="0" x2="-110" y2="0" stroke="${GOLD}" stroke-width="1.5"/>
    <text x="0" y="6" fill="${FG}"
          font-family="Inter, -apple-system, system-ui, sans-serif"
          font-size="22" font-weight="800"
          letter-spacing="6"
          text-anchor="middle">GUNNILSE IS</text>
    <line x1="110" y1="0" x2="220" y2="0" stroke="${GOLD}" stroke-width="1.5"/>
  </g>

  <!-- Shield icon (lucide), centrerad ovanför rubriken -->
  <g transform="translate(${W / 2 - 36}, 180)">
    <g transform="scale(3)" stroke="${GOLD}" stroke-width="1.4" fill="none"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="${SHIELD_PATH}"/>
    </g>
  </g>

  <!-- Headline: Spelmodell 2026 (2026 i guld) -->
  <text x="${W / 2}" y="430"
        fill="${FG}"
        font-family="Inter, -apple-system, system-ui, sans-serif"
        font-size="120" font-weight="900"
        letter-spacing="-3"
        text-anchor="middle">Spelmodell <tspan fill="${GOLD}">2026</tspan></text>

  <!-- Subline -->
  <text x="${W / 2}" y="490"
        fill="${MUTED}"
        font-family="Inter, -apple-system, system-ui, sans-serif"
        font-size="26" font-weight="500"
        text-anchor="middle">Så här bygger vi. Så här gör vi mål. Så här försvarar vi.</text>

  <!-- Bottom: thin gold line + URL/tagline -->
  <g transform="translate(${W / 2}, 560)">
    <line x1="-180" y1="-22" x2="180" y2="-22" stroke="${GOLD}" stroke-width="1" opacity="0.6"/>
    <text x="0" y="0" fill="${GOLD}"
          font-family="Inter, -apple-system, system-ui, sans-serif"
          font-size="18" font-weight="700"
          letter-spacing="4"
          text-anchor="middle">SPELMODELLEN.SE</text>
  </g>
</svg>`;

const outPng = resolve("public/og-image.png");
const outJpg = resolve("public/og-image.jpg");

await sharp(Buffer.from(svg))
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(outPng);

await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, progressive: true })
  .toFile(outJpg);

console.log(`✓ ${outPng}`);
console.log(`✓ ${outJpg}`);
