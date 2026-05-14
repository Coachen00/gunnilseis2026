import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

const SectionHeader = ({ title, subtitle, badge, className }: SectionHeaderProps) => {
  return (
    <div className={cn("mb-12", className)}>
      {badge && (
        <span className="inline-flex items-center gap-3 mb-5 text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-accent">
          <span className="inline-block w-8 h-px bg-accent/70" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl text-foreground mb-4 leading-[1.15]">{title}</h2>
      {subtitle && (
        <p className="text-foreground/70 max-w-prose text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
