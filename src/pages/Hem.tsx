import { Link } from "react-router-dom";
import { ArrowRight, LogIn, Shield, UserPlus } from "lucide-react";

const Hem = () => {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/82 to-background" />

      <div className="container relative flex min-h-[88vh] flex-col justify-center py-20">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gunnilse-gold">
            <Shield className="h-5 w-5" strokeWidth={1.5} />
            Gunnilse IS · Angereds lag
          </div>

          <h1 className="text-4xl font-black leading-[1.05] tracking-normal text-foreground md:text-5xl lg:text-6xl">
            Gunnilse IS är inte bara en fotbollsförening.
          </h1>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
            <p>
              Gunnilse IS är områdets lag. En förening född 1950, byggd av människor med
              fotbollen som gemensam kraft och med Angered som hemmaplan.
            </p>
            <p>
              Klubben har redan visat vad som är möjligt: herrlaget hade sin starkaste period
              under 1990-talet, vann division 2 1989, spelade i division 1 1990–2000 och
              nådde Superettan år 2000. 1997 var Allsvenskan nära när Gunnilse slutade trea —
              fortfarande en av klubbens största historiska meriter.
            </p>
            <p className="font-semibold text-foreground">
              Det gör Gunnilse speciellt. Vi behöver inte uppfinna en dröm från ingenting.
              Vi ska väcka en kraft som redan har funnits.
            </p>
            <p>
              Angered är dessutom inte ett litet upptagningsområde. Området planerades en
              gång för över 100 000 invånare och bär fortfarande känslan av en egen stad i
              staden: Hjällbo, Hammarkullen, Gårdsten, Lövgärdet, Rannebergen och Gunnilse
              med omnejd. Här finns barn, ungdomar, familjer, ledare, förebilder och
              framtida spelare.
            </p>
            <p className="font-semibold text-foreground">
              Vår uppgift är tydlig: Gunnilse IS ska bli den naturliga samlingspunkten för
              Angereds fotboll. En förening som bygger stolthet, disciplin, utveckling och
              gemenskap. Ett lag som området känner igen sig i. Ett lag som visar att
              Angered inte bara har potential.{" "}
              <span className="text-accent">Angered har kraft.</span>
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-black text-accent-foreground transition hover:bg-accent/90"
            >
              <LogIn className="h-4 w-4" />
              Logga in
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login?mode=signup"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background/45 px-5 text-sm font-bold text-foreground transition hover:border-accent/45"
            >
              <UserPlus className="h-4 w-4" />
              Begär tillgång
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hem;
