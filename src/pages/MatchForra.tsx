import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaSection from "@/components/kedja/KedjaSection";
import { getForraMatch, type ForraMatch } from "@/data/forraMatch";
import { formatMatchDate } from "@/lib/dateUtils";

const homeAwayLabel = (m: ForraMatch["meta"]) =>
  m.homeAway === "home" ? "Hemma" : "Borta";

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm italic text-kedja-deep/70">{children}</p>
);

const resultText = (m: ForraMatch["meta"]) => {
  if (m.ourScore == null || m.theirScore == null) return "—";
  return `${m.ourScore}–${m.theirScore}`;
};

const MetaField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-kedja-green">{label}</div>
    <div className="font-semibold text-kedja-ink">{children}</div>
  </div>
);

const MatchForra = () => {
  // Dynamiskt: hämtar senast spelade matchen från season.ts.
  // Auto-rullar vidare när nästa match är spelad utan kod-redigering.
  const m = getForraMatch();

  if (!m) {
    return (
      <div className="bg-kedja-paper">
        <KedjaHero
          eyebrow="Match · Förra"
          title="Ingen spelad match än"
          lead="Säsongen har inte börjat — kom tillbaka efter första match."
        />
      </div>
    );
  }

  const hasResult = m.meta.ourScore != null && m.meta.theirScore != null;

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Match · Förra"
        title={
          hasResult ? (
            <>
              {m.meta.opponent}
              <br />
              <span className="mark-lime">{resultText(m.meta)}</span>
            </>
          ) : (
            m.meta.opponent
          )
        }
        lead={m.summary}
      >
        <div className="grid grid-cols-2 gap-5 rounded-2xl border-[1.5px] border-kedja-border bg-white p-6">
          <MetaField label="Datum">{formatMatchDate(m.meta.date)}</MetaField>
          <MetaField label="Plats">
            {homeAwayLabel(m.meta)} · {m.meta.venue}
          </MetaField>
          <MetaField label="Tävling">{m.meta.competition}</MetaField>
          <MetaField label="Resultat">
            {hasResult ? (
              <span className="text-2xl font-black tracking-tight">{resultText(m.meta)}</span>
            ) : (
              <span className="text-sm italic text-kedja-deep/70">Ej rapporterat</span>
            )}
          </MetaField>
        </div>
      </KedjaHero>

      <KedjaSection
        id="truppen"
        tone="paper"
        eyebrow="Trupp · Matchen"
        title="Vilka spelade"
        definition=""
        highlight=""
      >
        {m.truppen.length > 0 ? (
          <ul className="grid gap-1.5 text-left text-sm sm:grid-cols-2 md:grid-cols-3">
            {m.truppen.map((p, i) => (
              <li key={i} className="rounded-md border border-kedja-border bg-white px-3 py-1.5 text-kedja-ink">
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder>Truppen fylls i av tränaren — startelva och avbytare som spelade.</Placeholder>
        )}
        {m.ejTillgangliga.length > 0 && (
          <div className="mt-5">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-kedja-green">
              Ej tillgängliga
            </div>
            <p className="text-sm text-kedja-deep">{m.ejTillgangliga.join(" · ")}</p>
          </div>
        )}
      </KedjaSection>

      {m.blocks.map((b, index) => (
        <KedjaSection
          key={b.badge}
          id={`block-${index + 1}`}
          tone={index % 2 === 0 ? "white" : "paper"}
          eyebrow={b.badge}
          title={b.title}
          definition=""
          highlight=""
        >
          {b.bullets.length > 0 ? (
            <ul className="mx-auto max-w-[560px] space-y-2 text-left text-[15px] leading-[1.55] text-kedja-deep">
              {b.bullets.map((x, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 select-none font-black text-kedja-green">•</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder>Fylls i av tränaren.</Placeholder>
          )}
        </KedjaSection>
      ))}

      <KedjaSection
        id="lardomar"
        tone={m.blocks.length % 2 === 0 ? "white" : "paper"}
        eyebrow="Lärdom"
        title="Det här tar vi med till nästa match"
        definition=""
        highlight=""
      >
        {m.larDomar.length > 0 ? (
          <ol className="mx-auto max-w-[560px] space-y-3 text-left text-[15px] leading-[1.55] text-kedja-deep">
            {m.larDomar.map((x, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-black text-kedja-green">{String(i + 1).padStart(2, "0")}</span>
                <span>{x}</span>
              </li>
            ))}
          </ol>
        ) : (
          <Placeholder>Fylls i av tränaren.</Placeholder>
        )}
      </KedjaSection>
    </div>
  );
};

export default MatchForra;
