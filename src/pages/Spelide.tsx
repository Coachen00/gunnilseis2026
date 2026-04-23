import PageHero from "@/components/PageHero";
import { GenerelltSection, IdentitetSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import SectionHeader from "@/components/SectionHeader";

const Spelide = () => (
  <>
    <PageHero eyebrow="Spelidé" title="Vår spelidé" description="En princip per skede — uppbyggnad, progression, avslut, försvar och omställningar. Allt riktat mot ett mål: avslut i gyllene zonen, och förhindra det i andra änden." />
    <div className="container pb-24 space-y-24">
      <section id="principer" className="scroll-mt-24">
        <SectionHeader
          badge="Principer per skede"
          title="Den röda tråden"
          subtitle="En vass princip per skede — samma vokabulär används överallt på sidan."
        />
        <div className="space-y-10">
          <PrincipleBlock phase="uppbyggnad" limit={1} />
          <PrincipleBlock phase="progression" limit={1} />
          <PrincipleBlock phase="avslut" limit={1} />
          <PrincipleBlock phase="omstallning-forsvar" limit={1} />
          <PrincipleBlock phase="forsvar" limit={1} />
          <PrincipleBlock phase="omstallning-anfall" limit={1} />
          <PrincipleBlock phase="malvakt" limit={1} />
        </div>
      </section>
      <GenerelltSection />
      <IdentitetSection />
    </div>
  </>
);

export default Spelide;
