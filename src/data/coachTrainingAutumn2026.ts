export type TrainingDay = "Måndag" | "Onsdag" | "Torsdag";

export type TimelineBlock = {
  from: string;
  to: string;
  title: string;
  instruction: string;
  owner: string;
};

export type AutumnMatch = {
  date: string;
  kickoff: string;
  opponent: string;
  homeAway: "Hemma" | "Borta";
  venue: string;
};

export type AutumnSession = {
  date: string;
  day: TrainingDay;
  focus: string;
  objective: string;
  intensity: "Låg" | "Medel" | "Hög";
  owner: string;
  timeline: TimelineBlock[];
  plan: TrainingPlan;
};

export type TrainingMoment = {
  title: string;
  purpose: string;
  options: string[];
};

export type TrainingPlan = {
  activation: TrainingMoment;
  exerciseOne: TrainingMoment;
  exerciseTwo: TrainingMoment;
  game: TrainingMoment;
};

export type AutumnWeek = {
  label: string;
  range: string;
  phase: string;
  match: AutumnMatch;
  videoBefore: string[];
  videoAfter: string[];
  sessions: AutumnSession[];
};

export const TRAINING_METHOD = [
  ["1", "Förankra", "Säg varför temat behövs i matchen."],
  ["2", "Visa", "Visa en sekvens, rörelse eller enkel demonstration."],
  ["3", "Förenkla", "Skapa problemet i liten och tydlig spelform."],
  ["4", "Utmana", "Lägg till riktning, motstånd, tid eller beslut."],
  ["5", "Matchlikna", "Testa beteendet i större spel med omställning."],
  ["6", "Reflektera", "Låt spelarna beskriva vad de såg och gjorde."],
  ["7", "Följ upp", "Mät samma beteende i matchen och justera nästa vecka."],
] as const;

const activationOptions = (theme: string): string[] => [
  `Dynamisk aktivering med boll: bål, höft och fotled → riktningsförändring → scanning och passning. Veckans cue: ${theme}.`,
  `Parvis förberedelseträning: dynamisk rörlighet, löpteknik framåt/bakåt/sidled, fotarbete och hoppa–landa–löp. Avsluta med första aktionen i ${theme.toLowerCase()}.`,
  `FIFA 11+-inspirerad aktivering: balans, knäkontroll, bål/höft och kontrollerad acceleration. Lägg in boll efter varje serie och coacha ${theme.toLowerCase()}.`,
];

const trainingPlanFor = (theme: string): TrainingPlan => ({
  activation: { title: "Aktivering", purpose: "Cirka 15 min: förbered kroppen och koppla direkt till dagens spelbeteende.", options: activationOptions(theme) },
  exerciseOne: { title: "Spelövning 1", purpose: "Förenkla problemet med få spelare, hög aktivitet och en tydlig riktning.", options: [
    `4v2/5v3 i tre korridorer: hitta spelbarhet, scanning och nästa passning kopplat till ${theme.toLowerCase()}.`,
    `3v3 + 2 jokrar med riktning: laget får poäng när det löser ${theme.toLowerCase()} efter bollvinst.`,
  ] },
  exerciseTwo: { title: "Spelövning 2", purpose: "Öka motstånd, yta och beslut utan att tappa veckans princip.", options: [
    `5v5 + målvakter med korridorer och omställning: poäng för ${theme.toLowerCase()} i rätt ögonblick.`,
    `7v7/8v8 med riktning mot mål: starta i den situation som kräver ${theme.toLowerCase()} och låt spelet leva.`,
  ] },
  game: { title: "Spel", purpose: "Testa beteendet i matchlik miljö med få coachstopp och tydlig uppföljning.", options: [
    `8v8/9v9 fritt spel: coacha bara ${theme.toLowerCase()} och notera tre matchlika exempel.`,
    `11v11 eller största möjliga spelform: matchplan, omställning och ${theme.toLowerCase()} utan extra regler.`,
  ] },
});

export const COACH_ROLES = [
  ["Huvudtränare", "Äger veckans fokus, matchplan, samling och slutbeslut."],
  ["Assisterande tränare", "Rigg, belastning, individuell återkoppling och närvaro."],
  ["Videoansvarig", "Filmar överenskomna sekvenser, klipper 3–6 klipp och publicerar."],
  ["Fasta situationer", "Äger offensiva och defensiva fasta situationer på torsdag."],
  ["Kapten", "Förmedlar spelarnas förståelse och leder identitetsbeteendet på planen."],
] as const;

