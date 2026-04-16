import PageHero from "@/components/PageHero";
import { AnfallsspelSection, OmstallningAnfallSection } from "@/components/sections/TacticsSections";

const Anfall = () => (
  <>
    <PageHero eyebrow="Anfall" title="Anfallsspel & Omställning" description="3-2-2-3 med inverterad ytterback. Vi bygger via inre korridor och accelererar mot gyllene zonen." />
    <div className="container pb-24 space-y-24">
      <AnfallsspelSection />
      <OmstallningAnfallSection />
    </div>
  </>
);

export default Anfall;
