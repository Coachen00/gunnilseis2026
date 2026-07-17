import { useEffect, useState } from "react";
import { Film, Shield, Zap, Swords, Repeat, Flame, Target, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAJ_2026_BLOCKS } from "@/data/majSpelmodell";

const BLOCK_ICON: Record<string, LucideIcon> = {
  forsvarsspel: Shield,
  "overgang-anfall": Zap,
  anfallsspel: Swords,
  "overgang-forsvar": Repeat,
  identitet: Flame,
  "fasta-situationer": Target,
};

/**
 * BlockFilterBar — sticky horisontell snabbnavigering. Spelaren på mobil ser
 * en alltid-närvarande lista med de fyra skedena och de två särdelarna.
 *
 * - Sticky strax under TopNav-höjden (top-16).
 * - Inkluderar en "Filmer"-genvej direkt till första blocket med film
 *   (eller forsvarsspel som default).
 * - Highlightar det block som är synligt eller där hash matchar.
 *
 * Använder native scroll med scroll-mt-24 på block-id för korrekta ankare.
 */
const BlockFilterBar = () => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) setActive(hash);
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, []);

  return (
    <nav
      aria-label="Filter — hoppa till block"
      className="sticky top-16 z-30 border-y border-border bg-background/95 backdrop-blur-md"
    >
      <div className="container">
        <div className="-mx-2 flex items-center gap-2 overflow-x-auto px-2 py-2.5 scrollbar-hide" role="list">
          <span className="hidden flex-shrink-0 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Block
          </span>
          {MAJ_2026_BLOCKS.map((b, i) => {
            const Icon = BLOCK_ICON[b.id] ?? Film;
            const isActive = active === b.id;
            return (
              <a
                key={b.id}
                href={`#${b.id}`}
                onClick={() => setActive(b.id)}
                role="listitem"
                className={cn(
                  "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/40"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="font-mono text-[9px] font-black tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
                <span className="whitespace-nowrap">{b.navLabel}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BlockFilterBar;
