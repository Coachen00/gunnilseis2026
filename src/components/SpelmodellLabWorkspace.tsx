import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Copy,
  Eye,
  Filter,
  Gauge,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  Play,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  LAB_PHASES,
  LAB_PRINCIPLES,
  LAB_TONE_CLASSES,
  MATCH_SCENARIOS,
  READINESS_ITEMS,
  SESSION_PRESETS,
  TAG_LABELS,
  type Intensity,
  type LabPhase,
  type LabPrinciple,
  type LabTone,
  type MatchScenario,
  type PrincipleTag,
  type SessionPreset,
} from "@/data/spelmodellLab";
import {
  calculateReadiness,
  filterPrinciples,
  formatCoachPlan,
  generateCoachPlan,
  getPhaseMeta,
  type CoachPlan,
  type GeneratedSessionBlock,
} from "@/lib/spelmodellLab";
import { cn } from "@/lib/utils";

type PhaseFilter = LabPhase | "all";
type IntensityFilter = Intensity | "all";

const DEFAULT_PRESET = SESSION_PRESETS[1];
const DEFAULT_READY = [
  "shared-words",
  "first-action",
  "phase-priority",
  "press-trigger",
  "transition-rule",
];

const INTENSITY_LABELS: Record<IntensityFilter, string> = {
  all: "Alla",
  low: "Låg",
  medium: "Medel",
  high: "Hög",
};

const INTENSITY_DETAIL: Record<Intensity, string> = {
  low: "kontroll",
  medium: "beslut",
  high: "matchtryck",
};

const TAGS = Object.keys(TAG_LABELS) as PrincipleTag[];

export default function SpelmodellLabWorkspace() {
  const [phase, setPhase] = useState<PhaseFilter>("all");
  const [intensity, setIntensity] = useState<IntensityFilter>("all");
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<PrincipleTag[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_PRESET.recommendedPrinciples);
  const [scenarioId, setScenarioId] = useState(DEFAULT_PRESET.recommendedScenario);
  const [minutes, setMinutes] = useState(DEFAULT_PRESET.minutes);
  const [readyIds, setReadyIds] = useState<string[]>(DEFAULT_READY);
  const [copied, setCopied] = useState(false);

  const filteredPrinciples = useMemo(
    () => filterPrinciples({ phase, intensity, tags, query }),
    [phase, intensity, tags, query]
  );
  const selectedPrinciples = useMemo(
    () => LAB_PRINCIPLES.filter((principle) => selectedIds.includes(principle.id)),
    [selectedIds]
  );
  const plan = useMemo(
    () => generateCoachPlan({ selectedPrincipleIds: selectedIds, scenarioId, minuteBudget: minutes }),
    [minutes, scenarioId, selectedIds]
  );
  const readiness = useMemo(() => calculateReadiness(readyIds), [readyIds]);
  const scenario = MATCH_SCENARIOS.find((item) => item.id === scenarioId) ?? MATCH_SCENARIOS[0];

  const clearFilters = () => {
    setPhase("all");
    setIntensity("all");
    setQuery("");
    setTags([]);
  };

  const togglePrinciple = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleTag = (tag: PrincipleTag) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const toggleReady = (id: string) => {
    setReadyIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const applyPreset = (preset: SessionPreset) => {
    setSelectedIds(preset.recommendedPrinciples);
    setScenarioId(preset.recommendedScenario);
    setMinutes(preset.minutes);
    const presetScenario = MATCH_SCENARIOS.find((item) => item.id === preset.recommendedScenario);
    setPhase(presetScenario?.phase ?? "all");
    setIntensity("all");
    setTags([]);
    setQuery("");
  };

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(formatCoachPlan(plan));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container pb-24">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <LabDashboard
            plan={plan}
            readinessScore={readiness.score}
            readinessLabel={readiness.label}
            selectedCount={selectedPrinciples.length}
            minutes={minutes}
          />

          <PresetRail activeScenario={scenarioId} onApply={applyPreset} />

          <section className="rounded-lg border border-border bg-card">
            <header className="border-b border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Principbibliotek
                  </div>
                  <h2 className="text-2xl font-black tracking-normal">Välj vad laget ska bära med sig</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Filtrera principer, markera de viktigaste och låt labbet bygga träningspass och matchspråk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background/40 px-3 text-xs font-black uppercase tracking-wider text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  Rensa
                </button>
              </div>
            </header>

            <div className="space-y-5 border-b border-border p-5">
              <SearchAndFilters
                query={query}
                onQuery={setQuery}
                phase={phase}
                onPhase={setPhase}
                intensity={intensity}
                onIntensity={setIntensity}
                tags={tags}
                onTag={toggleTag}
              />
            </div>

            <PrincipleGrid
              principles={filteredPrinciples}
              selectedIds={selectedIds}
              onToggle={togglePrinciple}
            />
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-20 xl:self-start">
          <ScenarioPanel
            selectedScenario={scenario}
            scenarioId={scenarioId}
            onScenario={setScenarioId}
          />
          <ReadinessPanel
            completedIds={readyIds}
            onToggle={toggleReady}
            score={readiness.score}
            label={readiness.label}
            missing={readiness.missing}
          />
        </aside>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <PlanBuilder
          plan={plan}
          minutes={minutes}
          onMinutes={setMinutes}
          selectedPrinciples={selectedPrinciples}
        />
        <CoachBrief plan={plan} copied={copied} onCopy={copyPlan} />
      </div>
    </div>
  );
}

