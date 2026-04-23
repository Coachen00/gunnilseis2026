import PageHero from "@/components/PageHero";
import { ForsvarsspelSection, OmstallningForsvarSection } from "@/components/sections/TacticsSections";

const Forsvar = () => (
  <>
    <PageHero
      eyebrow="Försvar"
      title="Försvarsspel & Omställning"
      description="Kompakt 4-3-3 som styr ut. Vi pressar tillsammans, faller tillsammans och vinner andrabollar."
    />
    <div className="container">
      <div className="max-w-3xl mb-16 border-l-2 border-accent/60 pl-6">
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          <span className="font-bold">Varför kompakt?</span> Ett kompakt lag stänger passningsvägar och tvingar motståndaren utåt — där ytan är mindre och bollen lättare att vinna. Principerna nedan styr hur vi rör oss tillsammans.
        </p>
      </div>
    </div>
    <div className="container pb-24 space-y-24">
      <ForsvarsspelSection />
      <OmstallningForsvarSection />
    </div>
  </>
);

export default Forsvar;
