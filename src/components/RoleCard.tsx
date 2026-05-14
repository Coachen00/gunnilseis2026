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
      "bg-card rounded-xl p-6 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-6px_hsl(215_35%_18%_/_0.10)]",
      variant === "attack"
        ? "border-zone-attack/25 hover:border-zone-attack/45"
        : variant === "defense"
        ? "border-zone-defense/25 hover:border-zone-defense/45"
        : "border-zone-midfield/25 hover:border-zone-midfield/45"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center font-serif text-2xl",
          variant === "attack"
            ? "bg-zone-attack/15 text-zone-attack"
            : variant === "defense"
            ? "bg-zone-defense/15 text-zone-defense"
            : "bg-zone-midfield/15 text-zone-midfield"
        )}>
          {line}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{players}</p>
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
