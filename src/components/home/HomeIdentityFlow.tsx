import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import HomeCalendarBoard from "./HomeCalendarBoard";
import ScanningScene from "./ScanningScene";

type IdentityStep = {
  number: string;
  title: string;
  short: string;
  cue: string;
  action: string;
  team: string;
  next: string;
};

const IDENTITY_STEPS: IdentityStep[] = [
  {
    number: "01",
    title: "Scanning",
    short: "Se innan du får bollen.",
    cue: "Vad ser du innan nästa aktion?",
    action: "Titta över axeln. Hitta boll, motståndare, medspelare och fri yta innan mottagningen.",
    team: "Vi gör oss spelbara med information, kroppsvinkel och avstånd.",
    next: "När du ser hotet kan du ta rätt yta.",
  },
  {
    number: "02",
    title: "Ta yta",
    short: "Förstå hotet innan du flyttar dig.",
    cue: "Vilken yta hjälper laget mest nu?",
    action: "Ta yta med ett syfte: skapa tid, stäng hotet eller öppna nästa passning.",
    team: "Vi håller avstånd och vinklar som gör nästa beslut enkelt.",
    next: "När ytan är rätt kan passningen prata.",
  },
  {
    number: "03",
    title: "Prata med passningen",
    short: "Låt passningen säga vad som händer sen.",
    cue: "Vad vill du att mottagaren ska kunna göra?",
    action: "Passa med riktning, fart och fot. Spela så att nästa aktion blir möjlig.",
    team: "Vi använder passningen för att lugna, vända, spela framåt eller hota bakom.",
    next: "När passningen gör jobbet uppstår duellen på våra villkor.",
  },
  {
    number: "04",
    title: "Duellspel",
    short: "Vinn platsen när spelet blir trångt.",
    cue: "Vem äger den här ytan?",
    action: "Gå in beslutsamt. Kropp först, boll sen. Avsluta situationen med kontroll.",
    team: "När en går i duell säkrar nästa spelare och laget är redo på returen.",
    next: "Efter varje duell kommer nästa boll.",
  },
  {
    number: "05",
    title: "Andrabollar",
    short: "Var först där nästa boll landar.",
    cue: "Vad händer efter första duellen?",
    action: "Läs studsen tidigt, flytta innan bollen släpps och ta nästa aktion framåt.",
    team: "Vi samlar oss runt situationen och vinner nästa boll tillsammans.",
    next: "Sedan börjar vi om: se, förstå, prata, vinn.",
  },
];

function useSequence(steps: IdentityStep[]) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = current + 1;
        if (next >= steps.length) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const select = (next: number) => {
    setPlaying(false);
    setActive(Math.max(0, Math.min(next, steps.length - 1)));
  };

  return { active, playing, setPlaying, select };
}

