import { useState } from "react";
import { CalendarDays, Shield, Timer } from "lucide-react";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSquad } from "@/hooks/useSquad";
import type { Player } from "@/data/squad";
import {
  getRoleForPlayer,
  getSchedule,
  PLAN_LEVELS,
  TRAINING_WEEKS,
  type PlanLevel,
  type ScheduleItem,
  type TrainingRole,
} from "@/data/individualTraining";
import { cn } from "@/lib/utils";

type DisplayRole = "GK" | "CB" | "FB" | "MID" | "FWD";

const FULLBACKS = new Set(["rayan fedaila", "vedad dzambegovic", "pascal jabbour", "idris abdi", "ahmad soheyl matin"]);
const CENTER_BACKS = new Set(["rinor zenullah", "adnan hadzialic", "sabarr janneh", "daniel matin", "meysam hoseni", "nayef mohammad"]);
const ROLE_ORDER: DisplayRole[] = ["GK", "CB", "FB", "MID", "FWD"];
const ROLE_LABELS: Record<DisplayRole, string> = {
  GK: "Målvakt",
  CB: "Mittback",
  FB: "Ytterback",
  MID: "Mittfältare",
  FWD: "Forward",
};
const ROLE_NOTES: Record<DisplayRole, { short: string; focus: string }> = {
  GK: { short: "Kort acceleration, sidled och pigga fötter.", focus: "första steget, bålstyrkan och nästa explosiva aktion" },
  CB: { short: "Stabilitet, duellstyrka, acceleration och broms.", focus: "första fem meterna, duellstyrkan och kontrollen i inbromsningen" },
  FB: { short: "Upprepad hög fart, riktningsförändring och sista meter hem.", focus: "farten längs kanten, hemjobbet och nästa kvalitativa löpning" },
  MID: { short: "Motor, återhämtning och många aktioner med skärpa.", focus: "motorn, återhämtningen mellan aktioner och besluten under hög puls" },
  FWD: { short: "Explosivitet, djupled och upprepade snabba löpningar.", focus: "första steget, djupledshotet och sprintkvaliteten" },
};
const LEVEL_TONES: Record<PlanLevel, string> = {
  full: "border-kedja-ink bg-kedja-ink text-white",
  maintenance: "border-sky-700/25 bg-sky-50 text-sky-950",
  minimum: "border-emerald-700/25 bg-emerald-50 text-emerald-950",
};
const INTENSITY_LABELS: Record<ScheduleItem["intensity"], string> = { low: "Låg", moderate: "Måttlig", high: "Hög" };

const normalizeName = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function getDisplayRole(player: Player): DisplayRole {
  const name = normalizeName(player.name);
  if (FULLBACKS.has(name)) return "FB";
  if (CENTER_BACKS.has(name)) return "CB";
  if (player.position === "GK") return "GK";
  if (player.position === "DEF") return "CB";
  if (player.position === "MID") return "MID";
  return "FWD";
}

function groupPlayers(players: Player[]) {
  return players
    .map((player) => ({ player, displayRole: getDisplayRole(player), trainingRole: getRoleForPlayer(player) }))
    .sort((a, b) => ROLE_ORDER.indexOf(a.displayRole) - ROLE_ORDER.indexOf(b.displayRole) || a.player.name.localeCompare(b.player.name, "sv"));
}

function getRoleNote(player: Player, role: DisplayRole) {
  const firstName = player.name.split(" ")[0];
  if (normalizeName(player.name) === "vedad dzambegovic") {
    return `${firstName}, du finns både som mittback och ytterback. Du får ytterbackens tempo som grund, med extra respekt för duellstyrka och bål.`;
  }
  return `${firstName}, du tränar som ${ROLE_LABELS[role].toLowerCase()}. Ditt fokus är ${ROLE_NOTES[role].focus}.`;
}

function ScheduleCard({ role, level, week }: { role: TrainingRole; level: PlanLevel; week: number }) {
  const levelInfo = PLAN_LEVELS.find((candidate) => candidate.id === level)!;
  const items = getSchedule(role, level, week);
  return (
    <article aria-label={levelInfo.label} className={cn("border p-4", LEVEL_TONES[level])}>
      <h3 className={cn("text-xl font-black", level === "full" ? "text-white" : "text-foreground")}>{levelInfo.label}</h3>
      <p className={cn("mt-1 text-sm", level === "full" ? "text-kedja-mint/80" : "text-foreground/75")}>{levelInfo.description}</p>
      <ul className="mt-4 space-y-4">
        {items.map((item, index) => (
          <li key={`${item.day}-${item.sessionType}-${index}`} className={cn("border-l-2 pl-3", level === "full" ? "border-kedja-lime" : "border-accent/50")}>
            <p className={cn("font-mono text-[10px] font-black uppercase tracking-[0.18em]", level === "full" ? "text-kedja-lime" : "text-accent")}>{item.day}</p>
            <p className={cn("mt-1 text-sm font-black", level === "full" ? "text-white" : "text-foreground")}>{item.title}</p>
            <p className={cn("mt-1 text-xs font-semibold", level === "full" ? "text-kedja-mint/90" : "text-foreground/80")}>{item.dose}</p>
            <dl className={cn("mt-2 grid gap-1 text-xs", level === "full" ? "text-kedja-mint/80" : "text-muted-foreground")}>
              <div><dt className="inline font-black">Intensitet: </dt><dd className="inline">{INTENSITY_LABELS[item.intensity]}</dd></div>
              <div><dt className="inline font-black">Vila: </dt><dd className="inline">{item.recovery}</dd></div>
              <div><dt className="inline font-black">Stoppregel: </dt><dd className="inline">{item.stopRule}</dd></div>
            </dl>
          </li>
        ))}
      </ul>
    </article>
  );
}

