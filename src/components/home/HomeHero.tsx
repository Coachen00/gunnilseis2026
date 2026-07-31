import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SEASON_MATCHES } from "@/data/season";
import { SQUAD } from "@/data/squad";
import "./HomeHero.css";

/* Bildrullningen på förstasidan. Lägg till en fil i public/home-gallery/ och en
   rad här — ordningen i listan är ordningen på sajten. */
const PHOTOS = [
  { file: "20260727_005.webp", alt: "Två Gunnilse-spelare på väg in i träningen, en ger tummen upp" },
  { file: "20260727_003.webp", alt: "Spelare blickar ut över träningen på Gunnilses gräsplan" },
  { file: "20260727_002.webp", alt: "Gunnilse herr samlas vid målen med bollar uppradade före träning" },
  { file: "20260727_001.webp", alt: "Gul träningskon märkt HERR i gräset med planen i bakgrunden" },
  { file: "20260727_004.webp", alt: "Spelare i Gunnilse-tröja följer träningen från sidlinjen" },
  { file: "20260625_185002.webp", alt: "Gunnilse herr tränar på gräsplanen i kvällssol" },
  { file: "20260625_184936.webp", alt: "Spelare i Gunnilse herr under en träningsövning" },
  { file: "20260625_184943.webp", alt: "Boll och spelare på Gunnilse herrs träningsplan" },
  { file: "20260625_184945.webp", alt: "Gunnilse herr spelar fotboll på träningsplanen" },
  { file: "20260625_184959.webp", alt: "Gunnilse herr samlade på träningsplanen" },
  { file: "20260625_185007.webp", alt: "Gunnilse herr tränar tillsammans på gräsplanen" },
];

const ROTATION_MS = 6000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function seasonStats() {
  const played = SEASON_MATCHES.filter((m) => m.ourScore != null);
  const goals = played.reduce((sum, m) => sum + (m.ourScore ?? 0), 0);
  return [
    { value: played.length, label: "Matcher spelade" },
    { value: goals, label: "Mål gjorda" },
    { value: SQUAD.length, label: "Spelare i truppen" },
  ];
}

interface HomeHeroProps {
  eyebrow: string;
  /** Dold h1-text — jätteordet är dekor och läses inte upp. */
  srTitle: string;
  lead: string;
  ctaLabel: string;
  ctaTo: string;
}

export default function HomeHero({ eyebrow, srTitle, lead, ctaLabel, ctaTo }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stats = useMemo(seasonStats, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % PHOTOS.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const nextIndex = (activeIndex + 1) % PHOTOS.length;

  return (
    <section
      className="home-hero"
      aria-label="Gunnilse IS Herr"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="home-hero__slides" aria-live="polite">
        {PHOTOS.map((photo, index) => (
          <img
            key={photo.file}
            className={`home-hero__slide${index === activeIndex ? " is-active" : ""}`}
            src={`/home-gallery/${photo.file}`}
            alt={index === activeIndex ? photo.alt : ""}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>

      <h1 className="home-hero__wordmark">
        <span aria-hidden="true">GUNNILSE</span>
        <span className="sr-only">{srTitle}</span>
      </h1>

      <div className="home-hero__veil" aria-hidden="true" />

      <div className="home-hero__content">
        <p className="home-hero__eyebrow">{eyebrow}</p>

        <dl className="home-hero__stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="home-hero__statValue">{stat.value}</dd>
              <p className="home-hero__statLabel" aria-hidden="true">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>

        <div className="home-hero__action">
          <Link to={ctaTo} className="home-hero__cta">
            <span>{ctaLabel}</span>
            <span className="home-hero__ctaIcon" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
            </span>
          </Link>
          <p className="home-hero__lead">{lead}</p>
        </div>
      </div>

      <button
        type="button"
        className="home-hero__next"
        onClick={() => setActiveIndex(nextIndex)}
        aria-label={`Nästa bild — visar just nu bild ${activeIndex + 1} av ${PHOTOS.length}`}
      >
        <img src={`/home-gallery/${PHOTOS[nextIndex].file}`} alt="" loading="lazy" decoding="async" />
        <span className="home-hero__nextMeta">
          <span className="home-hero__counter">
            {pad(activeIndex + 1)}/{pad(PHOTOS.length)}
          </span>
          <span className="home-hero__bars" aria-hidden="true">
            {PHOTOS.map((photo, index) => (
              <span key={photo.file} className={index === activeIndex ? "is-active" : ""} />
            ))}
          </span>
        </span>
      </button>
    </section>
  );
}
