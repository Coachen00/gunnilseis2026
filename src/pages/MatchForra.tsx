import PageHero from "@/components/PageHero";
import { FORRA_MATCH } from "@/data/forraMatch";

const homeAwayLabel = (m: typeof FORRA_MATCH.meta) =>
  m.homeAway === "home" ? "Hemma" : "Borta";

const dateLabel = (iso: string) => {
  const d = new Date(iso);
  const days = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} · ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm italic text-muted-foreground">{children}</p>
);

const MatchForra = () => {
  const m = FORRA_MATCH;

  return (
    <>
      <PageHero
        eyebrow="Match · Förra"
        title={`${m.meta.opponent} · ${m.meta.ourScore}–${m.meta.theirScore}`}
        description={m.summary}
      />

      <div className="container pb-24 space-y-12">
        {/* Match-meta + summering */}
        <section className="bg-card/85 rounded-lg p-6 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Datum
              </div>
              <div className="font-semibold">{dateLabel(m.meta.date)}</div>
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
              <div className="font-black text-lg">
                {m.meta.ourScore}–{m.meta.theirScore}
              </div>
            </div>
          </div>
        </section>

        {/* Trupp */}
        <section>
          <div className="mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent">
              Trupp · matchen
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
              Vilka spelade
            </h2>
          </div>
          {m.truppen.length > 0 ? (
            <ul className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3 text-sm">
              {m.truppen.map((p, i) => (
                <li
                  key={i}
                  className="bg-card/60 border border-border rounded-md px-3 py-1.5"
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
        </section>

        {/* Reflektionsblock */}
        {m.blocks.map((b) => (
          <section key={b.badge}>
            <div className="mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent">
                {b.badge}
              </span>
              <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
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
          </section>
        ))}

        {/* Lärdomar */}
        <section className="border-t border-border pt-10">
          <div className="mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent">
              Lärdom
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
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
        </section>
      </div>
    </>
  );
};

export default MatchForra;
