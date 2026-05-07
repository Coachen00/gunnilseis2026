import { GenerelltSection, IdentitetSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import SectionHeader from "@/components/SectionHeader";
import CurrentStateSection from "@/components/CurrentStateSection";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";

const Spelide = () => (
  <>
    <div className="container pb-24 space-y-24">
      <CurrentStateSection />

      <section id="anfall" className="scroll-mt-24">
        <SectionHeader
          badge="Anfallsspel"
          title="Fem principer i sekvens"
          subtitle="När vi har bollen följer vi alltid samma flöde. Princip 1 är förutsättning, sen flödar bollen genom 2 → 5."
        />
        <ol className="space-y-3">
          {ATTACKING_PRINCIPLES.map((p) => (
            <li
              key={p.slug}
              className="bg-card/85 rounded-xl border border-border p-5 md:p-6 flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 text-accent font-mono font-black text-sm flex items-center justify-center">
                {String(p.order).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <a
                  href={`/anfall#${p.slug}`}
                  className="text-base md:text-lg font-bold text-foreground leading-snug tracking-tight hover:text-accent transition-colors"
                >
                  {p.headline}
                </a>
                <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {p.oneLiner}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="ovriga-skeden" className="scroll-mt-24">
        <SectionHeader
          badge="Övriga skeden"
          title="Försvar, omställningar, målvakt"
          subtitle="En vass princip per skede — samma vokabulär används överallt på sidan."
        />
        <div className="space-y-10">
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
