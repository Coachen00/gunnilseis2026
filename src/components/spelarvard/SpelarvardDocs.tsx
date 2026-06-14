/**
 * SpelarvardDocs — dokumentgalleri för ETT avsnitt på "Ta hand om dig själv".
 *
 * Spelare ser ett inbjudande galleri: klicka ett kort → öppnas i viewer
 * (PDF inbäddad, bild inline, slides/HTML/länk i ny flik). Admin (godkänd
 * användare) ser dessutom "Lägg till material" + ta bort per kort.
 *
 * Datan kommer från useSpelarvardDocs (en query för hela sidan) — den här
 * komponenten får sina rader + mutationer som props för att slippa N queries.
 */

import { useEffect, useState } from "react";
import {
  ExternalLink,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Plus,
  Presentation,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  inferDocKind,
  useSpelarvardSignedUrl,
  type DocKind,
  type SpelarvardDoc,
} from "@/hooks/useSpelarvardDocs";

type KindMeta = {
  label: string;
  icon: typeof FileText;
  chip: string;
  accent: string;
};

const KIND_META: Record<DocKind, KindMeta> = {
  pdf:    { label: "PDF",    icon: FileText,    chip: "bg-rose-50 text-rose-700",     accent: "text-rose-600" },
  slides: { label: "Slides", icon: Presentation, chip: "bg-amber-50 text-amber-800",  accent: "text-amber-600" },
  html:   { label: "HTML",   icon: FileCode2,   chip: "bg-sky-50 text-sky-700",       accent: "text-sky-600" },
  link:   { label: "Länk",   icon: LinkIcon,    chip: "bg-violet-50 text-violet-700", accent: "text-violet-600" },
  image:  { label: "Bild",   icon: ImageIcon,   chip: "bg-emerald-50 text-emerald-700", accent: "text-emerald-600" },
};

const KIND_OPTIONS: { value: DocKind; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "slides", label: "PowerPoint / Slides" },
  { value: "html", label: "HTML-verktyg" },
  { value: "image", label: "Bild" },
  { value: "link", label: "Länk" },
];

const UPLOAD_ACCEPT =
  ".pdf,.ppt,.pptx,.key,.odp,.html,.htm,.png,.jpg,.jpeg,.webp,.gif,.svg,application/pdf,text/html";

/** Hämtar den faktiska URL:en (signed för uppladdat, direkt för länk). */
function useDocUrl(doc: SpelarvardDoc) {
  const signed = useSpelarvardSignedUrl(doc.source_kind === "upload" ? doc.storage_path : null);
  if (doc.source_kind === "upload") return { url: signed.data ?? null, loading: signed.isLoading };
  return { url: doc.url ?? null, loading: false };
}

/* ------------------------------------------------------------------ */

