import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Film, Printer, Users } from "lucide-react";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import SectionReveal from "@/components/SectionReveal";
import { AUTUMN_SOURCE, AUTUMN_WEEKS, COACH_ROLES, TRAINING_METHOD } from "@/data/coachTrainingAutumn2026";

const formatDate = (value: string) => new Intl.DateTimeFormat("sv-SE", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));

const CoachTrainingPlanning = () => (
  <>
    <BreadcrumbTrail items={[{ label: "Hem", to: "/" }, { label: "Coach", to: "/coach" }, { label: "Träningsplanering" }]} />
    <PageHero eyebrow="Coach · träningsplanering" title="Träningsplanering" description="Skapa bilden i taktiktavlan, välj träningsmoment och lägg snabbt in det i veckans plan.">
      <div className="mt-8 grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-kedja-border bg-border sm:grid-cols-4">
        <FlowStep label="Match" text="Se vad som hände" tone="dark" />
        <FlowStep label="Analys" text="Välj nästa fokus" tone="light" />
        <FlowStep label="3 pass" text="Mån · ons · tors" tone="accent" />
        <FlowStep label="Ny match" text="Testa beteendet" tone="light" arrow={false} />
      </div>
    </PageHero>

    <div className="container pb-section print:hidden">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground">
          <Printer className="h-4 w-4" /> Skriv ut planen
        </button>
        <Link to="/coach" className="inline-flex h-11 items-center gap-2 rounded-lg border border-kedja-border bg-kedja-paper px-4 text-sm font-bold">
          Tillbaka till Coach
        </Link>
        <Link to="/taktiktavla" className="inline-flex h-11 items-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 text-sm font-bold text-primary">
          Skapa bild i Taktiktavlan <ArrowRight className="h-4 w-4" />
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
      <SectionHeader badge="Överblick" title="Höstens matchnav" number={2} />
      <div className="overflow-hidden rounded-2xl border border-kedja-border bg-white">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-kedja-border bg-primary px-4 py-3 text-primary-foreground sm:grid-cols-[auto_1fr_1fr_auto]">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary-foreground/70">Vecka</span>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary-foreground/70">Match</span>
          <span className="hidden text-[10px] font-black uppercase tracking-[0.18em] text-primary-foreground/70 sm:block">Veckans riktning</span>
          <span className="text-right text-[10px] font-black uppercase tracking-[0.18em] text-primary-foreground/70">Pass</span>
        </div>
        {AUTUMN_WEEKS.map((week, index) => <div key={week.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-kedja-border px-4 py-3 last:border-b-0 sm:grid-cols-[auto_1fr_1fr_auto]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
          <div><p className="font-bold">{week.match.homeAway === "Hemma" ? `Gunnilse–${week.match.opponent}` : `${week.match.opponent}–Gunnilse`}</p><p className="text-xs text-kedja-deep/70">{formatDate(week.match.date)} · {week.match.kickoff}</p></div>
          <p className="hidden text-sm text-kedja-deep/70 sm:block">{week.sessions[1].focus}</p>
          <span className="text-right text-xs font-bold text-primary">3 × 90 min</span>
        </div>)}
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Träningsmetodik" title="Från förståelse till matchbeteende" number={3} />
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        {TRAINING_METHOD.map(([number, title, text]) => <div key={number} className="rounded-xl border border-kedja-border bg-white p-3"><span className="text-xs font-black text-primary">{number}</span><h3 className="mt-2 text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-kedja-deep/70">{text}</p></div>)}
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Delegering" title="Vem gör vad" number={4} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {COACH_ROLES.map(([role, task]) => <div key={role} className="flex gap-3 rounded-xl border border-kedja-border bg-white p-4"><Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-bold">{role}</h3><p className="mt-1 text-sm text-kedja-deep/70">{task}</p></div></div>)}
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Genomförande" title="Öppna en vecka när du ska planera" number={5} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4"><div><p className="font-bold">Bilder och övningsplanering hör ihop</p><p className="mt-1 text-sm text-kedja-deep/70">Skapa en planbild i Taktiktavlan och använd den som stöd när du väljer ett av alternativen i passet.</p></div><Link to="/taktiktavla" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground">Öppna Taktiktavlan <ArrowRight className="h-4 w-4" /></Link></div>
      <div className="space-y-4">
        {AUTUMN_WEEKS.map((week) => <WeekCard key={week.label} week={week} />)}
      </div>
      <p className="mt-4 text-xs text-kedja-deep/70">Matchkälla: <a className="underline" href={AUTUMN_SOURCE}>{AUTUMN_SOURCE}</a> · Träningstider: måndag, onsdag och torsdag 18:30–20:00.</p>
    </SectionReveal>
  </>
);

const FlowStep = ({ label, text, tone, arrow = true }: { label: string; text: string; tone: "dark" | "light" | "accent"; arrow?: boolean }) => <div className={`relative p-4 ${tone === "dark" ? "bg-primary text-primary-foreground" : tone === "accent" ? "bg-accent text-accent-foreground" : "bg-white text-kedja-ink"}`}><p className="text-xs font-black uppercase tracking-[0.16em]">{label}</p><p className="mt-1 text-sm opacity-75">{text}</p>{arrow && <ArrowRight className="absolute right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 opacity-40 sm:block" />}</div>;

const InfoCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => <div className="rounded-xl border border-kedja-border bg-white p-4"><div className="flex items-center gap-2 text-primary">{icon}<h3 className="font-bold text-kedja-ink">{title}</h3></div><p className="mt-2 text-sm leading-relaxed text-kedja-deep/70">{text}</p></div>;

const WeekCard = ({ week }: { week: (typeof AUTUMN_WEEKS)[number] }) => <details className="group overflow-hidden rounded-2xl border border-kedja-border bg-white" open={week.label === "Vecka 1"}>
  <summary className="cursor-pointer list-none p-4 hover:bg-kedja-paper/40">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{week.label} · {week.range}</p><h3 className="mt-1 text-lg font-black">{week.match.homeAway === "Hemma" ? "Gunnilse" : week.match.opponent}–{week.match.homeAway === "Hemma" ? week.match.opponent : "Gunnilse"}</h3><p className="mt-1 text-sm text-kedja-deep/70">{week.phase} · {formatDate(week.match.date)} {week.match.kickoff} · {week.match.venue}</p></div><CalendarDays className="h-5 w-5 text-primary" /></div>
  </summary>
  <div className="border-t border-kedja-border p-4">
<div className="space-y-5"><div className="grid gap-3 lg:grid-cols-2"><Brief label="Inför veckan · video" items={week.videoBefore} tone="primary" /><Brief label="Efter matchen" items={week.videoAfter} tone="muted" /></div><div className="grid gap-3 lg:grid-cols-3">{week.sessions.map((session) => <SessionPlanCard key={session.date} session={session} />)}</div></div>
  </div>
</details>;

const Brief = ({ label, items, tone }: { label: string; items: string[]; tone: "primary" | "muted" }) => <div className={`rounded-xl p-4 ${tone === "primary" ? "bg-primary/5" : "bg-kedja-paper/50"}`}><h4 className="text-xs font-black uppercase tracking-[0.16em] text-primary">{label}</h4><ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-kedja-deep/70">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;

const SessionCard = ({ session }: { session: (typeof AUTUMN_WEEKS)[number]["sessions"][number] }) => <div className="overflow-hidden rounded-xl border border-kedja-border bg-kedja-paper"><div className="border-b border-kedja-border bg-white p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{session.day} · {formatDate(session.date)}</p><h4 className="mt-1 font-bold leading-tight">{session.focus}</h4></div><span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">{session.intensity}</span></div><p className="mt-2 text-xs leading-relaxed text-kedja-deep/70">{session.objective}</p></div><ol className="divide-y divide-border">{session.timeline.map((block) => <li key={`${block.from}-${block.to}`} className="grid grid-cols-[42px_1fr] gap-2 p-2.5"><span className="pt-0.5 text-[10px] font-black tabular-nums text-primary">{block.from}–{block.to}</span><div><p className="text-xs font-bold">{block.title}</p><p className="mt-0.5 text-xs leading-relaxed text-kedja-deep/70">{block.instruction}</p><p className="mt-1 text-[10px] font-semibold text-kedja-deep/80">{block.owner}</p></div></li>)}</ol></div>;

const SessionPlanCard = ({ session }: { session: (typeof AUTUMN_WEEKS)[number]["sessions"][number] }) => {
  const moments = [session.plan.activation, session.plan.exerciseOne, session.plan.exerciseTwo, session.plan.game];
  const [selected, setSelected] = useState([0, 0, 0, 0]);

  return <div className="overflow-hidden rounded-xl border border-kedja-border bg-kedja-paper"><div className="border-b border-kedja-border bg-white p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{session.day} · {formatDate(session.date)}</p><h4 className="mt-1 font-bold leading-tight">{session.focus}</h4></div><span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">{session.intensity}</span></div><p className="mt-2 text-xs leading-relaxed text-kedja-deep/70">{session.objective}</p></div><div className="border-b border-kedja-border bg-primary/5 px-3 py-2"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">Enkel plan · fyra moment</p><p className="mt-1 text-xs text-kedja-deep/70">Välj ett färdigt alternativ per moment. Håll samma metodik hela passet.</p></div><ol className="divide-y divide-border">{moments.map((moment, momentIndex) => <li key={moment.title} className="p-3"><div className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">{momentIndex + 1}</span><div className="min-w-0 flex-1"><p className="text-xs font-bold">{moment.title}</p><p className="mt-0.5 text-[11px] leading-relaxed text-kedja-deep/70">{moment.purpose}</p><div className="mt-2 grid gap-1.5">{moment.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => setSelected((current) => current.map((value, index) => index === momentIndex ? optionIndex : value))} className={`min-h-11 rounded-lg border px-2.5 py-2 text-left text-[11px] leading-relaxed transition-colors ${selected[momentIndex] === optionIndex ? "border-primary bg-primary/10 font-semibold text-kedja-ink" : "border-kedja-border bg-kedja-paper text-kedja-deep/70 hover:bg-kedja-paper/50"}`} aria-pressed={selected[momentIndex] === optionIndex}><span className="mr-1 font-black text-primary">{String.fromCharCode(65 + optionIndex)}.</span>{option}</button>)}</div></div></div></li>)}</ol></div>;
};

export default CoachTrainingPlanning;
