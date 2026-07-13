import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, PlayCircle, Video } from "lucide-react";
import { getSignedMediaUrl } from "@/hooks/useMediaLibrary";
import type { MediaLibraryItem } from "@/data/mediaLibrary";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  item: MediaLibraryItem;
  /** Compact thumbnail-rendering — för listor och kort. */
  compact?: boolean;
  className?: string;
}

/**
 * Visar uppladdat eller länkat innehåll. Hanterar YouTube/Vimeo-embed
 * och signed URLs. Diskreta loading/empty/error-states.
 */
const MediaPreview = ({ item, compact = false, className }: MediaPreviewProps) => {
  const [signed, setSigned] = useState<string | null>(null);
  const [loading, setLoading] = useState(item.source_kind === "upload");
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (item.source_kind === "upload" && item.storage_path) {
      setLoading(true);
      getSignedMediaUrl(item.storage_path).then((url) => {
        if (cancelled) return;
        setSigned(url);
        setLoading(false);
      });
    } else {
      setLoading(false);
      setSigned(null);
    }
    return () => {
      cancelled = true;
    };
  }, [item.source_kind, item.storage_path]);

  const src = item.source_kind === "upload" ? signed : item.url;
  const youtube = item.url ? toYouTubeEmbed(item.url) : null;
  const vimeo = item.url ? toVimeoEmbed(item.url) : null;

  const containerClass = cn(
    "relative overflow-hidden rounded-md border border-border bg-black",
    compact ? "aspect-video" : "aspect-video w-full",
    className,
  );

  if (loading) {
    return (
      <div className={cn(containerClass, "grid place-items-center bg-muted/40")}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!src) {
    return (
      <div
        className={cn(containerClass, "grid place-items-center border-dashed bg-muted/40 text-muted-foreground")}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          {item.media_type === "video" ? (
            <Video className="h-6 w-6" />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
          <p className="text-xs">Källa saknas — redigera posten.</p>
        </div>
      </div>
    );
  }

  // Bild
  if (item.media_type === "image") {
    return (
      <div className={containerClass}>
        <img
          src={src}
          alt={item.title}
          className="h-full w-full object-cover"
          onError={() => setEmbedError(true)}
        />
        {embedError && (
          <div className="absolute inset-0 grid place-items-center bg-black/70 text-xs text-white">
            Bilden kunde inte laddas.
          </div>
        )}
      </div>
    );
  }

  // Video — uppladdad
  if (item.source_kind === "upload") {
    return (
      <div className={containerClass}>
        <video
          src={src}
          controls
          preload="metadata"
          className="h-full w-full bg-black"
          onError={() => setEmbedError(true)}
        />
        {embedError && (
          <div className="absolute inset-0 grid place-items-center bg-black/70 text-xs text-white">
            Filen kunde inte spelas upp.
          </div>
        )}
      </div>
    );
  }

  // Video — YouTube/Vimeo embed
  const embed = youtube ?? vimeo;
  if (embed) {
    return (
      <div className={containerClass}>
        <iframe
          src={embed}
          title={item.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Video — direkt URL
  return (
    <div className={containerClass}>
      <video
        src={src}
        controls
        preload="metadata"
        className="h-full w-full bg-black"
        onError={() => setEmbedError(true)}
      />
      {embedError && (
        <div className="absolute inset-0 grid place-items-center bg-black/70 px-4 text-center text-xs text-white">
          <div className="space-y-2">
            <p>Klippet kunde inte spelas upp direkt.</p>
            <a
              href={item.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-accent/50 bg-accent/10 px-3 py-1.5 text-accent"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Öppna i ny flik
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function toYouTubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function toVimeoEmbed(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

export default MediaPreview;
