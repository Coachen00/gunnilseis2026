import { lazy, Suspense, useState } from "react";
import MagicalPitchHero from "@/components/home/MagicalPitchHero";
import LastMatchResult from "@/components/home/LastMatchResult";
import NextActionsStrip from "@/components/home/NextActionsStrip";
import HomeWorlds from "@/components/home/HomeWorlds";
import { useAuthSession } from "@/hooks/useAuthSession";
import { ZONES_INTRO_SEEN_KEY } from "@/components/zones/ZonesIntroOverlay";

// Lazy: gäster och återbesök i samma session ska aldrig betala för chunken.
const ZonesIntroOverlay = lazy(() => import("@/components/zones/ZonesIntroOverlay"));

/**
 * Obligatorisk taktisk intro ("Planens spelytor") för inloggade — visas en
 * gång per webbläsarsession, försvinner när den spelat klart eller via den
 * diskreta hoppa över-knappen.
 */
function ZonesIntroGate() {
  const { isAuthed, loading } = useAuthSession();
  const [seen, setSeen] = useState(
    () => typeof window === "undefined" || window.sessionStorage.getItem(ZONES_INTRO_SEEN_KEY) === "1"
  );

  if (loading || !isAuthed || seen) return null;

  return (
    <Suspense fallback={null}>
      <ZonesIntroOverlay
        onClose={() => {
          window.sessionStorage.setItem(ZONES_INTRO_SEEN_KEY, "1");
          setSeen(true);
        }}
      />
    </Suspense>
  );
}

const Hem = () => (
  <>
    <ZonesIntroGate />
    <MagicalPitchHero />
    <LastMatchResult />
    <NextActionsStrip />
    <HomeWorlds />
  </>
);

export default Hem;
