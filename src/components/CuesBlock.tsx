import { PhaseCueSet } from "@/data/phaseCues";

interface CuesBlockProps {
  set: PhaseCueSet;
}

const CuesBlock = ({ set }: CuesBlockProps) => (
  <section id="cues" className="scroll-mt-24 mb-16">
    <div className="bg-card/85 backdrop-blur-sm rounded-2xl border border-accent/30 p-7 md:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block w-8 h-px bg-accent" />
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent-ink">Match-cues · {set.label}</span>
      </div>
      <p className="text-base md:text-lg text-foreground/90 font-semibold leading-snug mb-8">{set.oneLiner}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Regler</h4>
          <ul className="space-y-3 text-sm text-foreground/85 leading-relaxed">
            {set.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">När → då</h4>
          <ul className="space-y-4 text-sm">
            {set.cues.map((c, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-3">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">När</div>
                <div className="text-foreground/90 mb-1">{c.trigger}</div>
                <div className="text-xs font-mono uppercase tracking-wider text-accent-ink">→ Då</div>
                <div className="text-foreground/90 font-medium">{c.action}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default CuesBlock;