import { Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { getForraMatch, type ForraMatch } from "@/data/forraMatch";
import { MATCH_META } from "@/data/matchplan";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import HomePhotoCarousel from "@/components/home/HomePhotoCarousel";
import MatchRadar from "@/components/home/MatchRadar";

const WORLDS = [
  { num: "01", title: "Match", sub: "Kommande & resultat", href: "/match/kommande" },
  { num: "02", title: "Spelmodell", sub: "Fyra skeden, en story", href: "/spelmodell" },
  { num: "03", title: "Laget", sub: "Trupp, vård, tävlingar", href: "/laget" },
  { num: "04", title: "Coach", sub: "Prisma, planer, taktiktavla", href: "/coach" },
];

function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long" }).format(d);
}

function VidareLank({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-kedja-green transition-colors hover:text-kedja-ink"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
    </Link>
  );
}

function MatchResultCard({ forra }: { forra: ForraMatch }) {
  const { meta } = forra;
  const isHome = meta.homeAway === "home";
  const outcome =
    meta.ourScore! > meta.theirScore! ? "Vinst" : meta.ourScore! < meta.theirScore! ? "Förlust" : "Oavgjort";
  const left = isHome ? "Gunnilse IS" : meta.opponent;
  const right = isHome ? meta.opponent : "Gunnilse IS";
  const leftScore = isHome ? meta.ourScore : meta.theirScore;
  const rightScore = isHome ? meta.theirScore : meta.ourScore;
  const dateLabel = formatMatchDate(meta.date);

  return (
    <div className="rounded-2xl border-[1.5px] border-kedja-border bg-white px-7 py-6 text-center">
      <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">
        Senaste matchen · {outcome}
      </p>
      <div className="flex items-center justify-center gap-4 text-2xl font-black tracking-tight text-kedja-ink sm:text-3xl">
        <span>{left}</span>
        <span className="text-kedja-green">
          {leftScore}–{rightScore}
        </span>
        <span>{right}</span>
      </div>
      <p className="mt-3 text-[15px] text-kedja-deep">
        {isHome ? "Hemma" : "Borta"} · {meta.venue}
        {dateLabel ? ` · ${dateLabel}` : ""}
      </p>
    </div>
  );
}

