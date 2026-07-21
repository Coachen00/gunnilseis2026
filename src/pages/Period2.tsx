// ponytail: medveten kopia av Period1.tsx — parametrisera till PeriodPage först när period 3 finns.
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Gauge,
  Layers,
  ListChecks,
  Map,
  MessageSquareQuote,
  Sparkles,
  Target,
} from "lucide-react";
import KedjaHero from "@/components/kedja/KedjaHero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EffectLogic from "@/components/period/EffectLogicBlock";
import { PeriodGraphic } from "@/components/period/PeriodGraphics";
import PeriodPrincipleCard from "@/components/period/PeriodPrincipleCard";
import PeriodTimeline from "@/components/period/PeriodTimeline";
import ReferenceCard from "@/components/period/ReferenceCard";
import SessionAccordion from "@/components/period/SessionAccordion";
import WeekCard from "@/components/period/WeekCard";
import WeekJourney from "@/components/period/WeekJourney";
import { aggregateCommonErrors, aggregateKpis, totalSessions } from "@/data/period1";
import {
  PERIOD_2,
  PERIOD_2_COACH_LANGUAGE,
  PERIOD_2_PRINCIPLES,
  PERIOD_2_REFERENCES,
  PERIOD_2_TIMELINE,
} from "@/data/period2";

