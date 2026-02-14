import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image, X, ZoomIn } from "lucide-react";

interface ImagePlaceholderProps {
  title: string;
  description?: string;
  className?: string;
}

const ImagePlaceholder = ({ title, description, className }: ImagePlaceholderProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-left w-full min-h-[120px]",
          className
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Image className="w-5 h-5 text-primary" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-primary text-center">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground text-center">{description}</p>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4 text-primary" />
        </div>
      </button>

      {/* Fullscreen overlay */}
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
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <Image className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground text-center">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground text-center">{description}</p>
              )}
              <p className="text-xs text-muted-foreground italic text-center mt-2">
                Platshållare — ladda upp bild här
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePlaceholder;
