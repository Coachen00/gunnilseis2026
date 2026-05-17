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
 * När admin lägger till nya klipp via Supabase eller via majSpelmodell.ts
 * dyker de upp i rätt kategori automatiskt. Tomma kategorier visar
 * tydligt tomt läge istället för att försvinna.
 */

import { Link } from "react-router-dom";
import { ArrowRight, Film, Image as ImageIcon, Play, Sparkles } from "lucide-react";
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
      "Klipp och bilder kopplade till matchen som spelas nu på lördag — motståndaranalys, fokuspunkter och repris.",
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
  amber: {
    bar: "bg-amber-500",
    text: "text-amber-700",
    ring: "hover:border-amber-500/60",
    chipBg: "bg-amber-50",
    chipText: "text-amber-800",
  },
  red: {
    bar: "bg-red-500",
    text: "text-red-700",
    ring: "hover:border-red-500/60",
    chipBg: "bg-red-50",
    chipText: "text-red-800",
  },
  blue: {
    bar: "bg-sky-500",
    text: "text-sky-700",
    ring: "hover:border-sky-500/60",
    chipBg: "bg-sky-50",
    chipText: "text-sky-800",
  },
  green: {
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "hover:border-emerald-500/60",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-800",
  },
  violet: {
    bar: "bg-violet-500",
    text: "text-violet-700",
    ring: "hover:border-violet-500/60",
    chipBg: "bg-violet-50",
    chipText: "text-violet-800",
  },
  slate: {
    bar: "bg-slate-400",
    text: "text-slate-600",
    ring: "hover:border-slate-400/60",
    chipBg: "bg-slate-100",
    chipText: "text-slate-700",
  },
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

function getBlockLabel(blockId: string): string {
  return MAJ_2026_BLOCKS.find((b) => b.id === blockId)?.navLabel ?? blockId;
}

function isInternal(src: string): boolean {
  return !/^https?:\/\//i.test(src);
}

function ClipCard({ item, accent }: { item: MediaAsset; accent: AccentKey }) {
  const a = ACCENT[accent];
  const isVideo = item.kind === "video";
  const Icon = isVideo ? Play : ImageIcon;
  // Stripped, fast thumbnail card — full playback lives in the block accordion below.
  return (
    <div
      className={`group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors ${a.ring}`}
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-[radial-gradient(circle_at_30%_20%,hsl(var(--muted))_0%,#0b0b0b_75%)]">
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,194,66,0.10),transparent_46%,rgba(58,111,198,0.10))]" />
        <span className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 ${a.text} shadow-md`}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/90"
              style={{ background: "rgba(0,0,0,0.55)" }}>
          {isVideo ? "Film" : "Bild"}
        </span>
      </div>
      <div className="min-h-[2.5rem]">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {item.label}
        </p>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: FilmCategory }) {
  const items = gatherCategoryMedia(category);
  const a = ACCENT[category.accent];
  const videoCount = items.filter((i) => i.kind === "video").length;
  const imageCount = items.length - videoCount;
  const hasItems = items.length > 0;

  // Preview = max 3 items in the library card; remaining are accessible via "Visa allt"
  const preview = items.slice(0, 3);

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

      <p className="text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      {hasItems ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((item) => (
              <ClipCard key={mediaIdentityKey(item.src)} item={item} accent={category.accent} />
            ))}
          </div>
          {category.jumpTo && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {items.length > preview.length
                  ? `${items.length - preview.length} fler i blocket`
                  : "Hela blocket"}
              </p>
              {category.jumpTo.startsWith("/") ? (
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
                  Visa allt i blocket
                  <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
                </a>
              )}
            </div>
          )}
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

export default function FilmLibrary() {
  // Aggregate totals — visas i sektionsrubriken så användaren ser hela bibliotekets storlek
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
              Allt material under Maj 2026 sorterat efter spelfas. Klicka på en
              kategori för att se preview, eller hoppa direkt till blocket för
              full uppspelning.
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

        {/* Quick-nav chips — gör det snabbt att skanna alla 8 kategorier */}
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
                <span className="text-muted-foreground">
                  {count > 0 ? count : "–"}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="grid gap-5 md:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
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
    </section>
  );
}
