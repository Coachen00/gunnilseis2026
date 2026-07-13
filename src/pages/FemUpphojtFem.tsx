import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import SegmentNav, { type SegmentItem } from "@/components/SegmentNav";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";

const segments: SegmentItem[] = [
  { id: "oversikt", label: "Översikt" },
  { id: "femmor", label: "Femmorna" },
  { id: "anvandning", label: "Användning" },
];

const femmor = [
  { number: "01", title: "5 korridorer", text: "Yttre vänster · Inre vänster · Central · Inre höger · Yttre höger", to: "/spelmodell/planens-ytor" },
  { number: "02", title: "5 identitetsord", text: "Dueller · Andrabollsspel · Ta ytan · Prata med passningen · Scanning", to: "/identitet" },
  { number: "03", title: "5 anfallsprinciper", text: "Skydda · Spela in · Spela ut · Framåt · Fyll boxen", to: "/anfall" },
  { number: "04", title: "5 förberedelsesteg", text: "Analysera · Samla info · Tolka · Besluta · Agera", to: "/under-process" },
  { number: "05", title: "5 lager per skede", text: "Riktning · Princip · Subprincip · Koncept · Arbetssätt", to: "/spelmodell" },
];

function Locked() {
  return (
    <div className="container pb-section">
      <div className="rounded-md border border-dashed border-border bg-card p-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Låst coachmaterial</p>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">5⁵ visas bara för behörigt coachkonto.</p>
      </div>
    </div>
  );
}

const FemUpphojtFem = () => {
  const { session, loading } = useAuthSession();
  const isOwner = isOwnerEmail(session?.user?.email);

  return (
    <>
      <PageHero
        eyebrow="Coach · Ramverk"
        title="5⁵ — minnesskelettet"
        description="Fem upphöjt till fem är ett minnesstöd för att hitta i modellen. Det är inte en extra spelmodell och inte en lista med nya principer."
      />

      {loading ? (
        <div className="container pb-section text-sm font-semibold text-muted-foreground">Verifierar coachåtkomst…</div>
      ) : !isOwner ? (
        <Locked />
      ) : (
        <main className="container pb-section">
          <SegmentNav items={segments} ariaLabel="På 5⁵-sidan" className="mb-8" />

          <SectionReveal>
            <section id="oversikt" className="scroll-mt-32 border border-border bg-card p-6 md:p-8">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Översikt</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">Ett sätt att hitta rätt nivå</h2>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-foreground/75">
                Börja alltid i riktningen. Gå sedan till identitet, skede, princip och arbetssätt. Om en idé inte hjälper nästa beslut ska den förenklas eller tas bort.
              </p>
            </section>
          </SectionReveal>

          <section id="femmor" className="mt-8 scroll-mt-32">
            <div className="mb-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/60">Femmorna</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground">Fem återkommande strukturer</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {femmor.map((item) => (
                <SectionReveal key={item.number}>
                  <article className="h-full border border-border bg-card p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs font-black tracking-[0.2em] text-muted-foreground">{item.number}</span>
                      <Link to={item.to} className="text-xs font-bold uppercase tracking-[0.12em] text-primary hover:underline">
                        Öppna källa →
                      </Link>
                    </div>
                    <h3 className="mt-6 text-xl font-black uppercase leading-tight text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/75">{item.text}</p>
                  </article>
                </SectionReveal>
              ))}
            </div>
          </section>

          <SectionReveal>
            <section id="anvandning" className="mt-8 scroll-mt-32 border border-border bg-card p-6 md:p-8">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">Användning</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">Så använder tränarteamet 5⁵</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="border border-border bg-background p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">1 · Hitta</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/75">Vilken femma hör frågan till?</p>
                </div>
                <div className="border border-border bg-background p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">2 · Välj</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/75">Vilken nivå behöver spelaren förstå?</p>
                </div>
                <div className="border border-border bg-background p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">3 · Gör</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/75">Vilket beteende ska synas i nästa träning?</p>
                </div>
              </div>
            </section>
          </SectionReveal>
        </main>
      )}
    </>
  );
};

export default FemUpphojtFem;
