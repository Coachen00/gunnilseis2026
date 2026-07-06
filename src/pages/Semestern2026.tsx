import { Activity, Apple, CalendarDays, Dumbbell, HeartPulse, Shield, Timer, Utensils, Zap } from "lucide-react";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSquad } from "@/hooks/useSquad";
import type { Player } from "@/data/squad";
import { cn } from "@/lib/utils";

type TrainingRole = "GK" | "CB" | "FB" | "MID" | "FWD";
type AmbitionId = 1 | 2 | 3;

type RolePlan = {
  title: string;
  short: string;
  evidence: string;
  personalFocus: string;
  runA: string;
  runB: string;
  runC: string;
  freshA: string;
  freshB: string;
  minimumA: string;
  minimumB: string;
  gymA: string;
  gymB: string;
};

type AmbitionLevel = {
  id: AmbitionId;
  title: string;
  badge: string;
  tempo: string;
  promise: string;
  className: string;
};

type ScheduleItem = {
  day: string;
  time: string;
  work: string;
};

const FULLBACKS = new Set([
  "rayan fedaila",
  "vedad dzambegovic",
  "pascal jabbour",
  "idris abdi",
  "ahmad soheyl matin",
]);

const CENTER_BACKS = new Set([
  "rinor zenullah",
  "adnan hadzialic",
  "sabarr janneh",
  "daniel matin",
  "meysam hoseni",
  "nayef mohammad",
]);

const ROLE_ORDER: TrainingRole[] = ["GK", "CB", "FB", "MID", "FWD"];

const ROLE_LABELS: Record<TrainingRole, string> = {
  GK: "Målvakt",
  CB: "Mittback",
  FB: "Ytterback",
  MID: "Mittfältare",
  FWD: "Forward",
};

