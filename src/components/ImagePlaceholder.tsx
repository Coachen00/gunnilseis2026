import { useId, useState } from "react";
import { Camera, Film, Maximize2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  title: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

const ImagePlaceholder = ({ title, description, className, compact = false }: ImagePlaceholderProps) => {
  const [expanded, setExpanded] = useState(false);
  const patternId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={cn("group block w-full text-left", className)}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-border/70 bg-card",
            "transition-colors duration-200 group-hover:border-accent/50",
            compact ? "aspect-[4/3]" : "aspect-video"
          )}
        >
          <PitchArc id={patternId} />
          <CornerTicks />

          {/* Top-left type stamp */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
            <span className="block h-1 w-1 rounded-full bg-accent" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Bild · Film
            </span>
          </div>

          {/* Top-right open hint */}
          <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-sm border border-border/60 bg-background/40 text-muted-foreground transition group-hover:border-accent/40 group-hover:text-accent">
            <Maximize2 className="h-3 w-3" strokeWidth={2} />
          </div>

          {/* Centered ghost icon */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-2 opacity-70 transition group-hover:opacity-100">
              <div className="flex items-center gap-1.5 text-muted-foreground/80 transition group-hover:text-foreground">
                <Camera className="h-4 w-4" strokeWidth={1.5} />
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/70">/</span>
                <Film className="h-4 w-4" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Bottom-left status */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Tom slot
            </span>
          </div>
        </div>

        {/* Caption under frame */}
        <div className={cn("mt-2.5", compact && "mt-2")}>
          <p
            className={cn(
              "font-black leading-tight tracking-tight text-foreground",
              compact ? "text-[12px]" : "text-sm"
            )}
          >
            {title}
          </p>
          {description && !compact && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{description}</p>
          )}
        </div>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-md border border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-sm border border-border bg-background/80 text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="border-b border-border/70 px-6 py-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                Mediaslot
              </p>
              <h3 className="mt-1.5 text-xl font-black leading-tight tracking-tight text-foreground">{title}</h3>
              {description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              )}
            </div>

            <div className="grid gap-3 p-6 sm:grid-cols-2">
              <DropZone icon={<Camera className="h-5 w-5" strokeWidth={1.5} />} label="Bild" formats="PNG · JPG · WebP · GIF · HEIC" />
              <DropZone icon={<Film className="h-5 w-5" strokeWidth={1.5} />} label="Film" formats="MP4 · MOV · WebM · AVI · MKV" />
            </div>
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

const DropZone = ({ icon, label, formats }: { icon: React.ReactNode; label: string; formats: string }) => (
  <div className="rounded-md border border-dashed border-border bg-background/40 p-5">
    <div className="mb-3 grid h-8 w-8 place-items-center rounded-sm border border-accent/30 bg-accent/10 text-accent">
      {icon}
    </div>
    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
    <p className="mt-2 text-sm font-bold leading-tight tracking-tight text-foreground">Dra in eller bläddra</p>
    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{formats}</p>
    <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
      <Upload className="h-3 w-3" />
      Ladda upp
    </div>
  </div>
);

export default ImagePlaceholder;
