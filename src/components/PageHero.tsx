import { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}

const PageHero = ({ eyebrow, title, description, children }: PageHeroProps) => {
  return (
    <section className="relative pt-12 md:pt-16 pb-10 md:pb-14">
      <div className="container">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-10 h-0.5 bg-accent rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/90">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground leading-[1.05] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
