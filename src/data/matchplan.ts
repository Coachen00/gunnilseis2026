/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-06-29 — SÄSONGSUPPEHÅLL. Vårsäsongen avslutad med
 * 6–0 hemma mot Stenkullen GoIK (27 juni). Träning åter måndag 28 juli,
 * höstpremiär borta mot Partille IF FK (lördag 8 aug 15:00 · Lexby 1 Gräs).
 * MATCH_META pekar på nästa match (Partille). Uppehålls-läget styrs av
 * SEASON_BREAK — Veckans match visar uppehålls-kort istället för matchdag.
 *
 * Härledda värden från MATCH_META (uppdateras automatiskt vid match-byte):
 *   - `computeSamlingTime` — hemma 1h30, borta 1h45 före avspark
 *   - `MATCH_KICKOFF_DATE` / `MATCH_KICKOFF_ISO` — parsat datum
 *   - `PAST_OPPONENT_NAMES` — motståndare med matchdatum FÖRE veckans match
 *     (används av hooks för att filtrera bort stale supabase-rader)
 */

import { SEASON_MATCHES, type SeasonMatch } from "./season";

export type MatchMeta = {
  opponent: string;
  venue: string;
  home: boolean;
  kickoff: string;
  competition: string;
  weather?: string;
  absent: string[];
};

export type FormationSlot = {
  id: string;
  n: number;
  name: string;
  label: string;
  x: number; // 0-100, bredd
  y: number; // 0-100, djup (0 = vår MV-linje)
};

export type CoherenceSection = {
  id: string;
  num: string;
  title: string;
  eyebrow: string;
  principles?: string[];
  bullets?: string[];
  roles?: [string, string][];
  note?: string;
};

export const MATCH_META: MatchMeta = {
  opponent: "Partille IF FK",
  venue: "Lexby 1 Gräs",
  home: false,
  kickoff: "Lör 8 aug · 15:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
};

/**
 * Säsongsuppehåll mellan vår- och höstsäsong.
 *
 * När `active` är true visar Veckans match ett uppehålls-läge i stället för
 * matchdagsdetaljer (samlingsschema, "tre saker idag" m.m. är inte relevanta
 * förrän kallelsen inför höstpremiären sätts). MATCH_META pekar ändå på nästa
 * match (Partille) så hero, nästa-match-block och MatchdayBanner får rätt
 * fakta. Sätt `active: false` när truppen kallas inför höstpremiären.
 */
export const SEASON_BREAK = {
  active: true,
  /** Sista spelade matchen — vårsäsongens avslutning. */
  lastResult: "Stenkullen GoIK 6–0 (hemma, 27 juni)",
  /** När laget drar igång igen efter sommaruppehållet. */
  trainingResumes: "Måndag 28 juli",
  /** Nästa match efter uppehållet (= MATCH_META). */
  nextMatchLabel: "Partille IF FK · borta · lör 8 aug 15:00",
} as const;

export const MATCH_PRESENTATION_URL =
  "https://claude.ai/design/p/faf88e6c-cc30-4de1-83a3-2914a1267e48?file=veckans-match%2FMatchgenomg%C3%A5ng+-+Mall.html&via=share";

/**
 * Parsar svensk kickoff-sträng som `"Lör 30 maj · 13:00"` till en Date.
 *
 * Anledning till att vi har en parser: `MATCH_META.kickoff` är "single source
 * of truth" för veckans match-datum. Resten av kodbasen (MatchdayBanner,
 * useMatch.ts STATIC_UPCOMING_DATE m.fl.) ska härleda från den — inte
 * hardkoda ett parallellt datum.
 *
 * `year` defaultar till aktuellt år; matchade matcher har alltid samma år.
 * Returnerar `null` när strängen saknar parsbart datum (defensive fallback).
 */
const SWEDISH_MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11,
};

