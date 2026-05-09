import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Lock,
  Shield,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import PhaseFlow from "@/components/PhaseFlow";
import EffectLogic from "@/components/period/EffectLogicBlock";
import { PeriodGraphic } from "@/components/period/PeriodGraphics";
import PeriodTimeline from "@/components/period/PeriodTimeline";
import WeekCard from "@/components/period/WeekCard";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { PERIOD_1, PERIOD_1_COACH_LANGUAGE, totalSessions } from "@/data/period1";
import { useContent } from "@/hooks/useContent";

const primaryLinks = [
  { to: "/spelide", label: "Spelidé", text: "Principerna i rätt ordning.", icon: Sparkles },
  { to: "/match/kommande", label: "Veckans match", text: "Fokus och matchplan.", icon: ClipboardList },
  { to: "/truppen", label: "Trupp", text: "Spelare och roller.", icon: Users },
  { to: "/verktyg", label: "Verktyg", text: "Plan, analys och tavla.", icon: Wrench },
];

const Hem = () => {
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);

  return (
    <>
      <section className="relative min-h-[76vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/72 to-background" />

        <div className="container relative flex min-h-[76vh] items-center py-20">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gunnilse-gold">
              <Shield className="h-5 w-5" strokeWidth={1.5} />
              Gunnilse IS 2026
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-foreground md:text-7xl">
              Spelmodell 2026
            </h1>
            <p className="mt-6 max-w-xl text-base font-semibold leading-relaxed text-foreground/82 md:text-lg">
              Vinn kampen. Spela framåt. Skydda mitten.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              En kort gemensam modell för hur vi anfaller, försvarar och ställer om.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Logga in <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/match/matcher"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background/45 px-5 text-sm font-bold text-foreground transition hover:border-accent/45"
              >
                Se matcher
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/35">
        <div className="container grid gap-0 md:grid-cols-4">
          {primaryLinks.map(({ to, label, text, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group border-b border-border py-6 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="flex items-start gap-3 md:block">
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent md:mb-4 md:mt-0" strokeWidth={1.75} />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wide text-foreground">{label}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent opacity-80 transition group-hover:gap-2.5 group-hover:opacity-100">
                    Öppna <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)]">
          <header>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Identitet</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Fem beteenden vi alltid återvänder till.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Kort nog att komma ihåg under match. Tydligt nog att följa upp efteråt.
            </p>
          </header>

          <ol className="divide-y divide-border border-y border-border">
            {identity.map((item, index) => (
              <li key={item.slug}>
                <Link
                  to={`/identitet/${item.slug}`}
                  className="group grid gap-4 py-5 transition hover:bg-card/35 md:grid-cols-[64px_220px_1fr_28px]"
                >
                  <span className="font-mono text-xs font-black text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-black leading-snug tracking-normal text-foreground">{item.title}</span>
                  <span className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.short}</span>
                  <ArrowRight className="hidden h-4 w-4 self-center text-accent transition group-hover:translate-x-1 md:block" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-20">
        <div className="container grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)]">
          <header>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Fyra skeden</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Samma struktur i varje match.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Vi byter beteende när bollinnehavet byter ägare.
            </p>
          </header>
          <PhaseFlow />
        </div>
      </section>

      <section id="period-1" className="container scroll-mt-20 py-20">
        <header className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              <CalendarDays className="h-3.5 w-3.5" />
              Period 1 – {PERIOD_1.dateRange}
            </p>
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Diagonalt spel från korridor till korridor.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {PERIOD_1.objective}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={PERIOD_1.detailRoute}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-black text-accent-foreground transition hover:bg-accent/90"
              >
                Öppna detaljplanering för alla {totalSessions(PERIOD_1)} pass
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <PeriodGraphic kind="diagonal-pattern" label="MV → YB → MF → OM → YF" />
        </header>

        <div className="mb-10">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Sex veckor
          </p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERIOD_1.weeks.map((week) => (
              <li key={week.weekNumber}>
                <WeekCard week={week} />
              </li>
            ))}
          </ol>
        </div>

        <div className="mb-10">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Progression
          </p>
          <PeriodTimeline />
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Effektlogik
            </p>
            <EffectLogic blocks={PERIOD_1.effectLogic} />
          </div>
          <div className="rounded-xl border border-border bg-card/35 p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              Tränarens språk
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm font-semibold text-foreground/85">
              {PERIOD_1_COACH_LANGUAGE.map((cue) => (
                <li key={cue} className="flex items-baseline gap-2">
                  <span className="text-accent">›</span>
                  {cue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              <Lock className="h-3.5 w-3.5" />
              För laget
            </p>
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Detaljer, matchplan och tränarverktyg finns bakom inloggning.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/spelmodell-labb"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-black text-background transition hover:bg-accent/90"
            >
              Öppna labbet <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login?mode=signup"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-bold text-foreground transition hover:border-accent/45"
            >
              Begär tillgång
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hem;
