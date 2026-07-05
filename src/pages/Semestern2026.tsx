import { Activity, Apple, CalendarDays, Dumbbell, HeartPulse, Shield, Timer, Utensils, Waves } from "lucide-react";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSquad } from "@/hooks/useSquad";
import type { Player } from "@/data/squad";
import { cn } from "@/lib/utils";

type TrainingRole = "GK" | "CB" | "FB" | "MID" | "FWD";

type RolePlan = {
  title: string;
  short: string;
  focus: string;
  personal: string;
  sessions: string[];
};

const EXCLUDED_PLAYERS = new Set(["josef abdmasih"]);

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
  "vedad dzambegovic",
  "sabarr janneh",
  "daniel matin",
]);

const ROLE_ORDER: TrainingRole[] = ["GK", "CB", "FB", "MID", "FWD"];

const ROLE_LABELS: Record<TrainingRole, string> = {
  GK: "Målvakt",
  CB: "Back",
  FB: "Ytterback",
  MID: "Mittfältare",
  FWD: "Forward",
};

const ROLE_PLANS: Record<TrainingRole, RolePlan> = {
  GK: {
    title: "Målvakter",
    short: "Snabba fötter, stark bål, explosiva första steg.",
    focus: "Du ska komma tillbaka lätt i kroppen och redo att flytta dig snabbt.",
    personal:
      "Din viktigaste uppgift är att hålla fötterna igång. Kör kort, explosivt och noggrant. Hellre kvalitet i varje aktion än ett långt pass där du blir seg.",
    sessions: [
      "Pass 1: 25 min lugn löpning + 8 x 10 sek snabba fötter på stället.",
      "Pass 2: 10 x 20 sek sidledsförflyttning, 40 sek vila + 3 varv bål.",
      "Pass 3: 6 x 60 m progressiv löpning, gå tillbaka som vila.",
      "Pass 4 valfritt: 20 min promenad/jogg + rörlighet för höft, ljumske och vad.",
    ],
  },
  CB: {
    title: "Backar",
    short: "Stabilitet, acceleration och löpningar med kontroll.",
    focus: "Du ska orka försvara yta, vinna duellen och vara pigg i sista löpningen.",
    personal:
      "Din roll kräver lugn kropp och starka första meter. Prioritera enkla löppass, kort acceleration och bålstyrka. Kom tillbaka med känslan att du kan försvara direkt.",
    sessions: [
      "Pass 1: 30 min lugn löpning i prattempo.",
      "Pass 2: 8 x 15 sek backe eller lätt uppför, gå ner som vila + 3 varv styrka.",
      "Pass 3: 4 x 4 min kontrollerat tempo, 2 min gång/jogg mellan.",
      "Pass 4 valfritt: 20 min rörlighet + 3 x 12 knäböj, utfall och armhävningar.",
    ],
  },
  FB: {
    title: "Ytterbackar",
    short: "Upprepad löpning, riktningsförändring och sista meter hem.",
    focus: "Du ska orka gå framåt och ändå komma hem med fart.",
    personal:
      "Din roll kräver mest upprepade löpningar. Håll passen enkla men gör dem ordentligt: spring, vila kort, spring igen. Det är där du bygger kanten.",
    sessions: [
      "Pass 1: 35 min lugn löpning, sista 5 min lite snabbare.",
      "Pass 2: 10 x 30 sek snabbt, 60 sek lugnt mellan.",
      "Pass 3: 12 x 40 m sprint med riktningsbyte efter 20 m, gå tillbaka som vila.",
      "Pass 4 valfritt: 25 min lätt jogg eller cykel + rörlighet vader/höft.",
    ],
  },
  MID: {
    title: "Mittfältare",
    short: "Motor, tempo och återhämtning mellan aktioner.",
    focus: "Du ska kunna jobba igen, igen och igen utan att tappa beslutskraft.",
    personal:
      "Din roll handlar om motor och rytm. Du behöver inte maxa varje pass, men du ska hålla igång hjärtat flera gånger i veckan och vänja kroppen vid många aktioner.",
    sessions: [
      "Pass 1: 35 min lugn löpning i jämnt tempo.",
      "Pass 2: 5 x 3 min högt tempo, 90 sek lugn jogg mellan.",
      "Pass 3: Fartlek 25 min: växla 1 min snabb, 1 min lugn.",
      "Pass 4 valfritt: 20 min bolltouch eller lätt jogg + 10 min rörlighet.",
    ],
  },
  FWD: {
    title: "Forwards",
    short: "Explosivitet, djupled och upprepade maxlöpningar.",
    focus: "Du ska komma tillbaka med tryck i första steget och ork att hota bakom.",
    personal:
      "Din roll avgörs ofta i de första stegen. Kör enkelt: sprinta med kvalitet, vila tillräckligt och bygg upp löpningen så kroppen håller när vi startar igen.",
    sessions: [
      "Pass 1: 25-30 min lugn löpning + 6 stegringslopp.",
      "Pass 2: 8 x 20 sek snabbt, 90 sek vila mellan.",
      "Pass 3: 10 x 50 m djupledssprint, gå tillbaka som vila.",
      "Pass 4 valfritt: 20 min lätt jogg + höft, baksida lår och vad.",
    ],
  },
};

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
  if (CENTER_BACKS.has(name)) return name === "vedad dzambegovic" ? "FB" : "CB";
  if (player.position === "GK") return "GK";
  if (player.position === "DEF") return "CB";
  if (player.position === "MID") return "MID";
  return "FWD";
}

