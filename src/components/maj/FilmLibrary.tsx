/**
 * FilmLibrary — kristallklar filmstruktur under "Maj 2026".
 *
 * Mål: ett barn ska hitta rätt film direkt. Inga gömda klipp, inga
 * tvetydiga kategorier. Allt material grupperat efter spelfas.
 *
 * Källor:
 *  - MAJ_2026_PRINCIPLE_MEDIA   → klipp kopplade till specifika principer i ett block
 *  - MAJ_2026_OVRIGT_MEDIA      → klipp utan princip-koppling
 *
 * Klicka ett kort → öppnas direkt i ClipModal (helsärm-spelare).
 * YouTube → embedat via youtube-nocookie. Lokal mp4 → native <video>.
 * Bilder → <img>. Pilarna ← → bläddrar inom samma kategori.
 */

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Film, Image as ImageIcon, Play, Sparkles, X } from "lucide-react";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_OVRIGT_MEDIA,
  MAJ_2026_PRINCIPLE_MEDIA,
  type MediaAsset,
} from "@/data/majSpelmodell";

type AccentKey = "amber" | "red" | "blue" | "green" | "violet" | "slate";

type FilmCategory = {
  id: string;
  label: string;
  description: string;
  accent: AccentKey;
  /** Block-id i MAJ_2026_PRINCIPLE_MEDIA. Tom array = inget block (Veckans match / Övrigt). */
  blockIds: string[];
  /** Speciell källa istället för MAJ_2026_PRINCIPLE_MEDIA. */
  customSource?: MediaAsset[];
  /** Var i sidan användaren tas när hen klickar "Visa allt i blocket". */
  jumpTo?: string;
};

const CATEGORIES: FilmCategory[] = [
  {
    id: "veckans-match",
    label: "Veckans match",
    description:
      "Klipp och bilder kopplade till veckans match — motståndaranalys, fokuspunkter och repris.",
    accent: "amber",
    blockIds: [],
    jumpTo: "/match/kommande",
  },
  {
    id: "forsvarsspel",
    label: "Försvarsspel",
    description: "Tre korridorer, kompakt block, vinn duellen och 2:a bollsspel.",
    accent: "red",
    blockIds: ["forsvarsspel"],
    jumpTo: "#forsvarsspel",
  },
  {
    id: "overgang-anfall",
    label: "Omställning till anfall",
    description: "Bollvinst — första tanken framåt. Diagonal utgång och hot bakom.",
    accent: "amber",
    blockIds: ["overgang-anfall"],
    jumpTo: "#overgang-anfall",
  },
  {
    id: "anfallsspel",
    label: "Anfallsspel",
    description: "Skydda kontring → spela in → flytta ut → ta med framåt → fylla på box.",
    accent: "blue",
    blockIds: ["anfallsspel"],
    jumpTo: "#anfallsspel",
  },
  {
    id: "overgang-forsvar",
    label: "Omställning till försvar",
    description: "Tappa bollen = starta jakten. Direkt återerövring.",
    accent: "red",
    blockIds: ["overgang-forsvar"],
    jumpTo: "#overgang-forsvar",
  },
  {
    id: "fasta-situationer",
    label: "Fasta situationer",
    description: "Hörnor, frisparkar och inkast — organiserade vapen.",
    accent: "green",
    blockIds: ["fasta-situationer"],
    jumpTo: "#fasta-situationer",
  },
  {
    id: "identitet",
    label: "Identitet",
    description: "Duellspel, 2:a bollsspel, djupledslöpningar, värdigt kroppsspråk.",
    accent: "violet",
    blockIds: ["identitet"],
    jumpTo: "#identitet",
  },
  {
    id: "ovrigt",
    label: "Övrigt",
    description: "Material utan princip-koppling — sortera senare.",
    accent: "slate",
    blockIds: [],
    customSource: MAJ_2026_OVRIGT_MEDIA,
  },
];

