import { ReactNode } from "react";

interface KedjaHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  instruction?: string;
  children?: ReactNode;
}

const KedjaHero = ({ eyebrow, title, lead, instruction, children }: KedjaHeroProps) => {
  return (
    <section className="bg-kedja-mint">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 pb-[88px] pt-24 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="block h-[2px] w-[34px] bg-kedja-green" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">{eyebrow}</span>
          </div>
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-kedja-ink">
            {title}
          </h1>
          <p className="mt-7 max-w-[520px] text-[19px] leading-[1.6] text-kedja-deep">{lead}</p>
          {instruction && <p className="mt-5 text-sm font-semibold text-kedja-green">{instruction}</p>}
        </div>
        {children && <div>{children}</div>}
      </div>
    </section>
  );
};

export default KedjaHero;
