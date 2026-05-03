import {
  LAB_PHASES,
  LAB_PRINCIPLES,
  MATCH_SCENARIOS,
  READINESS_ITEMS,
  TRAINING_BLOCKS,
  type Intensity,
  type LabPhase,
  type LabPrinciple,
  type MatchScenario,
  type PrincipleTag,
  type TrainingBlock,
} from "@/data/spelmodellLab";

export type LabFilters = {
  phase: LabPhase | "all";
  intensity: Intensity | "all";
  tags: PrincipleTag[];
  query: string;
};

export type GeneratedSessionBlock = TrainingBlock & {
  reason: string;
  minuteStart: number;
  minuteEnd: number;
};

export type CoachPlan = {
  headline: string;
  minuteBudget: number;
  focusWords: string[];
  principles: LabPrinciple[];
  scenario: MatchScenario;
  blocks: GeneratedSessionBlock[];
  sidelineScript: string[];
  riskFlags: string[];
  phaseBalance: Record<LabPhase, number>;
};

export type ReadinessResult = {
  score: number;
  completedWeight: number;
  totalWeight: number;
  missing: string[];
  label: "Röd" | "Gul" | "Grön";
};

const PHASE_IDS = LAB_PHASES.map((phase) => phase.id);

export function getPhaseMeta(phase: LabPhase) {
  return LAB_PHASES.find((item) => item.id === phase) ?? LAB_PHASES[0];
}

export function getPrincipleById(id: string) {
  return LAB_PRINCIPLES.find((principle) => principle.id === id);
}

export function getScenarioById(id: string) {
  return MATCH_SCENARIOS.find((scenario) => scenario.id === id) ?? MATCH_SCENARIOS[0];
}

export function filterPrinciples(filters: LabFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return LAB_PRINCIPLES.filter((principle) => {
    const matchesPhase = filters.phase === "all" || principle.phase === filters.phase;
    const matchesIntensity = filters.intensity === "all" || principle.intensity === filters.intensity;
    const matchesTags =
      filters.tags.length === 0 || filters.tags.every((tag) => principle.tags.includes(tag));
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [principle.title, principle.plain, principle.trigger, principle.cue, principle.metric]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesPhase && matchesIntensity && matchesTags && matchesQuery;
  });
}

export function calculateReadiness(completedIds: string[]): ReadinessResult {
  const completed = new Set(completedIds);
  const totalWeight = READINESS_ITEMS.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = READINESS_ITEMS.reduce(
    (sum, item) => sum + (completed.has(item.id) ? item.weight : 0),
    0
  );
  const score = Math.round((completedWeight / totalWeight) * 100);
  const missing = READINESS_ITEMS.filter((item) => !completed.has(item.id))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((item) => item.label);

  return {
    score,
    completedWeight,
    totalWeight,
    missing,
    label: score >= 76 ? "Grön" : score >= 48 ? "Gul" : "Röd",
  };
}

export function getPhaseBalance(principles: LabPrinciple[]) {
  return PHASE_IDS.reduce<Record<LabPhase, number>>((balance, phase) => {
    balance[phase] = principles.filter((principle) => principle.phase === phase).length;
    return balance;
  }, {} as Record<LabPhase, number>);
}

export function generateCoachPlan({
  selectedPrincipleIds,
  scenarioId,
  minuteBudget,
}: {
  selectedPrincipleIds: string[];
  scenarioId: string;
  minuteBudget: number;
}): CoachPlan {
  const selected = selectedPrincipleIds
    .map(getPrincipleById)
    .filter((principle): principle is LabPrinciple => Boolean(principle));
  const scenario = getScenarioById(scenarioId);
  const scenarioPrinciples = LAB_PRINCIPLES.filter(
    (principle) =>
      principle.phase === scenario.phase ||
      principle.tags.some((tag) => scenario.tags.includes(tag))
  ).slice(0, 3);
  const principles = dedupeById([...selected, ...scenarioPrinciples]).slice(0, 7);
  const blocks = chooseTrainingBlocks(principles, scenario, minuteBudget);
  const focusWords = dedupeStrings([
    scenario.sideline,
    ...principles.map((principle) => principle.cue),
  ]).slice(0, 5);
  const phaseMeta = getPhaseMeta(scenario.phase);

  return {
    headline: `${phaseMeta.shortLabel}: ${scenario.label}`,
    minuteBudget,
    focusWords,
    principles,
    scenario,
    blocks,
    sidelineScript: buildSidelineScript(principles, scenario),
    riskFlags: buildRiskFlags(principles, scenario),
    phaseBalance: getPhaseBalance(principles),
  };
}

