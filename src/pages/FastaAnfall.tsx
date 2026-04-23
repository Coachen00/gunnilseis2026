import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";

const FastaAnfall = () => (
  <>
    <PageHero
      eyebrow="Fasta · Anfall"
      title="Anfall från fasta situationer"
      description="Hörnor, inläggsfrisparkar, inkast och avspark — offensivt. Tydliga roller, tydliga signaler."
    />
    <div className="container pb-24 space-y-20">
      <section id="hornor" className="scroll-mt-24">
        <SectionHeader badge="01 · Hörnor" title="Offensiva hörnor" subtitle="Inswing/outswing, korta varianter, andrabollszon." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med offensiva hörnvarianter.</div>
      </section>
      <section id="frisparkar" className="scroll-mt-24">
        <SectionHeader badge="02 · Frisparkar" title="Inläggsfrisparkar" subtitle="Slagvariant, löpningar, andraboll." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med offensiva frisparkar.</div>
      </section>
      <section id="inkast" className="scroll-mt-24">
        <SectionHeader badge="03 · Inkast" title="Offensiva inkast" subtitle="Snabba inkast, långa inkast, mönster." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med inkastregler offensivt.</div>
      </section>
      <section id="avspark" className="scroll-mt-24">
        <SectionHeader badge="04 · Avspark" title="Vår avspark" subtitle="Mönster för uppspel direkt från avspark." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll på med avsparksmönster.</div>
      </section>
    </div>
  </>
);

export default FastaAnfall;