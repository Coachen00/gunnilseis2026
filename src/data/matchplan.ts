/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-06-26 — trupp kallad inför Stenkullen GoIK
 * (hemma · Hjällbovallen 1 Gräs · lördag 27 juni 13:00).
 * Förra match: Ytterby IS (borta · 2026-06-17 · 1–4 vinst).
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
  opponent: "Stenkullen GoIK",
  venue: "Hjällbovallen 1 Gräs",
  home: true,
  kickoff: "Lör 27 jun · 13:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
};

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

/* Kallad trupp inför Stenkullen GoIK (lör 27 juni, hemma). 16 spelare kallade,
 * ingen startelva utsatt — listan visas som en samlad "Kallade spelare"-grid och
 * startelva/roller bekräftas på genomgång. Idris Abdi är lagkapten. När/om en
 * startelva spikas: flytta 11 till `starting` och fyll FORMATION. */
export const CALLED_SQUAD: { starting: string[]; bench: string[] } = {
  starting: [],
  bench: [
    "Ali Carneil",
    "Vedad Dzambegovic",
    "Rinor Zenullah",
    "Pascal Jabbour",
    "Rayan Fedaila",
    "Idris Abdi",
    "Benjamin Arapovic",
    "Ihab Naser",
    "Ayub Ahmed",
    "Leodon Johansson",
    "Yosef Ismail",
    "Haris Avdiu",
    "Kamal Mustafa",
    "Aldin Zeljkovic",
    "Galvan Ayoub",
    "Meysam Hoseni",
  ],
};

export const FOCUS: string[] = [
  "Hemma mot Stenkullen: vi sätter tempot och äger initiativet från första sekund — egen rytm, korta avstånd, första duellen direkt.",
  "Skydda mitten och tvinga Stenkullen utåt — låt dem inte hitta rättvänd spelare mellan våra lagdelar.",
  "Vid bollvinst: första blicken framåt, hota diagonalt och fyll på i box innan de hinner samla sig.",
];

/* Tom tills en startelva spikas. Ingen XI utsatt inför Stenkullen → sidan visar
 * samlad kallad trupp utan formationsplan. Fyll i 4-2-3-1-positioner när XI är klar. */
export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Veckans match",
    eyebrow: "Kontext",
    bullets: [
      "Stenkullen GoIK hemma · Hjällbovallen 1 Gräs · lördag 27 juni 13:00.",
      `Samling ${SAMLING_TIME} på Hjällbovallen (1h30 före avspark, hemmamatchsregel).`,
      "Startelva och roller bekräftas på genomgång.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["Kallad", "Kapten", "Startelva"],
    bullets: [
      "16 spelare kallade. Hela truppen finns på Veckans match.",
      "Ingen startelva utsatt än — startelva och roller bekräftas på genomgången. Idris Abdi är lagkapten.",
      "Alla ska veta sin första uppgift innan uppvärmningen börjar.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Förra match — Ytterby IS 4–1",
    eyebrow: "Vad vi tar med till Stenkullen",
    principles: ["Reflektion", "Energi", "Nästa aktion"],
    bullets: [
      "Vi vann 4–1 borta mot Ytterby IS (1–1 i halvtid) — Mustafa Ayoub två mål och utsedd till matchens lirare, Måns Orwén kanon från 25 m som inbytt, Haris Avdiu satte 4–1 i slutsekunderna.",
      "Haris toppar nu seriens skytteliga med 12 mål — och segern tog oss upp i serieledning.",
      "Detaljerade reflektioner fylls i av tränaren på /match/forra.",
      "Nu flyttar vi fokus direkt till nästa prestation: Stenkullen GoIK hemma.",
    ],
  },
  {
    id: "stenkullen",
    num: "04",
    title: "Vad vi vet om Stenkullen GoIK",
    eyebrow: "Motståndaren",
    bullets: [
      "Hemmamatch på Hjällbovallen 1 Gräs — vi sätter tempot, äger initiativet och styr matchen från start.",
      "Vi vann 4–2 borta mot Stenkullen i premiärmötet (10 apr) — räkna med att de vill revansch.",
      "Lördag eftermiddag hemma — vakna start, första duellen direkt, var igång i andrabollarna.",
      "Första 15 minuterna blir intensiva — de vill trycka upp tempo och känna att de kan hota oss. Håller vi ihop laget, vinner duellerna, följer pressen och spelar enkelt när det behövs tar vi kontrollen.",
      "Stäng mitten först. Låt dem inte spela mellan två av oss.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys när tränarstaben har fyllt i den.",
    ],
    note: "Nyckeln: följ planen, håll laget kompakt, ta ansvar för din roll, gör jobbet tillsammans. Stenkullen-specifika anpassningar (formation, hot, var vi pressar) fylls i på /motstandaranalys.",
  },
  {
    id: "identitet",
    num: "05",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Hemma = vi sätter rytmen, höjer rösten och äger intensiteten på vår plan.",
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
      "Styr pressen åt en sida (kolla motståndaranalys för rätt sida mot Ytterby).",
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
      ["Matchstart", "13:00"],
      ["Hemmaplan", "Hjällbovallen 1 Gräs"],
    ],
  },
];
