import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningForsvarSection } from "@/components/sections/TacticsSections";

const OmstallningForsvar = () => (
  <>
    <PageHero
      eyebrow="Omställning till försvar"
      title="Bollförlust → Jaga eller falla"
      description="När vi tappar bollen jagar vi tillsammans direkt — eller faller tillbaka tillsammans. Inget kaos."
    />
    <div className="container pb-24 space-y-24">
      <section id="direkt" className="scroll-mt-24">
        <SectionHeader badge="01 · Direkt" title="Direkt motpress" subtitle="De första 5 sekunderna efter bollförlust — vi jagar tillsammans." />
        <OmstallningForsvarSection />
      </section>
      <section id="kontroll" className="scroll-mt-24">
        <SectionHeader badge="02 · Kontroll" title="Tillbaka till kontroll" subtitle="Om vi inte återvinner bollen — fall tillbaka kompakt och organiserat." />
        <div className="bg-card/85 backdrop-blur-sm rounded-lg p-6 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Efter 5 sekunders misslyckad press: hela laget faller tillbaka som enhet, behåller 4-3-3-formen, och återetablerar kompakt block.
          </p>
        </div>
      </section>
    </div>
  </>
);

export default OmstallningForsvar;