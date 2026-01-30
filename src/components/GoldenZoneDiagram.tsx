import { cn } from "@/lib/utils";
import goldenZoneImg from "@/assets/golden-zone-diagram.png";

interface GoldenZoneDiagramProps {
  className?: string;
}

const GoldenZoneDiagram = ({ className }: GoldenZoneDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Gyllene zonen & Assistytor
      </h4>
      
      <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl border border-border">
        <img 
          src={goldenZoneImg} 
          alt="Gyllene zonen och assistytor" 
          className="w-full h-auto"
        />
      </div>
      
      {/* Legend below */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-500/50 border border-yellow-500" />
          <span className="text-xs text-foreground font-medium">Gyllene zonen – cutback-mål</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-muted border border-border" />
          <span className="text-xs text-muted-foreground">Assistytor – kortsida för inlägg</span>
        </div>
      </div>
      
      {/* Note */}
      <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <p className="text-xs text-accent font-medium text-center">
          <strong>Mål:</strong> Kortsidan i assistytan → cutback till gyllene zonen
        </p>
      </div>
    </div>
  );
};

export default GoldenZoneDiagram;
