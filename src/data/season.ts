/* Statisk fallback för årets matcher.
 * När `sync-gunnilse-calendar` har körts läses hela säsongen från Supabase
 * `matches`-tabellen istället. Den här listan är defaulten innan första syncen.
 *
 * Källa: https://www.svenskalag.se/gunnilseis-herr/kalender
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
};

export const SEASON_MATCHES: SeasonMatch[] = [
  {
    id: "2026-04-02-ytterby",
    date: "2026-04-02T19:00:00+02:00",
    opponent: "Ytterby IS",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 2 Konstgräs",
  },
  {
    id: "2026-04-10-stenkullen",
    date: "2026-04-10T19:00:00+02:00",
    opponent: "Stenkullen GoIK",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Stenkullens IP 2 KG",
  },
  {
    id: "2026-04-18-partille",
    date: "2026-04-18T13:00:00+02:00",
    opponent: "Partille IF FK",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Hjällbovallen 2 Konstgräs",
  },
  {
    id: "2026-04-24-lerum",
    date: "2026-04-24T19:00:00+02:00",
    opponent: "Lerums IS",
    homeAway: "away",
    competition: "Division 4A Herr",
    venue: "Rydsbergsplan 1 Konstgräs",
  },
  {
    id: "2026-05-02-velebit",
    date: "2026-05-02T13:00:00+02:00",
    opponent: "Velebit",
    homeAway: "home",
    competition: "Division 4A Herr",
    venue: "Gunnilseplan",
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
