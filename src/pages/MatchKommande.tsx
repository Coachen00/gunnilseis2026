import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";

const MatchKommande = () => (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title="Veckans match"
      description="Motståndare, plan, fokus — allt på ett ställe inför avspark."
    />
    <div className="container pb-24 space-y-16">
      <section>
        <SectionHeader badge="Motståndare" title="Motståndaranalys" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Fyll i motståndarens formation, styrkor, svagheter och triggers.</div>
      </section>
      <section>
        <SectionHeader badge="Vår plan" title="Matchplan" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Vår formation, anpassningar, fasta situationer.</div>
      </section>
      <section>
        <SectionHeader badge="Fokus" title="Veckans fokuspunkter" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">3 saker vi särskilt ska göra bra i denna match.</div>
      </section>
    </div>
  </>
);

export default MatchKommande;