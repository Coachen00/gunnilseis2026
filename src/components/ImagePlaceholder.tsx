import { useState } from "react";
import { ImageOff, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  title: string;
  description?: string;
  className?: string;
  compact?: boolean;
  src?: string;
  alt?: string;
}

const ImagePlaceholder = ({ title, description, className, compact = false, src, alt }: ImagePlaceholderProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!src) {
    return (
      <div className={cn("relative overflow-hidden rounded-md border border-dashed border-kedja-border bg-kedja-paper px-4 py-5", compact ? "min-h-28" : "min-h-40", className)}>
        <div className="absolute inset-x-0 top-0 h-1 bg-kedja-lime" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <ImageOff className="h-4 w-4 flex-shrink-0 text-kedja-green" strokeWidth={1.75} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-green">Bildmaterial saknas</p>
            <p className="mt-1 text-sm font-bold leading-snug text-foreground">{title}</p>
            {description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setExpanded(true)} className={cn("group block w-full text-left", className)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-border bg-card",
            compact ? "aspect-[4/3]" : "aspect-video"
          )}
        >
          <img
            src={src}
            alt={alt ?? title}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
          />
          <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-background/75 text-muted-foreground backdrop-blur-sm transition group-hover:text-accent">
            <Maximize2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className={cn("font-bold leading-tight text-foreground", compact ? "text-xs" : "text-sm")}>{title}</p>
          {description && !compact && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{description}</p>}
        </div>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-md border border-border bg-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-md bg-background/80 text-muted-foreground transition hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={src} alt={alt ?? title} className="block max-h-[82vh] w-full object-contain bg-background" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePlaceholder;
