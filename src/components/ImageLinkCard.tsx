import { useId, useState } from "react";
import { Camera, Link as LinkIcon, Maximize2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLinkCardProps {
  title: string;
  bullet?: string;
  className?: string;
}

const ImageLinkCard = ({ title, bullet, className }: ImageLinkCardProps) => {
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasImage = url.trim().length > 0;
  const showInput = !hasImage || editing;
  const patternId = useId();

  return (
    <>
      <div className={cn("group block w-full", className)}>
        <div className="relative overflow-hidden rounded-md border border-border/70 bg-card aspect-video transition-colors duration-200 hover:border-accent/50">
          {hasImage ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="block h-full w-full"
              aria-label={`Visa ${title}`}
            >
              <img
                src={url}
                alt={title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="pointer-events-none absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-sm border border-border/70 bg-background/70 text-muted-foreground backdrop-blur-sm transition group-hover:border-accent/50 group-hover:text-accent">
                <Maximize2 className="h-3 w-3" />
              </span>
            </button>
          ) : (
            <>
              <PitchArc id={patternId} />
              <CornerTicks />

              <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                <span className="block h-1 w-1 rounded-full bg-accent" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  Bildlänk
                </span>
              </div>

              <div className="absolute inset-0 grid place-items-center">
                <Camera className="h-5 w-5 text-muted-foreground/70" strokeWidth={1.5} />
              </div>

              <div className="absolute bottom-2.5 left-2.5">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  Klistra in URL nedan
                </span>
              </div>
            </>
          )}

          {hasImage && !editing && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-sm border border-border/70 bg-background/70 text-muted-foreground backdrop-blur-sm transition hover:border-accent/50 hover:text-accent"
              aria-label="Ändra länk"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="mt-2.5">
          <h4 className="text-sm font-black leading-tight tracking-tight text-foreground">{title}</h4>
          {bullet && <p className="mt-1 text-xs leading-snug text-muted-foreground">{bullet}</p>}
        </div>

        {/* URL input — collapsed when image is present */}
        {showInput && (
          <div className="mt-2 flex items-center gap-2 rounded-md border border-border/70 bg-card px-2.5 py-2 transition focus-within:border-accent/50">
            <LinkIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => hasImage && setEditing(false)}
              placeholder="https://..."
              className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            {hasImage && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent hover:text-foreground"
              >
                Klart
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && hasImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute -top-10 right-0 grid h-7 w-7 place-items-center rounded-sm border border-border bg-background/80 text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <img
              src={url}
              alt={title}
              decoding="async"
              className="max-h-[84vh] w-full rounded-md border border-border bg-black object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

const PitchArc = ({ id }: { id: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 200 120"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 h-full w-full text-muted-foreground/10"
  >
    <defs>
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="200" height="120" fill={`url(#${id})`} />
    <path d="M 100 0 V 120" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="100" cy="60" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const CornerTicks = () => (
  <>
    <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-accent/50" />
    <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-accent/50" />
    <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-accent/50" />
    <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent/50" />
  </>
);

export default ImageLinkCard;
