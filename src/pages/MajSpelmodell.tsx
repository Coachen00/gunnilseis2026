import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Swords,
  Repeat,
  Flame,
  Target,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  X,
  Eye,
  Footprints,
  Crown,
  Box,
  CornerDownLeft,
  Film,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Activity,
  Wrench,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_EFFECT_LOGIC,
  MAJ_2026_HERO,
  MAJ_2026_NAV_CARDS,
  MAJ_2026_OVRIGT_MEDIA,
  MAJ_2026_PRINCIPLE_MEDIA,
  MAJ_2026_QUICK_ACTIONS,
  type BlockColor,
  type MajBlock,
  type MediaAsset,
  type PrincipleDef,
} from "@/data/majSpelmodell";
import PrincipleMediaSlot from "@/components/PrincipleMediaSlot";
import FilmLibrary from "@/components/maj/FilmLibrary";
import VeckansPlanering from "@/components/maj2026/VeckansPlanering";
import GrundenSection from "@/components/maj2026/GrundenSection";
import LevelBadge from "@/components/LevelBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import LevelPath from "@/components/spelmodell/LevelPath";
import ConceptMap, {
  type ConceptMapEdge,
  type ConceptMapNode,
} from "@/components/spelmodell/ConceptMap";
import {
  LIVE_PHASE_IDS,
  SPELMODELL_LEVELS,
  SPELMODELL_SPECIAL_LAYERS,
  type SpelmodellLevelId,
} from "@/data/spelmodellLevels";

/** Renderar bara children om inloggad användare är admin. Tyst annars. */
const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useIsAdmin();
  if (loading || !isAdmin) return null;
  return <>{children}</>;
};

const MODEL_INTRO = [
  {
    title: "Vad är en spelmodell?",
    text: "En spelmodell är våra gemensamma beslut före, under och efter match. Den gör att elva spelare kan känna igen samma situation och agera ihop.",
  },
  {
    title: "Varför vi behöver den",
    text: "För att spelaren inte ska behöva gissa. När matchen blir stressig ska modellen ge nästa handling: pressa, säkra, spela framåt eller falla hem.",
  },
  {
    title: "Vår identitet i en mening",
    text: "Vi är ett lag som skyddar mitten, spelar framåt när läget finns, fyller boxen och reagerar direkt när bollen byter ägare.",
  },
  {
    title: "Fyra skeden och två särdelar",
    text: "Försvar, omställning till anfall, anfall, omställning till försvar — plus identiteten som följer med överallt och fasta situationer när bollen är död.",
  },
  {
    title: "Vad gör spelaren först?",
    text: "Känn igen skedet: försvarar vi, vinner vi bollen, anfaller vi, tappar vi bollen eller står bollen still? Välj sedan handlingen som hör till skedet.",
  },
  {
    title: "Hur detta tränas",
    text: "Varje princip tränas med matchsignal, spelarhandling och laghandling. Övningen ska likna situationen vi vill se i match.",
  },
  {
    title: "Hur detta syns i match",
    text: "Vi letar efter tydliga matchtecken: press, spelbarhet, löpningar, fyll boxen, återerövring och kontroll efter bolltapp.",
  },
  {
    title: "Hur vi följer upp",
    text: "Efter träning och match jämför vi beteenden mot principerna. Först språk, sedan klipp, sedan nästa justering.",
  },
] as const;

const MODEL_FLOW = ["Spelprincip", "Matchtillstånd", "Prioritering", "Beteende"] as const;
const MATCH_STATE_FACTORS = ["Resultat", "Tid", "Motståndarpress", "Spelarstatus", "Numerär"] as const;
const PRIORITIES = ["Behåll", "Öka risk", "Skydda", "Byt plan"] as const;

const NOVICE_LEVEL = SPELMODELL_LEVELS.find((level) => level.id === "novis")!;
const NOVICE_MAP_CONCEPTS = NOVICE_LEVEL.concepts;
const NOVICE_MAP_NODES: readonly ConceptMapNode[] = [
  {
    id: NOVICE_LEVEL.id,
    label: NOVICE_LEVEL.label,
    kind: "level",
    detail: NOVICE_LEVEL.purpose,
  },
  ...NOVICE_MAP_CONCEPTS.map((concept, index) => ({
    id: `novis-concept-${index}`,
    label: concept,
    kind: "concept" as const,
    detail: "Ett grundbegrepp som hjälper dig att orientera dig och välja nästa handling.",
  })),
];
const NOVICE_MAP_EDGES: readonly ConceptMapEdge[] = NOVICE_MAP_CONCEPTS.map((_, index) => ({
  from: NOVICE_LEVEL.id,
  to: `novis-concept-${index}`,
  label: "börja här",
}));

const LIVE_PHASE_LINKS = [
  { phase: LIVE_PHASE_IDS[0], label: "Försvarsspel", href: "#forsvarsspel" },
  { phase: LIVE_PHASE_IDS[1], label: "När vi vinner bollen", href: "#overgang-anfall" },
  { phase: LIVE_PHASE_IDS[2], label: "Anfallsspel", href: "#anfallsspel" },
  { phase: LIVE_PHASE_IDS[3], label: "När vi tappar bollen", href: "#overgang-forsvar" },
] as const;

const LIVE_BLOCK_IDS = new Set([
  "forsvarsspel",
  "overgang-anfall",
  "anfallsspel",
  "overgang-forsvar",
]);

