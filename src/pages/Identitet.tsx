import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";
import PageHero from "@/components/PageHero";
import MediaPlaceholder from "@/components/MediaPlaceholder";

const Identitet = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);
  const item = slug ? identity.find((i) => i.slug === slug) : undefined;

  if (!item) return <Navigate to="/" replace />;

  const index = identity.findIndex((i) => i.slug === item.slug);
  const prev = identity[(index - 1 + identity.length) % identity.length];
  const next = identity[(index + 1) % identity.length];
  const chapter = String(index + 1).padStart(2, "0");
  const total = String(identity.length).padStart(2, "0");

  return (
    <>
      <PageHero
        eyebrow={`Identitet · ${chapter} av ${total}`}
        title={item.title}
        description={item.short}
      />
      <div className="container pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka
        </Link>

        <article className="max-w-3xl space-y-12">
          <section className="border-l-2 border-accent/60 pl-6">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-accent mb-3">
              I en mening
            </div>
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
              {item.oneLiner}
            </p>
          </section>

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

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-4">
              Exempel · video eller bild
            </h2>
            <MediaPlaceholder
              type="video"
              title={`Klipp som visar ${item.title.toLowerCase()} live i match`}
              description="Lägg till klipp via admin när det är redo — coach kan välja från egen telefon."
            />
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

          <nav className="grid grid-cols-2 gap-4 border-t border-border pt-8">
            <Link
              to={`/identitet/${prev.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-border bg-card/60 p-4 hover:bg-card transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                <ArrowLeft className="w-3 h-3" />
                Föregående
              </span>
              <span className="text-sm md:text-base font-bold text-foreground group-hover:text-accent transition-colors">
                {prev.title}
              </span>
            </Link>
            <Link
              to={`/identitet/${next.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-accent/40 bg-accent/5 p-4 hover:bg-accent/10 transition-colors text-right"
            >
              <span className="inline-flex items-center justify-end gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                Nästa princip
                <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-sm md:text-base font-bold text-foreground group-hover:text-accent transition-colors">
                {next.title}
              </span>
            </Link>
          </nav>
        </article>
      </div>
    </>
  );
};

export default Identitet;
