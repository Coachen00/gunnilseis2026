import { useReducedMotion } from "framer-motion";
import PitchZonesAnimation from "@/components/zones/PitchZonesAnimation";
import { ZONE_TOOLTIPS, ZONE_LABELS } from "@/components/zones/zonesConfig";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";

/** Fyra lager — samma titel/text som animationens egna tooltips. */
const LAYER_STEPS = Object.values(ZONE_TOOLTIPS).map((t, i) => ({
  label: `Lager 0${i + 1}`,
  headline: t.title,
  support: t.body,
}));

/**
 * Planens ytor — gör den taktiska "Planens spelytor"-sekvensen browsbar.
 * Samma animation som tvångsintron på startsidan, men här som en egen sida i
 * Spelmodell-världen: korridorer (bredd), spelytor (djup), assistytan och
 * gyllene zonen. Loopar lugnt; respekterar prefers-reduced-motion.
 */
const PlanensYtor = () => {
  const reduced = Boolean(useReducedMotion());

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Spelmodell · Karta"
        title={
          <>
            Planens <span className="mark-lime">ytor</span>.
          </>
        }
        lead="Kartan du läser av: korridorer i bredd, spelytor i djup, assistytan och gyllene zonen."
        instruction="Läs uppifrån och ner. Fyra lager, en logik."
      />

      <KedjaSection
        id="lager"
        tone="paper"
        eyebrow="Spelmodell · Lager"
        title="Fyra lager, samma logik."
        definition="Korridorerna sätter bredden, spelytorna uppstår i djupet mellan lagdelarna. Den gyllene zonen är där flest mål avgörs — dit vill vi ta bollen, och därifrån vill vi stänga motståndaren ute."
        highlight="gyllene zonen"
      >
        <KedjaSteps tone="paper" steps={LAYER_STEPS} />

        <div className="mt-10">
          <div className="mb-2.5 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-kedja-green">
            Spelytor · interaktiv karta
          </div>
          <div className="overflow-hidden rounded-2xl border border-kedja-border bg-[#020a06]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
              <PitchZonesAnimation autoPlay={!reduced} reduced={reduced} loop className="h-full w-full" />
            </div>
          </div>
        </div>

        <KedjaClimax label="Kom ihåg" text={ZONE_LABELS.finalLines.join(" ")} />
      </KedjaSection>
    </div>
  );
};

export default PlanensYtor;
