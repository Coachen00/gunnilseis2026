/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-08-28 — veckans match är seriematch hemma mot
 * Kareby IS (lördag 29 aug 13:00 · Hjällbovallen 1 Gräs). Bortamatchen mot
 * KF Velebit 22 aug slutade 0–5 — andra raka förlusten. Samling 11:30 på
 * Hjällbovallen.
 *
 * Härledda värden från MATCH_META (uppdateras automatiskt vid match-byte):
 *   - `computeSamlingTime` — hemma 1h30, borta 1h45 före avspark
 *   - `kickoffOffset` / `MATCH_SCHEDULE` — matchdagsschemat räknas ur avspark
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
  /**
   * Nödutgång: samlingstid "HH:MM" som överrider klubbregeln (hemma 1h30,
   * borta 1h45 — se `SAMLING_OFFSET_MINUTES`).
   *
   * Ska stå tom i normalfallet. Sätts BARA för en enskild match med avvikande
   * upplägg. Är avvikelsen egentligen en regel hör den hemma i offseten, inte
   * här — annars ärver nästa match den felaktiga regeln utan att någon märker.
   */
  samling?: string;
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
  opponent: "Kareby IS",
  venue: "Hjällbovallen 1 Gräs",
  home: true,
  kickoff: "Lör 29 aug · 13:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
  // Ingen `samling` här: 11:30 härleds ur hemmaregeln (13:00 − 1h30).
};

/**
 * Säsongsuppehåll mellan vår- och höstsäsong.
 *
 * När `active` är true visar Veckans match ett uppehålls-läge i stället för
 * matchdagsdetaljer. Uppehållet är slut sedan 28 juli och serien rullar igen
 * från 8 aug → `active: false`, matchdagsläget gäller.
 * Fälten under behålls som historik/etiketter.
 */
