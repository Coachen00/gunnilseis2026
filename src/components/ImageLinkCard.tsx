import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image, X, Link } from "lucide-react";

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
      <div className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
        <div className="p-5">
          <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
          {bullet && <p className="text-xs text-muted-foreground mb-3">{bullet}</p>}
          
          <div className="flex items-center gap-2 mb-3">
            <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Klistra in bildlänk"
              className="flex-1 text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {hasImage ? (
            <button onClick={() => setExpanded(true)} className="w-full cursor-pointer">
              <img
                src={url}
                alt={title}
                className="w-full h-40 object-cover rounded-lg border border-border hover:opacity-90 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </button>
          ) : (
            <div className="w-full h-32 rounded-lg bg-muted/30 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center gap-2">
              <Image className="w-5 h-5 text-muted-foreground/40" />
              <span className="text-xs text-muted-foreground/60">Klistra in bildlänk</span>
            </div>
          )}
        </div>
      </div>

      {expanded && hasImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" onClick={() => setExpanded(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpanded(false)} className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
              <X className="w-4 h-4" />
            </button>
            <img src={url} alt={title} className="w-full rounded-xl border border-border" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageLinkCard;
