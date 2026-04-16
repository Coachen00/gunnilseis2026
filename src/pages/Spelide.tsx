import PageHero from "@/components/PageHero";
import { GenerelltSection, IdentitetSection } from "@/components/sections/TacticsSections";

const Spelide = () => (
  <>
    <PageHero eyebrow="Spelidé" title="Vår spelidé" description="Spelkartan visar när vi säkrar, bygger eller accelererar. Identiteten är hur vi uppträder varje dag — på och utanför planen." />
    <div className="container pb-24 space-y-24">
      <GenerelltSection />
      <IdentitetSection />
    </div>
  </>
);

export default Spelide;
