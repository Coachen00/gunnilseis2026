import { cn } from "@/lib/utils";

interface SpelytorDiagramProps {
  className?: string;
}

const SpelytorDiagram = ({ className }: SpelytorDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Spelytor (djup)
      </h4>
      
      <div className="relative aspect-[3/4] w-full max-w-xs mx-auto">
        <svg 
          viewBox="0 0 120 160" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Pitch background */}
          <rect x="10" y="10" width="100" height="140" rx="2" fill="hsl(var(--pitch))" />
          
          {/* Zone backgrounds with different opacities */}
          {/* Spelyta 3 */}
          <rect x="10" y="10" width="100" height="35" fill="hsl(var(--zone-attack))" opacity="0.3" />
          {/* Spelyta 2 */}
          <rect x="10" y="45" width="100" height="35" fill="hsl(var(--zone-midfield))" opacity="0.3" />
          {/* Spelyta 1 */}
          <rect x="10" y="80" width="100" height="35" fill="hsl(var(--zone-defense))" opacity="0.3" />
          {/* Utgångsyta */}
          <rect x="10" y="115" width="100" height="35" fill="hsl(var(--muted))" opacity="0.4" />
          
          {/* Pitch markings */}
          <rect x="10" y="10" width="100" height="140" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1" opacity="0.6" />
          
          {/* Zone dividers */}
          <line x1="10" y1="45" x2="110" y2="45" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.5" />
          <line x1="10" y1="80" x2="110" y2="80" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.5" />
          <line x1="10" y1="115" x2="110" y2="115" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.5" />
          
          {/* Center circle */}
          <circle cx="60" cy="80" r="12" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Top penalty area */}
          <rect x="30" y="10" width="60" height="20" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="42" y="10" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Bottom penalty area */}
          <rect x="30" y="130" width="60" height="20" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="42" y="142" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
        </svg>
        
        {/* Zone labels */}
        <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ top: '6.25%', height: '87.5%' }}>
          <div className="flex-1 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-zone-attack/20 text-zone-attack text-xs font-bold border border-zone-attack/30">
              Spelyta 3
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-zone-midfield/20 text-zone-midfield text-xs font-bold border border-zone-midfield/30">
              Spelyta 2
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-zone-defense/20 text-zone-defense text-xs font-bold border border-zone-defense/30">
              Spelyta 1
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-bold border border-border">
              Utgångsyta
            </span>
          </div>
        </div>
      </div>
      
      {/* Arrow indicating direction */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Försvar</span>
          <svg className="w-16 h-4" viewBox="0 0 64 16">
            <defs>
              <linearGradient id="depthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
                <stop offset="100%" stopColor="hsl(var(--zone-attack))" />
              </linearGradient>
            </defs>
            <line x1="4" y1="8" x2="56" y2="8" stroke="url(#depthGradient)" strokeWidth="2" />
            <polygon points="56,4 64,8 56,12" fill="hsl(var(--zone-attack))" />
          </svg>
          <span>Anfall</span>
        </div>
      </div>
    </div>
  );
};

export default SpelytorDiagram;
