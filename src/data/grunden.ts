import { MAJ_2026_BLOCKS } from "@/data/majSpelmodell";
import {
  SPELMODELL_LEVELS,
  SPELMODELL_SPECIAL_LAYERS,
  type SpelmodellLevel,
  type SpelmodellLevelId,
} from "@/data/spelmodellLevels";

export interface Mantra {
  word: string;
  line: string;
  to: string;
}

export const MANTRAN: Mantra[] = [
  { word: "Pressa", line: "Pressa direkt. Vinn tillbaka.", to: "/spelmodell#overgang-forsvar" },
  { word: "Rättvänd", line: "Titta framåt. Spela framåt.", to: "/spelmodell#anfallsspel" },
  { word: "Assistytan", line: "Sista passningen före avslut.", to: "/spelmodell#anfallsspel" },
  { word: "Gyllene zonen", line: "Bästa avslutsytan. Avsluta där.", to: "/spelmodell#anfallsspel" },
];

export const GRUNDEN_MENING =
  "Bredd skapar korridorer. Djup skapar spelytor. Assistytan skapar sista passningen. Gyllene zonen skapar avslut.";

export interface FasRad {
  id: string;
  num: string;
  title: string;
  remember: string;
}

export interface SpecialLayerRad {
  id: string;
  label: string;
  purpose: string;
  href: string;
}

export const PUBLIC_LEVELS: readonly SpelmodellLevel[] = SPELMODELL_LEVELS;

export const NOVIS_LEVEL = SPELMODELL_LEVELS.find(
  (level) => level.id === "novis"
) as SpelmodellLevel;

export const DEFAULT_LEVEL_ID: SpelmodellLevelId = "novis";

export const FAS_RADER: FasRad[] = MAJ_2026_BLOCKS.filter((block) => block.kind === "live").map(
  (block, index) => ({
    id: block.id,
    num: String(index + 1).padStart(2, "0"),
    title: block.title,
    remember: block.remember,
  })
);

export const SPECIAL_RADER: readonly SpecialLayerRad[] = SPELMODELL_SPECIAL_LAYERS.map((layer) => ({
  id: layer.id,
  label: layer.label,
  purpose: layer.purpose,
  href:
    layer.id === "malvaktsperspektiv"
      ? "#malvaktsperspektiv"
      : `#${layer.id}`,
}));

export const NOVIS_MAP = {
  title: "Novis-kartan",
  fallbackTitle: "Textversion av Novis-kartan",
  nodes: [
    {
      id: "novis",
      label: "Novis",
      kind: "level" as const,
      detail: NOVIS_LEVEL.purpose,
    },
    {
      id: "planens-ytor",
      label: "Planens ytor",
      kind: "concept" as const,
      detail: "Se bredd, djup, avslutsyta och vad som finns närmast bollen.",
    },
    {
      id: "korridorer",
      label: "Korridorer",
      kind: "concept" as const,
      detail: "Fem längsgående banor som hjälper laget att förstå bredden.",
    },
    {
      id: "gyllene-zonen",
      label: "Gyllene zonen",
      kind: "concept" as const,
      detail: "Ytan där avslut oftast blir som farligast.",
    },
    {
      id: "assistytan",
      label: "Assistytan",
      kind: "concept" as const,
      detail: "Ytan där sista passningen före avslut ofta startar.",
    },
    {
      id: "spelbredd",
      label: "Spelbredd",
      kind: "concept" as const,
      detail: "Hur vi gör planen stor i sidled.",
    },
    {
      id: "speldjup",
      label: "Speldjup",
      kind: "concept" as const,
      detail: "Hur vi hotar bakom och framför bollen.",
    },
    {
      id: "spelavstand",
      label: "Spelavstånd",
      kind: "concept" as const,
      detail: "Avståndet till spelarna runt dig när laget ska hänga ihop.",
    },
    {
      id: "spelbarhet",
      label: "Spelbarhet",
      kind: "concept" as const,
      detail: "Att vara ett tydligt passningsalternativ för lagkamraten.",
    },
  ],
  edges: [
    { from: "novis", to: "planens-ytor", label: "börjar med" },
    { from: "planens-ytor", to: "korridorer", label: "visar bredden via" },
    { from: "planens-ytor", to: "spelbredd", label: "hjälper dig förstå" },
    { from: "planens-ytor", to: "speldjup", label: "hjälper dig förstå" },
    { from: "korridorer", to: "assistytan", label: "leder vidare till" },
    { from: "assistytan", to: "gyllene-zonen", label: "sista passningen går mot" },
    { from: "spelavstand", to: "spelbarhet", label: "gör dig" },
  ],
};
