import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface GIGTemplateProps {
  cueTitel: string;
  definition: string;
  narAnvands: string;
  beslutstrigger?: string;
  handling: string;
  roller?: string;
  exempel?: string;
  gVillkor: string;
  igVillkor: string;
  className?: string;
}

const GIGTemplate = ({
  cueTitel,
  definition,
  narAnvands,
  beslutstrigger,
  handling,
  roller,
  exempel,
  gVillkor,
  igVillkor,
  className,
}: GIGTemplateProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
      {/* Summary box */}
      <div className="px-5 py-4">
        <h4 className="text-sm font-bold text-primary mb-1">{cueTitel}</h4>
        <p className="text-sm text-muted-foreground">{definition}</p>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="text-zone-attack font-medium">G: {gVillkor}</span>
          <span className="text-zone-defense font-medium">IG: {igVillkor}</span>
        </div>
      </div>

      {/* Accordion for details */}
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full px-5 py-2 border-t border-border bg-muted/20 flex items-center justify-between hover:bg-muted/40 transition-colors">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visa detaljer</span>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="divide-y divide-border text-sm">
            <div className="flex gap-3 px-5 py-2">
              <span className="text-xs font-bold text-muted-foreground min-w-[160px] flex-shrink-0">När används den?</span>
              <span className="text-foreground">{narAnvands}</span>
            </div>
            {beslutstrigger && (
              <div className="flex gap-3 px-5 py-2">
                <span className="text-xs font-bold text-muted-foreground min-w-[160px] flex-shrink-0">Beslutstrigger</span>
                <span className="text-foreground">{beslutstrigger}</span>
              </div>
            )}
            <div className="flex gap-3 px-5 py-2">
              <span className="text-xs font-bold text-muted-foreground min-w-[160px] flex-shrink-0">Handling</span>
              <span className="text-foreground">{handling}</span>
            </div>
            {roller && (
              <div className="flex gap-3 px-5 py-2">
                <span className="text-xs font-bold text-muted-foreground min-w-[160px] flex-shrink-0">Roller</span>
                <span className={cn("text-foreground", roller.includes("[") && "text-accent italic")}>{roller}</span>
              </div>
            )}
            {exempel && (
              <div className="flex gap-3 px-5 py-2">
                <span className="text-xs font-bold text-muted-foreground min-w-[160px] flex-shrink-0">Exempel</span>
                <span className={cn("text-foreground", exempel.includes("[") && "text-accent italic")}>{exempel}</span>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default GIGTemplate;
