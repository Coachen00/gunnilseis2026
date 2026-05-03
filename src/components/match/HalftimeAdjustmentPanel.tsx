import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Gauge,
  Goal,
  ListChecks,
  Lock,
  MessageSquareText,
  MoveDiagonal,
  RotateCcw,
  SearchCheck,
  Shield,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProblemKey = "duels" | "switches" | "depth" | "box" | "transition";
type Tone = "gold" | "red" | "blue" | "green";

type Adjustment = {
  id: ProblemKey;
  label: string;
  symptom: string;
  question: string;
  correction: string;
  sideline: string;
  halftime: string;
  Icon: LucideIcon;
  tone: Tone;
};

const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  gold: { text: "text-gunnilse-gold", bg: "bg-gunnilse-gold/10", border: "border-gunnilse-gold/35", dot: "bg-gunnilse-gold" },
  red: { text: "text-gunnilse-red", bg: "bg-gunnilse-red/10", border: "border-gunnilse-red/35", dot: "bg-gunnilse-red" },
  blue: { text: "text-swedish-blue", bg: "bg-swedish-blue/10", border: "border-swedish-blue/35", dot: "bg-swedish-blue" },
  green: { text: "text-zone-attack", bg: "bg-zone-attack/10", border: "border-zone-attack/35", dot: "bg-zone-attack" },
};

const ADJUSTMENTS: Adjustment[] = [
  {
    id: "duels",
    label: "Dueller/andra",
    symptom: "Vi förlorar första kontakt och blir sena på nästa boll.",
    question: "Är vi passiva, fel positionerade eller för långt ifrån duellen?",
    correction: "Flytta närmaste spelare 3-5 meter närmare duellen. Nästa spelare tar landningsytan.",
    sideline: "Vinn kropp. Läs andra.",
    halftime: "Vi behöver inte fler instruktioner. Vi behöver vinna första kontakt och nästa boll.",
    Icon: Swords,
    tone: "gold",
  },
  {
    id: "switches",
    label: "Spelvändningar",
    symptom: "De spelar ur vår press och hittar bortre sida.",
    question: "Pressar vi innan vi är samlade eller lämnar vi bortre korridor öppen?",
    correction: "Sänk första pressen ett steg. Lås inåt först, pressa sedan utåt.",
    sideline: "Samla. Lås. Bortre in.",
    halftime: "Vi jagar inte snabbare. Vi jagar smartare: först kompakt, sedan press.",
    Icon: Lock,
    tone: "blue",
  },
  {
    id: "depth",
    label: "Djupled",
    symptom: "Bollhållaren får bara fötter-alternativ och spelet stannar.",
    question: "Finns minst en löpning bakom när rättvänd spelare får bollen?",
    correction: "Ytter/9:a startar tidigare. 10:a fyller ytan bakom första löpningen.",
    sideline: "En bakom. Starta nu.",
    halftime: "Ni behöver inte alltid få bollen. Löpningen skapar ytan.",
    Icon: MoveDiagonal,
    tone: "green",
  },
  {
    id: "box",
    label: "Boxfyllnad",
    symptom: "Vi kommer runt men har för få spelare i målområdet.",
    question: "Fyller vi första, straffpunkt, bortre, cutback och andraboll?",
    correction: "Lås roller: 9:a första/central, bortre ytter bortre, 10:a cutback, 6/8 andraboll.",
    sideline: "Fyll fem.",
    halftime: "Kanten är inte målet. Boxen är målet.",
    Icon: Goal,
    tone: "green",
  },
  {
    id: "transition",
    label: "Omställning",
    symptom: "Vi vinner bollen men spelar tillbaka in i pressen.",
    question: "Går första passningen bort från het yta?",
    correction: "Första blick diagonalt ut. Om inte möjligt: säkra bakåt och samla laget.",
    sideline: "Ut ur gröten.",
    halftime: "Efter bollvinst: första beslutet ska ge oss luft.",
    Icon: RotateCcw,
    tone: "red",
  },
];

const CHECKS = [
  "Har vi vunnit duellerna?",
  "Har vi hindrat spelvändning?",
  "Har vi sprungit bakom?",
  "Har vi fyllt boxen?",
  "Har första pass efter bollvinst gått ut ur press?",
];

