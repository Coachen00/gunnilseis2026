import PageHero from "@/components/PageHero";
import { FastaSection } from "@/components/sections/TacticsSections";

const Fasta = () => (
  <>
    <PageHero eyebrow="Fasta situationer" title="När spelet stannar" description="Hörnor och frisparkar — defensivt och offensivt. Vi gissar inte, vi har regler." />
    <div className="container pb-24">
      <FastaSection />
    </div>
  </>
);

export default Fasta;
