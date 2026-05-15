import { useMemo, useState } from "react";
import {
  Calendar,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MEDIA_CATEGORIES,
  categoryLabel,
  type MediaCategory,
  type MediaLibraryItem,
} from "@/data/mediaLibrary";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import MediaUploadForm from "./MediaUploadForm";
import MediaPreview from "./MediaPreview";
import { cn } from "@/lib/utils";

type EditorState =
  | { mode: "closed" }
  | { mode: "create"; defaultCategory: MediaCategory }
  | { mode: "edit"; item: MediaLibraryItem };

interface MediaLibraryManagerProps {
  /** Begränsa till en kategori (för fokuserade vyer). */
  lockedCategory?: MediaCategory;
}

const MediaLibraryManager = ({ lockedCategory }: MediaLibraryManagerProps) => {
  const [filterCategory, setFilterCategory] = useState<MediaCategory | "all">(
    lockedCategory ?? "all",
  );
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });

  const effectiveCategory = lockedCategory ?? (filterCategory === "all" ? undefined : filterCategory);
  const { items, status, error, refresh } = useMediaLibrary({
    category: effectiveCategory,
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.description?.toLowerCase().includes(q) ?? false) ||
        (i.training_label?.toLowerCase().includes(q) ?? false),
    );
  }, [items, query]);

  const handleSaved = async () => {
    setEditor({ mode: "closed" });
    await refresh();
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök titel, beskrivning, träning…"
            className="pl-9"
          />
        </div>

        {!lockedCategory && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filterCategory}
              onValueChange={(v) => setFilterCategory(v as MediaCategory | "all")}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla kategorier</SelectItem>
                {MEDIA_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => refresh()}
          aria-label="Uppdatera"
          title="Uppdatera"
        >
          <RefreshCw className={cn("h-4 w-4", status === "loading" && "animate-spin")} />
        </Button>

        <Button
          onClick={() =>
            setEditor({
              mode: "create",
              defaultCategory: (lockedCategory ?? (filterCategory === "all" ? "anfall" : filterCategory)) as MediaCategory,
            })
          }
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nytt klipp
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <strong className="font-bold">Kunde inte hämta biblioteket. </strong>
          {error}
        </div>
      )}

      {/* Body */}
      {status === "loading" && items.length === 0 ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState onAdd={() => setEditor({ mode: "create", defaultCategory: (lockedCategory ?? "anfall") as MediaCategory })} hasFilter={Boolean(query || filterCategory !== "all")} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={() => setEditor({ mode: "edit", item })}
            />
          ))}
        </ul>
      )}

      {/* Stats row */}
      {status === "ready" && items.length > 0 && (
        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          {filtered.length} av {items.length} klipp visas.
          {items.filter((i) => i.visible_to_players).length > 0 && (
            <> · {items.filter((i) => i.visible_to_players).length} synlig{items.filter((i) => i.visible_to_players).length === 1 ? "t" : "a"} för spelare.</>
          )}
        </p>
      )}

      {/* Editor dialog */}
      <Dialog open={editor.mode !== "closed"} onOpenChange={(open) => !open && setEditor({ mode: "closed" })}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editor.mode === "edit" ? "Redigera klipp" : "Nytt klipp i biblioteket"}
            </DialogTitle>
            <DialogDescription>
              Fyll i titel och kategori, lägg en länk eller ladda upp en fil — och välj om
              spelarna ska se klippet eller bara tränarstaben.
            </DialogDescription>
          </DialogHeader>
          {editor.mode === "edit" && (
            <MediaUploadForm
              initial={editor.item}
              onSaved={handleSaved}
              onDeleted={handleSaved}
              onCancel={() => setEditor({ mode: "closed" })}
            />
          )}
          {editor.mode === "create" && (
            <MediaUploadForm
              defaultCategory={editor.defaultCategory}
              onSaved={handleSaved}
              onCancel={() => setEditor({ mode: "closed" })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function MediaCard({ item, onEdit }: { item: MediaLibraryItem; onEdit: () => void }) {
  const eventDateLabel = item.event_date
    ? new Date(item.event_date).toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <li className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:border-accent/50 hover:shadow-md">
      <MediaPreview item={item} compact />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/80">
              {item.media_type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
              {categoryLabel(item.category)}
            </div>
            <h3 className="text-sm font-bold leading-snug text-foreground">{item.title}</h3>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-accent/60 hover:text-foreground"
            aria-label="Redigera"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {eventDateLabel && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {eventDateLabel}
            </span>
          )}
          {item.training_label && (
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              {item.training_label}
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5",
              item.visible_to_players ? "bg-pitch/15 text-pitch" : "bg-muted text-muted-foreground",
            )}
          >
            {item.visible_to_players ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {item.visible_to_players ? "Spelare ser" : "Bara tränare"}
          </span>
        </div>
      </div>
    </li>
  );
}

function EmptyState({ onAdd, hasFilter }: { onAdd: () => void; hasFilter: boolean }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="max-w-md space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
          <Video className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold">
          {hasFilter ? "Inga klipp matchar filtret" : "Inga klipp i biblioteket än"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {hasFilter
            ? "Justera sökning eller kategori — eller lägg till ett nytt klipp."
            : "Lägg in matchklipp eller träningsmoment så tränare och spelare kan se dem direkt på spelmodell-sidorna."}
        </p>
        <Button onClick={onAdd} className="mt-2">
          <Plus className="mr-1.5 h-4 w-4" />
          {hasFilter ? "Lägg till klipp" : "Lägg till första klippet"}
        </Button>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="overflow-hidden rounded-lg border border-border bg-card">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MediaLibraryManager;