function DocCard({
  doc,
  isAdmin,
  onOpen,
  onDelete,
}: {
  doc: SpelarvardDoc;
  isAdmin: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const meta = KIND_META[doc.doc_kind];
  const Icon = meta.icon;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 flex-col gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label={`Öppna ${doc.title}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] ${meta.chip}`}>
            <Icon className="h-3 w-3" strokeWidth={2.4} />
            {meta.label}
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-amber-600" strokeWidth={2.2} aria-hidden="true" />
        </div>

        <div className="flex items-start gap-3">
          <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-background ${meta.accent}`}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-black leading-snug tracking-tight text-foreground">
              {doc.title}
            </p>
            {doc.caption && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{doc.caption}</p>
            )}
          </div>
        </div>
      </button>

      {isAdmin && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground opacity-0 backdrop-blur transition hover:text-rose-600 focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Ta bort ${doc.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DocViewerModal({ doc, onClose }: { doc: SpelarvardDoc; onClose: () => void }) {
  const { url, loading } = useDocUrl(doc);
  const meta = KIND_META[doc.doc_kind];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Endast PDF och bild bäddas in tryggt. Slides/HTML/länk öppnas i ny flik.
  const canEmbed = doc.doc_kind === "pdf" || doc.doc_kind === "image";

  return (
    <div role="dialog" aria-modal="true" aria-label={doc.title} className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <button type="button" aria-label="Stäng" onClick={onClose} className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md" />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">{meta.label}</p>
            <h3 className="truncate text-lg font-bold leading-tight text-white md:text-xl">{doc.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Stäng (Esc)">
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative flex min-h-[40vh] items-center justify-center overflow-hidden rounded-lg bg-black shadow-2xl">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-white/70" />
          ) : !url ? (
            <p className="p-8 text-center text-sm text-white/70">Kunde inte ladda dokumentet.</p>
          ) : doc.doc_kind === "image" ? (
            <img src={url} alt={doc.title} className="max-h-[80vh] w-full object-contain" />
          ) : canEmbed ? (
            <iframe src={url} title={doc.title} className="h-[80vh] w-full bg-white" />
          ) : (
            <div className="flex flex-col items-center gap-4 p-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-white">
                <meta.icon className="h-7 w-7" />
              </span>
              <p className="max-w-sm text-sm text-white/80">
                {doc.doc_kind === "slides"
                  ? "PowerPoint-filer öppnas bäst i ny flik eller laddas ner."
                  : doc.doc_kind === "html"
                    ? "HTML-verktyget öppnas i en egen flik."
                    : "Länken öppnas i en ny flik."}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-amber-950 transition hover:bg-amber-400"
              >
                Öppna i ny flik
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.4} />
              </a>
            </div>
          )}
        </div>

        {url && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-white/60">Esc / klick utanför stänger</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200">
              Öppna i ny flik <ExternalLink className="h-3 w-3" strokeWidth={2.4} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function AdminAddPanel({
  onUpload,
  onAddLink,
  onClose,
}: {
  onUpload: (file: File, title: string, kind: DocKind) => Promise<void>;
  onAddLink: (title: string, url: string, kind: DocKind) => Promise<void>;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState<DocKind>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      setBusy(true);
      if (mode === "upload") {
        if (!file) {
          setError("Välj en fil först.");
          return;
        }
        await onUpload(file, title, kind);
      } else {
        if (!url.trim()) {
          setError("Klistra in en länk först.");
          return;
        }
        if (!title.trim()) {
          setError("Ge länken en titel.");
          return;
        }
        await onAddLink(title, url, kind);
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-amber-500/50 bg-amber-50/40 p-4">
      <div className="mb-3 inline-flex rounded-md border border-border bg-background p-0.5">
        {(["upload", "link"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`inline-flex h-8 items-center gap-1.5 rounded px-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] transition ${
              mode === m ? "bg-amber-500 text-amber-950" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "upload" ? <Upload className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
            {m === "upload" ? "Ladda upp" : "Länk"}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5">
        {mode === "upload" ? (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-amber-500/40 bg-background px-3 py-3 text-xs font-bold text-amber-700 transition hover:bg-amber-50">
            <Upload className="h-4 w-4" />
            {file ? file.name : "Välj fil (PDF, PPT, HTML, bild)"}
            <input
              type="file"
              accept={UPLOAD_ACCEPT}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f) {
                  setKind(inferDocKind(f.name));
                  if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
                }
              }}
            />
          </label>
        ) : (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… (Drive, YouTube, valfri länk)"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
          />
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel (t.ex. Kostschema matchvecka)"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
        />

        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as DocKind)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
        >
          {KIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-amber-500 px-4 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-amber-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" strokeWidth={2.6} />}
            {busy ? "Sparar" : "Lägg till"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function SpelarvardDocs({
  sectionId,
  docs,
  isAdmin,
  onUpload,
  onAddLink,
  onDelete,
}: {
  sectionId: string;
  docs: SpelarvardDoc[];
  isAdmin: boolean;
  onUpload: (sectionId: string, file: File, opts?: { title?: string; kind?: DocKind }) => Promise<void>;
  onAddLink: (sectionId: string, input: { title: string; url: string; kind?: DocKind }) => Promise<void>;
  onDelete: (doc: SpelarvardDoc) => Promise<void>;
}) {
  const [openDoc, setOpenDoc] = useState<SpelarvardDoc | null>(null);
  const [adding, setAdding] = useState(false);
  const hasDocs = docs.length > 0;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Material {hasDocs ? `· ${docs.length}` : ""}
        </p>
        {isAdmin && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/50 bg-amber-50 px-2.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-amber-800 transition hover:bg-amber-100"
          >
            <Plus className="h-3 w-3" strokeWidth={2.6} />
            Lägg till material
          </button>
        )}
      </div>

      {isAdmin && adding && (
        <div className="mb-3">
          <AdminAddPanel
            onUpload={(file, title, kind) => onUpload(sectionId, file, { title, kind })}
            onAddLink={(title, url, kind) => onAddLink(sectionId, { title, url, kind })}
            onClose={() => setAdding(false)}
          />
        </div>
      )}

      {hasDocs ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              isAdmin={isAdmin}
              onOpen={() => setOpenDoc(doc)}
              onDelete={() => {
                if (window.confirm(`Ta bort "${doc.title}"?`)) onDelete(doc);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-5 text-center">
          <p className="text-sm font-semibold text-foreground/80">Inget material än</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAdmin
              ? "Ladda upp PDF, PowerPoint eller HTML — eller klistra in en länk."
              : "Tränarstaben lägger till material här löpande."}
          </p>
        </div>
      )}

      {openDoc && <DocViewerModal doc={openDoc} onClose={() => setOpenDoc(null)} />}
    </div>
  );
}
