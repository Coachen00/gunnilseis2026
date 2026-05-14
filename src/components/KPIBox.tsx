import { cn } from "@/lib/utils";

interface KPI {
  name: string;
  definition: string;
  target: string;
  measurement?: string;
  section?: string;
  failThreshold?: string;
}

interface KPIBoxProps {
  kpis: KPI[];
  title?: string;
  className?: string;
}

const KPIBox = ({ kpis, title = "KPIs", className }: KPIBoxProps) => {
  return (
    <div className={cn("bg-card rounded-xl border border-border/80 shadow-[0_1px_3px_hsl(215_35%_18%_/_0.04),0_4px_14px_-4px_hsl(215_35%_18%_/_0.06)] overflow-hidden", className)}>
      <div className="px-5 py-3.5 bg-accent/12 border-b border-accent/25">
        <h4 className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-foreground">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">KPI</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Definition</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Mätmetod</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Mål (G)</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">IG‑tröskel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {kpis.map((kpi, i) => (
              <tr key={i}>
                <td className="px-4 py-2 font-medium text-foreground">{kpi.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{kpi.definition}</td>
                <td className="px-4 py-2 text-muted-foreground">{kpi.measurement || "[INFERRED]"}</td>
                <td className={cn("px-4 py-2", kpi.target.includes("[MISSING") ? "text-accent italic" : "text-foreground font-medium")}>{kpi.target}</td>
                <td className={cn("px-4 py-2", kpi.failThreshold?.includes("[MISSING") ? "text-accent italic" : "text-muted-foreground")}>{kpi.failThreshold || "[MISSING INPUT]"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIBox;
