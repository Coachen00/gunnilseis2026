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
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-10 h-[2px] bg-accent" aria-hidden="true" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-accent-ink">
                {eyebrow}
              </span>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.05}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-foreground">
              {title}
            </h1>
          </SectionReveal>
          {description && (
            <SectionReveal delay={0.1}>
              <p className="mt-6 max-w-prose text-base md:text-lg text-foreground/70 leading-relaxed">
                {description}
              </p>
            </SectionReveal>
          )}
          {children && (
            <SectionReveal delay={0.15}>
              <div className="mt-8">{children}</div>
            </SectionReveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
