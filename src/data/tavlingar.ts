/**
 * Intern poängliga för Gunnilse-träningarna ("Tävlingar").
 * Poäng per tillfälle är lagpoäng + närvaro, satta manuellt av ledarstaben.
 * Uppdateras veckovis efter varje träningstillfälle.
 */

/** Ledord för poängligan — varför vi tävlar varje träning. */
export interface Quote {
  text: string;
  attribution: string;
}

export const QUOTE: Quote = {
  text: "Det är de långsiktiga målen som visar vart vi ska — men det är de akuta vinsterna, en träning och en poäng i taget, som bär oss dit. Varje seger här är ett litet steg på en lång resa.",
  attribution: "Gunnilse IS, ledarstaben",
};

export interface PointRule {
  label: string;
  points: string;
  detail: string;
}

export const POINT_RULES: PointRule[] = [
  { label: "Vinst", points: "3 p", detail: "Per vunnen match" },
  { label: "Oavgjort", points: "1 p", detail: "Per oavgjord match" },
  { label: "Förlust", points: "0 p", detail: "Ingen poäng" },
  { label: "Närvaro", points: "+1 p", detail: "Till alla som dyker upp och spelar" },
];

/**
 * En enskild smålagsmatch inom ett tillfälle. Rött lag = hemmasiffran.
 * När exakta siffror inte noterats anges bara utgången via `winner`.
 */
export interface SessionMatch {
  red?: number;
  black?: number;
  winner?: "red" | "black" | "draw";
}

export interface Session {
  /** Stabilt id, även index i varje spelares `scores`-array. */
  index: number;
  label: string;
  /** ISO-datum, sorteringsbart. */
  date: string;
  dateShort: string;
  type: string;
  matches: SessionMatch[];
  note?: string;
}

export const SESSIONS: Session[] = [
  {
    index: 0,
    label: "Tillfälle 1",
    date: "2026-05-27",
    dateShort: "27/5",
    type: "Träning",
    matches: [
      { red: 0, black: 1 },
      { red: 2, black: 0 },
      { red: 1, black: 1 },
    ],
    note: "Rött lag spelade först i Match 1.",
  },
  {
    index: 1,
    label: "Tillfälle 2",
    date: "2026-06-03",
    dateShort: "3/6",
    type: "Träning",
    matches: [
      { red: 1, black: 1 },
      { red: 3, black: 0 },
      { red: 3, black: 2 },
    ],
    note: "Rött lag spelade först i Match 1.",
  },
  {
    index: 2,
    label: "Tillfälle 3",
    date: "2026-06-10",
    dateShort: "10/6",
    type: "Träning",
    matches: [
      { winner: "red" },
      { red: 1, black: 1 },
      { winner: "black" },
    ],
    note: "Siffror noterades inte för match 1 och 3 — bara vinnande lag.",
  },
];

export interface PlayerEntry {
  name: string;
  /** Smeknamn, t.ex. "Ado" för Adnan. */
  alias?: string;
  /** Poäng per tillfälle; null = ej närvarande. Index följer SESSIONS. */
  scores: (number | null)[];
}

export const PLAYERS: PlayerEntry[] = [
  { name: "Ali", scores: [8, 8, 5] },
  { name: "Galwan", scores: [5, 8, null] },
  { name: "Adnan", alias: "Ado", scores: [2, 8, 5] },
  { name: "Mustafa", alias: "Musti", scores: [5, 5, 5] },
  { name: "Rayan", scores: [5, 5, 5] },
  { name: "Soheyl", scores: [5, 5, 2] },
  { name: "Haris", scores: [5, 5, null] },
  { name: "Ayub", scores: [8, 2, 2] },
  { name: "Aldin", scores: [8, 2, null] },
  { name: "Daniel", scores: [null, 8, null] },
  { name: "Leo", scores: [null, 8, 5] },
  { name: "Meisam", scores: [8, null, 5] },
  { name: "Kamal", scores: [8, null, 8] },
  { name: "Nayef", scores: [2, 5, 5] },
  { name: "Ahmed", scores: [null, 5, 5] },
  { name: "Maric", scores: [null, 5, null] },
  { name: "Benji", scores: [null, 5, null] },
  { name: "Idriss", scores: [5, null, 2] },
  { name: "Yosef", scores: [5, null, 5] },
  { name: "Ihab", scores: [5, null, 8] },
  { name: "Parsa", scores: [2, 2, 5] },
  { name: "Rinor", scores: [null, 2, 5] },
  { name: "Vedad", scores: [null, 2, 2] },
  { name: "Måns", scores: [2, null, 5] },
  { name: "Pascal", scores: [2, null, null] },
  { name: "Tess", scores: [null, null, 5] },
];

