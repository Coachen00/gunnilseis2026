import type { Player, Position } from "./squad";

export type TrainingRole = "goalkeeper" | "defender" | "midfielder" | "forward";
export type PlanLevel = "full" | "maintenance" | "minimum";
export type SessionType = "strength" | "sprint" | "conditioning" | "recovery" | "rest";

export interface TrainingWeek {
  id: number;
  label: string;
  volumeRange: string;
  speedTarget: string;
  guidance: string;
}

export interface ScheduleItem {
  day: string;
  sessionType: SessionType;
  title: string;
  dose: string;
  intensity: "low" | "moderate" | "high";
  recovery: string;
  stopRule: string;
}

export const PLAN_LEVELS: Array<{ id: PlanLevel; label: string; description: string }> = [
  { id: "full", label: "Full plan", description: "Fyra belastnings-/huvudpassdagar med komplett dos." },
  { id: "maintenance", label: "Underhåll", description: "Tre träningsdagar som bevarar kapacitet." },
  { id: "minimum", label: "Minsta effektiva dos", description: "Två kompakta helkroppspass." },
];

export const TRAINING_WEEKS: TrainingWeek[] = [
  { id: 1, label: "Vecka 1", volumeRange: "60–70 %", speedTarget: "85–90 %", guidance: "Bygg rytm och lämna 2–3 repetitioner i reserv." },
  { id: 2, label: "Vecka 2", volumeRange: "70–80 %", speedTarget: "90–92 %", guidance: "Öka dosen om återhämtningen är normal." },
  { id: 3, label: "Vecka 3", volumeRange: "80–90 %", speedTarget: "92–95 %", guidance: "Öka volymen med bibehållen kvalitet." },
  { id: 4, label: "Vecka 4", volumeRange: "90–100 %", speedTarget: "95–97 %", guidance: "Veckans högsta volym med bibehållen fart och precision." },
];

export const ROLE_PLANS: Record<TrainingRole, { label: string; sprintDoses: [string, string] }> = {
  goalkeeper: { label: "Målvakt", sprintDoses: ["6 × 5 m", "4 × 15 m"] },
  defender: { label: "Försvarare", sprintDoses: ["6 × 10 m", "4 × 25 m"] },
  midfielder: { label: "Mittfältare", sprintDoses: ["8 × 10 m", "5 × 30 m"] },
  forward: { label: "Anfallare", sprintDoses: ["8 × 10 m", "6 × 30 m"] },
};

const stopRules = {
  strength: "Avsluta eller justera setet om tekniken försämras, smärta uppstår eller RPE överstiger 9.",
  sprint: "Avsluta om tiden ökar mer än 3 %, farten sjunker eller tekniken försämras.",
  conditioning: "Avsluta intervallet vid yrsel, smärta eller oförmåga att hålla målfarten.",
};

function item(
  day: string,
  sessionType: SessionType,
  title: string,
  dose: string,
  intensity: ScheduleItem["intensity"],
  recovery: string,
  stopRule = "Avbryt vid smärta eller ovanliga symtom.",
): ScheduleItem {
  return { day, sessionType, title, dose, intensity, recovery, stopRule };
}

export function getSchedule(role: TrainingRole, level: PlanLevel, week: number): ScheduleItem[] {
  const progression = TRAINING_WEEKS.find((candidate) => candidate.id === week);
  if (!progression) throw new RangeError(`Okänd träningsvecka: ${week}`);
  const [accelerationDose, maxSpeedDose] = ROLE_PLANS[role].sprintDoses;
  const weekDose = progression.volumeRange;

  if (level === "maintenance") {
    return [
      item("Måndag", "strength", "Helkroppsstyrka", `3 × 4–6, ${weekDose}`, "high", "2–3 min", stopRules.strength),
      item("Onsdag", "conditioning", "Intervaller", "6 × 30 s / 60 s vila", "high", "60 s", stopRules.conditioning),
      item("Fredag", "sprint", "Acceleration och fart", `${accelerationDose} + ${maxSpeedDose}`, "high", "2–3 min", stopRules.sprint),
    ];
  }

  if (level === "minimum") {
    return [
      item("Måndag", "strength", "Helkropp A", `2 × 5–8, ${weekDose}`, "high", "2 min", stopRules.strength),
      item("Måndag", "conditioning", "Kort konditionsdos", "4 × 30 s / 60 s vila", "moderate", "60 s", stopRules.conditioning),
      item("Fredag", "strength", "Helkropp B", `2 × 5–8, ${weekDose}`, "high", "2 min", stopRules.strength),
      item("Fredag", "conditioning", "Kort konditionsdos", "6 min RPE 6", "moderate", "Efter styrkan", stopRules.conditioning),
    ];
  }

  return [
    item("Måndag", "sprint", "Acceleration", accelerationDose, "high", "2 min", stopRules.sprint),
    item("Måndag", "strength", "Underkroppsstyrka", `3–4 × 4–6, ${weekDose}`, "high", "2–3 min", stopRules.strength),
    item("Tisdag", "recovery", "Aktiv återhämtning", "20–30 min RPE 2–3", "low", "Kontinuerligt", "Avsluta vid ökad smärta."),
    item("Onsdag", "rest", "Hel vilodag", "Ingen träning", "low", "Hela dagen", "Prioritera vila vid kvarstående trötthet."),
    item("Torsdag", "sprint", "Maxfart", maxSpeedDose, "high", "3–4 min", stopRules.sprint),
    item("Torsdag", "strength", "Helkroppsstyrka", `3–4 × 4–6, ${weekDose}`, "high", "2–3 min", stopRules.strength),
    item("Fredag", "recovery", "Aktiv återhämtning", "15–30 min RPE 1–2", "low", "Kontinuerligt", "Avsluta vid ökad smärta."),
    item("Lördag", "conditioning", "HIIT / repeated sprint", "2 × 6 × 20 s / 40 s vila", "high", "3 min mellan set", stopRules.conditioning),
    item("Söndag", "conditioning", "Lugn aerob och teknik", "30–45 min RPE 3–4", "low", "Kontinuerligt", "Sänk dosen om tröttheten ökar."),
  ];
}

const roleByPosition: Record<Position, TrainingRole> = {
  GK: "goalkeeper",
  DEF: "defender",
  MID: "midfielder",
  FWD: "forward",
};

export function getRoleForPlayer(player: Pick<Player, "position">): TrainingRole {
  return roleByPosition[player.position];
}
