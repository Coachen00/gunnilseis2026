import PageHero from "@/components/PageHero";
import MatchHeader from "@/components/match/MatchHeader";
import Matchplan from "@/components/match/Matchplan";
import Formation from "@/components/match/Formation";
import { COHERENCE, FOCUS } from "@/data/matchplan";

const MatchKommande = () => (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title="Veckans match"
      description="Motståndare, matchplan och fokus — allt på ett ställe. Sparas automatiskt."
    />

    <div className="container pb-24 space-y-6">
      <MatchHeader status="upcoming" />

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
    </div>
   </>
  );

export default MatchKommande;
