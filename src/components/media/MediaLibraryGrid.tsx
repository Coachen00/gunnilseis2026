import { useMemo, useState } from "react";
import { Calendar, Maximize2, X, Sparkles, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import {
  categoryLabel,
  type MediaCategory,
  type MediaLibraryItem,
} from "@/data/mediaLibrary";
import MediaPreview from "./MediaPreview";
import { cn } from "@/lib/utils";

interface MediaLibraryGridProps {
  /** Begränsa till en kategori — t.ex. "anfall" på Anfalls-sidan. */
  category: MediaCategory;
  /** Max antal klipp att visa. Resten döljs bakom "Visa alla". */
  limit?: number;
  /** Visa även klipp som inte är publika (för admin/tränar-läge). */
  showAll?: boolean;
  /** Rubrik för sektionen (default: "Filmer & klipp"). */
  heading?: string;
  /** Eyebrow ovanför rubriken (default: kategori-etikett). */
  eyebrow?: string;
  /** Subtitle under rubriken. */
  subtitle?: string;
  className?: string;
}

/**
 * Visar publicerade media-klipp för en given kategori. Klick på ett kort
 * öppnar en stor preview-dialog. Reflekterar tystnad om inga klipp finns
 * (med pedagogisk empty state) och visar skeletons under load.
 */
const MediaLibraryGrid = ({
  category,
  limit,
  showAll = false,
  heading = "Filmer & klipp",
  eyebrow,
  subtitle,
  className,
}: MediaLibraryGridProps) => {
  const { items, status, error } = useMediaLibrary({
    category,
    visibleOnly: !showAll,
  });
  const [openItem, setOpenItem] = useState<MediaLibraryItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(() => {
    if (!limit || expanded) return items;
    return items.slice(0, limit);
  }, [items, limit, expanded]);

  if (error) {
    return (
      <section className={cn("rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive", className)}>
        <strong className="font-bold">Filmerna kunde inte laddas.</strong>{" "}
        <span className="opacity-90">{error}</span>
      </section>
    );
  }

  return (
    <section className={cn("space-y-5", className)}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-block w-8 h-[2px] bg-accent" aria-hidden="true" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-accent">
              {eyebrow ?? `${categoryLabel(category)} · Media`}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{heading}</h2>
          {subtitle && (
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </header>

      {status === "loading" && items.length === 0 ? (
        <SkeletonGrid />
      ) : visible.length === 0 ? (
        <EmptyState category={category} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setOpenItem(item)}
                className="group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition hover:-translate-y-px hover:border-accent/60 hover:shadow-md"
              >
                <div className="relative">
                  <MediaPreview item={item} compact />
                  <div className="pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-border bg-background/80 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-sm font-bold leading-snug">{item.title}</h3>
                  {item.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.event_date && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.event_date).toLocaleDateString("sv-SE", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    {item.training_label && (
                      <span className="inline-flex items-center gap-1 text-accent">
                        <Sparkles className="h-3 w-3" />
                        {item.training_label}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {limit && items.length > limit && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex h-9 items-center rounded-sm border border-border bg-card px-4 text-xs font-bold uppercase tracking-wider text-foreground transition hover:border-accent"
          >
            {expanded ? "Visa färre" : `Visa alla (${items.length})`}
          </button>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={Boolean(openItem)} onOpenChange={(open) => !open && setOpenItem(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto p-0">
          {openItem && (
            <div className="flex flex-col">
              <div className="bg-black">
                <MediaPreview item={openItem} />
              </div>
              <div className="space-y-3 p-5">
                <DialogHeader className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      <Video className="h-3 w-3" />
                      {categoryLabel(openItem.category)}
                    </span>
                    {openItem.training_label && (
                      <span className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-accent" />
                        {openItem.training_label}
                      </span>
                    )}
                    {openItem.event_date && (
                      <span className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(openItem.event_date).toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <DialogTitle className="text-2xl">{openItem.title}</DialogTitle>
                </DialogHeader>
                {openItem.description && (
                  <p className="text-sm leading-relaxed text-foreground/90">{openItem.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

function SkeletonGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="overflow-hidden rounded-lg border border-border bg-card">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ category }: { category: MediaCategory }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-12 text-center">
      <div className="max-w-sm space-y-2">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground">
          <Video className="h-4 w-4" />
        </div>
        <p className="text-sm font-bold">Inga klipp än för {categoryLabel(category).toLowerCase()}</p>
        <p className="text-xs text-muted-foreground">
          Tränare lägger till klipp via mediabiblioteket. När ett klipp markeras synligt
          dyker det upp här.
        </p>
      </div>
    </div>
  );
}

export default MediaLibraryGrid;
