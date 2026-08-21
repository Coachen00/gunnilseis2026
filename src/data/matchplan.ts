/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-08-21 — veckans match är seriematch borta mot
 * KF Velebit (lördag 22 aug 15:00 · Velebit IP). Toppmötet hemma mot Lerum
 * 15 aug slutade 1–3 — första serieförlusten. 16 spelare kallade, elvan spikad
 * (4-3-3). Samling 13:15 på Hjällbovallen, gemensam avfärd.
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
  opponent: "KF Velebit",
  venue: "Velebit IP",
  home: false,
  kickoff: "Lör 22 aug · 15:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
  // Ingen `samling` här: 13:15 härleds ur bortaregeln (15:00 − 1h45).
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
  /** Sista spelade matchen — toppmötet. */
  lastResult: "Lerums IS 1–3 (hemma, 15 aug, första serieförlusten)",
  /** När laget drog igång igen efter sommaruppehållet. */
  trainingResumes: "Måndag 28 juli",
  /** Veckans match (= MATCH_META). */
  nextMatchLabel: "KF Velebit · borta · lör 22 aug 15:00 (Velebit IP)",
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

/* Kallad trupp till bortamatchen mot KF Velebit (22 aug).
 * 16 spelare kallade och startelvan spikad — 4-3-3 med Benji som ensam sexa,
 * Idris och Ihab framför. FORMATION nedan har 11 slots; testet låser att
 * längderna är lika. Namnen stavas exakt som i `data/squad.ts` (fri text,
 * ingen join), eller finns i TRIAL_PLAYERS ovan.
 * Ado Hadzialic är tillbaka efter avtjänad avstängning och startar som mittback. */
export const CALLED_SQUAD: { starting: string[]; bench: string[] } = {
  starting: [
    // MV
    "Ali Carneil",
    // Backar
    "Rayan Fedaila",
    "Ahmad Aljafari",
    "Adnan Hadzialic",
    "Pascal Jabbour",
    // Mittfält
    "Benjamin Arapovic",
    "Idris Abdi",
    "Ihab Naser",
    // Anfall
    "Kamal Mustafa",
    "Yosef Ismail",
    "Leodon Johansson",
  ],
  bench: [
    "Daniel Matin",
    "Meysam Hoseni",
    "Haris Avdiu",
    "Vedad Dzambegovic",
    "Mustafa Ayoub",
  ],
};

export const FOCUS: string[] = [
  "Svaret på Lerum. Första förlusten ändrar ingenting i hur vi spelar — den ändrar hur snabbt vi måste svara. Nästa aktion, inte förra matchen.",
  "Rakare framåt. Mot Lerum fastnade vi i sidled när framåt fanns. Djupled och diagonal före sidledsväxeln — varje gång läget finns.",
  "Vinn duellerna och omställningarna. Det var där Lerum tog matchen, och det är där Velebit borta avgörs — vinn andrabollar och ställ om rakt.",
];

/* Startelvan mot KF Velebit — 4-3-3. Benji ensam sexa, Idris och Ihab
 * framför honom. FORMATION.length måste matcha CALLED_SQUAD.starting.length. */
export const FORMATION: FormationSlot[] = [
  { id: "mv", n: 1, name: "Ali", label: "MV", x: 50, y: 6 },
  { id: "hb", n: 2, name: "Rayan", label: "HB", x: 85, y: 26 },
  { id: "mb-h", n: 5, name: "Ahmad", label: "MB", x: 62, y: 22 },
  { id: "mb-v", n: 4, name: "Ado", label: "MB", x: 38, y: 22 },
  { id: "vb", n: 3, name: "Pascal", label: "VB", x: 15, y: 26 },
  { id: "sexa", n: 6, name: "Benji", label: "CM", x: 50, y: 42 },
  { id: "atta", n: 8, name: "Idris", label: "CM", x: 35, y: 58 },
  { id: "tia", n: 10, name: "Ihab", label: "CM", x: 65, y: 58 },
  { id: "hy", n: 7, name: "Kamal", label: "HY", x: 85, y: 76 },
  { id: "nia", n: 9, name: "Yosef", label: "F", x: 50, y: 82 },
  { id: "vy", n: 11, name: "Leo", label: "VY", x: 15, y: 76 },
];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Förutsättningar",
    eyebrow: "Kontext",
    bullets: [
      "Seriematch borta mot KF Velebit · Velebit IP · lördag 22 aug 15:00.",
      "Samling 13:15 på HJÄLLBOVALLEN — vi åker gemensamt. Ombytta och klara.",
      "Vi är tvåa med 34 poäng, Lerum leder på 41 efter femton omgångar. Velebit är trea på 22.",
      "Sju matcher kvar. Varje poäng räknas nu — vi jagar.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["16 kallade", "Elvan spikad", "Kroppen först"],
    bullets: [
      "16 spelare kallade. Samling 13:15 på Hjällbovallen — gemensam avfärd till Velebit IP.",
      "Startelvan är spikad (4-3-3) — se formationen ovan. Fem på bänken, alla förbereder sig som om de startar.",
      "Idris Abdi bar bindeln mot Lerum och blev matchens lirare.",
      "Kroppen först: säg till direkt om något känns, så vi sätter rätt trupp.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Senast spelat — Lerums IS 1–3",
    eyebrow: "Toppmötet hemma",
    principles: ["Reflektion", "Svar", "Nästa aktion"],
    bullets: [
      "Vi förlorade toppmötet hemma 1–3 den 15 aug — första serieförlusten. Jämn match, men deras två mål i 36:e och 42:a blev tunga att bära in i paus.",
      "Leodon Johansson reducerade i den 89:e som inbytt, assist Pascal Jabbour.",
      "Omställnings- och duellspelet lyfte först efter halvtimmen i andra. Lerum hade den hetaste viljan — det får aldrig vara skillnaden.",
      "Idris Abdi var kapten och matchens lirare. Ali Carneil stod för flera klassingripanden, bland annat en dubbelräddning.",
      "Läget: 15 matcher, 10 vinster, 4 oavgjorda, 1 förlust. Sju poäng upp till Lerum, sju matcher kvar.",
    ],
  },
  {
    id: "motstandare",
    num: "04",
    title: "Motståndare — KF Velebit",
    eyebrow: "Division 4A · borta",
    bullets: [
      "Bortamatch på Velebit IP · lördag 22 aug 15:00.",
      "Velebit är trea med 22 poäng på 15 matcher (7 vinster, 1 oavgjord, 7 förluster), 25–23 i målskillnad.",
      "Vårmötet hemma 2 maj vann vi 1–0 — tät match som avgjordes på detaljer.",
      "Fyll på /motstandaranalys under veckan när vi sett dem närmare.",
    ],
    note: "Trean på hemmaplan efter vår första förlust — det här är matchen där vi visar att Lerum var ett undantag, inte en riktning.",
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
      ["Samling", "13:15 · Hjällbovallen"],
      ["Matchstart", "15:00"],
      ["Bortaplan (spelas där)", "Velebit IP"],
    ],
  },
];
