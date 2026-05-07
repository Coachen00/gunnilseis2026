import type { AttackingPrinciple } from "@/data/attackingPrinciples";
import { findIdentity } from "@/data/identity";

interface Props {
  principle: AttackingPrinciple;
}

const AttackingPrincipleCard = ({ principle: p }: Props) => (
  <article
    id={p.slug}
    className="scroll-mt-24 bg-card/85 backdrop-blur-sm rounded-xl border border-border overflow-hidden"
  >
    <header className="flex items-start gap-4 p-5 md:p-6 border-b border-border">
      <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-accent/15 text-accent font-mono font-black text-base flex items-center justify-center">
        {String(p.order).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent mb-1">
          Anfallsprincip {p.order} · {p.headline}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight tracking-tight">
          {p.oneLiner}
        </h3>
        {p.coachrop && p.coachrop.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-muted-foreground self-center mr-1">
              Coachrop:
            </span>
            {p.coachrop.map((rop) => (
              <span
                key={rop}
                className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
              >
                {rop}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>

    <div className="grid gap-x-8 gap-y-6 p-5 md:p-6 md:grid-cols-2">
      <section className="md:col-span-2">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Förklaring
        </h4>
        <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
          {p.forklaring}
        </p>
      </section>

      <section>
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Titta efter
        </h4>
        <ul className="space-y-1.5 text-sm text-foreground/85">
          {p.tittaEfter.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent mt-0.5 select-none">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Gör så här
        </h4>
        <ul className="space-y-1.5 text-sm text-foreground/85">
          {p.goraDetta.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent mt-0.5 select-none">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 border-t border-border pt-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="border-l-2 border-accent/60 pl-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-muted-foreground mb-1.5">
              Klippanalys · {p.matchExempel.motstandare}
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">
              {p.matchExempel.situation}
            </p>
          </div>
          <div className="border-l-2 border-primary/60 pl-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-muted-foreground mb-1.5">
              Övning / coachning · {p.ovning.rubrik}
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">
              {p.ovning.beskrivning}
            </p>
          </div>
        </div>
      </section>

      {p.aktiverarIdentitet && p.aktiverarIdentitet.length > 0 && (
        <section className="md:col-span-2 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Aktiverar identitet:
            </span>
            {p.aktiverarIdentitet.map((slug) => {
              const id = findIdentity(slug);
              if (!id) return null;
              return (
                <a
                  key={slug}
                  href={`/identitet/${slug}`}
                  className="rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-bold text-foreground/85 hover:border-accent/60 transition-colors"
                >
                  {id.title}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  </article>
);

export default AttackingPrincipleCard;
