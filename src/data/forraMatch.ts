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
  "2026-06-05-hisingsbacka": {
    summary:
      "Vi vann 4–0 borta mot Hisingsbacka FC — Haris Avdiu hattrick, Mustafa Ayub satte det sista.",
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  },
  "2026-06-17-ytterby": {
    summary:
      "Vi vann 4–1 borta mot Ytterby IS (1–1 i halvtid). Nyförvärvet Mustafa \"Musti\" Ayoub gjorde två mål och utsågs till matchens lirare, Måns Orwén dunkade in 1–3 som inbytt och Haris Avdiu satte 4–1 i slutsekunderna. Haris toppar nu seriens skytteliga på 12 mål och segern tog oss upp i serieledning.",
    truppen: [],
    ejTillgangliga: [],
    blocks: STANDARD_BLOCKS,
    larDomar: [],
  },
  "2026-06-13-floda": {
    summary:
      "Vi vann 5–1 hemma mot Floda BoIF — Haris Avdiu nytt hattrick (andra raka), Idris Abdi två mål. När vi följde matchplanen var vi klart bättre: vi styrde matchen, vann boll högt och höll dem borta från farliga lägen.",
    truppen: [],
    ejTillgangliga: [],
    blocks: [
      {
        badge: "Bra",
        title: "Det här fungerade",
        bullets: [
          "När vi följde matchplanen var vi klart bättre — vi styrde matchen, vann boll högt och skapade chanser.",
          "Spelvändningar: vi vågade locka motståndaren åt ett håll och vände sedan snabbt ut till fri kant.",
          "Aggressivt försvarsspel: vi pressade tillsammans och stängde de ytor vi hade bestämt — ingen pressade ensam.",
          "Löpningar in i box: vi blev farliga när fler spelare fyllde på i straffområdet, inte bara en att slå inlägget på.",
        ],
      },
      {
        badge: "Förbättra",
        title: "Det här tar vi tag i",
        bullets: [
          "Kontrollera matchen vid klar ledning. När vi leder 4–0 ska vi inte göra matchen öppen igen — vi ska inte försöka vinna den en gång till.",
          "Tvinga inte fram svåra passningar framåt när vi leder klart. Håll bollen, spela enkelt, flytta laget tillsammans och välj rätt läge att attackera — ge dem inte energi genom våra misstag.",
          "Roll och matchplan: alla ska veta sin uppgift. Är du osäker — fråga. Kommer du in från bänken — följ planen direkt.",
        ],
      },
      {
        badge: "Anfall",
        title: "Anfall — så blev det",
        bullets: [
          "Spelvändningar öppnade spelet: vi spelade fast bollen på en sida, lockade över deras spelare, spelade hem/in centralt och vände snabbt ut till motsatt kant där yttern fick tid att attackera framåt.",
          "Box-löpningar gav flera hot: när yttern kom runt gick forwarden mot första ytan, tia/åtta fyllde på centralt och bortre ytter attackerade bortre stolpen.",
        ],
      },
      {
        badge: "Försvar",
        title: "Försvar — så blev det",
        bullets: [
          "Samlad press fungerade: när deras mittback fick bollen felvänd eller med dålig touch gick forwarden direkt i press, närmaste mittfältare klev upp och ytterbacken tryckte in bakom — ingen enkel väg ut.",
          "En spelare pressar aldrig ensam. När en går, går laget med.",
        ],
      },
      { badge: "Omställningar", title: "Omställningar", bullets: [] },
      { badge: "Fasta", title: "Fasta situationer", bullets: [] },
    ],
    larDomar: [
      "När matchen är vår ska vi stänga den med kontroll, tålamod och disciplin.",
      "Våga locka motståndaren åt ett håll och byt sedan sida snabbt.",
      "När en pressar går laget med — vi pressar aldrig ensamma.",
      "När vi kommer runt på kanten ska boxen fyllas med tydliga löpningar.",
      "Alla kan sin roll i matchplanen. Inbytare gör rätt sak först — fråga om du är osäker.",
    ],
  },
  "2026-08-01-fassbergs": {
    summary:
      "Vi förlorade 2–4 hemma mot Fässbergs IF (0–1 i halvtid) i genrepet efter uppehållet. Idris Abdi gjorde båda målen, det andra på straff till 2–2, innan Fässberg drog ifrån till 2–3 och 2–4. Spel och chanser var ganska jämnt fördelade — Mustafa Ayoub hade ett par riktigt vassa lägen men deras målvakt räddade. Träningsmatch: resultatet räknas inte i tabellen, matchbilden gör det.",
    truppen: [],
    ejTillgangliga: [],
    blocks: [
      { badge: "Bra", title: "Det här fungerade", bullets: [] },
      {
        badge: "Förbättra",
        title: "Det här tar vi tag i",
        bullets: [
          "Försvarsspelet måste tightas till — fyra insläppta är för många, och två av dem kom när matchen var öppen igen efter vår kvittering.",
          "Anfallsspelet behöver bli rakare och djupare. Vi kom till lägen, men för sällan genom att attackera djupled direkt.",
        ],
      },
      { badge: "Anfall", title: "Anfall — så blev det", bullets: [] },
      { badge: "Försvar", title: "Försvar — så blev det", bullets: [] },
      { badge: "Omställningar", title: "Omställningar", bullets: [] },
      { badge: "Fasta", title: "Fasta situationer", bullets: [] },
    ],
    larDomar: [
      "Rytmen efter fem veckors uppehåll kommer inte gratis — den ska tas tillbaka på träning, inte hoppas fram på matchdagen.",
      "När vi kvitterat ska nästa boll vara den mest disciplinerade, inte den mest ivriga.",
    ],
  },
  "2026-08-08-partille": {
    summary:
      "Vi spelade 3–3 borta mot Partille IF FK (1–1 i halvtid) i höstpremiären. Haris Avdiu gjorde två mål — 0–1 i den 32:a och kvitteringen till 2–2 — och inbytte Meysam Hoseni satte 3–3 i den 79:e. Tre gånger fick vi jaga ikapp. Ali Carneil blev matchens lirare. Fortsatt obesegrade i serien, men två tappade poäng.",
    truppen: [],
    ejTillgangliga: [],
    blocks: [
      {
        badge: "Bra",
        title: "Det här fungerade",
        bullets: [
          "Tre mål borta och vi gav aldrig upp matchen — vi kvitterade tre gånger, sist med tio minuter kvar.",
          "Vi skapade de vassaste lägena i slutet, med bland annat en stolpträff när matchen stod och vägde.",
        ],
      },
      {
        badge: "Förbättra",
        title: "Det här tar vi tag i",
        bullets: [
          "Tre insläppta är tre för många. Försvarsspelet startar när motståndaren har bollen — det är vårt signum och den här dagen var det inte det.",
          "Utan storspel av keepern hade det blivit fler baklängesmål. Räddningar ska vara sista utvägen, inte planen.",
          "Disciplin i slutskedet: vi spelade de sista minuterna med en man mindre.",
        ],
      },
      { badge: "Anfall", title: "Anfall — så blev det", bullets: [] },
      {
        badge: "Försvar",
        title: "Försvar — så blev det",
        bullets: [
          "Deras 1–1 kom på hörna. Fasta situationer är fortsatt en läcka att täppa till.",
        ],
      },
      { badge: "Omställningar", title: "Omställningar", bullets: [] },
      { badge: "Fasta", title: "Fasta situationer", bullets: [] },
    ],
    larDomar: [
      "Vi vinner inte matcher på att kvittera tre gånger — vi vinner dem på att inte hamna under.",
      "Nästa aktion efter en kvittering avgör: håll bollen och laget samlat i stället för att jaga fram nästa mål direkt.",
      "En andra varning i den 86:e kostar mer än en match — den kostar nästa också.",
    ],
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
