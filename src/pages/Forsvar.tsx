import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { ForsvarsspelSection } from "@/components/sections/TacticsSections";

const Forsvar = () => (
  <>
    <PageHero
      eyebrow="Försvar"
      title="Försvarsspel"
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
      <section id="hogt" className="scroll-mt-24">
        <SectionHeader badge="01 · Högt" title="Högt försvar" subtitle="Press hög upp i plan — trigger på deras vänsterback." />
        <ForsvarsspelSection />
      </section>
      <section id="medel" className="scroll-mt-24">
        <SectionHeader badge="02 · Medel" title="Medelhögt försvar" subtitle="Block runt mittlinjen — stäng inre korridorer, tvinga utåt." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med medelhögt block — höjd, triggers och passningsvägar att stänga.</div>
      </section>
      <section id="lagt" className="scroll-mt-24">
        <SectionHeader badge="03 · Lågt" title="Lågt försvar" subtitle="Lågt block nära egen box — kompakthet, andraboll och kontringsskydd." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med lågt blockregler — boxförsvar och vad som triggar pressen igen.</div>
      </section>
    </div>
  </>
);

export default Forsvar;
