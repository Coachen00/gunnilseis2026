/**
 * Kval till division 3 hösten 2026 — allt vi vet, på ett ställe.
 *
 * Källor (alla lästa 2026-09-16, `KVAL_VERIFIED`):
 *   - SvFF "Gruppindelningar och spelordningar för kvalspelet 2026"
 *     (fastställt av Tävlingsnämnden 16 april 2026) — grupper, spelordning,
 *     datum, regeln om bästa kvallag.
 *   - GFF "Kvaltabeller" 2026-09-15 — avstängningsregler, div 3 avslutas 3–4 okt.
 *   - svenskalag.se, Gunnilse IS herr — tabell och referatet "Gunnilse IS
 *     klara för kvalspel" (12 sep).
 *   - Tabellerna för grannserierna (fotbollstabeller.nu / everysport /
 *     fotbollsbilagan) — kandidatlagen.
 *
 * Det som är fastställt av förbundet ligger i `KVAL_FORMAT` och `KVAL_GROUPS`.
 * Det som ännu är öppet (vilken grupp vi hamnar i, vilka lag) är märkt
 * `open: true` och skrivs som "kan bli", aldrig som fakta. Uppdatera
 * `KVAL_VERIFIED` varje gång siffrorna kontrolleras mot källorna.
 */

export const KVAL_VERIFIED = "2026-09-16";

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

