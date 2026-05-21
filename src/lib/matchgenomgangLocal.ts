/**
 * Local storage för Matchgenomgång-editorn.
 *
 * Per slide sparas ändringar i textfälten (title, words, visual, imagePrompt).
 * Nyckel: matchgenomgang:v1:<matchSlug>:<slideId>.
 *
 * Klarar full reset per match, samt hämtning av alla overrides i ett svep.
 */

import type { MatchgenomgangSlide } from "@/data/matchgenomgang";

export type SlideOverride = Partial<Pick<MatchgenomgangSlide, "title" | "words" | "visual" | "imagePrompt">>;

const PREFIX = "matchgenomgang:v1";

const slotKey = (matchSlug: string, slideId: string) => `${PREFIX}:${matchSlug}:${slideId}`;

export function loadSlideOverride(matchSlug: string, slideId: string): SlideOverride | null {
  try {
    const raw = window.localStorage.getItem(slotKey(matchSlug, slideId));
    if (!raw) return null;
    return JSON.parse(raw) as SlideOverride;
  } catch (err) {
    console.error("[matchgenomgangLocal] loadSlideOverride failed:", err);
    return null;
  }
}

export function saveSlideOverride(
  matchSlug: string,
  slideId: string,
  patch: SlideOverride
): SlideOverride {
  const existing = loadSlideOverride(matchSlug, slideId) ?? {};
  const merged: SlideOverride = {
    title: patch.title !== undefined ? patch.title : existing.title,
    words: patch.words !== undefined ? patch.words : existing.words,
    visual: patch.visual !== undefined ? patch.visual : existing.visual,
    imagePrompt: patch.imagePrompt !== undefined ? patch.imagePrompt : existing.imagePrompt,
  };
  // Rensa undefined-fält så storage håller sig lätt
  const cleaned: SlideOverride = {};
  if (merged.title !== undefined) cleaned.title = merged.title;
  if (merged.words !== undefined) cleaned.words = merged.words;
  if (merged.visual !== undefined) cleaned.visual = merged.visual;
  if (merged.imagePrompt !== undefined) cleaned.imagePrompt = merged.imagePrompt;
  window.localStorage.setItem(slotKey(matchSlug, slideId), JSON.stringify(cleaned));
  return cleaned;
}

export function clearSlideOverride(matchSlug: string, slideId: string): void {
  window.localStorage.removeItem(slotKey(matchSlug, slideId));
}

export function clearAllSlidesForMatch(matchSlug: string): void {
  const prefix = `${PREFIX}:${matchSlug}:`;
  const toRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(prefix)) toRemove.push(k);
  }
  for (const k of toRemove) window.localStorage.removeItem(k);
}
