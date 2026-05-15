import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FileText, HardDrive, Image as ImageIcon, Link as LinkIcon, Loader2, Trash2, Upload, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  clearLocalSlot,
  loadLocalBlobUrl,
  loadLocalSlot,
  removeLocalBlob,
  saveLocalBlob,
  saveLocalSlot,
} from "@/lib/principleMediaLocal";

type MediaType = "video" | "image" | "text";
type SourceKind = "url" | "upload" | "text";

interface Props {
  blockId: string;
  principleId: string;
  principleLabel: string;
  oneLiner: string;
  /** Disabled = read-only; visa data men dölj save/upload-knappar. */
  disabled?: boolean;
  /** Hidden header = label/oneLiner renderas av en wrapper (t.ex. accordion-trigger). */
  hideHeader?: boolean;
}

const IMAGE_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,video/x-matroska";
const MAX_VIDEO_UPLOAD_BYTES = 500 * 1024 * 1024;
const MAX_IMAGE_UPLOAD_BYTES = 25 * 1024 * 1024;

function videoEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

const PrincipleMediaSlot = ({ blockId, principleId, principleLabel, oneLiner, disabled = false, hideHeader = false }: Props) => {
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [sourceKind, setSourceKind] = useState<SourceKind>("url");
  const [url, setUrl] = useState("");
  const [hasLocalBlob, setHasLocalBlob] = useState(false);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | null>(null);
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Cleanup blob-URL när komponenten unmountas eller URL:en byts
  useEffect(() => {
    return () => {
      if (localBlobUrl) URL.revokeObjectURL(localBlobUrl);
    };
  }, [localBlobUrl]);

  // Load existing data från localStorage + IndexedDB
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const row = loadLocalSlot(blockId, principleId);
        if (cancelled) return;
        if (row) {
          setMediaType(row.media_type);
          setSourceKind(row.source_kind);
          setUrl(row.url ?? "");
          setTextTitle(row.text_title ?? "");
          setTextBody(row.text_body ?? "");
          setCaption(row.caption ?? "");
          if (row.source_kind === "upload" && row.storage_path) {
            const blobUrl = await loadLocalBlobUrl(blockId, principleId);
            if (cancelled) return;
            if (blobUrl) {
              setLocalBlobUrl(blobUrl);
              setHasLocalBlob(true);
            } else {
              // Metadata pekar på upload men blob finns inte (annan device eller cleared) — visa vänligt
              setHasLocalBlob(false);
            }
          }
        }
      } catch (err) {
        console.error(`[PrincipleMediaSlot] load failed for ${blockId}/${principleId}:`, err);
        if (!cancelled) setErrorMsg("Kunde inte ladda sparad data från lokal lagring.");
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [blockId, principleId]);

  const flashSaved = () => {
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 1500);
  };

  function persist(patch: Partial<{
    media_type: MediaType;
    source_kind: SourceKind;
    url: string | null;
    storage_path: string | null;
    text_title: string | null;
    text_body: string | null;
    caption: string | null;
  }>) {
    if (disabled) return;
    try {
      saveLocalSlot(blockId, principleId, patch);
      setErrorMsg(null);
      flashSaved();
    } catch (err) {
      console.error(`[PrincipleMediaSlot] persist failed:`, err);
      const msg = err instanceof Error ? err.message : "Kunde inte spara i lokal lagring.";
      setErrorMsg(
        msg.includes("quota") || msg.includes("QuotaExceeded")
          ? "Lokal lagring är full. Rensa gamla uppladdningar eller använd en länk istället."
          : msg
      );
    }
  }

  async function handleUpload(file: File) {
    if (disabled) return;
    setUploading(true);
    setErrorMsg(null);

    const detectedType: MediaType | null = file.type.startsWith("video/")
      ? "video"
      : file.type.startsWith("image/")
        ? "image"
        : null;

    if (!detectedType) {
      setErrorMsg("Filen måste vara en bild eller film i ett vanligt webbformat.");
      setUploading(false);
      return;
    }

    const maxBytes = detectedType === "video" ? MAX_VIDEO_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
    if (file.size > maxBytes) {
      const limitMb = Math.round(maxBytes / 1024 / 1024);
      setErrorMsg(`Filen är för stor. Max ${limitMb} MB för ${detectedType === "video" ? "film" : "bild"}.`);
      setUploading(false);
      return;
    }

    try {
      // Spara blob i IndexedDB
      const storagePath = await saveLocalBlob(blockId, principleId, file);
      // Skapa preview-URL
      if (localBlobUrl) URL.revokeObjectURL(localBlobUrl);
      const blobUrl = URL.createObjectURL(file);
      setLocalBlobUrl(blobUrl);
      setHasLocalBlob(true);
      setSourceKind("upload");
      setMediaType(detectedType);
      persist({
        source_kind: "upload",
        storage_path: storagePath,
        url: null,
        media_type: detectedType,
      });
    } catch (err) {
      console.error(`[PrincipleMediaSlot] upload failed:`, err);
      const msg = err instanceof Error ? err.message : "Uppladdningen misslyckades.";
      setErrorMsg(
        msg.includes("quota") || msg.includes("QuotaExceeded")
          ? "Lokal lagring är full. Komprimera filen eller rensa gamla uppladdningar."
          : msg
      );
    } finally {
      setUploading(false);
    }
  }

  async function clearMedia() {
    if (disabled) return;
    try {
      if (hasLocalBlob) await removeLocalBlob(blockId, principleId);
    } catch (err) {
      console.warn(`[PrincipleMediaSlot] could not remove blob:`, err);
    }
    if (localBlobUrl) URL.revokeObjectURL(localBlobUrl);
    setLocalBlobUrl(null);
    setHasLocalBlob(false);
    setUrl("");
    setTextTitle("");
    setTextBody("");
    setCaption("");
    clearLocalSlot(blockId, principleId);
    setErrorMsg(null);
    flashSaved();
  }

  const setTypeAndPersist = (t: MediaType) => {
    setMediaType(t);
    const nextSource: SourceKind = t === "text" ? "text" : sourceKind === "text" ? "url" : sourceKind;
    setSourceKind(nextSource);
    persist({ media_type: t, source_kind: nextSource });
  };

  const setSourceAndPersist = (s: SourceKind) => {
    setSourceKind(s);
    persist({ source_kind: s });
  };

  const previewSrc = sourceKind === "upload" ? localBlobUrl : url;
  const hasMedia = mediaType === "text" ? Boolean(textTitle || textBody) : Boolean(previewSrc);

  const typeButton = (value: MediaType, Icon: typeof Video, label: string) => (
    <button
      type="button"
      onClick={() => setTypeAndPersist(value)}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded px-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
        mediaType === value
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );

  const sourceButton = (value: SourceKind, Icon: typeof LinkIcon, label: string) => (
    <button
      type="button"
      onClick={() => setSourceAndPersist(value)}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded px-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
        sourceKind === value ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );

  const TypeButtons = (
    <div className="inline-flex flex-shrink-0 rounded-md border border-border bg-background/50 p-0.5">
      {typeButton("video", Video, "Film")}
      {typeButton("image", ImageIcon, "Bild")}
      {typeButton("text", FileText, "Kort")}
    </div>
  );

  return (
    <div className={cn(!hideHeader && "rounded-lg border border-border bg-background/50 p-4", hideHeader && "p-0")}>
      {hideHeader ? (
        <div className="mb-3 flex justify-end">{TypeButtons}</div>
      ) : (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-base font-bold leading-snug text-foreground">{principleLabel}</h4>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{oneLiner}</p>
          </div>
          {TypeButtons}
        </div>
      )}

      {/* Lokal lagring-banner */}
      <div
        className="mb-3 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800"
        title="Tills server-databasen är aktiverad sparas allt på denna enhet."
      >
        <HardDrive className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" strokeWidth={2.2} />
        <span>
          <strong className="font-bold">Lokal lagring</strong> · Sparas i denna webbläsare på denna dator.
          Synkas inte mellan enheter än.
        </span>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-3 flex items-start gap-2.5 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-xs leading-relaxed text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2.2} />
          <span>
            <strong className="font-bold">Spara misslyckades.</strong> {errorMsg}
          </span>
        </div>
      )}

      {loading ? (
        <div className="h-20 animate-pulse rounded-md bg-muted/30" />
      ) : (
        <>
          {mediaType !== "text" && (
            <div className="mb-3 inline-flex rounded-md border border-border bg-background/50 p-0.5">
              {sourceButton("url", LinkIcon, "Länk")}
              {sourceButton("upload", Upload, "Ladda upp")}
            </div>
          )}

          {mediaType === "text" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={textTitle}
                onChange={(e) => {
                  const next = e.target.value;
                  setTextTitle(next);
                  persist({ text_title: next || null });
                }}
                onBlur={() => persist({ text_title: textTitle || null })}
                placeholder="Rubrik på kortet"
                disabled={disabled}
                className="h-10 w-full rounded-md border border-border bg-background/70 px-3 text-sm font-bold text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <textarea
                value={textBody}
                onChange={(e) => {
                  const next = e.target.value;
                  setTextBody(next);
                  persist({ text_body: next || null });
                }}
                onBlur={() => persist({ text_body: textBody || null })}
                placeholder="Kort beskrivning eller 1–3 punkter — vad ska spelaren göra?"
                rows={3}
                disabled={disabled}
                className="min-h-[84px] w-full resize-y rounded-md border border-border bg-background/70 px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          ) : sourceKind === "url" ? (
            <input
              type="url"
              value={url}
              onChange={(e) => {
                const next = e.target.value;
                setUrl(next);
                persist({ url: next || null });
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text").trim();
                if (pasted) {
                  e.preventDefault();
                  setUrl(pasted);
                  persist({ url: pasted });
                }
              }}
              onBlur={() => persist({ url: url || null })}
              placeholder={mediaType === "video" ? "YouTube-/Vimeo-länk eller filmens URL" : "Bild-URL"}
              disabled={disabled}
              className="h-10 w-full rounded-md border border-border bg-background/70 px-3 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          ) : (
            <div>
              <input
                ref={fileInput}
                type="file"
                accept={mediaType === "video" ? VIDEO_ACCEPT : IMAGE_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={disabled || uploading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-primary/35 bg-primary/5 px-3 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary/10 disabled:cursor-wait disabled:opacity-70"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploading ? "Sparar lokalt" : `Välj ${mediaType === "video" ? "filmfil" : "bildfil"}`}
              </button>
            </div>
          )}

          {mediaType !== "text" && (
            <textarea
              value={caption}
              onChange={(e) => {
                const next = e.target.value;
                setCaption(next);
                persist({ caption: next || null });
              }}
              onBlur={() => persist({ caption: caption || null })}
              placeholder="Kort beskrivning (valfri)"
              rows={2}
              disabled={disabled}
              className="mt-2 min-h-[56px] w-full resize-y rounded-md border border-border bg-background/70 px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}

          {hasMedia && mediaType !== "text" && (
            <div className="mt-3 overflow-hidden rounded-md border border-border bg-black">
              {mediaType === "video" ? (
                sourceKind === "url" && previewSrc && videoEmbedUrl(previewSrc) ? (
                  <iframe
                    src={videoEmbedUrl(previewSrc)!}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={principleLabel}
                  />
                ) : (
                  <video src={previewSrc!} controls preload="metadata" playsInline className="aspect-video w-full bg-black" />
                )
              ) : (
                <img
                  src={previewSrc!}
                  alt={principleLabel}
                  className="max-h-72 w-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              )}
            </div>
          )}

          {hasMedia && (
            <div className="mt-2 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-[10px] font-mono font-bold uppercase tracking-[0.18em] transition-opacity",
                  savedToast ? "text-pitch opacity-100" : "text-muted-foreground/0 opacity-0"
                )}
              >
                Sparat ✓
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={clearMedia}
                  className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background/50 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Rensa
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrincipleMediaSlot;