const ROLE_PLANS: Record<TrainingRole, RolePlan> = {
  GK: {
    title: "Målvakter",
    short: "Kort acceleration, sidled, stark bål och pigga fötter.",
    evidence:
      "Målvaktens belastning handlar mindre om total löpmängd och mer om explosiva starter, sidledsförflyttning, landning och reaktion.",
    personalFocus: "första steget, bålstyrkan och känslan av att kunna flytta dig igen direkt efter en aktion",
    runA: "10 x 10 m acceleration från mage, rygg eller sidostart, 50 sek vila",
    runB: "8 x 15 sek snabba fötter + sidledsförflyttning, 45 sek vila",
    runC: "25 min lugn löpning och 8 min rörlighet för höft, ljumske och vad",
    freshA: "20 min lugn jogg + 6 x 10 sek snabba fötter",
    freshB: "6 x 20 sek sidledsförflyttning, 60 sek vila + 8 min bål",
    minimumA: "18 min jogg/gång + 4 x 10 sek snabba fötter",
    minimumB: "12 min rörlighet + 3 varv plankor, höftlyft och tåhävningar",
    gymA: "knäböj 4 x 5, chins eller latsdrag 4 x 6, bänkpress 3 x 6",
    gymB: "marklyft 4 x 4, utfall bakåt 3 x 8/ben, sidoplanka 3 x 30 sek/sida",
  },
  CB: {
    title: "Mittbackar",
    short: "Stabilitet, duellstyrka, acceleration och broms.",
    evidence:
      "Mittbackar har ofta lägre total högfartsvolym än kantspelare, men behöver vinna korta ytor, bromsa hårt och tåla dueller.",
    personalFocus: "första fem meterna, stark kropp i duellen och kontroll när du måste vända hemåt",
    runA: "8 x 20 m acceleration, gå tillbaka som vila",
    runB: "4 x 4 min kontrollerat hårt tempo, 2 min jogg/gång mellan",
    runC: "30 min lugn löpning i prattempo + 6 stegringslopp",
    freshA: "25 min lugn löpning + 6 x 15 sek backe",
    freshB: "3 x 5 min jämnt tempo, 2 min lugnt mellan",
    minimumA: "20 min jogg/gång + 5 x 15 sek backe",
    minimumB: "12 min rörlighet + 3 varv knäböj, armhävningar och planka",
    gymA: "knäböj 4 x 5, chins eller rodd 4 x 6, bänkpress 3 x 6",
    gymB: "marklyft 4 x 4, split squat 3 x 8/ben, farmers walk 4 x 30 m",
  },
  FB: {
    title: "Ytterbackar",
    short: "Upprepad hög fart, riktningsförändring och sista meter hem.",
    evidence:
      "Ytterbackar hamnar ofta högt i högintensiv löpning: överlapp, återhämtning hemåt och upprepade aktioner längs kanten.",
    personalFocus: "upprepad fart längs kanten, förmågan att komma hem igen och att orka nästa maxlöpning",
    runA: "12 x 30 sek snabbt, 60 sek lugn jogg mellan",
    runB: "10 x 40 m med riktningsbyte efter 20 m, gå tillbaka som vila",
    runC: "35 min lugn löpning, sista 6 min lite snabbare",
    freshA: "28 min lugn löpning + 6 x 20 sek snabbt",
    freshB: "8 x 30 sek snabbt, 75 sek lugnt mellan",
    minimumA: "22 min jogg/gång + 4 x 20 sek snabbt",
    minimumB: "12 min rörlighet vader/höft + 3 varv utfall, tåhävningar och planka",
    gymA: "knäböj 4 x 5, chins eller rodd 4 x 6, rumänska marklyft 3 x 6",
    gymB: "marklyft 4 x 4, step-up 3 x 8/ben, hoppande utfall 3 x 6/ben",
  },
  MID: {
    title: "Mittfältare",
    short: "Motor, återhämtning och många aktioner utan tappad skärpa.",
    evidence:
      "Mittfältare ligger ofta högt i total distans och upprepade accelerationer/decelerationer, särskilt i de mest intensiva matchperioderna.",
    personalFocus: "motorn, återhämtningen mellan aktioner och förmågan att fatta bra beslut även när pulsen är hög",
    runA: "5 x 3 min högt tempo, 90 sek lugn jogg mellan",
    runB: "fartlek 30 min: 1 min snabb, 1 min lugn hela vägen",
    runC: "38 min lugn löpning i jämnt tempo + 6 stegringslopp",
    freshA: "30 min lugn löpning + 5 x 30 sek snabbare",
    freshB: "4 x 3 min bra tempo, 90 sek lugnt mellan",
    minimumA: "22 min jogg/gång + 6 x 20 sek snabbare",
    minimumB: "12 min rörlighet + 3 varv knäböj, höftlyft och planka",
    gymA: "knäböj 4 x 5, chins eller rodd 4 x 6, utfall 3 x 8/ben",
    gymB: "marklyft 4 x 4, frontböj eller goblet squat 3 x 6, bålrotation 3 x 10/sida",
  },
  FWD: {
    title: "Forwards",
    short: "Explosivitet, djupled och upprepade maxlöpningar.",
    evidence:
      "Forwards behöver mycket hög fart i avgörande aktioner: hota bakom, trycka första steget och kunna sprinta igen efter kort vila.",
    personalFocus: "första steget, djupledshotet och förmågan att sprinta med kvalitet även i slutet",
    runA: "10 x 50 m djupledssprint, gå tillbaka som vila",
    runB: "8 x 20 sek snabbt, 90 sek vila mellan",
    runC: "28 min lugn löpning + 8 stegringslopp",
    freshA: "25 min lugn löpning + 6 x 15 sek acceleration",
    freshB: "8 x 20 sek snabbt, 90 sek vila mellan",
    minimumA: "20 min jogg/gång + 5 x 15 sek acceleration",
    minimumB: "12 min rörlighet baksida lår/höft + 3 varv höftlyft, tåhävningar och planka",
    gymA: "knäböj 4 x 5, chins eller rodd 4 x 6, höftlyft 3 x 8",
    gymB: "marklyft 4 x 4, bulgarian split squat 3 x 8/ben, vadpress 3 x 12",
  },
};

