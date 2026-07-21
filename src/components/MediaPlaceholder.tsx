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
    <div className={cn("relative overflow-hidden rounded-md border border-dashed border-kedja-border bg-kedja-paper px-4 py-5", className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-kedja-lime" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 flex-shrink-0 text-kedja-green" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-green">{label} saknas</p>
          <p className="mt-1 text-sm font-bold leading-snug text-foreground">{title}</p>
          {description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default MediaPlaceholder;
