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
        <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary bg-primary/8 rounded-full mb-3 border border-primary/10">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2 leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