const AMBITION_LEVELS: AmbitionLevel[] = [
  {
    id: 1,
    title: "Hög ambitionsnivå",
    badge: "Gym + löpning",
    tempo: "Högst tempo. Fyra pass per vecka. Två gympass och två löppass.",
    promise:
      "Det här är nivån att sträva mot. Inte för tränarens skull, utan för att du ska komma tillbaka lätt, stark och redo att konkurrera.",
    className: "border-emerald-600/40 bg-emerald-600/5",
  },
  {
    id: 2,
    title: "Gillar att hålla mig fräsch",
    badge: "Tre pass",
    tempo: "Bra tempo. Tre pass per vecka. Tillräckligt för att kroppen inte ska tappa rytm.",
    promise:
      "Det här är respekt för dig själv. Du behöver inte maxa semestern, men du låter inte kroppen börja om från noll.",
    className: "border-sky-600/35 bg-sky-600/5",
  },
  {
    id: 3,
    title: "Chipstuttar",
    badge: "Minimum",
    tempo: "Lägsta nivå. Två korta pass per vecka. Det räddar dig från total startsträcka, men inte mycket mer.",
    promise:
      "Skarpt sagt: väljer du den här nivån väljer du också att andra kan springa ifrån dig. Det är ditt beslut, men kroppen kommer visa valet.",
    className: "border-rose-600/35 bg-rose-600/5",
  },
];

const FOOD_RULES = [
  "Ät riktig mat först: protein, kolhydrater och grönsaker.",
  "Drick vatten varje dag. Extra viktigt när det är varmt.",
  "Läsk, chips och godis är inte förbjudet, men det ska inte vara standard.",
  "Ät efter träning. Kroppen behöver fylla på för att bli starkare.",
];

const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function getTrainingRole(player: Player): TrainingRole {
  const name = normalizeName(player.name);
  if (FULLBACKS.has(name)) return "FB";
  if (CENTER_BACKS.has(name)) return "CB";
  if (player.position === "GK") return "GK";
  if (player.position === "DEF") return "CB";
  if (player.position === "MID") return "MID";
  return "FWD";
}

function firstName(player: Player) {
  return player.name.split(" ")[0];
}

function groupPlayers(players: Player[]) {
  return players
    .map((player) => ({ player, role: getTrainingRole(player) }))
    .sort((a, b) => {
      const roleSort = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role);
      return roleSort || a.player.name.localeCompare(b.player.name, "sv");
    });
}

function getRoleNote(player: Player, role: TrainingRole) {
  const name = firstName(player);
  const plan = ROLE_PLANS[role];
  if (normalizeName(player.name) === "vedad dzambegovic") {
    return `${name}, du finns både som mittback och ytterback. Därför får ${name} ytterbackstempot som grund, men med extra respekt för duellstyrka och bål. ${player.name}, du ska komma tillbaka med ben som orkar kanten och kropp som klarar duellen.`;
  }

  return `${name}, du tränar som ${ROLE_LABELS[role].toLowerCase()}. För ${player.name} betyder det fokus på ${plan.personalFocus}. ${name}, välj nivå med ärlighet: målet är inte att imponera på någon annan, målet är att ${player.name} ska må bättre och spela bättre när vi ses igen.`;
}

function getPersonalLevelText(player: Player, level: AmbitionLevel, role: TrainingRole) {
  const name = firstName(player);
  const roleLabel = ROLE_LABELS[role].toLowerCase();

  if (level.id === 1) {
    return `${name}, kategori 1 är valet när ${player.name} vill komma tillbaka före många andra. Som ${roleLabel} behöver ${name} både löpningen och gymmet. ${player.name}, gör du detta ordentligt får du lättare steg, starkare kropp och mer självrespekt i första träningen.`;
  }

  if (level.id === 2) {
    return `${name}, kategori 2 håller ${player.name} fräsch. Det är inte toppnivån, men det är ett moget beslut. ${name}, du skyddar kroppen från att tappa för mycket och du ger dig själv en ärlig chans när tempot går upp igen.`;
  }

  return `${name}, det här är chipstuttar-nivån. ${player.name} gör minimum och inget mer. Det är bättre än noll, men ${name}, välj inte detta och låtsas att kroppen ska kännas som kategori 1. ${player.name} äger valet och konsekvensen.`;
}

