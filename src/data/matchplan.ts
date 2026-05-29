/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-05-27 inför Hjuviks AIK
 * (hemma · Hjällbovallen 1 Gräs · lördag 30 maj 13:00).
 * Förra match: IF Vardar/Makedonija (borta · 2026-05-22 · 1–1).
 *
 * Samlingstid: räknas automatiskt från `MATCH_META.kickoff` via
 * `computeSamlingTime` — hemmamatch 1h30 före avspark, bortamatch 1h45.
 */

export type MatchMeta = {
  opponent: string;
  venue: string;
  home: boolean;
  kickoff: string;
  competition: string;
  weather?: string;
  absent: string[];
};

export type FormationSlot = {
  id: string;
  n: number;
  name: string;
  label: string;
  x: number; // 0-100, bredd
  y: number; // 0-100, djup (0 = vår MV-linje)
};

export type CoherenceSection = {
  id: string;
  num: string;
  title: string;
  eyebrow: string;
  principles?: string[];
  bullets?: string[];
  roles?: [string, string][];
  note?: string;
};

export const MATCH_META: MatchMeta = {
  opponent: "Hjuviks AIK",
  venue: "Hjällbovallen 1 Gräs",
  home: true,
  kickoff: "Lör 30 maj · 13:00",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
};

export const MATCH_PRESENTATION_URL =
  "https://claude.ai/design/p/faf88e6c-cc30-4de1-83a3-2914a1267e48?file=veckans-match%2FMatchgenomg%C3%A5ng+-+Mall.html&via=share";

/**
 * Räknar baklänges från `MATCH_META.kickoff` ("Lör 30 maj · 13:00") och
 * returnerar samlingstid som "HH:MM".
 *
 * Regel (Gunnilse IS):
 *   - Hemmamatch → samling 1h30 före avspark.
 *   - Bortamatch → samling 1h45 före avspark.
 *
 * Detta är samma regel för alla matcher hela säsongen, så den ska
 * aldrig hardkodas per match. Returnerar "Se kallelse" om kickoff
 * saknar parsbart klockslag.
 */
