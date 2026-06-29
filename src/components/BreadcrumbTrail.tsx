import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

/**
 * BreadcrumbTrail — visar var i strukturen man är: Hem / Värld / Sida.
 * Sista steget är nuvarande sida (ingen länk). Håll den kort — max 3 steg.
 */
const BreadcrumbTrail = ({ items, className }: { items: Crumb[]; className?: string }) => (
  <nav aria-label="Brödsmulor" className={cn("container pt-6", className)}>
    <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.to && !last ? (
              <Link to={c.to} className="rounded transition-colors hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span aria-current={last ? "page" : undefined} className={cn(last && "text-foreground")}>
                {c.label}
              </span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default BreadcrumbTrail;
