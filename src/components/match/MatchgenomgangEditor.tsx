import { useEffect, useMemo, useState } from "react";
import { Check, Copy, FileText, Image as ImageIcon, RotateCcw, Sparkles } from "lucide-react";
import {
  MATCHGENOMGANG_DEFAULT_SLIDES,
  matchgenomgangSlug,
  type MatchgenomgangSlide,
  type SlideAccent,
} from "@/data/matchgenomgang";
import { MATCH_META } from "@/data/matchplan";
import {
  clearAllSlidesForMatch,
  clearSlideOverride,
  loadSlideOverride,
  saveSlideOverride,
  type SlideOverride,
} from "@/lib/matchgenomgangLocal";
import { cn } from "@/lib/utils";

const ACCENT: Record<SlideAccent, { dot: string; chip: string; ring: string }> = {
  gold: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-800 border-amber-200", ring: "border-amber-200" },
  blue: { dot: "bg-sky-600", chip: "bg-sky-50 text-sky-800 border-sky-200", ring: "border-sky-200" },
  red: { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-800 border-rose-200", ring: "border-rose-200" },
  green: { dot: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-800 border-emerald-200", ring: "border-emerald-200" },
};

type EditableSlide = MatchgenomgangSlide & { hasOverride: boolean };

function applyOverride(base: MatchgenomgangSlide, override: SlideOverride | null): EditableSlide {
  if (!override) return { ...base, hasOverride: false };
  const hasAny =
    override.title !== undefined ||
    override.words !== undefined ||
    override.visual !== undefined ||
    override.imagePrompt !== undefined;
  return {
    ...base,
    title: override.title ?? base.title,
    words: override.words ?? base.words,
    visual: override.visual ?? base.visual,
    imagePrompt: override.imagePrompt ?? base.imagePrompt,
    hasOverride: hasAny,
  };
}

export default function MatchgenomgangEditor() {
  const matchSlug = useMemo(() => matchgenomgangSlug(MATCH_META.opponent), []);
  const [slides, setSlides] = useState<EditableSlide[]>(() =>
    MATCHGENOMGANG_DEFAULT_SLIDES.map((s) => ({ ...s, hasOverride: false }))
  );
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Ladda overrides från localStorage en gång per match-slug.
  useEffect(() => {
    let cancelled = false;
    const next = MATCHGENOMGANG_DEFAULT_SLIDES.map((s) =>
      applyOverride(s, loadSlideOverride(matchSlug, s.id))
    );
    if (!cancelled) setSlides(next);
    return () => {
      cancelled = true;
    };
  }, [matchSlug]);

  function flashSaved(slideId: string) {
    setSavedToast(slideId);
    window.setTimeout(() => {
      setSavedToast((current) => (current === slideId ? null : current));
    }, 1500);
  }

  function updateField(slideId: string, field: keyof SlideOverride, value: string) {
    setSlides((prev) =>
      prev.map((s) => {
        if (s.id !== slideId) return s;
        const base = MATCHGENOMGANG_DEFAULT_SLIDES.find((d) => d.id === slideId);
        if (!base) return s;
        const next = { ...s, [field]: value };
        // Skicka bara nyckel:värde-pairs som skiljer sig från default
        const override: SlideOverride = {};
        if (next.title !== base.title) override.title = next.title;
        if (next.words !== base.words) override.words = next.words;
        if (next.visual !== base.visual) override.visual = next.visual;
        if (next.imagePrompt !== base.imagePrompt) override.imagePrompt = next.imagePrompt;

        if (Object.keys(override).length === 0) {
          clearSlideOverride(matchSlug, slideId);
          return { ...next, hasOverride: false };
        }
        saveSlideOverride(matchSlug, slideId, override);
        return { ...next, hasOverride: true };
      })
    );
    flashSaved(slideId);
  }

  function resetSlide(slideId: string) {
    clearSlideOverride(matchSlug, slideId);
    const base = MATCHGENOMGANG_DEFAULT_SLIDES.find((d) => d.id === slideId);
    if (!base) return;
    setSlides((prev) => prev.map((s) => (s.id === slideId ? { ...base, hasOverride: false } : s)));
    flashSaved(slideId);
  }

  function resetAll() {
    if (!window.confirm("Återställa alla 14 slides till mallen? Dina ändringar för denna match raderas.")) return;
    clearAllSlidesForMatch(matchSlug);
    setSlides(MATCHGENOMGANG_DEFAULT_SLIDES.map((s) => ({ ...s, hasOverride: false })));
  }

  const overrideCount = slides.filter((s) => s.hasOverride).length;

  const exportText = useMemo(() => {
    const lines = [
      `Matchgenomgång — ${MATCH_META.opponent}`,
      `${MATCH_META.kickoff} · ${MATCH_META.home ? "Hemma" : "Borta"} · ${MATCH_META.venue}`,
      "",
      ...slides.flatMap((s) => [
        `${s.no}. ${s.title.toUpperCase()}`,
        `   Text:        ${s.words}`,
        `   Bild:        ${s.visual}`,
        `   Bildprompt:  ${s.imagePrompt}`,
        "",
      ]),
    ];
    return lines.join("\n");
  }, [slides]);

  async function copyExport() {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="grid gap-4 border-b border-border p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" strokeWidth={2.2} />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
              Matchgenomgång · redigerbar
            </p>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
            14 slides · {MATCH_META.opponent}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Mall på matchspråk — redigera direkt i fälten. Ändringar sparas automatiskt
            per match i din webbläsare (lokal lagring).
            {overrideCount > 0 && (
              <span className="ml-1 font-semibold text-amber-700">
                {overrideCount} {overrideCount === 1 ? "slide" : "slides"} ändrad
                {overrideCount === 1 ? "" : "e"} mot mallen.
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyExport}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-sky-500/60 bg-sky-50 px-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-sky-800 transition hover:bg-sky-100"
          >
            {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2.4} /> : <Copy className="h-3.5 w-3.5" strokeWidth={2.4} />}
            {copied ? "Kopierat" : "Kopiera till brief"}
          </button>
          {overrideCount > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground transition hover:border-rose-300 hover:text-rose-700"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.4} />
              Återställ allt
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
        {slides.map((slide) => (
          <SlideEditor
            key={slide.id}
            slide={slide}
            saved={savedToast === slide.id}
            onChange={(field, value) => updateField(slide.id, field, value)}
            onReset={() => resetSlide(slide.id)}
          />
        ))}
      </div>
    </section>
  );
}

function SlideEditor({
  slide,
  saved,
  onChange,
  onReset,
}: {
  slide: EditableSlide;
  saved: boolean;
  onChange: (field: keyof SlideOverride, value: string) => void;
  onReset: () => void;
}) {
  const tone = ACCENT[slide.accent];

  return (
    <article className={cn("flex flex-col gap-3 rounded-lg border bg-background/40 p-4", tone.ring)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", tone.dot)} aria-hidden="true" />
          <span className={cn("rounded px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] border", tone.chip)}>
            {slide.no}
          </span>
          {slide.hasOverride && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-amber-800">
              Ändrad
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Sparat ✓
            </span>
          )}
          {slide.hasOverride && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-6 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground transition hover:border-rose-300 hover:text-rose-700"
              aria-label="Återställ denna slide till mallen"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2.4} />
              Mall
            </button>
          )}
        </div>
      </div>

      <Field
        label="Rubrik"
        value={slide.title}
        onChange={(v) => onChange("title", v)}
        bold
      />
      <Field
        label="Text"
        value={slide.words}
        onChange={(v) => onChange("words", v)}
        placeholder="Max 8 ord — en idé, en handling."
      />
      <Field
        Icon={ImageIcon}
        label="Bild"
        value={slide.visual}
        onChange={(v) => onChange("visual", v)}
        placeholder="Vad ska bilden visa?"
        multiline
      />
      <Field
        Icon={FileText}
        label="Bildprompt"
        value={slide.imagePrompt}
        onChange={(v) => onChange("imagePrompt", v)}
        placeholder="AI-bildprompt (engelska)"
        multiline
        muted
      />
    </article>
  );
}

function Field({
  Icon,
  label,
  value,
  placeholder,
  onChange,
  bold = false,
  muted = false,
  multiline = false,
}: {
  Icon?: typeof FileText;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (next: string) => void;
  bold?: boolean;
  muted?: boolean;
  multiline?: boolean;
}) {
  const commonClass = cn(
    "w-full rounded-md border border-transparent bg-background px-2.5 py-1.5 text-sm leading-snug text-foreground outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-200/60 hover:border-border",
    bold && "text-base font-bold tracking-tight",
    muted && "text-xs text-muted-foreground"
  );

  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground" strokeWidth={2.2} />}
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={cn(commonClass, "min-h-[48px] resize-y")}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(commonClass, "h-9")}
        />
      )}
    </label>
  );
}
