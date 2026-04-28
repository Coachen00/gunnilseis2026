import { useState } from "react";
import { Image, Maximize2, Upload, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
        type="button"
        onClick={() => setExpanded(true)}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 text-left shadow-sm ring-1 ring-white/[0.03] transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
          compact ? "min-h-[112px] p-3" : "min-h-[150px] p-5",
          className
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px), linear-gradient(0deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex h-full flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
              <Image className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background/60 p-1 text-muted-foreground opacity-80 transition group-hover:text-foreground group-hover:opacity-100">
              <Video className="h-3 w-3" />
              <Image className="h-3 w-3" />
              <Maximize2 className="h-3 w-3 text-primary" />
            </div>
          </div>

          <div className="relative">
            <p className={cn("font-black uppercase tracking-[0.16em] text-foreground", compact ? "text-[11px]" : "text-xs")}>
              {title}
            </p>
            {description && !compact && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
            )}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded border border-primary/25 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Upload className="h-3 w-3" />
              Media
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setExpanded(false)}>
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl ring-1 ring-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/20 via-accent to-primary/20" />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground transition hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              <div className="mb-6 flex items-start gap-3 pr-12">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                  <Image className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black leading-tight text-foreground">{title}</h3>
                  {description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-5">
                  <Image className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-xs font-black uppercase tracking-wider text-foreground">Bildplats</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">PNG, JPG/JPEG, WebP, GIF eller HEIC.</p>
                </div>
                <div className="rounded-lg border border-dashed border-accent/30 bg-accent/5 p-5">
                  <Video className="mb-3 h-6 w-6 text-accent" />
                  <p className="text-xs font-black uppercase tracking-wider text-foreground">Filmplats</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">MP4, MOV, WebM, AVI, MKV eller MPEG.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePlaceholder;
