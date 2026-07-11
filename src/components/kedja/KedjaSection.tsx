import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KedjaSectionProps {
  id: string;
  tone: "paper" | "white";
  eyebrow: string;
  title: string;
  definition: string;
  highlight: string;
  children?: ReactNode;
}

const KedjaSection = ({ id, tone, eyebrow, title, definition, highlight, children }: KedjaSectionProps) => {
  const parts = definition.split(highlight);

  return (
    <section id={id} className={cn("scroll-mt-20", tone === "paper" ? "bg-kedja-paper" : "bg-white")}>
      <div className="mx-auto max-w-[720px] px-6 pb-[88px] pt-24 text-center">
        <div className="mb-5 flex items-center justify-center gap-4">
          <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">{eyebrow}</span>
          <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">{title}</h2>
        <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
          {parts.length === 2 ? (
            <>
              {parts[0]}
              <em className="mark-lime not-italic">{highlight}</em>
              {parts[1]}
            </>
          ) : (
            definition
          )}
        </p>
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
};

export default KedjaSection;
