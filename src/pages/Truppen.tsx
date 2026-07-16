import KedjaHero from "@/components/kedja/KedjaHero";
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
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Trupp"
        title="Herrtruppen 2026"
        lead={`${totalPlayers} spelare i fyra positionsgrupper. Synkas dagligen från svenskalag.se — manuella ändringar görs i adminvyn.`}
      />

      <div className="container pb-section">
        {loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-kedja-border bg-white px-3 py-1.5 text-xs text-kedja-deep/70">
            <Loader2 className="h-3 w-3 animate-spin" /> Hämtar truppen…
          </div>
        )}

        {usingFallback && !loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-kedja-green/30 bg-kedja-green/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kedja-green">
            Fallback-data · väntar på första syncen
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
                className="rounded-md border border-kedja-border/70 bg-white overflow-hidden"
              >
                <header className="flex items-center justify-between border-b border-kedja-border/60 px-5 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-sm border border-kedja-green/40 bg-kedja-green/10 font-mono text-[10px] font-black tracking-wider text-kedja-green">
                      {labels.short}
                    </span>
                    <h2 className="text-xl text-kedja-ink">{labels.long}</h2>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-kedja-deep/70">
                    {list.length} spelare
                  </span>
                </header>
                <ul className="divide-y divide-kedja-border/50">
                  {list.map((player) => (
                    <li
                      key={player.name}
                      className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-kedja-paper"
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 flex-shrink-0 place-items-center rounded-sm font-mono text-xs font-black",
                          player.jerseyNumber
                            ? "border border-kedja-green/30 bg-kedja-green/5 text-kedja-green"
                            : "border border-kedja-border/70 text-kedja-deep/70"
                        )}
                      >
                        {player.jerseyNumber ?? "—"}
                      </span>
                      <span className="flex-1 text-sm font-bold tracking-tight text-kedja-ink">
                        {player.name}
                      </span>
                      {player.birthYear && (
                        <span className="font-mono text-[10px] text-kedja-deep/70">
                          ’{String(player.birthYear).slice(2)}
                        </span>
                      )}
                    </li>
                  ))}
                  {list.length === 0 && (
                    <li className="px-5 py-6 text-center text-xs text-kedja-deep/70">
                      Inga spelare i denna grupp ännu.
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </SectionReveal>

        {/* Ledarstab */}
        <SectionReveal as="section" className="mt-10 rounded-md border border-kedja-border/70 bg-white overflow-hidden">
          <header className="flex items-center justify-between border-b border-kedja-border/60 px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kedja-green">
                Ledarstab
              </span>
              <h2 className="text-xl text-kedja-ink">Tränare & ledning</h2>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-kedja-deep/70">
              {staff.length} personer
            </span>
          </header>
          <ul className="divide-y divide-kedja-border/50">
            {staff.map((member) => (
              <li
                key={member.name}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-sm font-bold tracking-tight text-kedja-ink">{member.name}</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kedja-deep/70">
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
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kedja-deep/70 transition hover:text-kedja-green"
        >
          Källa · svenskalag.se
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default Truppen;
