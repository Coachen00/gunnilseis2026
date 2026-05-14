import { cn } from "@/lib/utils";

interface PrincipleCardProps {
  number: number;
  title: string;
  description?: string;
  variant?: "defense" | "attack" | "neutral";
}

const PrincipleCard = ({ number, title, description, variant = "neutral" }: PrincipleCardProps) => {
  return (
    <div className={cn(
      "flex items-start gap-4 p-5 rounded-sm border bg-card transition-all duration-200 hover:-translate-y-px",
      variant === "defense"
        ? "border-zone-defense/35 hover:border-zone-defense/70 hover:shadow-[0_8px_24px_-12px_hsl(215_70%_12%/0.18)]"
        : variant === "attack"
        ? "border-zone-attack/35 hover:border-zone-attack/70 hover:shadow-[0_8px_24px_-12px_hsl(215_70%_12%/0.18)]"
        : "border-border hover:border-accent hover:shadow-[0_8px_24px_-12px_hsl(215_70%_12%/0.18)]"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-sm flex items-center justify-center font-mono font-bold text-base flex-shrink-0 tabular",
        variant === "defense"
          ? "bg-zone-defense/12 text-zone-defense border border-zone-defense/30"
          : variant === "attack"
          ? "bg-zone-attack/12 text-zone-attack border border-zone-attack/30"
          : "bg-primary/8 text-primary border border-primary/20"
      )}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold tracking-tight text-foreground leading-snug">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PrincipleCard;
