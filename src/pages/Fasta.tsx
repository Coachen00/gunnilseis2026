import PageHero from "@/components/PageHero";
import { FastaSection } from "@/components/sections/TacticsSections";

const Fasta = () => (
  <>
    <PageHero
      eyebrow="Fasta situationer"
      title="När spelet stannar"
      description="Hörnor och frisparkar — defensivt och offensivt. Vi gissar inte, vi har regler."
    />
    <div className="container">
      <div className="max-w-3xl mb-16 border-l-2 border-accent/60 pl-6">
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          <span className="font-bold">Varför hybrid?</span> Ren zon släpper de farligaste lufthoten fria. Ren man-markering öppnar ytor i boxen. Vår hybrid kombinerar det bästa: zonbas i boxen + två strikta man-markeringar på de största hoten.
        </p>
      </div>
    </div>
    <div className="container pb-24">
      <FastaSection />
    </div>
  </>
);

export default Fasta;
