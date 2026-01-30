import { cn } from "@/lib/utils";
import { Video, Image, FileWarning } from "lucide-react";

interface MediaPlaceholderProps {
  type: "video" | "image";
  title: string;
  description?: string;
  className?: string;
}

const MediaPlaceholder = ({ type, title, description, className }: MediaPlaceholderProps) => {
  const Icon = type === "video" ? Video : Image;
  
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed",
      type === "video" 
        ? "border-primary/30 bg-primary/5" 
        : "border-accent/30 bg-accent/5",
      className
    )}>
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center",
        type === "video" ? "bg-primary/20" : "bg-accent/20"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          type === "video" ? "text-primary" : "text-accent"
        )} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            TODO: {type === "video" ? "Lägg till film" : "Lägg till bild"}
          </span>
        </div>
        <p className={cn(
          "text-sm font-semibold mt-1",
          type === "video" ? "text-primary" : "text-accent"
        )}>
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MediaPlaceholder;