export interface RankedPlayer extends PlayerEntry {
  total: number;
  /** Antal tillfällen spelaren deltagit. */
  played: number;
  /** Placering, delad vid lika poäng (standard competition ranking). */
  rank: number;
}

const sumScores = (scores: (number | null)[]) =>
  scores.reduce<number>((acc, s) => acc + (s ?? 0), 0);

/**
 * Sorterar fallande på total och tilldelar placering. Lika poäng delar
 * placering; nästa placering hoppar förbi antalet delade (1224-ranking).
 * Stabil sortering bevarar inmatningsordning vid exakt lika.
 */
export function rankPlayers(players: PlayerEntry[] = PLAYERS): RankedPlayer[] {
  const withTotals = players.map((p) => ({
    ...p,
    total: sumScores(p.scores),
    played: p.scores.filter((s) => s !== null).length,
  }));

  withTotals.sort((a, b) => b.total - a.total);

  let lastTotal: number | null = null;
  let lastRank = 0;
  return withTotals.map((p, i) => {
    const rank = p.total === lastTotal ? lastRank : i + 1;
    lastTotal = p.total;
    lastRank = rank;
    return { ...p, rank };
  });
}

export function describeMatch(match: SessionMatch): string {
  const winner =
    match.winner ??
    ((match.red ?? 0) > (match.black ?? 0)
      ? "red"
      : (match.black ?? 0) > (match.red ?? 0)
        ? "black"
        : "draw");
  if (winner === "red") return "Rött lag vann";
  if (winner === "black") return "Svart lag vann";
  return "Oavgjort";
}

/**
 * Dumle CUP — individuell poängjakt vid sidan av den ordinarie poängligan.
 * Tabellen räknas SPELARE FÖR SPELARE i en löpande total. Lagindelningen på
 * träningen (svart/grönt) avgör bara hur många poäng varje spelare får det
 * tillfället — laget är inte en tävlingsenhet. Index i `scores` följer
 * DUMLE_CUP_SESSIONS; null = ej närvarande/poäng ej registrerad.
 */
export interface CupSession {
  label: string;
  dateShort?: string;
}

export const DUMLE_CUP_SESSIONS: CupSession[] = [{ label: "Tillfälle 1" }];

export const DUMLE_CUP_PLAYERS: PlayerEntry[] = [
  // 14 p — spelade i svarta laget tillfälle 1
  { name: "Ali", scores: [14] },
  { name: "Pascal", scores: [14] },
  { name: "Benji", scores: [14] },
  { name: "Mustafa", scores: [14] },
  { name: "Nayef", scores: [14] },
  { name: "Ado", scores: [14] },
  { name: "Aldin", scores: [14] },
  { name: "Kamal", scores: [14] },
  { name: "Meisam", scores: [14] },
  { name: "Rayan", scores: [14] },
  // 8 p — spelade i gröna laget tillfälle 1
  { name: "Parsa", scores: [8] },
  { name: "Kian", scores: [8] },
  { name: "Haris", scores: [8] },
  { name: "Galvan", scores: [8] },
  { name: "Rinor", scores: [8] },
  { name: "Omar", scores: [8] },
  { name: "Shoheyb", scores: [8] },
  { name: "Måns", scores: [8] },
  { name: "Leo", scores: [8] },
  // Osäker närvaro tillfälle 1 ("(Elias)") — poäng ej registrerad
  { name: "Elias", scores: [null] },
];

export const DUMLE_CUP = {
  title: "Dumle CUP",
  emoji: "🏆",
} as const;

/** Poängligan med rött/svart lag heter "Kungen". */
export const KUNGEN = {
  title: "Kungen",
  emoji: "👑",
} as const;