export const SEASON_BREAK = {
  active: false,
  /** Sista spelade matchen. */
  lastResult: "KF Velebit 0–5 (borta, 22 aug, andra raka förlusten)",
  /** När laget drog igång igen efter sommaruppehållet. */
  trainingResumes: "Måndag 28 juli",
  /** Veckans match (= MATCH_META). */
  nextMatchLabel: "Kareby IS · hemma · lör 29 aug 13:00 (Hjällbovallen 1 Gräs)",
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
 * Regel (Gunnilse IS): **hemma 1h30, borta 1h45 före avspark.** Bortatillägget
 * är resa: vi samlas på Hjällbovallen och åker gemensamt, så samlingen ligger
 * 15 min tidigare än hemma.
 *
 * Regeln stod en period på 1h30 även borta, hämtad från kallelserna på
 * svenskalag.se. Det var fel — sajten är inte facit, klubbregeln är. Rättad
 * 2026-08-07 på Joels besked.
 *
 * Detta är samma regel för alla matcher hela säsongen, så den ska aldrig
 * hardkodas per match. Returnerar "Se kallelse" om kickoff saknar parsbart
 * klockslag.
 *
 * `meta.samling` vinner över regeln men ska stå TOM i normalfallet — den är en
 * nödutgång för enstaka matcher med avvikande upplägg (t.ex. gemensam buss från
 * annan plats), inte platsen där bortatillägget bokförs. Bokförs en regel som
 * undantag blir nästa match tyst fel: regeln räknar vidare på fel offset och
 * ingen märker det förrän spelarna står på plan vid fel tid.
 */
const SAMLING_OFFSET_MINUTES = { home: 90, away: 105 } as const;

export function computeSamlingTime(meta: MatchMeta = MATCH_META): string {
  if (meta.samling && /^\d{1,2}:\d{2}$/.test(meta.samling)) return meta.samling;
  const m = meta.kickoff.match(/(\d{1,2}):(\d{2})/);
  if (!m) return "Se kallelse";
  const kickoffMinutes = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const totalMinutes =
    kickoffMinutes - (meta.home ? SAMLING_OFFSET_MINUTES.home : SAMLING_OFFSET_MINUTES.away);
  if (totalMinutes < 0) return "Se kallelse";
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export const SAMLING_TIME = computeSamlingTime();

/**
 * Klockslag relativt avspark, härlett ur `MATCH_META.kickoff`.
 * Negativa minuter = före avspark. Tom sträng när kickoff saknar klockslag
 * eller offseten hamnar före midnatt (defensive fallback).
 *
 * Finns för att matchdagsschemat inte ska hardkodas per match — det var
 * tidigare fastlåst på 13:00-avspark och stämde inte vid andra avsparkstider.
 */
export function kickoffOffset(minutes: number, meta: MatchMeta = MATCH_META): string {
  const m = meta.kickoff.match(/(\d{1,2}):(\d{2})/);
  if (!m) return "";
  const total = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + minutes;
  if (total < 0) return "";
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* Matchdagsschema — visas i hero och i praktisk-info-block.
 * Samlingstid räknas dynamiskt från MATCH_META.kickoff (se
 * `computeSamlingTime`). Övriga tider relativa till avspark:
 *   - Aktivering: avspark - 40 till avspark - 10
 *   - Ner + sista instruktion: avspark - 10 till avspark - 3
 *   - Upp + sista löpningar: avspark - 3
 */
/**
 * Var vi samlas — ALLTID Hjällbovallen, även när matchen spelas någon annanstans.
 *
 * Egen konstant för att hero-kortet visar "Samling 13:15" bredvid
 * "Matchplats: Lexby 1 Gräs". Utan platsen utskriven under samlingstiden läser
 * spelaren ihop de två och åker direkt till bortaplanen. Platsen måste stå
 * bredvid tiden, inte bara i schemat längre ner.
 */
export const GATHERING_PLACE = "Hjällbovallen";

/** Lång form med destination — används i schemat och i praktisk info. */
export const GATHERING_NOTE = MATCH_META.home
  ? `${GATHERING_PLACE} — vi spelar hemma`
  : `${GATHERING_PLACE} — vi åker gemensamt till ${MATCH_META.venue}`;

export const MATCH_SCHEDULE: Array<{ time: string; label: string; note?: string }> = [
  { time: SAMLING_TIME, label: "Samling", note: GATHERING_NOTE },
  { time: "Före uppvärmning", label: "Genomgång" },
  { time: `${kickoffOffset(-40)} – ${kickoffOffset(-10)}`, label: "Aktivering" },
  { time: `${kickoffOffset(-10)} – ${kickoffOffset(-3)}`, label: "Ner + sista instruktion" },
  { time: kickoffOffset(-3), label: "Upp + sista löpningar" },
  { time: kickoffOffset(0), label: "Avspark" },
];

/* Praktisk info — visas längst ner på Veckans match. */
export const PRACTICAL_INFO = {
  responsibilities: [
    ["Kapten", "Adnan \"Ado\" Hadzialic"],
    ["Hörnor", "Bekräftas på genomgång"],
    ["Inläggsfrispark", "Bekräftas på genomgång"],
    ["Målchansfrispark", "Bekräftas på genomgång"],
  ] as const,
  gatheringNote: `Samling ${SAMLING_TIME} på ${GATHERING_NOTE}. Ombytta och klara. Mental start före uppvärmning.`,
} as const;

/**
 * Spelare som får kallas utan att finnas i `data/squad.ts` — provspelare och
 * inlånade som tränar med oss men tillhör en annan förening.
 *
 * Finns för att `CALLED_SQUAD` är fri text utan join mot truppen: utan den här
 * listan skulle stavfelsskyddet i `matchplan.test.ts` antingen falla på en
 * legitim provspelare, eller behöva stängas av helt. De läggs INTE i squad.ts —
 * den listan speglar Gunnilses egen trupp på svenskalag.se.
 */
/* Tömd 2026-08-07: Darvan Ayoub (Västkurd, provspel sedan aug 2026) är inte
 * kallad. Listan ska bara innehålla provspelare som faktiskt står i
 * CALLED_SQUAD — testet nedan kräver det, just för att listan inte ska
 * ligga kvar och legitimera stavfel efter att provspelet tagit slut.
 * Kallas han igen: lägg tillbaka namnet här, INTE i squad.ts. */
export const TRIAL_PLAYERS: ReadonlySet<string> = new Set([]);

/* Kallad trupp till hemmamatchen mot Kareby IS (29 aug).
 * 16 spelare kallade — Ali i mål, men ingen spikad startelva än (starting
 * tom tills XI sätts, samma mönster som Lerum-veckan). Namnen stavas exakt
 * som i `data/squad.ts` (fri text, ingen join), eller finns i TRIAL_PLAYERS
 * ovan. */
export const CALLED_SQUAD: { starting: string[]; bench: string[] } = {
  starting: [],
  bench: [
    // MV
    "Ali Carneil",
    // Backar
    "Adnan Hadzialic",
    "Daniel Matin",
    "Meysam Hoseni",
    "Rayan Fedaila",
    "Vedad Dzambegovic",
    // Mittfält
    "Ahmad Aljafari",
    "Idris Abdi",
    "Ihab Naser",
    "Mustafa Ayoub",
    "Måns Orwén",
    // Anfall
    "Aldin Zeljkovic",
    "Haris Avdiu",
    "Kamal Mustafa",
    "Leodon Johansson",
    "Yosef Ismail",
  ],
};

export const FOCUS: string[] = [
  "Svaret på Velebit. 0–5 var ingen taktisk fråga — det var inställning. Den sätts före avspark, inte när vi ligger under.",
  "Vinn duellerna och andrabollarna. Velebit sprang på varje boll, möjlig som omöjlig. På Hjällbovallen är det vi som gör det.",
  "Håll ihop i 90. Tre insläppta på tolv minuter i slutet — koncentrationen ska bära hela vägen, oavsett ställning.",
];

/* Ingen startelva spikad än mot Kareby — bara Ali given i mål.
 * Fyll i 11 slots när XI:n sätts. FORMATION.length måste matcha
 * CALLED_SQUAD.starting.length. */
export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Förutsättningar",
    eyebrow: "Kontext",
    bullets: [
      "Seriematch hemma mot Kareby IS · Hjällbovallen 1 Gräs · lördag 29 aug 13:00.",
      "Samling 11:30 på HJÄLLBOVALLEN. Ombytta och klara.",
      "Vi är tvåa med 34 poäng, Lerum leder på 44 efter sexton omgångar. Kareby är femma på 22.",
      "Sex matcher kvar. En poäng på tre matcher efter uppehållet — trenden vänder här.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["16 kallade", "XI sätts på genomgång", "Kroppen först"],
    bullets: [
      "16 spelare kallade. Samling 11:30 på Hjällbovallen — ombytta och klara.",
      "Ali Carneil står i mål. Resten av startelvan sätts på matchgenomgången.",
      "Kroppen först: säg till direkt om något känns, så vi sätter rätt trupp.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Senast spelat — KF Velebit 0–5",
    eyebrow: "Bortamötet",
    principles: ["Reflektion", "Svar", "Nästa aktion"],
    bullets: [
      "Vi förlorade 0–5 borta den 22 aug — andra raka förlusten och den tyngsta insatsen på hela säsongen.",
      "Yosef Ismail nickade i ribban i den 12:e på inlägg av Kamal Mustafa. Sedan tog Velebit över: 1–0 efter en halvtimme, 2–0 i den 56:e och tre mål mellan minut 74 och 86, varav ett på straff.",
      "Velebit sprang på varje boll, möjlig som omöjlig. Vi hade inte den inställningen den dagen — andra halvlek förlorade vi 0–4.",
      "Benjamin Arapovic blev matchens lirare, med Ahmad Aljafari och Idris Abdi närmast.",
      "Läget: 16 matcher, 10 vinster, 4 oavgjorda, 2 förluster. Tio poäng upp till Lerum, sex matcher kvar.",
    ],
  },
  {
    id: "motstandare",
    num: "04",
    title: "Motståndare — Kareby IS",
    eyebrow: "Division 4A · hemma",
    bullets: [
      "Hemmamatch på Hjällbovallen 1 Gräs · lördag 29 aug 13:00.",
      "Kareby är femma med 22 poäng på 16 matcher (5 vinster, 7 oavgjorda, 4 förluster), 36–28 i målskillnad.",
      "Vårmötet borta 8 maj slutade 1–1 — de hänger kvar i matcher och är svåra att skaka av sig.",
      "Fyll på /motstandaranalys under veckan när vi sett dem närmare.",
    ],
    note: "Sju oavgjorda av sexton — Kareby lever på att hålla matcher jämna. Vi bryter det genom att vinna andrabollarna och hålla nollan tillräckligt länge.",
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
      "5. Fyll på i box — minst 4 av oss i/runt boxen vid inlägg. 9 straffp, motsatt ytter bortre, 8 första, 10 cutback, 6:an hänger 18 m för andrabollen.",
    ],
  },
  {
    id: "forsvar",
    num: "07",
    title: "Försvar",
    eyebrow: "Villkor → lås → vinn",
    principles: ["Villkoret först", "Höga linjer", "Tre korridorer"],
    bullets: [
      "Villkoret för hög press: linjerna höga OCH leden kompakta. Är det uppfyllt går vi direkt, högt och med full kraft — det är så vi vinner bollen på deras planhalva.",
      "Är vi utdragna eller nyss omställda: samla först, pressa sen. Tokpress ur obalans är det enda som ger dem djupled.",
      "Styr pressen åt en sida. YB på YB — lås bollsida, stoppa spelvändning.",
    ],
    note: "Hög press och \"samla först\" är inte två olika planer — det är samma plan med ett villkor. Läs laget, inte bollen.",
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
    principles: ["Hybrid", "Zon + 2 man", "Andraboll"],
    bullets: [
      "Försvar: hörna, inläggsfrispark, målchansfrispark, inkast — hybrid (zon + 2 man) + andraboll.",
      "Anfall: hörnor och inläggsfrisparkar bekräftas på genomgången när kallelsen är satt. Målchansfrispark: bestäm själva.",
      "Inkast: djupt = tryck + direkt återerövring.",
    ],
  },
  {
    id: "roller",
    num: "11",
    title: "Roller",
    eyebrow: "Ansvar",
    roles: [
      ["Kapten", "Adnan \"Ado\" Hadzialic"],
      ["Hörnor", "Bekräftas på genomgång"],
      ["Inläggsfrispark", "Bekräftas på genomgång"],
      ["Målchansfrispark", "Bekräftas på genomgång"],
      ["Samling", "11:30 · Hjällbovallen"],
      ["Matchstart", "13:00"],
      ["Hemmaplan", "Hjällbovallen 1 Gräs"],
    ],
  },
];
