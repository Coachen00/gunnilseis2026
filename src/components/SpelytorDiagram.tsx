import { cn } from "@/lib/utils";
import spelytorImage from "@/assets/spelytor-diagram.png";

interface SpelytorDiagramProps {
  className?: string;
}

const SpelytorDiagram = ({ className }: SpelytorDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Spelytor (djup)
      </h4>
      
      <div className="relative w-full max-w-md mx-auto">
        <img 
          src={spelytorImage} 
          alt="Spelytor diagram - Utgångsyta, Spelyta 1, 2 och 3" 
          className="w-full h-auto rounded-lg border border-border"
        />
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
