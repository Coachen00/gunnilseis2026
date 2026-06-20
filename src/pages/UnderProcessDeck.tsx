import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Helskärms-vy för det interaktiva "Spelmodell Neon"-decket.
 *
 * Decket ligger som statisk asset i public/under-process/spelmodell-neon/ och
 * bäddas in via iframe. Owner-gateras klient-sida (samma grind som
 * tränarskapets system på /under-process) — icke-owners skickas tillbaka.
 * Filen i public/ är publik på GitHub Pages: detta gömmer WIP, det låser inte
 * filen. Vid behov av äkta lås → privat Storage-bucket med RLS.
 */
const DECK_SRC = "/under-process/spelmodell-neon/index.html";

const UnderProcessDeck = () => {
  const { session, loading } = useAuthSession();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black" role="status" aria-label="Verifierar coachåtkomst">
        <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
        <span className="sr-only">Verifierar coachåtkomst…</span>
      </div>
    );
  }

  if (!isOwnerEmail(session?.user?.email)) {
    return <Navigate to="/under-process" replace />;
  }

  return (
    <div className="fixed inset-0 bg-black">
      <Link
        to="/under-process"
        className="absolute left-4 top-4 z-10 flex items-center gap-2 border border-cyan-400/60 bg-black/70 px-3 py-2 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200 backdrop-blur transition-colors hover:bg-cyan-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
        Prisma 2026
      </Link>
      <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 border border-amber-400/50 bg-black/70 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-300 backdrop-blur">
        <Lock className="h-3.5 w-3.5" strokeWidth={2.4} />
        Endast coach · WIP
      </span>
      <iframe
        src={DECK_SRC}
        title="Spelmodell Neon — interaktivt deck"
        className="h-full w-full border-0"
        allow="fullscreen"
      />
    </div>
  );
};

export default UnderProcessDeck;
