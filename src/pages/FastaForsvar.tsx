import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { FastaSection } from "@/components/sections/TacticsSections";

const FastaForsvar = () => (
  <>
    <PageHero
      eyebrow="Fasta · Försvar"
      title="Försvar mot fasta situationer"
      description="Hörnor, inläggsfrisparkar, inkast och avspark — defensivt. Vi gissar inte, vi har regler."
    />
    <div className="container pb-section space-y-20">
      <section id="hornor" className="scroll-mt-24">
        <SectionHeader badge="01 · Hörnor" title="Försvar mot hörnor" subtitle="Hybrid: zonbas i boxen + 2 spelare i strikt man-markering på största hoten." />
        <FastaSection />
      </section>
      <section id="frisparkar" className="scroll-mt-24">
        <SectionHeader badge="02 · Frisparkar" title="Försvar mot inläggsfrisparkar" subtitle="Samma princip som hörnor — zonbas, 2 man-markörer, andraboll-säkring." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med specifika regler för inläggsfrisparkar.</div>
      </section>
      <section id="inkast" className="scroll-mt-24">
        <SectionHeader badge="03 · Inkast" title="Försvar mot inkast" subtitle="Markering, andraboll, kontringsskydd vid långa inkast." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med inkastregler defensivt.</div>
      </section>
      <section id="avspark" className="scroll-mt-24">
        <SectionHeader badge="04 · Avspark" title="Försvar vid avspark" subtitle="Position och press när motståndaren har avspark." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med avsparksregler defensivt.</div>
      </section>
    </div>
  </>
);

export default FastaForsvar;