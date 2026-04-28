import { FileWarning, Image, Maximize2, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  type: "video" | "image";
  title: string;
  description?: string;
  className?: string;
}

const MediaPlaceholder = ({ type, title, description, className }: MediaPlaceholderProps) => {
  const Icon = type === "video" ? Video : Image;
  const tone = type === "video" ? "primary" : "accent";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-4 shadow-sm ring-1 ring-white/[0.03] transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid h-11 w-11 flex-shrink-0 place-items-center rounded-md border",
            tone === "primary" ? "border-primary/25 bg-primary/10 text-primary" : "border-accent/25 bg-accent/10 text-accent"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <FileWarning className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Väntar på {type === "video" ? "film" : "bild"}
            </span>
          </div>
          <p className="text-sm font-black leading-tight text-foreground">{title}</p>
          {description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        <div className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background/50 text-muted-foreground transition group-hover:text-foreground">
          <Maximize2 className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export default MediaPlaceholder;