function LevelOverview() {
  const [selectedLevelId, setSelectedLevelId] = useState<SpelmodellLevelId>("novis");
  const selectedLevel = SPELMODELL_LEVELS.find((level) => level.id === selectedLevelId)!;

  return (
    <section
      data-testid="level-overview-section"
      className="border-b border-kedja-border bg-kedja-paper py-14 md:py-18"
      aria-labelledby="level-overview-title"
    >
      <div className="container space-y-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
            Din väg genom spelmodellen
          </p>
          <h2 id="level-overview-title" className="mt-3 text-3xl font-black uppercase tracking-tight text-kedja-ink md:text-5xl">
            Börja där du är
          </h2>
          <p className="mt-4 text-base leading-relaxed text-kedja-deep/75 md:text-lg">
            Ta en nivå i taget. Välj nivå för att se vad du ska förstå och kunna göra på planen.
          </p>
        </div>

        <LevelPath
          levels={SPELMODELL_LEVELS}
          selectedLevelId={selectedLevelId}
          onSelect={setSelectedLevelId}
        />

        <article className="border border-kedja-border bg-white p-5 md:p-7">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
            {selectedLevel.label}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-kedja-ink">{selectedLevel.purpose}</h3>
          <p className="mt-3 text-sm leading-relaxed text-kedja-deep/75">När du är klar: {selectedLevel.playerOutcome}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {selectedLevel.concepts.map((concept) => (
              <li key={concept} className="rounded-full border border-kedja-border bg-kedja-paper px-3 py-2 text-sm font-semibold text-kedja-ink">
                {concept}
              </li>
            ))}
          </ul>
        </article>

        {selectedLevel.id === "novis" ? (
          <div data-testid="novice-overview">
            <ConceptMap
              title="Novis · orientera dig på planen"
              nodes={NOVICE_MAP_NODES}
              edges={NOVICE_MAP_EDGES}
              fallbackTitle="Textversion av Novis-kartan"
            />
          </div>
        ) : null}

        <div data-testid="live-phases-overview" aria-labelledby="live-phases-title">
          <h3 id="live-phases-title" className="text-2xl font-black tracking-tight text-kedja-ink">
            Fyra levande skeden
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-kedja-deep/75">
            Börja med att känna igen vad som händer med bollen. Gå sedan till rätt skede.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {LIVE_PHASE_LINKS.map((item, index) => (
              <a
                key={item.phase}
                href={item.href}
                className="min-h-11 border border-kedja-border bg-white p-4 transition-colors hover:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <span className="font-mono text-[10px] font-black text-amber-700">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-2 block font-black text-kedja-ink">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div data-testid="special-layers-overview" aria-labelledby="special-layers-title">
          <h3 id="special-layers-title" className="text-2xl font-black tracking-tight text-kedja-ink">
            Lager som följer eller pausar spelet
          </h3>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {SPELMODELL_SPECIAL_LAYERS.map((layer) => (
              <article key={layer.id} className="border border-kedja-border bg-white p-4">
                <h4 className="font-black text-kedja-ink">{layer.label}</h4>
                {layer.id === "identitet" ? (
                  <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">Tvärgående</p>
                ) : null}
                <p className="mt-2 text-sm leading-relaxed text-kedja-deep/75">{layer.purpose}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const GLOSSARY = [
  { term: "Spelmodell", definition: "Vårt gemensamma språk för matchens olika lägen.", match: "Matchen byter läge hela tiden.", action: "Använd modellen för att veta nästa beslut." },
  { term: "Spelidé", definition: "Vår övergripande tanke om hur vi vill spela.", match: "Vårt sätt att vinna matchens vanligaste situationer.", action: "Välj lösningen som passar vår idé, inte bara första impulsen." },
  { term: "Princip", definition: "En regel för ett återkommande fotbollsproblem.", match: "En återkommande situation dyker upp.", action: "Gör samma kloka beslut oftare." },
  { term: "Roll", definition: "Ditt ansvar i laget när skedet ändras.", match: "Din position hamnar i ett skede.", action: "Ta ansvaret som hör till din plats." },
  { term: "Trigger", definition: "En signal som säger att vi ska agera nu.", match: "En signal startar nästa beteende.", action: "Reagera direkt när signalen kommer." },
  { term: "Scanning", definition: "Att titta runt innan bollen kommer.", match: "Du ska få eller vinna bollen.", action: "Titta före mottagning så du vet nästa passning." },
  { term: "Positionering", definition: "Att placera kroppen där du hjälper laget mest.", match: "Bollen, mål och motståndare flyttar sig.", action: "Stå där du hjälper laget mest just nu." },
  { term: "Press", definition: "Att störa bollhållaren så nästa pass blir sämre.", match: "Motståndaren kan spela framåt.", action: "Gå på bollhållaren och styr bort från farlig yta." },
  { term: "Understöd", definition: "Hjälpen nära spelaren som agerar först.", match: "Lagkamrat pressar eller har boll.", action: "Ge hjälp bakom, bredvid eller framför." },
  { term: "Spelvändning", definition: "Att flytta bollen från trång sida till fri sida.", match: "En sida är låst.", action: "Flytta bollen till fri sida med tempo." },
  { term: "Yta", definition: "Platsen där vi kan vinna tid, meter eller fördel.", match: "Motståndaren lämnar plats mellan spelare eller lagdelar.", action: "Ta ytan innan den stängs." },
  { term: "Tredje man", definition: "Spelaren som blir fri efter två andra har bundit press.", match: "Två spelare binder press.", action: "Bli nästa fria spelare." },
  { term: "Omställning", definition: "Sekunden när bollen byter lag.", match: "Bollen byter ägare.", action: "Byt beteende direkt: framåt eller återerövra." },
  { term: "Spelbarhet", definition: "Att vara ett bra passningsalternativ.", match: "Lagkamrat har boll.", action: "Ge minst ett tryggt och ett framåtriktat alternativ." },
  { term: "Relationer", definition: "Hur närliggande spelare hjälper varandra.", match: "Två eller tre spelare löser ytan ihop.", action: "Håll avstånd, vinkel och tajming till spelarna runt dig." },
] as const;

/* =========================================================================
   COLOR TOKENS — light palette (matchar sajtens default-tema)
   ========================================================================= */

type Tone = BlockColor;

const TONE_BG: Record<Tone, string> = {
  yellow: "bg-amber-50 border-amber-400/70",
  red: "bg-rose-50 border-rose-300/80",
  blue: "bg-sky-50 border-sky-300/80",
  green: "bg-emerald-50 border-emerald-300/80",
  white: "bg-kedja-paper border-kedja-border",
};

const TONE_DOT: Record<Tone, string> = {
  yellow: "bg-amber-500",
  red: "bg-rose-500",
  blue: "bg-sky-600",
  green: "bg-emerald-600",
  white: "bg-foreground",
};

const TONE_TEXT: Record<Tone, string> = {
  yellow: "text-amber-700",
  red: "text-rose-700",
  blue: "text-sky-700",
  green: "text-emerald-700",
  white: "text-kedja-ink",
};

const BLOCK_ICON: Record<string, typeof Shield> = {
  forsvarsspel: Shield,
  "overgang-anfall": Zap,
  anfallsspel: Swords,
  "overgang-forsvar": Repeat,
  identitet: Flame,
  "fasta-situationer": Target,
};

const BLOCK_EYEBROW: Record<string, string> = {
  storyn: "Taket över spelmodellen",
  forsvarsspel: "När motståndaren har bollen",
  "overgang-anfall": "I sekunden bollen är vår",
  anfallsspel: "När vi har bollen",
  "overgang-forsvar": "I sekunden bollen är deras",
  identitet: "Tvärgående · det här är vi varje match",
  "fasta-situationer": "Död boll · fasta situationer",
};

const TACTICAL_STEPS: Record<string, Array<{ label: string; cue: string; detail: string }>> = {
  forsvarsspel: [
    { label: "Skydda mitten", cue: "Stäng den farligaste vägen först.", detail: "Laget håller ihop centralt och styr spelet mot en yttre korridor." },
    { label: "Läs triggern", cue: "Se den passning som gör pressen möjlig.", detail: "En svag passning eller mottagning sätter nästa spelare i arbete." },
    { label: "Pressa ihop", cue: "En pressar, resten täcker.", detail: "Närmaste spelare går på boll och laget flyttar med bakom." },
  ],
  "overgang-anfall": [
    { label: "Titta framåt", cue: "Första blicken är mot mål.", detail: "Bollhållaren söker djupled eller en fri yta bakom motståndaren." },
    { label: "Spela framåt", cue: "Ta fördelen innan den försvinner.", detail: "Passningen går med fart genom eller förbi den första pressen." },
    { label: "Löp diagonalt", cue: "Fyll nästa yta med fart.", detail: "Främre spelare hotar assistytan medan laget följer efter." },
  ],
  anfallsspel: [
    { label: "Skydda mot kontring", cue: "Ha en säkerhet bakom bollen.", detail: "Sexan och backlinjen håller balansen innan fler fyller på." },
    { label: "Spela in", cue: "Locka in motståndaren.", detail: "Vi hittar en spelare centralt eller i halvyta för att dra ihop laget." },
    { label: "Spela ut", cue: "Flytta bollen till fri sida.", detail: "Tredje man hjälper oss ur pressen och öppnar nästa korridor." },
    { label: "Vinn assistytan", cue: "Ta ytan där sista passningen börjar.", detail: "Bollen kommer bakom eller utanför deras backlinje." },
    { label: "Fyll boxen", cue: "Minst fyra spelare attackerar målområdet.", detail: "Första, straffpunkt, bortre och cutback täcks när bollen kommer in." },
  ],
  "overgang-forsvar": [
    { label: "Pressa direkt", cue: "Närmaste spelare attackerar bollen.", detail: "Första sekunden efter bolltapp används till att störa nästa passning." },
    { label: "Stäng vägar", cue: "Två spelare skyddar passningslinjer.", detail: "Laget gör planen liten bakom den första pressen." },
    { label: "Vinn eller bromsa", cue: "Återerövra om läget finns, annars hem.", detail: "Vi återtar kontrollen innan motståndaren får spela framåt." },
  ],
  identitet: [
    { label: "Duellen", cue: "Gå in beslutsamt.", detail: "Vi visar mod när bollen eller ytan är vår att vinna." },
    { label: "Andrabollen", cue: "Läs studsen före alla andra.", detail: "Närmaste spelare säkrar nästa aktion efter duellen." },
    { label: "Nästa aktion", cue: "Kroppsspråk som hjälper laget.", detail: "Vi återgår till uppgiften direkt efter både vinst och misstag." },
  ],
  "fasta-situationer": [
    { label: "Ta plats", cue: "Veta din startposition.", detail: "Varje spelare har en plats, ett ansvar och ett signalord." },
    { label: "Kör mönstret", cue: "Löpningen säljs helt.", detail: "Vi litar på planen och tajmar aktionen tillsammans." },
    { label: "Säkra returen", cue: "Nästa boll är också vår.", detail: "Laget täcker första boll, andraboll och kontringsskydd." },
  ],
};

/* =========================================================================
   SHARED COMPONENTS
   ========================================================================= */

function MediaGrid({ items, columns = 2 }: { items: MediaAsset[]; columns?: 2 | 3 }) {
  const uniqueItems = uniqueMediaItems(items);
  if (uniqueItems.length === 0) return null;
  const cols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 gap-3 ${cols}`}>
      {uniqueItems.map((item) => (
        <figure
          key={item.src}
          className="overflow-hidden rounded-md border border-kedja-border bg-kedja-paper"
        >
          <div className="bg-black">
            {item.kind === "video" ? (
              <DeferredVideo item={item} />
            ) : (
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                className="max-h-72 w-full bg-black object-contain"
              />
            )}
          </div>
          <figcaption className="px-3 py-2 text-xs font-bold leading-snug text-kedja-ink/85">
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function uniqueMediaItems(items: MediaAsset[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = mediaIdentityKey(item.src);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mediaIdentityKey(src: string) {
  const youtube = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (youtube) return `youtube:${youtube[1]}`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `vimeo:${vimeo[1]}`;
  return src.split("?")[0];
}

function DeferredVideo({ item }: { item: MediaAsset }) {
  const [active, setActive] = useState(false);
  const embedUrl = videoEmbedUrl(item.src);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={item.label}
        className="aspect-video w-full bg-black"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (active) {
    return (
      <video
        src={item.src}
        controls
        autoPlay
        preload="metadata"
        playsInline
        className="aspect-video w-full bg-black"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--muted))_0%,#050505_78%)] text-left"
      aria-label={`Spela film: ${item.label}`}
    >
      <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,194,66,0.16),transparent_42%,rgba(58,111,198,0.16))]" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg transition-transform group-hover:scale-105">
        <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={1.8} />
      </span>
      <span className="absolute bottom-3 left-3 right-3 rounded bg-black/65 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/85">
        Spela film
      </span>
    </button>
  );
}

function videoEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (youtube) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
    });
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}?${params.toString()}`;
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;

  return null;
}

function getBlockMedia(blockId: string): MediaAsset[] {
  const principleGroups = Object.values(MAJ_2026_PRINCIPLE_MEDIA[blockId] ?? {});
  const unique = new Map<string, MediaAsset>();
  for (const items of principleGroups) {
    for (const item of items) {
      if (!unique.has(item.src)) unique.set(item.src, item);
    }
  }
  return Array.from(unique.values());
}

function BlockMediaOverview({ items }: { items: MediaAsset[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8 border border-kedja-border bg-white p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-amber-700" strokeWidth={2.1} />
          <h3 className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">
            Matchklipp i blocket
          </h3>
        </div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kedja-deep/70">
          {items.length} filer
        </p>
      </div>
      <MediaGrid items={items} columns={items.length >= 3 ? 3 : 2} />
    </div>
  );
}

function ModelIntro() {
  return (
    <section
      id="vad-ar-spelmodellen"
      data-testid="spelmodell-how-it-works"
      className="scroll-mt-24 border-b border-kedja-border bg-kedja-paper py-14 md:py-18"
      aria-labelledby="spelmodell-how-it-works-title"
    >
      <div className="container">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
            Vi vet vad vi ska göra innan situationen händer
          </p>
        </div>
        <h2 id="spelmodell-how-it-works-title" className="mb-6 text-3xl font-black uppercase tracking-tight text-kedja-ink md:text-5xl">
          Så arbetar du med spelmodellen
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {MODEL_INTRO.map((item) => (
            <article key={item.title} className="border border-kedja-border bg-white p-5">
              <h2 className="text-lg font-black tracking-tight text-kedja-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-kedja-ink/72">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 border border-amber-500/40 bg-amber-50 p-5">
          <h2 className="text-xl font-black tracking-tight text-kedja-ink">Så används den</h2>
          <ol className="mt-3 grid gap-2 text-sm font-semibold text-kedja-ink/78 md:grid-cols-4">
            {MODEL_FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black text-amber-700">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-5 grid gap-4 border-t border-amber-500/25 pt-4 md:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">Matchtillstånd läses genom</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-ink/75">{MATCH_STATE_FACTORS.join(" · ")}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">Prioriteringen kan vara</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-ink/75">{PRIORITIES.join(" · ")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrincipleLearningCard({ principle }: { principle: PrincipleDef }) {
  const rows = [
    ["Definition", principle.definition],
    ["Matchsignal", principle.matchSignal],
    ["Spelaren gör", principle.playerAction],
    ["Laget gör", principle.teamAction],
    ["Träna så här", principle.trainingAction],
    ["Matchtecken", principle.matchMetric],
  ] as const;

  return (
    <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rows.map(([label, text]) => (
        <div key={label} className="border border-kedja-border bg-white p-3">
          <dt className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">{label}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-kedja-ink/78">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

function GlossarySection() {
  return (
    <section id="ordlista" className="scroll-mt-24 border-t border-kedja-border bg-kedja-paper/30 py-16 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Ordlista</p>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-kedja-ink md:text-4xl">
              Begrepp som måste betyda samma sak för alla
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-kedja-deep/70">
            Varje ord ska kunna kopplas till matchbild och spelarhandling. Om ordet inte hjälper nästa aktion ska det inte styra spelaren.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {GLOSSARY.map((item) => (
            <article key={item.term} className="border border-kedja-border bg-kedja-paper p-4">
              <h3 className="text-base font-black text-kedja-ink">{item.term}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kedja-ink/70">
                <span className="font-bold text-kedja-ink">Enkelt:</span> {item.definition}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-kedja-ink/70">
                <span className="font-bold text-kedja-ink">I match:</span> {item.match}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-kedja-ink/70">
                <span className="font-bold text-kedja-ink">Spelaren:</span> {item.action}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MediaSlot({ label = "Lägg in film eller bild här", description }: { label?: string; description?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex h-44 w-full flex-col items-center justify-center gap-2 border border-dashed border-kedja-border bg-white px-4 text-center"
    >
      <div className="flex items-center gap-3 text-kedja-ink/55">
        <Film className="h-5 w-5" strokeWidth={1.6} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">{label}</span>
      </div>
      {description && <p className="text-xs text-kedja-ink/45">{description}</p>}
    </div>
  );
}

function DoColumn({
  variant,
  items,
  title,
}: {
  variant: "do" | "dont" | "remember";
  items: string[];
  title: string;
}) {
  const styles = {
    do: {
      border: "border-emerald-300",
      bg: "bg-emerald-50",
      Icon: Check,
      iconClass: "text-emerald-700",
      dotBg: "bg-emerald-600",
      titleClass: "text-emerald-800",
    },
    dont: {
      border: "border-rose-300",
      bg: "bg-rose-50",
      Icon: X,
      iconClass: "text-rose-700",
      dotBg: "bg-rose-500",
      titleClass: "text-rose-800",
    },
    remember: {
      border: "border-amber-300",
      bg: "bg-amber-50",
      Icon: AlertTriangle,
      iconClass: "text-amber-700",
      dotBg: "bg-amber-500",
      titleClass: "text-amber-800",
    },
  }[variant];

  const Icon = styles.Icon;

  return (
    <div className={["rounded-md border p-5", styles.border, styles.bg].join(" ")}>
      <div className="mb-3 flex items-center gap-2.5">
        <Icon className={["h-4 w-4", styles.iconClass].join(" ")} strokeWidth={2.4} />
        <p className={["font-mono text-[11px] font-black uppercase tracking-[0.22em]", styles.titleClass].join(" ")}>
          {title}
        </p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-kedja-ink/85">
            <span className={["mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full", styles.dotBg].join(" ")} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================================
   TACTICAL PITCH BASE
   ========================================================================= */

function PitchSurface({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 1000 1500"
      className="h-auto w-full"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="pitchSurface" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#143d2a" />
          <stop offset="55%" stopColor="#0d2f20" />
          <stop offset="100%" stopColor="#071d13" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="1500" fill="url(#pitchSurface)" />

      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * 150}
          width="1000"
          height="75"
          fill={i % 2 === 0 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.07)"}
        />
      ))}

      <g fill="none" stroke="rgba(220,255,230,0.65)" strokeWidth="5">
        <rect x="70" y="70" width="860" height="1360" />
        <line x1="70" x2="930" y1="750" y2="750" />
        <circle cx="500" cy="750" r="118" />
        <circle cx="500" cy="750" r="8" fill="rgba(220,255,230,0.82)" stroke="none" />
        <rect x="250" y="70" width="500" height="220" />
        <rect x="345" y="70" width="310" height="90" />
        <path d="M 385 290 A 150 150 0 0 0 615 290" />
        <rect x="250" y="1210" width="500" height="220" />
        <rect x="345" y="1340" width="310" height="90" />
        <path d="M 385 1210 A 150 150 0 0 1 615 1210" />
      </g>

      {children}
    </svg>
  );
}

function PlayerDot({
  x,
  y,
  label,
  variant = "own",
}: {
  x: number;
  y: number;
  label: string;
  variant?: "own" | "opp" | "focus";
}) {
  const fill = variant === "opp" ? "#22498f" : variant === "focus" ? "#f5c242" : "#f2f5f4";
  const stroke = variant === "opp" ? "#8ab7ff" : variant === "focus" ? "#fff4b8" : "#dce8e4";
  const textFill = variant === "opp" ? "#fff" : "#0c2018";
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="20" rx="26" ry="9" fill="rgba(0,0,0,0.32)" />
      <circle r="26" fill={fill} stroke={stroke} strokeWidth="5" />
      <text
        y="8"
        textAnchor="middle"
        fontSize="24"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fill={textFill}
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({
  d,
  color = "#f5c242",
  width = 8,
  dashed = false,
  id,
  step,
}: {
  d: string;
  color?: string;
  width?: number;
  dashed?: boolean;
  id: string;
  step?: number;
}) {
  return (
    <>
      <defs>
        <marker id={id} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 12 6 L 0 12 z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        className="tactical-arrow"
        data-tactical-step={step}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${id})`}
        strokeDasharray={dashed ? "14 14" : undefined}
      />
    </>
  );
}

/* =========================================================================
   BLOCK-SPECIFIC TACTICAL VISUALS
   ========================================================================= */

function ForsvarPitch() {
  return (
    <PitchSurface label="Försvarsspel — tre korridorer, press på trigger">
      <g>
        <rect x="70" y="70" width="175" height="1360" fill="#cf3a3a" opacity="0.14" />
        <rect x="245" y="70" width="139" height="1360" fill="#cf3a3a" opacity="0.14" />
        <rect x="384" y="70" width="232" height="1360" fill="#cf3a3a" opacity="0.14" />
        <rect x="616" y="70" width="139" height="1360" fill="#ffffff" opacity="0.05" />
        <rect x="755" y="70" width="175" height="1360" fill="#ffffff" opacity="0.05" />
        <line x1="245" y1="70" x2="245" y2="1430" stroke="rgba(245,194,66,0.45)" strokeWidth="3" strokeDasharray="12 12" />
        <line x1="384" y1="70" x2="384" y2="1430" stroke="rgba(245,194,66,0.45)" strokeWidth="3" strokeDasharray="12 12" />
        <line x1="616" y1="70" x2="616" y2="1430" stroke="rgba(245,194,66,0.45)" strokeWidth="3" strokeDasharray="12 12" />
        <line x1="755" y1="70" x2="755" y2="1430" stroke="rgba(245,194,66,0.45)" strokeWidth="3" strokeDasharray="12 12" />
      </g>

      <g fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#f5c242" letterSpacing="4">
        <text x="500" y="110" textAnchor="middle">SKYDDA 3 AV 5 KORRIDORER</text>
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14" fill="rgba(255,255,255,0.4)" letterSpacing="2">
        <text x="157" y="150" textAnchor="middle">YTTRE</text>
        <text x="314" y="150" textAnchor="middle">INRE</text>
        <text x="500" y="150" textAnchor="middle">CENTRAL</text>
        <text x="685" y="150" textAnchor="middle">INRE</text>
        <text x="842" y="150" textAnchor="middle">YTTRE</text>
      </g>

      <PlayerDot x={500} y={220} label="9" variant="opp" />
      <PlayerDot x={210} y={420} label="11" variant="opp" />
      <PlayerDot x={790} y={420} label="7" variant="opp" />
      <PlayerDot x={350} y={620} label="10" variant="opp" />
      <PlayerDot x={650} y={620} label="8" variant="opp" />
      <g>
        <circle cx={140} cy={520} r="42" fill="rgba(207,58,58,0.18)" stroke="#cf3a3a" strokeWidth="4" />
        <PlayerDot x={140} y={520} label="3" variant="opp" />
      </g>
      <circle cx="140" cy="555" r="11" fill="#f5c242" stroke="#fff" strokeWidth="3" />

      <PlayerDot x={500} y={1280} label="1" />
      <PlayerDot x={240} y={1080} label="2" />
      <PlayerDot x={420} y={1080} label="3" />
      <PlayerDot x={580} y={1080} label="4" />
      <PlayerDot x={760} y={1080} label="5" />
      <PlayerDot x={500} y={900} label="6" />
      <PlayerDot x={340} y={780} label="8" />
      <PlayerDot x={680} y={780} label="10" />
      <PlayerDot x={250} y={620} label="11" variant="focus" />
      <PlayerDot x={500} y={520} label="9" />
      <PlayerDot x={780} y={620} label="7" />

      <Arrow id="ar-forsvar-1" step={3} d="M 250 620 Q 200 580 170 540" color="#cf3a3a" width={10} />

      <line x1="340" y1="780" x2="350" y2="620" stroke="rgba(207,58,58,0.45)" strokeWidth="4" strokeDasharray="10 10" />
      <line x1="500" y1="900" x2="500" y2="520" stroke="rgba(207,58,58,0.4)" strokeWidth="3" strokeDasharray="10 10" />
    </PitchSurface>
  );
}

function OvergangAnfallPitch() {
  return (
    <PitchSurface label="Övergång till anfall — diagonal utgång efter bollvinst">
      <circle cx="400" cy="900" r="80" fill="rgba(245,194,66,0.10)" stroke="#f5c242" strokeWidth="4" strokeDasharray="12 8" />
      <text x="400" y="1010" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#f5c242" letterSpacing="4">
        BOLLVINST
      </text>

      <Arrow id="ar-omsta-1" step={2} d="M 400 900 Q 600 700 820 360" color="#3a6fc6" width={12} />
      <Arrow id="ar-omsta-2" step={3} d="M 320 1080 Q 540 880 800 460" color="#3a6fc6" width={8} dashed />

      <rect x="650" y="280" width="280" height="280" fill="#5ec98a" opacity="0.18" stroke="#5ec98a" strokeWidth="3" strokeDasharray="14 10" />
      <text x="790" y="430" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#f5c242" letterSpacing="4">
        ASSISTYTA
      </text>

      <PlayerDot x={400} y={900} label="6" variant="focus" />
      <PlayerDot x={320} y={1080} label="8" />
      <PlayerDot x={680} y={1100} label="10" />
      <PlayerDot x={780} y={460} label="7" />
      <PlayerDot x={250} y={520} label="11" />
      <PlayerDot x={500} y={400} label="9" />

      <PlayerDot x={500} y={780} label="10" variant="opp" />
      <PlayerDot x={620} y={620} label="8" variant="opp" />
      <PlayerDot x={400} y={500} label="6" variant="opp" />
    </PitchSurface>
  );
}

function AnfallsspelPitch() {
  return (
    <PitchSurface label="Anfallsspel — kontringsskydd, spela in, korridor, assistyta, box">
      <rect x="70" y="1100" width="860" height="330" fill="#5ec98a" opacity="0.14" />
      <rect x="70" y="850" width="860" height="250" fill="#5ec98a" opacity="0.12" />
      <rect x="70" y="600" width="860" height="250" fill="#5ec98a" opacity="0.10" />
      <rect x="650" y="280" width="280" height="320" fill="#f5c242" opacity="0.16" stroke="#f5c242" strokeWidth="3" strokeDasharray="14 10" />
      <rect x="250" y="70" width="500" height="220" fill="#f5c242" opacity="0.16" stroke="#f5c242" strokeWidth="3" strokeDasharray="14 10" />

      <g fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="20" letterSpacing="4">
        <text x="90" y="1410" fill="#f5c242">1 · KONTRINGSSKYDD</text>
        <text x="90" y="1160" fill="#f5c242">2 · SPELA IN</text>
        <text x="90" y="900" fill="#f5c242">3 · SPELA UT</text>
        <text x="675" y="270" fill="#f5c242">4 · ASSISTYTA</text>
        <text x="270" y="55" fill="#f5c242">5 · FYLL BOXEN</text>
      </g>

      <Arrow id="ar-anfall-1" step={1} d="M 500 1270 L 500 1170" color="#3a6fc6" width={10} />
      <Arrow id="ar-anfall-2" step={2} d="M 500 1100 L 500 950" color="#3a6fc6" width={10} />
      <Arrow id="ar-anfall-3" step={3} d="M 500 850 Q 620 700 760 540" color="#3a6fc6" width={10} />
      <Arrow id="ar-anfall-4" step={4} d="M 760 380 Q 600 280 500 200" color="#f5c242" width={12} />

      <Arrow id="ar-anfall-r1" step={5} d="M 320 600 Q 380 380 460 240" color="#3a6fc6" width={6} dashed />
      <Arrow id="ar-anfall-r2" step={5} d="M 680 600 Q 620 380 540 240" color="#3a6fc6" width={6} dashed />

      <PlayerDot x={500} y={1390} label="1" />
      <PlayerDot x={500} y={1300} label="3" />
      <PlayerDot x={300} y={1170} label="2" />
      <PlayerDot x={700} y={1170} label="4" />
      <PlayerDot x={870} y={1300} label="5" />
      <PlayerDot x={500} y={950} label="6" />
      <PlayerDot x={320} y={780} label="8" />
      <PlayerDot x={680} y={780} label="10" />
      <PlayerDot x={780} y={460} label="7" variant="focus" />
      <PlayerDot x={500} y={200} label="9" />
      <PlayerDot x={250} y={420} label="11" />
    </PitchSurface>
  );
}

function OvergangForsvarPitch() {
  return (
    <PitchSurface label="Övergång till försvar — återerövring direkt efter bolltapp">
      <circle cx="500" cy="500" r="120" fill="rgba(207,58,58,0.16)" stroke="#cf3a3a" strokeWidth="4" strokeDasharray="14 10" />
      <text x="500" y="370" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#ff7a7a" letterSpacing="4">
        BOLLTAPP
      </text>

      <Arrow id="ar-omsta-d-1" step={1} d="M 720 620 Q 620 560 540 510" color="#cf3a3a" width={10} />
      <Arrow id="ar-omsta-d-2" step={1} d="M 280 620 Q 380 560 460 510" color="#cf3a3a" width={10} />
      <Arrow id="ar-omsta-d-3" step={1} d="M 500 720 L 500 540" color="#cf3a3a" width={10} />

      <Arrow id="ar-omsta-d-4" step={2} d="M 360 420 L 540 380" color="#cf3a3a" width={5} dashed />
      <Arrow id="ar-omsta-d-5" step={2} d="M 640 420 L 460 380" color="#cf3a3a" width={5} dashed />

      <g transform="translate(820 1330)">
        <circle r="78" fill="#0a1f15" stroke="#cf3a3a" strokeWidth="4" />
        <text textAnchor="middle" y="-12" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="48" fill="#fff">5</text>
        <text textAnchor="middle" y="32" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="16" fill="#ff7a7a" letterSpacing="4">SEK</text>
      </g>

      <g>
        <circle cx="500" cy="500" r="38" fill="rgba(207,58,58,0.28)" />
        <PlayerDot x={500} y={500} label="6" variant="opp" />
      </g>
      <PlayerDot x={400} y={420} label="8" variant="opp" />
      <PlayerDot x={600} y={420} label="10" variant="opp" />

      <PlayerDot x={500} y={720} label="6" variant="focus" />
      <PlayerDot x={280} y={620} label="8" />
      <PlayerDot x={720} y={620} label="10" />
      <PlayerDot x={500} y={900} label="3" />
      <PlayerDot x={300} y={1000} label="2" />
      <PlayerDot x={700} y={1000} label="4" />
      <PlayerDot x={500} y={1280} label="1" />
    </PitchSurface>
  );
}

const IDENTITET_CARDS = [
  { title: "Duell", Icon: Swords, color: "#cf3a3a", desc: "Vinn närkampen. Aldrig backa från en boll vi själva sagt är vår." },
  { title: "Andraboll", Icon: Footprints, color: "#f5c242", desc: "Läs duellen innan den händer. Var först på den lösa bollen." },
  { title: "Djupled", Icon: ArrowUpRight, color: "#3a6fc6", desc: "Spring bakom backlinjen. Hota djupet. Öppna ytan framför." },
  { title: "Kroppsspråk", Icon: Crown, color: "#5ec98a", desc: "Bär laget i nästa sekund. Beslut. Energi. Ansvar." },
];

function IdentitetGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {IDENTITET_CARDS.map((c) => {
        const Icon = c.Icon;
        return (
          <div
            key={c.title}
            className="relative overflow-hidden border border-kedja-border bg-kedja-paper/40 p-6"
            style={{ boxShadow: `inset 0 -4px 0 0 ${c.color}` }}
          >
            <div
              className="mb-4 inline-flex h-12 w-12 items-center justify-center border"
              style={{ borderColor: `${c.color}88`, backgroundColor: `${c.color}1c`, color: c.color }}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-kedja-ink">{c.title}</h3>
            <p className="text-sm leading-relaxed text-kedja-ink/75">{c.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

const FASTA_FIELDS: { title: string; Icon: typeof Shield; hint: string }[] = [
  { title: "Hörnor", Icon: CornerDownLeft, hint: "Anfall + försvar" },
  { title: "Frisparkar", Icon: Target, hint: "Inläggsfrisparkar & direkt" },
  { title: "Inkast", Icon: ArrowRight, hint: "Korta & långa zoner" },
  { title: "Straffstrategi", Icon: Box, hint: "Skyttar & ordning" },
  { title: "Returansvar", Icon: Eye, hint: "Vem täcker andrabollen" },
  { title: "Kontringsskydd", Icon: Shield, hint: "Backlinjens position" },
];

function FastaGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FASTA_FIELDS.map((f) => {
        const Icon = f.Icon;
        return (
          <div
            key={f.title}
            className="border border-dashed border-kedja-border bg-white/60 p-5 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
          >
            <div className="mb-3 flex items-center gap-3">
              <Icon className="h-5 w-5 text-emerald-700" strokeWidth={1.8} />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">{f.hint}</p>
            </div>
            <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-kedja-ink">{f.title}</h3>
            <div className="border-t border-dashed border-white/15 pt-3">
              <p className="text-xs italic text-kedja-ink/45">Tomt fält — fyll med uppställning, löpningar, ansvar.</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BlockVisual({ id }: { id: string }) {
  if (id === "forsvarsspel") return <ForsvarPitch />;
  if (id === "overgang-anfall") return <OvergangAnfallPitch />;
  if (id === "anfallsspel") return <AnfallsspelPitch />;
  if (id === "overgang-forsvar") return <OvergangForsvarPitch />;
  if (id === "identitet")
    return (
      <div className="p-5">
        <IdentitetGrid />
      </div>
    );
  if (id === "fasta-situationer")
    return (
      <div className="p-5">
        <FastaGrid />
      </div>
    );
  return null;
}

function TacticalPlan({ id, num }: { id: string; num: string }) {
  const steps = TACTICAL_STEPS[id] ?? [];
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentStep = steps[activeStep] ?? steps[0];

  useEffect(() => {
    if (!isPlaying || steps.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        const next = current + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  const goToStep = (step: number) => {
    setIsPlaying(false);
    setActiveStep(Math.max(0, Math.min(step, steps.length - 1)));
  };

  if (!currentStep) return <BlockVisual id={id} />;

  return (
    <div className="tactical-plan">
      <div className="border-b border-kedja-border bg-kedja-paper/25 px-4 py-4 md:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-ink/45">
              Sekvens {num} · {steps.length} steg
            </p>
            <p className="mt-1 text-sm font-bold text-kedja-ink">{currentStep.cue}</p>
          </div>
          <span className="font-mono text-xs font-black tabular-nums text-kedja-ink/45">
            {String(activeStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, index) => (
            <button
              key={step.label}
              type="button"
              data-testid={`tactical-step-${id}-${index + 1}`}
              aria-label={`Visa steg ${index + 1}: ${step.label}`}
              aria-pressed={activeStep === index}
              onClick={() => goToStep(index)}
              className={`tactical-step-button ${activeStep === index ? "is-active" : ""}`}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.label}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="tactical-visual" data-playing={isPlaying} data-step={activeStep + 1}>
        <BlockVisual id={id} />
      </div>

      <div className="flex flex-col gap-4 border-t border-kedja-border bg-kedja-paper px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
            {currentStep.label}
          </p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-kedja-deep/70">{currentStep.detail}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-label="Föregående steg"
            title="Föregående steg"
            onClick={() => goToStep(activeStep - 1)}
            className="tactical-control"
            disabled={activeStep === 0}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            data-testid={`tactical-play-${id}`}
            aria-label={isPlaying ? "Pausa sekvens" : "Spela sekvens"}
            title={isPlaying ? "Pausa sekvens" : "Spela sekvens"}
            onClick={() => setIsPlaying((playing) => !playing)}
            className="tactical-control tactical-control-primary"
          >
            {isPlaying ? <Pause className="h-4 w-4" strokeWidth={2.2} /> : <Play className="h-4 w-4" strokeWidth={2.2} />}
          </button>
          <button
            type="button"
            aria-label="Nästa steg"
            title="Nästa steg"
            onClick={() => goToStep(activeStep + 1)}
            className="tactical-control"
            disabled={activeStep === steps.length - 1}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Börja om sekvens"
            title="Börja om sekvens"
            onClick={() => goToStep(0)}
            className="tactical-control"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InstructionPanel({ block, num }: { block: MajBlock; num: string }) {
  return (
    <aside className="instruction-panel" aria-labelledby={`instruction-title-${block.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-300/80">Spelarens uppgift</p>
          <h3 id={`instruction-title-${block.id}`} className="mt-3 text-2xl font-black uppercase leading-[0.98] tracking-tight text-white">
            {block.title}
          </h3>
        </div>
        <span className="font-mono text-xs font-black tabular-nums text-white/35">{num}</span>
      </div>
      <p className="mt-7 text-lg font-semibold leading-snug text-white/95">{block.playerInstruction}</p>
      <div className="mt-8 border-t border-white/15 pt-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Tre saker att se</p>
        <ol className="mt-4 space-y-3">
          {block.doList.slice(0, 3).map((item, index) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/78">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center border border-amber-300/60 font-mono text-[10px] font-black text-amber-300">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 border-l-2 border-amber-400 pl-4">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">När vi lyckas</p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-white/88">{block.remember}</p>
      </div>
    </aside>
  );
}

/* =========================================================================
   BLOCK SECTION
   ========================================================================= */

function BlockSection({ block, num }: { block: MajBlock; num: string }) {
  const Icon = BLOCK_ICON[block.id] ?? Shield;
  const eyebrow = BLOCK_EYEBROW[block.id] ?? "";
  const blockMedia = getBlockMedia(block.id);
  const tone: "paper" | "white" = parseInt(num, 10) % 2 === 1 ? "paper" : "white";
  const tacticalSteps = TACTICAL_STEPS[block.id] ?? [];
  return (
    <AccordionItem
      value={block.id}
      id={block.id}
      className={`scroll-mt-24 border-t border-kedja-border ${tone === "paper" ? "bg-kedja-paper" : "bg-white"} data-[state=open]:bg-kedja-mint/20`}
    >
      <AccordionTrigger
        data-testid={`block-trigger-${block.id}`}
        className="container w-full px-4 py-4 hover:no-underline hover:bg-kedja-paper/40 md:py-5 [&[data-state=open]>div>div:last-child>svg]:rotate-180"
      >
        <div className="flex w-full items-center justify-between gap-4 text-left">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <span
              className={[
                "font-mono text-[11px] font-black tabular-nums",
                TONE_TEXT[block.accent],
              ].join(" ")}
            >
              {num}
            </span>
            <div
              className={[
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border",
                TONE_BG[block.accent],
              ].join(" ")}
            >
              <Icon className={["h-4 w-4", TONE_TEXT[block.accent]].join(" ")} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold leading-tight tracking-tight text-kedja-ink md:text-lg">
                {block.title}
              </h2>
              {eyebrow && (
                <p className="mt-0.5 truncate text-xs leading-snug text-kedja-deep/70">
                  {eyebrow}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 text-kedja-deep/70">
            {block.principles.length > 0 && (
              <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] sm:inline">
                {block.principles.length} principer
              </span>
            )}
            <ArrowDown className="h-4 w-4 transition-transform" strokeWidth={2.2} />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="overflow-hidden">
        <div className="container pb-16 pt-2 md:pb-20">
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-kedja-ink/75 md:text-lg">
            {block.kidExplanation}
          </p>

          {LIVE_BLOCK_IDS.has(block.id) ? (
            <div
              data-testid={`flow-strip-${block.id}`}
              className="mb-10 border border-amber-500/40 bg-amber-50 p-5"
            >
              <ol className="grid gap-3 md:grid-cols-4">
                {MODEL_FLOW.map((step, index) => (
                  <li key={step} className="flex items-center gap-2 text-sm font-black text-kedja-ink">
                    <span className="font-mono text-[10px] text-amber-700">{String(index + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-amber-500/25 pt-4 text-sm font-semibold leading-relaxed text-kedja-ink/75">
                Läs matchtillståndet genom {MATCH_STATE_FACTORS.join(" · ")}.
              </p>
            </div>
          ) : null}

          {tacticalSteps.length > 0 && (
            <div className="mb-10 max-w-2xl">
              <KedjaSteps
                tone={tone}
                steps={tacticalSteps.map((step) => ({
                  label: step.label,
                  headline: step.cue,
                  support: step.detail,
                }))}
              />
            </div>
          )}

          {/* Spelarinstruktion + interaktiv planvy */}
          <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.65fr)]">
            <InstructionPanel block={block} num={num} />

            <div className="overflow-hidden border border-kedja-border bg-kedja-paper">
              <div className="flex items-center justify-between border-b border-kedja-border bg-kedja-paper/30 px-4 py-2.5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-ink/55">
                  Taktisk planvy · steg för steg
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kedja-ink/35">
                  Block {num}
                </p>
              </div>
              <TacticalPlan id={block.id} num={num} />
            </div>
          </div>

          {/* Media-placeholder */}
          <div className="mb-8">
            <BlockMediaOverview items={blockMedia} />
            <MediaSlot label={block.mediaTitle} description={block.mediaDescription} />
          </div>

          {/* Do / Don't — title strings MUST match test regex /^gör så här$/i etc */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DoColumn variant="do" title="Gör så här" items={block.doList} />
            <DoColumn variant="dont" title="Gör inte så här" items={block.dontList} />
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <KedjaClimax label="Kom ihåg" text={block.remember} connector={false} />
          </div>

          {/* Triggers — bara för försvarsspel */}
          {block.id === "forsvarsspel" && (
            <div className="mt-10">
              <TriggersBand />
            </div>
          )}

          {/* Principer — nested rullgardiner, en per princip */}
          {block.principles.length > 0 && (
            <div className="mt-10">
              <div className="mb-3 flex items-center gap-3 px-1">
                <Layers className={["h-4 w-4", TONE_TEXT[block.accent]].join(" ")} strokeWidth={2.2} />
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-kedja-deep/70">
                  Principer · {block.principles.length}
                </p>
              </div>
              <Accordion type="multiple" className="overflow-hidden rounded-md border border-kedja-border bg-white">
                {block.principles.map((p) => (
                  <AccordionItem
                    key={p.id}
                    value={`${block.id}-${p.id}`}
                    className="border-b border-kedja-border last:border-b-0"
                  >
                    <AccordionTrigger
                      data-testid={`principle-trigger-${block.id}-${p.id}`}
                      className="px-4 py-3 hover:no-underline hover:bg-kedja-paper/40 md:px-5 md:py-3.5"
                    >
                      <div className="flex w-full items-center gap-3 text-left">
                        <span
                          className={[
                            "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                            TONE_DOT[block.accent],
                          ].join(" ")}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold leading-tight text-kedja-ink">
                            {p.label}
                          </p>
                          <p className="mt-0.5 truncate text-xs leading-snug text-kedja-deep/70">
                            {p.oneLiner}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-kedja-border bg-kedja-paper px-4 pb-5 pt-4 md:px-5">
                      {(() => {
                        const staticItems = MAJ_2026_PRINCIPLE_MEDIA[block.id]?.[p.id] ?? [];
                        return staticItems.length > 0 ? (
                          <div className="mb-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <Film className="h-3.5 w-3.5 text-kedja-ink/55" strokeWidth={2} />
                              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-ink/55">
                                Filmer & bilder · {staticItems.length}
                              </p>
                            </div>
                            <MediaGrid items={staticItems} />
                          </div>
                        ) : null;
                      })()}
                      <div className="mb-5">
                        <PrincipleLearningCard principle={p} />
                      </div>
                      <AdminOnly>
                        <PrincipleMediaSlot
                          blockId={block.id}
                          principleId={p.id}
                          principleLabel={p.label}
                          oneLiner={p.oneLiner}
                          hideHeader
                        />
                      </AdminOnly>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */

function Hero() {
  const navItems = MAJ_2026_NAV_CARDS.map((card) => ({
    num: card.number,
    title: card.label,
    sub: BLOCK_EYEBROW[card.id] ?? "",
    href: `#${card.id}`,
  }));

  return (
    <KedjaHero
      eyebrow={`${MAJ_2026_HERO.eyebrow} · Spelmodell`}
      title={MAJ_2026_HERO.title}
      lead={MAJ_2026_HERO.description}
      instruction="Läs uppifrån och ner, eller hoppa direkt till ditt block."
    >
      <KedjaNav items={navItems} />
    </KedjaHero>
  );
}

/* =========================================================================
   EFFEKTLOGIK — own dark version, includes texts "Resurser", "Aktiviteter", "Mål", "Effekt"
   ========================================================================= */

const EFFEKT_ICONS = {
  Resurser: Wrench,
  Aktiviteter: Activity,
  Mål: Target,
  Effekt: Sparkles,
} as const;

function EffektlogikStrip() {
  return (
    <section id="effektlogik" className="scroll-mt-24 border-b border-kedja-border py-16 md:py-20">
      <div className="container">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Effektlogik</p>
        </div>
        <h2 className="mb-12 max-w-3xl text-3xl font-black uppercase tracking-tight text-kedja-ink md:text-4xl">
          Från vad vi har — till vad vi blir.
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {MAJ_2026_EFFECT_LOGIC.map((block, i) => {
            const Icon = EFFEKT_ICONS[block.label];
            return (
              <div key={block.label} className="contents">
                <div className="border border-kedja-border bg-white p-5">
                  <div className="mb-3 flex items-center gap-2 text-amber-700">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    <h3 className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-amber-700">{block.label}</h3>
                  </div>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-kedja-ink/70">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 bg-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {i < MAJ_2026_EFFECT_LOGIC.length - 1 && (
                  <div className="hidden items-center justify-center md:flex" aria-hidden="true">
                    <ArrowRight className="h-6 w-6 text-amber-700/70" strokeWidth={2.2} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SNABBVERSION — "DETTA SKA DU GÖRA PÅ PLANEN"
   ========================================================================= */

const SNABB_TONES: Tone[] = ["red", "yellow", "blue", "red", "yellow", "green"];

function SpelarenSnabbversion() {
  return (
    <section id="snabbversion" className="scroll-mt-24 border-b border-kedja-border bg-kedja-paper/40 py-16 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <LevelBadge level={1} className="mb-3" />
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Spelarens snabbversion</p>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-kedja-ink md:text-5xl">DETTA SKA DU GÖRA PÅ PLANEN</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-kedja-ink/65">
            Fyra levande skeden. Tre–fyra ord per kommando. Identitet och fasta situationer ligger bredvid, inte som extra skeden.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MAJ_2026_QUICK_ACTIONS.map((qa, i) => {
            const tone = SNABB_TONES[i] ?? "white";
            return (
              <div key={qa.scenario} className="border border-kedja-border bg-kedja-paper p-5 transition-colors hover:border-[#f5c242]/40">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tight text-kedja-ink">{qa.scenario}</h3>
                  <span className={["inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]", TONE_BG[tone], TONE_TEXT[tone]].join(" ")}>
                    <span className={["h-1.5 w-1.5 rounded-full", TONE_DOT[tone]].join(" ")} />
                    Skede
                  </span>
                </div>
                <ul className="space-y-2">
                  {qa.actions.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className={["mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0", TONE_DOT[tone]].join(" ")} />
                      <span className="text-sm leading-relaxed text-kedja-ink/85">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   TRIGGERS BAND — placed between Försvarsspel and Övergång-anfall
   ========================================================================= */

const TRIGGERS = [
  "Backens första touch tvingar bollen utåt",
  "Bakåtspel från motståndaren",
  "Slarvig 1:a-touch",
  "Tappad rättvändhet hos mottagaren",
  "Passning till svagare fot",
];

function TriggersBand() {
  return (
    <section className="border-b border-kedja-border py-8">
      <div className="container">
        <div className="border border-rose-300 bg-rose-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Flame className="h-4 w-4 text-rose-700" strokeWidth={2.2} />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">
              Triggers — pressa när du ser detta
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {TRIGGERS.map((t, i) => (
              <li key={t} className="flex items-start gap-3 text-sm text-kedja-ink/85">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-rose-300 bg-rose-100 font-mono text-[10px] font-black text-rose-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

const BLOCK_IDS = new Set(MAJ_2026_BLOCKS.map((b) => b.id));

function useHashControlledAccordion() {
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    const focusFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || !BLOCK_IDS.has(hash)) return;
      setOpen((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      // Scrolla efter att Radix har öppnat och innehållet renderats.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    };
    focusFromHash();
    window.addEventListener("hashchange", focusFromHash);
    return () => window.removeEventListener("hashchange", focusFromHash);
  }, []);

  return [open, setOpen] as const;
}

const MajSpelmodell = () => {
  const [openBlocks, setOpenBlocks] = useHashControlledAccordion();

  return (
  <div className="relative -mt-px bg-kedja-paper text-kedja-ink">
    <Hero />
    <LevelOverview />
    <ModelIntro />
    {/* Stegrande ordning: nivå 0+1 (Grunden) → nivå 1 (snabbversion) →
        nivå 2 (blocken) → nivå 3 (filmbibliotek + övrigt). */}
    <GrundenSection />
    <VeckansPlanering />
    <EffektlogikStrip />
    <SpelarenSnabbversion />

    {/* Nivå 2 — principerna per fas */}
    <div className="border-t border-kedja-border bg-kedja-paper pt-10">
      <div className="container">
        <LevelBadge level={2} className="mb-3" />
        <h2 className="text-2xl font-black uppercase tracking-tight text-kedja-ink md:text-3xl">
          Blocken — principerna per fas
        </h2>
        <p className="mb-6 mt-2 max-w-2xl text-sm leading-relaxed text-kedja-deep/70">
          Öppna en fas i taget. Varje block fördjupar sin rad från Grunden.
        </p>
      </div>
    </div>
    <Accordion
      type="multiple"
      value={openBlocks}
      onValueChange={setOpenBlocks}
      className="border-t border-kedja-border"
    >
      {MAJ_2026_BLOCKS.map((block, i) => (
        <BlockSection key={block.id} block={block} num={String(i + 1).padStart(2, "0")} />
      ))}
    </Accordion>

    {/* Nivå 3 — fördjupning: filmbibliotek (flyttat ned under blocken) */}
    <div className="border-t border-kedja-border bg-kedja-paper pt-10">
      <div className="container">
        <LevelBadge level={3} className="mb-1" />
      </div>
    </div>
    <FilmLibrary />
    <GlossarySection />

    {/* Övrigt — filmer/bilder utan koppling till specifik princip */}
    {MAJ_2026_OVRIGT_MEDIA.length > 0 && (
      <section id="ovrigt" className="scroll-mt-24 border-t border-kedja-border bg-kedja-paper/30 py-16 md:py-20">
        <div className="container">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
              Övrigt
            </p>
          </div>
          <h2 className="mb-4 max-w-3xl text-2xl font-black uppercase tracking-tight text-kedja-ink md:text-3xl">
            Filmer & bilder utan princip-koppling
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-kedja-deep/70 md:text-base">
            Material som inte hör till ett specifikt block eller en specifik princip — hero-takes, identifierande klipp och referensbilder. Sortera senare vid behov.
          </p>
          <MediaGrid items={MAJ_2026_OVRIGT_MEDIA} columns={3} />
        </div>
      </section>
    )}

    {/* Closing strip */}
    <section className="border-t border-kedja-border bg-kedja-paper/40 py-16">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Slut</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-black uppercase tracking-tight text-kedja-ink md:text-3xl">
              Fyra skeden. Två särdelar. En story.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#forsvarsspel"
              className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-500 px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-kedja-ink transition-colors hover:bg-amber-400"
            >
              <ArrowDown className="h-4 w-4" strokeWidth={2.4} />
              Tillbaka till block 01
            </a>
            <Link
              to="/period/1"
              className="inline-flex items-center gap-2 border border-kedja-border bg-white px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-kedja-ink transition-colors hover:border-[#f5c242] hover:text-amber-600"
            >
              Träna det
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
            <Link
              to="/period/2"
              className="inline-flex items-center gap-2 border border-kedja-border bg-white px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-kedja-ink transition-colors hover:border-[#f5c242] hover:text-amber-600"
            >
              Träna det – Period 2
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default MajSpelmodell;
