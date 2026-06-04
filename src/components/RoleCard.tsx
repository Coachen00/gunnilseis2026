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
      "bg-card rounded-sm p-6 md:p-7 border transition-all duration-200 hover:-translate-y-px hover:shadow-[0_10px_28px_-12px_hsl(215_70%_12%/0.22)]",
      variant === "attack"
        ? "border-zone-attack/35 hover:border-zone-attack/70"
        : variant === "defense"
        ? "border-zone-defense/35 hover:border-zone-defense/70"
        : "border-zone-midfield/35 hover:border-zone-midfield/70"
    )}>
      <div className="flex items-center gap-3 mb-5">
        <div className={cn(
          "w-12 h-12 rounded-sm flex items-center justify-center font-mono font-bold text-xl tabular border",
          variant === "attack"
            ? "bg-zone-attack/10 text-zone-attack border-zone-attack/30"
            : variant === "defense"
            ? "bg-zone-defense/10 text-zone-defense border-zone-defense/30"
            : "bg-zone-midfield/10 text-zone-midfield border-zone-midfield/30"
        )}>
          {line}
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground">{players}</p>
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
