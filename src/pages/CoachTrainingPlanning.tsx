import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, Film, Printer, Users } from "lucide-react";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import SectionReveal from "@/components/SectionReveal";
import { AUTUMN_SOURCE, AUTUMN_WEEKS, COACH_ROLES, TRAINING_METHOD } from "@/data/coachTrainingAutumn2026";

const formatDate = (value: string) => new Intl.DateTimeFormat("sv-SE", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));

const CoachTrainingPlanning = () => (
  <>
    <BreadcrumbTrail items={[{ label: "Hem", to: "/" }, { label: "Coach", to: "/coach" }, { label: "Träningsplanering hösten 2026" }]} />
    <PageHero eyebrow="Coach · träningsplanering" title="Hösten 2026" description="Matcherna är navet. Varje analys, träning och matchplan leder till nästa prestation." />

    <div className="container pb-section print:hidden">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground">
          <Printer className="h-4 w-4" /> Skriv ut planen
        </button>
        <Link to="/coach" className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-bold">
          Tillbaka till Coach
        </Link>
      </div>
    </div>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Arbetsmodell" title="Så använder vi planen" number={1} />
      <div className="grid gap-3 md:grid-cols-3">
        <InfoCard icon={<Clock3 />} title="Tre pass" text="Måndag, onsdag och torsdag 18:30–20:00. Varje block har ansvarig ledare." />
        <InfoCard icon={<Film />} title="Video som lärloop" text="Match → klipp → måndagsfråga → träningsfokus → ny match." />
        <InfoCard icon={<CheckCircle2 />} title="Identitet överallt" text="Dueller, andrabollsspel, ta ytan, prata med passningen och scanning." />
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Träningsmetodik" title="Från förståelse till matchbeteende" number={2} />
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        {TRAINING_METHOD.map(([number, title, text]) => <div key={number} className="rounded-xl border border-border bg-card p-3"><span className="text-xs font-black text-primary">{number}</span><h3 className="mt-2 text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div>)}
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Delegering" title="Vem gör vad" number={3} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {COACH_ROLES.map(([role, task]) => <div key={role} className="flex gap-3 rounded-xl border border-border bg-card p-4"><Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-bold">{role}</h3><p className="mt-1 text-sm text-muted-foreground">{task}</p></div></div>)}
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Matchnav" title="Alla veckor och pass" number={4} />
      <div className="space-y-4">
        {AUTUMN_WEEKS.map((week) => <WeekCard key={week.label} week={week} />)}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Matchkälla: <a className="underline" href={AUTUMN_SOURCE}>{AUTUMN_SOURCE}</a> · Träningstider: måndag, onsdag och torsdag 18:30–20:00.</p>
    </SectionReveal>
  </>
);

const InfoCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-2 text-primary">{icon}<h3 className="font-bold text-foreground">{title}</h3></div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>;

const WeekCard = ({ week }: { week: (typeof AUTUMN_WEEKS)[number] }) => <details className="group overflow-hidden rounded-2xl border border-border bg-card" open={week.label === "Vecka 1"}>
  <summary className="cursor-pointer list-none p-4 hover:bg-muted/40">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{week.label} · {week.range}</p><h3 className="mt-1 text-lg font-black">{week.match.homeAway === "Hemma" ? "Gunnilse" : week.match.opponent}–{week.match.homeAway === "Hemma" ? week.match.opponent : "Gunnilse"}</h3><p className="mt-1 text-sm text-muted-foreground">{week.phase} · {formatDate(week.match.date)} {week.match.kickoff} · {week.match.venue}</p></div><CalendarDays className="h-5 w-5 text-primary" /></div>
  </summary>
  <div className="border-t border-border p-4">
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"><div className="space-y-3"><div><h4 className="text-xs font-black uppercase tracking-wide text-primary">Inför veckan · video</h4><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{week.videoBefore.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><h4 className="text-xs font-black uppercase tracking-wide text-primary">Efter matchen</h4><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{week.videoAfter.map((item) => <li key={item}>• {item}</li>)}</ul></div></div><div className="space-y-3">{week.sessions.map((session) => <SessionCard key={session.date} session={session} />)}</div></div>
  </div>
</details>;

const SessionCard = ({ session }: { session: (typeof AUTUMN_WEEKS)[number]["sessions"][number] }) => <div className="rounded-xl border border-border bg-background p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-wide text-primary">{session.day} · {formatDate(session.date)} · 18:30–20:00</p><h4 className="mt-1 font-bold">{session.focus}</h4><p className="mt-1 text-sm text-muted-foreground">{session.objective}</p></div><span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{session.intensity}</span></div><ol className="mt-3 space-y-2 border-l-2 border-primary/20 pl-3">{session.timeline.map((block) => <li key={`${block.from}-${block.to}`}><p className="text-xs font-black text-primary">{block.from}–{block.to} min · {block.title}</p><p className="text-sm">{block.instruction}</p><p className="text-xs text-muted-foreground">Ansvar: {block.owner}</p></li>)}</ol></div>;

export default CoachTrainingPlanning;
