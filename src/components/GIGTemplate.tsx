import { cn } from "@/lib/utils";

interface GIGTemplateProps {
  cueTitel: string;
  definition: string;
  narAnvands: string;
  beslutstrigger?: string;
  handling: string;
  roller?: string;
  exempel?: string;
  kpi: string;
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
  kpi,
  gVillkor,
  igVillkor,
  className,
}: GIGTemplateProps) => {
  const rows = [
    { label: "1) Cue‑titel", value: cueTitel },
    { label: "2) Definition", value: definition },
    { label: "3) När används den?", value: narAnvands },
    { label: "4) Beslutstrigger (1/2/3)", value: beslutstrigger || "[INFERRED]" },
    { label: "5) Handling (exakt steg)", value: handling },
    { label: "6) Roller/Positioner", value: roller || "[INFERRED]" },
    { label: "7) Exempel (matchtid, beslut, resultat)", value: exempel || "[MISSING INPUT — paste example here]" },
    { label: "8) KPI", value: kpi },
    { label: "9) G‑villkor", value: gVillkor },
    { label: "10) IG‑villkor", value: igVillkor },
  ];

  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
      <div className="px-5 py-3 bg-primary/10 border-b border-border">
        <h4 className="text-sm font-bold uppercase tracking-wider text-primary">G/IG‑MALL: {cueTitel}</h4>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3 px-5 py-2.5">
            <span className="text-xs font-bold text-muted-foreground min-w-[200px] flex-shrink-0">{row.label}</span>
            <span className={cn(
              "text-sm",
              row.value.includes("[INFERRED]") || row.value.includes("[MISSING")
                ? "text-accent italic"
                : "text-foreground"
            )}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GIGTemplate;
