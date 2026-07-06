import { Activity, Apple, CalendarDays, Dumbbell, Shield, Timer, Utensils, Zap } from "lucide-react";
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
    runA: "3 block: 5 x 10 m explosiv start från mage/rygg/sidostart, 40 sek vila, 3 min mellan blocken",
    runB: "4 x 4 min målvaktsshuttle: sidled 5 m, fram 5 m, bak 5 m i högt tempo, 2 min vila",
    runC: "40 min lugn löpning + 10 x 60 m stegring där sista 20 m går nära max",
    freshA: "20 min lugn jogg + 6 x 10 sek snabba fötter",
    freshB: "6 x 20 sek sidledsförflyttning, 60 sek vila + 8 min bål",
    minimumA: "18 min jogg/gång + 4 x 10 sek snabba fötter",
    minimumB: "12 min rörlighet + 3 varv plankor, höftlyft och tåhävningar",
    gymA: "knäböj 5 x 5 tungt, chins 5 x max eller latsdrag 5 x 6, bänkpress 4 x 5, boxhopp 5 x 3",
    gymB: "marklyft 5 x 4 tungt, bulgarian split squat 4 x 8/ben, nordic hamstring 4 x 5, sidoplanka med vikt 4 x 35 sek/sida",
  },
  CB: {
    title: "Mittbackar",
    short: "Stabilitet, duellstyrka, acceleration och broms.",
    evidence:
      "Mittbackar har ofta lägre total högfartsvolym än kantspelare, men behöver vinna korta ytor, bromsa hårt och tåla dueller.",
    personalFocus: "första fem meterna, stark kropp i duellen och kontroll när du måste vända hemåt",
    runA: "2 block: 6 x 20 m acceleration + hård inbromsning, 45 sek vila, 3 min mellan blocken",
    runB: "5 x 4 min kontrollerat hårt tempo, 90 sek joggvila mellan",
    runC: "42 min lugn löpning i jämnt tempo + 8 x 80 m stegringslopp",
    freshA: "25 min lugn löpning + 6 x 15 sek backe",
    freshB: "3 x 5 min jämnt tempo, 2 min lugnt mellan",
    minimumA: "20 min jogg/gång + 5 x 15 sek backe",
    minimumB: "12 min rörlighet + 3 varv knäböj, armhävningar och planka",
    gymA: "knäböj 5 x 5 tungt, viktade chins eller tung rodd 5 x 5, bänkpress 4 x 5, Copenhagen plank 4 x 25 sek/sida",
    gymB: "marklyft 5 x 4 tungt, split squat 4 x 8/ben, farmers walk tungt 5 x 35 m, vadpress 4 x 12",
  },
  FB: {
    title: "Ytterbackar",
    short: "Upprepad hög fart, riktningsförändring och sista meter hem.",
    evidence:
      "Ytterbackar hamnar ofta högt i högintensiv löpning: överlapp, återhämtning hemåt och upprepade aktioner längs kanten.",
    personalFocus: "upprepad fart längs kanten, förmågan att komma hem igen och att orka nästa maxlöpning",
    runA: "3 block: 6 x 30 sek hårt längs kanten, 30 sek jogg, 3 min mellan blocken",
    runB: "2 block: 8 x 40 m med riktningsbyte efter 20 m, 35 sek vila, 4 min mellan blocken",
    runC: "45 min lugn löpning, sista 10 min progressivt snabbare",
    freshA: "28 min lugn löpning + 6 x 20 sek snabbt",
    freshB: "8 x 30 sek snabbt, 75 sek lugnt mellan",
    minimumA: "22 min jogg/gång + 4 x 20 sek snabbt",
    minimumB: "12 min rörlighet vader/höft + 3 varv utfall, tåhävningar och planka",
    gymA: "knäböj 5 x 5 tungt, chins eller tung rodd 5 x 6, rumänska marklyft 4 x 6, boxhopp 5 x 3",
    gymB: "marklyft 5 x 4 tungt, step-up tungt 4 x 8/ben, hoppande utfall 4 x 6/ben, tåhävningar 5 x 12",
  },
  MID: {
    title: "Mittfältare",
    short: "Motor, återhämtning och många aktioner utan tappad skärpa.",
    evidence:
      "Mittfältare ligger ofta högt i total distans och upprepade accelerationer/decelerationer, särskilt i de mest intensiva matchperioderna.",
    personalFocus: "motorn, återhämtningen mellan aktioner och förmågan att fatta bra beslut även när pulsen är hög",
    runA: "6 x 4 min högt tempo, 90 sek joggvila mellan",
    runB: "36 min fartlek: 2 min snabb, 1 min lugn hela vägen",
    runC: "50 min lugn löpning i jämnt tempo + 8 stegringslopp",
    freshA: "30 min lugn löpning + 5 x 30 sek snabbare",
    freshB: "4 x 3 min bra tempo, 90 sek lugnt mellan",
    minimumA: "22 min jogg/gång + 6 x 20 sek snabbare",
    minimumB: "12 min rörlighet + 3 varv knäböj, höftlyft och planka",
    gymA: "knäböj 5 x 5 tungt, viktade chins eller tung rodd 5 x 5, utfall framåt 4 x 8/ben, sled push eller step-up 5 x 20 m",
    gymB: "marklyft 5 x 4 tungt, frontböj 4 x 5, enbens rumänska marklyft 4 x 8/ben, bålrotation tungt 4 x 10/sida",
  },
  FWD: {
    title: "Forwards",
    short: "Explosivitet, djupled och upprepade maxlöpningar.",
    evidence:
      "Forwards behöver mycket hög fart i avgörande aktioner: hota bakom, trycka första steget och kunna sprinta igen efter kort vila.",
    personalFocus: "första steget, djupledshotet och förmågan att sprinta med kvalitet även i slutet",
    runA: "2 block: 8 x 50 m djupledssprint, 45 sek vila, 4 min mellan blocken",
    runB: "12 x 20 sek maxnära löpning, 70 sek vila mellan",
    runC: "38 min lugn löpning + 10 stegringslopp där sista 30 m går hårt",
    freshA: "25 min lugn löpning + 6 x 15 sek acceleration",
    freshB: "8 x 20 sek snabbt, 90 sek vila mellan",
    minimumA: "20 min jogg/gång + 5 x 15 sek acceleration",
    minimumB: "12 min rörlighet baksida lår/höft + 3 varv höftlyft, tåhävningar och planka",
    gymA: "knäböj 5 x 5 tungt, chins eller tung rodd 5 x 6, hip thrust 5 x 5, boxhopp 5 x 3",
    gymB: "marklyft 5 x 4 tungt, bulgarian split squat 4 x 8/ben, nordic hamstring 4 x 5, vadpress 5 x 12",
  },
};

