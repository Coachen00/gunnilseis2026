import { Link } from "react-router-dom";
import KedjaHero from "@/components/kedja/KedjaHero";
import SectionReveal from "@/components/SectionReveal";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";
import CoachTacticsAnimation from "@/components/coach/CoachTacticsAnimation";

type Step = {
  number: string;
  title: string;
  purpose: string;
  action: string;
  deliverable: string;
  done: string;
  to?: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Avgränsa",
    purpose: "Välj ett problem som modellen ska lösa.",
    action: "Skriv vad laget ska göra annorlunda.",
    deliverable: "Prisma-brief: problem, målbild och gräns.",
    done: "Alla vet vad som ingår — och inte ingår.",
  },
  {
    number: "02",
    title: "Enas",
    purpose: "Skapa ett gemensamt ledarspråk.",
    action: "Välj få ord och koppla dem till beteenden.",
    deliverable: "Fem identitetsord och konkreta exempel.",
    done: "Tränarteamet använder samma ord.",
    to: "/identitet",
  },
  {
    number: "03",
    title: "Översätt",
    purpose: "Gör identiteten användbar i spelet.",
    action: "Placera beteendena i rätt skede och situation.",
    deliverable: "Spelprinciper med tydliga spelarhandlingar.",
    done: "Spelarna vet vad de ska försöka göra.",
    to: "/spelmodell",
  },
  {
    number: "04",
    title: "Träna",
    purpose: "Bygg övningar som kräver rätt beteende.",
    action: "Välj fokus, constraint, coachrop och stoppregel.",
    deliverable: "En träningsvecka med en tydlig mätpunkt.",
    done: "Beteendet syns i fart, kamp och beslut.",
    to: "/coach/traningsplanering-host-2026",
  },
  {
    number: "05",
    title: "Förbered",
    purpose: "Koppla modellen till nästa match.",
    action: "Välj tre matchnycklar och första aktionen.",
    deliverable: "Kort matchplan och spelarbrief.",
    done: "Spelarna kan återberätta planen på en minut.",
    to: "/match/kommande",
  },
  {
    number: "06",
    title: "Lär",
    purpose: "Använd bevisen för nästa beslut.",
    action: "Se vad som fungerade och ändra en sak.",
    deliverable: "Matchbevis och nästa träningsfokus.",
    done: "Analysen leder till ett konkret beslut.",
    to: "/spelmodell-labb",
  },
];

function Locked() {
  return (
    <div className="container pb-section">
      <div className="rounded-md border border-dashed border-kedja-border bg-white p-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Låst coachmaterial</p>
        <p className="mt-2 text-sm font-semibold text-kedja-deep/70">Prisma visas bara för behörigt coachkonto.</p>
      </div>
    </div>
  );
}

const UnderProcess = () => {
  const { session, loading } = useAuthSession();
  const isOwner = isOwnerEmail(session?.user?.email);

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Coach · Prisma 2026"
        title="Från idé till matchbevis"
        lead="Prisma är arbetsprocessen för tränarteamet. Det beskriver hur vi bygger, tränar, testar och justerar — inte ännu en spelmodell."
      />

      {loading ? (
        <div className="container pb-section text-sm font-semibold text-kedja-deep/70">Verifierar coachåtkomst…</div>
      ) : !isOwner ? (
        <Locked />
      ) : (
        <main className="container pb-section">
          <CoachTacticsAnimation variant="prisma" />
          <div className="mb-8 grid gap-3 border border-kedja-border bg-white p-5 md:grid-cols-3 md:p-7">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Riktning</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-deep">Var förberedd.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">Arbetsregel</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-deep">Ett fokus i taget.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Kriterium</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-deep">Gå vidare när beteendet syns.</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step) => (
              <SectionReveal key={step.number}>
                <article className="h-full border border-kedja-border bg-white p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs font-black tracking-[0.2em] text-kedja-deep/60">{step.number}</span>
                    {step.to && (
                      <Link to={step.to} className="text-xs font-bold uppercase tracking-[0.12em] text-kedja-green hover:underline">
                        Fördjupa →
                      </Link>
                    )}
                  </div>
                  <h2 className="mt-5 text-2xl font-black tracking-tight text-kedja-ink">{step.title}</h2>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-kedja-deep">{step.purpose}</p>
                  <dl className="mt-6 grid gap-4 text-sm">
                    <div>
                      <dt className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-deep/60">Gör</dt>
                      <dd className="mt-1 font-semibold leading-relaxed text-kedja-deep/70">{step.action}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-deep/60">Leverans</dt>
                      <dd className="mt-1 font-semibold leading-relaxed text-kedja-deep/70">{step.deliverable}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-deep/60">Klart när</dt>
                      <dd className="mt-1 font-semibold leading-relaxed text-kedja-deep/70">{step.done}</dd>
                    </div>
                  </dl>
                </article>
              </SectionReveal>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default UnderProcess;
