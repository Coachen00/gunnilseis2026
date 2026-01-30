import { cn } from "@/lib/utils";

interface RoleCardProps {
  line: string;
  players: string;
  description: string;
  variant?: "attack" | "midfield" | "defense";
}

const RoleCard = ({ line, players, description, variant = "midfield" }: RoleCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 border shadow-sm transition-all duration-300 hover:scale-[1.02]",
      variant === "attack" 
        ? "border-zone-attack/30 hover:border-zone-attack/50" 
        : variant === "defense"
        ? "border-zone-defense/30 hover:border-zone-defense/50"
        : "border-zone-midfield/30 hover:border-zone-midfield/50"
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl",
          variant === "attack" 
            ? "bg-zone-attack/20 text-zone-attack" 
            : variant === "defense"
            ? "bg-zone-defense/20 text-zone-defense"
            : "bg-zone-midfield/20 text-zone-midfield"
        )}>
          {line}
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{players}</p>
          <p className={cn(
            "text-xs font-medium",
            variant === "attack" 
              ? "text-zone-attack" 
              : variant === "defense"
              ? "text-zone-defense"
              : "text-zone-midfield"
          )}>
            {variant === "attack" ? "Högsta linjen" : variant === "defense" ? "Första linjen" : "Mellanlinjen"}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default RoleCard;
