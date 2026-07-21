import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import FasTrappa from "@/components/FasTrappa";
import AttackingPrincipleCard from "@/components/AttackingPrincipleCard";
import { PHASE_CUES } from "@/data/phaseCues";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";
import { MATCH_META } from "@/data/matchplan";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";

const ANFALL_CUES = PHASE_CUES.anfall;

// Veckans anfallsfokus — vilka principer betonar vi inför nästa motståndare.
// Hålls i synk med matchplan FOCUS-bullets så texten blir konsistent.
const WEEKS_FOCUS_PRINCIPLES = ["skydda-mot-kontring", "spela-in", "spela-ut", "fyll-pa-box"] as const;

const NAV_ITEMS = ATTACKING_PRINCIPLES.map((p) => ({
  num: String(p.order).padStart(2, "0"),
  title: p.headline,
  sub: p.coachrop[0].replace(/!$/, ""),
  href: `#${p.slug}`,
}));

/** Fem spelregler — samma rader som CuesBlock, ihopdragna med sina matchande cues. */
const MATCH_CUE_STEPS = ANFALL_CUES.rules.map((rule, i) => ({
  label: `Regel 0${i + 1}`,
  headline: rule,
  support: `${ANFALL_CUES.cues[i].trigger} → ${ANFALL_CUES.cues[i].action}`,
}));

const Anfall = () => {
  useScrollToHash();

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Spelmodell · Anfall"
        title={
          <>
            Anfallsspel.
            <br />
            Fem principer, en <span className="mark-lime">ordning</span>.
          </>
        }
        lead="Vi anfaller alltid i denna ordning: skydda mot kontring, spela in, spela ut, ta med framåt, fyll på i box."
        instruction="Läs uppifrån och ner. Faller en princip, kollapsar resten."
      >
        <KedjaNav items={NAV_ITEMS} />
      </KedjaHero>

      <div className="bg-kedja-paper py-16">
        <FasTrappa blockId="anfallsspel" />
      </div>

      <KedjaSection
        id="matchcues"
        tone="paper"
        eyebrow="Anfall · Match-cues"
        title="Fem principer, i den ordningen."
        definition={ANFALL_CUES.oneLiner}
        highlight="I den ordningen"
      >
        <KedjaSteps tone="paper" steps={MATCH_CUE_STEPS} />
        <KedjaClimax label="Vårt rop" text={ANFALL_CUES.oneLiner} />
      </KedjaSection>

      <KedjaSection
        id="principer"
        tone="white"
        eyebrow="Anfall · Sekvens"
        title="En sekvens, inte fem val."
        definition="Princip 1 är förutsättning för alla andra — utan balans bakom bollen riskerar varje framåtspelad bolltapp att kosta mål. Sedan flödar bollen: vi spelar in, vid trångt centralt spelar vi ut, när ytan öppnas tar vi den framåt, och i sista tredjedelen fyller vi på minst fyra spelare i och runt boxen."
        highlight="utan balans bakom bollen"
      >
        <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-kedja-green">
            Veckans anfallsfokus · {MATCH_META.opponent}
          </div>
          <p className="mb-4 text-[15px] leading-[1.55] text-kedja-deep">
            Vi övar och utvärderar dessa principer extra denna vecka — utifrån vad vi tar med från förra match.
          </p>
          <div className="flex flex-wrap gap-2">
            {WEEKS_FOCUS_PRINCIPLES.map((slug) => {
              const p = ATTACKING_PRINCIPLES.find((x) => x.slug === slug);
              if (!p) return null;
              return (
                <a
                  key={slug}
                  href={`#${slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-kedja-border bg-white px-3 py-1.5 transition-colors hover:border-kedja-green"
                >
                  <span className="text-xs font-black text-kedja-green">{String(p.order).padStart(2, "0")}</span>
                  <span className="text-xs font-bold text-kedja-ink">{p.headline}</span>
                </a>
              );
            })}
          </div>
        </div>

        <Link
          to="/anfall/spelvandningar"
          className="group mt-6 flex items-center justify-between gap-4 rounded-2xl border border-kedja-border bg-white p-5 text-left transition-colors hover:border-kedja-green"
        >
          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-kedja-green">
              Spelvändning · animation
            </div>
            <div className="text-[15px] font-bold text-kedja-ink">Central korridor till yttre yta</div>
          </div>
          <ArrowUpRight
            className="h-5 w-5 flex-shrink-0 text-kedja-green transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </Link>
      </KedjaSection>

      <KedjaSection
        id="plan-b"
        tone="paper"
        eyebrow="Anfall · Plan B"
        title="Plan B — när pressen låser."
        definition="Kort spel stängt: motståndaren pressar man-mot-man högt och målvakten saknar rättvänd mottagare. Då spelar vi riktat, inte i panik."
        highlight="riktat, inte i panik"
      >
        <div className="rounded-2xl border border-kedja-border bg-white p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
          <p>
            Riktad lång boll mot EN förbestämd sida/korridor — aldrig planlös uppspark. Target (9:an eller ytter)
            väljs per motståndare i matchplanen.
          </p>
          <p className="mt-4 font-bold text-kedja-ink">Struktur runt nedslaget — före bollen:</p>
          <ul className="mt-2 space-y-1.5">
            <li>8/10 + bollnära ytter tätt runt nedslagsplatsen</li>
            <li>6:an framför backlinjen för den långa andrabollen</li>
            <li>Backlinjen flyttar upp bakom</li>
          </ul>
          <p className="mt-4">
            Vinner vi andrabollen → spela direkt enligt principerna (In/Ut/Framåt). Förlorar vi den → omedelbar
            motpress.
          </p>
        </div>
        <KedjaClimax
          label="Identiteten"
          text="Plan B använder samma identitet — scanning, duellspel och andrabollsspel — utan att överge vår spelidé."
        />
      </KedjaSection>

      <KedjaQuote text="Vi gör inte mål med en man i boxen." highlight="mål" />

      <div className="bg-kedja-paper py-24">
        <div className="container space-y-10">
          {ATTACKING_PRINCIPLES.map((p) => (
            <AttackingPrincipleCard key={p.slug} principle={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Anfall;
