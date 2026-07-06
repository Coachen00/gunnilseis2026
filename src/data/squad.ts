/* Statisk fallback för truppen.
 * När `sync-gunnilse-squad`-funktionen kört och `players`-tabellen är fylld
 * läser frontenden därifrån istället. Den här listan blir defaulten på första
 * besöket och ersätts sedan av live-data.
 *
 * Källa: https://www.svenskalag.se/gunnilseis-herr/truppen
 */

export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Player = {
  name: string;
  position: Position;
  jerseyNumber?: number;
  birthYear?: number;
};

export type StaffMember = {
  name: string;
  role: string;
};

export const POSITION_LABELS: Record<Position, { short: string; long: string }> = {
  GK: { short: "MV", long: "Målvakt" },
  DEF: { short: "B", long: "Back" },
  MID: { short: "MF", long: "Mittfält" },
  FWD: { short: "FW", long: "Anfall" },
};

export const SQUAD: Player[] = [
  // Målvakter
  { name: "Ali Carneil", position: "GK" },
  { name: "Kamal Fekhouri", position: "GK" },
  { name: "Parsa Ahang", position: "GK" },

  // Backar
  { name: "Adnan Hadzialic", position: "DEF" },
  { name: "Ahmad Soheyl Matin", position: "DEF" },
  { name: "Daniel Matin", position: "DEF" },
  { name: "Meysam Hoseni", position: "DEF" },
  { name: "Nayef Mohammad", position: "DEF" },
  { name: "Pascal Jabbour", position: "DEF" },
  { name: "Rayan Fedaila", position: "DEF" },
  { name: "Rinor Zenullah", position: "DEF" },
  { name: "Sabarr Janneh", position: "DEF" },
  { name: "Vedad Dzambegovic", position: "DEF" },

  // Mittfältare
  { name: "Adnan Maric", position: "MID" },
  { name: "Ahmad Aljafari", position: "MID" },
  { name: "Ayub Ahmed", position: "MID" },
  { name: "Benjamin Arapovic", position: "MID" },
  { name: "Galvan Ayoub", position: "MID" },
  { name: "Hosam Aiesh", position: "MID" },
  { name: "Idris Abdi", position: "MID" },
  { name: "Ihab Naser", position: "MID" },
  { name: "Mostafa Ayoub", position: "MID" },
  { name: "Måns Orwén", position: "MID" },

  // Anfallare
  { name: "Aldin Zeljkovic", position: "FWD" },
  { name: "Haris Avdiu", position: "FWD" },
  { name: "Kamal Mustafa", position: "FWD" },
  { name: "Leodon Johansson", position: "FWD" },
  { name: "Yosef Ismail", position: "FWD" },
];

export const STAFF: StaffMember[] = [
  { name: "Joel Sjöqvist", role: "Huvudtränare" },
  { name: "Adnan Maric", role: "Assisterande spelande tränare" },
  { name: "Avan Rekani", role: "Sportchef" },
  { name: "Björn Ramstarke", role: "Materialförvaltare" },
];

export function groupSquadByPosition(players: Player[]): Record<Position, Player[]> {
  const groups: Record<Position, Player[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  for (const player of players) groups[player.position].push(player);
  return groups;
}