const TABS = [
  { value: "kartan", label: "Kartan", Icon: Map },
  { value: "principen", label: "Principen", Icon: Compass },
  { value: "resan", label: "Resan", Icon: ListChecks },
  { value: "passen", label: "Passen", Icon: Layers },
  { value: "fordjupning", label: "Fördjupning", Icon: BookOpen },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const isTab = (s: string | null): s is TabValue =>
  TABS.some((t) => t.value === s);

const Period2 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("tab");
  const tab: TabValue = isTab(initial) ? initial : "kartan";
  const total = totalSessions(PERIOD_2);
  const errors = aggregateCommonErrors(PERIOD_2);
  const kpis = aggregateKpis(PERIOD_2);

  const handleTabChange = (value: string) => {
    if (!isTab(value)) return;
    const next = new URLSearchParams(searchParams);
    if (value === "kartan") next.delete("tab");
    else next.set("tab", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="bg-kedja-paper">
      <div className="container pt-8">
        <Link
          to="/#period-2"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-kedja-green transition hover:text-kedja-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till spelmodellen
        </Link>
      </div>

      <KedjaHero
        eyebrow={`Period 2 · ${PERIOD_2.dateRange}`}
        title="Vinna bollen och slå till"
        lead="Vi vinner bollen på våra villkor och slår till innan motståndaren är organiserad. Mål: press på utlösare, återerövra direkt, spela framåt först, säkra bakom bollen."
      />

      <article className="container py-12 md:py-16">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-white/35 p-1.5">
          {TABS.map(({ value, label, Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* KARTAN — Nivå 1 översikt */}
        <TabsContent value="kartan" className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <PeriodGraphic
              kind="pitch"
              label="Grundstruktur: Press → Återerövring → Omställning → Säkring"
            />
            <div className="rounded-xl border border-kedja-border bg-white/35 p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-kedja-deep/70">
                Periodens facts
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-kedja-deep/70">Aktiva veckor</dt>
                  <dd className="font-bold text-kedja-ink">6</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-kedja-deep/70">Träningspass</dt>
                  <dd className="font-bold text-kedja-ink">{total}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-kedja-deep/70">Pass per vecka</dt>
                  <dd className="font-bold text-kedja-ink">3 · mån/ons/tor</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-kedja-deep/70">Uppföljning</dt>
                  <dd className="font-bold text-kedja-ink">{PERIOD_2.followUp.dateRange}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("passen")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-black text-accent-foreground transition hover:bg-accent/90"
                >
                  Öppna detaljplaneringen <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("principen")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-kedja-border bg-kedja-paper/40 px-4 text-sm font-bold text-kedja-ink transition hover:border-kedja-green/45"
                >
                  Fördjupa dig i principerna
                </button>
                <Link
                  to="/period/1"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-kedja-border bg-kedja-paper/40 px-4 text-sm font-bold text-kedja-ink transition hover:border-kedja-green/45"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Period 1 – Diagonalt spel
                </Link>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-kedja-deep/70">
              Resan – sex veckor
            </p>
            <WeekJourney period={PERIOD_2} to="/period/2?tab=passen" />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-kedja-deep/70">
              Tema vecka för vecka
            </p>
            <PeriodTimeline timeline={PERIOD_2_TIMELINE} />
          </div>
        </TabsContent>

        {/* PRINCIPEN — Nivå 2 förståelse */}
        <TabsContent value="principen" className="space-y-4">
          <p className="max-w-2xl text-sm leading-relaxed text-kedja-deep/70">
            Åtta koncept för press och omställning. Varje princip har en mening en spelare förstår direkt —
            klicka <em>Visa princip</em> för tränarnivån och en grafik.
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {PERIOD_2_PRINCIPLES.map((principle, i) => (
              <PeriodPrincipleCard key={principle.slug} principle={principle} index={i} />
            ))}
          </div>
        </TabsContent>

        {/* RESAN — Nivå 2 6-veckors-resa */}
        <TabsContent value="resan" className="space-y-6">
          <p className="max-w-2xl text-sm leading-relaxed text-kedja-deep/70">
            Sex veckor med tema, lärandemål och KPI per vecka. Klicka <em>Öppna detalj</em> för
            passen.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERIOD_2.weeks.map((week) => (
              <li key={week.weekNumber}>
                <WeekCard week={week} anchorBase="/period/2?tab=passen#vecka" />
              </li>
            ))}
          </ol>
          <PeriodTimeline timeline={PERIOD_2_TIMELINE} />
        </TabsContent>

        {/* PASSEN — Nivå 3 träningsdetaljer */}
        <TabsContent value="passen" className="space-y-10">
          <p className="max-w-2xl text-sm leading-relaxed text-kedja-deep/70">
            Alla {total} pass grupperade per vecka. Klicka på ett pass för att fälla ut full mall:
            syfte, övningar, cues, vanliga fel, KPI och grafik.
          </p>
          {PERIOD_2.weeks.map((week) => (
            <section key={week.weekNumber} id={`vecka-${week.weekNumber}`} className="scroll-mt-24">
              <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-kedja-border pb-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-green">
                    Vecka {week.weekNumber} · {week.dateRange}
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-normal text-kedja-ink md:text-2xl">
                    {week.theme}
                  </h2>
                </div>
                <p className="rounded-md border border-kedja-green/30 bg-kedja-green/10 px-3 py-1.5 text-[11px] font-semibold text-kedja-green">
                  KPI · {week.kpi}
                </p>
              </header>
              <p className="mb-4 max-w-3xl text-sm leading-relaxed text-kedja-deep/70">
                {week.learningGoal}
              </p>
              <SessionAccordion week={week} />
            </section>
          ))}
        </TabsContent>

        {/* FÖRDJUPNING — Nivå 4 */}
        <TabsContent value="fordjupning" className="space-y-12">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-kedja-ink md:text-3xl">
              <Target className="h-5 w-5 text-kedja-green" />
              Effektlogik
            </h2>
            <EffectLogic blocks={PERIOD_2.effectLogic} />
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-kedja-ink md:text-3xl">
              <Sparkles className="h-5 w-5 text-kedja-green" />
              Inspirationskort
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-kedja-deep/70">
              Vi kopierar inte — vi anpassar. Tre lag som inspirerat principerna.
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              {PERIOD_2_REFERENCES.map((ref) => (
                <ReferenceCard key={ref.team} reference={ref} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-kedja-ink md:text-3xl">
              <MessageSquareQuote className="h-5 w-5 text-kedja-green" />
              Tränarens språk
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {PERIOD_2_COACH_LANGUAGE.map((cue) => (
                <li
                  key={cue}
                  className="rounded-lg border border-kedja-border bg-white/35 px-3 py-2 text-sm font-semibold text-kedja-ink/85"
                >
                  <span className="mr-1 text-kedja-green">›</span>
                  {cue}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-black tracking-normal text-kedja-ink">
                <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                Vanliga fel (samlat)
              </h2>
              <ul className="space-y-1.5 rounded-xl border border-kedja-border bg-white/35 p-4 text-sm text-kedja-deep/70">
                {errors.map((e) => (
                  <li key={e} className="flex items-baseline gap-2">
                    <span className="text-destructive">•</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-black tracking-normal text-kedja-ink">
                <Gauge className="h-4.5 w-4.5 text-kedja-green" />
                KPI vecka för vecka
              </h2>
              <ol className="space-y-2 rounded-xl border border-kedja-border bg-white/35 p-4 text-sm">
                {kpis.map((k) => (
                  <li key={k.week} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-green">
                      V{k.week}
                    </span>
                    <span className="text-kedja-ink/85">{k.kpi}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="rounded-xl border border-kedja-border bg-white/35 p-6">
            <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-green">
              {PERIOD_2.followUp.dateRange}
            </p>
            <h2 className="text-2xl font-black tracking-normal text-kedja-ink">
              {PERIOD_2.followUp.title}
            </h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-kedja-deep/70">
                  Reflektion
                </h3>
                <ul className="space-y-1.5 text-sm leading-relaxed text-kedja-ink/85">
                  {PERIOD_2.followUp.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-2">
                      <span className="text-kedja-green">›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-kedja-deep/70">
                  Självskattning · spelare
                </h3>
                <ol className="space-y-1.5 text-sm leading-relaxed text-kedja-ink/85">
                  {PERIOD_2.followUp.selfRating.map((r, i) => (
                    <li key={r} className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-kedja-deep/70">{i + 1}.</span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
      </article>
    </div>
  );
};

export default Period2;
