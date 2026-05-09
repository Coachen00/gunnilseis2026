import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Layers,
  Lightbulb,
  ListChecks,
  Map as MapIcon,
  PlayCircle,
  Shield,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
} from "lucide-react";
import DeepDiveCard, { type DeepDive } from "@/components/period/DeepDiveCard";
import EffectLogic from "@/components/period/EffectLogicBlock";
import HuvudprincipCard, { type Huvudprincip } from "@/components/period/HuvudprincipCard";
import MetricStrip from "@/components/period/MetricStrip";
import { PeriodGraphic } from "@/components/period/PeriodGraphics";
import ReferenceCard from "@/components/period/ReferenceCard";
import WeekJourney from "@/components/period/WeekJourney";
import { PERIOD_1, PERIOD_1_REFERENCES, totalSessions } from "@/data/period1";

const HUVUDPRINCIPER: Huvudprincip[] = [
  {
    number: 1,
    title: "Bygg upp",
    text: "Målvakt, mittbackar, ytterback och sexa skapar första vinklarna.",
    to: "/period/1?tab=principen#diagonalt-spel",
    Icon: Compass,
  },
  {
    number: 2,
    title: "Bryt press",
    text: "Vi lockar press, spelar genom och hittar rättvänd spelare.",
    to: "/period/1?tab=principen#attrahera-press",
    Icon: TrendingUp,
  },
  {
    number: 3,
    title: "Byt korridor",
    text: "Vi flyttar bollen från en sida till en annan när motståndaren har flyttat sig.",
    to: "/period/1?tab=principen#spelvandning",
    Icon: ListChecks,
  },
  {
    number: 4,
    title: "Attackera",
    text: "Vi skapar 1v1 eller 2v2 på kanten, tar oss in i assistytan och fyller boxen.",
    to: "/period/1?tab=principen#assistyta",
    Icon: Swords,
  },
  {
    number: 5,
    title: "Säkra",
    text: "Vi håller spelare bakom bollen och återerövrar direkt efter tapp.",
    to: "/period/1?tab=principen#restforsvar",
    Icon: Shield,
  },
];

const FORDJUPNING: DeepDive[] = [
  { title: "Principbibliotek", to: "/period/1?tab=principen", Icon: Compass, hint: "10 koncept som hänger ihop" },
  { title: "Alla 18 träningspass", to: "/period/1?tab=passen", Icon: Layers, hint: "Per vecka, fällbara" },
  { title: "Taktiktavlor", to: "/verktyg", Icon: MapIcon, hint: "Interaktiva kartor" },
  { title: "Coaching cues", to: "/period/1?tab=fordjupning", Icon: Lightbulb, hint: "Tränarens språk" },
  { title: "Vanliga fel", to: "/period/1?tab=fordjupning", Icon: BookOpen, hint: "Samlat per pass" },
  { title: "KPI:er", to: "/period/1?tab=fordjupning", Icon: Target, hint: "Vecka för vecka" },
  { title: "Restförsvar", to: "/period/1?tab=principen#restforsvar", Icon: Shield, hint: "Säkerhet bakom bollen" },
  { title: "Återerövring", to: "/period/1?tab=principen#atererövring", Icon: TrendingUp, hint: "6-sek-regeln" },
  { title: "Video & uppföljning 22/6–1/7", to: "/period/1?tab=fordjupning", Icon: PlayCircle, hint: "Reflektion + självskattning" },
];

const Start = () => {
  const total = totalSessions(PERIOD_1);
  return (
    <>
      {/* HERO – Lagets karta */}
      <section className="relative overflow-hidden border-b border-border bg-pitch-dark/30">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" aria-hidden />
        <div className="container relative grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-accent">
              <MapIcon className="h-3.5 w-3.5" />
              Lagets karta
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-normal text-foreground md:text-5xl lg:text-6xl">
              Lagets karta för hur vi anfaller.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/85 md:text-lg">
              Vi flyttar bollen diagonalt från en korridor till en annan för att locka press, hitta
              rättvänd spelare och attackera med fart.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/period/1"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-black text-accent-foreground transition hover:bg-accent/90"
              >
                Se Period 1 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/period/1?tab=passen"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background/40 px-5 text-sm font-bold text-foreground transition hover:border-accent/45"
              >
                Öppna detaljplaneringen
              </Link>
            </div>
          </div>
          <PeriodGraphic kind="diagonal-pattern" label="MV → YB → MF → OM → YF" />
        </div>
      </section>

      {/* SPELIDÉN */}
      <section className="container py-20">
        <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)]">
          <header>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Spelidén</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Från korridor till korridor.
            </h2>
            <Link
              to="/spelide"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
            >
              Läs hela spelidén <ArrowRight className="h-4 w-4" />
            </Link>
          </header>
          <div>
            <p className="text-base leading-relaxed text-foreground/85 md:text-lg">
              Vi vill spela med tålamod, locka motståndaren till en sida och sedan hitta nästa fria
              yta. När vi bryter pressen attackerar vi yttre korridor, assistyta och box.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Fem korridorer.",
                "Rättvänd spelare.",
                "Tredje man.",
                "Restförsvar.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-2 rounded-md border border-border bg-card/30 px-3 py-2 text-sm font-semibold text-foreground/85"
                >
                  <span className="text-accent">›</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* HUVUDPRINCIPER */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="container">
          <header className="mb-8 max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              Huvudprinciper
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Fem steg vi alltid följer.
            </h2>
          </header>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {HUVUDPRINCIPER.map((principle) => (
              <li key={principle.number}>
                <HuvudprincipCard principle={principle} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PERIOD 1 */}
      <section id="period" className="container scroll-mt-20 py-20">
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Period 1 – {PERIOD_1.dateRange}
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
            Diagonalt spel från korridor till korridor.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Sex veckor, {total} pass, ett tema per vecka.
          </p>
        </header>
        <WeekJourney to="/period/1?tab=passen" />
        <div className="mt-8">
          <Link
            to="/period/1?tab=passen"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-black text-accent-foreground transition hover:bg-accent/90"
          >
            Öppna alla {total} pass <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* NYCKELTAL + EFFEKTLOGIK */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="container space-y-12">
          <div>
            <header className="mb-6 max-w-2xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                Nyckeltal
              </p>
              <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
                Periodens skala på ett ögonkast.
              </h2>
            </header>
            <MetricStrip />
          </div>
          <div>
            <header className="mb-6 max-w-2xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                Effektlogik
              </p>
              <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
                Resurser → Aktiviteter → Mål → Effekt.
              </h2>
            </header>
            <EffectLogic blocks={PERIOD_1.effectLogic} />
          </div>
        </div>
      </section>

      {/* INSPIRATION */}
      <section className="container py-20">
        <header className="mb-8 max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Inspiration
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
            Vi kopierar inte. Vi inspireras av principer.
          </h2>
        </header>
        <div className="grid gap-4 lg:grid-cols-3">
          {PERIOD_1_REFERENCES.map((ref) => (
            <ReferenceCard key={ref.team} reference={ref} />
          ))}
        </div>
      </section>

      {/* FÖRDJUPNING */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="container">
          <header className="mb-8 max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              <BookOpen className="h-3.5 w-3.5" />
              Fördjupning
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-normal md:text-4xl">
              Allt detaljerat innehåll, ett klick bort.
            </h2>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORDJUPNING.map((item) => (
              <li key={item.title}>
                <DeepDiveCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Start;