export default function HalftimeAdjustmentPanel() {
  const [activeId, setActiveId] = useState<ProblemKey>("switches");
  const [copied, setCopied] = useState(false);
  const active = ADJUSTMENTS.find((item) => item.id === activeId) ?? ADJUSTMENTS[0];
  const script = useMemo(() => buildHalftimeScript(active), [active]);

  async function copyScript() {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="grid gap-5 border-b border-border p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            <Gauge className="h-3.5 w-3.5" />
            Halvtidskorrigering
          </div>
          <h2 className="text-2xl font-black tracking-tight">5 problem, 5 snabba svar</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Välj vad matchbilden visar. Få en kort fråga, en korrigering och exakt språk till spelarna.
          </p>
        </div>
        <button
          type="button"
          onClick={copyScript}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-4 text-xs font-black uppercase tracking-wider text-accent transition hover:bg-accent hover:text-background"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopierad" : "Kopiera pausprat"}
        </button>
      </header>

      <div className="grid gap-5 p-5 xl:grid-cols-[310px_minmax(0,1fr)]">
        <ProblemList activeId={activeId} onSelect={setActiveId} />
        <AdjustmentCard adjustment={active} />
      </div>

      <div className="grid gap-5 border-t border-border p-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Checklist />
        <HalftimeScript adjustment={active} />
      </div>
    </section>
  );
}

function ProblemList({ activeId, onSelect }: { activeId: ProblemKey; onSelect: (id: ProblemKey) => void }) {
  return (
    <div className="rounded-lg border border-border bg-background/35 p-3">
      <div className="mb-3 flex items-center gap-2 px-1 text-sm font-black">
        <SearchCheck className="h-4 w-4 text-accent" />
        Matchbild
      </div>
      <div className="space-y-2">
        {ADJUSTMENTS.map((item) => {
          const tone = TONE[item.tone];
          const Icon = item.Icon;
          const selected = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "grid w-full grid-cols-[34px_1fr] gap-3 rounded-md border p-3 text-left transition",
                selected ? [tone.border, tone.bg] : "border-border bg-card/50 hover:border-accent/30"
              )}
            >
              <span className={cn("grid h-8 w-8 place-items-center rounded-md", selected ? [tone.bg, tone.text] : "bg-muted text-muted-foreground")}>
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-black uppercase tracking-wider">{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.symptom}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdjustmentCard({ adjustment }: { adjustment: Adjustment }) {
  const tone = TONE[adjustment.tone];
  const Icon = adjustment.Icon;

  return (
    <article className={cn("grid overflow-hidden rounded-lg border bg-background/35 lg:grid-cols-[1fr_320px]", tone.border)}>
      <div className="p-5">
        <div className={cn("mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider", tone.bg, tone.text)}>
          <Icon className="h-3.5 w-3.5" />
          {adjustment.label}
        </div>
        <h3 className="text-2xl font-black tracking-tight">{adjustment.sideline}</h3>
        <div className="mt-5 grid gap-3">
          <InfoBlock label="Fråga först" value={adjustment.question} Icon={MessageSquareText} />
          <InfoBlock label="Korrigering" value={adjustment.correction} Icon={ListChecks} />
          <InfoBlock label="Säg i paus" value={adjustment.halftime} Icon={Shield} strong />
        </div>
      </div>
      <MiniPitch mode={adjustment.id} tone={adjustment.tone} />
    </article>
  );
}

function InfoBlock({
  label,
  value,
  Icon,
  strong = false,
}: {
  label: string;
  value: string;
  Icon: LucideIcon;
  strong?: boolean;
}) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-3 rounded-md border border-border bg-card/60 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-accent" />
      <p className={cn("text-sm leading-relaxed", strong ? "font-semibold text-foreground" : "text-muted-foreground")}>
        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}: </span>
        {value}
      </p>
    </div>
  );
}