const matches: AutumnMatch[] = [
  { date: "2026-08-08", kickoff: "15:00", opponent: "Partille IF FK", homeAway: "Borta", venue: "Lexby 1 Gräs" },
  { date: "2026-08-15", kickoff: "13:00", opponent: "Lerums IS", homeAway: "Hemma", venue: "Hjällbovallen 1 Gräs" },
  { date: "2026-08-22", kickoff: "15:00", opponent: "KF Velebit", homeAway: "Borta", venue: "Velebit IP 1 Gräs" },
  { date: "2026-08-29", kickoff: "13:00", opponent: "Kareby IS", homeAway: "Hemma", venue: "Hjällbovallen 1 Gräs" },
  { date: "2026-09-05", kickoff: "14:00", opponent: "IFK Björkö", homeAway: "Borta", venue: "Björkö 1 Gräs" },
  { date: "2026-09-12", kickoff: "13:00", opponent: "IF Vardar/Makedonija", homeAway: "Hemma", venue: "Hjällbovallen 1 Gräs" },
  { date: "2026-09-18", kickoff: "19:00", opponent: "Hjuviks AIK", homeAway: "Borta", venue: "21:47 Arena 1" },
  { date: "2026-09-26", kickoff: "13:00", opponent: "Hisingsbacka FC", homeAway: "Hemma", venue: "Hjällbovallen 1 Gräs" },
  { date: "2026-10-04", kickoff: "12:15", opponent: "Floda BoIF", homeAway: "Borta", venue: "Flodala IP 3 KG" },
];

const focus = [
  ["Uppbyggnad och scanning", "Vi skapar spelbarhet, bredd och djup och hittar rättvänd spelare.", "Medel"],
  ["Pressa och styra", "Första försvararen leder pressen och laget skyddar mitten.", "Hög"],
  ["Spela in och spela ut", "Vi spelar in när vi kan och spelar ut när motståndaren stänger.", "Medel"],
  ["Tre korridorer och omställning", "Vi samlar laget på bollsidan och återerövrar med korta avstånd.", "Hög"],
  ["Andraboll och duell", "Vi vinner första kontakten eller nästa boll och tar ytan direkt.", "Hög"],
  ["Assistytan och boxfyllnad", "Vi tar oss till sista passningen och fyller boxen med rätt timing.", "Medel"],
  ["Matchspecifik press", "Vi förbereder pressignaler mot motståndarens uppbyggnad.", "Hög"],
  ["Fasta och matchkontroll", "Vi är tydliga i fasta situationer och kan stänga matchen.", "Medel"],
  ["Helhet och självständiga beslut", "Vi spelar vår identitet i alla skeden utan ständig coachning.", "Medel"],
  ["Säsongsavslut och nästa nivå", "Vi sammanfattar höstens beteenden och spelar med tydlig identitet.", "Medel"],
] as const;

