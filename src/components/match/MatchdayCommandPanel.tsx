import { useMemo, useState, type CSSProperties } from "react";
import {
  AlarmClock,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  Gauge,
  Lock,
  Map,
  Megaphone,
  RotateCcw,
  ShieldAlert,
  Swords,
  Target,
  TimerReset,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { COHERENCE, FOCUS, MATCH_META } from "@/data/matchplan";
import { cn } from "@/lib/utils";

type Tone = "gold" | "blue" | "red" | "green";
type PhaseKey = "identity" | "defense" | "attack" | "transition";

type MatchMinute = {
  time: string;
  label: string;
  intent: string;
  cue: string;
  tone: Tone;
};

type PhaseCue = {
  id: PhaseKey;
  label: string;
  headline: string;
  definition: string;
  Icon: LucideIcon;
  tone: Tone;
  bullets: string[];
  board: "duel" | "lock" | "flow" | "diagonal";
};

type Decision = {
  title: string;
  when: string;
  action: string;
  danger: string;
  Icon: LucideIcon;
  tone: Tone;
};

type SidelineWord = {
  word: string;
  meaning: string;
  phase: PhaseKey;
};

const TONE: Record<Tone, { text: string; bg: string; border: string; solid: string; dot: string }> = {
  gold: {
    text: "text-gunnilse-gold",
    bg: "bg-gunnilse-gold/10",
    border: "border-gunnilse-gold/35",
    solid: "bg-gunnilse-gold",
    dot: "bg-gunnilse-gold",
  },
  blue: {
    text: "text-swedish-blue",
    bg: "bg-swedish-blue/10",
    border: "border-swedish-blue/35",
    solid: "bg-swedish-blue",
    dot: "bg-swedish-blue",
  },
  red: {
    text: "text-gunnilse-red",
    bg: "bg-gunnilse-red/10",
    border: "border-gunnilse-red/35",
    solid: "bg-gunnilse-red",
    dot: "bg-gunnilse-red",
  },
  green: {
    text: "text-zone-attack",
    bg: "bg-zone-attack/10",
    border: "border-zone-attack/35",
    solid: "bg-zone-attack",
    dot: "bg-zone-attack",
  },
};

const TIMELINE: MatchMinute[] = [
  {
    time: "11.45",
    label: "Genomgång",
    intent: "Sätt tre ord: dueller, samla, djupled.",
    cue: "Ingen mer information än spelarna kan bära.",
    tone: "gold",
  },
  {
    time: "12.15",
    label: "Uppvärmning",
    intent: "Aktivera kamp, andraboll och första sprint.",
    cue: "Tempo upp utan att stressa upp gruppen.",
    tone: "green",
  },
  {
    time: "12.45",
    label: "Sista block",
    intent: "Påminn om pressfällan på deras vänster.",
    cue: "Samla först. Sedan låser vi.",
    tone: "blue",
  },
  {
    time: "13.00",
    label: "Matchstart",
    intent: "Första tio: vinn kropp, andraboll, territorium.",
    cue: "Starten ska kännas fysisk direkt.",
    tone: "red",
  },
];

const PHASE_CUES: PhaseCue[] = [
  {
    id: "identity",
    label: "Identitet",
    headline: "Kampen avgör tonen",
    definition: "Duellerna måste upp, andrabollarna ska ägas och djupled måste starta även utan boll.",
    Icon: Swords,
    tone: "gold",
    board: "duel",
    bullets: ["Vinn eller oavgjort.", "Först på nästa boll.", "Minst en i djupet."],
  },
  {
    id: "defense",
    label: "Försvar",
    headline: "Samla före press",
    definition: "Pressen startar först när laget är kort, linjerna höga och vi kan låsa bollsidan.",
    Icon: ShieldAlert,
    tone: "blue",
    board: "lock",
    bullets: ["Styr deras vänster.", "YB på YB.", "Stoppa spelvändning."],
  },
  {
    id: "attack",
    label: "Anfall",
    headline: "In-ut-fram-box",
    definition: "Flytta blocket, hitta rättvänd spelare och fyll fem ytor när bollen går in.",
    Icon: Target,
    tone: "green",
    board: "flow",
    bullets: ["In i spelyta 1/2.", "Ut för isolering.", "Box med fem ytor."],
  },
  {
    id: "transition",
    label: "Omställning",
    headline: "Ut ur gröten",
    definition: "Vid bollvinst ska första passningen bort från het yta och därefter djupled direkt.",
    Icon: Zap,
    tone: "red",
    board: "diagonal",
    bullets: ["Nära = direkt återerövring.", "Utdragna = samla.", "Vinst = diagonal ut."],
  },
];

const DECISIONS: Decision[] = [
  {
    title: "Tryck nu",
    when: "Felvänd bollhållare på kant.",
    action: "Närmaste pressar, nästa stänger inåt, tredje tar andraboll.",
    danger: "Om bortre sida är öppen: avbryt.",
    Icon: Flame,
    tone: "red",
  },
  {
    title: "Samla",
    when: "Vi är långa mellan lagdelarna.",
    action: "Centrera, korta laget, styr ut igen.",
    danger: "Ensam press öppnar mitten.",
    Icon: Lock,
    tone: "blue",
  },
  {
    title: "Ta territorium",
    when: "Anfallet låser sig centralt.",
    action: "Spela mot djupt inkast och vinn nästa boll högt.",
    danger: "Central chansning ger kontring.",
    Icon: Map,
    tone: "gold",
  },
  {
    title: "Diagonal ut",
    when: "Bollvinst i trång yta.",
    action: "Första pass bort från press, löpning bakom direkt.",
    danger: "Pass tillbaka in i gröten.",
    Icon: RotateCcw,
    tone: "green",
  },
];

const SIDELINE_WORDS: SidelineWord[] = [
  { word: "Samla", meaning: "Korta laget innan press.", phase: "defense" },
  { word: "Lås", meaning: "Håll bollen på bollsidan.", phase: "defense" },
  { word: "Andra", meaning: "Läs nästa boll, inte bara första.", phase: "identity" },
  { word: "Djup", meaning: "Spring bakom även utan boll.", phase: "attack" },
  { word: "Diagonal", meaning: "Spela bort från het yta.", phase: "transition" },
];

export default function MatchdayCommandPanel() {
  const [active, setActive] = useState<PhaseKey>("defense");
  const current = PHASE_CUES.find((cue) => cue.id === active) ?? PHASE_CUES[0];
  const compactPlan = useMemo(() => COHERENCE.map((section) => section.title).join(" · "), []);

  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="grid gap-5 border-b border-border p-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Matchdagskommando
          </div>
          <h2 className="text-2xl font-black tracking-tight">Coachpanel för {MATCH_META.opponent}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Ett sidlinjestöd med tider, triggers och korta ord. Byggt för att hålla matchplanen enkel när pulsen går upp.
          </p>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-right">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent">Fokus</div>
          <div className="mt-1 text-sm font-black">{FOCUS[0]}</div>
        </div>
      </header>

      <div className="grid gap-5 p-5 xl:grid-cols-[330px_minmax(0,1fr)]">
        <Timeline />
        <div className="space-y-5">
          <PhaseSelector active={active} onChange={setActive} />
          <ActivePhase cue={current} compactPlan={compactPlan} />
        </div>
      </div>

      <div className="grid gap-5 border-t border-border p-5 xl:grid-cols-[minmax(0,1.3fr)_360px]">
        <DecisionGrid />
        <SidelineLanguage active={active} onSelect={setActive} />
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <div className="rounded-lg border border-border bg-background/35 p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-black">
        <AlarmClock className="h-4 w-4 text-accent" />
        Matchklocka
      </div>
      <div className="space-y-3">
        {TIMELINE.map((item) => {
          const tone = TONE[item.tone];
          return (
            <div key={item.time} className={cn("rounded-lg border p-3", tone.border, tone.bg)}>
              <div className="flex items-center justify-between gap-3">
                <span className={cn("font-mono text-sm font-black", tone.text)}>{item.time}</span>
                <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug">{item.intent}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.cue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhaseSelector({ active, onChange }: { active: PhaseKey; onChange: (phase: PhaseKey) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {PHASE_CUES.map((cue) => {
        const tone = TONE[cue.tone];
        const Icon = cue.Icon;
        const selected = active === cue.id;
        return (
          <button
            key={cue.id}
            type="button"
            onClick={() => onChange(cue.id)}
            className={cn(
              "rounded-lg border p-3 text-left transition hover:-translate-y-0.5",
              selected ? [tone.border, tone.bg] : "border-border bg-background/35 hover:border-accent/40"
            )}
          >
            <Icon className={cn("mb-2 h-4 w-4", selected ? tone.text : "text-muted-foreground")} />
            <div className="text-xs font-black uppercase tracking-wider">{cue.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function ActivePhase({ cue, compactPlan }: { cue: PhaseCue; compactPlan: string }) {
  const tone = TONE[cue.tone];
  const Icon = cue.Icon;

  return (
    <article className={cn("grid overflow-hidden rounded-lg border bg-background/35 lg:grid-cols-[1fr_340px]", tone.border)}>
      <div className="p-5">
        <div className={cn("mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider", tone.bg, tone.text)}>
          <Icon className="h-3.5 w-3.5" />
          {cue.label}
        </div>
        <h3 className="text-2xl font-black tracking-tight">{cue.headline}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{cue.definition}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-3">
          {cue.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 rounded-md border border-border bg-card/60 p-3 text-sm font-semibold">
              <CheckCircle2 className={cn("mt-0.5 h-4 w-4 flex-shrink-0", tone.text)} />
              {bullet}
            </li>
          ))}
        </ul>
        <p className="mt-5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          Planstruktur: {compactPlan}
        </p>
      </div>
      <CommandBoard mode={cue.board} tone={cue.tone} />
    </article>
  );
}

function DecisionGrid() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <Gauge className="h-4 w-4 text-accent" />
        Beslut under match
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {DECISIONS.map((decision) => (
          <DecisionCard key={decision.title} decision={decision} />
        ))}
      </div>
    </div>
  );
}

function DecisionCard({ decision }: { decision: Decision }) {
  const tone = TONE[decision.tone];
  const Icon = decision.Icon;

  return (
    <article className={cn("rounded-lg border bg-background/35 p-4", tone.border)}>
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("grid h-8 w-8 place-items-center rounded-md", tone.bg, tone.text)}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-black uppercase tracking-wide">{decision.title}</h3>
      </div>
      <KeyValue label="När" value={decision.when} />
      <KeyValue label="Gör" value={decision.action} />
      <KeyValue label="Risk" value={decision.danger} danger />
    </article>
  );
}

function KeyValue({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <p className={cn("mt-2 text-xs leading-relaxed", danger ? "text-gunnilse-red/90" : "text-muted-foreground")}>
      <span className="font-mono font-black uppercase tracking-wider text-foreground/80">{label}: </span>
      {value}
    </p>
  );
}

function SidelineLanguage({ active, onSelect }: { active: PhaseKey; onSelect: (phase: PhaseKey) => void }) {
  return (
    <aside className="rounded-lg border border-border bg-background/35 p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-black">
        <Megaphone className="h-4 w-4 text-accent" />
        Sidlinjespråk
      </div>
      <div className="space-y-2">
        {SIDELINE_WORDS.map((item) => {
          const selected = active === item.phase;
          return (
            <button
              key={item.word}
              type="button"
              onClick={() => onSelect(item.phase)}
              className={cn(
                "grid w-full grid-cols-[90px_1fr] gap-3 rounded-md border p-3 text-left transition",
                selected ? "border-accent/40 bg-accent/10" : "border-border bg-card/60 hover:border-accent/30"
              )}
            >
              <span className="font-black uppercase tracking-wide text-foreground">{item.word}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">{item.meaning}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-md border border-gunnilse-gold/30 bg-gunnilse-gold/10 p-3 text-xs leading-relaxed text-muted-foreground">
        Håll språket kort. Ett ord ska ändra beteende direkt.
      </div>
    </aside>
  );
}

function CommandBoard({ mode, tone }: { mode: PhaseCue["board"]; tone: Tone }) {
  return (
    <div className="relative min-h-[280px] overflow-hidden border-t border-border bg-[linear-gradient(180deg,hsl(147_45%_18%),hsl(147_42%_10%))] lg:border-l lg:border-t-0">
      <Pitch />
      <BoardMode mode={mode} tone={tone} />
    </div>
  );
}

function Pitch() {
  return (
    <div className="absolute inset-5 rounded border border-white/35">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="absolute left-[25%] right-[25%] top-0 h-[22%] border border-t-0 border-white/25" />
      <div className="absolute bottom-0 left-[25%] right-[25%] h-[22%] border border-b-0 border-white/25" />
      {[33, 66].map((left) => (
        <div key={left} className="absolute bottom-0 top-0 w-px bg-white/10" style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}

function BoardMode({ mode, tone }: { mode: PhaseCue["board"]; tone: Tone }) {
  if (mode === "duel") return <DuelBoard tone={tone} />;
  if (mode === "lock") return <LockBoard tone={tone} />;
  if (mode === "flow") return <FlowBoard tone={tone} />;
  return <DiagonalBoard tone={tone} />;
}

function BoardDot({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span className={cn("absolute h-4 w-4 rounded-full border-2 border-background bg-gunnilse-gold shadow", className)} style={style} />;
}

function BoardArrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("absolute h-12 w-12 text-gunnilse-gold", className)} strokeWidth={3} />;
}

function BoardTag({ text, tone }: { text: string; tone: Tone }) {
  const style = TONE[tone];
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-4 py-2 text-xl font-black", style.bg, style.text)}>
      {text}
    </div>
  );
}

function DuelBoard({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute left-[42%] top-[39%] h-24 w-24 rounded-full border-2 border-gunnilse-red/70 bg-gunnilse-red/10" />
      <BoardDot className="left-[43%] top-[48%]" />
      <BoardDot className="left-[57%] top-[48%] bg-gunnilse-red" />
      <BoardArrow className="left-[31%] top-[44%]" />
      <BoardTag text="VINN" tone={tone} />
    </>
  );
}

function LockBoard({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute bottom-5 left-5 top-5 w-[38%] bg-gunnilse-red/25 ring-1 ring-gunnilse-red/50" />
      <BoardDot className="left-[20%] top-[34%]" />
      <BoardDot className="left-[32%] top-[42%] bg-swedish-blue" />
      <BoardDot className="left-[28%] top-[60%]" />
      <BoardArrow className="left-[34%] top-[39%] rotate-180 text-gunnilse-red" />
      <BoardTag text="LÅS" tone={tone} />
    </>
  );
}

function FlowBoard({ tone }: { tone: Tone }) {
  return (
    <>
      <BoardDot className="left-[40%] top-[70%]" />
      <BoardDot className="left-[55%] top-[55%]" />
      <BoardDot className="left-[68%] top-[32%]" />
      <BoardArrow className="left-[39%] top-[58%] -rotate-45" />
      <BoardArrow className="left-[54%] top-[44%] -rotate-45 text-zone-attack" />
      <BoardArrow className="left-[63%] top-[24%] -rotate-90 text-swedish-blue" />
      <BoardTag text="BOX" tone={tone} />
    </>
  );
}

function DiagonalBoard({ tone }: { tone: Tone }) {
  return (
    <>
      <div className="absolute left-[36%] top-[44%] h-20 w-20 rounded-full bg-gunnilse-red/20" />
      <BoardDot className="left-[43%] top-[52%]" />
      <BoardDot className="left-[72%] top-[30%] bg-zone-attack" />
      <BoardArrow className="left-[47%] top-[43%] -rotate-45 text-zone-attack" />
      <BoardArrow className="left-[66%] top-[23%] -rotate-90 text-swedish-blue" />
      <BoardTag text="DIAGONAL" tone={tone} />
    </>
  );
}
