/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-06-01 inför Hisingsbacka FC
 * (borta · Backavallen 1 Konstgräs · fredag 5 juni 19:15).
 * Förra match: Hjuviks AIK (hemma · 2026-05-30 · 4–1).
 *
 * Härledda värden från MATCH_META (uppdateras automatiskt vid match-byte):
 *   - `computeSamlingTime` — hemma 1h30, borta 1h45 före avspark
 *   - `MATCH_KICKOFF_DATE` / `MATCH_KICKOFF_ISO` — parsat datum
 *   - `PAST_OPPONENT_NAMES` — motståndare med matchdatum FÖRE veckans match
 *     (används av hooks för att filtrera bort stale supabase-rader)
 */

import { SEASON_MATCHES } from "./season";

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
  opponent: "Hisingsbacka FC",
  venue: "Backavallen 1 Konstgräs",
  home: false,
  kickoff: "Fre 5 jun · 19:15",
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
  const weeklyMatch = SEASON_MATCHES.find((m) => m.opponent === MATCH_META.opponent);
  if (!weeklyMatch) return new Set();
  const cutoff = new Date(weeklyMatch.date).getTime();
  return new Set(
    SEASON_MATCHES
      .filter((m) => new Date(m.date).getTime() < cutoff)
      .map((m) => m.opponent.toLowerCase())
  );
})();

/**
 * Räknar baklänges från `MATCH_META.kickoff` ("Fre 5 jun · 19:15") och
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
  { time: "Före avresa/uppvärmning", label: "Genomgång" },
  { time: "18:35 – 19:05", label: "Aktivering" },
  { time: "19:05 – 19:12", label: "Ner + sista instruktion" },
  { time: "19:12", label: "Upp + sista löpningar" },
  { time: "19:15", label: "Avspark" },
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
      "Borta — stäng mitten först. Kompakta led, inget jagande på låsta passningar.",
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
  kit: "Bortamatch på konstgräs — följ kallelsen och ta med rätt skor/överdrag.",
  responsibilities: [
    ["Kapten", "Bekräftas i kallelse"],
    ["Hörnor", "Bekräftas på genomgång"],
    ["Inläggsfrispark", "Bekräftas på genomgång"],
    ["Målchansfrispark", "Bekräftas på genomgång"],
  ] as const,
  gatheringNote: "Samling och avresa bekräftas i kallelsen. Mental start före uppvärmning.",
} as const;

/* Kallad trupp inför Hisingsbacka FC (fre 5 juni). 16 spelare kallade.
 * Startelva sätts på genomgång — alla 16 ligger som bänk tills
 * laguppställningen är spikad. */
export const CALLED_SQUAD = {
  starting: [],
  bench: [
    "Ali Carneil",
    "Rayan Fedaila",
    "Adnan Hadzialic",
    "Rinor Zenullah",
    "Idris Abdi",
    "Vedad Dzambegovic",
    "Ahmad Aljafari",
    "Benjamin Arapovic",
    "Ihab Naser",
    "Måns Orwén",
    "Ayub Ahmed",
    "Yosef Ismail",
    "Haris Avdiu",
    "Aldin Zeljkovic",
    "Mustafa Ayub",
    "Leodon Johansson",
  ],
} as const;

export const FOCUS: string[] = [
  "Starta som bortalag med lugn kropp: korta avstånd, tydlig röst och första duellen direkt.",
  "Skydda mitten och tvinga Hisingsbacka utåt — låt dem inte hitta rättvänd spelare mellan våra lagdelar.",
  "Vid bollvinst: första blicken framåt, hota diagonalt och fyll på innan de hinner samla sig.",
];

export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Veckans match",
    eyebrow: "Kontext",
    bullets: [
      "Hisingsbacka FC borta · Backavallen 1 Konstgräs · fredag 5 juni 19:15.",
      `Samling ${SAMLING_TIME} på Hjällbovallen — avresa direkt efter (1h45 före avspark, bortamatchsregel).`,
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
      "16 spelare kallade — se listan nedan.",
      "Startelva och avbytare bekräftas på genomgång.",
      "Alla ska veta sin första uppgift innan uppvärmningen börjar.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Förra match — Hjuviks AIK 4–1",
    eyebrow: "Vad vi tar med till Hisingsbacka",
    principles: ["Reflektion", "Energi", "Nästa aktion"],
    bullets: [
      "Vi vann 4–1 hemma mot Hjuviks AIK i gräspremiären — Yosef Ismail hattrick (+ assist), Leodon Johansson en.",
      "Detaljerade reflektioner fylls i av tränaren på /match/forra.",
      "Nu flyttar vi fokus direkt till nästa prestation: Hisingsbacka FC borta.",
    ],
  },
  {
    id: "hisingsbacka",
    num: "04",
    title: "Vad vi vet om Hisingsbacka FC",
    eyebrow: "Motståndaren",
    bullets: [
      "Bortamatch på Backavallen 1 Konstgräs — snabbt underlag, vi tar med egen rytm och röst.",
      "Fredagskväll borta — lugn start, första duellen direkt, vakna i andrabollarna.",
      "Stäng mitten först. Låt dem inte spela mellan två av oss.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys när tränarstaben har fyllt i den.",
    ],
    note: "Hisingsbacka-specifika anpassningar (formation, hot, var vi pressar) fylls i på /motstandaranalys.",
  },
  {
    id: "identitet",
    num: "05",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Borta = vi tar med oss egen rytm, egen röst och egen intensitet.",
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
      "Styr pressen åt en sida (kolla motståndaranalys för rätt sida mot Hisingsbacka).",
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
      ["Kapten", "Bekräftas i kallelse"],
      ["Hörnor", "Bekräftas på genomgång"],
      ["Inläggsfrispark", "Bekräftas på genomgång"],
      ["Målchansfrispark", "Bekräftas på genomgång"],
      ["Matchstart", "19:15"],
      ["Bortaplan", "Backavallen 1 Konstgräs"],
    ],
  },
];