function getSchedule(role: TrainingRole, level: AmbitionId): ScheduleItem[] {
  const plan = ROLE_PLANS[role];

  if (level === 1) {
    return [
      { day: "Måndag", time: "09:00", work: `Löpning: ${plan.runA}. Gym: ${plan.gymA}.` },
      { day: "Onsdag", time: "18:30", work: `Löpning: ${plan.runB}. Avsluta med 8 min bål.` },
      { day: "Fredag", time: "09:00", work: `Gym: ${plan.gymB}. Löpning: 6 stegringslopp på 60 m.` },
      { day: "Söndag", time: "10:00", work: plan.runC },
    ];
  }

  if (level === 2) {
    return [
      { day: "Tisdag", time: "09:00", work: plan.freshA },
      { day: "Torsdag", time: "18:30", work: plan.freshB },
      { day: "Söndag", time: "10:00", work: "25 min lugn promenad/jogg + 10 min rörlighet." },
    ];
  }

  return [
    { day: "Onsdag", time: "19:00", work: plan.minimumA },
    { day: "Söndag", time: "11:00", work: plan.minimumB },
  ];
}

const BodyComparison = () => (
  <div className="grid gap-3 md:grid-cols-2" aria-label="Skillnad mellan att släppa kroppen och att hålla igång">
    <figure className="min-h-[17rem] border border-rose-200 bg-rose-50 p-5 text-rose-950">
      <div className="flex h-40 items-end justify-center">
        <svg viewBox="0 0 220 150" role="img" aria-label="Trött spelare som har släppt träningen">
          <circle cx="108" cy="28" r="17" fill="#f4b183" />
          <path d="M92 53c10-13 36-11 47 4 13 18 12 45-3 57-14 11-45 11-58-4-13-15-3-39 14-57Z" fill="#f97373" />
          <path d="M84 71c-20 7-29 18-35 36" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
          <path d="M141 72c16 8 25 20 31 35" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
          <path d="M91 115l-18 25" stroke="#1f2937" strokeWidth="10" strokeLinecap="round" />
          <path d="M128 116l18 24" stroke="#1f2937" strokeWidth="10" strokeLinecap="round" />
          <path d="M99 32c7 5 16 5 23 0" stroke="#3f2a1d" strokeWidth="4" strokeLinecap="round" />
          <path d="M156 26c18-4 29 6 30 21" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M178 22l8 25 16-21" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <figcaption className="mt-3">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">Släpper du helt</p>
        <p className="mt-1 text-lg font-black">Tung kropp, sega ben, längre väg tillbaka.</p>
      </figcaption>
    </figure>

    <figure className="min-h-[17rem] border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
      <div className="flex h-40 items-end justify-center">
        <svg viewBox="0 0 220 150" role="img" aria-label="Vältränad spelare som orkar springa">
          <circle cx="112" cy="25" r="16" fill="#c98b5a" />
          <path d="M91 50c13-16 39-16 51 0 10 14 5 47-8 60-10 10-34 10-44 0-13-13-10-46 1-60Z" fill="#16a34a" />
          <path d="M98 60h36M95 75h42M98 90h36" stroke="#ecfdf5" strokeWidth="4" strokeLinecap="round" />
          <path d="M83 66c-20 12-29 25-35 45" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
          <path d="M144 66c21 7 33 18 42 35" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
          <path d="M96 111l-31 26" stroke="#1f2937" strokeWidth="9" strokeLinecap="round" />
          <path d="M129 111l35 16" stroke="#1f2937" strokeWidth="9" strokeLinecap="round" />
          <circle cx="178" cy="126" r="11" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" />
          <path d="M100 29c7 5 16 5 24 0" stroke="#3f2a1d" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <figcaption className="mt-3">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Håller du igång</p>
        <p className="mt-1 text-lg font-black">Lättare steg, bättre ork, snabbare start efter semestern.</p>
      </figcaption>
    </figure>
  </div>
);

