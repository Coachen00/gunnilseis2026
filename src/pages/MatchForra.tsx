import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";

const MatchForra = () => (
  <>
    <PageHero
      eyebrow="Match · Förra"
      title="Förra matchen"
      description="Vad hände, vad lärde vi oss, vad tar vi med oss."
    />
    <div className="container pb-24 space-y-16">
      <section>
        <SectionHeader badge="Resultat" title="Resultat & summering" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll i resultat, motståndare, datum och kort summering.</div>
      </section>
      <section>
        <SectionHeader badge="Bra" title="Det här fungerade" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Lista de saker som gick enligt plan.</div>
      </section>
      <section>
        <SectionHeader badge="Förbättra" title="Det här tar vi tag i" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Lista konkreta förbättringspunkter till nästa match.</div>
      </section>
    </div>
  </>
);

export default MatchForra;