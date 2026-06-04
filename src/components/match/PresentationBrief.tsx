import { type CSSProperties, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Image,
  Layers3,
  MoveRight,
  Palette,
  Route,
  ScanLine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FOCUS, MATCH_META } from "@/data/matchplan";
import { cn } from "@/lib/utils";

type VisualKind =
  | "hero"
  | "identity"
  | "duel"
  | "second"
  | "depth"
  | "compact"
  | "corridors"
  | "trap"
  | "flow"
  | "zones"
  | "box"
  | "throw"
  | "formation"
  | "transition";

type Accent = "gold" | "blue" | "red" | "green";

type SlideSpec = {
  no: string;
  title: string;
  words: string;
  visual: string;
  imagePrompt: string;
  kind: VisualKind;
  accent: Accent;
};

const ACCENTS: Record<Accent, { text: string; border: string; bg: string; solid: string }> = {
  gold: { text: "text-gunnilse-gold", border: "border-gunnilse-gold/35", bg: "bg-gunnilse-gold/10", solid: "bg-gunnilse-gold" },
  blue: { text: "text-swedish-blue", border: "border-swedish-blue/35", bg: "bg-swedish-blue/10", solid: "bg-swedish-blue" },
  red: { text: "text-gunnilse-red", border: "border-gunnilse-red/35", bg: "bg-gunnilse-red/10", solid: "bg-gunnilse-red" },
  green: { text: "text-zone-attack", border: "border-zone-attack/35", bg: "bg-zone-attack/10", solid: "bg-zone-attack" },
};

const RULES = [
  { Icon: ScanLine, label: "3 sek", text: "En slide ska förstås direkt." },
  { Icon: Palette, label: "3 färger", text: "Gul boll, blå löpning, röd press." },
  { Icon: Image, label: "Plan först", text: "Bild ska bära taktiken." },
  { Icon: Layers3, label: "Få ord", text: "Max 3-8 ord per slide." },
];

const SLIDES: SlideSpec[] = [
  ["01", "Veckans match", `${MATCH_META.opponent} · ${MATCH_META.kickoff.split(" · ")[1] ?? ""}`, "Full-bleed mörk matchplan/tunnel med gul titel.", "Cinematic dark football matchday tunnel, yellow club light, serious dressing-room mood.", "hero", "gold"],
  ["02", "Identitet", "Dueller · Andrabollar · Djupled", "Tre hårda block med ikon/silhuett.", "Three-panel tactical board: duel collision, loose ball zone, deep run behind back line.", "identity", "gold"],
  ["03", "Duellspel", "Upp flera nivåer", "Närkamp i centrum, röd riskmarkering.", "Top-down football duel graphic, two player markers colliding, red warning halo.", "duel", "red"],
  ["04", "Andrabollar", "Först på nästa boll", "Landningsyta ringas in, tre egna attackerar.", "Loose second ball, yellow landing circle, three player markers collapsing toward ball.", "second", "green"],
  ["05", "Djupled", "Spring bakom", "Backlinje, blå löpning bakom, gul passning.", "Defensive line, one deep run arrow behind line, yellow pass arrow.", "depth", "blue"],
  ["06", "Samla", "Samla först. Pressa sen.", "Lagdelar trycks ihop, avstånd minskar.", "Compact football block, three horizontal team lines squeezed together.", "compact", "blue"],
  ["07", "Pressvillkor", "Höga linjer · kompakt · tre korridorer", "Plan med tre korridorer och pressbild.", "Pitch split into three vertical corridors, high line, compact distances.", "corridors", "gold"],
  ["08", "Pressfälla", "Lås deras vänster", "Röd zon vänster, YB på YB, stoppad spelvändning.", "Press trap on opponent left side, red lock zone, blocked switch arrow.", "trap", "red"],
  ["09", "Anfall · 5 principer", "Skydda · In · Ut · Framåt · Box", "Sekventiell bollväg med fem nummerband.", "Attack sequence five steps: cover, in, out, forward, box, yellow ball arrows and blue runs.", "flow", "gold"],
  ["10", "Spelytor", "Rättvänd i spelyta 2", "Horisontella band, spelyta 2 starkast.", "Horizontal playing zones, zone 2 highlighted bright yellow, right-facing marker.", "zones", "gold"],
  ["11", "Box", "Fyll fem ytor", "Första, straffpunkt, bortre, cutback, andraboll.", "Penalty box map with five highlighted attacking zones.", "box", "green"],
  ["12", "Låst spel", "Ta territorium", "Pil mot djupt inkast, röd återerövring.", "Ball forced to deep throw-in near corner, immediate high regain press.", "throw", "red"],
  ["13", "Formation", "4-2-1-3", "Helplan: 4 backar, 2 balans, 1 länk, 3 hot.", "Clean 4-2-1-3 football formation top-down, yellow player markers.", "formation", "blue"],
  ["14", "Omställning", "Ut ur gröten", "Bollvinst, diagonal utgång, djupled direkt.", "Central ball regain, diagonal escape pass, deep run and box attack.", "transition", "green"],
].map(([no, title, words, visual, imagePrompt, kind, accent]) => ({
  no,
  title,
  words,
  visual,
  imagePrompt,
  kind,
  accent,
})) as SlideSpec[];

