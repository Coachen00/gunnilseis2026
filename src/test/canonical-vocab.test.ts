import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/**
 * Kanonisk vokabulärskontroll.
 *
 * Single source of truth: src/data/principles.ts (VOCAB).
 * Detta test scannar alla sidor och komponenter och varnar om
 * förbjudna synonymer används istället för de kanoniska termerna.
 *
 * Lägg till nya regler i FORBIDDEN_TERMS när vokabulären utökas.
 */

interface Rule {
  /** Regex som matchar förbjuden variant (case-insensitive, word-boundary där lämpligt) */
  pattern: RegExp;
  /** Den kanoniska term som ska användas istället */
  canonical: string;
  /** Förklaring till varför */
  reason: string;
}

const FORBIDDEN_TERMS: Rule[] = [
  // gyllene zonen (svenska) — engelska "gold zone" / "golden zone" får endast finnas i source-citat i principles.ts
  {
    pattern: /\bgold(en)?\s*zone\b/i,
    canonical: "gyllene zonen",
    reason: "Använd svenska 'gyllene zonen' i UI. Engelska endast i källcitat.",
  },
  // assistytan — inte "assistzon" / "assist zone" / "assist-yta"
  {
    pattern: /\bassist(\s|-)?zon(en)?\b/i,
    canonical: "assistytan",
    reason: "Kanonisk term är 'assistytan' (inte assistzon).",
  },
  {
    pattern: /\bassist\s*zone\b/i,
    canonical: "assistytan",
    reason: "Använd svenska 'assistytan' i UI.",
  },
  // rättvänd — inte "vänd rätt" / "framåtvänd"
  {
    pattern: /\bframåtvänd\b/i,
    canonical: "rättvänd",
    reason: "Kanonisk term är 'rättvänd'.",
  },
  // grundförutsättningar — säkerställ stavning, varna för "spel-bredd" osv
  {
    pattern: /\bspel[-\s]bredd\b/i,
    canonical: "spelbredd",
    reason: "Skrivs i ett ord: 'spelbredd'.",
  },
  {
    pattern: /\bspel[-\s]djup\b/i,
    canonical: "speldjup",
    reason: "Skrivs i ett ord: 'speldjup'.",
  },
  {
    pattern: /\bspel[-\s]avstånd\b/i,
    canonical: "spelavstånd",
    reason: "Skrivs i ett ord: 'spelavstånd'.",
  },
  {
    pattern: /\bspel[-\s]barhet\b/i,
    canonical: "spelbarhet",
    reason: "Skrivs i ett ord: 'spelbarhet'.",
  },
  // Kanoniska handlingsfraser (VOCAB.actions i principles.ts)
  {
    pattern: /\b2:a\s*boll/i,
    canonical: "andrabollar",
    reason: "Kanonisk term är 'andraboll/andrabollar' (identitetsblocket heter Andrabollsspel).",
  },
  {
    pattern: /\bboxfyllnad\b/i,
    canonical: "fyll boxen",
    reason: "Kanonisk handlingsfras är 'fyll boxen' (blockens remember-rad). Slug 'boxfyllnad' är ok.",
  },
];

/** Filer som FÅR innehålla de förbjudna termerna (källcitat, testet självt). */
const ALLOWLIST = new Set<string>([
  "src/data/principles.ts",
  "src/test/canonical-vocab.test.ts",
]);

const SCAN_DIRS = ["src/pages", "src/components"];
const EXTS = new Set([".ts", ".tsx"]);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (EXTS.has(extname(entry))) out.push(full);
  }
  return out;
}

/**
 * Strippar block- och radkommentarer så att kommentarer (t.ex. JSDoc med
 * engelska tekniska termer) inte triggar regler. Behåller radlängd grovt.
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

describe("Kanonisk vokabulär", () => {
  const files = SCAN_DIRS.flatMap((d) => {
    try {
      return walk(d);
    } catch {
      return [];
    }
  });

  it("scannar minst en fil", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const rel = file.replace(/\\/g, "/");
    if (ALLOWLIST.has(rel)) continue;

    it(`${rel} använder endast kanoniska termer`, () => {
      const raw = readFileSync(file, "utf8");
      const src = stripComments(raw);
      const violations: string[] = [];

      for (const rule of FORBIDDEN_TERMS) {
        const matches = src.match(new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g"));
        if (matches && matches.length > 0) {
          violations.push(
            `  ✗ Hittade "${matches[0]}" (${matches.length}x) — använd "${rule.canonical}". ${rule.reason}`
          );
        }
      }

      if (violations.length > 0) {
        throw new Error(
          `Vokabulärbrott i ${rel}:\n${violations.join("\n")}\n\n` +
            `Kanonisk källa: src/data/principles.ts (VOCAB).`
        );
      }
    });
  }
});