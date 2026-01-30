import { cn } from "@/lib/utils";

interface SetPieceCardProps {
  title: string;
  roles: { name: string; instruction: string }[];
  variant?: "hybrid" | "zone" | "man";
}

const SetPieceCard = ({ title, roles, variant = "hybrid" }: SetPieceCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-6 border shadow-sm",
      variant === "man" 
        ? "border-zone-defense/30" 
        : variant === "zone"
        ? "border-secondary/30"
        : "border-accent/30"
    )}>
      <div className="flex items-center gap-3 mb-5">
        <div className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider",
          variant === "man" 
            ? "bg-zone-defense/20 text-zone-defense" 
            : variant === "zone"
            ? "bg-secondary/20 text-secondary"
            : "bg-accent/20 text-accent-foreground"
        )}>
          {variant === "man" ? "Man" : variant === "zone" ? "Zon" : "Hybrid"}
        </div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {roles.map((role, index) => (
          <div key={index} className="flex gap-3 items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[80px]">{role.name}</span>
            <span className="text-sm text-foreground">{role.instruction}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetPieceCard;
