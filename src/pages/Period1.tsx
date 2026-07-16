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
import {
  PERIOD_1,
  PERIOD_1_COACH_LANGUAGE,
  PERIOD_1_PRINCIPLES,
  PERIOD_1_REFERENCES,
  aggregateCommonErrors,
  aggregateKpis,
  totalSessions,
} from "@/data/period1";

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

const Period1 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("tab");
  const tab: TabValue = isTab(initial) ? initial : "kartan";
  const total = totalSessions(PERIOD_1);
  const errors = aggregateCommonErrors(PERIOD_1);
  const kpis = aggregateKpis(PERIOD_1);

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
          to="/#period-1"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-kedja-green transition hover:text-kedja-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till spelmodellen
        </Link>
      </div>

      <KedjaHero
        eyebrow={`Period 1 · ${PERIOD_1.dateRange}`}
        title="Diagonalt spel från korridor till korridor"
        lead="Vi flyttar bollen diagonalt från en korridor till en annan. Mål: attrahera press, hitta rättvänd spelare, attackera kanten, fyll boxen."
      />

      <article className="container py-12 md:py-16">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-card/35 p-1.5">
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
              kind="diagonal-pattern"
              label="Grundstruktur: MV → YB → MF → OM → YF"
            />
            <div className="rounded-xl border border-border bg-card/35 p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Periodens facts
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Aktiva veckor</dt>
                  <dd className="font-bold text-foreground">6</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Träningspass</dt>
                  <dd className="font-bold text-foreground">{total}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Pass per vecka</dt>
                  <dd className="font-bold text-foreground">3 · mån/ons/tor</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Uppföljning</dt>
                  <dd className="font-bold text-foreground">{PERIOD_1.followUp.dateRange}</dd>
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
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background/40 px-4 text-sm font-bold text-foreground transition hover:border-accent/45"
                >
                  Fördjupa dig i principerna
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Resan – sex veckor
            </p>
            <WeekJourney to="/period/1?tab=passen" />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Tema vecka för vecka
            </p>
            <PeriodTimeline />
          </div>
        </TabsContent>

        {/* PRINCIPEN — Nivå 2 förståelse */}
        <TabsContent value="principen" className="space-y-4">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tio koncept som hänger ihop. Varje princip har en mening en spelare förstår direkt —
            klicka <em>Visa princip</em> för tränarnivån och en grafik.
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {PERIOD_1_PRINCIPLES.map((principle, i) => (
              <PeriodPrincipleCard key={principle.slug} principle={principle} index={i} />
            ))}
          </div>
        </TabsContent>

        {/* RESAN — Nivå 2 6-veckors-resa */}
        <TabsContent value="resan" className="space-y-6">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Sex veckor med tema, lärandemål och KPI per vecka. Klicka <em>Öppna detalj</em> för
            passen.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERIOD_1.weeks.map((week) => (
              <li key={week.weekNumber}>
                <WeekCard week={week} anchorBase="/period/1?tab=passen#vecka" />
              </li>
            ))}
          </ol>
          <PeriodTimeline />
        </TabsContent>

        {/* PASSEN — Nivå 3 träningsdetaljer */}
        <TabsContent value="passen" className="space-y-10">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Alla {total} pass grupperade per vecka. Klicka på ett pass för att fälla ut full mall:
            syfte, övningar, cues, vanliga fel, KPI och grafik.
          </p>
          {PERIOD_1.weeks.map((week) => (
            <section key={week.weekNumber} id={`vecka-${week.weekNumber}`} className="scroll-mt-24">
              <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                    Vecka {week.weekNumber} · {week.dateRange}
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-normal text-foreground md:text-2xl">
                    {week.theme}
                  </h2>
                </div>
                <p className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent">
                  KPI · {week.kpi}
                </p>
              </header>
              <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {week.learningGoal}
              </p>
              <SessionAccordion week={week} />
            </section>
          ))}
        </TabsContent>

        {/* FÖRDJUPNING — Nivå 4 */}
        <TabsContent value="fordjupning" className="space-y-12">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-foreground md:text-3xl">
              <Target className="h-5 w-5 text-accent" />
              Effektlogik
            </h2>
            <EffectLogic blocks={PERIOD_1.effectLogic} />
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-foreground md:text-3xl">
              <Sparkles className="h-5 w-5 text-accent" />
              Inspirationskort
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
              Vi kopierar inte — vi anpassar. Tre lag som inspirerat principerna.
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              {PERIOD_1_REFERENCES.map((ref) => (
                <ReferenceCard key={ref.team} reference={ref} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-black tracking-normal text-foreground md:text-3xl">
              <MessageSquareQuote className="h-5 w-5 text-accent" />
              Tränarens språk
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {PERIOD_1_COACH_LANGUAGE.map((cue) => (
                <li
                  key={cue}
                  className="rounded-lg border border-border bg-card/35 px-3 py-2 text-sm font-semibold text-foreground/85"
                >
                  <span className="mr-1 text-accent">›</span>
                  {cue}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-black tracking-normal text-foreground">
                <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                Vanliga fel (samlat)
              </h2>
              <ul className="space-y-1.5 rounded-xl border border-border bg-card/35 p-4 text-sm text-muted-foreground">
                {errors.map((e) => (
                  <li key={e} className="flex items-baseline gap-2">
                    <span className="text-destructive">•</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-black tracking-normal text-foreground">
                <Gauge className="h-4.5 w-4.5 text-accent" />
                KPI vecka för vecka
              </h2>
              <ol className="space-y-2 rounded-xl border border-border bg-card/35 p-4 text-sm">
                {kpis.map((k) => (
                  <li key={k.week} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                      V{k.week}
                    </span>
                    <span className="text-foreground/85">{k.kpi}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card/35 p-6">
            <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
              {PERIOD_1.followUp.dateRange}
            </p>
            <h2 className="text-2xl font-black tracking-normal text-foreground">
              {PERIOD_1.followUp.title}
            </h2>
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
        </TabsContent>
      </Tabs>
      </article>
    </div>
  );
};

export default Period1;
