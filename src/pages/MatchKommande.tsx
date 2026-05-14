import PageHero from "@/components/PageHero";
import StaticMatchHeader from "@/components/match/StaticMatchHeader";
import Matchplan from "@/components/match/Matchplan";
import Formation from "@/components/match/Formation";
import PresentationBrief from "@/components/match/PresentationBrief";
import MatchdayCommandPanel from "@/components/match/MatchdayCommandPanel";
import HalftimeAdjustmentPanel from "@/components/match/HalftimeAdjustmentPanel";
import { COHERENCE, FOCUS } from "@/data/matchplan";

const MatchKommande = () => (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title="Kareby — fre 8 maj"
      description="Borta · Kareby Hed · 19:00. Femte raka utan förlust (4V 1O, 11/15) — vi vill hem med tre poäng till."
    />

    <div className="container pb-section space-y-6">
      <section className="rounded-xl border border-accent/40 bg-accent/[0.04] p-5 md:p-6">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent mb-3">
          Inför Kareby · 10 min genomgång
        </div>
        <ol className="space-y-2 text-sm md:text-base text-foreground/90">
          <li className="flex items-start gap-3">
            <span className="font-mono font-black text-accent">01</span>
            <span>
              Läs förra matchen kort —{" "}
              <a href="/match/forra" className="underline hover:text-accent">
                Velebit 1–0
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
              Tre fokuspunkter i sidospalten — det är vad vi gör annorlunda denna vecka.
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
      </section>

      <StaticMatchHeader />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_320px] items-start">
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
              <span className="text-sm font-extrabold">4-2-1-3</span>
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
      </div>

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
    </div>
   </>
  );

export default MatchKommande;
