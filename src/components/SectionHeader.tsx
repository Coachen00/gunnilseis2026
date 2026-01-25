import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

const SectionHeader = ({ title, subtitle, badge, className }: SectionHeaderProps) => {
  return (
    <div className={cn("mb-8", className)}>
      {badge && (
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
