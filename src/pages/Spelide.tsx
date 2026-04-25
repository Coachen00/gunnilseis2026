import { Link } from "react-router-dom";
import { ArrowRight, Printer } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import PrincipleBlock from "@/components/PrincipleBlock";
import PhaseNav from "@/components/PhaseNav";
import { GenerelltSection } from "@/components/sections/TacticsSections";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";

const PHASE_LINKS: Array<{
  phase:
    | "uppbyggnad"
    | "progression"
    | "avslut"
    | "omstallning-forsvar"
    | "forsvar"
    | "omstallning-anfall"
    | "malvakt"
    | "fasta";
  to: string;
  cta: string;
}> = [
  { phase: "uppbyggnad", to: "/anfall#speluppbyggnad", cta: "Hela uppbyggnaden" },
  { phase: "progression", to: "/anfall#skapa", cta: "Hela progressionen" },
  { phase: "avslut", to: "/anfall#avsluta", cta: "Hela avslutet" },
  { phase: "omstallning-forsvar", to: "/omstallning-forsvar", cta: "Hela omställning till försvar" },
  { phase: "forsvar", to: "/forsvar", cta: "Hela försvarsspelet" },
  { phase: "omstallning-anfall", to: "/omstallning-anfall", cta: "Hela omställning till anfall" },
  { phase: "malvakt", to: "/roller", cta: "Målvaktens roll i detalj" },
  { phase: "fasta", to: "/fasta", cta: "Hela fasta situationer" },
];

const Spelide = () => {
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);

  return (
    <>
      <PageHero
        eyebrow="Spelidé"
        title="Vår spelidé — i sin helhet"
        description="Ett dokument för spelare, föräldrar och nya tränare. Identitet, grundförutsättningar och en princip per skede — allt på en sida. Print-vänligt."
      />

      <div className="container mb-10 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 text-sm font-bold transition-colors"
        >
          <Printer className="w-4 h-4" />
          Skriv ut hela spelidén
        </button>
      </div>

      <div className="container space-y-24 pb-16">
        {/* IDENTITET */}
        <section id="identitet" className="scroll-mt-24">
          <SectionHeader
            badge="01 · Identitet"
            title="Fem saker vi gör i varje match"
            subtitle="Oavsett vem vi möter, oavsett resultat. Det här är vilka vi är på planen."
          />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {identity.map((w, i) => (
              <li key={w.slug}>
                <Link
                  to={`/identitet/${w.slug}`}
                  className="group block h-full bg-card/85 backdrop-blur-sm border border-border rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-lg font-black tracking-tight text-foreground mb-2">{w.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-4">{w.short}</div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent group-hover:gap-2.5 transition-all">
                    Läs detalj <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* GRUNDFÖRUTSÄTTNINGARNA */}
        <section id="grund" className="scroll-mt-24">
          <GenerelltSection />
        </section>

        {/* PRINCIPER PER SKEDE */}
        <section id="principer" className="scroll-mt-24">
          <SectionHeader
            badge="03 · Principer per skede"
            title="Den röda tråden"
            subtitle="En vass princip per skede. Samma vokabulär från målvakt till anfallare. Klicka för fullständig sida."
          />
          <div className="space-y-12">
            {PHASE_LINKS.map(({ phase, to, cta }) => (
              <div key={phase} className="space-y-4">
                <PrincipleBlock phase={phase} limit={1} />
                <Link
                  to={to}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent hover:text-accent/80 transition-colors"
                >
                  {cta} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* AVSLUT */}
        <section id="avslut" className="scroll-mt-24">
          <div className="max-w-3xl mx-auto text-center bg-card/85 backdrop-blur-sm border border-border rounded-2xl p-10">
            <blockquote className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
              "Spelmodellen är inte ett dokument. <span className="text-gradient-accent">Den är ett beteende.</span>"
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">
              Gunnilse IS · Säsong 2026
            </p>
          </div>
        </section>
      </div>

      <div className="print:hidden">
        <PhaseNav current="/spelide" />
      </div>
    </>
  );
};

export default Spelide;
