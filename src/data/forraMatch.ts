/**
 * Reflektion förra matchen — Velebit (lör 2 maj, 13:00, hemma 1–0).
 *
 * Statisk i kod tills vidare så hela laget och alla i ledarstaben kan läsa
 * samma sak inför nästa match utan att Supabase-fältet behöver vara ifyllt.
 *
 * Fakta (resultat, datum, plats) från https://www.svenskalag.se/gunnilseis-herr/matcher.
 * Spelartrupp + tränaranteckningar/reflektioner fyller huvudtränaren i.
 */

import { lastPlayedMatch, SEASON_MATCHES, type SeasonMatch } from "./season";

export interface ForraMatchSection {
  badge: string;
  title: string;
  /** Korta punkter — det vi tar med oss eller tar tag i. */
  bullets: string[];
}

export interface ForraMatch {
  meta: SeasonMatch;
  /** En enda mening: hur det blev. */
  summary: string;
  /**
   * Spelartrupp som spelade. Tom array = inte ifylld än —
   * UI visar "Fylls i av tränaren" istället för listan.
   */
  truppen: string[];
  /** Spelare ej tillgängliga (skadade, avstängda, frånvarande). */
  ejTillgangliga: string[];
  /**
   * Strukturerade reflektionsblock. Tom bullets-array = "Fylls i av tränaren".
   */
  blocks: ForraMatchSection[];
  /** Lärdomar vi tar med till nästa match. Tom = ej ifyllt. */
  larDomar: string[];
}

const meta = SEASON_MATCHES.find((m) => m.id === "2026-05-02-velebit")!;

export const FORRA_MATCH: ForraMatch = {
  meta,
  summary:
    "Vi vann 1–0 hemma. Femte raka utan förlust (4 vinster + 1 oavgjord, 11/15 möjliga poäng).",
  truppen: [], // TODO: tränaren fyller i — startelva + avbytare som spelade
  ejTillgangliga: [], // TODO om relevant
  blocks: [
    {
      badge: "Bra",
      title: "Det här fungerade",
      bullets: [], // TODO: fylls i av tränaren
    },
    {
      badge: "Förbättra",
      title: "Det här tar vi tag i",
      bullets: [], // TODO
    },
    {
      badge: "Anfall",
      title: "Anfall — så blev det",
      bullets: [], // TODO
    },
    {
      badge: "Försvar",
      title: "Försvar — så blev det",
      bullets: [], // TODO
    },
    {
      badge: "Omställningar",
      title: "Omställningar",
      bullets: [], // TODO
    },
    {
      badge: "Fasta",
      title: "Fasta situationer",
      bullets: [], // TODO
    },
  ],
  larDomar: [], // TODO: 1–3 punkter
};

/** Hjälpfunktion: hämta senaste spelade match från säsongsdata + statisk reflektion. */
export function getForraMatch(now = new Date()) {
  const last = lastPlayedMatch(SEASON_MATCHES, now);
  if (!last) return null;
  if (last.id === FORRA_MATCH.meta.id) return FORRA_MATCH;
  return { ...FORRA_MATCH, meta: last, blocks: [], truppen: [], larDomar: [] };
}
