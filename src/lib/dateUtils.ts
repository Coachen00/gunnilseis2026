/**
 * Delade svenska datum/tid-hjälpare.
 *
 * Tidigare duplicerade `MatchForra.tsx` och `Matcher.tsx` egna versioner av
 * SHORT_DAY/SHORT_MONTH-arrayer. Nu en källa.
 */

export const SHORT_DAY = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] as const;

export const SHORT_MONTH = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
] as const;

const pad2 = (n: number) => n.toString().padStart(2, "0");

/**
 * Formatera ett ISO-datum till `Fre 14 maj · 19:00`.
 */
export function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  return `${SHORT_DAY[d.getDay()]} ${d.getDate()} ${SHORT_MONTH[d.getMonth()]} · ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/**
 * Kort veckodag för ett ISO-datum (`Fre`).
 */
export function shortWeekday(iso: string): string {
  return SHORT_DAY[new Date(iso).getDay()];
}
