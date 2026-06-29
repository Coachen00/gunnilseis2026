import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface SegmentItem {
  id: string;
  label: string;
}

interface SegmentNavProps {
  items: SegmentItem[];
  /** aria-label för nav-landmärket. */
  ariaLabel?: string;
  className?: string;
}

/**
 * SegmentNav — sticky internnavigering för långa sidor. Följer scrollen
 * (scrollspy via IntersectionObserver) och markerar aktiv sektion. Horisontellt
 * scrollbar på mobil utan att skapa sid-overflow; ankarlänkar = tangentbord +
 * skärmläsare fungerar direkt. Sektionerna måste ha matchande id.
 */
const SegmentNav = ({ items, ariaLabel = "På sidan", className }: SegmentNavProps) => {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Flytta fokus till sektionen för skärmläsare/tangentbord.
    el.setAttribute("tabindex", "-1");
    (el as HTMLElement).focus({ preventScroll: true });
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "sticky top-16 z-30 -mx-2 border-b border-border/70 bg-background/85 backdrop-blur-md",
        className
      )}
    >
      <ul className="no-scrollbar flex gap-1 overflow-x-auto px-2 py-2">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id} className="flex-shrink-0">
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-md px-3.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-card text-foreground shadow-[inset_0_-2px_0_0_hsl(var(--accent))]"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SegmentNav;
