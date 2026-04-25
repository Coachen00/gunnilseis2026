import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";
import PageHero from "@/components/PageHero";

const Identitet = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);
  const item = slug ? identity.find((i) => i.slug === slug) : undefined;

  if (!item) return <Navigate to="/" replace />;

  const index = identity.findIndex((i) => i.slug === item.slug);
  const prev = identity[(index - 1 + identity.length) % identity.length];
  const next = identity[(index + 1) % identity.length];

  return (
    <>
      <PageHero
        eyebrow={`Identitet · 0${index + 1} av 0${identity.length}`}
        title={item.title}
        description={item.short}
      />
      <div className="container pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till identitet
        </Link>

        <div className="max-w-3xl space-y-10">
          <div className="border-l-2 border-accent/60 pl-6">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">{item.oneLiner}</p>
          </div>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-4">Så gör vi det</h2>
            <ul className="space-y-3">
              {item.practice.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-card/85 backdrop-blur-sm border border-border rounded-lg p-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm md:text-base text-foreground/90 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-card/85 backdrop-blur-sm border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <Check className="w-4 h-4" /> Godkänt
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{item.gVillkor}</p>
            </div>
            <div className="bg-card/85 backdrop-blur-sm border border-destructive/30 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive">
                <X className="w-4 h-4" /> Inte godkänt
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{item.igVillkor}</p>
            </div>
          </section>

          <nav className="flex items-center justify-between border-t border-border pt-8">
            <Link
              to={`/identitet/${prev.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {prev.title}
            </Link>
            <Link
              to={`/identitet/${next.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              {next.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Identitet;