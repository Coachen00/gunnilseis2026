/**
 * Världarna — den nya informationsarkitekturen. Sex toppnivåer (Hem, Match,
 * Spelmodell, Laget, Verktyg, Coach), en lugn huvudaccent per värld. Klass-
 * strängarna är statiska (inte interpolerade) så att Tailwinds purge inte tar
 * bort dem — samma mönster som hem-stripens ACCENT-objekt.
 *
 * TopNav äger själva nav-strukturen; den här filen äger färgspråket som hubbar,
 * kort och labels delar.
 */
export type WorldId = "hem" | "match" | "spelmodell" | "laget" | "verktyg" | "coach";

export interface WorldAccent {
  /** Eyebrow-/label-text — alltid mörk nog för WCAG AA på vit yta. */
  label: string;
  /** Liten chip för nummer/ikon (bakgrund + ram + text). */
  chip: string;
  /** Ikonfärg på neutral yta. */
  icon: string;
  /** Tunn regel/linje. */
  bar: string;
  /** Hover-ram på kort. */
  ring: string;
}

export const WORLD_ACCENTS: Record<WorldId, WorldAccent> = {
  hem: {
    label: "text-foreground/70",
    chip: "bg-muted border-border text-foreground/70",
    icon: "text-foreground/70",
    bar: "bg-foreground/40",
    ring: "hover:border-foreground/30",
  },
  match: {
    label: "text-sky-700",
    chip: "bg-sky-50 border-sky-300/80 text-sky-700",
    icon: "text-sky-700",
    bar: "bg-sky-500",
    ring: "hover:border-sky-500/70 hover:bg-sky-50/40",
  },
  spelmodell: {
    label: "text-amber-700",
    chip: "bg-amber-50 border-amber-400/70 text-amber-700",
    icon: "text-amber-700",
    bar: "bg-amber-500",
    ring: "hover:border-amber-500/70 hover:bg-amber-50/40",
  },
  laget: {
    label: "text-stone-600",
    chip: "bg-stone-100 border-stone-300 text-stone-700",
    icon: "text-stone-600",
    bar: "bg-stone-500",
    ring: "hover:border-stone-400 hover:bg-stone-50/60",
  },
  verktyg: {
    label: "text-slate-700",
    chip: "bg-slate-100 border-slate-300 text-slate-700",
    icon: "text-slate-700",
    bar: "bg-slate-500",
    ring: "hover:border-slate-500/70 hover:bg-slate-50/60",
  },
  coach: {
    label: "text-amber-700",
    chip: "bg-zinc-900 border-zinc-700 text-amber-300",
    icon: "text-amber-600",
    bar: "bg-amber-500",
    ring: "hover:border-zinc-400 hover:bg-zinc-50/60",
  },
};
