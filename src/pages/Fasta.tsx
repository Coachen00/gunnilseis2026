import PageHero from "@/components/PageHero";
import { FastaSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import PhaseNav from "@/components/PhaseNav";

const Fasta = () => (
  <>
    <PageHero
      eyebrow="Fasta situationer"
      title="När spelet stannar"
      description="Hörnor, frisparkar, inkast, avspark — defensivt och offensivt. Vi gissar inte, vi har regler."
    />
    <div className="container">
      <div className="max-w-3xl mb-16 border-l-2 border-accent/60 pl-6">
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          <span className="font-bold">Varför hybrid?</span> Ren zon släpper de farligaste lufthoten fria. Ren man-markering öppnar ytor i boxen. Vår hybrid kombinerar det bästa: zonbas i boxen + två strikta man-markeringar på de största hoten. Offensivt gäller samma logik som i öppet spel — leverera till gyllene zonen via assistytan.
        </p>
      </div>
      <div className="mb-16">
        <PrincipleBlock phase="fasta" showSource />
      </div>
    </div>
    <div className="container pb-16">
      <FastaSection />
    </div>
    <PhaseNav current="/fasta" />
  </>
);

export default Fasta;
