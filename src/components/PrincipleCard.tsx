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
      "flex items-start gap-4 p-4 rounded-xl border shadow-sm transition-all duration-200 hover:scale-[1.01]",
      variant === "defense" 
        ? "bg-card border-zone-defense/30" 
        : variant === "attack"
        ? "bg-card border-zone-attack/30"
        : "bg-card border-border"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0",
        variant === "defense" 
          ? "bg-zone-defense/20 text-zone-defense" 
          : variant === "attack"
          ? "bg-zone-attack/20 text-zone-attack"
          : "bg-primary/20 text-primary"
      )}>
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground leading-snug">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PrincipleCard;
