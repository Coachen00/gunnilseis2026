import { ArrowRight, Activity, Target, Wrench, Zap } from "lucide-react";
import type { EffectLogicBlock as Block } from "@/data/period1";

const ICONS = {
  Resurser: Wrench,
  Aktiviteter: Activity,
  Mål: Target,
  Effekt: Zap,
} as const;

const EffectLogic = ({ blocks }: { blocks: Block[] }) => (
  <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
    {blocks.map((block, i) => {
      const Icon = ICONS[block.label];
      return (
        <div key={block.label} className="contents">
          <div className="rounded-lg border border-border bg-card/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-accent-ink">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">{block.label}</h3>
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {i < blocks.length - 1 && (
            <ArrowRight
              className="mx-auto hidden h-5 w-5 self-center text-muted-foreground/50 md:block"
              strokeWidth={1.5}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default EffectLogic;
