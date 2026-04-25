import { Printer } from "lucide-react";
import PageHero from "@/components/PageHero";
import MatchHeader from "@/components/match/MatchHeader";
import MatchPicker from "@/components/match/MatchPicker";
import Matchplan from "@/components/match/Matchplan";
import Formation from "@/components/match/Formation";
import LoadFromPreviousButton from "@/components/match/LoadFromPreviousButton";
import { useMatch } from "@/hooks/useMatch";
import { COHERENCE, FOCUS } from "@/data/matchplan";

const MatchKommande = () => {
  const { match } = useMatch("upcoming");

  return (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title="Veckans match"
      description="Motståndare, matchplan och fokus — allt på ett ställe. Sparas automatiskt."
    />

    <div className="container pb-24 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex-1">
          <MatchPicker status="upcoming" currentMatchId={match?.id} />
        </div>
        <div className="flex sm:items-end">
          <LoadFromPreviousButton match={match} />
        </div>
      </div>
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
              <span className="text-sm font-extrabold">4-3-3</span>
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
                Verktyg
              </span>
            </div>
            <div className="p-3">
              <a
                href="/matchblad"
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-semibold hover:border-accent/40 hover:bg-accent/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Printer className="h-3.5 w-3.5" />
                  Skriv ut matchplan
                </span>
                <span className="text-muted-foreground">↗</span>
              </a>
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
};

export default MatchKommande;
