/**
 * Grunden — nivå 0 och 1 i sajtens pedagogiska hierarki.
 *
 * INGET nytt innehåll skapas här: nivå 0 är de fyra ord som redan genomsyrar
 * hela materialet (VOCAB i principles.ts + de mest återkommande fraserna),
 * och nivå 1 HÄRLEDS ur MAJ_2026_BLOCKS befintliga "remember"-rader — en
 * källa, ingen duplicering.
 */

import { MAJ_2026_BLOCKS } from "@/data/majSpelmodell";

/* ── NIVÅ 0: fyra ord + en mening ─────────────────────────────────────
 * De fyra mest använda nyckelorden i materialet, i spelets ordning:
 * utan boll → vinn boll → sista pass → avslut. Raderna är lyfta ur
 * befintlig copy (blockens remember + planindelningens sluttext). */
export interface Mantra {
  word: string;
  line: string;
  /** Vart fördjupningen finns. */
  to: string;
}

export const MANTRAN: Mantra[] = [
  { word: "Pressa", line: "Pressa direkt. Vinn tillbaka.", to: "/maj-2026#overgang-forsvar" },
  { word: "Rättvänd", line: "Titta framåt. Spela framåt.", to: "/maj-2026#anfallsspel" },
  { word: "Assistytan", line: "Sista passningen före avslut.", to: "/maj-2026#anfallsspel" },
  { word: "Gyllene zonen", line: "Bästa avslutsytan. Avsluta där.", to: "/maj-2026#anfallsspel" },
];

/** Nivå 0-meningen — finns redan som sluttext i planindelnings-intron. */
export const GRUNDEN_MENING =
  "Bredd skapar korridorer. Djup skapar spelytor. Assistytan skapar sista passningen. Gyllene zonen skapar avslut.";

/* ── NIVÅ 1: sex faser, en rad var ────────────────────────────────────
 * Härleds ur blockens befintliga remember-rader. */
export interface FasRad {
  id: string;
  num: string;
  title: string;
  remember: string;
}

export const FAS_RADER: FasRad[] = MAJ_2026_BLOCKS.map((b, i) => ({
  id: b.id,
  num: String(i + 1).padStart(2, "0"),
  title: b.title,
  remember: b.remember,
}));
