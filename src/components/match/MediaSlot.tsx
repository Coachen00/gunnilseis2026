import { useEffect, useRef, useState } from "react";
import { Download, Eraser, Image as ImageIcon, Link as LinkIcon, Loader2, Map, Maximize2, Pencil, Upload, Video, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalMediaMatch } from "@/hooks/useGlobalMediaMatch";
import { cn } from "@/lib/utils";

interface Props {
  /**
   * Match-ID som mediaslotten är knuten till. Lämna utelämnat för att
   * fallbacka till det globala media-arkivet (`useGlobalMediaMatch`).
   */
  matchId?: string;
  slotKey: string;
  title: string;
  description?: string;
  captionPlaceholder?: string;
  className?: string;
  compact?: boolean;
}

type Mode = "image" | "video";
type Source = "url" | "upload";
type MapTool = "pen" | "zone";

type DrawStroke = {
  id: string;
  tool: MapTool;
  color: string;
  points: { x: number; y: number }[];
};

const IMAGE_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif,image/heic,image/heif";
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,video/x-msvideo,video/x-matroska,video/mpeg";

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function getSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const transformed = point.matrixTransform(svg.getScreenCTM()?.inverse());
  return {
    x: Math.max(0, Math.min(100, transformed.x)),
    y: Math.max(0, Math.min(140, transformed.y)),
  };
}

function pointsToPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

