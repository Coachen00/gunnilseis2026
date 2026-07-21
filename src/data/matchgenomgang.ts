/**
 * Matchgenomgång — redigerbar slide-mall som ledarstaben kan ändra
 * direkt i webbläsaren inför varje match. Defaults nedanför är samma
 * 14 slides som ligger i PresentationBrief, så den första gången sidan
 * öppnas ser man en komplett bas att utgå från.
 *
 * Edit-state sparas till localStorage per match (key = MATCH_META.opponent slug)
 * via src/lib/matchgenomgangLocal.ts.
 */

import { MATCH_META } from "./matchplan";

export type SlideAccent = "gold" | "blue" | "red" | "green";

export interface MatchgenomgangSlide {
  /** Stabil id (tappar aldrig — används som localStorage-nyckel per slide) */
  id: string;
  /** 01–14, visuell numrering */
  no: string;
  title: string;
  /** Kort, scanbar mening — max 8 ord. */
  words: string;
  /** En mening om vad bilden ska visa. */
  visual: string;
  /** Bildprompt om vi vill generera en AI-bild senare. */
  imagePrompt: string;
  accent: SlideAccent;
}

const opponent = MATCH_META.opponent;
const kickoffTime = MATCH_META.kickoff.split(" · ")[1] ?? "";

export const MATCHGENOMGANG_DEFAULT_SLIDES: MatchgenomgangSlide[] = [
  {
    id: "veckans-match",
    no: "01",
    title: "Veckans match",
    words: `${opponent}${kickoffTime ? ` · ${kickoffTime}` : ""}`,
    visual: "Full-bleed mörk matchplan/tunnel med gul titel.",
    imagePrompt: "Cinematic dark football matchday tunnel, yellow club light, serious dressing-room mood.",
    accent: "gold",
  },
  {
    id: "identitet",
    no: "02",
    title: "Identitet",
    words: "Scanning · Yta · Passning · Duell · Andraboll",
    visual: "Fem sammanhängande beteenden med tydlig nästa aktion.",
    imagePrompt: "Five-part tactical board: scanning, open space, purposeful pass, duel and second ball.",
    accent: "gold",
  },
  {
    id: "duellspel",
    no: "03",
    title: "Duellspel",
    words: "Upp flera nivåer",
    visual: "Närkamp i centrum, röd riskmarkering.",
    imagePrompt: "Top-down football duel graphic, two player markers colliding, red warning halo.",
    accent: "red",
  },
  {
    id: "andrabollar",
    no: "04",
    title: "Andrabollar",
    words: "Först på nästa boll",
    visual: "Landningsyta ringas in, tre egna attackerar.",
    imagePrompt: "Loose second ball, yellow landing circle, three player markers collapsing toward ball.",
    accent: "green",
  },
  {
    id: "djupled",
    no: "05",
    title: "Djupled",
    words: "Spring bakom",
    visual: "Backlinje, blå löpning bakom, gul passning.",
    imagePrompt: "Defensive line, one deep run arrow behind line, yellow pass arrow.",
    accent: "blue",
  },
  {
    id: "samla",
    no: "06",
    title: "Samla",
    words: "Samla först. Pressa sen.",
    visual: "Lagdelar trycks ihop, avstånd minskar.",
    imagePrompt: "Compact football block, three horizontal team lines squeezed together.",
    accent: "blue",
  },
  {
    id: "pressvillkor",
    no: "07",
    title: "Pressvillkor",
    words: "Höga linjer · kompakt · tre korridorer",
    visual: "Plan med tre korridorer och pressbild.",
    imagePrompt: "Pitch split into three vertical corridors, high line, compact distances.",
    accent: "gold",
  },
  {
    id: "pressfalla",
    no: "08",
    title: "Pressfälla",
    words: "Lås deras vänster",
    visual: "Röd zon vänster, YB på YB, stoppad spelvändning.",
    imagePrompt: "Press trap on opponent left side, red lock zone, blocked switch arrow.",
    accent: "red",
  },
  {
    id: "anfall-5",
    no: "09",
    title: "Anfall · 5 principer",
    words: "Skydda · In · Ut · Framåt · Box",
    visual: "Sekventiell bollväg med fem nummerband.",
    imagePrompt: "Attack sequence five steps: cover, in, out, forward, box, yellow ball arrows and blue runs.",
    accent: "gold",
  },
  {
    id: "spelytor",
    no: "10",
    title: "Spelytor",
    words: "Rättvänd i spelyta 2",
    visual: "Horisontella band, spelyta 2 starkast.",
    imagePrompt: "Horizontal playing zones, zone 2 highlighted bright yellow, right-facing marker.",
    accent: "gold",
  },
  {
    id: "box",
    no: "11",
    title: "Box",
    words: "Fyll fem ytor",
    visual: "Första, straffpunkt, bortre, cutback, andraboll.",
    imagePrompt: "Penalty box map with five highlighted attacking zones.",
    accent: "green",
  },
  {
    id: "last-spel",
    no: "12",
    title: "Låst spel",
    words: "Ta territorium",
    visual: "Pil mot djupt inkast, röd återerövring.",
    imagePrompt: "Ball forced to deep throw-in near corner, immediate high regain press.",
    accent: "red",
  },
  {
    id: "formation",
    no: "13",
    title: "Formation",
    words: "4-2-1-3",
    visual: "Helplan: 4 backar, 2 balans, 1 länk, 3 hot.",
    imagePrompt: "Clean 4-2-1-3 football formation top-down, yellow player markers.",
    accent: "blue",
  },
  {
    id: "omstallning",
    no: "14",
    title: "Omställning",
    words: "Ut ur gröten",
    visual: "Bollvinst, diagonal utgång, djupled direkt.",
    imagePrompt: "Central ball regain, diagonal escape pass, deep run and box attack.",
    accent: "green",
  },
];

/** Slug per match — används som localStorage-prefix så slides kan
 * varieras per motståndare. */
export function matchgenomgangSlug(opponentName: string): string {
  return opponentName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