function LabDashboard({
  plan,
  readinessScore,
  readinessLabel,
  selectedCount,
  minutes,
}: {
  plan: CoachPlan;
  readinessScore: number;
  readinessLabel: string;
  selectedCount: number;
  minutes: number;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Plan"
        value={plan.headline}
        detail={plan.scenario.sideline}
        Icon={Sparkles}
        tone={plan.scenario.tone}
        wide
      />
      <MetricCard
        label="Readiness"
        value={`${readinessScore}%`}
        detail={readinessLabel}
        Icon={Gauge}
        tone={readinessScore >= 76 ? "green" : readinessScore >= 48 ? "gold" : "red"}
      />
      <MetricCard
        label="Principer"
        value={String(selectedCount)}
        detail="valda fokus"
        Icon={ListChecks}
        tone="blue"
      />
      <MetricCard
        label="Tid"
        value={`${minutes} min`}
        detail={`${plan.blocks.length} block`}
        Icon={Timer}
        tone="neutral"
      />
    </section>
  );
}

function MetricCard({
  label,
  value,
  detail,
  Icon,
  tone,
  wide = false,
}: {
  label: string;
  value: string;
  detail: string;
  Icon: LucideIcon;
  tone: LabTone;
  wide?: boolean;
}) {
  const style = LAB_TONE_CLASSES[tone];
  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-4",
        style.softBorder,
        wide && "md:col-span-1"
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <span className={cn("grid h-8 w-8 place-items-center rounded-md", style.bg, style.text)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="min-h-[52px]">
        <p className="text-2xl font-black leading-tight tracking-normal">{value}</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </article>
  );
}

