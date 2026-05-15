import PageHero from "@/components/PageHero";
import { GenerelltSection, IdentitetSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import SectionHeader from "@/components/SectionHeader";
import CurrentStateSection from "@/components/CurrentStateSection";
import SectionReveal from "@/components/SectionReveal";
import StaggerList from "@/components/StaggerList";
import MediaLibraryGrid from "@/components/media/MediaLibraryGrid";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";

const Spelide = () => (
  <>
    <PageHero
      eyebrow="Spelidé"
      title="Hela vårt spel — från nuläge till identitet"
      description="Nuläget, fem anfallsprinciper, övriga skeden och vad vi gör generellt. Sidans röda tråd ner till varje detalj."
    />
    <div className="container pb-section space-y-24">
      <SectionReveal>
        <CurrentStateSection />
      </SectionReveal>

      <SectionReveal as="section">
        <section id="anfall" className="scroll-mt-24">
          <SectionHeader
            badge="Anfallsspel"
            title="Fem principer i sekvens"
            subtitle="När vi har bollen följer vi alltid samma flöde. Princip 1 är förutsättning, sen flödar bollen genom 2 → 5."
          />
          <StaggerList as="ol" className="space-y-3">
            {ATTACKING_PRINCIPLES.map((p) => (
              <li
                key={p.slug}
                className="bg-card rounded-sm border border-border p-5 md:p-6 flex items-start gap-4 transition-all duration-200 hover:-translate-y-px hover:border-accent hover:shadow-[0_8px_24px_-12px_hsl(215_70%_12%/0.18)]"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-sm border border-accent/40 bg-accent/10 text-accent font-mono font-bold text-sm flex items-center justify-center tabular">
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
          </StaggerList>
        </section>
      </SectionReveal>

      <SectionReveal as="section">
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
      </SectionReveal>

      <SectionReveal>
        <GenerelltSection />
      </SectionReveal>
      <SectionReveal>
        <IdentitetSection />
      </SectionReveal>

      <SectionReveal>
        <MediaLibraryGrid
          category="identitet"
          limit={3}
          eyebrow="Identitet · Senaste klippen"
          heading="Beteendena i levande sekvenser"
          subtitle="Korta klipp där 2:a bollsspel, duell, djupledsspel eller kroppsspråk syns tydligt."
        />
      </SectionReveal>
    </div>
  </>
);

export default Spelide;
