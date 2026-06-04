import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { useSquad } from "@/hooks/useSquad";
import { POSITION_LABELS, groupSquadByPosition, type Position } from "@/data/squad";
import { Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const POSITION_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];

const Truppen = () => {
  const { players, staff, loading, usingFallback } = useSquad();
  const grouped = groupSquadByPosition(players);
  const totalPlayers = players.length;

  return (
    <>
      <PageHero
        eyebrow="Trupp"
        title="Herrtruppen 2026"
        description={`${totalPlayers} spelare i fyra positionsgrupper. Synkas dagligen från svenskalag.se — manuella ändringar görs i adminvyn.`}
      />

      <div className="container pb-section">
        {loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Hämtar truppen…
          </div>
        )}

        {usingFallback && !loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-ink">
            Visar sparad lista · väntar på dagens uppdatering
          </div>
        )}

        {/* Spelare per position */}
        <SectionReveal className="grid gap-6 lg:grid-cols-2">
          {POSITION_ORDER.map((pos) => {
            const list = grouped[pos];
            const labels = POSITION_LABELS[pos];
            return (
              <section
                key={pos}
                className="rounded-md border border-border/70 bg-card overflow-hidden"
              >
                <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-sm border border-accent/40 bg-accent/10 font-mono text-[10px] font-black tracking-wider text-accent">
                      {labels.short}
                    </span>
                    <h2 className="text-xl text-foreground">{labels.long}</h2>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {list.length} spelare
                  </span>
                </header>
                <ul className="divide-y divide-border/50">
                  {list.map((player) => (
                    <li
                      key={player.name}
                      className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 flex-shrink-0 place-items-center rounded-sm font-mono text-xs font-black",
                          player.jerseyNumber
                            ? "border border-accent/30 bg-accent/5 text-accent"
                            : "border border-border/70 text-muted-foreground"
                        )}
                      >
                        {player.jerseyNumber ?? "—"}
                      </span>
                      <span className="flex-1 text-sm font-bold tracking-tight text-foreground">
                        {player.name}
                      </span>
                      {player.birthYear && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          ’{String(player.birthYear).slice(2)}
                        </span>
                      )}
                    </li>
                  ))}
                  {list.length === 0 && (
                    <li className="px-5 py-6 text-center text-xs text-muted-foreground">
                      Inga spelare i den här gruppen ännu — truppen synkas dagligen från svenskalag.se.
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </SectionReveal>

        {/* Ledarstab */}
        <SectionReveal as="section" className="mt-10 rounded-md border border-border/70 bg-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Ledarstab
              </span>
              <h2 className="text-xl text-foreground">Tränare & ledning</h2>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {staff.length} personer
            </span>
          </header>
          <ul className="divide-y divide-border/50">
            {staff.map((member) => (
              <li
                key={member.name}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-sm font-bold tracking-tight text-foreground">{member.name}</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </SectionReveal>

        {/* Källa */}
        <a
          href="https://www.svenskalag.se/gunnilseis-herr/truppen"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground transition hover:text-accent"
        >
          Källa · svenskalag.se
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </>
  );
};

export default Truppen;
