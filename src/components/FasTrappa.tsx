/**
 * FasTrappa — den genomgående linjen mellan Grunden och fas-sidorna.
 *
 * Visas direkt under hero på varje fas-sida (Försvar, Anfall, Omställningar,
 * Fasta, Identitet) och knyter sidan till sin rad i Grunden (nivå 1) innan
 * läsaren går ner i principerna (nivå 2) och fördjupningen (nivå 3).
 * Innehållet hämtas ur grunden.ts (härlett ur blockens remember-rader) —
 * en källa, samma rad överallt.
 */

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LevelBadge from "@/components/LevelBadge";
import { FAS_RADER } from "@/data/grunden";

export default function FasTrappa({ blockId }: { blockId: string }) {
  const fas = FAS_RADER.find((f) => f.id === blockId);
  if (!fas) return null;

  return (
    <div className="container">
      <div className="mb-10 flex flex-col gap-4 rounded-sm border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <LevelBadge level={1} />
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Din rad från Grunden · {fas.num}
            </span>
          </div>
          <p className="text-base font-black tracking-tight text-foreground md:text-lg">
            {fas.remember}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LevelBadge level={2} />
          <Link
            to="/maj-2026#grunden"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 transition-colors hover:text-amber-600"
          >
            Hela trappan
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </div>
  );
}
