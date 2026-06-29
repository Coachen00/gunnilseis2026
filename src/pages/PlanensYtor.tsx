import { useReducedMotion } from "framer-motion";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import PitchZonesAnimation from "@/components/zones/PitchZonesAnimation";

/**
 * Planens ytor — gör den taktiska "Planens spelytor"-sekvensen browsbar.
 * Samma animation som tvångsintron på startsidan, men här som en egen sida i
 * Spelmodell-världen: korridorer (bredd), spelytor (djup), assistytan och
 * gyllene zonen. Loopar lugnt; respekterar prefers-reduced-motion.
 */
const PlanensYtor = () => {
  const reduced = Boolean(useReducedMotion());
  return (
    <>
      <BreadcrumbTrail
        items={[{ label: "Hem", to: "/" }, { label: "Spelmodell", to: "/spelmodell" }, { label: "Planens ytor" }]}
      />
      <PageHero
        eyebrow="Spelmodell · Karta"
        title="Planens ytor"
        description="Kartan du läser av: korridorer i bredd, spelytor i djup, assistytan och gyllene zonen."
      />
      <SectionReveal as="section" className="container pb-section">
        <div className="overflow-hidden border border-border bg-[#020a06]">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
            <PitchZonesAnimation autoPlay={!reduced} reduced={reduced} loop className="h-full w-full" />
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Korridorerna sätter bredden, spelytorna uppstår i djupet mellan lagdelarna. Den gyllene zonen är där flest mål
          avgörs — dit vill vi ta bollen, och därifrån vill vi stänga motståndaren ute.
        </p>
      </SectionReveal>
    </>
  );
};

export default PlanensYtor;