function SequenceControls({
  active,
  playing,
  onPlay,
  onSelect,
}: {
  active: number;
  playing: boolean;
  onPlay: () => void;
  onSelect: (step: number) => void;
}) {
  return (
    <div className="home-identity-controls">
      <button
        type="button"
        className="home-identity-icon-button"
        aria-label="Föregående beteende"
        title="Föregående beteende"
        disabled={active === 0}
        onClick={() => onSelect(active - 1)}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="home-identity-play-button"
        aria-label={playing ? "Pausa femstegssekvensen" : "Spela femstegssekvensen"}
        onClick={onPlay}
      >
        {playing ? <Pause className="h-4 w-4" strokeWidth={2.2} /> : <Play className="h-4 w-4" strokeWidth={2.2} />}
        <span>{playing ? "Pausa" : "Spela sekvens"}</span>
      </button>
      <button
        type="button"
        className="home-identity-icon-button"
        aria-label="Nästa beteende"
        title="Nästa beteende"
        disabled={active === IDENTITY_STEPS.length - 1}
        onClick={() => onSelect(active + 1)}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="home-identity-icon-button"
        aria-label="Börja om femstegssekvensen"
        title="Börja om femstegssekvensen"
        onClick={() => onSelect(0)}
      >
        <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}

function IdentityStepRail({ active, onSelect }: { active: number; onSelect: (step: number) => void }) {
  return (
    <ol className="home-identity-rail" aria-label="Fem beteenden i ordning">
      {IDENTITY_STEPS.map((step, index) => (
        <li key={step.number}>
          <button
            type="button"
            className={`home-identity-rail-button ${active === index ? "is-active" : ""}`}
            aria-current={active === index ? "step" : undefined}
            onClick={() => onSelect(index)}
          >
            <span className="home-identity-rail-number">{step.number}</span>
            <span>
              <strong>{step.title}</strong>
              <small>{step.short}</small>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function HomeAccess({ isAuthed }: { isAuthed: boolean }) {
  const links = isAuthed
    ? [
        { label: "Öppna spelmodellen", to: "/spelmodell" },
        { label: "Se veckans träning", to: "/semestern-2026" },
        { label: "Gå till laget", to: "/laget" },
      ]
    : [{ label: "Logga in till laget", to: "/login" }];

  return (
    <section className="home-identity-access" aria-labelledby="home-access-title">
      <div>
        <p className="home-identity-kicker">Från ord till vardag</p>
        <h2 id="home-access-title">Välj nästa aktion.</h2>
        <p>Det vi ser, säger och gör på planen ska också vara lätt att hitta här.</p>
      </div>
      <nav aria-label="Nästa aktion" className="home-identity-access-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="home-identity-access-link">
            {link.label}
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        ))}
      </nav>
    </section>
  );
}

export default function HomeIdentityFlow() {
  const reduced = Boolean(useReducedMotion());
  const { isAuthed } = useAuthSession();
  const { active, playing, setPlaying, select } = useSequence(IDENTITY_STEPS);
  const step = IDENTITY_STEPS[active];

  return (
    <main className="home-identity">
      <section className="home-identity-hero" aria-labelledby="home-identity-title">
        <div className="home-identity-hero-inner">
          <div className="home-identity-hero-copy">
            <p className="home-identity-kicker">Gunnilse IS · 5 upphöjt i 5</p>
            <h1 id="home-identity-title">Se spelet före det händer.</h1>
            <p className="home-identity-hero-lead">
              Vår identitet börjar före bollen kommer. Vi är förberedda, ser hotet, hjälper nästa aktion och vinner det som händer efteråt.
            </p>
            <div className="home-identity-hero-actions">
              <a href="#identity-flow" className="home-identity-primary-link">
                Följ femstegsmodellen <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </a>
              <span className="home-identity-hero-note">Samma språk från träning till match.</span>
            </div>
          </div>

          <div className="home-identity-hero-planning" aria-label="Veckans planering">
            <HomeCalendarBoard />
          </div>
        </div>
        <a href="#identity-flow" className="home-identity-scroll-cue">Fem beteenden · gå vidare</a>
      </section>

      <section className="home-identity-scan-section" aria-labelledby="scan-title">
        <div className="home-identity-scan-inner">
          <div className="home-identity-scan-copy">
            <p className="home-identity-kicker">01 · Scanning</p>
            <h2 id="scan-title">Se innan du får bollen.</h2>
            <p>En bra scanning är inte en effekt. Det är en serie korta blickar som hittar hotet, den fria spelaren och ytan som öppnar sig.</p>
            <div className="home-identity-scan-legend" aria-label="Scanningens fyra steg">
              <span>Se</span>
              <span>Förstå</span>
              <span>Välj</span>
              <span>Spela</span>
            </div>
          </div>
          <div className="home-identity-scan-visual">
            <div className="home-identity-visual-head">
              <span>Synkon aktiv</span>
              <span>Hot → yta → passning</span>
            </div>
            <div className="home-identity-scene">
              <ScanningScene reduced={reduced} />
            </div>
          </div>
        </div>
      </section>

      <section id="identity-flow" className="home-identity-section home-identity-flow-section" aria-labelledby="identity-flow-title">
        <div className="home-identity-section-head">
          <p className="home-identity-kicker">Fem beteenden · ett sätt att spela</p>
          <h2 id="identity-flow-title">Allt går i linje.</h2>
          <p>Det ena beteendet gör det nästa möjligt. Därför tränar och pratar vi om dem som en kedja, inte som lösa ord.</p>
        </div>

        <div className="home-identity-flow-layout">
          <IdentityStepRail active={active} onSelect={select} />
          <div className="home-identity-stage" aria-live="polite">
            <AnimatePresence mode="wait" initial={!reduced}>
              <motion.div
                key={step.number}
                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="home-identity-stage-content"
              >
                <div className="home-identity-stage-topline">
                  <span>{step.number}</span>
                  <span>{step.cue}</span>
                </div>
                <h3>{step.title}</h3>
                <p className="home-identity-stage-action">{step.action}</p>
                <div className="home-identity-stage-grid">
                  <div>
                    <span>Spelaren</span>
                    <p>{step.action}</p>
                  </div>
                  <div>
                    <span>Laget</span>
                    <p>{step.team}</p>
                  </div>
                </div>
                <p className="home-identity-stage-next"><span>Nästa:</span> {step.next}</p>
              </motion.div>
            </AnimatePresence>
            <SequenceControls active={active} playing={playing} onPlay={() => setPlaying((value) => !value)} onSelect={select} />
          </div>
        </div>
      </section>

      <section className="home-identity-section home-identity-chain" aria-labelledby="chain-title">
        <div className="home-identity-section-head compact">
          <p className="home-identity-kicker">Så hänger spelet ihop</p>
          <h2 id="chain-title">Se. Förstå. Hjälp. Vinn. Var först.</h2>
        </div>
        <div className="home-identity-chain-list">
          {IDENTITY_STEPS.map((item, index) => (
            <button key={item.number} type="button" className={`home-identity-chain-item ${active === index ? "is-active" : ""}`} onClick={() => select(index)}>
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <small>{item.short}</small>
            </button>
          ))}
        </div>
      </section>

      <HomeAccess isAuthed={!isAuthed ? false : true} />

      <section className="home-identity-close" aria-label="Avslutande identitet">
        <p>Kom förberedd.</p>
        <h2>Gör nästa aktion enklare för laget.</h2>
      </section>
    </main>
  );
}
