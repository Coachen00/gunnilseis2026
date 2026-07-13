import { useLocation } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

interface RouteMetaEntry {
  title: string;
  description: string;
  /** Defaults to true on protected routes — sätter <meta name="robots" content="noindex">. */
  noindex?: boolean;
}

const SUFFIX = " · Gunnilse IS";

const PUBLIC_META: Record<string, RouteMetaEntry> = {
  "/": {
    title: "Gunnilse IS · Spelmodell 2026",
    description:
      "Gunnilse IS spelmodell 2026 — vår identitet på planen, de fyra skedena, fasta situationer, roller och matchplaner.",
    noindex: false,
  },
  "/login": {
    title: "Logga in" + SUFFIX,
    description: "Logga in för att se laget Gunnilse IS spelmodell, matchplaner och träningsmaterial.",
    noindex: true,
  },
};

// Skyddade rutter — strukturen och titeln är beskrivande men robots=noindex,
// så Google inte indexerar interna pages som ändå kräver login.
const PROTECTED_META: Record<string, RouteMetaEntry> = {
  "/period/1": { title: "Period 1" + SUFFIX, description: "Period 1 — fokus och arbete för säsongens första del.", noindex: true },
  "/maj-2026": { title: "Maj 2026 · Spelmodell" + SUFFIX, description: "Maj 2026 — block och principer i Gunnilse IS spelmodell.", noindex: true },
  "/spelide": { title: "Spelidé" + SUFFIX, description: "Vår spelidé — hur Gunnilse IS vill spela.", noindex: true },
  "/forsvar": { title: "Försvar" + SUFFIX, description: "Försvarsspel — så återerövrar vi bollen.", noindex: true },
  "/anfall": { title: "Anfall" + SUFFIX, description: "Anfallsspel — så bygger vi upp och avgör.", noindex: true },
  "/omstallning-forsvar": { title: "Omställning · försvar" + SUFFIX, description: "Omställning från anfall till försvar.", noindex: true },
  "/omstallning-anfall": { title: "Omställning · anfall" + SUFFIX, description: "Omställning från försvar till anfall.", noindex: true },
  "/fasta": { title: "Fasta situationer" + SUFFIX, description: "Fasta situationer — våra rutiner offensivt och defensivt.", noindex: true },
  "/fasta/forsvar": { title: "Fasta · försvar" + SUFFIX, description: "Försvar mot fasta situationer.", noindex: true },
  "/fasta/anfall": { title: "Fasta · anfall" + SUFFIX, description: "Anfall vid fasta situationer.", noindex: true },
  "/match/forra": { title: "Förra matchen" + SUFFIX, description: "Förra matchens reflektioner och nyckeltal.", noindex: true },
  "/match/kommande": { title: "Kommande match" + SUFFIX, description: "Förberedelse inför kommande match.", noindex: true },
  "/match/reflektioner": { title: "Matchreflektioner" + SUFFIX, description: "Reflektioner och lärdomar från matcher.", noindex: true },
  "/match/matcher": { title: "Matcher" + SUFFIX, description: "Alla matcher — översikt och resultat.", noindex: true },
  "/truppen": { title: "Truppen" + SUFFIX, description: "Truppöversikt för Gunnilse IS.", noindex: true },
  "/roller": { title: "Roller" + SUFFIX, description: "Roller — beskrivningar och nyckelbeteenden.", noindex: true },
  "/identitet": { title: "Identitet" + SUFFIX, description: "Lagets identitet och kärnvärden.", noindex: true },
  "/spelmodell-labb": { title: "Spelmodell-labb" + SUFFIX, description: "Spelmodell-labb — experimentyta.", noindex: true },
  "/verktyg": { title: "Verktyg" + SUFFIX, description: "Verktyg för lagledning, matchblad och taktik.", noindex: true },
  "/traningsplan": { title: "Träningsplan" + SUFFIX, description: "Träningsplan — print-vänlig vy.", noindex: true },
  "/matchblad": { title: "Matchblad" + SUFFIX, description: "Matchblad — print-vänlig vy.", noindex: true },
  "/motstandaranalys": { title: "Motståndaranalys" + SUFFIX, description: "Motståndaranalys — print-vänlig vy.", noindex: true },
  "/taktiktavla": { title: "Taktiktavla" + SUFFIX, description: "Taktiktavla — interaktivt verktyg.", noindex: true },
  "/admin": { title: "Admin" + SUFFIX, description: "Admin — innehållshantering.", noindex: true },
};

function lookup(pathname: string): RouteMetaEntry {
  if (PUBLIC_META[pathname]) return PUBLIC_META[pathname];
  if (PROTECTED_META[pathname]) return PROTECTED_META[pathname];
  // Identitet med slug — basmeta + slug i title.
  if (pathname.startsWith("/identitet/")) {
    const slug = pathname.split("/")[2] ?? "";
    return {
      title: (slug ? `${slug} · Identitet` : "Identitet") + SUFFIX,
      description: "Lagets identitet och kärnvärden.",
      noindex: true,
    };
  }
  // 404 / okänd route.
  return {
    title: "Sidan hittades inte" + SUFFIX,
    description: "Sidan finns inte längre eller har flyttats.",
    noindex: true,
  };
}

/**
 * Sätter <title>, description, canonical, OG/Twitter och robots-noindex
 * baserat på aktuell route. Renderar inget — använder bara en effect.
 *
 * Renderas globalt i App så att meta uppdateras på varje navigation,
 * även när enskilda sidor inte explicit kallar usePageMeta.
 */
export function RouteMeta() {
  const { pathname } = useLocation();
  const meta = lookup(pathname);
  usePageMeta({
    title: meta.title,
    description: meta.description,
    canonical: pathname,
    noindex: meta.noindex,
  });
  return null;
}
