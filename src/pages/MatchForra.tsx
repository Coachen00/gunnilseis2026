import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { getForraMatch, type ForraMatch } from "@/data/forraMatch";
import { formatMatchDate } from "@/lib/dateUtils";

const homeAwayLabel = (m: ForraMatch["meta"]) =>
  m.homeAway === "home" ? "Hemma" : "Borta";

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm italic text-muted-foreground">{children}</p>
);

const resultText = (m: ForraMatch["meta"]) => {
  if (m.ourScore == null || m.theirScore == null) return "—";
  return `${m.ourScore}–${m.theirScore}`;
};

const MatchForra = () => {
  // Dynamiskt: hämtar senast spelade matchen från season.ts.
  // Auto-rullar vidare när nästa match är spelad utan kod-redigering.
  const m = getForraMatch();

  if (!m) {
    return (
      <>
        <PageHero
          eyebrow="Match · Förra"
          title="Ingen spelad match än"
          description="Säsongen har inte börjat — kom tillbaka efter första match."
        />
      </>
    );
  }

  const hasResult = m.meta.ourScore != null && m.meta.theirScore != null;

  return (
    <>
      <PageHero
        eyebrow="Match · Förra"
        title={hasResult ? `${m.meta.opponent} · ${resultText(m.meta)}` : m.meta.opponent}
        description={m.summary}
      />

      <div className="container pb-section space-y-12">
        {/* Match-meta + summering */}
        <SectionReveal as="section" className="bg-card rounded-lg p-6 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Datum
              </div>
              <div className="font-semibold">{formatMatchDate(m.meta.date)}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Plats
              </div>
              <div className="font-semibold">
                {homeAwayLabel(m.meta)} · {m.meta.venue}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Tävling
              </div>
              <div className="font-semibold">{m.meta.competition}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Resultat
              </div>
              <div className="text-2xl font-bold tracking-tight tabular text-foreground">
                {hasResult ? resultText(m.meta) : (
                  <span className="text-base italic text-muted-foreground">Ej rapporterat</span>
                )}
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Trupp */}
        <SectionReveal as="section">
          <div className="mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent">
              Trupp · matchen
            </span>
            <h2 className="text-2xl md:text-3xl mt-2 leading-tight">
              Vilka spelade
            </h2>
          </div>
          {m.truppen.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm">
              {m.truppen.map((p, i) => (
                <li
                  key={i}
                  className="bg-card/60 border border-border rounded-md px-4 py-2"
                >
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder>
              Truppen fylls i av tränaren — startelva och avbytare som spelade.
            </Placeholder>
          )}
          {m.ejTillgangliga.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Ej tillgängliga
              </div>
              <p className="text-sm">{m.ejTillgangliga.join(" · ")}</p>
            </div>
          )}
        </SectionReveal>

        {/* Reflektionsblock */}
        {m.blocks.map((b) => (
          <SectionReveal key={b.badge} as="section">
            <div className="mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent">
                {b.badge}
              </span>
              <h2 className="text-3xl md:text-4xl mt-3 leading-tight">
                {b.title}
              </h2>
            </div>
            {b.bullets.length > 0 ? (
              <ul className="space-y-2 text-sm md:text-base text-foreground/90 leading-relaxed">
                {b.bullets.map((x, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent mt-1.5 select-none">•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder>Fylls i av tränaren.</Placeholder>
            )}
          </SectionReveal>
        ))}

        {/* Lärdomar */}
        <SectionReveal as="section" className="border-t border-border pt-10">
          <div className="mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent">
              Lärdom
            </span>
            <h2 className="text-2xl md:text-3xl mt-2 leading-tight">
              Det här tar vi med till nästa match
            </h2>
          </div>
          {m.larDomar.length > 0 ? (
            <ol className="space-y-3 text-sm md:text-base text-foreground/90 leading-relaxed">
              {m.larDomar.map((x, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono font-black text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Placeholder>Fylls i av tränaren.</Placeholder>
          )}
        </SectionReveal>
      </div>
    </>
  );
};

export default MatchForra;
