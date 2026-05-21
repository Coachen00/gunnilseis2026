/* Statisk fallback för årets matcher.
 * När `sync-gunnilse-calendar` har körts läses hela säsongen från Supabase
 * `matches`-tabellen istället. Den här listan är defaulten innan första syncen.
 *
 * Källa: https://www.svenskalag.se/gunnilseis-herr/matcher
 * Senast uppdaterad: 2026-05-17 (inför IF Vardar/Makedonija).
 */

export type SeasonMatch = {
  id: string;
  date: string; // ISO 8601, e.g. "2026-04-02T19:00:00+02:00"
  opponent: string;
  homeAway: "home" | "away";
  competition: string;
  venue: string;
  ourScore?: number;
  theirScore?: number;
  sourceUrl?: string;
};

export const SEASON_MATCHES: SeasonMatch[] = [
  {
    id: "2026-04-02-ytterby",
    date: "2026-04-02T19:00:00+02:00",
    opponent: "Ytterby IS",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 2 Konstgräs",
    ourScore: 3,
    theirScore: 1,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901093/ytterby-is",
  },
  {
    id: "2026-04-10-stenkullen",
    date: "2026-04-10T19:00:00+02:00",
    opponent: "Stenkullen GoIK",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Stenkullens IP 2 KG",
    ourScore: 4,
    theirScore: 2,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901094/stenkullen-goik",
  },
  {
    id: "2026-04-18-partille",
    date: "2026-04-18T13:00:00+02:00",
    opponent: "Partille IF FK",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 2 Konstgräs",
    ourScore: 3,
    theirScore: 2,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901095/partille-if-fk",
  },
  {
    id: "2026-04-24-lerum",
    date: "2026-04-24T19:00:00+02:00",
    opponent: "Lerums IS",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Rydsbergsplan 1 Konstgräs",
    ourScore: 0,
    theirScore: 0,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901096/lerums-is",
  },
  {
    id: "2026-05-02-velebit",
    date: "2026-05-02T13:00:00+02:00",
    opponent: "KF Velebit",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 2 Konstgräs",
    ourScore: 1,
    theirScore: 0,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901097/kf-velebit",
  },
  {
    id: "2026-05-08-kareby",
    date: "2026-05-08T19:00:00+02:00",
    opponent: "Kareby IS",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Kareby Hed",
    ourScore: 1,
    theirScore: 1,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901098/kareby-is",
  },
  {
    id: "2026-05-16-ifk-bjorko",
    date: "2026-05-16T13:00:00+02:00",
    opponent: "IFK Björkö",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 2 Konstgräs",
    ourScore: 3,
    theirScore: 1,
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901099/ifk-bjorko",
  },
  {
    id: "2026-05-22-vardar-makedonija",
    date: "2026-05-22T19:15:00+02:00",
    opponent: "IF Vardar/Makedonija",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Generatorsplan",
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901100/if-vardar-makedonija",
  },
  {
    id: "2026-05-30-hjuvik",
    date: "2026-05-30T13:00:00+02:00",
    opponent: "Hjuviks AIK",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 1 Gräs",
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901101/hjuviks-aik",
  },
  {
    id: "2026-06-05-hisingsbacka",
    date: "2026-06-05T19:15:00+02:00",
    opponent: "Hisingsbacka FC",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Backavallen 1 Konstgräs",
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901102/hisingsbacka-fc",
  },
  {
    id: "2026-06-13-floda",
    date: "2026-06-13T13:00:00+02:00",
    opponent: "Floda BoIF",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 1 Gräs",
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901103/floda-boif",
  },
  {
    id: "2026-06-17-ytterby",
    date: "2026-06-17T19:30:00+02:00",
    opponent: "Ytterby IS",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Ytterns IP 1 Konstgräs",
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901104/ytterby-is",
  },
  {
    id: "2026-06-27-stenkullen",
    date: "2026-06-27T13:00:00+02:00",
    opponent: "Stenkullen GoIK",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 1 Gräs",
    sourceUrl: "https://www.svenskalag.se/gunnilseis-herr/match/19901105/stenkullen-goik",
  },
];

export function nextMatch(matches: SeasonMatch[], now = new Date()): SeasonMatch | null {
  const future = matches
    .filter((m) => new Date(m.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return future[0] ?? null;
}

export function lastPlayedMatch(matches: SeasonMatch[], now = new Date()): SeasonMatch | null {
  const past = matches
    .filter((m) => new Date(m.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return past[0] ?? null;
}

export function groupByMonth(matches: SeasonMatch[]): Map<string, SeasonMatch[]> {
  const groups = new Map<string, SeasonMatch[]>();
  for (const m of matches) {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return groups;
}

export const MONTH_LABELS: Record<number, string> = {
  0: "Januari",
  1: "Februari",
  2: "Mars",
  3: "April",
  4: "Maj",
  5: "Juni",
  6: "Juli",
  7: "Augusti",
  8: "September",
  9: "Oktober",
  10: "November",
  11: "December",
};
