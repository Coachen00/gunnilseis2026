import { cn } from "@/lib/utils";

interface Player {
  id: string;
  x: number;
  y: number;
  role: string;
  color?: "primary" | "accent" | "secondary";
}

interface FootballPitchProps {
  players: Player[];
  title: string;
  subtitle?: string;
  showZones?: boolean;
  className?: string;
}

const FootballPitch = ({ players, title, subtitle, showZones = false, className }: FootballPitchProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="relative aspect-[3/4] w-full max-w-md mx-auto pitch-gradient rounded-xl overflow-hidden border border-pitch-lines/30">
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 133" preserveAspectRatio="xMidYMid meet">
          {/* Outer lines */}
          <rect x="2" y="2" width="96" height="129" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Center line */}
          <line x1="2" y1="66.5" x2="98" y2="66.5" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Center circle */}
          <circle cx="50" cy="66.5" r="12" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="66.5" r="1" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          
          {/* Top penalty area */}
          <rect x="20" y="2" width="60" height="22" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="32" y="2" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="16" r="1" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          
          {/* Bottom penalty area */}
          <rect x="20" y="109" width="60" height="22" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="32" y="123" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="117" r="1" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          
          {/* Zone indicators */}
          {showZones && (
            <>
              <text x="50" y="10" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Spelyta 3</text>
              <text x="50" y="40" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Spelyta 2</text>
              <text x="50" y="90" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Spelyta 1</text>
              <text x="50" y="125" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Utgångsyta</text>
            </>
          )}
        </svg>
        
        {/* Players */}
        {players.map((player) => (
          <div
            key={player.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110",
                player.color === "accent" 
                  ? "bg-accent text-accent-foreground" 
                  : player.color === "secondary"
                  ? "bg-secondary text-secondary-foreground border border-muted-foreground/30"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {player.id}
            </div>
            <span className="text-[10px] font-medium text-foreground/80 bg-background/60 px-1.5 py-0.5 rounded whitespace-nowrap">
              {player.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootballPitch;
