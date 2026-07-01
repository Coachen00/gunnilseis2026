export type CalendarTraining = {
  id: string;
  date: string;
  title: string;
  venue: string;
  focus: "Uppstart" | "Matchtempo" | "Matchförberedande" | "Träning";
};

export const CALENDAR_TRAININGS: CalendarTraining[] = [
  {
    id: "training-2026-07-27",
    date: "2026-07-27T18:30:00+02:00",
    title: "Första träningen",
    venue: "Hjällbovallen gräs",
    focus: "Uppstart",
  },
  {
    id: "training-2026-07-29",
    date: "2026-07-29T18:30:00+02:00",
    title: "Matchtempo",
    venue: "Hjällbovallen",
    focus: "Matchtempo",
  },
  {
    id: "training-2026-07-30",
    date: "2026-07-30T18:30:00+02:00",
    title: "Matchförberedande",
    venue: "Hjällbovallen",
    focus: "Matchförberedande",
  },
  {
    id: "training-2026-08-03",
    date: "2026-08-03T18:30:00+02:00",
    title: "Kollektiv återstart",
    venue: "Hjällbovallen",
    focus: "Uppstart",
  },
  {
    id: "training-2026-08-05",
    date: "2026-08-05T18:30:00+02:00",
    title: "Veckans viktigaste pass",
    venue: "Hjällbovallen",
    focus: "Matchtempo",
  },
  {
    id: "training-2026-08-06",
    date: "2026-08-06T18:30:00+02:00",
    title: "Matchförberedande",
    venue: "Hjällbovallen",
    focus: "Matchförberedande",
  },
  ...[
    "2026-08-10",
    "2026-08-12",
    "2026-08-13",
    "2026-08-17",
    "2026-08-19",
    "2026-08-20",
    "2026-08-24",
    "2026-08-26",
    "2026-08-27",
    "2026-08-31",
    "2026-09-02",
    "2026-09-03",
    "2026-09-07",
    "2026-09-09",
    "2026-09-10",
    "2026-09-14",
    "2026-09-16",
    "2026-09-17",
    "2026-09-21",
    "2026-09-23",
    "2026-09-24",
    "2026-09-28",
    "2026-09-30",
    "2026-10-01",
  ].map((day) => ({
    id: `training-${day}`,
    date: `${day}T18:30:00+02:00`,
    title: "Träning",
    venue: "Hjällbovallen",
    focus: "Träning" as const,
  })),
];

export const HERO_CALENDAR_TRAININGS = CALENDAR_TRAININGS.slice(0, 3);
