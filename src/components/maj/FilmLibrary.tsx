/**
 * FilmLibrary — bildledd filmbibliotek under "Sommaren 2026".
 *
 * Mål: ett barn ska VILJA trycka. Stor miniatyr, ett tryck till filmen.
 * Allt material grupperat efter spelfas som en horisontell filmrad per fas
 * (Netflix-stil) — inga lådor i lådor, inget admin-språk i publik vy.
 *
 * Källor:
 *  - MAJ_2026_PRINCIPLE_MEDIA   → klipp kopplade till specifika principer i ett block
 *  - MAJ_2026_OVRIGT_MEDIA      → klipp utan princip-koppling
 *
 * Klicka ett kort → öppnas direkt i ClipModal (helskärm-spelare).
 * YouTube → embedat via youtube-nocookie. Lokal mp4 → native <video>.
 * Bilder → <img>. Pilarna ← → bläddrar inom samma fas.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon, Play, X } from "lucide-react";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_OVRIGT_MEDIA,
  MAJ_2026_PRINCIPLE_MEDIA,
  type MediaAsset,
} from "@/data/majSpelmodell";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";
import { cn } from "@/lib/utils";

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
  /** Var i sidan användaren tas när hen klickar "Alla". */
  jumpTo?: string;
  /** Egen text när fasen ännu saknar klipp. */
  emptyHint?: string;
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
    emptyHint: "Fylls på efter matchen.",
  },
  {
    id: "forsvarsspel",
    label: "Försvarsspel",
    description: "Tre korridorer, kompakt block, vinn duellen och andrabollsspel.",
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
    description: "Scanning, ta ytan, prata med passningen, duellspel och andrabollsspel.",
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
    emptyHint: "Klipp utan princip-koppling hamnar här.",
  },
];

const ACCENT: Record<AccentKey, { bar: string; text: string; ring: string }> = {
  amber:  { bar: "bg-amber-500",   text: "text-amber-700",   ring: "focus-visible:ring-amber-500" },
  red:    { bar: "bg-red-500",     text: "text-red-700",     ring: "focus-visible:ring-red-500" },
  blue:   { bar: "bg-sky-500",     text: "text-sky-700",     ring: "focus-visible:ring-sky-500" },
  green:  { bar: "bg-emerald-500", text: "text-emerald-700", ring: "focus-visible:ring-emerald-500" },
  violet: { bar: "bg-violet-500",  text: "text-violet-700",  ring: "focus-visible:ring-violet-500" },
  slate:  { bar: "bg-slate-400",   text: "text-slate-600",   ring: "focus-visible:ring-slate-400" },
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

function ClipTile({
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
      className="group block w-[230px] shrink-0 snap-start text-left focus:outline-none sm:w-[260px]"
      aria-label={`Spela ${item.label}`}
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-black/5 transition-shadow group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-offset-2",
          a.ring,
        )}
      >
        {thumb && !imgFailed ? (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--muted))_0%,#0b0b0b_78%)]" />
        )}
        {/* lätt botten-gradient så play-knappen syns mot ljusa bilder */}
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_55%,rgba(0,0,0,0.45))]" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-slate-900 shadow-lg transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            {isVideo ? (
              <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={2} />
            ) : (
              <ImageIcon className="h-6 w-6" strokeWidth={2} />
            )}
          </span>
        </span>
        {!isVideo && (
          <span className="absolute left-2 top-2 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white">
            Bild
          </span>
        )}
      </div>
      <p className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-foreground/80">
        {item.label}
      </p>
    </button>
  );
}

