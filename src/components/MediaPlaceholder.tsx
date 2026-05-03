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

  return (
    <div className={cn("rounded-md border border-border bg-card/45 p-4", className)}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-bold leading-snug text-foreground">{title}</p>
          {description && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default MediaPlaceholder;