function InteractiveMapEditor({ title, onUseImage }: { title: string; onUseImage: (blob: Blob) => void | Promise<void> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const patternId = useRef(`pitch-grid-${Math.random().toString(36).slice(2)}`);
  const [tool, setTool] = useState<MapTool>("pen");
  const [color, setColor] = useState("#f4c542");
  const [showZones, setShowZones] = useState(true);
  const [showOpponents, setShowOpponents] = useState(true);
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const activeStroke = activeId ? strokes.find((s) => s.id === activeId) : null;

  const beginDraw = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    const point = getSvgPoint(svg, event.clientX, event.clientY);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setActiveId(id);
    setStrokes((prev) => [...prev, { id, tool, color, points: [point, point] }]);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDraw = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!activeId) return;
    const svg = svgRef.current;
    if (!svg) return;
    const point = getSvgPoint(svg, event.clientX, event.clientY);
    setStrokes((prev) =>
      prev.map((stroke) => {
        if (stroke.id !== activeId) return stroke;
        if (stroke.tool === "zone") return { ...stroke, points: [stroke.points[0], point] };
        return { ...stroke, points: [...stroke.points, point] };
      })
    );
  };

  const endDraw = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!activeId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setActiveId(null);
  };

  const exportToPng = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    setSaving(true);
    try {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", "900");
      clone.setAttribute("height", "1260");
      const serialized = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Kunde inte rendera kartbilden"));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 1260;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.96));
      if (blob) await onUseImage(blob);
    } finally {
      setSaving(false);
    }
  };

  const homePieces = [
    [50, 124, "1"], [18, 104, "2"], [38, 108, "3"], [62, 108, "4"], [82, 104, "5"],
    [50, 82, "6"], [32, 72, "8"], [68, 72, "10"], [18, 42, "11"], [50, 34, "9"], [82, 42, "7"],
  ] as const;
  const awayPieces = [
    [50, 16, "1"], [18, 36, "2"], [38, 32, "3"], [62, 32, "4"], [82, 36, "5"],
    [50, 58, "6"], [32, 68, "8"], [68, 68, "10"], [18, 98, "11"], [50, 106, "9"], [82, 98, "7"],
  ] as const;

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border bg-background/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">Interaktiv karta</p>
          <p className="text-xs text-muted-foreground">Rita om planbilden och använd den direkt som bild i kortet.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setTool("pen")}
              className={cn("inline-flex h-7 items-center gap-1 rounded px-2 text-[10px] font-bold uppercase tracking-wider", tool === "pen" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60")}
            >
              <Pencil className="h-3 w-3" />
              Linje
            </button>
            <button
              type="button"
              onClick={() => setTool("zone")}
              className={cn("inline-flex h-7 items-center gap-1 rounded px-2 text-[10px] font-bold uppercase tracking-wider", tool === "zone" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60")}
            >
              <Map className="h-3 w-3" />
              Yta
            </button>
          </div>
          {["#f4c542", "#5aa3ff", "#ef4444", "#f8fafc"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn("h-7 w-7 rounded-md border transition", color === c ? "border-foreground" : "border-border")}
              style={{ background: c }}
              aria-label={`Färg ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_190px]">
        <div className="rounded-lg border border-border bg-black p-2">
          <svg
            ref={svgRef}
            viewBox="0 0 100 140"
            className="mx-auto aspect-[5/7] max-h-[62vh] w-full touch-none select-none rounded-md bg-[#08110c]"
            onPointerDown={beginDraw}
            onPointerMove={updateDraw}
            onPointerUp={endDraw}
            onPointerCancel={endDraw}
          >
            <defs>
              <pattern id={patternId.current} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="140" fill="#08110c" />
            <rect width="100" height="140" fill={`url(#${patternId.current})`} />
            <rect x="4" y="4" width="92" height="132" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.55" />
            <line x1="4" y1="70" x2="96" y2="70" stroke="rgba(255,255,255,0.45)" strokeWidth="0.45" />
            <circle cx="50" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.45" />
            <rect x="24" y="4" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.45" />
            <rect x="34" y="4" width="32" height="8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.45" />
            <rect x="24" y="117" width="52" height="19" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.45" />
            <rect x="34" y="128" width="32" height="8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.45" />
            {showZones && (
              <g opacity="0.75">
                <rect x="36" y="8" width="28" height="26" fill="rgba(244,197,66,0.13)" stroke="rgba(244,197,66,0.55)" strokeDasharray="1.2 1.2" strokeWidth="0.45" />
                <line x1="20" y1="4" x2="20" y2="136" stroke="rgba(244,197,66,0.32)" strokeDasharray="1.5 1.5" strokeWidth="0.35" />
                <line x1="40" y1="4" x2="40" y2="136" stroke="rgba(244,197,66,0.32)" strokeDasharray="1.5 1.5" strokeWidth="0.35" />
                <line x1="60" y1="4" x2="60" y2="136" stroke="rgba(244,197,66,0.32)" strokeDasharray="1.5 1.5" strokeWidth="0.35" />
                <line x1="80" y1="4" x2="80" y2="136" stroke="rgba(244,197,66,0.32)" strokeDasharray="1.5 1.5" strokeWidth="0.35" />
              </g>
            )}

            {strokes.map((stroke) => {
              if (stroke.tool === "zone") {
                const [a, b] = stroke.points;
                const x = Math.min(a.x, b.x);
                const y = Math.min(a.y, b.y);
                return (
                  <rect
                    key={stroke.id}
                    x={x}
                    y={y}
                    width={Math.abs(b.x - a.x)}
                    height={Math.abs(b.y - a.y)}
                    fill={`${stroke.color}33`}
                    stroke={stroke.color}
                    strokeWidth="0.8"
                    rx="1.5"
                  />
                );
              }
              return (
                <path
                  key={stroke.id}
                  d={pointsToPath(stroke.points)}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {showOpponents && awayPieces.map(([x, y, label]) => (
              <g key={`a-${label}-${x}`} transform={`translate(${x} ${y})`}>
                <circle r="3.2" fill="#2563eb" stroke="#93c5fd" strokeWidth="0.55" />
                <text y="1.2" textAnchor="middle" fontSize="3" fontWeight="900" fill="#f8fafc">{label}</text>
              </g>
            ))}
            {homePieces.map(([x, y, label]) => (
              <g key={`h-${label}-${x}`} transform={`translate(${x} ${y})`}>
                <circle r="3.35" fill="#f4c542" stroke="#fde68a" strokeWidth="0.55" />
                <text y="1.2" textAnchor="middle" fontSize="3" fontWeight="900" fill="#07111f">{label}</text>
              </g>
            ))}
            <circle cx="50" cy="70" r="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.35" />
            {activeStroke && activeStroke.points.length > 0 && <circle cx={activeStroke.points.at(-1)?.x} cy={activeStroke.points.at(-1)?.y} r="1.2" fill={activeStroke.color} />}
          </svg>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowZones((v) => !v)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Zoner
            <span className="text-accent">{showZones ? "På" : "Av"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowOpponents((v) => !v)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Motståndare
            <span className="text-accent">{showOpponents ? "På" : "Av"}</span>
          </button>
          <button
            type="button"
            onClick={() => setStrokes([])}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <Eraser className="h-3.5 w-3.5" />
            Rensa ritning
          </button>
          <button
            type="button"
            onClick={exportToPng}
            disabled={saving}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Använd som bild
          </button>
          <p className="rounded-md border border-border bg-card/70 p-3 text-xs leading-relaxed text-muted-foreground">
            Tips: välj linje för löpningar och passningar, yta för pressfällor, gyllene zon eller block.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MediaSlot({ matchId, slotKey, title, description, captionPlaceholder, className, compact = false }: Props) {
  const { matchId: globalMatchId } = useGlobalMediaMatch();
  const effectiveMatchId = matchId ?? globalMatchId;
  const [mode, setMode] = useState<Mode>("image");
  const [source, setSource] = useState<Source>("url");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [localObjectUrl, setLocalObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    if (!effectiveMatchId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("media_items")
        .select("*")
        .eq("match_id", effectiveMatchId)
        .eq("slot_key", slotKey)
        .maybeSingle();

      if (cancelled) return;
      if (data) {
        setMode((data.media_type as Mode) ?? "image");
        setSource((data.source_kind as Source) ?? "url");
        setUrl(data.url ?? "");
        setCaption(data.caption ?? "");
        setStoragePath(data.storage_path ?? null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [effectiveMatchId, slotKey]);

  useEffect(() => {
    let cancelled = false;
    if (source !== "upload" || !storagePath) {
      setSignedUrl(null);
      return;
    }

    (async () => {
      const { data } = await supabase.storage.from("match-media").createSignedUrl(storagePath, 60 * 60);
      if (!cancelled) setSignedUrl(data?.signedUrl ?? null);
    })();

    return () => {
      cancelled = true;
    };
  }, [source, storagePath]);

  useEffect(() => {
    return () => {
      if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
    };
  }, [localObjectUrl]);

  async function persist(patch: { media_type?: Mode; source_kind?: Source; url?: string | null; storage_path?: string | null; caption?: string | null }) {
    if (!effectiveMatchId) return;
    await supabase
      .from("media_items")
      .upsert(
        {
          match_id: effectiveMatchId,
          slot_key: slotKey,
          media_type: patch.media_type ?? mode,
          source_kind: patch.source_kind ?? source,
          url: patch.url !== undefined ? patch.url : url || null,
          storage_path: patch.storage_path !== undefined ? patch.storage_path : storagePath,
          caption: patch.caption !== undefined ? patch.caption : caption || null,
        },
        { onConflict: "match_id,slot_key" }
      );
  }

  async function handleUpload(file: File) {
    if (!effectiveMatchId) {
      if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
      setMode(file.type.startsWith("video/") ? "video" : "image");
      setSource("upload");
      setLocalObjectUrl(URL.createObjectURL(file));
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${effectiveMatchId}/${slotKey}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("match-media").upload(path, file, { upsert: true });

    if (!error) {
      if (storagePath && storagePath !== path) {
        await supabase.storage.from("match-media").remove([storagePath]);
      }
      setStoragePath(path);
      setSource("upload");
      await persist({ source_kind: "upload", storage_path: path, url: null });
    }
    setUploading(false);
  }

  async function useGeneratedMap(blob: Blob) {
    const file = new File([blob], `${slotKey.replace(/[^a-z0-9-]/gi, "-")}-karta.png`, { type: "image/png" });
    await handleUpload(file);
    setMode("image");
    setMapOpen(false);
  }

  async function clearMedia() {
    if (storagePath) await supabase.storage.from("match-media").remove([storagePath]);
    if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
    setUrl("");
    setStoragePath(null);
    setLocalObjectUrl(null);
    await persist({ url: null, storage_path: null });
  }

  const finalSrc = source === "upload" ? signedUrl ?? localObjectUrl : url;
  const hasMedia = !!finalSrc;
  const ModeIcon = mode === "video" ? Video : ImageIcon;
  const sourceLabel = source === "upload" ? "Uppladdning" : "Länk";

  const setModeAndPersist = (nextMode: Mode) => {
    setMode(nextMode);
    persist({ media_type: nextMode });
  };

  const modeButtons = (iconOnly = false) => (
    <div className="inline-flex rounded-md border border-border bg-background/50 p-0.5">
      <button
        type="button"
        title="Foto"
        onClick={() => setModeAndPersist("image")}
        className={cn(
          "inline-flex h-6 items-center justify-center gap-1 rounded px-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
          mode === "image" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          iconOnly && "w-6 px-0"
        )}
      >
        <ImageIcon className="h-3 w-3" />
        {!iconOnly && "Foto"}
      </button>
      <button
        type="button"
        title="Film"
        onClick={() => setModeAndPersist("video")}
        className={cn(
          "inline-flex h-6 items-center justify-center gap-1 rounded px-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
          mode === "video" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          iconOnly && "w-6 px-0"
        )}
      >
        <Video className="h-3 w-3" />
        {!iconOnly && "Film"}
      </button>
    </div>
  );

  const sourceButtons = (
    <div className="inline-flex rounded-md border border-border bg-background/50 p-0.5">
      <button
        type="button"
        onClick={() => setSource("url")}
        className={cn(
          "inline-flex h-7 items-center justify-center gap-1 rounded px-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
          source === "url" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <LinkIcon className="h-3 w-3" />
        Länk
      </button>
      <button
        type="button"
        onClick={() => setSource("upload")}
        className={cn(
          "inline-flex h-7 items-center justify-center gap-1 rounded px-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
          source === "upload" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <Upload className="h-3 w-3" />
        Ladda upp
      </button>
      <button
        type="button"
        onClick={() => setMapOpen((v) => !v)}
        className={cn(
          "inline-flex h-7 items-center justify-center gap-1 rounded px-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
          mapOpen ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <Map className="h-3 w-3" />
        Karta
      </button>
    </div>
  );

  const inputControls = source === "url" ? (
    <input
      type="url"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      onBlur={() => persist({ url, source_kind: "url", storage_path: null })}
      aria-label={mode === "video" ? "Film-URL" : "Bild-URL"}
      placeholder={mode === "video" ? "YouTube-länk eller filmens URL" : "Bild-URL"}
      className="h-10 w-full rounded-md border border-border bg-background/70 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
    />
  ) : (
    <div>
      <input
        ref={fileInput}
        type="file"
        accept={mode === "video" ? VIDEO_ACCEPT : IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={uploading}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-primary/35 bg-primary/5 px-3 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary/10 disabled:cursor-wait disabled:opacity-70"
      >
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {uploading ? "Laddar upp" : `Välj ${mode === "video" ? "filmfil" : "bildfil"}`}
      </button>
    </div>
  );

  const captionControl = (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
        Bildförklaring
      </span>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() => persist({ caption: caption || null })}
        placeholder={captionPlaceholder ?? "Skriv kort vad bilden eller filmen visar..."}
        rows={compact ? 2 : 3}
        className="min-h-[72px] w-full resize-y rounded-md border border-border bg-background/70 px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );

  const emptyState = (
    <button
      type="button"
      onClick={() => setExpanded(true)}
      className={cn(
        "group/empty relative flex w-full flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-primary/25 bg-background/45 text-center transition hover:border-accent/60 hover:bg-muted/25",
        compact ? "h-24 px-3" : "h-36 px-5"
      )}
    >
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(90deg, hsl(var(--primary) / 0.18) 1px, transparent 1px), linear-gradient(0deg, hsl(var(--primary) / 0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative grid h-9 w-9 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary shadow-sm">
        <ModeIcon className="h-4 w-4" />
      </div>
      <div className="relative mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
        Lägg till media
      </div>
      {!compact && (
        <p className="relative mt-1 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
          Bild, film eller länk för just den här principen.
        </p>
      )}
    </button>
  );

  const preview = (
    <>
      {loading ? (
        <div className={cn("w-full rounded-md bg-muted/30 animate-pulse", compact ? "h-24" : "h-36")} />
      ) : hasMedia ? (
        <div className="relative overflow-hidden rounded-md border border-border bg-black">
          {mode === "video" ? (
            source === "url" && finalSrc && youtubeEmbed(finalSrc) ? (
              <iframe
                src={youtubeEmbed(finalSrc)!}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={finalSrc!} controls className="w-full aspect-video bg-black" />
            )
          ) : (
            <img
              src={finalSrc!}
              alt={title}
              className={cn("w-full object-cover", compact ? "h-24" : "max-h-72")}
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
          <div className="absolute left-2 top-2 rounded bg-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
            {sourceLabel}
          </div>
          <button
            type="button"
            onClick={clearMedia}
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/85 text-muted-foreground backdrop-blur transition hover:text-foreground"
            aria-label="Ta bort"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        emptyState
      )}
    </>
  );

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 shadow-sm ring-1 ring-white/[0.03] transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className={cn("flex items-start justify-between gap-3", compact ? "px-3 pt-3 pb-2" : "px-4 pt-4 pb-3")}>
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-md border border-primary/20 bg-primary/10 text-primary">
            <ModeIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className={cn("truncate font-semibold leading-tight text-foreground", compact ? "text-xs" : "text-sm")}>
              {title}
            </h4>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="rounded border border-border bg-background/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {mode === "video" ? "Film" : "Foto"}
              </span>
              <span className="rounded border border-border bg-background/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {sourceLabel}
              </span>
            </div>
            {description && !compact && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          {modeButtons(true)}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            title="Expandera"
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background/50 text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
            aria-label="Expandera media"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!compact && <div className="flex items-center justify-between gap-2 border-y border-border/70 px-4 py-2">{sourceButtons}</div>}

      <div className={cn("space-y-3", compact ? "px-3 pb-3" : "p-4")}>
        {!compact && inputControls}
        {!compact && captionControl}
        {preview}
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setExpanded(false)}>
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl ring-1 ring-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/20 via-accent to-primary/20" />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground transition hover:text-foreground"
              aria-label="Stäng"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-h-[92vh] overflow-y-auto p-5">
              <div className="mb-5 flex items-start gap-3 pr-12">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                  <ModeIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl leading-snug text-foreground">{title}</h3>
                  {description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>}
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                {modeButtons(false)}
                {sourceButtons}
              </div>

              {mapOpen ? (
                <InteractiveMapEditor title={title} onUseImage={useGeneratedMap} />
              ) : (
                <div className="mb-4">{inputControls}</div>
              )}
              <div className="mb-4">{captionControl}</div>
              <div className="rounded-lg border border-border bg-background/50 p-2">{preview}</div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Accepterar PNG, JPEG/JPG, WebP, GIF, HEIC/HEIF samt MP4, MOV, WebM, AVI, MKV och MPEG.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
