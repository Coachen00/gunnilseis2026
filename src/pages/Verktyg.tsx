import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { ClipboardList, FileText, Search, Target, ArrowRight } from "lucide-react";

const tools = [
  { to: "/traningsplan", label: "Träningsplan", desc: "Planera passet — tema, fokus, övningar och coach-cues. Utskriftsoptimerat A4.", icon: ClipboardList },
  { to: "/matchblad", label: "Matchblad", desc: "Förbered matchen: trupp, fokuspunkter, planritningar och påminnelser.", icon: FileText },
  { to: "/motstandaranalys", label: "Motståndaranalys", desc: "Strukturerad genomgång av motståndarens spelidé, styrkor och svagheter.", icon: Search },
  { to: "/taktiktavla", label: "Taktiktavla", desc: "Interaktiv tavla — flytta spelare, rita linjer, animera sekvenser.", icon: Target },
];

const Verktyg = () => (
  <>
    <PageHero eyebrow="Verktyg" title="Tränarverktyg" description="Allt du behöver för att förbereda och genomföra träning och match. Kräver inloggning." />
    <section className="container pb-24">
      <div className="grid sm:grid-cols-2 gap-5">
        {tools.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group bg-card/85 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm card-hover flex items-start gap-5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground mb-1.5 tracking-tight">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                Öppna verktyg <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </>
);

export default Verktyg;
