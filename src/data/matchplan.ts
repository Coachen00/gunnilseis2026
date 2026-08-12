/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-08-12 — TOPPMÖTET. Veckans match är seriematch hemma
 * mot Lerums IS (lördag 15 aug 13:00 · Hjällbovallen 1 Gräs): serieledaren mot
 * tvåan, båda obesegrade. Kallelsen är INTE publicerad än → CALLED_SQUAD tom.
 * Höstpremiären borta mot Partille 8 aug slutade 3–3. SEASON_BREAK.active = false.
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
  opponent: "Lerums IS",
  venue: "Hjällbovallen 1 Gräs",
  home: true,
  kickoff: "Lör 15 aug · 13:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: ["Adnan Hadzialic — avstängd (rött kort mot Partille)"],
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
  /** Sista spelade matchen — höstpremiären. */
  lastResult: "Partille IF FK 3–3 (borta, 8 aug, höstpremiär)",
  /** När laget drog igång igen efter sommaruppehållet. */
  trainingResumes: "Måndag 28 juli",
  /** Veckans match (= MATCH_META). */
  nextMatchLabel: "Lerums IS · hemma · lör 15 aug 13:00 (ettan möter tvåan)",
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
      "Presshöjden styrs av villkoret: höga linjer + kompakta led → vi går högt och direkt. Utdragna → samla först, pressa sen.",
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

/* Kallelsen till Lerums IS (15 aug) är inte publicerad än → tom lista, så att
 * Veckans match visar "Ej publicerad" i stället för att låta förra veckans
 * kallelse stå kvar som om den gällde. Fyll `bench` när kallelsen är satt;
 * spikas en XI: flytta 11 namn till `starting` OCH fyll FORMATION med 11 slots
 * — testet låser att längderna är lika. Namnen stavas exakt som i
 * `data/squad.ts` (fri text, ingen join), eller finns i TRIAL_PLAYERS ovan.
 * Ado Hadzialic är avstängd och ska INTE kallas (se MATCH_META.absent). */
export const CALLED_SQUAD: { starting: string[]; bench: string[] } = {
  starting: [],
  bench: [],
};

export const FOCUS: string[] = [
  "Nollan tillbaka. Tre insläppta mot Partille är tre för många — försvarsspelet är vårt signum, inte något keepern ska rädda oss ur.",
  "Vinn andrabollen och ställ om rakt. I våras ägde de bollen i första halvlek och vi kom till vårt via omställningar — den vägen är öppen igen.",
  "Fyra poäng upp med åtta matcher kvar. Vinner vi är det en poäng, förlorar vi sju. Serien avgörs den här lördagen.",
];

/* Ingen startelva spikad än — kallelsen till Lerum är inte satt.
 * Fyll i 4-2-3-1-positioner (11 slots) när en XI sätts.
 * FORMATION.length måste matcha CALLED_SQUAD.starting.length. */
export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Förutsättningar",
    eyebrow: "Kontext",
    bullets: [
      "Toppmöte hemma mot Lerums IS · Hjällbovallen 1 Gräs · lördag 15 aug 13:00.",
      "Samling 11:30 på HJÄLLBOVALLEN — vi spelar hemma. Ombytta och klara.",
      "Ettan möter tvåan: Lerum 38 poäng, vi 34 efter fjorton omgångar. Båda har noll i förlustkolumnen.",
      "Åtta matcher kvar. Vinner vi är det en poäng upp, förlorar vi sju.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["Kallelse ej satt", "Kapten", "Kroppen först"],
    bullets: [
      "Kallelsen är inte publicerad än — den sätts under veckan och läggs upp här.",
      "Adnan \"Ado\" Hadzialic står över: andra varningen i den 86:e mot Partille.",
      "Idris Abdi är fortsatt lagkapten.",
      "Kroppen först: säg till direkt om något känns, så vi sätter rätt trupp.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Senast spelat — Partille IF FK 3–3",
    eyebrow: "Höstpremiären borta",
    principles: ["Reflektion", "Energi", "Nästa aktion"],
    bullets: [
      "Vi spelade 3–3 borta mot Partille IF FK (1–1 i halvtid) 8 aug. Haris Avdiu gjorde två mål, Meysam Hoseni kvitterade i den 79:e som inbytt.",
      "Vi ledde i den 32:a, men släppte in på hörna i den 39:e och låg sedan under både 2–1 och 3–2. Tre gånger fick vi jaga ikapp.",
      "Ali Carneil blev matchens lirare och räddade oss från fler baklängesmål. Det är inte så vårt försvarsspel ska bäras upp.",
      "Vi avslutade med en man mindre — Ado Hadzialic fick rött i den 86:e och är avstängd mot Lerum.",
      "I serien är vi fortsatt obesegrade: 14 matcher, 10 vinster, 4 oavgjorda.",
    ],
  },
  {
    id: "motstandare",
    num: "04",
    title: "Motståndare — Lerums IS",
    eyebrow: "Division 4A · hemma",
    bullets: [
      "Hemmamatch på Hjällbovallen 1 Gräs · lördag 15 aug 13:00.",
      "Lerum leder serien med 38 poäng på 14 matcher (12 vinster, 2 oavgjorda, 0 förluster).",
      "Tio insläppta mål på fjorton matcher — seriens klart bästa försvar. Vi har gjort flest mål (42), de har släppt in minst.",
      "Vårmötet på Rydsberg 24 april slutade 0–0. De styrde första halvlek med boll och chanser, vi tog över i andra — Sabarr Janneh var banans gigant och Ali Carneil höll nollan.",
      "Fyll på /motstandaranalys under veckan när vi sett dem närmare.",
    ],
    note: "0–0 i våras säger vad matchen är: två lag som inte förlorar. Den som vinner gör det på en detalj — en fast situation, en andraboll, en omställning.",
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
      ["Kapten", "Idris Abdi"],
      ["Hörnor", "Bekräftas på genomgång"],
      ["Inläggsfrispark", "Bekräftas på genomgång"],
      ["Målchansfrispark", "Bekräftas på genomgång"],
      ["Samling", "11:30 · Hjällbovallen"],
      ["Matchstart", "13:00"],
      ["Hemmaplan (spelas här)", "Hjällbovallen 1 Gräs"],
    ],
  },
];
