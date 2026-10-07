/**
 * Kval till division 3 hösten 2026 — grupp 9, allt vi vet på ett ställe.
 *
 * Källor (alla lästa 2026-10-07, `KVAL_VERIFIED`):
 *   - SvFF "Gruppindelningar och spelordningar för kvalspelet 2026" — format,
 *     spelordning, regeln om bästa kvallag.
 *   - SvFF:s tävlingsbestämmelser för kvalspel (distriktsversionen, Dalarna
 *     2026) — straffläggning och skiljekriterier vid lika poäng.
 *   - svenskalag.se, Gunnilse IS herr — kvalmatchernas tid och plan,
 *     referatet från Floda (4–5).
 *   - SvFF:s FOGIS-tabeller — sluttabellerna i div 4A och div 3 Mellersta Götaland.
 *   - laget.se, Bergdalens IK — samtliga 22 seriematcher, trupp, hemmaplan.
 *
 * Skene IF:s och Götene IF:s seriefacit kommer från lagens egna sidor på
 * laget.se och har inte stämts av mot förbundets tabeller.
 */

export const KVAL_VERIFIED = "2026-10-07";

export type TableRow = {
  pos: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

/** Division 4A Herr, slutställning efter 22 omgångar (FOGIS, 4 okt). */
export const DIV4A_TABLE: TableRow[] = [
  { pos: 1, team: "Lerums IS", played: 22, won: 19, drawn: 3, lost: 0, goalsFor: 68, goalsAgainst: 22, points: 60 },
  { pos: 2, team: "Gunnilse IS", played: 22, won: 14, drawn: 4, lost: 4, goalsFor: 61, goalsAgainst: 33, points: 46 },
  { pos: 3, team: "Hjuviks AIK", played: 22, won: 8, drawn: 6, lost: 8, goalsFor: 36, goalsAgainst: 42, points: 30 },
  { pos: 4, team: "Kareby IS", played: 22, won: 7, drawn: 8, lost: 7, goalsFor: 48, goalsAgainst: 42, points: 29 },
  { pos: 5, team: "KF Velebit", played: 22, won: 9, drawn: 2, lost: 11, goalsFor: 41, goalsAgainst: 38, points: 29 },
  { pos: 6, team: "Partille IF FK", played: 22, won: 8, drawn: 5, lost: 9, goalsFor: 47, goalsAgainst: 52, points: 29 },
  { pos: 7, team: "Ytterby IS", played: 22, won: 8, drawn: 3, lost: 11, goalsFor: 46, goalsAgainst: 54, points: 27 },
  { pos: 8, team: "Hisingsbacka FC", played: 22, won: 8, drawn: 2, lost: 12, goalsFor: 41, goalsAgainst: 56, points: 26 },
  { pos: 9, team: "IFK Björkö", played: 22, won: 7, drawn: 5, lost: 10, goalsFor: 32, goalsAgainst: 48, points: 26 },
  { pos: 10, team: "IF Vardar/Makedonija", played: 22, won: 7, drawn: 4, lost: 11, goalsFor: 39, goalsAgainst: 46, points: 25 },
  { pos: 11, team: "Stenkullen GoIK", played: 22, won: 7, drawn: 3, lost: 12, goalsFor: 33, goalsAgainst: 45, points: 24 },
  { pos: 12, team: "Floda BoIF", played: 22, won: 6, drawn: 3, lost: 13, goalsFor: 43, goalsAgainst: 57, points: 21 },
];

export const OUR_TEAM = "Gunnilse IS";

/** Läget i en mening — siffrorna härleds ur tabellen så de inte kan glida isär. */
export function kvalStatus(table: TableRow[] = DIV4A_TABLE) {
  const us = table.find((r) => r.team === OUR_TEAM);
  const leader = table[0];
  const third = table[2];
  if (!us || !leader || !third) throw new Error("kvalStatus: tabellen saknar Gunnilse, etta eller trea");
  const remaining = 22 - us.played;
  // Kvalplatsen är säkrad när trean inte kan nå oss ens med full pott.
  const secured = third.points + (22 - third.played) * 3 < us.points;
  return {
    position: us.pos,
    points: us.points,
    played: us.played,
    remaining,
    pointsPerMatch: us.points / us.played,
    gapToLeader: leader.points - us.points,
    gapToThird: us.points - third.points,
    secured,
  };
}

export const KVAL_STATUS = kvalStatus();

export const KVAL_GROUP = {
  name: "Grupp 9",
  admin: "Västergötlands FF",
  window: "10–24 oktober",
} as const;

export type KvalTeam = {
  team: string;
  series: string;
  pos: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  /** Två hemmamatcher i kvalet (div 3-laget och bästa kvallag). */
  homeGames: 1 | 2;
  note: string;
};

const us = DIV4A_TABLE.find((r) => r.team === OUR_TEAM)!;

/** Gruppens fyra lag, sorterade på poäng per seriematch. */
export const KVAL_TEAMS: KvalTeam[] = [
  {
    team: "Skene IF",
    series: "Div 4 Södra",
    pos: 2,
    played: 22,
    won: 17,
    drawn: 2,
    lost: 3,
    points: 53,
    homeGames: 2,
    note: "Bästa kvallag. Vann sista seriematchen 5–2, har en spelare med 25 seriemål.",
  },
  {
    team: OUR_TEAM,
    series: "Div 4A Göteborg",
    pos: us.pos,
    played: us.played,
    won: us.won,
    drawn: us.drawn,
    lost: us.lost,
    points: us.points,
    homeGames: 1,
    note: "Näst bästa kvallag. Haris Avdiu vann skytteligan med 22 mål.",
  },
  {
    team: "Götene IF",
    series: "Div 4 Östra",
    pos: 2,
    played: 22,
    won: 12,
    drawn: 6,
    lost: 4,
    points: 42,
    homeGames: 1,
    note: "Tredje bästa kvallag.",
  },
  {
    team: "Bergdalens IK",
    series: "Div 3 Mellersta Götaland",
    pos: 9,
    played: 22,
    won: 7,
    drawn: 3,
    lost: 12,
    points: 24,
    homeGames: 2,
    note: "Nian i division 3. Spelar för att stanna kvar.",
  },
];

export function pointsPerMatch(t: Pick<KvalTeam, "points" | "played">): number {
  return t.points / t.played;
}

export type KvalFixture = {
  round: 1 | 2 | 3;
  home: string;
  away: string;
  /** Bara satt för våra matcher — övriga tider står inte på våra källor. */
  date?: string;
  kickoff?: string;
  gather?: string;
  venue?: string;
  surface?: "Naturgräs" | "Konstgräs";
  url?: string;
};

/** SvFF:s spelordning med lagen insatta. Våra matcher har tid och plan från svenskalag.se. */
export const KVAL_FIXTURES: KvalFixture[] = [
  {
    round: 1,
    home: OUR_TEAM,
    away: "Bergdalens IK",
    date: "Lör 10 okt",
    kickoff: "13:00",
    gather: "11:30",
    venue: "Hjällbovallen 1",
    surface: "Naturgräs",
    url: "https://www.svenskalag.se/gunnilseis-herr/match/21410664/bergdalens-ik",
  },
  { round: 1, home: "Skene IF", away: "Götene IF" },
  {
    round: 2,
    home: "Götene IF",
    away: OUR_TEAM,
    date: "Lör 17 okt",
    kickoff: "14:00",
    gather: "12:30",
    venue: "Västerby IP A-plan",
    url: "https://www.svenskalag.se/gunnilseis-herr/match/21410665/gotene-if",
  },
  { round: 2, home: "Bergdalens IK", away: "Skene IF" },
  {
    round: 3,
    home: "Skene IF",
    away: OUR_TEAM,
    date: "Lör 24 okt",
    kickoff: "15:00",
    gather: "13:30",
    venue: "Kunskapens Hus",
    surface: "Konstgräs",
    url: "https://www.svenskalag.se/gunnilseis-herr/match/21410666",
  },
  { round: 3, home: "Bergdalens IK", away: "Götene IF" },
];

export const OUR_FIXTURES = KVAL_FIXTURES.filter((f) => f.home === OUR_TEAM || f.away === OUR_TEAM);

/** Ordningen när lag hamnar på samma poäng. */
export const KVAL_TIEBREAK = [
  "Målskillnad",
  "Flest gjorda mål",
  "Inbördes möte",
  "Straffläggningen, om inbördes möte slutade oavgjort",
  "Ordinarie serien",
  "Högre division går före",
  "Lottning",
];

export const KVAL_PENALTIES = {
  headline: "Oavgjort = straffar direkt efter slutsignalen",
  support:
    "Straffläggningen ger ingen extrapoäng — matchen står som oavgjord i tabellen. Straffarna används bara om två lag måste skiljas åt på lika poäng.",
} as const;

/** Avstängningar i kvalet (SvFF/GFF). */
export const KVAL_RULES = [
  "Alla gula kort från serien nollställs — vi startar rent.",
  "Två gula kort i två olika kvalmatcher = avstängd i nästa kvalmatch.",
  "Rött kort i en kvalmatch = missar nästa kvalmatch.",
  "Bara spelare registrerade för Gunnilse IS får spela. Inlånade spelare får inte delta.",
];

export type OpponentMatch = {
  date: string;
  home: boolean;
  opponent: string;
  /** Bergdalens mål. */
  gf: number;
  /** Motståndarens mål. */
  ga: number;
};

/** Bergdalens IK:s 22 seriematcher 2026 i ordning (laget.se). */
export const BERGDALEN_MATCHES: OpponentMatch[] = [
  { date: "2 apr", home: false, opponent: "Lunden Överås", gf: 2, ga: 2 },
  { date: "11 apr", home: true, opponent: "Alingsås", gf: 2, ga: 1 },
  { date: "18 apr", home: false, opponent: "Semberija", gf: 6, ga: 1 },
  { date: "26 apr", home: true, opponent: "Sävedalen", gf: 2, ga: 3 },
  { date: "30 apr", home: false, opponent: "Näset", gf: 1, ga: 2 },
  { date: "9 maj", home: true, opponent: "Assyriska", gf: 1, ga: 3 },
  { date: "14 maj", home: false, opponent: "Öckerö", gf: 2, ga: 4 },
  { date: "24 maj", home: true, opponent: "Västkurd", gf: 4, ga: 3 },
  { date: "30 maj", home: false, opponent: "Hovås Billdal", gf: 1, ga: 4 },
  { date: "6 jun", home: false, opponent: "Zenith", gf: 0, ga: 2 },
  { date: "13 jun", home: true, opponent: "Uddevalla", gf: 0, ga: 3 },
  { date: "18 jun", home: false, opponent: "Sävedalen", gf: 1, ga: 5 },
  { date: "27 jun", home: true, opponent: "Hovås Billdal", gf: 2, ga: 3 },
  { date: "8 aug", home: true, opponent: "Semberija", gf: 5, ga: 3 },
  { date: "16 aug", home: false, opponent: "Alingsås", gf: 0, ga: 6 },
  { date: "23 aug", home: true, opponent: "Öckerö", gf: 2, ga: 1 },
  { date: "30 aug", home: false, opponent: "Västkurd", gf: 1, ga: 1 },
  { date: "5 sep", home: true, opponent: "Näset", gf: 2, ga: 0 },
  { date: "11 sep", home: false, opponent: "Assyriska", gf: 1, ga: 9 },
  { date: "20 sep", home: true, opponent: "Zenith", gf: 1, ga: 0 },
  { date: "26 sep", home: true, opponent: "Lunden Överås", gf: 1, ga: 1 },
  { date: "4 okt", home: false, opponent: "Uddevalla", gf: 1, ga: 3 },
];

export function outcome(m: Pick<OpponentMatch, "gf" | "ga">): "V" | "O" | "F" {
  if (m.gf > m.ga) return "V";
  if (m.gf < m.ga) return "F";
  return "O";
}

export function splitRecord(matches: OpponentMatch[]) {
  const won = matches.filter((m) => outcome(m) === "V").length;
  const drawn = matches.filter((m) => outcome(m) === "O").length;
  const lost = matches.length - won - drawn;
  const gf = matches.reduce((s, m) => s + m.gf, 0);
  const ga = matches.reduce((s, m) => s + m.ga, 0);
  return {
    played: matches.length,
    won,
    drawn,
    lost,
    gf,
    ga,
    points: won * 3 + drawn,
    gaPerMatch: matches.length ? ga / matches.length : 0,
  };
}

export const BERGDALEN_HOME = splitRecord(BERGDALEN_MATCHES.filter((m) => m.home));
export const BERGDALEN_AWAY = splitRecord(BERGDALEN_MATCHES.filter((m) => !m.home));

/** Bortamatcherna efter den enda bortasegern (Semberija 18 apr). */
const lastAwayWinIndex = BERGDALEN_MATCHES.reduce(
  (last, m, i) => (!m.home && outcome(m) === "V" ? i : last),
  -1
);
export const BERGDALEN_AWAY_STREAK = splitRecord(
  BERGDALEN_MATCHES.slice(lastAwayWinIndex + 1).filter((m) => !m.home)
);

export const BERGDALEN_FORM = BERGDALEN_MATCHES.slice(-6);

export const BERGDALEN_INFO = {
  homeGround: "Björkängsvallen, Borås",
  homeSurface: "Konstgräs",
  staff: ["Thomas Andersson", "Farshid Mahmoudi", "Alex Lundh (ass.)"],
  squad: [
    { position: "Målvakt", players: ["Bruno Lima", "Max Lövenhamn", "Joel Björestam"] },
    {
      position: "Back",
      players: ["Arvid Henriksson", "Rami Manfi", "Mateusz Zawilski", "Adel Sovsic", "Antonios Giaurakis Johansson", "Ivar Edenvik"],
    },
    {
      position: "Mittfält",
      players: ["Emilio Ivansson", "Noel Rydén", "Hannes Wahlin", "Luay Nassan", "Oliver Ekdahl", "Kristijan Aleksic"],
    },
    { position: "Forward", players: ["Hugo Leskinen", "Melvin Andersson", "Arber Shala"] },
  ],
  /** Flest registrerade seriematcher 2026. */
  regulars: [
    { name: "Mateusz Zawilski", matches: 20 },
    { name: "Arvid Henriksson", matches: 19 },
    { name: "Hugo Leskinen", matches: 19 },
    { name: "Rami Manfi", matches: 19 },
    { name: "Antonios Giaurakis Johansson", matches: 18 },
    { name: "Ivar Edenvik", matches: 18 },
    { name: "Kristijan Aleksic", matches: 18 },
    { name: "Noel Rydén", matches: 18 },
  ],
  dataGap:
    "Deras offentliga statistik visar 0 mål för alla spelare trots 38 gjorda — vi vet inte vem som är farligast, och vi vet inte formationen. Vi gissar inte.",
} as const;

/** Fem saker matchen byggs på. */
export const GAME_PLAN = [
  {
    headline: "Första 20: territorium, inte kaos",
    support: "Tvinga dem att försvara flera anfall i rad. Bergdalen går sönder när motståndaren får längre perioder av tryck.",
  },
  {
    headline: "Anfall — med säkring bakom bollen",
    support: "De gör mål (38 i serien). Ge dem ingen match fram och tillbaka. Stäng mitten och reagera direkt vid bolltapp.",
  },
  {
    headline: "Gör gräset till vår match",
    support: "Andrabollar, duellen efter första passningen, närvaro i boxen och fasta situationer.",
  },
  {
    headline: "Leder vi: tänk målskillnad",
    support: "3–0 är värt mycket mer än 1–0 i en serie på tre matcher. Sök tredje målet — bara med restförsvaret på plats.",
  },
  {
    headline: "Straffarna klara före avspark",
    support: "Fem namn, ordning och målvaktsplan. 1–1 ger en poäng var, men straffarna kan avgöra gruppen till sist.",
  },
];

/** Prestationskedjan för lördagen. */
export const PERFORMANCE_CHAIN = [
  { label: "Resurser", headline: "Hemma, gräs, en veckas förberedelse", support: "Full scouting av Bergdalen och vår enda hemmamatch i kvalet." },
  { label: "Aktivitet", headline: "Kontrollerat aggressiv match", support: "Tryck över tid, stark restförsvar, vinn andrabollen." },
  { label: "Mål", headline: "3 poäng och plus i målskillnad", support: "Målskillnaden kan avgöra gruppen." },
  { label: "Effekt", headline: "Vi styr vårt eget kval", support: "Till Götene och Skene med ett försprång — inte för att jaga." },
];

export const KVAL_SOURCES = [
  {
    label: "SvFF — Gruppindelningar och spelordningar för kvalspelet 2026",
    url: "https://www.svenskfotboll.se/4a5e9d/globalassets/svff/dokumentdokumentblock/tavling/gruppindelningar-och-spelordningar-for-kvalspelet-2026.pdf",
  },
  {
    label: "SvFF — Tävlingsbestämmelser kval (straffar, lika poäng)",
    url: "https://www.svenskfotboll.se/48db21/globalassets/distrikt/dalarna/dokument/tavling/tb/2026/2026-tb-2026-dalarna.pdf",
  },
  { label: "svenskalag.se — Gunnilse–Bergdalen", url: "https://www.svenskalag.se/gunnilseis-herr/match/21410664/bergdalens-ik" },
  { label: "laget.se — Bergdalens IK matcher 2026", url: "https://www.laget.se/BergdalensIKHerr/Division/Games/573606" },
  { label: "laget.se — Bergdalens IK spelarstatistik", url: "https://www.laget.se/BergdalensIKHerr/Division/Scoreboard/573606" },
] as const;
