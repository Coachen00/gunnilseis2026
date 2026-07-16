import { useEffect, useState } from "react";
import "./HomePhotoCarousel.css";

const PHOTOS = [
  { file: "20260625_185002.webp", alt: "Gunnilse herr tränar på gräsplanen i kvällssol" },
  { file: "20260625_184936.webp", alt: "Spelare i Gunnilse herr under en träningsövning" },
  { file: "20260625_184943.webp", alt: "Boll och spelare på Gunnilse herrs träningsplan" },
  { file: "20260625_184945.webp", alt: "Gunnilse herr spelar fotboll på träningsplanen" },
  { file: "20260625_184959.webp", alt: "Gunnilse herr samlade på träningsplanen" },
  { file: "20260625_185007.webp", alt: "Gunnilse herr tränar tillsammans på gräsplanen" },
];

interface HomePhotoCarouselProps {
  compact?: boolean;
}

export default function HomePhotoCarousel({ compact = false }: HomePhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  return (
    <section
      className={`home-photo-carousel${compact ? " home-photo-carousel--compact" : ""}`}
      aria-label="Dagens viktigaste från Gunnilse herr"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="home-photo-carousel__slides" aria-live="polite">
        {PHOTOS.map((photo, index) => (
          <img
            key={photo.file}
            className={`home-photo-carousel__slide${index === activeIndex ? " is-active" : ""}`}
            src={`/home-gallery/${photo.file}`}
            alt={photo.alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <div className="home-photo-carousel__veil" aria-hidden="true" />
      <div className="home-photo-carousel__caption">
        <span className="home-photo-carousel__eyebrow">Gunnilse herr · 2026</span>
        <strong>Dagens viktigaste</strong>
        <span>Vi bygger tillsammans.</span>
      </div>
      <div className="home-photo-carousel__controls" aria-label="Välj bild">
        {PHOTOS.map((photo, index) => (
          <button
            key={photo.file}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Visa bild ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