export function formatCoachPlan(plan: CoachPlan) {
  const blockLines = plan.blocks.map(
    (block) =>
      `${block.minuteStart}-${block.minuteEnd} min: ${block.title} | ${block.coaching.join(", ")}`
  );
  const principleLines = plan.principles.map(
    (principle) => `- ${principle.title}: ${principle.cue} (${principle.metric})`
  );

  return [
    `Spelmodell-labb: ${plan.headline}`,
    `Tidsbudget: ${plan.minuteBudget} minuter`,
    `Matchbild: ${plan.scenario.symptom}`,
    `Korrigering: ${plan.scenario.correction}`,
    "",
    "Fokusord:",
    ...plan.focusWords.map((word) => `- ${word}`),
    "",
    "Principer:",
    ...principleLines,
    "",
    "Träningsblock:",
    ...blockLines,
    "",
    "Sidlinjeskript:",
    ...plan.sidelineScript.map((line) => `- ${line}`),
    "",
    "Riskflaggor:",
    ...plan.riskFlags.map((risk) => `- ${risk}`),
  ].join("\n");
}

function chooseTrainingBlocks(
  principles: LabPrinciple[],
  scenario: MatchScenario,
  minuteBudget: number
): GeneratedSessionBlock[] {
  const principleTags = new Set(principles.flatMap((principle) => principle.tags));
  const scenarioBlockIds = new Set(scenario.trainingBlockIds);
  const ranked = TRAINING_BLOCKS.map((block) => {
    const tagScore = block.tags.filter((tag) => principleTags.has(tag)).length * 3;
    const scenarioScore = scenarioBlockIds.has(block.id) ? 8 : 0;
    const phaseScore = block.phase === scenario.phase ? 4 : 0;
    const intensityScore = principles.some((principle) => principle.intensity === block.intensity) ? 1 : 0;
    return { block, score: tagScore + scenarioScore + phaseScore + intensityScore };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.block.minutes - a.block.minutes);

  const chosen: TrainingBlock[] = [];
  let usedMinutes = 0;
  const maxTrainingMinutes = Math.max(24, minuteBudget - 14);

  for (const { block } of ranked) {
    if (chosen.some((item) => item.id === block.id)) continue;
    if (usedMinutes + block.minutes > maxTrainingMinutes && chosen.length >= 2) continue;
    chosen.push(block);
    usedMinutes += block.minutes;
    if (chosen.length >= 4 || usedMinutes >= maxTrainingMinutes) break;
  }

  if (chosen.length < 2) {
    for (const fallback of TRAINING_BLOCKS) {
      if (!chosen.some((item) => item.id === fallback.id)) {
        chosen.push(fallback);
        usedMinutes += fallback.minutes;
      }
      if (chosen.length >= 2) break;
    }
  }

  let cursor = 0;
  return chosen.map((block) => {
    const start = cursor;
    cursor += block.minutes;
    return {
      ...block,
      minuteStart: start,
      minuteEnd: cursor,
      reason: buildBlockReason(block, scenario, principleTags),
    };
  });
}

function buildBlockReason(block: TrainingBlock, scenario: MatchScenario, principleTags: Set<PrincipleTag>) {
  if (scenario.trainingBlockIds.includes(block.id)) {
    return `Direkt kopplad till matchbilden: ${scenario.label}.`;
  }
  const sharedTags = block.tags.filter((tag) => principleTags.has(tag));
  if (sharedTags.length > 0) {
    return `Tränar valda principer: ${sharedTags.join(", ")}.`;
  }
  return "Ger balans i passet.";
}

function buildSidelineScript(principles: LabPrinciple[], scenario: MatchScenario) {
  return dedupeStrings([
    scenario.sideline,
    scenario.correction,
    ...principles.map((principle) => principle.cue),
    ...principles.slice(0, 3).map((principle) => principle.correction),
  ]).slice(0, 8);
}

function buildRiskFlags(principles: LabPrinciple[], scenario: MatchScenario) {
  return dedupeStrings([
    scenario.diagnosis,
    ...principles.map((principle) => principle.danger),
  ]).slice(0, 5);
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function dedupeStrings(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