const Semestern2026 = () => {
  const { players, loading } = useSquad();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const playerPlans = groupPlayers(players);
  const week = TRAINING_WEEKS.find((candidate) => candidate.id === selectedWeek)!;

  return (
    <>
      <BreadcrumbTrail items={[{ label: "Hem", to: "/" }, { label: "Laget", to: "/laget" }, { label: "Semestern 2026" }]} />
      <PageHero
        eyebrow="Laget · Semestern 2026"
        title="Personliga träningsscheman"
        description="Öppna ditt namn, välj vecka och följ den nivå som passar din tillgänglighet och återhämtning."
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {["Fyra veckors progression", "Tre hållbara nivåer", "Dos och stoppregel"].map((item) => (
            <span key={item} className="inline-flex min-h-11 items-center justify-center border border-emerald-600/25 bg-emerald-600/10 px-3 text-center font-mono text-[10px] font-black uppercase tracking-[0.16em] text-emerald-900">{item}</span>
          ))}
        </div>
      </PageHero>

      <main className="container pb-section">
        <SectionReveal as="section">
          <div className="border border-kedja-ink bg-kedja-ink p-5 text-white md:p-7">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-lime">Gör så här</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Hitta ditt namn. Välj vecka. Följ dosen.</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-kedja-mint/80">Börja på vecka 1 och gå vidare när återhämtningen är normal. Avsluta alltid enligt passets stoppregel.</p>
          </div>
        </SectionReveal>

        <SectionReveal as="section" className="mt-12">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">Positionskrav</p><h2 className="mt-1 text-3xl font-black tracking-tight text-foreground">Schemat styrs av din roll.</h2></div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">Positionerna har olika sprintdoser. Övrig belastning följer samma tydliga modell.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {ROLE_ORDER.map((role) => (
              <article key={role} className="flex min-h-44 flex-col border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-black text-foreground">{ROLE_LABELS[role]}</h3>{role === "GK" ? <Shield className="h-5 w-5 text-accent" aria-hidden="true" /> : <Timer className="h-5 w-5 text-accent" aria-hidden="true" />}</div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/80">{ROLE_NOTES[role].short}</p>
              </article>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal as="section" className="mt-12">
          <div className="mb-5 border border-kedja-ink bg-kedja-ink p-5 text-white md:p-6">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-lime">Spelarkort</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight md:text-5xl">Öppna ditt namn.</h2>
            <p className="mt-3 text-sm font-semibold text-kedja-mint/80">{loading ? "Hämtar truppen..." : `${playerPlans.length} spelare med personligt positionsfokus.`}</p>
          </div>
          <Accordion type="single" collapsible className="border border-kedja-ink bg-card">
            {playerPlans.map(({ player, displayRole, trainingRole }) => (
              <AccordionItem key={player.name} value={player.name} className="border-border/80 px-4 md:px-5">
                <AccordionTrigger className="min-h-16 gap-4 text-left hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-base font-black text-foreground">{player.name}</span><span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{ROLE_LABELS[displayRole]}</span></span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="mb-5 text-sm font-semibold leading-relaxed text-foreground/85">{getRoleNote(player, displayRole)}</p>
                  <fieldset className="mb-5">
                    <legend className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-accent">Välj träningsvecka</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {TRAINING_WEEKS.map((candidate) => (
                        <button key={candidate.id} type="button" aria-pressed={selectedWeek === candidate.id} onClick={() => setSelectedWeek(candidate.id)} className={cn("min-h-11 border px-3 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", selectedWeek === candidate.id ? "border-kedja-ink bg-kedja-ink text-white" : "border-border bg-background text-foreground hover:bg-muted")}>{candidate.label}</button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mb-5 border border-emerald-700/25 bg-emerald-700/10 p-4">
                    <p className="font-black text-foreground">{week.label}: volym {week.volumeRange} · fart {week.speedTarget}</p>
                    <p className="mt-1 text-sm text-foreground/75">{week.guidance}</p>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
                    {PLAN_LEVELS.map((level) => <ScheduleCard key={level.id} role={trainingRole} level={level.id} week={selectedWeek} />)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionReveal>

        <SectionReveal as="section" className="mt-12 grid gap-4 border border-emerald-700/25 bg-emerald-700/10 p-5 md:grid-cols-[auto_minmax(0,1fr)] md:p-7">
          <div className="flex h-12 w-12 items-center justify-center border border-emerald-700/30 bg-background text-emerald-800"><CalendarDays className="h-5 w-5" aria-hidden="true" /></div>
          <div><h2 className="text-2xl font-black text-foreground">Kvalitet före kalender.</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75">Gå vidare en vecka när du kan hålla avsedd intensitet utan att bryta stoppreglerna. Vid kvarstående trötthet väljer du en lägre nivå.</p></div>
        </SectionReveal>
      </main>
    </>
  );
};

export default Semestern2026;
