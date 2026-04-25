import { PHASES, type Phase, type PhaseSpec, type Principle } from "@/data/principles";
import { useContent } from "@/hooks/useContent";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PrincipleBlockProps {
  phase: Phase;
  /** Visa "Källa"-rad under varje princip */
  showSource?: boolean;
  /** Antal principer som visas (default = alla) */
  limit?: number;
}

/**
 * Standardiserad presentation av principer per skede.
 * All text läses via useContent("principles", PHASES) — fallback till hårdkodad data.
 */
const PrincipleBlock = ({ phase, showSource = false, limit }: PrincipleBlockProps) => {
  const { data: phases } = useContent<Record<Phase, PhaseSpec>>("principles", PHASES);
  const spec = phases[phase];
  if (!spec) return null;
  const items = limit ? spec.principles.slice(0, limit) : spec.principles;

  return (
    <div className="space-y-4">
      <div className="border-l-2 border-accent/60 pl-5 py-1">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-accent mb-2">
          {spec.label}
        </div>
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          {spec.oneLiner}
        </p>
      </div>
      <ol className="space-y-3 counter-reset-principles">
        {items.map((p, i) => (
          <PrincipleItem key={p.headline} index={i + 1} principle={p} showSource={showSource} />
        ))}
      </ol>
    </div>
  );
};

const PrincipleItem = ({
  index,
  principle,
  showSource,
}: {
  index: number;
  principle: Principle;
  showSource: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="bg-card/85 backdrop-blur-sm rounded-xl border border-border overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 text-accent font-mono font-black text-sm flex items-center justify-center">
            {String(index).padStart(2, "0")}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base md:text-lg font-bold text-foreground leading-snug tracking-tight">
              {principle.headline}
            </h4>
            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
              {principle.detail}
            </p>
            {principle.sub.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {principle.sub.map((s) => (
                  <li
                    key={s}
                    className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border border-border bg-background/60 text-foreground/80"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {showSource && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Källa
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
        {showSource && open && (
          <p className="mt-3 text-xs italic text-muted-foreground border-l-2 border-border pl-3 leading-relaxed">
            {principle.source}
          </p>
        )}
      </div>
    </li>
  );
};

export default PrincipleBlock;
