import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, X } from "lucide-react";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";
import { useGlobalMediaMatch } from "@/hooks/useGlobalMediaMatch";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import PageHero from "@/components/PageHero";
import FasTrappa from "@/components/FasTrappa";
import SectionReveal from "@/components/SectionReveal";
import MediaSlot from "@/components/match/MediaSlot";
import { cn } from "@/lib/utils";

type IdentityMediaGroup = {
  id: string;
  title: string;
  description: string;
  slots: string[];
};

const IDENTITY_MEDIA_GROUPS: IdentityMediaGroup[] = [
  {
    id: "andrabollsspel",
    title: "2a bollsspel",
    description: "Reaktion, position och mod när nästa boll blir matchens viktigaste boll.",
    slots: ["2a bollsspel 1", "2a bollsspel 2", "2a bollsspel 3"],
  },
  {
    id: "duellspel",
    title: "Duellspel",
    description: "Närkontakt, första steg och kropp mot boll utan att tappa kontroll.",
    slots: ["Duellspel 1", "Duellspel 2", "Duellspel 3"],
  },
  {
    id: "djupledsspel",
    title: "Djupledsspel",
    description: "Djupledslöpningar och felvända löpningar som hjälper laget framåt och hemåt.",
    slots: ["Djupledsspel 1", "Djupledsspel 2", "Djupledsspel 3"],
  },
  {
    id: "vardigt-kroppssprak",
    title: "Värdigt kroppsspråk",
    description: "Hur vi bär oss själva efter misstag, beslut, dueller och matchens svåra stunder.",
    slots: ["Värdigt kroppsspråk 1", "Värdigt kroppsspråk 2", "Värdigt kroppsspråk 3"],
  },
];

const Identitet = () => {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) return <IdentityDetail slug={slug} />;
  return <IdentityOverview />;
};

const IdentityOverview = () => {
  const { matchId, loading, error } = useGlobalMediaMatch();
  useScrollToHash();

  return (
    <>
      <PageHero
        eyebrow="Spelet · Identitet"
        title="Identitet"
        description="Fyra beteenden som ska synas i träning, match och analys."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5 text-accent" />}
            {loading ? "Kopplar media" : error ? "Media offline" : "Media autosparas"}
          </span>
        </div>
      </PageHero>
      <FasTrappa blockId="identitet" />

      <div className="container pb-section">
        <nav className="mb-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Identitetsområden">
          {IDENTITY_MEDIA_GROUPS.map((group, index) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="group rounded-lg border border-border bg-card p-4 transition hover:border-accent/50"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-lg font-black tracking-tight text-foreground group-hover:text-accent">
                {group.title}
              </span>
            </a>
          ))}
        </nav>

        <div className="space-y-16">
          {IDENTITY_MEDIA_GROUPS.map((group, groupIndex) => (
            <SectionReveal key={group.id} as="section" id={group.id} className="scroll-mt-24">
              <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/35 bg-accent/10 font-mono text-xs font-black text-accent">
                      {String(groupIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                      Identitet
                    </span>
                  </div>
                  <h2 className="text-4xl leading-tight text-foreground md:text-5xl">
                    {group.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                {group.slots.map((slotTitle, slotIndex) => (
                  <article
                    key={slotTitle}
                    className={cn(
                      "card-hover rounded-xl border border-border bg-card p-4 shadow-sm"
                    )}
                  >
                    <h3 className="mb-4 text-2xl leading-tight text-foreground">
                      {slotTitle}
                    </h3>
                    <MediaSlot
                      matchId={matchId}
                      slotKey={`identitet:${group.id}:${slotIndex + 1}`}
                      title="Bild eller film"
                      description={slotTitle}
                      captionPlaceholder="Skriv bildförklaring här..."
                    />
                  </article>
                ))}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </>
  );
};

const IdentityDetail = ({ slug }: { slug: string }) => {
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);
  const { matchId } = useGlobalMediaMatch();
  const item = identity.find((i) => i.slug === slug);

  if (!item) return <Navigate to="/identitet" replace />;

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
      <div className="container pb-section">
        <Link
          to="/identitet"
          className="mb-10 inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till identitet
        </Link>

        <div className="max-w-3xl space-y-10">
          <div className="border-l-2 border-accent/60 pl-6">
            <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">{item.oneLiner}</p>
          </div>

          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Så gör vi det
            </h2>
            <ul className="space-y-3">
              {item.practice.map((p, i) => (
                <li key={p} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-black text-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90 md:text-base">{p}</span>
                  </div>
                  <div className="mt-4 pl-9">
                    <MediaSlot
                      matchId={matchId}
                      slotKey={`identitet:${item.slug}:practice:${i}`}
                      title={`Exempel ${i + 1}`}
                      description={`${item.title} - ${p}`}
                      compact
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <Check className="h-4 w-4" /> Godkänt
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">{item.gVillkor}</p>
              <div className="mt-4">
                <MediaSlot
                  matchId={matchId}
                  slotKey={`identitet:${item.slug}:godkant`}
                  title="Godkänt beteende"
                  description={item.gVillkor}
                  compact
                />
              </div>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive">
                <X className="h-4 w-4" /> Inte godkänt
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">{item.igVillkor}</p>
              <div className="mt-4">
                <MediaSlot
                  matchId={matchId}
                  slotKey={`identitet:${item.slug}:inte-godkant`}
                  title="Inte godkänt"
                  description={item.igVillkor}
                  compact
                />
              </div>
            </div>
          </section>

          <nav className="flex items-center justify-between border-t border-border pt-8">
            <Link
              to={`/identitet/${prev.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {prev.title}
            </Link>
            <Link
              to={`/identitet/${next.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
            >
              {next.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Identitet;
