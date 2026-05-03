import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Copy,
  Eye,
  ListChecks,
  MessageSquareText,
  Timer,
} from "lucide-react";
import {
  LAB_PHASES,
  LAB_PRINCIPLES,
  LAB_TONE_CLASSES,
  MATCH_SCENARIOS,
  SESSION_PRESETS,
  TAG_LABELS,
  type LabPrinciple,
  type MatchScenario,
  type SessionPreset,
} from "@/data/spelmodellLab";
import { formatCoachPlan, generateCoachPlan, getPhaseMeta, type CoachPlan } from "@/lib/spelmodellLab";
import { cn } from "@/lib/utils";

const defaultPreset = SESSION_PRESETS[1];

export default function SpelmodellLabWorkspace() {
  const [presetId, setPresetId] = useState(defaultPreset.id);
  const [scenarioId, setScenarioId] = useState(defaultPreset.recommendedScenario);
  const [minutes, setMinutes] = useState(defaultPreset.minutes);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultPreset.recommendedPrinciples);
  const [copied, setCopied] = useState(false);

  const selectedPrinciples = useMemo(
    () => LAB_PRINCIPLES.filter((principle) => selectedIds.includes(principle.id)),
    [selectedIds]
  );

  const plan = useMemo(
    () => generateCoachPlan({ selectedPrincipleIds: selectedIds, scenarioId, minuteBudget: minutes }),
    [minutes, scenarioId, selectedIds]
  );

  const applyPreset = (preset: SessionPreset) => {
    setPresetId(preset.id);
    setScenarioId(preset.recommendedScenario);
    setMinutes(preset.minutes);
    setSelectedIds(preset.recommendedPrinciples);
  };

  const togglePrinciple = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const copyPlan = async () => {
    await navigator.clipboard.writeText(formatCoachPlan(plan));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="container pb-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-8">
          <PresetBar activeId={presetId} onApply={applyPreset} />
          <section className="grid gap-8 xl:grid-cols-2">
            <FocusPanel selectedIds={selectedIds} onToggle={togglePrinciple} />
            <ScenarioPanel scenarioId={scenarioId} onSelect={setScenarioId} />
          </section>
          <SessionPlan plan={plan} minutes={minutes} onMinutes={setMinutes} />
        </main>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <CoachBrief plan={plan} copied={copied} onCopy={copyPlan} selectedPrinciples={selectedPrinciples} />
        </aside>
      </div>
    </div>
  );
}

