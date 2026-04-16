import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { HeroBadges } from "@/components/sections/TacticsSections";
import { Shield, Swords, Zap, Anchor, Users, Wrench, ArrowRight } from "lucide-react";

const cards = [
  { to: "/spelide", label: "Spelidé", desc: "Spelkartan, identitet och våra G/IG-mallar.", icon: Shield, accent: "primary" },
  { to: "/forsvar", label: "Försvar", desc: "5 principer, pressfälla och omställning till försvar.", icon: Anchor, accent: "destructive" },
  { to: "/anfall", label: "Anfall", desc: "3-2-2-3, korridorer, gyllene zonen, omställning till anfall.", icon: Swords, accent: "accent" },
  { to: "/fasta", label: "Fasta situationer", desc: "Hörnor, frisparkar och defensiva triggers.", icon: Zap, accent: "secondary" },
  { to: "/roller", label: "Roller & Trupp", desc: "Rollkort, exempel från match, matchtrupp.", icon: Users, accent: "primary" },
  { to: "/verktyg", label: "Verktyg", desc: "Träningsplan, Matchblad, Motståndaranalys, Taktiktavla.", icon: Wrench, accent: "accent" },
];

const Hem = () => {
  return (
    <>
      <PageHero
        eyebrow="Gunnilse IS · Säsong 2026"
        title={
          <>
            Träningsmatcher{" "}
            <span className="text-gradient-accent">Vinter / Vår 2026</span>
          </>
        }
        description="Försvar: 4-3-3 — kompakt, styr ut. Anfall: 3-2-2-3 med inverterad ytterback. Här samlar vi spelidé, träning och matchverktyg på ett ställe."
      >
        <HeroBadges />
      </PageHero>

      <section className="container pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ to, label, desc, icon: Icon, accent }) => (
            <Link
              key={to}
              to={to}
              className="group relative bg-card/85 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm card-hover flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl bg-${accent}/10 text-${accent} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5 tracking-tight">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                Öppna <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hem;
