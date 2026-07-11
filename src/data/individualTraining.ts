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
  { id: "full", label: "Full plan", description: "Fyra träningsdagar med komplett dos." },
  { id: "maintenance", label: "Underhåll", description: "Tre träningsdagar som bevarar kapacitet." },
  { id: "minimum", label: "Minsta effektiva dos", description: "Två kompakta helkroppspass." },
];

export const TRAINING_WEEKS: TrainingWeek[] = [
  { id: 1, label: "Vecka 1", volumeRange: "70–80 %", speedTarget: "85–90 %", guidance: "Bygg rytm och lämna 2–3 repetitioner i reserv." },
  { id: 2, label: "Vecka 2", volumeRange: "80–90 %", speedTarget: "90–92 %", guidance: "Öka dosen om återhämtningen är normal." },
  { id: 3, label: "Vecka 3", volumeRange: "90–100 %", speedTarget: "92–95 %", guidance: "Veckans högsta volym med bibehållen kvalitet." },
  { id: 4, label: "Vecka 4", volumeRange: "60–70 %", speedTarget: "95–97 %", guidance: "Sänk volymen och behåll fart och precision." },
];

export const ROLE_PLANS: Record<TrainingRole, { label: string; sprintDoses: [string, string] }> = {
  goalkeeper: { label: "Målvakt", sprintDoses: ["6 × 5 m", "4 × 15 m"] },
  defender: { label: "Försvarare", sprintDoses: ["6 × 10 m", "4 × 25 m"] },
  midfielder: { label: "Mittfältare", sprintDoses: ["8 × 10 m", "5 × 30 m"] },
  forward: { label: "Anfallare", sprintDoses: ["8 × 10 m", "6 × 30 m"] },
};

const stopRules = {
  strength: "Avsluta setet om tekniken försämras eller RPE överstiger 8.",
  sprint: "Avsluta om tiden sjunker mer än 3 % eller löpsteget försämras.",
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
  const progression = TRAINING_WEEKS.find((candidate) => candidate.id === week) ?? TRAINING_WEEKS[0];
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
    item("Måndag", "strength", "Underkroppsstyrka", `3–4 × 4–6, ${weekDose}`, "high", "2–3 min", stopRules.strength),
    item("Måndag", "sprint", "Acceleration", accelerationDose, "high", "2 min", stopRules.sprint),
    item("Tisdag", "recovery", "Aktiv återhämtning", "20–30 min RPE 2–3", "low", "Kontinuerligt", "Avsluta vid ökad smärta."),
    item("Onsdag", "conditioning", "HIIT / repeated sprint", "2 × 6 × 20 s / 40 s vila", "high", "3 min mellan set", stopRules.conditioning),
    item("Torsdag", "rest", "Hel vilodag", "Ingen träning", "low", "Hela dagen", "Prioritera vila vid kvarstående trötthet."),
    item("Fredag", "strength", "Helkroppsstyrka", `3–4 × 4–6, ${weekDose}`, "high", "2–3 min", stopRules.strength),
    item("Fredag", "sprint", "Maxfart", maxSpeedDose, "high", "3–4 min", stopRules.sprint),
    item("Lördag", "recovery", "Rörlighet och promenad", "15–30 min RPE 1–2", "low", "Kontinuerligt", "Avsluta vid ökad smärta."),
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
