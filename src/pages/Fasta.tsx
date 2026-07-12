import FasTrappa from "@/components/FasTrappa";
import { FastaSection } from "@/components/sections/TacticsSections";
import { PHASES } from "@/data/principles";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";

const FASTA_PRINCIPLES = PHASES.fasta;

const NAV_ITEMS = [
  { num: "01", title: "Försvar", sub: "Hörnor, frisparkar, inkast, avspark", href: "/fasta/forsvar" },
  { num: "02", title: "Anfall", sub: "Tydliga roller, tydliga signaler", href: "/fasta/anfall" },
];

/** Två principer — samma rader som PrincipleBlock, ihopdragna till spine-steg. */
const PRINCIPLE_STEPS = FASTA_PRINCIPLES.principles.map((p, i) => ({
  label: `Princip 0${i + 1}`,
  headline: p.headline,
  support: p.detail,
}));

const Fasta = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Fasta situationer"
      title={
        <>
          När spelet stannar.
          <br />
          Vi gissar inte, vi har <span className="mark-lime">regler</span>.
        </>
      }
      lead="Hörnor, frisparkar, inkast, avspark — defensivt och offensivt. Vi gissar inte, vi har regler."
      instruction="Läs uppifrån och ner. Samma logik, båda hållen."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <div className="bg-kedja-paper py-16">
      <FasTrappa blockId="fasta-situationer" />
    </div>

    <KedjaSection
      id="principer"
      tone="paper"
      eyebrow="Fasta · Principer"
      title="Hybrid bak, gyllene zonen fram."
      definition="Ren zon släpper de farligaste lufthoten fria. Ren man-markering öppnar ytor i boxen. Vår hybrid kombinerar det bästa: zonbas i boxen + två strikta man-markeringar på de största hoten. Offensivt gäller samma logik som i öppet spel — leverera till gyllene zonen via assistytan."
      highlight="zonbas i boxen"
    >
      <KedjaSteps tone="paper" steps={PRINCIPLE_STEPS} />
      <KedjaClimax label="Vårt rop" text={FASTA_PRINCIPLES.oneLiner} />
    </KedjaSection>

    <KedjaQuote text="Vi gissar inte. Vi har regler." highlight="regler" />

    <div className="bg-white py-24">
      <div className="container">
        <FastaSection />
      </div>
    </div>
  </div>
);

export default Fasta;
