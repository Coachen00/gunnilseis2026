import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FileText, Image as ImageIcon, Link as LinkIcon, Loader2, Trash2, Upload, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type SupabaseErr = { message?: string; code?: string; statusCode?: string | number; status?: number; name?: string } | null | undefined;

/** Returnerar en användarvänlig svensk beskrivning för vanliga Supabase-fel. */
function describeError(err: SupabaseErr, fallback: string): string {
  if (!err) return fallback;
  const msg = (err.message ?? "").toLowerCase();
  const code = String(err.code ?? "");
  if (code === "42P01" || (msg.includes("relation") && msg.includes("does not exist"))) {
    return "Databastabellen principle_media finns inte. Migrationen `supabase/migrations/20260514120000_principle_media.sql` måste köras mot live-Supabase.";
  }
  if (code === "42501" || msg.includes("row-level security") || msg.includes("permission denied")) {
    return "Du har inte rätt att skriva här. Be admin godkänna ditt konto (is_approved_user).";
  }
  if (msg.includes("jwt") || msg.includes("invalid token") || err.status === 401) {
    return "Du är inte inloggad — logga in på nytt och försök igen.";
  }
  if (msg.includes("bucket") && msg.includes("not found")) {
    return "Storage-bucketen 'match-media' saknas i Supabase. Skapa den först.";
  }
  if (msg.includes("payload too large") || err.statusCode === 413) {
    return "Filen är för stor för bucketen. Komprimera eller höj bucket-limiten.";
  }
  return err.message ?? fallback;
}

type MediaType = "video" | "image" | "text";
type SourceKind = "url" | "upload" | "text";

interface Row {
  id: string;
  block_id: string;
  principle_id: string;
  media_type: MediaType;
  source_kind: SourceKind;
  url: string | null;
  storage_path: string | null;
  text_title: string | null;
  text_body: string | null;
  caption: string | null;
}

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
const BUCKET = "match-media";

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

const PrincipleMediaSlot = ({ blockId, principleId, principleLabel, oneLiner, disabled = false, hideHeader = false }: Props) => {
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [sourceKind, setSourceKind] = useState<SourceKind>("url");
  const [url, setUrl] = useState("");
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Load existing row
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      // @ts-expect-error principle_media saknas i auto-genererade typer
      const { data, error } = await supabase
        .from("principle_media")
        .select("*")
        .eq("block_id", blockId)
        .eq("principle_id", principleId)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        console.error(`[PrincipleMediaSlot] load failed for ${blockId}/${principleId}:`, error);
        setErrorMsg(describeError(error, "Kunde inte ladda sparad data."));
      } else {
        const row = data as Row | null;
        if (row) {
          setMediaType(row.media_type);
          setSourceKind(row.source_kind);
          setUrl(row.url ?? "");
          setStoragePath(row.storage_path);
          setTextTitle(row.text_title ?? "");
          setTextBody(row.text_body ?? "");
          setCaption(row.caption ?? "");
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [blockId, principleId]);

  // Refresh signed URL when storage path changes
  useEffect(() => {
    let cancelled = false;
    if (sourceKind !== "upload" || !storagePath) {
      setSignedUrl(null);
      return;
    }
    (async () => {
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60);
      if (cancelled) return;
      if (error) {
        console.error(`[PrincipleMediaSlot] signed URL failed for ${storagePath}:`, error);
        setErrorMsg(describeError(error, "Kunde inte hämta visnings-URL för uppladdad fil."));
        setSignedUrl(null);
      } else {
        setSignedUrl(data?.signedUrl ?? null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sourceKind, storagePath]);

  const flashSaved = () => {
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 1500);
  };

  async function persist(patch: Partial<Pick<Row, "media_type" | "source_kind" | "url" | "storage_path" | "text_title" | "text_body" | "caption">>) {
    if (disabled) return;
    const payload = {
      block_id: blockId,
      principle_id: principleId,
      media_type: patch.media_type ?? mediaType,
      source_kind: patch.source_kind ?? sourceKind,
      url: patch.url !== undefined ? patch.url : url || null,
      storage_path: patch.storage_path !== undefined ? patch.storage_path : storagePath,
      text_title: patch.text_title !== undefined ? patch.text_title : textTitle || null,
      text_body: patch.text_body !== undefined ? patch.text_body : textBody || null,
      caption: patch.caption !== undefined ? patch.caption : caption || null,
    };
    // @ts-expect-error principle_media saknas i auto-genererade typer
    const { error } = await supabase
      .from("principle_media")
      .upsert(payload, { onConflict: "block_id,principle_id" });
    if (error) {
      console.error(`[PrincipleMediaSlot] persist failed for ${blockId}/${principleId}:`, error);
      setErrorMsg(describeError(error, "Kunde inte spara ändringen."));
    } else {
      setErrorMsg(null);
      flashSaved();
    }
  }

  async function handleUpload(file: File) {
    if (disabled) return;
    setUploading(true);
    setErrorMsg(null);
    const ext = file.name.split(".").pop() || "bin";
    const path = `principles/${blockId}/${principleId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    if (error) {
      console.error(`[PrincipleMediaSlot] upload failed for ${path}:`, error);
      setErrorMsg(describeError(error, "Uppladdningen misslyckades."));
      setUploading(false);
      return;
    }
    if (storagePath && storagePath !== path) {
      const { error: removeError } = await supabase.storage.from(BUCKET).remove([storagePath]);
      if (removeError) {
        console.warn(`[PrincipleMediaSlot] could not remove old file ${storagePath}:`, removeError);
      }
    }
    setStoragePath(path);
    setSourceKind("upload");
    const nextType: MediaType = file.type.startsWith("video/") ? "video" : "image";
    setMediaType(nextType);
    await persist({ source_kind: "upload", storage_path: path, url: null, media_type: nextType });
    setUploading(false);
  }

  async function clearMedia() {
    if (disabled) return;
    if (storagePath) await supabase.storage.from(BUCKET).remove([storagePath]);
    setUrl("");
    setStoragePath(null);
    setTextTitle("");
    setTextBody("");
    setCaption("");
    await persist({ url: null, storage_path: null, text_title: null, text_body: null, caption: null });
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

  const previewSrc = sourceKind === "upload" ? signedUrl : url;
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
                onChange={(e) => setTextTitle(e.target.value)}
                onBlur={() => persist({ text_title: textTitle || null })}
                placeholder="Rubrik på kortet"
                disabled={disabled}
                className="h-10 w-full rounded-md border border-border bg-background/70 px-3 text-sm font-bold text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <textarea
                value={textBody}
                onChange={(e) => setTextBody(e.target.value)}
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
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => persist({ url: url || null })}
              placeholder={mediaType === "video" ? "YouTube-länk eller filmens URL" : "Bild-URL"}
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
                {uploading ? "Laddar upp" : `Välj ${mediaType === "video" ? "filmfil" : "bildfil"}`}
              </button>
            </div>
          )}

          {mediaType !== "text" && (
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
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
                sourceKind === "url" && previewSrc && youtubeEmbed(previewSrc) ? (
                  <iframe
                    src={youtubeEmbed(previewSrc)!}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={principleLabel}
                  />
                ) : (
                  <video src={previewSrc!} controls className="aspect-video w-full bg-black" />
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