function Checklist() {
  return (
    <div className="rounded-lg border border-border bg-background/35 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <ListChecks className="h-4 w-4 text-accent" />
        Pausens fem kontroller
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {CHECKS.map((check, index) => (
          <div key={check} className="flex items-start gap-3 rounded-md border border-border bg-card/60 p-3">
            <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded bg-accent/10 font-mono text-[10px] font-black text-accent">
              {index + 1}
            </span>
            <p className="text-sm font-semibold leading-snug">{check}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HalftimeScript({ adjustment }: { adjustment: Adjustment }) {
  return (
    <aside className="rounded-lg border border-gunnilse-gold/30 bg-gunnilse-gold/10 p-4">
      <div className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-gunnilse-gold">
        Pausprat
      </div>
      <p className="text-sm font-black leading-snug">{adjustment.sideline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{adjustment.halftime}</p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Avsluta med en konkret första aktion efter avspark.
      </p>
    </aside>
  );
}

function MiniPitch({ mode, tone }: { mode: ProblemKey; tone: Tone }) {
  return (
    <div className="relative min-h-[260px] overflow-hidden border-t border-border bg-[linear-gradient(180deg,hsl(147_45%_18%),hsl(147_42%_10%))] lg:border-l lg:border-t-0">
      <PitchLines />
      <PitchGraphic mode={mode} tone={tone} />
    </div>
  );
}

function PitchLines() {
  return (
    <div className="absolute inset-5 rounded border border-white/35">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="absolute left-[25%] right-[25%] top-0 h-[22%] border border-t-0 border-white/25" />
      <div className="absolute bottom-0 left-[25%] right-[25%] h-[22%] border border-b-0 border-white/25" />
    </div>
  );
}

function PitchGraphic({ mode, tone }: { mode: ProblemKey; tone: Tone }) {
  if (mode === "duels") return <DuelGraphic tone={tone} />;
  if (mode === "switches") return <SwitchGraphic tone={tone} />;
  if (mode === "depth") return <DepthGraphic tone={tone} />;
  if (mode === "box") return <BoxGraphic tone={tone} />;
  return <TransitionGraphic tone={tone} />;
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("absolute h-4 w-4 rounded-full border-2 border-background bg-gunnilse-gold shadow", className)} />;
}

function Arrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("absolute h-12 w-12 text-gunnilse-gold", className)} strokeWidth={3} />;
}

function Tag({ text, tone }: { text: string; tone: Tone }) {
  const style = TONE[tone];
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-4 py-2 text-xl font-black", style.bg, style.text)}>
      {text}
    </div>
  );
}

function DuelGraphic({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute left-[42%] top-[42%] h-20 w-20 rounded-full border-2 border-gunnilse-gold/70 bg-gunnilse-gold/10" />
      <Dot className="left-[43%] top-[49%]" />
      <Dot className="left-[56%] top-[49%] bg-gunnilse-red" />
      <Tag text="ANDRA" tone={tone} />
    </>
  );
}

function SwitchGraphic({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute bottom-5 left-5 top-5 w-[38%] bg-gunnilse-red/25 ring-1 ring-gunnilse-red/50" />
      <Arrow className="left-[31%] top-[38%] rotate-180 text-gunnilse-red" />
      <Arrow className="right-[22%] top-[38%] rotate-180 opacity-30" />
      <Tag text="LÅS" tone={tone} />
    </>
  );
}

function DepthGraphic({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute left-10 right-10 top-[32%] h-px bg-white/60" />
      <Dot className="left-[44%] top-[62%]" />
      <Arrow className="left-[58%] top-[33%] -rotate-90 text-zone-attack" />
      <Tag text="BAKOM" tone={tone} />
    </>
  );
}

function BoxGraphic({ tone }: { tone: Tone }) {
  return (
    <>
      {[36, 46, 56, 66, 76].map((left, index) => (
        <Dot key={left} className={cn("top-[19%]", index === 4 && "top-[35%] bg-zone-attack")} style={{ left: `${left}%` }} />
      ))}
      <Tag text="5" tone={tone} />
    </>
  );
}

function TransitionGraphic({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute left-[37%] top-[44%] h-20 w-20 rounded-full bg-gunnilse-red/20" />
      <Dot className="left-[43%] top-[54%]" />
      <Arrow className="left-[49%] top-[43%] -rotate-45 text-zone-attack" />
      <Tag text="UT" tone={tone} />
    </>
  );
}

function buildHalftimeScript(adjustment: Adjustment) {
  return [
    `Pausfokus: ${adjustment.label}`,
    `Matchbild: ${adjustment.symptom}`,
    `Fråga: ${adjustment.question}`,
    `Korrigering: ${adjustment.correction}`,
    `Säg: ${adjustment.halftime}`,
    `Sidlinjeord: ${adjustment.sideline}`,
  ].join("\n");
}
