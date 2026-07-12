import { FastaSection } from "@/components/sections/TacticsSections";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaQuote from "@/components/kedja/KedjaQuote";

const NAV_ITEMS = [
  { num: "01", title: "Hörnor", sub: "Hybrid: zonbas i boxen", href: "#hornor" },
  { num: "02", title: "Frisparkar", sub: "Samma princip som hörnor", href: "#frisparkar" },
  { num: "03", title: "Inkast", sub: "Markering, andraboll, kontringsskydd", href: "#inkast" },
  { num: "04", title: "Avspark", sub: "Position och press", href: "#avspark" },
];

const FastaForsvar = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Fasta · Försvar"
      title={
        <>
          Försvar mot
          <br />
          <span className="mark-lime">fasta situationer</span>.
        </>
      }
      lead="Hörnor, inläggsfrisparkar, inkast och avspark — defensivt. Vi gissar inte, vi har regler."
      instruction="Läs uppifrån och ner. Fyra lägen, samma krav på ordning."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <section id="hornor" className="scroll-mt-20 bg-kedja-paper">
      <div className="container pb-[88px] pt-24">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Försvar 01</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">Försvar mot hörnor</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            Hybrid: <em className="mark-lime not-italic">zonbas i boxen</em> + 2 spelare i strikt man-markering på
            största hoten.
          </p>
        </div>
        <div className="mt-12 text-left">
          <FastaSection />
        </div>
      </div>
    </section>

    <KedjaQuote text="Inget överlämnas åt slumpen." highlight="slumpen" />

    <KedjaSection
      id="frisparkar"
      tone="white"
      eyebrow="Försvar 02"
      title="Försvar mot inläggsfrisparkar"
      definition="Samma princip som hörnor — zonbas, 2 man-markörer, andraboll-säkring."
      highlight="andraboll-säkring"
    >
      <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Fyll på med specifika regler för inläggsfrisparkar.
      </div>
    </KedjaSection>

    <KedjaSection
      id="inkast"
      tone="paper"
      eyebrow="Försvar 03"
      title="Försvar mot inkast"
      definition="Markering, andraboll, kontringsskydd vid långa inkast."
      highlight="kontringsskydd"
    >
      <div className="rounded-2xl border border-kedja-border bg-white p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Fyll på med inkastregler defensivt.
      </div>
    </KedjaSection>

    <KedjaSection
      id="avspark"
      tone="white"
      eyebrow="Försvar 04"
      title="Försvar vid avspark"
      definition="Position och press när motståndaren har avspark."
      highlight="press"
    >
      <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Fyll på med avsparksregler defensivt.
      </div>
    </KedjaSection>
  </div>
);

export default FastaForsvar;
