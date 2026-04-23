import PageHero from "@/components/PageHero";
import {
  RollerSection,
  MatchExempelSection,
  MatchtruppSection,
  KvalitetSection,
} from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import SectionHeader from "@/components/SectionHeader";

const Roller = () => (
  <>
    <PageHero eyebrow="Roller & Trupp" title="Roller, exempel och matchtrupp" description="Vad varje position gör, hur principerna ser ut i match, och dagens trupp." />
    <div className="container pb-24 space-y-24">
      <RollerSection />
      <section id="malvakt" className="scroll-mt-24">
        <SectionHeader
          badge="Målvakten"
          title="Spelbar i uppbyggnad — sista försvarare i försvarsspel"
          subtitle="Målvakten är en uppbyggnadsspelare och en kommunicerande sista försvarare."
        />
        <PrincipleBlock phase="malvakt" showSource />
      </section>
      <MatchExempelSection />
      <MatchtruppSection />
      <KvalitetSection />
    </div>
  </>
);

export default Roller;
