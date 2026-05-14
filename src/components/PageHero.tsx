import { ReactNode } from "react";
import SectionReveal from "@/components/SectionReveal";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

const PageHero = ({ eyebrow, title, description, children }: PageHeroProps) => {
  return (
    <section className="relative pt-20 md:pt-section-lg pb-section-sm md:pb-section">
      <div className="container">
        <div className="max-w-3xl">
          <SectionReveal>
            <div className="flex items-center gap-4 mb-7">
              <span className="inline-block w-12 h-px bg-accent/70" aria-hidden="true" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-accent">
                {eyebrow}
              </span>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.05}>
            <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl leading-[1.04]">
              {title}
            </h1>
          </SectionReveal>
          {description && (
            <SectionReveal delay={0.1}>
              <p className="mt-7 max-w-prose text-lg md:text-xl text-foreground/75 leading-relaxed">
                {description}
              </p>
            </SectionReveal>
          )}
          {children && (
            <SectionReveal delay={0.15}>
              <div className="mt-10">{children}</div>
            </SectionReveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