const Hem = () => {
  const { isAuthed, loading } = useAuthSession();
  const authed = !loading && isAuthed;

  const forra = getForraMatch();
  const hasResult = Boolean(forra && forra.meta.ourScore != null && forra.meta.theirScore != null);

  return (
    <div className="bg-kedja-paper">
      <HomePhotoCarousel compact />
      <KedjaHero
        eyebrow="Gunnilse IS · Spelmodell 2026"
        title={
          <>
            Ett lag.
            <br />
            En <em className="mark-lime not-italic">idé</em>.
          </>
        }
        lead="Gunnilse IS Division 4A Herrar — vår spelmodell, vår taktik och våra matcher, samlade på ett ställe. Logga in för att se veckans matchplan, kallad trupp och hela säsongens material."
        instruction="Läs uppifrån och ner, eller hoppa direkt dit du vill."
      >
        <KedjaNav items={WORLDS} />
      </KedjaHero>

      <KedjaSection
        id="storyn"
        tone="white"
        eyebrow="Kategori 00 · Storyn"
        title="Var förberedd"
        definition="Berättelsen bakom spelmodellen: vad jag vill bygga, vad jag förstår och vad jag riskerar att missa."
        highlight="vad jag riskerar att missa"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <article className="border border-kedja-border bg-kedja-paper p-5">
            <h3 className="text-lg font-black tracking-tight text-kedja-ink">Det jag vill göra</h3>
            <p className="mt-2 text-sm leading-relaxed text-kedja-deep/80">Bygga en modell som gör det lättare att förstå matchen, välja vad som är viktigast och agera tillsammans.</p>
          </article>
          <article className="border border-kedja-border bg-kedja-paper p-5">
            <h3 className="text-lg font-black tracking-tight text-kedja-ink">Det jag förstår</h3>
            <p className="mt-2 text-sm leading-relaxed text-kedja-deep/80">Standards, ledarskap, träningskultur och matchobservationer måste hänga ihop i samma kedja.</p>
          </article>
          <article className="border border-kedja-border bg-kedja-paper p-5">
            <h3 className="text-lg font-black tracking-tight text-kedja-ink">Det jag riskerar att missa</h3>
            <p className="mt-2 text-sm leading-relaxed text-kedja-deep/80">Fler ord och principer hjälper inte om spelaren inte vet vad den ska se och göra härnäst.</p>
          </article>
          <article className="border border-kedja-border bg-kedja-paper p-5">
            <h3 className="text-lg font-black tracking-tight text-kedja-ink">Kedjan</h3>
            <p className="mt-2 text-sm font-bold leading-relaxed text-kedja-deep/80">Standards → ledarskap → träningskultur → matchtillstånd → prioritering → beteende → lärande.</p>
          </article>
        </div>
        <VidareLank to="/spelmodell#storyn" label="Öppna hela Storyn" />
      </KedjaSection>

      <MatchRadar />

      <KedjaSection
        id="match"
        tone="paper"
        eyebrow="Kapitel 01"
        title="Match"
        definition="Resultat är alltid öppna. Matchplan, kallelse och trupp låses upp när du loggar in."
        highlight="Matchplan, kallelse och trupp"
      >
        <div className="flex flex-col items-center gap-8">
          {hasResult && forra && <MatchResultCard forra={forra} />}
          {authed ? (
            <Link to="/match/kommande" className="block w-full transition-opacity hover:opacity-90">
              <KedjaClimax
                connector={hasResult}
                label="Nästa match"
                text={`${MATCH_META.opponent} · ${MATCH_META.kickoff}`}
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-kedja-green transition-colors hover:text-kedja-ink"
            >
              <LogIn className="h-4 w-4" strokeWidth={2.3} aria-hidden="true" />
              Logga in för veckans matchplan
            </Link>
          )}
        </div>
      </KedjaSection>

      <KedjaSection
        id="spelmodell"
        tone="white"
        eyebrow="Kapitel 02"
        title="Spelmodell"
        definition="Fyra levande skeden beskriver hur vi agerar med och utan boll. Identiteten följer med överallt och fasta situationer ligger separat när bollen är död."
        highlight="ett lag och en idé"
      >
        <KedjaSteps
          tone="white"
          steps={[
            {
              label: "Utan boll",
              headline: "Försvar & omställning",
              support: "Samla först, lås ytorna och vinn duellen — vid bollvinst styr vi första passningen framåt direkt.",
            },
            {
              label: "Med boll",
              headline: "Anfall",
              support: "Spela in centralt, spela ut till fri kant, ta med framåt och fyll boxen vid inlägg.",
            },
            {
              label: "Alltid",
              headline: "Identitet & roller",
              support: "Fem beteenden i varje match, och en tydlig uppgift för varje spelare i varje skede.",
            },
          ]}
        />
        <KedjaClimax label="Vårt svar" text="Fyra skeden. Var förberedd." />
        <VidareLank to="/spelmodell" label="Hela spelmodellen" />
      </KedjaSection>

      <KedjaSection
        id="laget"
        tone="paper"
        eyebrow="Kapitel 03"
        title="Laget"
        definition="Truppen, hur vi tar hand om kroppen och vilka tävlingar vi siktar mot under 2026."
        highlight="tar hand om kroppen"
      >
        <KedjaSteps
          tone="paper"
          steps={[
            {
              label: "Trupp",
              headline: "Namn, nummer, position",
              support: "Hela truppen samlad på ett ställe, alltid uppdaterad.",
            },
            {
              label: "Vård",
              headline: "Spelarvård",
              support: "Skador, återhämtning och hur du tar hand om dig själv genom säsongen.",
            },
            {
              label: "Säsong",
              headline: "Tävlingar & scheman",
              support: "Serier, cuper och personliga träningsscheman när säsongen pausar.",
            },
          ]}
        />
        <KedjaClimax label="Laget" text="Alla har en uppgift." />
        <VidareLank to="/laget" label="Till laget" />
      </KedjaSection>

      <KedjaSection
        id="coach"
        tone="paper"
        eyebrow="Kapitel 04"
        title="Coach"
        definition="Prisma 2026, 5⁵ och coachmaterialet beskriver hur tankesystemet hänger ihop — för dig som leder laget."
        highlight="hela tankesystemet hänger ihop"
      >
        <KedjaSteps
          tone="paper"
          steps={[
            {
              label: "Se",
              headline: "Prisma 2026",
              support: "Hela tankesystemet i ett dokument — från idé till match.",
            },
            {
              label: "Minns",
              headline: "5⁵",
              support: "Minnesskelettet: fem gånger fem som håller ihop matchbilden.",
            },
            {
              label: "Bygg",
              headline: "Spelmodell-labb",
              support: "Testa och bygg veckans matchbild innan den möter verkligheten.",
            },
            {
              label: "Planera",
              headline: "Matchblad, taktiktavla och träningsplan",
              support: "Samla planering, bilder och fokuspunkter inför nästa prestation.",
            },
          ]}
        />
        <KedjaClimax label="För ledare" text="Ett system. Inte lösa lappar." />
        <VidareLank to="/coach" label="Till coach" />
      </KedjaSection>
    </div>
  );
};

export default Hem;
