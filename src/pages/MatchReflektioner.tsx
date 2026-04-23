import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";

const MatchReflektioner = () => (
  <>
    <PageHero
      eyebrow="Match · Reflektion"
      title="Samlade tankar — sista perioden"
      description="Mönster, trender och insikter över flera matcher i rad."
    />
    <div className="container pb-24 space-y-16">
      <section>
        <SectionHeader badge="Mönster" title="Återkommande mönster" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Vad upprepar sig — bra som dåligt — över de senaste matcherna?</div>
      </section>
      <section>
        <SectionHeader badge="Trend" title="KPI-trend" subtitle="PPDA · Spelvändningar · Inspel till assistytan" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Sammanfatta trenden för de tre KPI:erna.</div>
      </section>
      <section>
        <SectionHeader badge="Nästa steg" title="Vad fokuserar vi på framåt" />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">Prioriterade utvecklingsområden för kommande träningsperiod.</div>
      </section>
    </div>
  </>
);

export default MatchReflektioner;