import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SystemMapRow {
  label: string;
  to?: string;
}

export interface SystemMapColumn {
  heading: string;
  sub?: string;
  Icon?: LucideIcon;
  rows: SystemMapRow[];
}

interface SystemMapProps {
  /** Taket — det som allt vilar på (t.ex. VAR FÖRBEREDD). */
  capstone?: { label: string; sub?: string };
  columns: SystemMapColumn[];
  className?: string;
}

/**
 * SystemMap — en spelbar karta, inte en lista. Ett tak vilar överst och pelare
 * (kolumner) bär upp det. På mobil staplas pelarna; taket ligger alltid kvar
 * överst. Rader med `to` blir länkar, övriga är ren struktur.
 */
const SystemMap = ({ capstone, columns, className }: SystemMapProps) => (
  <div className={cn("relative", className)}>
    {capstone && (
      <div className="mb-0 flex flex-col items-center text-center">
        <div className="w-full max-w-md border border-amber-400/70 bg-amber-50 px-6 py-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-amber-700">
            {capstone.label}
          </p>
          {capstone.sub && <p className="mt-1 text-sm font-semibold text-foreground/70">{capstone.sub}</p>}
        </div>
        {/* Bärlinje ner till pelarna */}
        <span aria-hidden="true" className="h-6 w-px bg-border" />
      </div>
    )}

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {columns.map((col) => {
        const Icon = col.Icon;
        return (
          <section key={col.heading} className="flex flex-col border border-border bg-card">
            <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              {Icon && <Icon className="h-4 w-4 flex-shrink-0 text-foreground/70" strokeWidth={2} aria-hidden="true" />}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-foreground">{col.heading}</h3>
                {col.sub && <p className="text-[11px] font-semibold text-muted-foreground">{col.sub}</p>}
              </div>
            </header>
            <ul className="divide-y divide-border/70">
              {col.rows.map((row) =>
                row.to ? (
                  <li key={row.label}>
                    <Link
                      to={row.to}
                      className="flex min-h-[44px] items-center px-4 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {row.label}
                    </Link>
                  </li>
                ) : (
                  <li key={row.label} className="flex min-h-[44px] items-center px-4 text-sm text-foreground/70">
                    {row.label}
                  </li>
                )
              )}
            </ul>
          </section>
        );
      })}
    </div>
  </div>
);

export default SystemMap;
