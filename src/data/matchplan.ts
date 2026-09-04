/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-09-04 — veckans match är seriematch borta mot
 * IFK Björkö (lördag 5 sep 14:00 · Björkö 1 Gräs). Hemmamatchen mot Kareby IS
 * 29 aug slutade 5–1. Björkö nås bara med färja, så vi samlas 12:30 PÅ PLATS
 * på Björkövallen — ingen gemensam avfärd från Hjällbovallen den här veckan.
 * Resvägen och färjetiderna ligger i `TRAVEL`.
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
  /**
   * Nödutgång: samlingsplats som överrider klubbregeln (alltid Hjällbovallen,
   * se `GATHERING_PLACE`).
   *
   * Samma disciplin som `samling` — tom i normalfallet. Sätts bara när vi
   * faktiskt inte kan åka gemensamt från Hjällbovallen, t.ex. en bortaplan
   * som nås med färja.
   */
  samlingsplats?: string;
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
  opponent: "IFK Björkö",
  venue: "Björkö 1 Gräs",
  home: false,
  kickoff: "Lör 5 sep · 14:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
  // Undantaget, inte regeln: Björkövallen ligger på en ö och nås med färja
  // från Lilla Varholmen. Vi åker alltså inte gemensamt från Hjällbovallen —
  // var och en tar sig ut och vi möts på plats 1h30 före avspark.
  samling: "12:30",
  samlingsplats: "Björkövallen",
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
  lastResult: "Kareby IS 5–1 (hemma, 29 aug, Haris hat-trick)",
  /** När laget drog igång igen efter sommaruppehållet. */
  trainingResumes: "Måndag 28 juli",
  /** Veckans match (= MATCH_META). */
  nextMatchLabel: "IFK Björkö · borta · lör 5 sep 14:00 (Björkö 1 Gräs)",
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
 * Var vi samlas — Hjällbovallen som regel, även när matchen spelas någon
 * annanstans. `MATCH_META.samlingsplats` är nödutgången för de enstaka
 * matcher där vi inte kan åka gemensamt härifrån.
 *
 * Egen konstant för att hero-kortet visar "Samling 13:15" bredvid
 * "Matchplats: Lexby 1 Gräs". Utan platsen utskriven under samlingstiden läser
 * spelaren ihop de två och åker direkt till bortaplanen. Platsen måste stå
 * bredvid tiden, inte bara i schemat längre ner.
 */
export const HOME_GATHERING_PLACE = "Hjällbovallen";

export const GATHERING_PLACE = MATCH_META.samlingsplats ?? HOME_GATHERING_PLACE;

/** Lång form med destination — används i schemat och i praktisk info. */
export const GATHERING_NOTE = MATCH_META.home
  ? `${GATHERING_PLACE} — vi spelar hemma`
  : MATCH_META.samlingsplats
    ? `${GATHERING_PLACE} — vi möts på plats, egen resa. Matchplats: ${MATCH_META.venue}`
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
  gatheringNote: `Samling ${SAMLING_TIME} på ${GATHERING_NOTE}. Mental start före uppvärmning.`,
} as const;

export type TravelInfo = {
  title: string;
  /** En mening: hur vi tar oss dit. */
  lead: string;
  /** Stegen i den ordning spelaren gör dem. */
  steps: { label: string; text: string }[];
  ferry: {
    line: string;
    route: string;
    crossing: string;
    /**
     * Avgångar dit — bara fönstret som är relevant för samlingen.
     *
     * `tone` styr färgen i listan. Utan den läser man fyra likadana rader och
     * plockar den sista man hinner läsa — inklusive den som är för sen.
     */
    out: { time: string; note?: string; tone?: "recommended" | "last" | "late" }[];
    /** Avgångar hem efter matchen. */
    back: string[];
    infoUrl: string;
  };
  /** Det som får folk att missa avspark om de inte läser det. */
  warnings: string[];
  mapUrl: string;
};