const FoodIllustration = () => (
  <figure className="border border-amber-200 bg-amber-50 p-5 text-amber-950">
    <div className="mx-auto grid aspect-[4/3] max-w-sm place-items-center">
      <svg viewBox="0 0 260 190" role="img" aria-label="Tallrik med enkel sommarmat och vatten">
        <circle cx="130" cy="100" r="66" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" />
        <path d="M130 36a64 64 0 0 1 55 32l-55 32Z" fill="#f59e0b" />
        <path d="M130 100 75 68a64 64 0 0 1 55-32Z" fill="#22c55e" />
        <path d="M130 100 75 68a64 64 0 0 0 0 64Z" fill="#ef4444" />
        <path d="M130 100h64a64 64 0 0 1-119 32Z" fill="#fde68a" />
        <rect x="204" y="45" width="28" height="96" rx="10" fill="#bfdbfe" stroke="#0f172a" strokeWidth="4" />
        <path d="M209 76h18" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        <path d="M45 46c12-15 30-15 42 0" stroke="#16a34a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="75" r="18" fill="#ef4444" stroke="#0f172a" strokeWidth="4" />
      </svg>
    </div>
    <figcaption>
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Mat som hjälper</p>
      <p className="mt-1 text-lg font-black">Enkel tallrik, vatten bredvid, energi nog för nästa pass.</p>
    </figcaption>
  </figure>
);