function PhaseRow({
  category,
  onPlayClip,
}: {
  category: FilmCategory;
  onPlayClip: (categoryId: string, clipIndex: number) => void;
}) {
  const items = gatherCategoryMedia(category);
  const a = ACCENT[category.accent];
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByDir = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (items.length === 0) {
    return <EmptyPhaseRow category={category} />;
  }

  return (
    <section id={`film-${category.id}`} className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn("h-6 w-1 shrink-0 rounded-full", a.bar)} aria-hidden="true" />
          <h3 className="truncate text-lg font-black uppercase tracking-tight text-foreground md:text-xl">
            {category.label}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-muted-foreground">{items.length}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {category.jumpTo &&
            (category.jumpTo.startsWith("/") ? (
              <Link
                to={category.jumpTo}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Alla
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </Link>
            ) : (
              <a
                href={category.jumpTo}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Alla
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </a>
            ))}
          {/* Bläddra-knappar (desktop — mobil sveper direkt) */}
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label={`Bläddra vänster i ${category.label}`}
              className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label={`Bläddra höger i ${category.label}`}
              className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      <p className="mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      <div
        ref={railRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <ClipTile
            key={mediaIdentityKey(item.src)}
            item={item}
            accent={category.accent}
            onPlay={() => onPlayClip(category.id, idx)}
          />
        ))}
      </div>
    </section>
  );
}

function EmptyPhaseRow({ category }: { category: FilmCategory }) {
  const a = ACCENT[category.accent];
  return (
    <section id={`film-${category.id}`} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3">
        <span className={cn("h-5 w-1 shrink-0 rounded-full opacity-60", a.bar)} aria-hidden="true" />
        <h3 className="text-base font-black uppercase tracking-tight text-foreground/70 md:text-lg">
          {category.label}
        </h3>
        <span className="text-sm text-muted-foreground">
          {category.emptyHint ?? "Läggs till löpande."}
        </span>
        {category.jumpTo?.startsWith("/") && (
          <Link
            to={category.jumpTo}
            className={cn("ml-auto inline-flex items-center gap-1 text-xs font-semibold", a.text)}
          >
            Till matchsidan
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </Link>
        )}
      </div>
    </section>
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
      <button
        type="button"
        aria-label="Stäng"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-amber-300">
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

        <p className="text-center text-xs text-white/60">
          Esc = stäng · ← → = bläddra · klick utanför stänger
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   ROOT
   ========================================================================= */

export default function FilmLibrary() {
  const { session } = useAuthSession();
  const isOwner = isOwnerEmail(session?.user?.email);

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

  const phasesWithMedia = CATEGORIES.filter((c) => gatherCategoryMedia(c).length > 0);
  const emptyPhases = CATEGORIES.filter((c) => gatherCategoryMedia(c).length === 0);

  return (
    <section
      id="filmbibliotek"
      className="scroll-mt-24 border-t border-border bg-gradient-to-b from-muted/30 via-background to-background py-16 md:py-20"
    >
      <div className="container">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Filmbibliotek</p>
        </div>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl lg:text-4xl">
            Hitta rätt film direkt
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Allt material sorterat efter spelfas. Tryck på en film så öppnas den direkt —
            svep i raden för fler, pilarna bläddrar vidare i spelaren.
          </p>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {totals.videos} filmer · {totals.categoriesWithMedia} faser med material
          </p>
        </div>

        {/* Snabbnav — hoppa till en fas */}
        <nav aria-label="Snabbnav filmbibliotek" className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = gatherCategoryMedia(cat).length;
            const a = ACCENT[cat.accent];
            const muted = count === 0;
            return (
              <a
                key={cat.id}
                href={`#film-${cat.id}`}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted",
                  muted && "opacity-60",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", a.bar)} aria-hidden="true" />
                <span>{cat.label}</span>
                <span className="text-muted-foreground">{count > 0 ? count : "–"}</span>
              </a>
            );
          })}
        </nav>

        {/* Filmrader — en per fas med material */}
        <div className="flex flex-col gap-12">
          {phasesWithMedia.map((cat) => (
            <PhaseRow key={cat.id} category={cat} onPlayClip={openClip} />
          ))}
        </div>

        {/* Faser som ännu saknar material — slimmade rader */}
        {emptyPhases.length > 0 && (
          <div className="mt-12 flex flex-col gap-3">
            {emptyPhases.map((cat) => (
              <EmptyPhaseRow key={cat.id} category={cat} />
            ))}
          </div>
        )}

        {/* Admin — endast synligt för ägaren */}
        {isOwner && (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-muted/30 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
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
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground/85 transition-colors hover:border-amber-500 hover:text-amber-700"
                  >
                    {b.navLabel}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
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
