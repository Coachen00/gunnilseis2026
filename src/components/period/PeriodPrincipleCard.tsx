import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { PeriodGraphic } from "@/components/period/PeriodGraphics";
import type { Principle } from "@/data/period1";

const PeriodPrincipleCard = ({ principle, index }: { principle: Principle; index: number }) => (
  <Collapsible className="group rounded-xl border border-border bg-card/35 p-5">
    <div className="flex items-start gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <h3 className="text-lg font-black tracking-normal text-foreground">{principle.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-foreground/85">{principle.childFriendly}</p>
        <CollapsibleTrigger className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent transition hover:text-accent/80">
          Visa princip
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
      </div>
    </div>
    <CollapsibleContent className="mt-4 grid gap-4 border-t border-border pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
      <p className="text-sm leading-relaxed text-muted-foreground">{principle.detail}</p>
      <PeriodGraphic kind={principle.graphic} />
    </CollapsibleContent>
  </Collapsible>
);

export default PeriodPrincipleCard;
