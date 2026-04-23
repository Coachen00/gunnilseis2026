import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

const SectionHeader = ({ title, subtitle, badge, className }: SectionHeaderProps) => {
  return (
    <div className={cn("mb-10", className)}>
      {badge && (
        <span className="inline-flex items-center gap-2 mb-3 text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-accent">
          <span className="inline-block w-6 h-px bg-accent/70" />
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 leading-tight tracking-[-0.03em]">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