/**
 * Resvägen till veckans match. `null` när matchen inte kräver något utöver
 * att ta sig till planen — då visas inget resekort på Veckans match.
 *
 * Björkö nås bara med färja, och Lilla Varholmen har TVÅ färjelinjer som
 * lägger till på samma färjeläge: Björköleden (väg 1135, till Björkö) och
 * Hönöleden (väg 155, till Hönö). Kör man in i fel kö hamnar man på fel ö —
 * det finns ingen bro mellan Hönö och Björkö. Därför står linjenamnen
 * utskrivna i stället för bara "ta färjan".
 *
 * Tiderna är Björköledens helgtidtabell (lördag, söndag och helgdag),
 * verifierad 2026-09-04 mot Trafikverket och livetrafik.com: var 30:e minut
 * mitt på dagen, var 20:e från 15:10. Ändras tidtabellen är det HÄR den ska
 * rättas — inga kopior i COHERENCE eller i sidkomponenten.
 */
export const TRAVEL: TravelInfo | null = {
  title: "Så tar du dig till Björkö",
  lead: "Ingen gemensam buss. Var och en tar sig ut till ön — vi möts på Björkövallen 12:30.",
  steps: [
    {
      label: "Kör till Lilla Varholmen",
      text: "Väg 155 västerut över Hisingen, genom Torslanda, ända ut till färjeläget Lilla Varholmen. Det är enda vägen ut — räkna med kö en lördag.",
    },
    {
      label: "Ställ dig i BJÖRKÖ-kön",
      text: "Två färjelinjer lägger till på samma färjeläge. Björköleden går till Björkö, Hönöleden till Hönö. Följ skyltarna mot Björkö och läs destinationen på färjan innan du kör ombord.",
    },
    {
      label: "Åk över — sex minuter",
      text: "Björköleden går Lilla Varholmen–Björkö. 900 meter, cirka sex minuter, avgiftsfritt. Du kliver av i Grönevik på Björkö.",
    },
    {
      label: "Grönevik → Björkövallen",
      text: "Björkövallen ligger på Ekvägen, någon minut från färjeläget. Kartlänken tar dig hela vägen fram.",
    },
  ],
  ferry: {
    line: "Björköleden (väg 1135)",
    route: "Lilla Varholmen → Björkö (Grönevik)",
    crossing: "900 m · ca 6 min · avgiftsfritt",
    out: [
      { time: "11:10" },
      { time: "11:40", note: "Ta den här — då är du på plats med marginal", tone: "recommended" },
      { time: "12:10", note: "Sista färjan som hinner till samlingen", tone: "last" },
      { time: "12:40", note: "För sent — du missar samlingen", tone: "late" },
    ],
    back: ["15:40", "16:00", "16:20", "16:40", "17:00", "17:20"],
    infoUrl: "https://www.trafikverket.se/resa-och-trafik/farjetrafik/bjorkoleden/",
  },
  warnings: [
    "Hamnar du i Hönö-kön kommer du till fel ö. Det går ingen bro mellan Hönö och Björkö — du får åka tillbaka till fastlandet och börja om.",
    "Färjan tar bilarna i kön i tur och ordning. Blir den full väntar du 30 minuter på nästa. Var vid färjeläget senast 11:30.",
    "Samåk. Färre bilar i kön är färre som riskerar att bli kvar på fastlandet.",
  ],
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Bj%C3%B6rk%C3%B6vallen%2C%20Ekv%C3%A4gen%2C%20Bohus-Bj%C3%B6rk%C3%B6",
};

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