export function parseKickoffDate(
  meta: MatchMeta = MATCH_META,
  year: number = new Date().getFullYear()
): Date | null {
  const m = meta.kickoff.match(/(\d{1,2})\s+([a-zåäö]+)\s*[·\-,]?\s*(\d{1,2}):(\d{2})/i);
  if (!m) return null;
  const month = SWEDISH_MONTHS[m[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(year, month, parseInt(m[1], 10), parseInt(m[3], 10), parseInt(m[4], 10));
}

/** Aktuell veckans match-datum som Date — härlett från MATCH_META.kickoff. */
export const MATCH_KICKOFF_DATE = parseKickoffDate();

/** Samma som ovan men som ISO-sträng — används av useMatch.ts för synthetic
 *  match-rader. `null` blir tom sträng så `new Date("")` ger NaN och
 *  shouldUseStaticUpcoming graceful-degraderar till false. */
export const MATCH_KICKOFF_ISO = MATCH_KICKOFF_DATE?.toISOString() ?? "";

/**
 * Hittar säsongsmatchen som motsvarar veckans match (`MATCH_META`).
 *
 * Matchar på motståndarnamn, men när samma motståndare förekommer flera
 * gånger (t.ex. Ytterby IS både i premiären och i returmötet) väljs den
 * instans vars datum ligger närmast `MATCH_KICKOFF_DATE` — annars skulle
 * `find` alltid plocka den FÖRSTA (oftast en redan spelad match) och ge fel
 * cutoff/stale-filtrering. Faller tillbaka till namnmatch om kickoff inte
 * kan parsas.
 */
export function resolveWeeklyMatch(
  matches: SeasonMatch[] = SEASON_MATCHES,
  kickoff: Date | null = MATCH_KICKOFF_DATE
): SeasonMatch | undefined {
  const byName = matches.filter((m) => m.opponent === MATCH_META.opponent);
  if (byName.length <= 1 || !kickoff) return byName[0];
  const kickoffMs = kickoff.getTime();
  return byName.reduce((best, m) =>
    Math.abs(new Date(m.date).getTime() - kickoffMs) <
    Math.abs(new Date(best.date).getTime() - kickoffMs)
      ? m
      : best
  );
}

/**
 * Motståndare vars matcher ligger FÖRE veckans match (`MATCH_META.opponent`)
 * i `SEASON_MATCHES`. Används av `useSeasonMatches.ensureWeeklyMatch` och
 * `useMatch` för att filtrera bort stale supabase-rader som annars skuggar
 * veckans riktiga match.
 *
 * Härleds automatiskt — inga manuella listor att hålla uppdaterade.
 * Tomt set om MATCH_META.opponent inte finns i SEASON_MATCHES eller om
 * kickoff inte kan parsas (defensive degradation).
 */
export const PAST_OPPONENT_NAMES: ReadonlySet<string> = (() => {
  const weeklyMatch = resolveWeeklyMatch();
  if (!weeklyMatch) return new Set();
  const cutoff = new Date(weeklyMatch.date).getTime();
  // Veckans egna motståndare får ALDRIG flaggas som stale, även om laget
  // mötts tidigare i säsongen (t.ex. Ytterby i både premiär och retur) —
  // annars filtreras den riktiga veckomatchen bort som "past opponent".
  const weeklyOpponent = MATCH_META.opponent.toLowerCase();
  return new Set(
    SEASON_MATCHES
      .filter((m) => new Date(m.date).getTime() < cutoff)
      .map((m) => m.opponent.toLowerCase())
      .filter((name) => name !== weeklyOpponent)
  );
})();

/**
 * Räknar baklänges från `MATCH_META.kickoff` ("Lör 13 jun · 13:00") och
 * returnerar samlingstid som "HH:MM".
 *
 * Regel (Gunnilse IS):
 *   - Hemmamatch → samling 1h30 före avspark.
 *   - Bortamatch → samling 1h45 före avspark.
 *
 * Detta är samma regel för alla matcher hela säsongen, så den ska
 * aldrig hardkodas per match. Returnerar "Se kallelse" om kickoff
 * saknar parsbart klockslag.
 */
export function computeSamlingTime(meta: MatchMeta = MATCH_META): string {
  const m = meta.kickoff.match(/(\d{1,2}):(\d{2})/);
  if (!m) return "Se kallelse";
  const kickoffMinutes = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const offsetMinutes = meta.home ? 90 : 105;
  const totalMinutes = kickoffMinutes - offsetMinutes;
  if (totalMinutes < 0) return "Se kallelse";
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export const SAMLING_TIME = computeSamlingTime();

/* Matchdagsschema — visas i hero och i praktisk-info-block.
 * Samlingstid räknas dynamiskt från MATCH_META.kickoff (se
 * `computeSamlingTime`). Övriga tider relativa till avspark:
 *   - Aktivering: avspark - 40 till avspark - 10
 *   - Ner + sista instruktion: avspark - 10 till avspark - 3
 *   - Upp + sista löpningar: avspark - 3
 */
export const MATCH_SCHEDULE: Array<{ time: string; label: string; note?: string }> = [
  { time: SAMLING_TIME, label: "Samling", note: MATCH_META.home ? "Hjällbovallen" : "Hjällbovallen (avresa)" },
  { time: "Före uppvärmning", label: "Genomgång" },
  { time: "12:20 – 12:50", label: "Aktivering" },
  { time: "12:50 – 12:57", label: "Ner + sista instruktion" },
  { time: "12:57", label: "Upp + sista löpningar" },
  { time: "13:00", label: "Avspark" },
];

/* Matchplan i korthet — fyra kort som spelaren scannar precis före avspark. */
export type PlanCard = {
  id: string;
  eyebrow: string;
  title: string;
  bullets: string[];
  accent: "red" | "blue" | "amber" | "green";
};

export const MATCH_PLAN_SHORT: PlanCard[] = [
  {
    id: "forsvar",
    eyebrow: "Utan boll",
    title: "Så försvarar vi",
    accent: "red",
    bullets: [
      "Hemma — vi sätter tempot, men stäng mitten först. Kompakta led, inget jagande på låsta passningar.",
      "YB på YB. Lås bollsida och stoppa spelvändning.",
      "Vinn andrabollen som lag — närmaste attackerar, övriga tätar.",
    ],
  },
  {
    id: "anfall",
    eyebrow: "Med boll",
    title: "Så anfaller vi",
    accent: "blue",
    bullets: [
      "Skydda kontring — 6:an står, MB håller avstånd.",
      "Spela in centralt → ut → ta med framåt.",
      "Fyll boxen vid inlägg: 9 straffp, motsatt ytter bortre, 8 första, 10 cutback.",
    ],
  },
  {
    id: "omstallning",
    eyebrow: "I sekunden",
    title: "Så ställer vi om",
    accent: "amber",
    bullets: [
      "Bollvinst: första tanken framåt — diagonal eller djup.",
      "Bolltapp: närmaste pressar inom 1 sekund — jakten startar direkt.",
      "Forwarden styr första pressen så resten kan flytta efter.",
    ],
  },
  {
    id: "fasta",
    eyebrow: "Stillastående",
    title: "Fasta situationer",
    accent: "green",
    bullets: [
      "Anfall: ansvar och variant bekräftas på genomgången.",
      "Försvar: hybrid (zon + 2 man) + andraboll.",
      "Inkast djupt = tryck + direkt återerövring.",
    ],
  },
];

/* Praktisk info — visas längst ner på Veckans match. */
export const PRACTICAL_INFO = {
  responsibilities: [
    ["Kapten", "Idris Abdi"],
    ["Hörnor", "Bekräftas på genomgång"],
    ["Inläggsfrispark", "Bekräftas på genomgång"],
    ["Målchansfrispark", "Bekräftas på genomgång"],
  ] as const,
  gatheringNote: "Samling och avresa bekräftas i kallelsen. Mental start före uppvärmning.",
} as const;

/* Säsongsuppehåll — ingen trupp kallad. Kallelse sätts inför höstpremiären
 * (Partille borta, 8 aug). Tom trupp → Veckans match visar "Kallelse kommer".
 * När truppen kallas: fyll bench (+ ev. starting/FORMATION) och sätt
 * SEASON_BREAK.active = false. */
export const CALLED_SQUAD: { starting: string[]; bench: string[] } = {
  starting: [],
  bench: [],
};

export const FOCUS: string[] = [
  "Håll igång — egen träning genom uppehållet så vi kommer tillbaka i form 28 juli.",
  "Ladda för hösten — vi ligger tvåa (obesegrade), två poäng bakom Lerum. Allt att spela för.",
  "Vila rätt — sköt kropp, sömn och kost så vi är pigga till höstpremiären borta mot Partille.",
];

/* Tom under uppehållet — ingen startelva spikad. Fyll i 4-2-3-1-positioner när
 * en XI sätts inför höstpremiären. */
export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Säsongsuppehåll",
    eyebrow: "Kontext",
    bullets: [
      "Vårsäsongen är slut — vi avslutade med 6–0 hemma mot Stenkullen GoIK (27 juni).",
      "Sommaruppehåll nu. Träning drar igång igen måndag 28 juli.",
      "Höstpremiär: Partille IF FK borta · Lexby 1 Gräs · lördag 8 aug 15:00. Kallelse och matchplan sätts när vi närmar oss.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["Uppehåll", "Kapten", "Kallelse"],
    bullets: [
      "Ingen trupp kallad under uppehållet — kallelsen sätts inför höstpremiären.",
      "Idris Abdi är fortsatt lagkapten.",
      "Håll igång på egen hand så vi är i form när vi samlas 28 juli.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Vårsäsongens sista — Stenkullen GoIK 6–0",
    eyebrow: "Så avslutade vi våren",
    principles: ["Reflektion", "Energi", "Nästa aktion"],
    bullets: [
      "Vi vann 6–0 hemma mot Stenkullen GoIK (3–0 i halvtid) — Ali Carneil höll nollan och vi avslutade våren på bästa sätt.",
      "13 matcher, 0 förluster i vårserien. Vi ligger tvåa, två poäng bakom Lerum.",
      "Detaljerade reflektioner fylls i av tränaren på /match/forra.",
      "Nu laddar vi för hösten: höstpremiär borta mot Partille IF FK.",
    ],
  },
  {
    id: "partille",
    num: "04",
    title: "Nästa motståndare — Partille IF FK",
    eyebrow: "Höstpremiären",
    bullets: [
      "Bortamatch på Lexby 1 Gräs · lördag 8 aug 15:00 — första matchen efter uppehållet.",
      "Vi vann 3–2 hemma mot Partille i premiärmötet (18 apr) — räkna med en tajt match igen.",
      "Borta: ta med energin från vården, var samlade från start och styr matchen tillsammans.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys när tränarstaben har fyllt i den inför premiären.",
    ],
    note: "Nyckeln under uppehållet: håll igång, vila rätt och kom tillbaka i form 28 juli. Partille-specifika anpassningar fylls i på /motstandaranalys inför 8 aug.",
  },
  {
    id: "identitet",
    num: "05",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Scanning", "Yta", "Prata med passningen", "Duellspel", "Andrabollsspel"],
    bullets: [
      "Vi sätter rytmen, höjer rösten och äger intensiteten — hemma som borta.",
      "Andrabollsspelet vinner vi som lag — närmaste attackerar, övriga tätar.",
      "Nästa aktion är viktigare än förra situationen.",
    ],
  },
  {
    id: "anfall",
    num: "06",
    title: "Anfall — fem principer",
    eyebrow: "I ordning",
    principles: ["Skydda kontring", "Spela in", "Spela ut", "Framåt", "Box"],
    bullets: [
      "1. Skydda mot kontring — 6:an står kvar centralt, mittbackarna håller avstånd till varandra.",
      "2. Spela in bollen — sök rättvänd medspelare i halvytan, mellan deras led.",
      "3. Spela ut — trångt centralt? Vänd via 6/MB till motsatt ytter och spela in på nya sidan.",
      "4. Ta med framåt — yta öppen? Driv eller passa framåt med fart, inte i sidled.",
      "5. Fyll på i box — minst 4 av oss i/runt boxen vid inlägg. 9 straffp, motsatt ytter bortre, 8 första, 10 cutback, 1 hänger 18 m.",
    ],
  },
  {
    id: "forsvar",
    num: "07",
    title: "Försvar",
    eyebrow: "Samla → lås → vinn",
    principles: ["Samla först", "Höga linjer", "Tre korridorer"],
    bullets: [
      "Ingen tokpress innan vi är kompakta. Bollvinnarpress först när linjerna är höga.",
      "Styr pressen åt en sida (kolla motståndaranalys för rätt presssida inför matchen).",
      "YB på YB — lås bollsida, stoppa spelvändning.",
    ],
  },
  {
    id: "omst-forsvar",
    num: "08",
    title: "Omställning försvar",
    eyebrow: "Direkt eller indirekt",
    principles: ["Direkt", "Indirekt"],
    bullets: [
      "Direkt: nära, samlade, täckning bakom — närmaste pressar inom 1 sek.",
      "Indirekt: utdragna, centralt tapp, rättvänd motståndare → samla, centrera, lås nästa boll.",
      "Forwarden är vår första försvarare.",
    ],
  },
  {
    id: "omst-anfall",
    num: "09",
    title: "Omställning anfall",
    eyebrow: "Ut ur gröten",
    principles: ["Diagonal utgång", "Djupled", "Box"],
    bullets: [
      "Första passningen bort från het yta.",
      "Rättvänd söker diagonal, djupled eller spelvändning.",
      "Ytter/9 löper direkt. Övriga fyller box eller säkrar andraboll.",
    ],
  },
  {
    id: "fasta",
    num: "10",
    title: "Fasta",
    eyebrow: "Kort ansvar",
    principles: ["Haris/Gelo", "Hybrid", "Andraboll"],
    bullets: [
      "Försvar: hörna, inläggsfrispark, målchansfrispark, inkast — hybrid (zon + 2 man) + andraboll.",
      "Anfall: hörnor och inläggsfrisparkar Haris/Gelo. Målchansfrispark: bestäm själva.",
      "Inkast: djupt = tryck + direkt återerövring.",
    ],
  },
  {
    id: "roller",
    num: "11",
    title: "Roller",
    eyebrow: "Ansvar",
    roles: [
      ["Kapten", "Idris Abdi"],
      ["Hörnor", "Bekräftas på genomgång"],
      ["Inläggsfrispark", "Bekräftas på genomgång"],
      ["Målchansfrispark", "Bekräftas på genomgång"],
      ["Matchstart", "15:00"],
      ["Bortaplan", "Lexby 1 Gräs"],
    ],
  },
];
