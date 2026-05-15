/**
 * Domän för mediabiblioteket. Håller kategori-id, etiketter och vilka
 * spelmodell-sidor som hämtar varje kategori. Källan till sanning för
 * filterval + visningsuppslag.
 */

export const MEDIA_CATEGORIES = [
  {
    id: "anfall",
    label: "Anfall",
    short: "Anfallsspel",
    description: "Fem principer för anfallsspel — skydda mot kontring → fyll på i box.",
    routePath: "/anfall",
  },
  {
    id: "omstallning-anfall",
    label: "Övergång till anfall",
    short: "Omställning → anfall",
    description: "Det första som händer när vi vinner bollen.",
    routePath: "/omstallning-anfall",
  },
  {
    id: "forsvar",
    label: "Försvar",
    short: "Försvarsspel",
    description: "Tre höjder, samma logik: förhindra avslut i gyllene zonen.",
    routePath: "/forsvar",
  },
  {
    id: "omstallning-forsvar",
    label: "Övergång till försvar",
    short: "Omställning → försvar",
    description: "De första sekunderna efter bollförlust.",
    routePath: "/omstallning-forsvar",
  },
  {
    id: "identitet",
    label: "Identitet",
    short: "Identitetsbeteenden",
    description: "Fyra beteenden som måste synas i träning och match.",
    routePath: "/identitet",
  },
  {
    id: "fasta",
    label: "Fasta situationer",
    short: "Fasta",
    description: "Hörnor, frisparkar, inkast, straffar — anfall och försvar.",
    routePath: "/fasta",
  },
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]["id"];

export const MEDIA_CATEGORY_IDS: readonly MediaCategory[] = MEDIA_CATEGORIES.map(
  (c) => c.id,
);

export function categoryLabel(id: MediaCategory | string): string {
  return MEDIA_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function categoryMeta(id: MediaCategory | string) {
  return MEDIA_CATEGORIES.find((c) => c.id === id);
}

export interface MediaLibraryItem {
  id: string;
  title: string;
  description: string | null;
  category: MediaCategory;
  media_type: "video" | "image";
  source_kind: "url" | "upload";
  url: string | null;
  storage_path: string | null;
  principle_id: string | null;
  block_id: string | null;
  match_id: string | null;
  training_label: string | null;
  event_date: string | null;
  visible_to_players: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaLibraryDraft {
  title: string;
  description?: string | null;
  category: MediaCategory;
  media_type: "video" | "image";
  source_kind: "url" | "upload";
  url?: string | null;
  storage_path?: string | null;
  principle_id?: string | null;
  block_id?: string | null;
  match_id?: string | null;
  training_label?: string | null;
  event_date?: string | null;
  visible_to_players?: boolean;
}

/** Filändelser för validering. Acceptlistor delas mellan upload + UI. */
export const MEDIA_VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,video/x-matroska,video/mpeg";
export const MEDIA_IMAGE_ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/gif,image/heic,image/heif";

/**
 * Max filstorlek (bytes). Supabase free har 50 MB default — pro 5 GB.
 * Vi cappar klient-side till 300 MB för att inte stuckna laddningar.
 * (Servern är källan av sanning; detta är bara en hint.)
 */
export const MEDIA_MAX_FILE_SIZE = 300 * 1024 * 1024;

/** Maxlängd för titel — håll det lagom så det inte breakar listvy. */
export const MEDIA_TITLE_MAX = 120;
export const MEDIA_DESCRIPTION_MAX = 800;
