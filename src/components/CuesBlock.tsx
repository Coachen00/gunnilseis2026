import { PHASE_CUES, type PhaseCueSet } from "@/data/phaseCues";
import { useContent } from "@/hooks/useContent";

type PhaseCueKey = keyof typeof PHASE_CUES;

interface CuesBlockProps {
  /** Nyckel i phaseCues.ts. Drar live från useContent("phaseCues", PHASE_CUES). */
  phaseKey: PhaseCueKey;
}

const CuesBlock = ({ phaseKey }: CuesBlockProps) => {
  const { data: cues } = useContent<typeof PHASE_CUES>("phaseCues", PHASE_CUES);
  const set: PhaseCueSet | undefined = cues[phaseKey];
  if (!set) return null;

  return (
    <section id="cues" className="scroll-mt-24 mb-16">
      <div className="bg-card/85 backdrop-blur-sm rounded-2xl border border-accent/30 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block w-8 h-px bg-accent" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Match-cues · {set.label}</span>
        </div>
        <p className="text-base md:text-lg text-foreground/90 font-semibold leading-snug mb-6">{set.oneLiner}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Regler</h4>
            <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed">
              {set.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">När → då</h4>
            <ul className="space-y-3 text-sm">
              {set.cues.map((c, i) => (
                <li key={i} className="border-l-2 border-accent/40 pl-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">När</div>
                  <div className="text-foreground/90 mb-1">{c.trigger}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-accent">→ Då</div>
                  <div className="text-foreground/90 font-medium">{c.action}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CuesBlock;