const ACCENT: Record<AccentKey, { bar: string; text: string; ring: string; chipBg: string; chipText: string }> = {
  amber:  { bar: "bg-amber-500",   text: "text-amber-700",   ring: "hover:border-amber-500/60",  chipBg: "bg-amber-50",  chipText: "text-amber-800" },
  red:    { bar: "bg-red-500",     text: "text-red-700",     ring: "hover:border-red-500/60",    chipBg: "bg-red-50",    chipText: "text-red-800" },
  blue:   { bar: "bg-sky-500",     text: "text-sky-700",     ring: "hover:border-sky-500/60",    chipBg: "bg-sky-50",    chipText: "text-sky-800" },
  green:  { bar: "bg-emerald-500", text: "text-emerald-700", ring: "hover:border-emerald-500/60", chipBg: "bg-emerald-50", chipText: "text-emerald-800" },
  violet: { bar: "bg-violet-500",  text: "text-violet-700",  ring: "hover:border-violet-500/60", chipBg: "bg-violet-50", chipText: "text-violet-800" },
  slate:  { bar: "bg-slate-400",   text: "text-slate-600",   ring: "hover:border-slate-400/60",  chipBg: "bg-slate-100", chipText: "text-slate-700" },
};

function mediaIdentityKey(src: string) {
  const youtube = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (youtube) return `youtube:${youtube[1]}`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `vimeo:${vimeo[1]}`;
  return src.split("?")[0];
}

function gatherCategoryMedia(cat: FilmCategory): MediaAsset[] {
  if (cat.customSource) return cat.customSource;
  const seen = new Set<string>();
  const out: MediaAsset[] = [];
  for (const blockId of cat.blockIds) {
    const principles = MAJ_2026_PRINCIPLE_MEDIA[blockId] ?? {};
    for (const items of Object.values(principles)) {
      for (const item of items) {
        const key = mediaIdentityKey(item.src);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(item);
      }
    }
  }
  return out;
}

/** YouTube och Vimeo har officiella thumbnail-URLs. Bilder visar sig själva.
 *  Lokal mp4 har ingen poster utan server-side, så vi returnerar null. */
function getThumbnailUrl(item: MediaAsset): string | null {
  if (item.kind === "image") return item.src;
  const yt = item.src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`;
  // Vimeo kräver API-anrop — hoppa över i denna preview
  return null;
}

function getEmbedUrl(src: string): string | null {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (yt) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
    });
    return `https://www.youtube-nocookie.com/embed/${yt[1]}?${params}`;
  }
  const vm = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?dnt=1&autoplay=1`;
  return null;
}

/* =========================================================================
   COMPONENTS
   ========================================================================= */

function ClipCard({
  item,
  accent,
  onPlay,
}: {
  item: MediaAsset;
  accent: AccentKey;
  onPlay: () => void;
}) {
  const a = ACCENT[accent];
  const isVideo = item.kind === "video";
  const thumb = getThumbnailUrl(item);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onPlay}
      className={`group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left transition-all ${a.ring} hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`}
      aria-label={`Spela ${item.label}`}
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-black">
        {thumb && !imgFailed ? (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--muted))_0%,#0b0b0b_75%)]" />
        )}
        {/* gradient overlay för bra play-knapp-kontrast */}
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.32),rgba(0,0,0,0.04)_50%,rgba(0,0,0,0.32))]" />
        <span className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-white/95 ${a.text} shadow-lg transition-transform group-hover:scale-110`}>
          {isVideo ? <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={2.2} /> : <ImageIcon className="h-5 w-5" strokeWidth={2.2} />}
        </span>
        <span
          className="absolute left-2 top-2 rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white"
          style={{ background: "rgba(0,0,0,0.65)" }}
        >
          {isVideo ? "Film" : "Bild"}
        </span>
      </div>
      <div className="min-h-[2.5rem]">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-amber-700">
          {item.label}
        </p>
      </div>
    </button>
  );
}

function ClipModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  position,
  total,
}: {
  item: MediaAsset;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  position: number;
  total: number;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev();
      else if (e.key === "ArrowRight" && hasNext) onNext();
    };
    document.addEventListener("keydown", handler);
    // Lås body-scroll medan modal är öppen
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const embedUrl = getEmbedUrl(item.src);
  const isVideo = item.kind === "video";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Stäng"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
      />

      {/* Innehåll */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
              {position} / {total}
            </p>
            <h3 className="truncate text-lg font-bold leading-tight text-white md:text-xl">
              {item.label}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Stäng (Esc)"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        {/* Player */}
        <div className="relative overflow-hidden rounded-lg bg-black shadow-2xl">
          {isVideo && embedUrl && (
            <iframe
              src={embedUrl}
              title={item.label}
              className="aspect-video w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {isVideo && !embedUrl && (
            <video
              src={item.src}
              controls
              autoPlay
              preload="metadata"
              playsInline
              className="aspect-video w-full bg-black"
            />
          )}
          {!isVideo && (
            <img src={item.src} alt={item.label} className="max-h-[80vh] w-full object-contain" />
          )}

          {/* Bläddra-pilar */}
          {hasPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Föregående (←)"
              className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2.4} />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Nästa (→)"
              className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={2.4} />
            </button>
          )}
        </div>

        {/* Footer-tips */}
        <p className="text-center text-xs text-white/60">
          Esc = stäng · ← → = bläddra · klick utanför stänger
        </p>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  onPlayClip,
}: {
  category: FilmCategory;
  onPlayClip: (categoryId: string, clipIndex: number) => void;
}) {
  const items = gatherCategoryMedia(category);
  const a = ACCENT[category.accent];
  const videoCount = items.filter((i) => i.kind === "video").length;
  const imageCount = items.length - videoCount;
  const hasItems = items.length > 0;

  // Visa alla klipp direkt under rätt kategori så matchmaterialet inte göms bakom modal-bläddring.
  const preview = items;

  return (
    <article
      id={`film-${category.id}`}
      className={`scroll-mt-24 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md md:p-5 ${a.ring}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className={`h-[2px] w-8 ${a.bar}`} aria-hidden="true" />
            <p className={`font-mono text-[10px] font-black uppercase tracking-[0.24em] ${a.text}`}>
              {hasItems ? `${items.length} klipp` : "Tomt"}
            </p>
          </div>
          <h3 className="truncate text-lg font-black uppercase tracking-tight text-foreground md:text-xl">
            {category.label}
          </h3>
        </div>
        {hasItems && (
          <div className="flex shrink-0 gap-1.5">
            {videoCount > 0 && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${a.chipBg} ${a.chipText}`}>
                <Film className="h-3 w-3" strokeWidth={2.2} />
                {videoCount}
              </span>
            )}
            {imageCount > 0 && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${a.chipBg} ${a.chipText}`}>
                <ImageIcon className="h-3 w-3" strokeWidth={2.2} />
                {imageCount}
              </span>
            )}
          </div>
        )}
      </header>

      <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>

      {hasItems ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((item, idx) => (
              <ClipCard
                key={mediaIdentityKey(item.src)}
                item={item}
                accent={category.accent}
                onPlay={() => onPlayClip(category.id, idx)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {items.length > preview.length
                ? `${items.length - preview.length} fler — bläddra i spelaren`
                : "Klicka för att spela"}
            </p>
            {category.jumpTo && (
              category.jumpTo.startsWith("/") ? (
                <Link
                  to={category.jumpTo}
                  className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-foreground transition-colors ${a.ring}`}
                >
                  Öppna sidan
                  <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
                </Link>
              ) : (
                <a
                  href={category.jumpTo}
                  className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-foreground transition-colors ${a.ring}`}
                >
                  Hela blocket
                  <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
                </a>
              )
            )}
          </div>
        </>
      ) : (
        <EmptyCategoryState category={category} />
      )}
    </article>
  );
}

function EmptyCategoryState({ category }: { category: FilmCategory }) {
  const a = ACCENT[category.accent];
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-left">
      <div className="flex items-center gap-2">
        <Sparkles className={`h-4 w-4 ${a.text}`} strokeWidth={2.2} />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
          Inga klipp än
        </p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">
        {category.id === "veckans-match"
          ? "Lägger till klipp efter matchen — repris, motståndaranalys eller fokuspunkter som vi vill träna vidare på."
          : category.id === "ovrigt"
            ? "Klipp som saknar princip-koppling hamnar här tills någon sorterar dem."
            : "Material för den här fasen läggs till löpande av tränarstaben."}
      </p>
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Admin · lägg till klipp i{" "}
        <code className="rounded bg-background px-1 py-0.5 font-mono normal-case text-foreground">
          src/data/majSpelmodell.ts
        </code>
      </p>
    </div>
  );
}

/* =========================================================================
   ROOT
   ========================================================================= */

export default function FilmLibrary() {
  // Modal state: vilken kategori + vilket index inom kategorin spelar vi nu?
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeCategory = activeCategoryId
    ? CATEGORIES.find((c) => c.id === activeCategoryId) ?? null
    : null;
  const activeItems = activeCategory ? gatherCategoryMedia(activeCategory) : [];
  const activeItem = activeItems[activeIndex] ?? null;

  const openClip = useCallback((categoryId: string, clipIndex: number) => {
    setActiveCategoryId(categoryId);
    setActiveIndex(clipIndex);
  }, []);

  const closeClip = useCallback(() => {
    setActiveCategoryId(null);
  }, []);

  const prevClip = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  const nextClip = useCallback(() => {
    setActiveIndex((i) => Math.min(activeItems.length - 1, i + 1));
  }, [activeItems.length]);

  // Aggregate totals — visas i sektionsrubriken
  const totals = CATEGORIES.reduce(
    (acc, cat) => {
      const items = gatherCategoryMedia(cat);
      acc.total += items.length;
      acc.videos += items.filter((i) => i.kind === "video").length;
      acc.categoriesWithMedia += items.length > 0 ? 1 : 0;
      return acc;
    },
    { total: 0, videos: 0, categoriesWithMedia: 0 },
  );

  return (
    <section
      id="filmbibliotek"
      className="scroll-mt-24 border-t border-border bg-gradient-to-b from-muted/30 via-background to-background py-16 md:py-20"
    >
      <div className="container">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
            Filmbibliotek
          </p>
        </div>
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl lg:text-4xl">
              Hitta rätt film direkt
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Allt material under Sommaren 2026 sorterat efter spelfas. Klicka på ett
              klipp så öppnas spelaren direkt — använd pilarna för att bläddra
              mellan filmer i samma fas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5">
              <Film className="h-3 w-3 text-amber-700" strokeWidth={2.2} />
              {totals.videos} filmer
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5">
              <ImageIcon className="h-3 w-3 text-amber-700" strokeWidth={2.2} />
              {totals.total - totals.videos} bilder
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5">
              {totals.categoriesWithMedia} / {CATEGORIES.length} kategorier
            </span>
          </div>
        </div>

        {/* Snabb-nav chips */}
        <nav aria-label="Snabbnav filmbibliotek" className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = gatherCategoryMedia(cat).length;
            const a = ACCENT[cat.accent];
            return (
              <a
                key={cat.id}
                href={`#film-${cat.id}`}
                className={`group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-foreground transition-colors ${a.ring}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${a.bar}`} aria-hidden="true" />
                <span>{cat.label}</span>
                <span className="text-muted-foreground">{count > 0 ? count : "–"}</span>
              </a>
            );
          })}
        </nav>

        <div className="grid gap-5 md:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onPlayClip={openClip} />
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/30 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
                Admin · lägg till klipp
              </p>
              <p className="mt-1.5 text-sm font-semibold text-foreground">
                Filmer läggs till i{" "}
                <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">
                  src/data/majSpelmodell.ts
                </code>{" "}
                under <code className="font-mono">MAJ_2026_PRINCIPLE_MEDIA</code> eller{" "}
                <code className="font-mono">MAJ_2026_OVRIGT_MEDIA</code>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {MAJ_2026_BLOCKS.map((b) => (
                <a
                  key={b.id}
                  href={`#${b.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/85 transition-colors hover:border-amber-500 hover:text-amber-700"
                >
                  {b.navLabel}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal — renderas alltid när activeItem != null */}
      {activeItem && activeCategory && (
        <ClipModal
          item={activeItem}
          onClose={closeClip}
          onPrev={prevClip}
          onNext={nextClip}
          hasPrev={activeIndex > 0}
          hasNext={activeIndex < activeItems.length - 1}
          position={activeIndex + 1}
          total={activeItems.length}
        />
      )}
    </section>
  );
}