const buildPrompt = () =>
  [
    "Skapa en 16:9 matchpresentation för Gunnilse.",
    "Stil: mörk fotbollsplan, gul/vit text, blå löpningar, röd press.",
    "Regel: max 3-8 ord per slide. En idé per slide. Ingen brödtext.",
    `Fokus: ${FOCUS.join(" / ")}`,
    "",
    ...SLIDES.map((s) => `${s.no}. ${s.title.toUpperCase()} | Text: "${s.words}" | Bild: ${s.visual} | Bildprompt: ${s.imagePrompt}`),
  ].join("\n");

export default function PresentationBrief() {
  const [copied, setCopied] = useState(false);
  const prompt = useMemo(buildPrompt, []);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="grid gap-6 border-b border-border p-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent-ink">
            <Sparkles className="h-3.5 w-3.5" />
            Presentationsbrief
          </div>
          <h2 className="text-3xl md:text-4xl leading-tight">10-15 slides på matchspråk</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Teknisk brief för en stark, bilddriven presentation från veckans matchplan.
          </p>
        </div>
        <button
          type="button"
          onClick={copyPrompt}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-4 text-xs font-black uppercase tracking-wider text-accent transition hover:bg-accent hover:text-background"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopierad" : "Kopiera brief"}
        </button>
      </div>

      <div className="grid gap-3 border-b border-border p-5 md:grid-cols-4">
        {RULES.map((rule) => (
          <DesignRule key={rule.label} {...rule} />
        ))}
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
        {SLIDES.map((slide) => (
          <SlideCard key={slide.no} slide={slide} />
        ))}
      </div>
    </section>
  );
}