function PresetRail({
  activeScenario,
  onApply,
}: {
  activeScenario: string;
  onApply: (preset: SessionPreset) => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <ClipboardList className="h-4 w-4 text-accent" />
        Snabbstarter
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {SESSION_PRESETS.map((preset) => {
          const active = preset.recommendedScenario === activeScenario;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset)}
              className={cn(
                "rounded-md border p-3 text-left transition hover:-translate-y-0.5",
                active ? "border-accent/45 bg-accent/10" : "border-border bg-background/35 hover:border-accent/30"
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider">{preset.label}</span>
                {active && <Check className="h-3.5 w-3.5 text-accent" />}
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{preset.goal}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SearchAndFilters({
  query,
  onQuery,
  phase,
  onPhase,
  intensity,
  onIntensity,
  tags,
  onTag,
}: {
  query: string;
  onQuery: (value: string) => void;
  phase: PhaseFilter;
  onPhase: (value: PhaseFilter) => void;
  intensity: IntensityFilter;
  onIntensity: (value: IntensityFilter) => void;
  tags: PrincipleTag[];
  onTag: (tag: PrincipleTag) => void;
}) {
  return (
    <>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Sök cue, trigger, metric eller princip"
          className="h-11 w-full rounded-md border border-border bg-background/45 pl-10 pr-3 text-sm font-semibold outline-none transition placeholder:text-muted-foreground focus:border-accent/60"
        />
      </div>

      <Segment title="Skede" Icon={Filter}>
        <SegmentButton active={phase === "all"} onClick={() => onPhase("all")}>
          Alla
        </SegmentButton>
        {LAB_PHASES.map((item) => (
          <SegmentButton key={item.id} active={phase === item.id} onClick={() => onPhase(item.id)}>
            {item.shortLabel}
          </SegmentButton>
        ))}
      </Segment>

      <Segment title="Intensitet" Icon={Gauge}>
        {(Object.keys(INTENSITY_LABELS) as IntensityFilter[]).map((item) => (
          <SegmentButton key={item} active={intensity === item} onClick={() => onIntensity(item)}>
            {INTENSITY_LABELS[item]}
          </SegmentButton>
        ))}
      </Segment>

      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-accent" />
          Taggar
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTag(tag)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-black transition",
                  active
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border bg-background/35 text-muted-foreground hover:border-accent/35 hover:text-foreground"
                )}
              >
                {TAG_LABELS[tag]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Segment({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-md border px-3 text-xs font-black transition",
        active
          ? "border-accent/50 bg-accent text-background"
          : "border-border bg-background/35 text-muted-foreground hover:border-accent/35 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function PrincipleGrid({
  principles,
  selectedIds,
  onToggle,
}: {
  principles: LabPrinciple[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  if (principles.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-semibold text-muted-foreground">Inga principer matchar filtren.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-5 lg:grid-cols-2">
      {principles.map((principle) => (
        <PrincipleCard
          key={principle.id}
          principle={principle}
          selected={selectedIds.includes(principle.id)}
          onToggle={() => onToggle(principle.id)}
        />
      ))}
    </div>
  );
}

function PrincipleCard({
  principle,
  selected,
  onToggle,
}: {
  principle: LabPrinciple;
  selected: boolean;
  onToggle: () => void;
}) {
  const phase = getPhaseMeta(principle.phase);
  const tone = LAB_TONE_CLASSES[phase.tone];
  const Icon = phase.Icon;

  return (
    <article
      className={cn(
        "group rounded-lg border bg-background/35 p-4 transition hover:-translate-y-0.5",
        selected ? [tone.border, tone.bg] : "border-border hover:border-accent/35"
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className={cn("grid h-10 w-10 flex-shrink-0 place-items-center rounded-md", tone.bg, tone.text)}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={cn("font-mono text-[10px] font-black uppercase tracking-[0.18em]", tone.text)}>
                {phase.shortLabel}
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-black uppercase text-muted-foreground">
                {INTENSITY_DETAIL[principle.intensity]}
              </span>
            </div>
            <h3 className="text-lg font-black leading-snug tracking-normal">{principle.title}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "grid h-9 w-9 flex-shrink-0 place-items-center rounded-md border transition",
            selected
              ? "border-accent bg-accent text-background"
              : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground"
          )}
          aria-label={selected ? "Ta bort princip" : "Välj princip"}
        >
          {selected ? <Check className="h-4 w-4" /> : <PlusMark />}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{principle.plain}</p>

      <div className="mt-4 grid gap-3">
        <PrincipleLine label="Trigger" value={principle.trigger} />
        <PrincipleLine label="Cue" value={principle.cue} strong />
        <PrincipleLine label="Mätetal" value={principle.metric} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {principle.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-card/70 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground"
          >
            {TAG_LABELS[tag]}
          </span>
        ))}
      </div>
    </article>
  );
}

function PlusMark() {
  return (
    <span className="relative h-4 w-4" aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
    </span>
  );
}

function PrincipleLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className={cn("text-xs leading-relaxed", strong ? "font-black text-foreground" : "text-muted-foreground")}>
      <span className="font-mono font-black uppercase tracking-wider text-foreground/75">{label}: </span>
      {value}
    </p>
  );
}

function ScenarioPanel({
  selectedScenario,
  scenarioId,
  onScenario,
}: {
  selectedScenario: MatchScenario;
  scenarioId: string;
  onScenario: (id: string) => void;
}) {
  const tone = LAB_TONE_CLASSES[selectedScenario.tone];

  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          <Eye className="h-3.5 w-3.5" />
          Matchdiagnos
        </div>
        <h2 className="text-xl font-black tracking-normal">Vad visar matchbilden?</h2>
      </header>
      <div className="space-y-2 p-3">
        {MATCH_SCENARIOS.map((scenario) => {
          const active = scenario.id === scenarioId;
          const phase = getPhaseMeta(scenario.phase);
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onScenario(scenario.id)}
              className={cn(
                "grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-md border p-3 text-left transition",
                active ? [LAB_TONE_CLASSES[scenario.tone].border, LAB_TONE_CLASSES[scenario.tone].bg] : "border-border bg-background/35 hover:border-accent/30"
              )}
            >
              <span>
                <span className="block text-sm font-black">{scenario.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{phase.shortLabel}</span>
              </span>
              <ChevronRight className={cn("h-4 w-4", active ? LAB_TONE_CLASSES[scenario.tone].text : "text-muted-foreground")} />
            </button>
          );
        })}
      </div>
      <div className={cn("m-3 rounded-md border p-4", tone.border, tone.bg)}>
        <p className="text-sm font-black leading-snug">{selectedScenario.sideline}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selectedScenario.diagnosis}</p>
        <p className="mt-3 text-xs leading-relaxed text-foreground/85">
          <span className="font-mono font-black uppercase tracking-wider text-muted-foreground">Korrigering: </span>
          {selectedScenario.correction}
        </p>
      </div>
    </section>
  );
}

function ReadinessPanel({
  completedIds,
  onToggle,
  score,
  label,
  missing,
}: {
  completedIds: string[];
  onToggle: (id: string) => void;
  score: number;
  label: string;
  missing: string[];
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          <ShieldCheck className="h-3.5 w-3.5" />
          Readiness
        </div>
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-black tracking-normal">{score}%</h2>
          <span className="rounded-md border border-border bg-background/35 px-2 py-1 text-xs font-black uppercase text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-muted">
          <div
            className={cn(
              "h-full rounded",
              score >= 76 ? "bg-zone-attack" : score >= 48 ? "bg-gunnilse-gold" : "bg-gunnilse-red"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </header>
      <div className="space-y-2 p-3">
        {READINESS_ITEMS.map((item) => {
          const checked = completedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                "grid w-full grid-cols-[28px_1fr] gap-3 rounded-md border p-3 text-left transition",
                checked ? "border-zone-attack/35 bg-zone-attack/10" : "border-border bg-background/35 hover:border-accent/30"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-5 w-5 place-items-center rounded border",
                  checked ? "border-zone-attack bg-zone-attack text-background" : "border-border text-transparent"
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-xs font-black leading-snug">{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.detail}</span>
              </span>
            </button>
          );
        })}
      </div>
      {missing.length > 0 && (
        <div className="border-t border-border p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Nästa att säkra</p>
          <ul className="space-y-1">
            {missing.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function PlanBuilder({
  plan,
  minutes,
  onMinutes,
  selectedPrinciples,
}: {
  plan: CoachPlan;
  minutes: number;
  onMinutes: (value: number) => void;
  selectedPrinciples: LabPrinciple[];
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="grid gap-5 border-b border-border p-5 lg:grid-cols-[1fr_280px] lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            <Play className="h-3.5 w-3.5" />
            Passgenerator
          </div>
          <h2 className="text-2xl font-black tracking-normal">Träningspass från matchbilden</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tiden styr hur många block som får plats. Innehållet styrs av valda principer och vald matchdiagnos.
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
            <span>Tidsbudget</span>
            <span>{minutes} min</span>
          </div>
          <input
            type="range"
            min={40}
            max={90}
            step={5}
            value={minutes}
            onChange={(event) => onMinutes(Number(event.target.value))}
            className="w-full accent-accent"
          />
        </div>
      </header>

      <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4">
          {plan.blocks.map((block) => (
            <SessionBlockCard key={block.id} block={block} />
          ))}
        </div>
        <div className="space-y-4">
          <TacticalBoard plan={plan} />
          <SelectedPrinciples principles={selectedPrinciples} plan={plan} />
        </div>
      </div>
    </section>
  );
}

function SessionBlockCard({ block }: { block: GeneratedSessionBlock }) {
  const phase = getPhaseMeta(block.phase);
  const tone = LAB_TONE_CLASSES[phase.tone];
  const Icon = phase.Icon;

  return (
    <article className={cn("rounded-lg border bg-background/35", tone.softBorder)}>
      <div className="grid gap-4 p-4 md:grid-cols-[88px_1fr]">
        <div className={cn("rounded-md border p-3 text-center", tone.border, tone.bg)}>
          <div className={cn("mx-auto mb-2 grid h-8 w-8 place-items-center rounded-md", tone.bg, tone.text)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="font-mono text-lg font-black">{block.minuteStart}-{block.minuteEnd}</div>
          <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">min</div>
        </div>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn("font-mono text-[10px] font-black uppercase tracking-[0.18em]", tone.text)}>
              {phase.shortLabel}
            </span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-black uppercase text-muted-foreground">
              {INTENSITY_DETAIL[block.intensity]}
            </span>
          </div>
          <h3 className="text-lg font-black tracking-normal">{block.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.organisation}</p>
          <p className="mt-3 text-xs leading-relaxed text-foreground/85">
            <span className="font-mono font-black uppercase tracking-wider text-muted-foreground">Varför: </span>
            {block.reason}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MiniInfo label="Poäng" value={block.scoring} Icon={Trophy} />
            <MiniInfo label="Coach" value={block.coaching.join(" / ")} Icon={MessageSquareText} />
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniInfo({ label, value, Icon }: { label: string; value: string; Icon: LucideIcon }) {
  return (
    <div className="grid grid-cols-[24px_1fr] gap-2 rounded-md border border-border bg-card/60 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-accent" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-mono font-black uppercase tracking-wider text-foreground/75">{label}: </span>
        {value}
      </p>
    </div>
  );
}

function TacticalBoard({ plan }: { plan: CoachPlan }) {
  const phase = getPhaseMeta(plan.scenario.phase);
  const tone = LAB_TONE_CLASSES[phase.tone];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background/35">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 text-sm font-black">
          <phase.Icon className={cn("h-4 w-4", tone.text)} />
          Taktisk bild
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{phase.headline}</p>
      </div>
      <div className="relative h-72 overflow-hidden bg-[linear-gradient(180deg,hsl(147_45%_18%),hsl(147_42%_10%))]">
        <PitchLines />
        <ScenarioGraphic scenario={plan.scenario} tone={phase.tone} />
      </div>
      <div className="grid gap-2 p-4">
        {plan.focusWords.slice(0, 4).map((word) => (
          <div key={word} className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2">
            <CheckCircle2 className={cn("h-4 w-4", tone.text)} />
            <span className="text-xs font-black leading-snug">{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PitchLines() {
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

function ScenarioGraphic({ scenario, tone }: { scenario: MatchScenario; tone: LabTone }) {
  if (scenario.id === "pressen-spricker") return <PressGraphic tone={tone} />;
  if (scenario.id === "tom-box") return <BoxGraphic tone={tone} />;
  if (scenario.id === "fast-centralt") return <CentralLockGraphic tone={tone} />;
  if (scenario.id === "tappar-efter-vinst") return <EscapeGraphic tone={tone} />;
  if (scenario.id === "kontringar-emot") return <CounterGraphic tone={tone} />;
  if (scenario.id === "fasta-passiva") return <SetPieceGraphic tone={tone} />;
  return <DuelGraphic tone={tone} />;
}

function BoardDot({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cn("absolute h-4 w-4 rounded-full border-2 border-background bg-gunnilse-gold shadow", className)}
      style={style}
    />
  );
}

function BoardArrow({ className }: { className?: string }) {
  return <ChevronRight className={cn("absolute h-12 w-12 text-gunnilse-gold", className)} strokeWidth={3} />;
}

function BoardTag({ text, tone }: { text: string; tone: LabTone }) {
  const style = LAB_TONE_CLASSES[tone];
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md px-4 py-2 text-xl font-black", style.bg, style.text)}>
      {text}
    </div>
  );
}

function DuelGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      <div className="absolute left-[38%] top-[39%] h-24 w-24 rounded-full border-2 border-gunnilse-gold/70 bg-gunnilse-gold/10" />
      <BoardDot className="left-[42%] top-[49%]" />
      <BoardDot className="left-[56%] top-[49%] bg-gunnilse-red" />
      <BoardDot className="left-[48%] top-[63%] bg-zone-attack" />
      <BoardTag text="ANDRA" tone={tone} />
    </>
  );
}

function PressGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      <div className="absolute bottom-5 left-5 top-5 w-[38%] bg-gunnilse-red/25 ring-1 ring-gunnilse-red/50" />
      <BoardDot className="left-[20%] top-[34%]" />
      <BoardDot className="left-[31%] top-[42%] bg-swedish-blue" />
      <BoardDot className="left-[28%] top-[61%]" />
      <BoardArrow className="left-[33%] top-[39%] rotate-180 text-gunnilse-red" />
      <BoardTag text="LÅS" tone={tone} />
    </>
  );
}

function BoxGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      {[36, 46, 56, 66, 76].map((left, index) => (
        <BoardDot
          key={left}
          className={cn("top-[19%]", index === 4 && "top-[35%] bg-zone-attack")}
          style={{ left: `${left}%` }}
        />
      ))}
      <BoardArrow className="left-[18%] top-[24%] -rotate-45" />
      <BoardTag text="5 YTOR" tone={tone} />
    </>
  );
}

function CentralLockGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      <div className="absolute left-[38%] right-[38%] top-5 bottom-5 bg-gunnilse-red/20 ring-1 ring-gunnilse-red/40" />
      <BoardDot className="left-[46%] top-[60%]" />
      <BoardArrow className="left-[59%] top-[38%] text-zone-attack" />
      <BoardArrow className="left-[29%] top-[38%] rotate-180 text-swedish-blue" />
      <BoardTag text="UT" tone={tone} />
    </>
  );
}

function EscapeGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      <div className="absolute left-[37%] top-[44%] h-20 w-20 rounded-full bg-gunnilse-red/20" />
      <BoardDot className="left-[43%] top-[53%]" />
      <BoardDot className="left-[72%] top-[31%] bg-zone-attack" />
      <BoardArrow className="left-[48%] top-[42%] -rotate-45 text-zone-attack" />
      <BoardTag text="DIAGONAL" tone={tone} />
    </>
  );
}

function CounterGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      <BoardDot className="left-[44%] top-[48%] bg-gunnilse-red" />
      <BoardDot className="left-[52%] top-[38%]" />
      <BoardDot className="left-[58%] top-[58%]" />
      <BoardArrow className="left-[42%] top-[36%] rotate-90 text-gunnilse-red" />
      <BoardTag text="BROMSA" tone={tone} />
    </>
  );
}

function SetPieceGraphic({ tone }: { tone: LabTone }) {
  return (
    <>
      <div className="absolute left-[30%] right-[30%] top-5 h-[22%] border border-white/50 bg-white/5" />
      <BoardDot className="left-[44%] top-[18%]" />
      <BoardDot className="left-[54%] top-[20%] bg-gunnilse-red" />
      <BoardDot className="left-[49%] top-[35%] bg-zone-attack" />
      <BoardTag text="KONTAKT" tone={tone} />
    </>
  );
}

function SelectedPrinciples({ principles, plan }: { principles: LabPrinciple[]; plan: CoachPlan }) {
  const shown = principles.length > 0 ? principles : plan.principles.slice(0, 4);

  return (
    <div className="rounded-lg border border-border bg-background/35 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <ListChecks className="h-4 w-4 text-accent" />
        Valda principer
      </div>
      <div className="space-y-2">
        {shown.map((principle) => {
          const phase = getPhaseMeta(principle.phase);
          return (
            <div key={principle.id} className="rounded-md border border-border bg-card/60 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-black">{principle.title}</span>
                <span className={cn("font-mono text-[10px] font-black uppercase", LAB_TONE_CLASSES[phase.tone].text)}>
                  {phase.shortLabel}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{principle.cue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoachBrief({ plan, copied, onCopy }: { plan: CoachPlan; copied: boolean; onCopy: () => void }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          <MessageSquareText className="h-3.5 w-3.5" />
          Coachbrief
        </div>
        <h2 className="text-2xl font-black tracking-normal">Kopiera till samling eller matchmöte</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Kort språk, tydliga risker och samma ord som i träningspasset.
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-4 text-xs font-black uppercase tracking-wider text-accent transition hover:bg-accent hover:text-background"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopierad" : "Kopiera brief"}
        </button>
      </header>

      <div className="space-y-4 p-5">
        <BriefSection title="Matchbild" items={[plan.scenario.symptom, plan.scenario.correction]} Icon={Eye} />
        <BriefSection title="Fokusord" items={plan.focusWords} Icon={Sparkles} />
        <BriefSection title="Sidlinjeskript" items={plan.sidelineScript.slice(0, 6)} Icon={MessageSquareText} />
        <BriefSection title="Riskflaggor" items={plan.riskFlags} Icon={Gauge} danger />
      </div>
    </section>
  );
}

function BriefSection({
  title,
  items,
  Icon,
  danger = false,
}: {
  title: string;
  items: string[];
  Icon: LucideIcon;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/35 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <Icon className={cn("h-4 w-4", danger ? "text-gunnilse-red" : "text-accent")} />
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="grid grid-cols-[18px_1fr] gap-2">
            <CheckCircle2 className={cn("mt-0.5 h-3.5 w-3.5", danger ? "text-gunnilse-red" : "text-zone-attack")} />
            <p className="text-xs leading-relaxed text-muted-foreground">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
