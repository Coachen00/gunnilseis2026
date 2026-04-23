import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningAnfallSection } from "@/components/sections/TacticsSections";

const OmstallningAnfall = () => (
  <>
    <PageHero
      eyebrow="Omställning till anfall"
      title="Bollvinst → Framåt"
      description="När vi vinner bollen sover vi inte — vi tittar framåt direkt."
    />
    <div className="container pb-24 space-y-24">
      <section id="kontring" className="scroll-mt-24">
        <SectionHeader badge="01 · Kontring" title="Direkt kontring" subtitle="Rättvänd → spelvändning → full fart framåt inom 3 sekunder." />
        <OmstallningAnfallSection />
      </section>
      <section id="uppbyggnad" className="scroll-mt-24">
        <SectionHeader badge="02 · Uppbyggnad" title="Starta speluppbyggnad" subtitle="Om kontring inte är möjlig — säkra bollen och bygg lugnt från botten." />
        <div className="bg-card/85 backdrop-blur-sm rounded-lg p-6 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            När bollvinst sker djupt i egen halva eller mot organiserat motstånd: säkra första passningen, etablera 3-2-2-3-strukturen och påbörja uppbyggnad.
          </p>
        </div>
      </section>
    </div>
  </>
);

export default OmstallningAnfall;