function DesignRule({ Icon, label, text }: { Icon: LucideIcon; label: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/25 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
        <Icon className="h-4 w-4 text-accent-ink" />
        {label}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function SlideCard({ slide }: { slide: SlideSpec }) {
  const tone = ACCENTS[slide.accent];

  return (
    <article className={cn("overflow-hidden rounded-lg border bg-background/35", tone.border)}>
      <MiniBoard kind={slide.kind} accent={slide.accent} />
      <div className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span className={cn("rounded px-2 py-1 font-mono text-[10px] font-black", tone.bg, tone.text)}>
            {slide.no}
          </span>
          <div className="min-w-0">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-foreground">{slide.title}</h3>
            <p className="mt-1.5 text-lg font-bold tracking-tight text-foreground">{slide.words}</p>
          </div>
        </div>
        <InfoLine Icon={Image} label="Bild" text={slide.visual} />
        <InfoLine Icon={Route} label="Prompt" text={slide.imagePrompt} muted />
      </div>
    </article>
  );
}

function InfoLine({
  Icon,
  label,
  text,
  muted = false,
}: {
  Icon: LucideIcon;
  label: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <div className="grid grid-cols-[18px_1fr] gap-2 text-xs leading-relaxed">
      <Icon className={cn("mt-0.5 h-3.5 w-3.5", muted ? "text-muted-foreground" : "text-accent-ink")} />
      <p className={muted ? "text-muted-foreground" : "text-foreground/85"}>
        <span className="font-mono font-black uppercase tracking-wider text-muted-foreground">{label}: </span>
        {text}
      </p>
    </div>
  );
}

function MiniBoard({ kind, accent }: { kind: VisualKind; accent: Accent }) {
  const tone = ACCENTS[accent];

  return (
    <div className="relative h-36 overflow-hidden border-b border-border bg-[linear-gradient(180deg,hsl(147_45%_18%),hsl(147_42%_11%))]">
      <PitchLines />
      <BoardLayer kind={kind} tone={tone} />
    </div>
  );
}

function PitchLines() {
  return (
    <div className="absolute inset-3 rounded border border-white/35">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="absolute left-[28%] right-[28%] top-0 h-[20%] border border-t-0 border-white/25" />
      <div className="absolute bottom-0 left-[28%] right-[28%] h-[20%] border border-b-0 border-white/25" />
    </div>
  );
}

function BoardLayer({ kind, tone }: { kind: VisualKind; tone: (typeof ACCENTS)[Accent] }) {
  if (kind === "hero") return <Tag text="MATCH" tone={tone} />;
  if (kind === "identity") return <Blocks labels={["DUELL", "2:A", "DJUP"]} tone={tone} />;
  if (kind === "corridors") return <Corridors tone={tone} />;
  if (kind === "formation") return <Formation tone={tone} />;
  if (kind === "zones") return <Zones tone={tone} />;
  if (kind === "box") return <Box tone={tone} />;

  const variants: Record<Exclude<VisualKind, "hero" | "identity" | "corridors" | "formation" | "zones" | "box">, React.ReactNode> = {
    duel: <Duel tone={tone} />,
    second: <Second tone={tone} />,
    depth: <Depth tone={tone} />,
    compact: <Compact tone={tone} />,
    trap: <Trap tone={tone} />,
    flow: <Flow tone={tone} />,
    throw: <ThrowIn tone={tone} />,
    transition: <Transition tone={tone} />,
  };

  return variants[kind];
}

function Dot({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span className={cn("absolute h-3.5 w-3.5 rounded-full border border-background bg-gunnilse-gold shadow", className)} style={style} />;
}

function Arrow({ className }: { className?: string }) {
  return <MoveRight className={cn("absolute h-9 w-9 text-gunnilse-gold", className)} strokeWidth={3} />;
}

function Tag({ text, tone }: { text: string; tone: (typeof ACCENTS)[Accent] }) {
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-3 py-2 text-lg font-black", tone.bg, tone.text)}>
      {text}
    </div>
  );
}

function Blocks({ labels, tone }: { labels: string[]; tone: (typeof ACCENTS)[Accent] }) {
  return (
    <div className="absolute inset-x-5 top-1/2 grid -translate-y-1/2 grid-cols-3 gap-2">
      {labels.map((label) => (
        <div key={label} className={cn("rounded border px-2 py-4 text-center text-xs font-black", tone.border, tone.bg, tone.text)}>
          {label}
        </div>
      ))}
    </div>
  );
}

function Duel({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gunnilse-red/80 bg-gunnilse-red/10" />
      <Dot className="left-[42%] top-[46%]" />
      <Dot className="left-[54%] top-[46%] bg-gunnilse-red" />
      <Tag text="1v1" tone={tone} />
    </>
  );
}

function Second({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <div className={cn("absolute left-[42%] top-[38%] h-16 w-16 rounded-full border-2", tone.border, tone.bg)} />
      <Dot className="left-[46%] top-[43%]" />
      <Dot className="left-[34%] top-[53%]" />
      <Dot className="left-[58%] top-[55%]" />
      <Arrow className="left-[34%] top-[38%] rotate-[-20deg]" />
    </>
  );
}

function Depth({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <div className="absolute left-8 right-8 top-11 h-px bg-white/60" />
      <Arrow className="left-[56%] top-[22%] -rotate-90 text-swedish-blue" />
      <Arrow className="left-[34%] top-[54%] -rotate-45" />
      <Dot className="left-[36%] top-[61%]" />
      <Tag text="DJUP" tone={tone} />
    </>
  );
}

function Compact({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      {[36, 50, 64].map((top) => <div key={top} className="absolute left-[22%] right-[22%] h-px bg-swedish-blue" style={{ top: `${top}%` }} />)}
      <Tag text="KORT" tone={tone} />
    </>
  );
}

function Corridors({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      {[33, 66].map((left) => <div key={left} className="absolute bottom-3 top-3 w-px bg-white/25" style={{ left: `${left}%` }} />)}
      <Blocks labels={["V", "M", "H"]} tone={tone} />
    </>
  );
}

function Trap({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <div className="absolute bottom-3 left-3 top-3 w-[34%] bg-gunnilse-red/25 ring-1 ring-gunnilse-red/50" />
      <Dot className="left-[18%] top-[42%]" />
      <Dot className="left-[30%] top-[42%] bg-gunnilse-red" />
      <Arrow className="left-[31%] top-[39%] rotate-180 text-gunnilse-red" />
      <Tag text="LÅS" tone={tone} />
    </>
  );
}

function Flow({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <Arrow className="left-[36%] top-[58%] -rotate-90" />
      <Arrow className="left-[46%] top-[42%]" />
      <Arrow className="left-[58%] top-[30%] -rotate-90" />
      <Tag text="IN UT FRAM" tone={tone} />
    </>
  );
}

function Zones({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      {[18, 34, 50, 66].map((top, i) => <div key={top} className={cn("absolute left-3 right-3 h-px", i === 2 ? "bg-gunnilse-gold" : "bg-white/20")} style={{ top: `${top}%` }} />)}
      <Tag text="YTA 2" tone={tone} />
    </>
  );
}

function Box({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      {[38, 48, 58, 68, 78].map((left, i) => <Dot key={left} className={cn("top-[18%]", i === 4 && "top-[34%] bg-zone-attack")} style={{ left: `${left}%` }} />)}
      <Tag text="5 YTOR" tone={tone} />
    </>
  );
}

function ThrowIn({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <div className="absolute right-3 top-4 h-16 w-16 rounded-full border-2 border-gunnilse-red/70 bg-gunnilse-red/15" />
      <Arrow className="right-16 top-16 rotate-[-25deg]" />
      <Tag text="HÖGT" tone={tone} />
    </>
  );
}

function Formation({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      {[22, 38, 62, 78].map((left) => <Dot key={`b-${left}`} className="top-[68%]" style={{ left: `${left}%` }} />)}
      {[42, 58].map((left) => <Dot key={`m-${left}`} className="top-[50%]" style={{ left: `${left}%` }} />)}
      <Dot className="left-[49%] top-[37%]" />
      {[25, 49, 73].map((left) => <Dot key={`f-${left}`} className="top-[20%]" style={{ left: `${left}%` }} />)}
      <Tag text="4-2-1-3" tone={tone} />
    </>
  );
}

function Transition({ tone }: { tone: (typeof ACCENTS)[Accent] }) {
  return (
    <>
      <div className="absolute left-[36%] top-[42%] h-14 w-14 rounded-full bg-gunnilse-red/20" />
      <Arrow className="left-[44%] top-[36%] -rotate-45 text-zone-attack" />
      <Arrow className="left-[60%] top-[24%] -rotate-90 text-swedish-blue" />
      <Tag text="DIAGONAL" tone={tone} />
    </>
  );
}