const Semestern2026 = () => {
  const { players, loading } = useSquad();
  const playerPlans = groupPlayers(players);

  return (
    <>
      <BreadcrumbTrail
        items={[
          { label: "Hem", to: "/" },
          { label: "Laget", to: "/laget" },
          { label: "Semestern 2026" },
        ]}
      />
      <PageHero
        eyebrow="Laget · Semestern 2026"
        title="Personliga träningsscheman"
        description="Tre nivåer fram till söndag 26/7. Du väljer själv, men välj med öppna ögon: kategori 1 bygger kroppen du vill spela med."
      >
        <div className="flex flex-wrap gap-2">
          {["1. Hög ambitionsnivå", "2. Håller mig fräsch", "3. Chipstuttar", "Fram till 26/7"].map((item) => (
            <span
              key={item}
              className="inline-flex min-h-9 items-center border border-emerald-600/25 bg-emerald-600/10 px-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800"
            >
              {item}
            </span>
          ))}
        </div>
      </PageHero>

      <main className="container pb-section">
        <SectionReveal as="section" className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center border border-emerald-600/30 bg-emerald-600/10 text-emerald-800">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="max-w-xl text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Sommaren avgör hur tung första veckan känns.
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-foreground/70">
              Det här är inte straffträning. Det är egen respekt. Håller du igång nu kommer du tillbaka lättare,
              piggare och mer redo att konkurrera direkt. Släpper du allt blir vägen tillbaka längre.
            </p>
          </div>
          <BodyComparison />
        </SectionReveal>

        <SectionReveal as="section" className="mt-12">
          <div className="mb-5">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">Välj nivå</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">Kategori 1 är riktmärket.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Varje kategori är ett ärligt val. Skillnaden är tempo, krav och hur mycket du hjälper framtida dig.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {AMBITION_LEVELS.map((level) => (
              <article key={level.id} className={cn("border p-5", level.className)}>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent">{level.badge}</p>
                <h2 className="mt-2 text-2xl font-black text-foreground">
                  {level.id}. {level.title}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/80">{level.tempo}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{level.promise}</p>
              </article>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal as="section" className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="border border-border bg-card p-5 md:p-7">
            <div className="mb-5 flex items-center gap-3">
              <Utensils className="h-5 w-5 text-amber-700" aria-hidden="true" />
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Mat</p>
                <h2 className="text-2xl font-black text-foreground">Ät så kroppen orkar jobba.</h2>
              </div>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">
              Maten behöver inte vara perfekt. Den behöver vara tillräckligt bra, tillräckligt ofta.
              Tränar du utan att äta och dricka ordentligt får du mindre effekt av passen.
            </p>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {FOOD_RULES.map((rule) => (
                <li key={rule} className="flex gap-3 border border-border/70 bg-background p-4">
                  <Apple className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span className="text-sm font-semibold leading-relaxed text-foreground/80">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <FoodIllustration />
        </SectionReveal>

        <SectionReveal as="section" className="mt-12">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">Positionskrav</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">Schemat styrs av din roll.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Forskningen om matchkrav visar att positioner belastas olika. Därför ska inte alla springa exakt samma pass.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {ROLE_ORDER.map((role) => {
              const plan = ROLE_PLANS[role];
              return (
                <article key={role} className="flex min-h-[20rem] flex-col border border-border bg-card p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                        {ROLE_LABELS[role]}
                      </p>
                      <h3 className="mt-1 text-xl font-black text-foreground">{plan.title}</h3>
                    </div>
                    {role === "GK" ? (
                      <Shield className="h-5 w-5 text-accent" aria-hidden="true" />
                    ) : (
                      <Timer className="h-5 w-5 text-accent" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-foreground/80">{plan.short}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{plan.evidence}</p>
                </article>
              );
            })}
          </div>
        </SectionReveal>

        <SectionReveal as="section" className="mt-12">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">Din text</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">Tryck på ditt namn.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {loading ? "Hämtar truppen..." : `${playerPlans.length} spelare visas i semesterlistan.`}
            </p>
          </div>

          <Accordion type="single" collapsible className="border border-border bg-card">
            {playerPlans.map(({ player, role }) => {
              const plan = ROLE_PLANS[role];
              return (
                <AccordionItem key={player.name} value={player.name} className="border-border/70 px-4 md:px-5">
                  <AccordionTrigger className="min-h-16 gap-4 text-left hover:no-underline">
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-base font-black text-foreground">{player.name}</span>
                      <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                        {ROLE_LABELS[role]}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]">
                        <div className="space-y-3">
                          <p className="text-sm font-semibold leading-relaxed text-foreground/85">
                            {getRoleNote(player, role)}
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Positionsfokus: {plan.evidence}
                          </p>
                        </div>
                        <div className={cn("border border-border bg-background p-4", role === "FB" && "border-emerald-500/40 bg-emerald-500/5")}>
                          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-accent">
                            Period
                          </p>
                          <p className="text-sm font-semibold leading-relaxed text-foreground/80">
                            Upprepa valt veckoschema varje vecka fram till söndag 26/7.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-3">
                        {AMBITION_LEVELS.map((level) => (
                          <article key={level.id} className={cn("border p-4", level.className)}>
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-accent">
                                  {level.badge}
                                </p>
                                <h3 className="mt-1 text-xl font-black text-foreground">
                                  {level.id}. {level.title}
                                </h3>
                              </div>
                              {level.id === 1 ? (
                                <Dumbbell className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                              ) : level.id === 2 ? (
                                <Activity className="h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" />
                              ) : (
                                <Zap className="h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" />
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/80">
                              {getPersonalLevelText(player, level, role)}
                            </p>
                            <ul className="mt-4 space-y-3">
                              {getSchedule(role, level.id).map((item) => (
                                <li key={`${item.day}-${item.time}`} className="border-l-2 border-accent/50 pl-3">
                                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-accent">
                                    {item.day} · {item.time}
                                  </p>
                                  <p className="mt-1 text-xs font-semibold leading-relaxed text-foreground/75">
                                    {item.work}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </article>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </SectionReveal>

        <SectionReveal as="section" className="mt-12 grid gap-4 border border-emerald-700/25 bg-emerald-700/10 p-5 md:grid-cols-[auto_minmax(0,1fr)] md:p-7">
          <div className="flex h-12 w-12 items-center justify-center border border-emerald-700/30 bg-background text-emerald-800">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">Regeln är enkel.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75">
              Välj en nivå och gör passen varje vecka fram till söndag 26/7. Kategori 1 är målet. Kategori 2 håller dig fräsch.
              Kategori 3 är minsta möjliga. Beslutet är ditt, effekten är också din.
            </p>
          </div>
        </SectionReveal>
      </main>
    </>
  );
};

export default Semestern2026;
