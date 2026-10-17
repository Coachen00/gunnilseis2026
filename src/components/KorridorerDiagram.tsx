import { cn } from "@/lib/utils";
import korridorerImage from "@/assets/korridorer-diagram.png";

interface KorridorerDiagramProps {
  className?: string;
}

const KorridorerDiagram = ({ className }: KorridorerDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Korridorer (bredd)
      </h4>
      
      <div className="relative w-full max-w-xs mx-auto">
        {/* Planbild från designsystemet — korridorbredderna (13,84 / 11 / 18,32 m av 68 m)
            och namnen är inbakade i bilden, se docs/specs/planindelning.md. */}
        <img
          src={korridorerImage}
          alt="Korridorer — V. Yttre, V. Inre, Central, H. Inre, H. Yttre"
          className="w-full h-auto rounded-lg border border-border"
        />

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