const AMBITION_LEVELS: AmbitionLevel[] = [
  {
    id: 1,
    title: "Hög ambitionsnivå",
    badge: "Sex pass",
    tempo: "Högst tempo. Sex träningsdagar per vecka. Två tunga gympass, två hårda löppass, ett fartpass och ett distans/återhämtningspass.",
    promise:
      "Det här är nivån att sträva mot. Den är obekväm, tung och tydlig. Inte för tränarens skull, utan för att du ska komma tillbaka stark nog att konkurrera direkt.",
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

const STANDARD_SIGNALS = [
  { label: "Standard", value: "Nivå 1", text: "Det är måttet. Allt annat är en nedväxling." },
  { label: "Vecka", value: "6 pass", text: "Två gym, två hårda löp, ett fartpass, ett distanspass." },
  { label: "Deadline", value: "26/7", text: "Upprepa veckorytmen fram till söndag 26 juli." },
];

const LEVEL_ONE_RHYTHM = [
  { day: "Mån", tag: "Gym tungt A + acceleration", tone: "bg-emerald-500 text-emerald-950" },
  { day: "Tis", tag: "Hårt löppass", tone: "bg-lime-300 text-lime-950" },
  { day: "Ons", tag: "Återhämtning + rörlighet", tone: "bg-sky-300 text-sky-950" },
  { day: "Tors", tag: "Fart, teknik, reaktion", tone: "bg-amber-300 text-amber-950" },
  { day: "Fre", tag: "Gym tungt B + stegring", tone: "bg-emerald-500 text-emerald-950" },
  { day: "Sön", tag: "Distans + kvalitet", tone: "bg-zinc-100 text-zinc-950" },
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
    return `${name}, kategori 1 är valet när ${player.name} menar allvar. Som ${roleLabel} behöver ${name} både hård löpning, tunga baslyft och disciplin nog att göra jobbet även när det är semester. ${player.name}, detta ska kännas som träning. Gör du det ordentligt kommer du tillbaka med starkare ben, bättre motor och ett mentalt övertag redan första veckan.`;
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
      {
        day: "Måndag",
        time: "08:30",
        work: `Gym tungt A: ${plan.gymA}. Direkt efter: ${plan.runA}. Avsluta med 10 min rörlighet.`,
      },
      {
        day: "Tisdag",
        time: "18:30",
        work: `Hårt löppass: ${plan.runB}. Pulsen ska upp. Sista repetitionen ska fortfarande ha kvalitet.`,
      },
      {
        day: "Onsdag",
        time: "09:00",
        work: "Återhämtningsjobb: 30 min cykel/jogg i lugnt tempo + 15 min rörlighet höft, ljumske, baksida lår och vader.",
      },
      {
        day: "Torsdag",
        time: "18:30",
        work: `Fart/teknik: ${plan.runA}. Lägg till 8 x 5 m reaktionsstarter och 4 x 20 m med boll om du har yta.`,
      },
      {
        day: "Fredag",
        time: "08:30",
        work: `Gym tungt B: ${plan.gymB}. Efter gymmet: 8 x 60 m stegringslopp, gå tillbaka som vila.`,
      },
      {
        day: "Söndag",
        time: "10:00",
        work: `Distans + kvalitet: ${plan.runC}. Om benen känns bra: lägg till 6 min extra i kontrollerat hårt tempo.`,
      },
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

const StandardBoard = () => (
  <section className="relative overflow-hidden border border-zinc-900 bg-zinc-950 text-white">
    <div className="absolute inset-y-0 left-0 w-2 bg-lime-300" aria-hidden="true" />
    <div
      className="absolute inset-0 opacity-[0.08]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(0deg, white 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
    <div className="relative grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col justify-between gap-8">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-lime-300">
            Viktigast på sidan
          </p>
          <h2 className="mt-3 max-w-xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
            Nivå 1 är standarden.
          </h2>
          <p className="mt-4 max-w-prose text-sm font-semibold leading-relaxed text-zinc-300 md:text-base">
            Sidan har mycket text, men detta är kärnan: välj spelare, öppna namnet, följ veckorytmen. Vill du komma
            tillbaka redo att konkurrera är kategori 1 den nivån du mäter dig mot.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {STANDARD_SIGNALS.map((signal) => (
            <div key={signal.label} className="border border-white/15 bg-white/5 p-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">
                {signal.label}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">{signal.value}</p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-zinc-300">{signal.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/15 bg-zinc-900/85 p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Veckorytm</p>
            <h3 className="text-2xl font-black tracking-tight text-white">Sex dagar. Ingen dimma.</h3>
          </div>
          <Dumbbell className="h-7 w-7 text-lime-300" aria-hidden="true" />
        </div>
        <div className="grid gap-2">
          {LEVEL_ONE_RHYTHM.map((item) => (
            <div key={item.day} className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-stretch border border-white/10">
              <div className={cn("grid place-items-center font-mono text-sm font-black uppercase", item.tone)}>
                {item.day}
              </div>
              <div className="bg-black/35 px-4 py-3 text-sm font-black leading-tight text-white">{item.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
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
        description="Öppna ditt namn. Välj nivå. Gör jobbet varje vecka fram till söndag 26/7. Kategori 1 är inte mysig. Den är standarden för spelare som vill komma tillbaka redo."
      >
        <div className="grid gap-2 sm:grid-cols-4">
          {["1. Hög ambitionsnivå", "Sex pass/vecka", "Tunga baslyft", "Fram till 26/7"].map((item) => (
            <span
              key={item}
              className="inline-flex min-h-10 items-center justify-center border border-emerald-600/25 bg-emerald-600/10 px-3 text-center font-mono text-[10px] font-black uppercase tracking-[0.16em] text-emerald-900"
            >
              {item}
            </span>
          ))}
        </div>
      </PageHero>

      <main className="container pb-section">
        <SectionReveal as="section">
          <StandardBoard />
        </SectionReveal>

        <SectionReveal as="section" className="mt-12">
          <div className="mb-5 grid gap-4 border-y border-border py-5 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">Välj nivå</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                Tre val. En standard.
              </h2>
            </div>
            <p className="max-w-3xl text-sm font-semibold leading-relaxed text-foreground/70 md:text-base">
              Kategori 1 är byggd för spelare som vill tåla tempo direkt. Kategori 2 håller kroppen igång. Kategori 3
              är bara miniminivå. Skillnaden ska synas i benen när vi startar igen.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.88fr_0.88fr]">
            {AMBITION_LEVELS.map((level) => (
              <article
                key={level.id}
                className={cn(
                  "relative min-h-[16rem] border p-5 md:p-6",
                  level.id === 1
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : level.id === 2
                      ? "border-sky-700/25 bg-sky-50 text-sky-950"
                      : "border-rose-700/25 bg-rose-50 text-rose-950"
                )}
              >
                {level.id === 1 && <div className="absolute inset-x-0 top-0 h-1.5 bg-lime-300" aria-hidden="true" />}
                <p
                  className={cn(
                    "font-mono text-[10px] font-black uppercase tracking-[0.2em]",
                    level.id === 1 ? "text-lime-300" : "text-accent"
                  )}
                >
                  {level.badge}
                </p>
                <h2 className={cn("mt-2 font-black tracking-tight", level.id === 1 ? "text-4xl text-white md:text-5xl" : "text-2xl")}>
                  {level.id}. {level.title}
                </h2>
                <p className={cn("mt-4 text-sm font-black leading-relaxed", level.id === 1 ? "text-white" : "text-foreground/85")}>
                  {level.tempo}
                </p>
                <p className={cn("mt-3 text-sm leading-relaxed", level.id === 1 ? "text-zinc-300" : "text-muted-foreground")}>
                  {level.promise}
                </p>
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
          <div className="mb-5 border border-zinc-900 bg-zinc-950 p-5 text-white md:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-lime-300">
                  Spelarkort
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight md:text-5xl">Öppna ditt namn.</h2>
                <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-zinc-300">
                  {loading ? "Hämtar truppen..." : `${playerPlans.length} spelare. Varje namn har tre nivåer, men nivå 1 är riktmärket.`}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["01", "Hitta ditt namn"],
                  ["02", "Läs din positionsroll"],
                  ["03", "Kör veckorytmen"],
                ].map(([number, label]) => (
                  <div key={number} className="border border-white/15 bg-white/5 p-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">{number}</p>
                    <p className="mt-2 text-sm font-black leading-tight text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="border border-zinc-900 bg-card">
            {playerPlans.map(({ player, role }) => {
              const plan = ROLE_PLANS[role];
              return (
                <AccordionItem key={player.name} value={player.name} className="border-border/80 px-4 md:px-5">
                  <AccordionTrigger className="min-h-16 gap-4 text-left hover:no-underline data-[state=open]:text-emerald-800">
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-base font-black text-foreground">{player.name}</span>
                      <span className="flex flex-wrap gap-2">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                          {ROLE_LABELS[role]}
                        </span>
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                          Nivå 1: sex pass
                        </span>
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
                        <div className={cn("border border-zinc-900 bg-zinc-950 p-4 text-white", role === "FB" && "border-lime-300/70")}>
                          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-lime-300">
                            Period
                          </p>
                          <p className="text-sm font-semibold leading-relaxed text-zinc-200">
                            Upprepa valt veckoschema varje vecka fram till söndag 26/7.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.82fr_0.82fr]">
                        {AMBITION_LEVELS.map((level) => (
                          <article
                            key={level.id}
                            className={cn(
                              "border p-4",
                              level.id === 1
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : level.id === 2
                                  ? "border-sky-700/25 bg-sky-50"
                                  : "border-rose-700/25 bg-rose-50"
                            )}
                          >
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <p
                                  className={cn(
                                    "font-mono text-[10px] font-black uppercase tracking-[0.18em]",
                                    level.id === 1 ? "text-lime-300" : "text-accent"
                                  )}
                                >
                                  {level.badge}
                                </p>
                                <h3 className={cn("mt-1 font-black", level.id === 1 ? "text-2xl text-white" : "text-xl text-foreground")}>
                                  {level.id}. {level.title}
                                </h3>
                              </div>
                              {level.id === 1 ? (
                                <Dumbbell className="h-5 w-5 shrink-0 text-lime-300" aria-hidden="true" />
                              ) : level.id === 2 ? (
                                <Activity className="h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" />
                              ) : (
                                <Zap className="h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" />
                              )}
                            </div>
                            <p className={cn("text-sm leading-relaxed", level.id === 1 ? "font-semibold text-zinc-200" : "text-foreground/80")}>
                              {getPersonalLevelText(player, level, role)}
                            </p>
                            <ul className="mt-4 space-y-3">
                              {getSchedule(role, level.id).map((item) => (
                                <li
                                  key={`${item.day}-${item.time}`}
                                  className={cn("border-l-2 pl-3", level.id === 1 ? "border-lime-300" : "border-accent/50")}
                                >
                                  <p
                                    className={cn(
                                      "font-mono text-[10px] font-black uppercase tracking-[0.18em]",
                                      level.id === 1 ? "text-lime-300" : "text-accent"
                                    )}
                                  >
                                    {item.day} · {item.time}
                                  </p>
                                  <p className={cn("mt-1 text-xs font-semibold leading-relaxed", level.id === 1 ? "text-zinc-200" : "text-foreground/75")}>
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