const baseTimeline: Record<TrainingDay, TimelineBlock[]> = {
  Måndag: [
    { from: "00", to: "10", title: "Samling och matchfråga", instruction: "Tre klipp eller observationer: vad såg vi, vad vill vi förbättra?", owner: "Huvudtränare + videoansvarig" },
    { from: "10", to: "25", title: "Aktivering", instruction: "Rörelse med scanning, passningskvalitet och identitetsordet för veckan.", owner: "Assisterande tränare" },
    { from: "25", to: "45", title: "Förenklad spelform", instruction: "Skapa veckans problem i liten yta med en tydlig constraint.", owner: "Huvudtränare" },
    { from: "45", to: "65", title: "Riktad spelform", instruction: "Lägg till riktning, motstånd och omställning efter bollvinst/förlust.", owner: "Huvudtränare + assisterande" },
    { from: "65", to: "85", title: "Spel med fokus", instruction: "Fritt spel. Coacha bara veckans två beteenden och identiteten.", owner: "Hela tränarteamet" },
    { from: "85", to: "90", title: "Reflektion", instruction: "Behåll, ändra, förstärk. Skriv nästa passfokus direkt.", owner: "Huvudtränare" },
  ],
  Onsdag: [
    { from: "00", to: "08", title: "Förankring", instruction: "Påminn om matchplanens problem och dagens mätpunkt.", owner: "Huvudtränare" },
    { from: "08", to: "20", title: "Teknisk aktivering", instruction: "Första touch, kroppsvinkel, scanning och passning som hjälper nästa spelare.", owner: "Assisterande tränare" },
    { from: "20", to: "45", title: "Huvudövning A", instruction: "Träna principen med numerär och riktning mot rätt mål.", owner: "Huvudtränare" },
    { from: "45", to: "65", title: "Huvudövning B", instruction: "Öka ytan och koppla ihop lagdelar, korridorer och spelytor.", owner: "Huvudtränare + assisterande" },
    { from: "65", to: "87", title: "11 mot 11 / matchlikt", instruction: "Testa hela beteendet med levande omställning och få coachrop.", owner: "Hela tränarteamet" },
    { from: "87", to: "90", title: "Exitfråga", instruction: "Var såg du din roll i identiteten idag?", owner: "Kapten + huvudtränare" },
  ],
  Torsdag: [
    { from: "00", to: "08", title: "Matchplan", instruction: "Motståndare, formation, tre prioriteringar och dagens roller.", owner: "Huvudtränare" },
    { from: "08", to: "20", title: "Aktivering", instruction: "Kort, skarp aktivering med matchens första beslut.", owner: "Assisterande tränare" },
    { from: "20", to: "35", title: "Press / anfallssignal", instruction: "Repetera första aktionen, triggern och lagets förflyttning.", owner: "Huvudtränare" },
    { from: "35", to: "55", title: "Fasta situationer", instruction: "Offensiv fasta, defensiv fasta och andraboll. Repetera rollerna.", owner: "Ansvarig fasta" },
    { from: "55", to: "75", title: "11 mot 11", instruction: "Spela mot motståndarens troliga uppbyggnad och våra prioriteringar.", owner: "Hela tränarteamet" },
    { from: "75", to: "87", title: "Matchscenarier", instruction: "Ledning, underläge, sista tio minuterna och fast situation i slutet.", owner: "Huvudtränare" },
    { from: "87", to: "90", title: "Sammanfattning", instruction: "Varje spelare säger sin första uppgift och sitt identitetsord.", owner: "Kapten + huvudtränare" },
  ],
};

const dateFor = (weekIndex: number, day: TrainingDay) => {
  const starts = ["2026-07-27", "2026-08-03", "2026-08-10", "2026-08-17", "2026-08-24", "2026-08-31", "2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28"];
  const base = new Date(`${starts[weekIndex]}T12:00:00`);
  const offset = day === "Måndag" ? 0 : day === "Onsdag" ? 2 : 3;
  base.setDate(base.getDate() + offset);
  return base.toISOString().slice(0, 10);
};

const weekLabel = (date: string) => new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));

export const AUTUMN_WEEKS: AutumnWeek[] = matches.map((match, index) => {
  const isPreparation = index === 0;
  const weekStart = index === 0 ? "2026-07-27" : dateFor(index, "Måndag");
  const sessions = (["Måndag", "Onsdag", "Torsdag"] as TrainingDay[]).map((day) => {
    const [sessionFocus, objective, intensity] = focus[index];
    return {
      date: dateFor(index, day),
      day,
      focus: day === "Torsdag" ? `${sessionFocus} · matchförberedelse` : sessionFocus,
      objective,
      intensity,
      owner: day === "Torsdag" ? "Huvudtränare + hela tränarteamet" : day === "Onsdag" ? "Huvudtränare" : "Huvudtränare + videoansvarig",
      timeline: baseTimeline[day],
      plan: trainingPlanFor(sessionFocus),
    };
  });
  return {
    label: `Vecka ${index + 1}`,
    range: `${weekLabel(weekStart)}–${weekLabel(match.date)}`,
    phase: isPreparation ? "Återstart och gemensam grund" : index >= 8 ? "Självständighet och säsongsavslut" : "Matchvecka",
    match,
    videoBefore: isPreparation
      ? ["Klipp från vårens sista match: identitet i duell, andraboll och scanning.", "Kort introduktion: korridorer, spelytor, tredjedelar och 4–3–3."]
      : [`Videoansvarig klipper 3–6 sekvenser mot ${match.opponent}: deras uppbyggnad och våra pressmöjligheter.`, "Välj ett anfalls- och ett försvarsbeteende som spelarna ska känna igen på måndag."],
    videoAfter: ["Direkt efter match: notera 3 bra och 3 förbättringsbara sekvenser.", "Senast måndag 12:00: publicera 3–6 klipp med en fråga per klipp.", "Måndag 17:00: huvudtränaren låser veckans fokus och delegerar passansvar."],
    sessions,
  };
});

export const AUTUMN_SOURCE = "https://www.svenskalag.se/gunnilseis-herr/matcher?seasonYear=2026";