export function computeSamlingTime(meta: MatchMeta = MATCH_META): string {
  const m = meta.kickoff.match(/(\d{1,2}):(\d{2})/);
  if (!m) return "Se kallelse";
  const kickoffMinutes = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const offsetMinutes = meta.home ? 90 : 105;
  const totalMinutes = kickoffMinutes - offsetMinutes;
  if (totalMinutes < 0) return "Se kallelse";
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export const SAMLING_TIME = computeSamlingTime();

/* Matchdagsschema — visas i hero och i praktisk-info-block.
 * Samlingstid räknas dynamiskt från MATCH_META.kickoff (se
 * `computeSamlingTime`). Övriga tider relativa till avspark:
 *   - Aktivering: avspark - 40 till avspark - 10
 *   - Ner + sista instruktion: avspark - 10 till avspark - 3
 *   - Upp + sista löpningar: avspark - 3
 */
export const MATCH_SCHEDULE: Array<{ time: string; label: string; note?: string }> = [
  { time: SAMLING_TIME, label: "Samling", note: MATCH_META.home ? "Hjällbovallen" : "Hjällbovallen (avresa)" },
  { time: "Före uppvärmning", label: "Genomgång" },
  { time: "12:20 – 12:50", label: "Aktivering" },
  { time: "12:50 – 12:57", label: "Ner + sista instruktion" },
  { time: "12:57", label: "Upp + sista löpningar" },
  { time: "13:00", label: "Avspark" },
];

/* Matchplan i korthet — fyra kort som spelaren scannar precis före avspark. */
export type PlanCard = {
  id: string;
  eyebrow: string;
  title: string;
  bullets: string[];
  accent: "red" | "blue" | "amber" | "green";
};

export const MATCH_PLAN_SHORT: PlanCard[] = [
  {
    id: "forsvar",
    eyebrow: "Utan boll",
    title: "Så försvarar vi",
    accent: "red",
    bullets: [
      "Hemmaplan — vi sätter rytmen. Kompakta led, inget jagande på låsta passningar.",
      "YB på YB. Lås bollsida och stoppa spelvändning.",
      "Vinn andrabollen som lag — närmaste attackerar, övriga tätar.",
    ],
  },
  {
    id: "anfall",
    eyebrow: "Med boll",
    title: "Så anfaller vi",
    accent: "blue",
    bullets: [
      "Skydda kontring — 6:an står, MB håller avstånd.",
      "Spela in centralt → ut → ta med framåt.",
      "Fyll boxen vid inlägg: 9 straffp, motsatt ytter bortre, 8 första, 10 cutback.",
    ],
  },
  {
    id: "omstallning",
    eyebrow: "I sekunden",
    title: "Så ställer vi om",
    accent: "amber",
    bullets: [
      "Bollvinst: första tanken framåt — diagonal eller djup.",
      "Bolltapp: närmaste pressar inom 1 sekund — jakten startar direkt.",
      "Forwarden styr första pressen så resten kan flytta efter.",
    ],
  },
  {
    id: "fasta",
    eyebrow: "Stillastående",
    title: "Fasta situationer",
    accent: "green",
    bullets: [
      "Anfall: ansvar och variant bekräftas på genomgången.",
      "Försvar: hybrid (zon + 2 man) + andraboll.",
      "Inkast djupt = tryck + direkt återerövring.",
    ],
  },
];

/* Praktisk info — visas längst ner på Veckans match. */
export const PRACTICAL_INFO = {
  kit: "Hemmamatch på gräs — gula matchställen och rätt skor för gräs (dobb/multi).",
  responsibilities: [
    ["Kapten", "Ado"],
    ["Hörnor", "Bekräftas på genomgång"],
    ["Inläggsfrispark", "Bekräftas på genomgång"],
    ["Målchansfrispark", "Bekräftas på genomgång"],
  ] as const,
  gatheringNote: "Samling och avresa bekräftas i kallelsen. Mental start före uppvärmning.",
} as const;

/* Kallad trupp inför Hjuviks AIK (lör 30 maj). Ado är lagkapten (se
 * PRACTICAL_INFO.responsibilities). Startelva sätts senare — alla 16
 * ligger som bänk tills laguppställningen är spikad. */
export const CALLED_SQUAD = {
  starting: [],
  bench: [
    "Ali Carneil",
    "Adnan Hadzialic",
    "Pascal Jabbour",
    "Rinor Zenullah",
    "Ahmad Aljafari",
    "Ayub Ahmed",
    "Benjamin Arapovic",
    "Galvan Ayoub",
    "Idris Abdi",
    "Ihab Naser",
    "Måns Orwén",
    "Aldin Zeljkovic",
    "Kamal Mustafa",
    "Leodon Johansson",
    "Mostafa Ayoub",
    "Yosef Ismail",
  ],
} as const;

export const FOCUS: string[] = [
  "Starta som hemmalag med tempo: vi sätter rytmen, korta avstånd, första duellen direkt.",
  "Skydda mitten och tvinga Hjuviks utåt — låt dem inte hitta rättvänd spelare mellan våra lagdelar.",
  "Vid bollvinst: första blicken framåt, hota diagonalt och fyll på innan de hinner samla sig.",
];

export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Veckans match",
    eyebrow: "Kontext",
    bullets: [
      "Hjuviks AIK hemma · Hjällbovallen 1 Gräs · lördag 30 maj 13:00.",
      `Samling ${SAMLING_TIME} på Hjällbovallen (1h30 före avspark — hemmamatchsregel).`,
      "Startelva och roller bekräftas på genomgång.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["Kallad", "Kapten", "Startelva"],
    bullets: [
      "16 spelare kallade — se listan nedan. Ado är lagkapten.",
      "Startelva och avbytare bekräftas på genomgång.",
      "Alla ska veta sin första uppgift innan uppvärmningen börjar.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Förra match — IF Vardar/Makedonija 1–1",
    eyebrow: "Vad vi tar med till Hjuviks",
    principles: ["Reflektion", "Energi", "Nästa aktion"],
    bullets: [
      "Vi spelade 1–1 borta mot IF Vardar/Makedonija fredag 22 maj.",
      "Detaljerade reflektioner fylls i av tränaren på /match/forra.",
      "Nu flyttar vi fokus direkt till nästa prestation: Hjuviks AIK hemma.",
    ],
  },
  {
    id: "hjuviks",
    num: "04",
    title: "Vad vi vet om Hjuviks AIK",
    eyebrow: "Motståndaren",
    bullets: [
      "Hemmamatch på Hjällbovallen 1 Gräs — vi sätter rytm och tempo från start.",
      "Lördag lunch — räkna med varm temperatur. Hydrering och tempo-växling avgörande.",
      "Stäng mitten först. Låt dem inte spela mellan två av oss.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys när tränarstaben har fyllt i den.",
    ],
    note: "Hjuviks-specifika anpassningar (formation, hot, var vi pressar) fylls i på /motstandaranalys.",
  },
  {
    id: "identitet",
    num: "05",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Hemma = vi sätter rytm och tempo. Första 10 min ska Hjuviks känna att vi äger planen.",
      "Andrabollsspelet vinner vi som lag — närmaste attackerar, övriga tätar.",
      "Nästa aktion är viktigare än förra situationen.",
    ],
  },
  {
    id: "anfall",
    num: "06",
    title: "Anfall — fem principer",
    eyebrow: "I ordning",
    principles: ["Skydda kontring", "Spela in", "Spela ut", "Framåt", "Box"],
    bullets: [
      "1. Skydda mot kontring — 6:an står kvar centralt, mittbackarna håller avstånd till varandra.",
      "2. Spela in bollen — sök rättvänd medspelare i halvytan, mellan deras led.",
      "3. Spela ut — trångt centralt? Vänd via 6/MB till motsatt ytter och spela in på nya sidan.",
      "4. Ta med framåt — yta öppen? Driv eller passa framåt med fart, inte i sidled.",
      "5. Fyll på i box — minst 4 av oss i/runt boxen vid inlägg. 9 straffp, motsatt ytter bortre, 8 första, 10 cutback, 1 hänger 18 m.",
    ],
  },
  {
    id: "forsvar",
    num: "07",
    title: "Försvar",
    eyebrow: "Samla → lås → vinn",
    principles: ["Samla först", "Höga linjer", "Tre korridorer"],
    bullets: [
      "Ingen tokpress innan vi är kompakta. Bollvinnarpress först när linjerna är höga.",
      "Styr pressen åt en sida (kolla motståndaranalys för rätt sida mot Hjuviks).",
      "YB på YB — lås bollsida, stoppa spelvändning.",
    ],
  },
  {
    id: "omst-forsvar",
    num: "08",
    title: "Omställning försvar",
    eyebrow: "Direkt eller indirekt",
    principles: ["Direkt", "Indirekt"],
    bullets: [
      "Direkt: nära, samlade, täckning bakom — närmaste pressar inom 1 sek.",
      "Indirekt: utdragna, centralt tapp, rättvänd motståndare → samla, centrera, lås nästa boll.",
      "Forwarden är vår första försvarare.",
    ],
  },
  {
    id: "omst-anfall",
    num: "09",
    title: "Omställning anfall",
    eyebrow: "Ut ur gröten",
    principles: ["Diagonal utgång", "Djupled", "Box"],
    bullets: [
      "Första passningen bort från het yta.",
      "Rättvänd söker diagonal, djupled eller spelvändning.",
      "Ytter/9 löper direkt. Övriga fyller box eller säkrar andraboll.",
    ],
  },
  {
    id: "fasta",
    num: "10",
    title: "Fasta",
    eyebrow: "Kort ansvar",
    principles: ["Haris/Gelo", "Hybrid", "Andraboll"],
    bullets: [
      "Försvar: hörna, inläggsfrispark, målchansfrispark, inkast — hybrid (zon + 2 man) + andraboll.",
      "Anfall: hörnor och inläggsfrisparkar Haris/Gelo. Målchansfrispark: bestäm själva.",
      "Inkast: djupt = tryck + direkt återerövring.",
    ],
  },
  {
    id: "roller",
    num: "11",
    title: "Roller",
    eyebrow: "Ansvar",
    roles: [
      ["Kapten", "Ado"],
      ["Hörnor", "Bekräftas på genomgång"],
      ["Inläggsfrispark", "Bekräftas på genomgång"],
      ["Målchansfrispark", "Bekräftas på genomgång"],
      ["Matchstart", "13:00"],
      ["Hemmaplan", "Hjällbovallen 1 Gräs"],
    ],
  },
];
