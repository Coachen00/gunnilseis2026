import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

// Spelvändningar under anfall — självständig HTML-animation (1600×900) som
// ligger som statisk asset i public/anfallsspel/spelvandningar/ och bäddas in
// via iframe. Samma mönster som UnderProcessDeck (neon-decket).
const SpelvandningarAnfall = () => (
  <>
    <PageHero
      eyebrow="Anfall · Spelvändning"
      title="Central korridor till yttre yta"
      description="När mitten stängs vänder vi spelet ut i ytterkorridoren — se rörelsen i animationen nedan."
    />

    <div className="container pb-section">
      <SectionReveal>
        <Link
          to="/anfall"
          className="inline-flex items-center gap-2 mb-6 text-xs font-mono font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
          Tillbaka till anfallsspel
        </Link>
      </SectionReveal>

      <SectionReveal>
        <div className="overflow-hidden rounded-sm border border-border bg-card">
          <iframe
            src="/anfallsspel/spelvandningar/spelvandning-central-till-yttre.html"
            title="Spelvändning – central korridor till yttre yta"
            className="aspect-video w-full border-0"
            loading="lazy"
          />
        </div>
      </SectionReveal>
    </div>
  </>
);

export default SpelvandningarAnfall;
