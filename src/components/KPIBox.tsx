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
    <div className={cn("bg-card rounded-sm border border-border overflow-hidden shadow-[0_1px_0_0_hsl(var(--border)),0_4px_14px_-8px_hsl(215_70%_12%/0.08)]", className)}>
      <div className="px-5 py-3.5 bg-primary text-primary-foreground">
        <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">{title}</h4>
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
