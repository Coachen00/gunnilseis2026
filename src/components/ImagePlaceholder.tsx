import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image, Video, X, ZoomIn } from "lucide-react";

interface ImagePlaceholderProps {
  title: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

const ImagePlaceholder = ({ title, description, className, compact = false }: ImagePlaceholderProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-left w-full",
          compact ? "p-3 min-h-[80px]" : "p-6 min-h-[120px]",
          className
        )}
      >
        <div className={cn("rounded-lg bg-primary/20 flex items-center justify-center", compact ? "w-8 h-8" : "w-10 h-10")}>
          <Image className={cn("text-primary", compact ? "w-4 h-4" : "w-5 h-5")} />
        </div>
        <p className={cn("font-bold uppercase tracking-wider text-primary text-center", compact ? "text-[10px]" : "text-xs")}>{title}</p>
        {description && !compact && (
          <p className="text-xs text-muted-foreground text-center">{description}</p>
        )}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Video className="w-3 h-3 text-muted-foreground" />
          <Image className="w-3 h-3 text-muted-foreground" />
          <ZoomIn className="w-3 h-3 text-primary" />
        </div>
      </button>

      {expanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setExpanded(false)}
        >
          <div className="relative bg-card rounded-xl border border-border p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setExpanded(false)} 
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Image className="w-7 h-7 text-primary" />
                </div>
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Video className="w-7 h-7 text-accent" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground text-center">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground text-center">{description}</p>
              )}
              <p className="text-xs text-muted-foreground italic text-center mt-2">
                Platshållare — ladda upp bild eller film här
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePlaceholder;
