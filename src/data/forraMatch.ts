/**
 * Reflektioner per match — hämtas automatiskt för senast spelade matchen.
 *
 * Källa: `season.ts` är sanning för datum + resultat (svenskalag.se).
 * `REFLECTIONS` håller tränarens manuella reflektion per match-id.
 *
 * När en match är klar men tränaren inte har fyllt i ännu visas en
 * auto-summary baserad på resultat + en tom shell ("Fylls i av
 * tränaren") så användaren ALDRIG ser fel match som "förra".
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

type ReflectionContent = Omit<ForraMatch, "meta">;

/* =================================================================
   REFLEKTIONER PER MATCH
   Lägg till nya entries här när tränaren skrivit klart en reflektion.
   ================================================================= */

const STANDARD_BLOCKS: ForraMatchSection[] = [
  { badge: "Bra", title: "Det här fungerade", bullets: [] },
  { badge: "Förbättra", title: "Det här tar vi tag i", bullets: [] },
  { badge: "Anfall", title: "Anfall — så blev det", bullets: [] },
  { badge: "Försvar", title: "Försvar — så blev det", bullets: [] },
  { badge: "Omställningar", title: "Omställningar", bullets: [] },
  { badge: "Fasta", title: "Fasta situationer", bullets: [] },
];

export const REFLECTIONS: Record<string, ReflectionContent> = {
  "2026-05-02-velebit": {
    summary:
      "Vi vann 1–0 hemma. Femte raka utan förlust (4 vinster + 1 oavgjord, 11/15 möjliga poäng).",
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  },
  "2026-05-08-kareby": {
    summary:
      "Vi spelade 1–1 borta — fortsatt obesegrade i serien (4 vinster + 2 oavgjorda).",
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  },
  "2026-05-16-ifk-bjorko": {
    summary:
      "Vi vann 3–1 hemma mot IFK Björkö — sjunde raka utan förlust.",
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  },
  "2026-05-22-vardar-makedonija": {
    summary:
      "Vi spelade 1–1 borta mot IF Vardar/Makedonija — fortsatt obesegrade i serien.",
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  },
};

/* =================================================================
   AUTO-SUMMARY från resultat — används när tränaren inte hunnit skriva
   ================================================================= */

function autoSummary(m: SeasonMatch): string {
  if (m.ourScore == null || m.theirScore == null) {
    return "Resultat ej rapporterat än — fylls in när matchen är klar.";
  }
  const place = m.homeAway === "home" ? "hemma" : "borta";
  if (m.ourScore > m.theirScore) {
    return `Vi vann ${m.ourScore}–${m.theirScore} ${place} mot ${m.opponent}.`;
  }
  if (m.ourScore < m.theirScore) {
    return `Vi förlorade ${m.ourScore}–${m.theirScore} ${place} mot ${m.opponent}.`;
  }
  return `Vi spelade ${m.ourScore}–${m.theirScore} ${place} mot ${m.opponent}.`;
}

function emptyShell(meta: SeasonMatch): ReflectionContent {
  return {
    summary: autoSummary(meta),
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  };
}

/* =================================================================
   HUVUD-API: getForraMatch — anropas av sidan
   ================================================================= */

/**
 * Hämtar senast spelade matchen från `season.ts` och kombinerar med
 * manuell reflektion om sådan finns. När säsongen rullar vidare flyttar
 * "förra matchen" sig automatiskt — ingen kod-redigering behövs.
 */
export function getForraMatch(now = new Date()): ForraMatch | null {
  const last = lastPlayedMatch(SEASON_MATCHES, now);
  if (!last) return null;
  const reflection = REFLECTIONS[last.id] ?? emptyShell(last);
  return { meta: last, ...reflection };
}

/**
 * Backwards-compat: FORRA_MATCH är fortfarande exporterad så befintliga
 * tester och eventuell admin-kod kan importera direkt. Den följer dock
 * NU `getForraMatch()` istället för en hårdkodad match. När du behöver
 * deterministisk data till en test, anropa `getForraMatch(new Date(...))`
 * med ett explicit datum istället.
 */
export const FORRA_MATCH: ForraMatch = getForraMatch() ?? {
  meta: SEASON_MATCHES[0],
  ...emptyShell(SEASON_MATCHES[0]),
};
