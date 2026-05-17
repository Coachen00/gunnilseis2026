import { Film, ImageOff, FileText, AlertCircle, Loader2 } from "lucide-react";
import type { PrincipleDef } from "@/data/majSpelmodell";
import { useBlockMedia, useSignedUrl, youtubeEmbed, type MediaRow } from "@/hooks/useBlockMedia";
import { cn } from "@/lib/utils";

interface BlockMediaGridProps {
  blockId: string;
  principles: PrincipleDef[];
  /** Accent på "Ingen film upplagd"-badge. */
  accent?: "blue" | "red" | "yellow" | "green" | "white";
}

/**
 * BlockMediaGrid — visar ALL filmdata för ett block direkt, utan extra klick.
 *
 * - Spelare ser videor inline.
 * - Saknas film → "Ingen film upplagd ännu" + tydlig instruktion.
 * - Read-only. Redigering ligger kvar i den befintliga admin-vyn.
 */
const BlockMediaGrid = ({ blockId, principles, accent = "white" }: BlockMediaGridProps) => {
  const { byPrinciple, isLoading, isError } = useBlockMedia(blockId);

  if (isLoading) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground inline-flex items-center gap-2" role="status">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Hämtar filmer…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive inline-flex items-center gap-2" role="alert">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        Kunde inte ladda filmer. Försök igen senare.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {principles.map((p) => {
        const row = byPrinciple.get(p.id);
        return <PrincipleMediaTile key={p.id} principle={p} media={row} accent={accent} />;
      })}
    </div>
  );
};

interface TileProps {
  principle: PrincipleDef;
  media?: MediaRow;
  accent: NonNullable<BlockMediaGridProps["accent"]>;
}

const ACCENT_BADGE: Record<TileProps["accent"], string> = {
  blue: "border-sky-300 bg-sky-50 text-sky-700",
  red: "border-rose-300 bg-rose-50 text-rose-700",
  yellow: "border-amber-300 bg-amber-50 text-amber-700",
  green: "border-emerald-300 bg-emerald-50 text-emerald-700",
  white: "border-border bg-card text-foreground/70",
};

const PrincipleMediaTile = ({ principle, media, accent }: TileProps) => {
  // Signed URL endast om vi har en uppladdad fil
  const signed = useSignedUrl(media?.source_kind === "upload" ? media.storage_path : null);
  const hasUrl = media?.source_kind === "url" && Boolean(media.url);
  const hasUpload = media?.source_kind === "upload" && Boolean(signed);
  const hasText = media?.media_type === "text" && (media.text_title || media.text_body);
  const isEmpty = !media || (!hasUrl && !hasUpload && !hasText);
  const previewUrl = hasUpload ? signed : media?.url ?? null;

  return (
    <article className="overflow-hidden rounded-md border border-border bg-card transition-colors">
      <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold leading-tight text-foreground">{principle.label}</h3>
          <p className="mt-0.5 truncate text-xs leading-snug text-muted-foreground">{principle.oneLiner}</p>
        </div>
        <MediaBadge media={media} accent={accent} />
      </header>

      <div className="bg-muted/30">
        {isEmpty && <EmptyMedia />}

        {!isEmpty && media?.media_type === "video" && previewUrl && (
          <VideoPreview url={previewUrl} title={principle.label} isUpload={hasUpload} />
        )}

        {!isEmpty && media?.media_type === "image" && previewUrl && (
          <img
            src={previewUrl}
            alt={principle.label}
            className="aspect-video w-full bg-black object-cover"
            loading="lazy"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}

        {!isEmpty && media?.media_type === "text" && (
          <div className="p-5">
            {media.text_title && <p className="mb-1 text-sm font-bold text-foreground">{media.text_title}</p>}
            {media.text_body && <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">{media.text_body}</p>}
          </div>
        )}
      </div>

      {media?.caption && (
        <p className="border-t border-border bg-background px-4 py-2 text-xs leading-snug text-muted-foreground">
          {media.caption}
        </p>
      )}
    </article>
  );
};

const MediaBadge = ({ media, accent }: { media?: MediaRow; accent: TileProps["accent"] }) => {
  if (!media) {
    return (
      <span className={cn(
        "inline-flex flex-shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]",
        ACCENT_BADGE[accent]
      )}>
        Tom
      </span>
    );
  }
  const Icon = media.media_type === "video" ? Film : media.media_type === "image" ? ImageOff : FileText;
  const label = media.media_type === "video" ? "Film" : media.media_type === "image" ? "Bild" : "Text";
  return (
    <span className={cn(
      "inline-flex flex-shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]",
      "border-foreground/20 bg-background text-foreground/70"
    )}>
      <Icon className="h-3 w-3" aria-hidden="true" /> {label}
    </span>
  );
};

const EmptyMedia = () => (
  <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted/40 px-4 text-center">
    <Film className="h-8 w-8 text-foreground/30" strokeWidth={1.5} aria-hidden="true" />
    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/55">
      Ingen film upplagd ännu
    </p>
    <p className="text-xs leading-snug text-foreground/45">Tränaren lägger upp filmen här när den finns.</p>
  </div>
);

const VideoPreview = ({ url, title, isUpload }: { url: string; title: string; isUpload: boolean }) => {
  const embed = !isUpload ? youtubeEmbed(url) : null;
  if (embed) {
    return (
      <iframe
        src={embed}
        title={title}
        className="aspect-video w-full"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }
  return <video src={url} controls preload="metadata" className="aspect-video w-full bg-black" />;
};

export default BlockMediaGrid;
