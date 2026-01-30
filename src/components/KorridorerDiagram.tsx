import { cn } from "@/lib/utils";

interface KorridorerDiagramProps {
  className?: string;
}

const KorridorerDiagram = ({ className }: KorridorerDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Korridorer (bredd)
      </h4>
      
      <div className="relative aspect-[3/4] w-full max-w-xs mx-auto">
        {/* Labels above pitch */}
        <div className="absolute -top-8 left-0 right-0 flex justify-between px-[4%]">
          <div className="flex flex-col items-center">
            <div className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[8px] font-bold whitespace-nowrap">
              V. Yttre
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="px-1 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-bold whitespace-nowrap">
              V. Inre
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="px-1 py-0.5 rounded bg-accent/20 text-accent text-[8px] font-bold whitespace-nowrap">
              Central
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="px-1 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-bold whitespace-nowrap">
              H. Inre
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[8px] font-bold whitespace-nowrap">
              H. Yttre
            </div>
          </div>
        </div>
        
        <svg 
          viewBox="0 0 120 160" 
          className="w-full h-full mt-2"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Pitch background */}
          <rect x="10" y="10" width="100" height="140" rx="2" fill="hsl(var(--pitch))" />
          
          {/* Corridor backgrounds */}
          {/* Corridor 1 - Yttre (left) */}
          <rect x="10" y="10" width="20" height="140" fill="hsl(var(--muted))" opacity="0.3" />
          {/* Corridor 2 - Inre (left) */}
          <rect x="30" y="10" width="20" height="140" fill="hsl(var(--primary))" opacity="0.15" />
          {/* Corridor 3 - Central */}
          <rect x="50" y="10" width="20" height="140" fill="hsl(var(--accent))" opacity="0.15" />
          {/* Corridor 4 - Inre (right) */}
          <rect x="70" y="10" width="20" height="140" fill="hsl(var(--primary))" opacity="0.15" />
          {/* Corridor 5 - Yttre (right) */}
          <rect x="90" y="10" width="20" height="140" fill="hsl(var(--muted))" opacity="0.3" />
          
          {/* Pitch markings */}
          <rect x="10" y="10" width="100" height="140" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1" opacity="0.6" />
          
          {/* Corridor dividers */}
          <line x1="30" y1="10" x2="30" y2="150" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.4" />
          <line x1="50" y1="10" x2="50" y2="150" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.4" />
          <line x1="70" y1="10" x2="70" y2="150" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.4" />
          <line x1="90" y1="10" x2="90" y2="150" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.4" />
          
          {/* Center line */}
          <line x1="10" y1="80" x2="110" y2="80" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Center circle */}
          <circle cx="60" cy="80" r="12" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Top penalty area */}
          <rect x="30" y="10" width="60" height="20" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="42" y="10" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Bottom penalty area */}
          <rect x="30" y="130" width="60" height="20" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="42" y="142" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Arrows pointing down from labels */}
          <line x1="20" y1="2" x2="20" y2="8" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
          <line x1="40" y1="2" x2="40" y2="8" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="60" y1="2" x2="60" y2="8" stroke="hsl(var(--accent))" strokeWidth="1" />
          <line x1="80" y1="2" x2="80" y2="8" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="100" y1="2" x2="100" y2="8" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        </svg>
        
        {/* Legend below */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-muted border border-border" />
              <span className="text-xs text-muted-foreground">V. Yttre & H. Yttre korridor</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary/30 border border-primary/50" />
              <span className="text-xs text-primary font-medium">V. Inre & H. Inre korridor</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-accent/30 border border-accent/50" />
              <span className="text-xs text-accent">Central korridor</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Note */}
      <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-xs text-primary font-medium text-center">
          <strong>Mål:</strong> Sök spelbarhet i inre korridorer
        </p>
      </div>
    </div>
  );
};

export default KorridorerDiagram;
