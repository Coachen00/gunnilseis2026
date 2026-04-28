import { useState } from "react";
import { Image, Link, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLinkCardProps {
  title: string;
  bullet?: string;
  className?: string;
}

const ImageLinkCard = ({ title, bullet, className }: ImageLinkCardProps) => {
  const [url, setUrl] = useState("");
  const [expanded, setExpanded] = useState(false);
  const hasImage = url.trim().length > 0;

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 shadow-sm ring-1 ring-white/[0.03] transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div className="p-4">
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
              <Image className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black leading-tight text-foreground">{title}</h4>
              {bullet && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{bullet}</p>}
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-md border border-border bg-background/60 text-muted-foreground">
              <Link className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Klistra in bildlänk"
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background/70 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {hasImage ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="relative block w-full overflow-hidden rounded-md border border-border bg-black"
            >
              <img
                src={url}
                alt={title}
                className="h-40 w-full object-cover transition duration-200 group-hover:scale-[1.01]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md border border-border bg-background/80 text-muted-foreground backdrop-blur transition hover:text-foreground">
                <Maximize2 className="h-3.5 w-3.5" />
              </div>
            </button>
          ) : (
            <div className="relative flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-primary/25 bg-background/45 text-center">
              <div
                className="absolute inset-0 opacity-35"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, hsl(var(--primary) / 0.16) 1px, transparent 1px), linear-gradient(0deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <Image className="relative mb-2 h-5 w-5 text-primary" />
              <span className="relative text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
                Bildlänk
              </span>
            </div>
          )}
        </div>
      </div>

      {expanded && hasImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setExpanded(false)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute -top-11 right-0 grid h-8 w-8 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground transition hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={url} alt={title} className="max-h-[84vh] w-full rounded-lg border border-border object-contain bg-black" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageLinkCard;
