import PageHero from "@/components/PageHero";
import {
  RollerSection,
  MatchExempelSection,
  MatchtruppSection,
  KvalitetSection,
} from "@/components/sections/TacticsSections";

const Roller = () => (
  <>
    <PageHero eyebrow="Roller & Trupp" title="Roller, exempel och matchtrupp" description="Vad varje position gör, hur principerna ser ut i match, och dagens trupp." />
    <div className="container pb-24 space-y-24">
      <RollerSection />
      <MatchExempelSection />
      <MatchtruppSection />
      <KvalitetSection />
    </div>
  </>
);

export default Roller;
