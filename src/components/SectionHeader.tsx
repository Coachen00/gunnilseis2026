import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  /**
   * Visa ett nollpaddat ordningsnummer (`01`, `02`, …) i en accent-chip
   * till vänster om badge. Använder samma chip-stil som Identitet- och
   * Truppen-sidornas eyebrow-mönster.
   */
  number?: number;
  className?: string;
}

const SectionHeader = ({ title, subtitle, badge, number, className }: SectionHeaderProps) => {
  return (
    <div className={cn("mb-12", className)}>
      {(badge || number !== undefined) && (
        <div className="mb-5 flex items-center gap-3">
          {number !== undefined && (
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/35 bg-accent/10 font-mono text-xs font-black text-accent">
              {String(number).padStart(2, "0")}
            </span>
          )}
          {badge && (
            <span className="inline-flex items-center gap-3 text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-accent">
              {number === undefined && <span className="inline-block w-8 h-px bg-accent/70" />}
              {badge}
            </span>
          )}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl text-foreground mb-4 leading-[1.15]">{title}</h2>
      {subtitle && (
        <p className="text-foreground/70 max-w-prose text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
