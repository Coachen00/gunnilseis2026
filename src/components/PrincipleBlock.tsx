import { PHASES, type Phase, type Principle } from "@/data/principles";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import MediaSlot from "@/components/match/MediaSlot";

interface PrincipleBlockProps {
  phase: Phase;
  /** Visa "Källa"-rad under varje princip */
  showSource?: boolean;
  /** Antal principer som visas (default = alla) */
  limit?: number;
}

/**
 * Standardiserad presentation av principer per skede.
 * All text läses från `src/data/principles.ts` — single source of truth.
 */
const PrincipleBlock = ({ phase, showSource = false, limit }: PrincipleBlockProps) => {
  const spec = PHASES[phase];
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
          <PrincipleItem key={p.headline} phase={phase} index={i + 1} principle={p} showSource={showSource} />
        ))}
      </ol>
    </div>
  );
};

const PrincipleItem = ({
  index,
  phase,
  principle,
  showSource,
}: {
  index: number;
  phase: Phase;
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
            {principle.lookFor && principle.lookFor.length > 0 && (
              <div className="mt-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Titta efter
                </span>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {principle.lookFor.map((q) => (
                    <li key={q}>· {q}</li>
                  ))}
                </ul>
              </div>
            )}
            {principle.actions && principle.actions.length > 0 && (
              <div className="mt-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Gör detta
                </span>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {principle.actions.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
              </div>
            )}
            {principle.coachCalls && principle.coachCalls.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mr-1">
                  Coachrop
                </span>
                {principle.coachCalls.map((c) => (
                  <span
                    key={c}
                    className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border border-accent/40 bg-accent/10 text-accent"
                  >
                    {c}
                  </span>
                ))}
                {principle.identity && principle.identity.length > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    — aktiverar identitet: {principle.identity.join(", ")}
                  </span>
                )}
              </div>
            )}
            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Lägg till exempel
                </span>
                <span className="text-[10px] text-muted-foreground">Välj en ruta för att lägga till bild eller film</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  principle.headline,
                  ...principle.sub,
                ].map((area, mediaIndex) => (
                  <MediaSlot
                    key={`${phase}-${index}-${mediaIndex}-${area}`}
                    slotKey={`spelmodell:${phase}:princip:${index}:media:${mediaIndex}`}
                    title={mediaIndex === 0 ? "Hela situationen" : `Visa: ${area}`}
                    description={`${PHASES[phase].label} - ${area}`}
                    compact
                  />
                ))}
              </div>
            </div>
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
