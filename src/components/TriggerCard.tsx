import { cn } from "@/lib/utils";

interface TriggerCardProps {
  number: number;
  condition: string;
  action: string;
  variant?: "default" | "defense" | "attack";
}

const TriggerCard = ({ number, condition, action, variant = "default" }: TriggerCardProps) => {
  return (
    <div className={cn(
      "card-gradient rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]",
      variant === "defense" 
        ? "border-zone-defense/30 hover:border-zone-defense/50" 
        : variant === "attack"
        ? "border-primary/30 hover:border-primary/50"
        : "border-border hover:border-muted-foreground/50"
    )}>
      <div className="flex gap-4 items-start">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0",
          variant === "defense" 
            ? "bg-zone-defense/20 text-zone-defense" 
            : variant === "attack"
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}>
          {number}
        </div>
        <div className="space-y-2 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Om</span>
            <span className="text-sm text-foreground">{condition}</span>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">→ Då</span>
            <span className="text-sm text-foreground font-medium">{action}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerCard;
