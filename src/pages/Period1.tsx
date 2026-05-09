import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ListChecks, Target } from "lucide-react";
import EffectLogic from "@/components/period/EffectLogicBlock";
import { PeriodGraphic } from "@/components/period/PeriodGraphics";
import PeriodTimeline from "@/components/period/PeriodTimeline";
import SessionCard from "@/components/period/SessionCard";
import { PERIOD_1, PERIOD_1_COACH_LANGUAGE, totalSessions } from "@/data/period1";

const Period1 = () => {
  const total = totalSessions(PERIOD_1);
  return (
    <article className="container py-12 md:py-16">
      <Link
        to="/#period-1"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till spelmodellen
      </Link>

      <header className="mb-10">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-accent">
          <CalendarDays className="h-3.5 w-3.5" />
          Period 1 · {PERIOD_1.dateRange}
        </p>
        <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-normal text-foreground md:text-5xl">
          {PERIOD_1.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {PERIOD_1.objective}
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
          <span className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-accent">
            6 veckor
          </span>
          <span className="rounded-md border border-border bg-card/40 px-3 py-1.5 text-muted-foreground">
            {total} träningspass
          </span>
          <span className="rounded-md border border-border bg-card/40 px-3 py-1.5 text-muted-foreground">
            3 pass/vecka · mån/ons/tor
          </span>
        </div>
      </header>

      <section className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <PeriodGraphic kind="diagonal-pattern" label="Diagonal grundstruktur: MV → YB → MF → OM → YF" />
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-accent">
            <BookOpen className="h-3.5 w-3.5" /> Tränarens språk
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-semibold text-foreground/85">
            {PERIOD_1_COACH_LANGUAGE.map((cue) => (
              <li key={cue} className="flex items-baseline gap-2">
                <span className="text-accent">›</span>
                {cue}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-foreground md:text-3xl">
          <Target className="h-5 w-5 text-accent" />
          Effektlogik
        </h2>
        <EffectLogic blocks={PERIOD_1.effectLogic} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-foreground md:text-3xl">
          <ListChecks className="h-5 w-5 text-accent" />
          Progression vecka för vecka
        </h2>
        <PeriodTimeline />
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-black tracking-normal text-foreground md:text-3xl">
          Detaljplanering · {total} pass
        </h2>
        <div className="space-y-12">
          {PERIOD_1.weeks.map((week) => (
            <div key={week.weekNumber} id={`vecka-${week.weekNumber}`} className="scroll-mt-20">
              <div className="mb-5 grid gap-4 rounded-xl border border-border bg-card/30 p-5 lg:grid-cols-[1fr_minmax(0,260px)]">
                <div>
                  <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                    Vecka {week.weekNumber} · {week.dateRange}
                  </p>
                  <h3 className="text-2xl font-black tracking-normal text-foreground">{week.theme}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{week.learningGoal}</p>
                  <p className="mt-3 inline-block rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    Veckans KPI · {week.kpi}
                  </p>
                </div>
                <PeriodGraphic kind={week.graphic} />
              </div>
              <div className="space-y-5">
                {week.sessions.map((session) => (
                  <SessionCard key={`${week.weekNumber}-${session.day}`} session={session} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-border bg-card/35 p-6">
        <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
          {PERIOD_1.followUp.dateRange}
        </p>
        <h2 className="text-2xl font-black tracking-normal text-foreground">{PERIOD_1.followUp.title}</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
              Reflektion
            </h3>
            <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/85">
              {PERIOD_1.followUp.bullets.map((b) => (
                <li key={b} className="flex items-baseline gap-2">
                  <span className="text-accent">›</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
              Självskattning · spelare
            </h3>
            <ol className="space-y-1.5 text-sm leading-relaxed text-foreground/85">
              {PERIOD_1.followUp.selfRating.map((r, i) => (
                <li key={r} className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="mt-12 flex justify-center">
        <Link
          to="/#period-1"
          className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card/40 px-5 text-sm font-bold text-foreground transition hover:border-accent/45"
        >
          Tillbaka till grovplaneringen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

export default Period1;