function getRoleNote(player: Player, role: TrainingRole) {
  const firstName = player.name.split(" ")[0];
  if (normalizeName(player.name) === "vedad dzambegovic") {
    return `${firstName}, du finns både som back och ytterback. Kör ytterbacksschemat som grund, och lägg extra fokus på bålstyrkan från backarnas pass.`;
  }

  return `${firstName}, du kör ${ROLE_LABELS[role].toLowerCase()}-schemat. Det viktigaste är inte att göra mest, utan att göra 3-4 pass varje vecka fram till söndag 26/7.`;
}

function groupPlayers(players: Player[]) {
  return players
    .filter((player) => !EXCLUDED_PLAYERS.has(normalizeName(player.name)))
    .map((player) => ({ player, role: getTrainingRole(player) }))
    .sort((a, b) => {
      const roleSort = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role);
      return roleSort || a.player.name.localeCompare(b.player.name, "sv");
    });
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
        title="Gå inte upp i vikt"
        description="Ta hand om din kropp under sommaren. Det här är enkelt: 3-4 pass i veckan, mycket löpning, inga ursäkter och tillbaka redo söndag 26/7."
      >
        <div className="flex flex-wrap gap-2">
          {["3-4 pass/vecka", "Utan gym", "Fram till 26/7", "Egen roll"].map((item) => (
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
              Du behöver inte träna som ett proffs varje dag. Men du kan inte släppa kroppen helt och tro att första träningen blir gratis.
              Håller du igång nu kommer du tillbaka lättare, piggare och mer redo att konkurrera direkt.
            </p>
          </div>
          <BodyComparison />
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
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">Positionsschema</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">Välj ditt schema och genomför.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Kör pass 1-3 varje vecka. Pass 4 är bonus om kroppen känns bra.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {ROLE_ORDER.map((role) => {
              const plan = ROLE_PLANS[role];
              return (
                <article key={role} className="flex min-h-[24rem] flex-col border border-border bg-card p-4">
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
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{plan.focus}</p>
                  <ul className="mt-5 space-y-3">
                    {plan.sessions.map((session) => (
                      <li key={session} className="border-l-2 border-accent/50 pl-3 text-xs font-semibold leading-relaxed text-foreground/75">
                        {session}
                      </li>
                    ))}
                  </ul>
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
                  <AccordionContent className="pb-5">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
                      <div className="space-y-3">
                        <p className="text-sm font-semibold leading-relaxed text-foreground/80">
                          {getRoleNote(player, role)}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{plan.personal}</p>
                      </div>
                      <div className={cn("border border-border bg-background p-4", role === "FB" && "border-emerald-500/40 bg-emerald-500/5")}>
                        <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-accent">
                          Din vecka
                        </p>
                        <ul className="space-y-2">
                          {plan.sessions.slice(0, 3).map((session) => (
                            <li key={session} className="flex gap-2 text-xs font-semibold leading-relaxed text-foreground/75">
                              <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                              {session}
                            </li>
                          ))}
                        </ul>
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
              Gör 3 pass varje vecka fram till söndag 26/7. Har du energi gör du ett fjärde lugnt pass. Inget gym behövs:
              skor, vatten, lite disciplin och kroppen du ska ta hand om.
            </p>
          </div>
        </SectionReveal>
      </main>
    </>
  );
};

export default Semestern2026;