/* Kallad trupp till bortamatchen mot IFK Björkö (5 sep).
 * 16 spelare kallade — Kareby-truppen minus Meysam Hoseni och Aldin
 * Zeljkovic, plus Arshin Wosoughian och Ibrahim Haber. Ali i mål, men ingen
 * spikad startelva än (starting tom tills XI sätts). Namnen stavas exakt
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
    "Rayan Fedaila",
    "Vedad Dzambegovic",
    // Mittfält
    "Ahmad Aljafari",
    "Ibrahim Haber",
    "Idris Abdi",
    "Ihab Naser",
    "Mustafa Ayoub",
    "Måns Orwén",
    // Anfall
    "Arshin Wosoughian",
    "Haris Avdiu",
    "Kamal Mustafa",
    "Leodon Johansson",
    "Yosef Ismail",
  ],
};

export const FOCUS: string[] = [
  "Kareby var svaret. Nu gör vi det till vana — högt utgångsläge, press med utdelning, hela matchen.",
  "Björkö behöver poängen mer än vi. Ett lag som spelar för kontraktet börjar hårt. Vi möter första kvarten stående.",
  "Egen resa ut till ön. Kom i tid — vi har ingen gemensam buss att skylla på.",
];

/* Ingen startelva spikad än mot Björkö — bara Ali given i mål.
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
      "Seriematch borta mot IFK Björkö · Björkö 1 Gräs · lördag 5 sep 14:00.",
      "Samling 12:30 på BJÖRKÖVALLEN. Egen resa med färjan från Lilla Varholmen.",
      "Vi är tvåa med 37 poäng, Lerum leder på 47 efter sjutton omgångar. Björkö är tia på 17.",
      "Fem matcher kvar. 5–1 mot Kareby bröt raden — nu bygger vi vidare på den.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["16 kallade", "XI sätts på genomgång", "Kroppen först"],
    bullets: [
      "16 spelare kallade. Vi möts på Björkövallen.",
      "Ali Carneil står i mål. Resten av startelvan sätts på matchgenomgången.",
      "Två nya in i truppen: Arshin Wosoughian och Ibrahim Haber.",
      "Kroppen först: säg till direkt om något känns, så vi sätter rätt trupp.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Senast spelat — Kareby IS 5–1",
    eyebrow: "Hemmamötet",
    principles: ["Svar", "Press med utdelning", "Nästa aktion"],
    bullets: [
      "Vi vann 5–1 hemma den 29 aug — svaret på 0–5 mot Velebit kom direkt.",
      "Haris Avdiu gjorde hat-trick: 1–0 redan i andra minuten framspelad av Kamal Mustafa, 2–0 i den 10:e på Mustafa Ayoubs pass, och 4–1 efter ett snappat bakåtpass.",
      "Kareby reducerade på frispark minuten före paus. Adnan Hadzialic nickade in 3–1 vid första stolpen på offensiv hörna i den 73:e, Aldin Zeljkovic satte 5–1 i den 79:e.",
      "Nyckeln var det höga utgångsläget: pressen gav utdelning och vi sparade löpkilometer i omställningarna. Andra halvlek vann vi den här gången.",
      "Idris Abdi blev matchens lirare. Läget: 17 matcher, 11 vinster, 4 oavgjorda, 2 förluster.",
    ],
  },
  {
    id: "motstandare",
    num: "04",
    title: "Motståndare — IFK Björkö",
    eyebrow: "Division 4A · borta",
    bullets: [
      "Bortamatch på Björkövallen · lördag 5 sep 14:00. Ön nås bara med färja — se resvägen.",
      "Björkö är tia med 17 poäng på 16 matcher och −12 i målskillnad. De spelar för kontraktet.",
      "Vårmötet hemma 16 maj vann vi 3–1. Men förra säsongens höstmöte på Hjällbovallen vann de — och säkrade kvar sig på det.",
      "Fyll på /motstandaranalys under veckan när vi sett dem närmare.",
    ],
    note: "Ett lag som behöver poängen börjar hårt. Första kvarten avgör om matchen spelas på deras planhalva eller vår.",
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
      ["Samling", "12:30 · Björkövallen"],
      ["Matchstart", "14:00"],
      ["Bortaplan", "Björkö 1 Gräs"],
    ],
  },
];
