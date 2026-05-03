import { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

const PageHero = ({ eyebrow, title, description, children }: PageHeroProps) => {
  return (
    <section className="relative pt-16 md:pt-24 pb-12 md:pb-20">
      <div className="container">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-10 h-px bg-accent" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-accent">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.02] tracking-normal">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