function PresetBar({ activeId, onApply }: { activeId: string; onApply: (preset: SessionPreset) => void }) {
  return (
    <section className="border-y border-border py-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <ClipboardList className="h-4 w-4 text-accent" />
        Välj startläge
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SESSION_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset)}
            className={cn(
              "h-10 flex-shrink-0 rounded-md border px-3 text-sm font-bold transition",
              activeId === preset.id
                ? "border-accent bg-accent text-background"
                : "border-border bg-card/45 text-muted-foreground hover:text-foreground"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function FocusPanel({ selectedIds, onToggle }: { selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <section>
      <SectionTitle icon={<ListChecks className="h-4 w-4 text-accent" />} label="Fokus" title="Välj få principer." />
      <div className="mt-4 divide-y divide-border border-y border-border">
        {LAB_PHASES.map((phase) => {
          const principles = LAB_PRINCIPLES.filter((principle) => principle.phase === phase.id).slice(0, 4);
          const tone = LAB_TONE_CLASSES[phase.tone];
          return (
            <div key={phase.id} className="py-5">
              <div className="mb-3 flex items-center gap-2">
                <phase.Icon className={cn("h-4 w-4", tone.text)} />
                <h3 className="text-sm font-black uppercase tracking-wide">{phase.shortLabel}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {principles.map((principle) => {
                  const active = selectedIds.includes(principle.id);
                  return (
                    <button
                      key={principle.id}
                      type="button"
                      onClick={() => onToggle(principle.id)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-left text-xs font-bold transition",
                        active
                          ? [tone.border, tone.bg, "text-foreground"]
                          : "border-border bg-card/45 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {principle.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScenarioPanel({ scenarioId, onSelect }: { scenarioId: string; onSelect: (id: string) => void }) {
  return (
    <section>
      <SectionTitle icon={<Eye className="h-4 w-4 text-accent" />} label="Matchbild" title="Välj problemet som syns." />
      <div className="mt-4 divide-y divide-border border-y border-border">
        {MATCH_SCENARIOS.map((scenario) => (
          <ScenarioRow
            key={scenario.id}
            scenario={scenario}
            active={scenario.id === scenarioId}
            onSelect={() => onSelect(scenario.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ScenarioRow({ scenario, active, onSelect }: { scenario: MatchScenario; active: boolean; onSelect: () => void }) {
  const phase = getPhaseMeta(scenario.phase);
  const tone = LAB_TONE_CLASSES[scenario.tone];

  return (
    <button type="button" onClick={onSelect} className="grid w-full gap-3 py-4 text-left md:grid-cols-[1fr_28px]">
      <span>
        <span className={cn("font-mono text-[10px] font-black uppercase tracking-[0.18em]", tone.text)}>
          {phase.shortLabel}
        </span>
        <span className="mt-1 block text-sm font-black text-foreground">{scenario.label}</span>
        {active && <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{scenario.correction}</span>}
      </span>
      <span
        className={cn(
          "mt-1 grid h-6 w-6 place-items-center rounded-md border",
          active ? [tone.border, tone.bg, tone.text] : "border-border text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

function SessionPlan({
  plan,
  minutes,
  onMinutes,
}: {
  plan: CoachPlan;
  minutes: number;
  onMinutes: (minutes: number) => void;
}) {
  return (
    <section>
      <div className="grid gap-5 border-y border-border py-5 md:grid-cols-[1fr_260px] md:items-end">
        <SectionTitle icon={<Timer className="h-4 w-4 text-accent" />} label="Pass" title="Ett enkelt upplägg." />
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-muted-foreground">
            <span>Tid</span>
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
      </div>

      <ol className="divide-y divide-border border-b border-border">
        {plan.blocks.map((block) => {
          const phase = getPhaseMeta(block.phase);
          const tone = LAB_TONE_CLASSES[phase.tone];
          return (
            <li key={block.id} className="grid gap-4 py-5 md:grid-cols-[96px_1fr]">
              <div>
                <p className="font-mono text-lg font-black text-foreground">
                  {block.minuteStart}-{block.minuteEnd}
                </p>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">min</p>
              </div>
              <div>
                <p className={cn("mb-1 font-mono text-[10px] font-black uppercase tracking-[0.18em]", tone.text)}>
                  {phase.shortLabel}
                </p>
                <h3 className="text-lg font-black tracking-normal text-foreground">{block.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{block.organisation}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/85">{block.coaching.join(" / ")}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CoachBrief({
  plan,
  copied,
  onCopy,
  selectedPrinciples,
}: {
  plan: CoachPlan;
  copied: boolean;
  onCopy: () => void;
  selectedPrinciples: LabPrinciple[];
}) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent">
        <MessageSquareText className="h-3.5 w-3.5" />
        Coachbrief
      </div>
      <h2 className="text-2xl font-black leading-tight tracking-normal">{plan.headline}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.scenario.sideline}</p>

      <div className="mt-6 space-y-5">
        <BriefBlock title="Säg" items={plan.focusWords.slice(0, 4)} />
        <BriefBlock title="Se upp med" items={plan.riskFlags.slice(0, 3)} />
        <BriefBlock title="Valda principer" items={selectedPrinciples.slice(0, 5).map((principle) => principle.title)} />
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-xs font-black uppercase tracking-wider text-background transition hover:bg-accent/90"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Kopierad" : "Kopiera"}
      </button>
    </section>
  );
}

function BriefBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-foreground/88">
            <ArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-accent" />
            <span>{labelOrRaw(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionTitle({ icon, label, title }: { icon: ReactNode; label: string; title: string }) {
  return (
    <header>
      <p className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent">
        {icon}
        {label}
      </p>
      <h2 className="text-2xl font-black leading-tight tracking-normal">{title}</h2>
    </header>
  );
}

function labelOrRaw(value: string) {
  return TAG_LABELS[value as keyof typeof TAG_LABELS] ?? value;
}
