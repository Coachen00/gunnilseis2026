import { useId } from "react";
import { Camera, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  type: "video" | "image";
  title: string;
  description?: string;
  className?: string;
}

const MediaPlaceholder = ({ type, title, description, className }: MediaPlaceholderProps) => {
  const Icon = type === "video" ? Film : Camera;
  const label = type === "video" ? "Film" : "Bild";
  const patternId = useId();

  return (
    <div className={cn("group block w-full", className)}>
      <div className="relative overflow-hidden rounded-md border border-border/70 bg-card aspect-video transition-colors duration-200 hover:border-accent/50">
        <PitchArc id={patternId} />
        <CornerTicks />

        {/* Top-left type stamp */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="block h-1 w-1 rounded-full bg-accent" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
            {label}
          </span>
        </div>

        {/* Centered icon */}
        <div className="absolute inset-0 grid place-items-center">
          <Icon className="h-5 w-5 text-muted-foreground/70" strokeWidth={1.5} />
        </div>

        {/* Bottom-left status */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Väntar på {label.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="mt-2.5">
        <p className="text-sm font-black leading-tight tracking-tight text-foreground">{title}</p>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
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

export default MediaPlaceholder;
