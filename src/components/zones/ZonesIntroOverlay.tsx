/**
 * ZonesIntroOverlay — obligatorisk fullskärmsintro för inloggade på startsidan.
 *
 * Visar 30-sekverssekvensen "Planens spelytor" (PitchZonesAnimation) som en
 * mörk overlay ovanpå Hem. Beteende:
 *  - Visas en gång per webbläsarsession (sessionStorage) direkt efter inlogg.
 *  - Försvinner av sig själv när sekvensen spelat klart.
 *  - Diskret "Hoppa över"-knapp uppe till höger (låg opacity tills hover).
 *  - Escape stänger. Body-scroll låses medan den visas.
 *  - prefers-reduced-motion → statisk samlad slutbild utan autoplay.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import PitchZonesAnimation from "./PitchZonesAnimation";

export default function ZonesIntroOverlay({ onClose }: { onClose: () => void }) {
  const reduced = Boolean(useReducedMotion());
  const [leaving, setLeaving] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Mjuk utfasning innan unmount
  const dismiss = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onClose, 650);
  }, [onClose]);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    // Lås scroll medan intron visas
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [dismiss]);

  // Portal till <body>: PageTransition (framer-transform) skapar en stacking
  // context som annars fångar overlayn under TopNav (z-40, sticky på body-nivå).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Planens spelytor — taktisk introduktion"
      className="fixed inset-0 z-[80] bg-[#020a06] transition-opacity duration-700"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <PitchZonesAnimation
        autoPlay={!reduced}
        reduced={reduced}
        onComplete={dismiss}
        className="h-full w-full"
      />

      {/* Diskret hoppa över — nästan osynlig tills man letar efter den */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={dismiss}
        className="absolute right-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-black/40 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 opacity-50 backdrop-blur-sm transition hover:opacity-100 hover:text-white focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
      >
        Hoppa över
        <X className="h-3 w-3" />
      </button>
    </div>,
    document.body
  );
}
