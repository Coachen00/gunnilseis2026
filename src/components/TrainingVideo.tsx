import { Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingVideoProps {
  title: string;
  url: string;
  duration?: string;
  className?: string;
}

const getVideoEmbedUrl = (url: string): string | null => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return null;
};

const getVideoThumbnail = (url: string): string | null => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }
  return null;
};

const TrainingVideo = ({ title, url, duration, className }: TrainingVideoProps) => {
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnail = getVideoThumbnail(url);
  
  if (!embedUrl) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all group",
          className
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Play className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          {duration && <p className="text-xs text-muted-foreground">{duration}</p>}
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </a>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
        {thumbnail ? (
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative group"
          >
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              decoding="async"
              width={320}
              height={180}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            {duration && (
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                {duration}
              </span>
            )}
          </a>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
    </div>
  );
};

export default TrainingVideo;
