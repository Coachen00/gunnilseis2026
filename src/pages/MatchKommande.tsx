import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import StaticMatchHeader from "@/components/match/StaticMatchHeader";
import Matchplan from "@/components/match/Matchplan";
import Formation from "@/components/match/Formation";
import PresentationBrief from "@/components/match/PresentationBrief";
import MatchdayCommandPanel from "@/components/match/MatchdayCommandPanel";
import HalftimeAdjustmentPanel from "@/components/match/HalftimeAdjustmentPanel";
import { CALLED_SQUAD, COHERENCE, FOCUS, MATCH_META } from "@/data/matchplan";

const MatchKommande = () => (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title={`${MATCH_META.opponent} — hemma`}
      description={`${MATCH_META.venue} · ${MATCH_META.kickoff}. Kallad trupp och startelva är uppdaterad.`}
    />

    <div className="container pb-section space-y-6">
      <SectionReveal as="section" className="rounded-xl border border-accent/40 bg-accent/[0.04] p-5 md:p-6">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent mb-3">
          Inför {MATCH_META.opponent} · 10 min genomgång
        </div>
        <ol className="space-y-2 text-sm md:text-base text-foreground/90">
          <li className="flex items-start gap-3">
            <span className="font-mono font-black text-accent">01</span>
            <span>
              Läs senaste reflektionen kort —{" "}
              <a href="/match/forra" className="underline hover:text-accent">
                /match/forra
              </a>
              . Vad tar vi med, vad tar vi tag i.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-mono font-black text-accent">02</span>
            <span>
              Skanna de fem anfallsprinciperna —{" "}
              <a href="/anfall" className="underline hover:text-accent">
                /anfall
              </a>
              . Speciellt princip 1 (skydda kontring), 2/3 (in/ut) och 5 (fylla på box).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-mono font-black text-accent">03</span>
            <span>
              Tre fokuspunkter i sidospalten — det är vad vi trycker på från start.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-mono font-black text-accent">04</span>
            <span>
              Kolla{" "}
              <a href="/motstandaranalys" className="underline hover:text-accent">
                motståndaranalysen
              </a>{" "}
              — formation, hot, var vi pressar.
            </span>
          </li>
        </ol>
      </SectionReveal>

      <SectionReveal>
        <StaticMatchHeader />
      </SectionReveal>

      <SectionReveal className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_320px] items-start">
        {/* Huvudkolumn — matchplanen */}
        <div>
          <Matchplan />
        </div>

        {/* Sidofält — sticky */}
        <aside className="lg:sticky lg:top-20 space-y-4">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-baseline gap-3 border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Start-11
              </span>
              <span className="text-sm font-extrabold">4-2-3-1</span>
            </div>
            <div className="p-4">
              <Formation height={340} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-baseline gap-3 border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                03 fokus
              </span>
              <span className="text-sm font-extrabold">Veckans fokuspunkter</span>
            </div>
            <div className="space-y-2.5 p-4">
              {FOCUS.map((f, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[28px_1fr] items-start gap-3"
                >
                  <div className="grid h-6 w-6 place-items-center rounded-md bg-accent text-xs font-black text-background">
                    {i + 1}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-baseline gap-3 border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Kallade
              </span>
              <span className="text-sm font-extrabold">{CALLED_SQUAD.starting.length + CALLED_SQUAD.bench.length} spelare</span>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Startelva
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CALLED_SQUAD.starting.map((name) => (
                    <span key={name} className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-xs font-bold text-foreground">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Avbytare
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CALLED_SQUAD.bench.map((name) => (
                    <span key={name} className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground/85">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-baseline gap-3 border-b border-border px-4 py-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Genvägar
              </span>
            </div>
            <nav className="p-3 text-xs">
              {COHERENCE.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex gap-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="font-mono text-accent">{s.num}</span>
                  <span>{s.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </SectionReveal>

      <SectionReveal>
      <details className="rounded-lg border border-border bg-card">
        <summary className="cursor-pointer px-5 py-4 text-sm font-black uppercase tracking-wide text-foreground">
          Ledarpanel
        </summary>
        <div className="space-y-5 border-t border-border p-5">
          <MatchdayCommandPanel />
          <HalftimeAdjustmentPanel />
          <PresentationBrief />
        </div>
      </details>
      </SectionReveal>
    </div>
   </>
  );

export default MatchKommande;
