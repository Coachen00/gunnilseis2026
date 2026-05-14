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
      "flex items-start gap-4 p-5 rounded-xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_-4px_hsl(215_35%_18%_/_0.08)]",
      variant === "defense"
        ? "border-zone-defense/25 hover:border-zone-defense/45"
        : variant === "attack"
        ? "border-zone-attack/25 hover:border-zone-attack/45"
        : "border-border/80 hover:border-accent/35"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center font-serif text-lg flex-shrink-0",
        variant === "defense"
          ? "bg-zone-defense/15 text-zone-defense"
          : variant === "attack"
          ? "bg-zone-attack/15 text-zone-attack"
          : "bg-primary/10 text-primary"
      )}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PrincipleCard;
