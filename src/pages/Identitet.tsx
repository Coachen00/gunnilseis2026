import { Navigate, useParams } from "react-router-dom";
import { ImagePlus, Loader2 } from "lucide-react";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";
import { useGlobalMediaMatch } from "@/hooks/useGlobalMediaMatch";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";
import KedjaMedia from "@/components/kedja/KedjaMedia";

/** Gamla slugs → nya. Tom sträng = sidans topp (ingen matchande sektion kvar). */
const OLD_SLUG_REDIRECTS: Record<string, string> = {
  dueller: "duellspel",
  djupled: "",
  felvant: "",
  kommunicera: "",
};

const Identitet = () => {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) {
    const target = IDENTITY.some((i) => i.slug === slug) ? slug : OLD_SLUG_REDIRECTS[slug] ?? "";
    return <Navigate to={target ? `/identitet#${target}` : "/identitet"} replace />;
  }

  return <IdentityOverview />;
};

const IdentityOverview = () => {
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);
  const { matchId, loading, error } = useGlobalMediaMatch();
  useScrollToHash();

  const navItems = identity.map((item, index) => ({
    num: String(index + 1).padStart(2, "0"),
    title: item.title,
    sub: item.navShort,
    href: `#${item.slug}`,
  }));

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Spelet · Identitet"
        title={
          <>
            Fem beteenden.
            <br />
            En <span className="mark-lime">kedja</span>.
          </>
        }
        lead="Det börjar med blicken och slutar med bollen hos oss. Varje beteende leder till nästa — samma ord från målvakten till anfallaren, i varje träning, varje match."
        instruction="Läs uppifrån och ner. Ett steg i taget."
      >
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-md border border-kedja-border bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-kedja-green">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {loading ? "Kopplar media" : error ? "Media offline" : "Media autosparas"}
          </span>
          <KedjaNav items={navItems} />
        </div>
      </KedjaHero>

      {identity.map((item, index) => {
        const tone = index % 2 === 0 ? "paper" : "white";
        return (
          <div key={item.slug}>
            <KedjaSection
              id={item.slug}
              tone={tone}
              eyebrow={`Identitet ${String(index + 1).padStart(2, "0")}`}
              title={item.title}
              definition={item.definition}
              highlight={item.highlight}
            >
              <KedjaSteps steps={item.steps} tone={tone} />
              <KedjaClimax label="Vårt rop" text={item.rop} />
              <KedjaMedia
                label="Definition · Egen bild eller karta"
                matchId={matchId}
                slotKey={`identitet:${item.slug}:definition`}
                title="Bild eller film"
                description={item.title}
                captionPlaceholder="Skriv bildförklaring här..."
              />
            </KedjaSection>
            {index === 2 && (
              <KedjaQuote text="Identiteten är inte ett dokument. Den är ett beteende." highlight="beteende" />
            )}
          </div>
        );
      })}

      <footer className="bg-kedja-deep">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-[13px] font-bold text-kedja-mint">Gunnilse IS · Spelmodell 2026</span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-kedja-mint/60">
            {identity.map((item) => item.title).join(" · ")}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Identitet;