/** Division 4A Herr efter omgång 19 (svenskalag.se, 12 sep). */
export const DIV4A_TABLE: TableRow[] = [
  { pos: 1, team: "Lerums IS", played: 19, won: 17, drawn: 2, lost: 0, goalsFor: 59, goalsAgainst: 20, points: 53 },
  { pos: 2, team: "Gunnilse IS", played: 19, won: 12, drawn: 4, lost: 3, goalsFor: 54, goalsAgainst: 27, points: 40 },
  { pos: 3, team: "KF Velebit", played: 19, won: 9, drawn: 2, lost: 8, goalsFor: 38, goalsAgainst: 31, points: 29 },
  { pos: 4, team: "Hjuviks AIK", played: 19, won: 8, drawn: 5, lost: 6, goalsFor: 33, goalsAgainst: 33, points: 29 },
  { pos: 5, team: "Ytterby IS", played: 19, won: 7, drawn: 3, lost: 9, goalsFor: 42, goalsAgainst: 46, points: 24 },
  { pos: 6, team: "IFK Björkö", played: 19, won: 6, drawn: 5, lost: 8, goalsFor: 29, goalsAgainst: 40, points: 23 },
  { pos: 7, team: "Kareby IS", played: 19, won: 5, drawn: 7, lost: 7, goalsFor: 41, goalsAgainst: 39, points: 22 },
  { pos: 8, team: "IF Vardar/Makedonija", played: 19, won: 6, drawn: 4, lost: 9, goalsFor: 32, goalsAgainst: 37, points: 22 },
  { pos: 9, team: "Partille IF FK", played: 19, won: 6, drawn: 4, lost: 9, goalsFor: 36, goalsAgainst: 47, points: 22 },
  { pos: 10, team: "Stenkullen GoIK", played: 19, won: 6, drawn: 3, lost: 10, goalsFor: 27, goalsAgainst: 38, points: 21 },
  { pos: 11, team: "Hisingsbacka FC", played: 19, won: 6, drawn: 2, lost: 11, goalsFor: 36, goalsAgainst: 52, points: 20 },
  { pos: 12, team: "Floda BoIF", played: 19, won: 4, drawn: 3, lost: 12, goalsFor: 32, goalsAgainst: 49, points: 15 },
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

/** Så går kvalet till — fastställt av SvFF 16 april 2026. */
export const KVAL_FORMAT = {
  window: "10–25 oktober",
  windowNote:
    "Kan spelas 10–18 oktober om förbundet och alla lag i gruppen är överens — då spelas en match på vardag, förslagsvis onsdag 14 oktober.",
  groups: 12,
  teamsPerGroup: 4,
  teamsFromDiv4: 36,
  steps: [
    {
      label: "Steg 1",
      headline: "Fyra lag i en grupp",
      support:
        "Nian i en division 3-serie möter tre tvåor från division 4 i en grupp. Alla möter alla en gång — tre matcher på tre helger.",
    },
    {
      label: "Steg 2",
      headline: "Bästa kvallag får två hemmamatcher",
      support:
        "Div 3-laget och det bästa av de tre div 4-lagen får spela två matcher hemma, de andra två får en. Bästa kvallag räknas på poäng per spelad seriematch, sedan målskillnad.",
    },
    {
      label: "Steg 3",
      headline: "Gruppettan går upp",
      support:
        "Vinner vi gruppen spelar Gunnilse IS i division 3 2027. Oavgjord match avgörs med straffar — straffarna räknas inte i tabellen men avgör inbördes möte vid lika poäng.",
    },
  ],
  /** SvFF:s spelordning. "Bästa" = bästa kvallag från div 4. */
  schedule: [
    { round: "Omgång 1", matches: ["2:a bästa kvallag – Nian i div 3", "Bästa kvallag – 3:e bästa kvallag"] },
    { round: "Omgång 2", matches: ["Nian i div 3 – Bästa kvallag", "3:e bästa kvallag – 2:a bästa kvallag"] },
    { round: "Omgång 3", matches: ["Nian i div 3 – 3:e bästa kvallag", "Bästa kvallag – 2:a bästa kvallag"] },
  ],
} as const;

export type KvalCandidate = {
  team: string;
  /** Vad laget skulle representera i gruppen. */
  slot: string;
  /** Kort läge just nu, t.ex. "9:a, 20 p". */
  status: string;
};

export type KvalGroup = {
  id: string;
  name: string;
  admin: string;
  div3Series: string;
  /** Vilka distrikt som skickar div 4-lag, i SvFF:s ordning. */
  slots: string[];
  /** Lag som just nu ligger till för platserna. */
  candidates: KvalCandidate[];
  /** Vad GFF gjorde med Göteborgs tvåor förra året, om känt. */
  precedent?: string;
};

/**
 * Göteborg har lag i två grupper. GFF bestämmer vilken av Göteborgs två
 * tvåor (4A och 4B) som hamnar var — det är inte klart förrän serierna är
 * färdigspelade 4 oktober.
 */
export const KVAL_GROUPS: KvalGroup[] = [
  {
    id: "grupp-8",
    name: "Grupp 8",
    admin: "Göteborgs FF",
    div3Series: "Division 3 Nordvästra Götaland",
    slots: ["Nian i div 3 Nordvästra Götaland", "Bohuslän/Dalsland", "Göteborg", "Västergötland"],
    candidates: [
      { team: "IF Haga", slot: "Nian i div 3 NV Götaland", status: "9:a, 17 p — Syrianska FK har utgått, så placeringen är osäker" },
      { team: "Assyriska IK", slot: "Nian i div 3 NV Götaland", status: "10:a, 16 p — kan bli nian när utgånget lag räknas bort" },
      { team: "Skärhamns IK", slot: "Tvåa div 4 Bohuslän/Dalsland", status: "2:a, 38 p på 17 matcher" },
      { team: "Vallens IF", slot: "Tvåa div 4 Bohuslän/Dalsland", status: "3:a, 36 p — två poäng bakom" },
      { team: "Västergötlands kvallag", slot: "Div 4 Västergötland", status: "VFF utser sitt lag efter 4–5 okt" },
    ],
  },
  {
    id: "grupp-9",
    name: "Grupp 9",
    admin: "Västergötlands FF",
    div3Series: "Division 3 Mellersta Götaland",
    slots: ["Nian i div 3 Mellersta Götaland", "Göteborg", "Västergötland", "Västergötland"],
    candidates: [
      { team: "Bergdalens IK", slot: "Nian i div 3 Mellersta Götaland", status: "9:a, 20 p — två poäng över Serbiska KIF" },
      { team: "Serbiska KIF Semberija", slot: "Nian i div 3 Mellersta Götaland", status: "10:a, 18 p — Göteborgslag" },
      { team: "Västergötlands kvallag ×2", slot: "Div 4 Västergötland", status: "VFF lottar efter 4–5 okt" },
    ],
    precedent: "2025 låg Göteborgs lag i grupp 9: Lerums IS mot Hovås Billdal IF, Trollhättans BoIS och IFK Tidaholm.",
  },
];

/** Göteborgs andra tvåa — vem vi INTE möter men delar situation med. */
export const GOTEBORG_B_RACE = {
  series: "Division 4B Herr",
  note: "Göteborg B skickar också sin tvåa. Kållered leder, tre lag slåss om andraplatsen.",
  contenders: [
    { team: "Fässbergs IF", status: "2:a, 42 p" },
    { team: "IK Virgo", status: "3:a, 42 p" },
    { team: "Göteborgs FF", status: "4:a, 39 p på 18 matcher" },
  ],
} as const;

export type KvalMilestone = {
  date: string;
  title: string;
  detail: string;
  /** Vår egen match eller ett förbundsbeslut. */
  kind: "match" | "forbund" | "kval";
};

export const KVAL_TIMELINE: KvalMilestone[] = [
  { date: "Fre 18 sep", title: "Hjuviks AIK borta", detail: "21:47 Arena 1 konstgräs, 19:00. Varje poäng höjer vår kvalranking.", kind: "match" },
  { date: "Sön 27 sep", title: "Hisingsbacka FC hemma", detail: "Hjällbovallen 1 Gräs, 13:00.", kind: "match" },
  { date: "Sön 4 okt", title: "Floda BoIF borta", detail: "Sista seriematchen, 12:15. Utvisning här = missad första kvalmatch.", kind: "match" },
  { date: "3–4 okt", title: "Division 3 avslutas", detail: "Då vet vi vilka nior vi kan möta.", kind: "forbund" },
  { date: "Vecka 41", title: "Gruppen fastställs", detail: "GFF placerar Göteborgs tvåor i grupp 8 och 9. Hemmalaget bestämmer speldag, lördag eller söndag.", kind: "forbund" },
  { date: "10–25 okt", title: "Kvalet spelas", detail: "Tre matcher, en per helg. Gruppettan går upp till division 3.", kind: "kval" },
];

/** Ur GFF:s tävlingsbestämmelser 5 kap § 9 (GFF 2026-09-15). */
export const KVAL_RULES = [
  "Spelare som utvisas i sista seriematchen får inte spela i lagets första kvalmatch.",
  "Spelare som utvisas i en kvalmatch missar lagets nästa kvalmatch.",
  "Två gula kort i olika kvalmatcher ger avstängning i nästa kvalmatch.",
  "Alla varningar från serien nollställs inför kvalet — vi startar rent.",
  "Bara spelare registrerade för Gunnilse IS får spela. Inlånade spelare får inte delta.",
];

export const KVAL_SOURCES = [
  {
    label: "SvFF — Gruppindelningar och spelordningar för kvalspelet 2026",
    url: "https://www.svenskfotboll.se/4a5e9d/globalassets/svff/dokumentdokumentblock/tavling/gruppindelningar-och-spelordningar-for-kvalspelet-2026.pdf",
  },
  { label: "SvFF — Information om kvalspelet 2026", url: "https://www.svenskfotboll.se/serier-cuper/kvalspel/kval/" },
  { label: "GFF — Kvaltabeller (15 sep 2026)", url: "https://www.gbgfotboll.se/nyheter/2026/09/kvaltabell/" },
  {
    label: "svenskalag.se — Gunnilse IS klara för kvalspel",
    url: "https://www.svenskalag.se/gunnilseis-herr/match/19901111/if-vardar-makedonija",
  },
] as const;
