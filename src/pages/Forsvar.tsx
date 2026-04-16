import PageHero from "@/components/PageHero";
import { ForsvarsspelSection, OmstallningForsvarSection } from "@/components/sections/TacticsSections";

const Forsvar = () => (
  <>
    <PageHero eyebrow="Försvar" title="Försvarsspel & Omställning" description="Kompakt 4-3-3 som styr ut. Vi pressar tillsammans, faller tillsammans och vinner andrabollar." />
    <div className="container pb-24 space-y-24">
      <ForsvarsspelSection />
      <OmstallningForsvarSection />
    </div>
  </>
);

export default Forsvar;
