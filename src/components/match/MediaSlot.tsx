import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Video, Link as LinkIcon, Upload, X, Loader2 } from "lucide-react";

interface Props {
  matchId: string | undefined;
  slotKey: string;
  title: string;
  description?: string;
  className?: string;
}

type Mode = "image" | "video";
type Source = "url" | "upload";

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function MediaSlot({ matchId, slotKey, title, description, className }: Props) {
  const [mode, setMode] = useState<Mode>("image");
  const [source, setSource] = useState<Source>("url");
  const [url, setUrl] = useState("");
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!matchId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("media_items")
        .select("*")
        .eq("match_id", matchId)
        .eq("slot_key", slotKey)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setMode((data.media_type as Mode) ?? "image");
        setSource((data.source_kind as Source) ?? "url");
        setUrl(data.url ?? "");
        setStoragePath(data.storage_path ?? null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, slotKey]);

  async function persist(patch: { media_type?: Mode; source_kind?: Source; url?: string | null; storage_path?: string | null }) {
    if (!matchId) return;
    await supabase
      .from("media_items")
      .upsert(
        {
          match_id: matchId,
          slot_key: slotKey,
          media_type: patch.media_type ?? mode,
          source_kind: patch.source_kind ?? source,
          url: patch.url !== undefined ? patch.url : url || null,
          storage_path: patch.storage_path !== undefined ? patch.storage_path : storagePath,
        },
        { onConflict: "match_id,slot_key" }
      );
  }

  async function handleUpload(file: File) {
    if (!matchId) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${matchId}/${slotKey}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("match-media").upload(path, file, { upsert: true });
    if (!error) {
      // Remove previous upload if any
      if (storagePath && storagePath !== path) {
        await supabase.storage.from("match-media").remove([storagePath]);
      }
      setStoragePath(path);
      setSource("upload");
      await persist({ source_kind: "upload", storage_path: path, url: null });
    }
    setUploading(false);
  }

  async function clearMedia() {
    if (storagePath) await supabase.storage.from("match-media").remove([storagePath]);
    setUrl("");
    setStoragePath(null);
    await persist({ url: null, storage_path: null });
  }

  // Bucket is private — generate a short-lived signed URL for uploaded media
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (source !== "upload" || !storagePath) {
      setSignedUrl(null);
      return;
    }
    (async () => {
      const { data } = await supabase.storage
        .from("match-media")
        .createSignedUrl(storagePath, 60 * 60); // 1 hour
      if (!cancelled) setSignedUrl(data?.signedUrl ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [source, storagePath]);
  const finalSrc = source === "upload" ? signedUrl : url;
  const hasMedia = !!finalSrc;

  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">{title}</h4>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => { setMode("image"); persist({ media_type: "image" }); }}
            className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", mode === "image" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted/50")}
          >
            <ImageIcon className="w-3 h-3 inline mr-1" />Foto
          </button>
          <button
            type="button"
            onClick={() => { setMode("video"); persist({ media_type: "video" }); }}
            className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", mode === "video" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted/50")}
          >
            <Video className="w-3 h-3 inline mr-1" />Film
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setSource("url")}
          className={cn("flex-1 text-[10px] font-medium uppercase tracking-wider py-1 rounded border", source === "url" ? "bg-muted border-border text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/40")}
        >
          <LinkIcon className="w-3 h-3 inline mr-1" />Länk
        </button>
        <button
          type="button"
          onClick={() => setSource("upload")}
          className={cn("flex-1 text-[10px] font-medium uppercase tracking-wider py-1 rounded border", source === "upload" ? "bg-muted border-border text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/40")}
        >
          <Upload className="w-3 h-3 inline mr-1" />Ladda upp
        </button>
      </div>

      <div className="p-4 space-y-3">
        {source === "url" ? (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => persist({ url, source_kind: "url", storage_path: null })}
            placeholder={mode === "video" ? "YouTube-länk eller filmens URL" : "Bild-URL"}
            className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={!matchId}
          />
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={fileInput}
              type="file"
              accept={mode === "video" ? "video/*" : "image/*"}
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={!matchId || uploading}
              className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 text-muted-foreground inline-flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? "Laddar upp…" : `Välj ${mode === "video" ? "filmfil" : "bildfil"}`}
            </button>
          </div>
        )}

        {loading ? (
          <div className="w-full h-32 rounded-lg bg-muted/30 animate-pulse" />
        ) : hasMedia ? (
          <div className="relative">
            {mode === "video" ? (
              source === "url" && finalSrc && youtubeEmbed(finalSrc) ? (
                <iframe
                  src={youtubeEmbed(finalSrc)!}
                  className="w-full aspect-video rounded-lg border border-border"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={finalSrc!} controls className="w-full aspect-video rounded-lg border border-border bg-black" />
              )
            ) : (
              <img src={finalSrc!} alt={title} className="w-full max-h-64 object-cover rounded-lg border border-border" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
            )}
            <button
              type="button"
              onClick={clearMedia}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-background"
              aria-label="Ta bort"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 rounded-lg bg-muted/30 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center gap-2 text-muted-foreground/60 text-xs">
            {mode === "video" ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
            Tomt — lägg till {mode === "video" ? "film" : "bild"}
          </div>
        )}
      </div>
    </div>
  );
}