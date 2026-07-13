import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MEDIA_CATEGORIES,
  MEDIA_IMAGE_ACCEPT,
  MEDIA_VIDEO_ACCEPT,
  MEDIA_DESCRIPTION_MAX,
  MEDIA_MAX_FILE_SIZE,
  MEDIA_TITLE_MAX,
  type MediaCategory,
  type MediaLibraryDraft,
  type MediaLibraryItem,
} from "@/data/mediaLibrary";
import {
  createMediaLibraryItem,
  deleteMediaLibraryItem,
  updateMediaLibraryItem,
  uploadMediaFile,
} from "@/hooks/useMediaLibrary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MediaUploadFormProps {
  /** Initial värde — om satt = redigera, annars skapa nytt. */
  initial?: MediaLibraryItem | null;
  /** Default-kategori i create-läget. */
  defaultCategory?: MediaCategory;
  /** Anropas när raden är sparad/uppdaterad/borttagen. */
  onSaved?: (item: MediaLibraryItem) => void;
  onDeleted?: (id: string) => void;
  /** Stäng formuläret. */
  onCancel?: () => void;
}

type FormErrors = Partial<Record<keyof MediaLibraryDraft | "file", string>>;

const MediaUploadForm = ({
  initial,
  defaultCategory = "anfall",
  onSaved,
  onDeleted,
  onCancel,
}: MediaUploadFormProps) => {
  const isEdit = Boolean(initial);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<MediaCategory>(
    (initial?.category as MediaCategory) ?? defaultCategory,
  );
  const [mediaType, setMediaType] = useState<"video" | "image">(
    initial?.media_type ?? "video",
  );
  const [sourceKind, setSourceKind] = useState<"url" | "upload">(
    initial?.source_kind ?? "url",
  );
  const [url, setUrl] = useState(initial?.url ?? "");
  const [storagePath, setStoragePath] = useState<string | null>(initial?.storage_path ?? null);
  const [trainingLabel, setTrainingLabel] = useState(initial?.training_label ?? "");
  const [eventDate, setEventDate] = useState<string>(initial?.event_date ?? "");
  const [visibleToPlayers, setVisibleToPlayers] = useState<boolean>(
    initial?.visible_to_players ?? false,
  );
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ fraction: number; label: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset confirm-state om initial byts ut
  useEffect(() => {
    setConfirmDelete(false);
  }, [initial?.id]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!title.trim()) {
      e.title = "Titel krävs.";
    } else if (title.length > MEDIA_TITLE_MAX) {
      e.title = `Max ${MEDIA_TITLE_MAX} tecken.`;
    }
    if (description && description.length > MEDIA_DESCRIPTION_MAX) {
      e.description = `Max ${MEDIA_DESCRIPTION_MAX} tecken.`;
    }
    if (sourceKind === "url") {
      if (!url.trim()) {
        e.url = "Klistra in en länk eller byt till uppladdning.";
      } else if (!/^https?:\/\//i.test(url.trim())) {
        e.url = "Länken måste börja med http:// eller https://";
      }
    } else if (sourceKind === "upload") {
      if (!isEdit && !pickedFile) {
        e.file = "Välj en fil att ladda upp.";
      } else if (pickedFile) {
        if (pickedFile.size > MEDIA_MAX_FILE_SIZE) {
          e.file = `Filen är för stor (max ${Math.round(MEDIA_MAX_FILE_SIZE / 1024 / 1024)} MB).`;
        }
        const isVideo = pickedFile.type.startsWith("video/");
        const isImage = pickedFile.type.startsWith("image/");
        if (mediaType === "video" && !isVideo) {
          e.file = "Välj en filmfil (MP4, MOV, WebM, MKV eller MPEG).";
        }
        if (mediaType === "image" && !isImage) {
          e.file = "Välj en bildfil (PNG, JPG, WebP, GIF eller HEIC).";
        }
      }
    }
    if (eventDate) {
      const d = new Date(eventDate);
      if (Number.isNaN(d.getTime())) {
        e.event_date = "Ogiltigt datum.";
      } else if (d > new Date(Date.now() + 24 * 3600 * 1000)) {
        e.event_date = "Datumet ligger i framtiden — sätt ett historiskt datum.";
      }
    }
    return e;
  };

  const handleFilePick = (file: File) => {
    setPickedFile(file);
    // Auto-derive media type från filtypen
    if (file.type.startsWith("video/")) setMediaType("video");
    else if (file.type.startsWith("image/")) setMediaType("image");
    setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("Kontrollera fälten", {
        description: Object.values(v).filter(Boolean).join(" · "),
      });
      return;
    }

    setSaving(true);
    try {
      let finalStoragePath: string | null = storagePath;
      let finalUrl: string | null = url.trim() || null;

      if (sourceKind === "upload" && pickedFile) {
        setUploadProgress({ fraction: 0.1, label: "Förbereder…" });
        const up = await uploadMediaFile(category, pickedFile, setUploadProgress);
        if ("error" in up) {
          setServerError(up.error);
          toast.error("Uppladdning misslyckades", { description: up.error });
          setUploadProgress(null);
          setSaving(false);
          return;
        }
        finalStoragePath = up.storagePath;
        finalUrl = null;
      } else if (sourceKind === "url") {
        finalStoragePath = null;
      }

      const draft: MediaLibraryDraft = {
        title: title.trim(),
        description: description.trim() || null,
        category,
        media_type: mediaType,
        source_kind: sourceKind,
        url: finalUrl,
        storage_path: finalStoragePath,
        training_label: trainingLabel.trim() || null,
        event_date: eventDate || null,
        visible_to_players: visibleToPlayers,
      };

      const result = isEdit && initial
        ? await updateMediaLibraryItem(initial.id, draft)
        : await createMediaLibraryItem(draft);

      if ("error" in result) {
        setServerError(result.error);
        toast.error(isEdit ? "Kunde inte uppdatera" : "Kunde inte spara", {
          description: result.error,
        });
        return;
      }

      toast.success(isEdit ? "Uppdaterat" : "Tillagt i biblioteket", {
        description: result.item.title,
      });
      onSaved?.(result.item);
    } finally {
      setUploadProgress(null);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      window.setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    setSaving(true);
    const res = await deleteMediaLibraryItem(initial);
    setSaving(false);
    if ("error" in res) {
      toast.error("Kunde inte ta bort", { description: res.error });
      return;
    }
    toast.success("Borttagen");
    onDeleted?.(initial.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Titel */}
      <div className="space-y-1.5">
        <Label htmlFor="media-title" className="text-xs font-bold uppercase tracking-wider">
          Titel <span className="text-destructive">*</span>
        </Label>
        <Input
          id="media-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Kontringsskydd när vi tappar i sista tredjedelen"
          maxLength={MEDIA_TITLE_MAX + 20}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      {/* Beskrivning */}
      <div className="space-y-1.5">
        <Label htmlFor="media-description" className="text-xs font-bold uppercase tracking-wider">
          Kort beskrivning
        </Label>
        <Textarea
          id="media-description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Vad visar klippet? Vilken princip illustrerar det?"
          maxLength={MEDIA_DESCRIPTION_MAX + 50}
          aria-invalid={Boolean(errors.description)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{errors.description}</span>
          <span>{(description ?? "").length} / {MEDIA_DESCRIPTION_MAX}</span>
        </div>
      </div>

      {/* Kategori + datum */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="media-category" className="text-xs font-bold uppercase tracking-wider">
            Kategori <span className="text-destructive">*</span>
          </Label>
          <Select value={category} onValueChange={(v) => setCategory(v as MediaCategory)}>
            <SelectTrigger id="media-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="media-event-date" className="text-xs font-bold uppercase tracking-wider">
            Datum för händelsen
          </Label>
          <Input
            id="media-event-date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            aria-invalid={Boolean(errors.event_date)}
          />
          {errors.event_date && <p className="text-xs text-destructive">{errors.event_date}</p>}
        </div>
      </div>

      {/* Träning/Match-label */}
      <div className="space-y-1.5">
        <Label htmlFor="media-training" className="text-xs font-bold uppercase tracking-wider">
          Match eller träning (frivilligt)
        </Label>
        <Input
          id="media-training"
          value={trainingLabel}
          onChange={(e) => setTrainingLabel(e.target.value)}
          placeholder='T.ex. "Tisdag 14 maj — 1 mot 1" eller "Match: Häcken hemma"'
        />
      </div>

      {/* Media-typ */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider">Mediatyp</Label>
        <div className="inline-flex rounded-md border border-border bg-card p-0.5">
          <MediaTypePill
            active={mediaType === "video"}
            onClick={() => setMediaType("video")}
            icon={<Video className="h-3.5 w-3.5" />}
            label="Film"
          />
          <MediaTypePill
            active={mediaType === "image"}
            onClick={() => setMediaType("image")}
            icon={<ImageIcon className="h-3.5 w-3.5" />}
            label="Bild"
          />
        </div>
      </div>

      {/* Källa */}
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider">Källa</Label>
        <div className="inline-flex rounded-md border border-border bg-card p-0.5">
          <MediaTypePill
            active={sourceKind === "url"}
            onClick={() => setSourceKind("url")}
            icon={<LinkIcon className="h-3.5 w-3.5" />}
            label="Extern länk"
          />
          <MediaTypePill
            active={sourceKind === "upload"}
            onClick={() => setSourceKind("upload")}
            icon={<Upload className="h-3.5 w-3.5" />}
            label="Ladda upp fil"
          />
        </div>

        {sourceKind === "url" ? (
          <div className="space-y-1">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube-länk, Vimeo eller direkt URL"
              aria-invalid={Boolean(errors.url)}
            />
            {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
            <p className="text-xs text-muted-foreground">
              Stöd: YouTube, Vimeo, direkta video-/bild-URL:er.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === "video" ? MEDIA_VIDEO_ACCEPT : MEDIA_IMAGE_ACCEPT}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFilePick(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed px-3 text-sm font-bold transition",
                pickedFile
                  ? "border-accent/60 bg-accent/5 text-accent"
                  : "border-primary/35 bg-primary/5 text-primary hover:bg-primary/10",
              )}
            >
              <Upload className="h-4 w-4" />
              {pickedFile ? `Vald fil: ${pickedFile.name}` : `Välj ${mediaType === "video" ? "filmfil" : "bildfil"}`}
            </button>
            {pickedFile && (
              <p className="text-xs text-muted-foreground">
                {formatBytes(pickedFile.size)} · {pickedFile.type || "okänd typ"}
              </p>
            )}
            {!pickedFile && isEdit && storagePath && (
              <p className="text-xs text-muted-foreground">
                Befintlig fil sparas. Välj ny fil för att ersätta.
              </p>
            )}
            {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
            <p className="text-xs text-muted-foreground">
              Max storlek: {Math.round(MEDIA_MAX_FILE_SIZE / 1024 / 1024)} MB.{" "}
              {mediaType === "video"
                ? "MP4 fungerar bäst i alla webbläsare."
                : "JPG eller WebP är minst."}
            </p>
          </div>
        )}
      </div>

      {/* Synlig för spelare */}
      <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-card/40 p-4">
        <div>
          <Label htmlFor="media-visible" className="text-sm font-bold">
            Synlig för spelare
          </Label>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Av: bara tränare ser klippet. På: spelare som loggat in ser det på spelmodell-sidan.
          </p>
        </div>
        <Switch
          id="media-visible"
          checked={visibleToPlayers}
          onCheckedChange={setVisibleToPlayers}
        />
      </div>

      {/* Upload progress */}
      {uploadProgress && (
        <div className="rounded-md border border-border bg-card/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-2 text-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {uploadProgress.label}
            </span>
            <span className="tabular text-muted-foreground">
              {Math.round(uploadProgress.fraction * 100)} %
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-muted">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${uploadProgress.fraction * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            <strong className="font-bold">Något gick fel.</strong> {serverError}
          </span>
        </div>
      )}

      {/* Action row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <div className="flex items-center gap-2">
          {isEdit && (
            <Button
              type="button"
              variant={confirmDelete ? "destructive" : "outline"}
              size="sm"
              onClick={handleDelete}
              disabled={saving}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {confirmDelete ? "Bekräfta — ta bort" : "Ta bort"}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
              Avbryt
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Sparar…
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                {isEdit ? "Spara ändringar" : "Lägg till"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

function MediaTypePill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default MediaUploadForm;
