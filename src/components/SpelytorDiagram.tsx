import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface SpelytorDiagramProps {
  className?: string;
}

const SpelytorDiagram = ({ className }: SpelytorDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Spelytor (djup)
      </h4>
      
      {/* Attack direction arrow */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">Anfallsväg</span>
        <ArrowRight className="w-4 h-4 text-foreground" />
      </div>
      
      <div className="relative aspect-[4/3] w-full max-w-md mx-auto">
        <svg 
          viewBox="0 0 200 150" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Pitch background */}
          <rect x="5" y="10" width="190" height="130" rx="2" fill="hsl(var(--pitch))" />
          
          {/* Zone backgrounds with different opacities */}
          {/* Utgångsyta */}
          <rect x="5" y="10" width="47.5" height="130" fill="hsl(var(--muted))" opacity="0.3" />
          {/* Spelyta 1 */}
          <rect x="52.5" y="10" width="47.5" height="130" fill="hsl(var(--primary))" opacity="0.1" />
          {/* Spelyta 2 */}
          <rect x="100" y="10" width="47.5" height="130" fill="hsl(var(--primary))" opacity="0.2" />
          {/* Spelyta 3 */}
          <rect x="147.5" y="10" width="47.5" height="130" fill="hsl(var(--accent))" opacity="0.25" />
          
          {/* Pitch markings */}
          <rect x="5" y="10" width="190" height="130" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1" opacity="0.6" />
          
          {/* Zone dividers */}
          <line x1="52.5" y1="10" x2="52.5" y2="140" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
          <line x1="100" y1="10" x2="100" y2="140" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
          <line x1="147.5" y1="10" x2="147.5" y2="140" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
          
          {/* Center circle */}
          <circle cx="100" cy="75" r="15" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="100" cy="75" r="1.5" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          
          {/* Left goal area */}
          <rect x="5" y="45" width="12" height="60" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="5" y="55" width="6" height="40" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Right goal area */}
          <rect x="183" y="45" width="12" height="60" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="189" y="55" width="6" height="40" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          
          {/* Goals */}
          <rect x="1" y="62" width="4" height="26" fill="hsl(var(--muted-foreground))" opacity="0.4" rx="1" />
          <rect x="195" y="62" width="4" height="26" fill="hsl(var(--muted-foreground))" opacity="0.4" rx="1" />
          
          {/* Zone labels */}
          <text x="28.75" y="30" textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">
            Utgångsyta
          </text>
          <text x="76.25" y="30" textAnchor="middle" className="fill-primary text-[8px] font-bold">
            Spelyta 1
          </text>
          <text x="123.75" y="30" textAnchor="middle" className="fill-primary text-[8px] font-bold">
            Spelyta 2
          </text>
          <text x="171.25" y="30" textAnchor="middle" className="fill-accent text-[8px] font-bold">
            Spelyta 3
          </text>
        </svg>
      </div>
      
      {/* Legend below */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-muted border border-border" />
          <span className="text-xs text-muted-foreground">Utgångsyta – Spelarutrymme bakom tryck</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary/30 border border-primary/50" />
          <span className="text-xs text-primary font-medium">Spelyta 1 & 2 – Uppbyggnad & kontroll</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-accent/30 border border-accent/50" />
          <span className="text-xs text-accent">Spelyta 3 – Hotyta, avslut</span>
        </div>
      </div>
      
      {/* Note */}
      <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <p className="text-xs text-accent font-medium text-center">
          <strong>Mål:</strong> Etablera kontroll i spelyta 2/3 via inre korridorer
        </p>
      </div>
    </div>
  );
};

export default SpelytorDiagram;
