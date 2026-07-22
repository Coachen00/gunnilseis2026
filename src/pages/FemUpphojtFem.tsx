import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import KedjaHero from "@/components/kedja/KedjaHero";
import SectionReveal from "@/components/SectionReveal";
import SegmentNav, { type SegmentItem } from "@/components/SegmentNav";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";
import CoachTacticsAnimation from "@/components/coach/CoachTacticsAnimation";

const segments: SegmentItem[] = [
  { id: "oversikt", label: "Översikt" },
  { id: "superprinciper", label: "Superprinciperna" },
  { id: "femmor", label: "Femmorna" },
  { id: "anvandning", label: "Användning" },
];

const superprinciper = [
  { title: "Nå gyllene zonen med övertal", skede: "Anfall + omställning anfall" },
  { title: "Skydda gyllene zonen", skede: "Försvar + omställning försvar" },
  { title: "Vinn duellen & andrabollen", skede: "Alla skeden, identitetens kärna" },
];

const femmor = [
  { number: "01", eyebrow: "Karta", title: "5 korridorer", summary: "Planens bredd gör det lättare att se var laget kan spela.", text: "Yttre vänster · Inre vänster · Central · Inre höger · Yttre höger", to: "/spelmodell/planens-ytor", action: "Se planens ytor" },
  { number: "02", eyebrow: "Beteende", title: "5 identitetsord", summary: "Våra gemensamma beteenden gör spelidén synlig i varje situation.", text: "Scanning · Ta ytan · Prata med passningen · Duellspel · Andrabollsspel", to: "/identitet", action: "Se identiteten" },
  { number: "03", eyebrow: "Sekvens", title: "5 anfallsprinciper", summary: "En ordning som hjälper oss att välja nästa handling med boll.", text: "Skydda · Spela in · Spela ut · Framåt · Fyll boxen", to: "/anfall", action: "Se anfallssekvensen" },
  { number: "04", eyebrow: "Arbetsgång", title: "5 förberedelsesteg", summary: "Från första analys till ett beslut som går att agera på.", text: "Analysera · Samla info · Tolka · Besluta · Agera", to: "/under-process/forberedelsesteg", action: "Följ arbetsgången" },
];

function Locked() {
  return (
    <div className="container pb-section">
      <div className="rounded-md border border-dashed border-kedja-border bg-white p-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Låst coachmaterial</p>
        <p className="mt-2 text-sm font-semibold text-kedja-deep/70">5⁵ visas bara för behörigt coachkonto.</p>
      </div>
    </div>
  );
}

const FemUpphojtFem = () => {
  const { session, loading } = useAuthSession();
  const isOwner = isOwnerEmail(session?.user?.email);

  return (
    <div className="bg-kedja-paper">
      <KedjaHero eyebrow="Coach · Ramverk" title="5⁵ — minnesskelettet" lead="Fem upphöjt till fem är ett minnesstöd för att hitta i modellen. Det är inte en extra spelmodell och inte en lista med nya principer." />
      {loading ? (
        <div className="container pb-section text-sm font-semibold text-kedja-deep/70">Verifierar coachåtkomst…</div>
      ) : !isOwner ? <Locked /> : (
        <main className="container pb-section">
          <CoachTacticsAnimation variant="femupphojt" />
          <SegmentNav items={segments} ariaLabel="På 5⁵-sidan" className="mb-8" />
          <SectionReveal>
            <section id="oversikt" className="scroll-mt-32 border border-kedja-border bg-white p-6 md:p-8">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Översikt</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-kedja-ink">Ett sätt att hitta rätt nivå</h2>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-kedja-deep">Börja alltid i riktningen. Gå sedan till identitet, skede, princip och arbetssätt. Om en idé inte hjälper nästa beslut ska den förenklas eller tas bort.</p>
            </section>
          </SectionReveal>
          <SectionReveal>
            <section id="superprinciper" className="mt-8 scroll-mt-32 border border-kedja-border bg-white p-6 md:p-8">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">Superprinciperna</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-kedja-ink">De tre över-reglerna</h2>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-kedja-deep">De tre över-reglerna som alla huvudprinciper tjänar — spelarens kortaste språk för hur vi spelar.</p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {superprinciper.map((item, i) => (
                  <div key={item.title} className="border border-kedja-border bg-kedja-paper p-4">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-deep/60">{i + 1} · {item.skede}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-deep">{item.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </SectionReveal>
          <section id="femmor" className="mt-8 scroll-mt-32">
            <div className="mb-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-deep/60">Femmorna</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-kedja-ink">Fyra återkommande strukturer</h2>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-kedja-deep/70">Varje kort börjar med en enkel förklaring. Öppna sedan det som är relevant och gå från överblick till konkreta beteenden.</p>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-kedja-deep/60">Den femte femman ("5 lager") ströks — mnemonik får aldrig trumfa sanning. Tre femmor är äkta, en är strukturell.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {femmor.map((item) => (
                <SectionReveal key={item.number}>
                  <Link to={item.to} className="group flex h-full flex-col border border-kedja-border bg-white p-5 transition-all hover:-translate-y-1 hover:border-kedja-ink hover:shadow-[8px_8px_0_0_rgba(7,102,83,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-6">
                    <div className="flex items-start justify-between gap-4"><span className="font-mono text-xs font-black tracking-[0.2em] text-kedja-deep/60">{item.number}</span><ArrowRight className="h-5 w-5 text-kedja-green transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
                    <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-kedja-green">{item.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-kedja-ink">{item.title}</h3>
                    <p className="mt-3 text-base font-semibold leading-relaxed text-kedja-deep">{item.summary}</p>
                    <p className="mt-6 border-t border-kedja-border pt-4 text-sm font-semibold leading-relaxed text-kedja-deep/70">{item.text}</p>
                    <span className="mt-auto pt-7 text-xs font-black uppercase tracking-[0.14em] text-kedja-green">{item.action} →</span>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </section>
          <SectionReveal>
            <section id="anvandning" className="mt-8 scroll-mt-32 border border-kedja-border bg-white p-6 md:p-8">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">Användning</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-kedja-ink">Så använder tränarteamet 5⁵</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {["Vilken femma hör frågan till?", "Vilken nivå behöver spelaren förstå?", "Vilket beteende ska synas i nästa träning?"].map((text, i) => <div key={text} className="border border-kedja-border bg-kedja-paper p-4"><p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-deep/60">{i + 1} · {['Hitta', 'Välj', 'Gör'][i]}</p><p className="mt-2 text-sm font-semibold leading-relaxed text-kedja-deep">{text}</p></div>)}
              </div>
              <div className="mt-8 flex items-start gap-3 border-t border-kedja-border pt-6 text-sm font-semibold text-kedja-deep"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-kedja-green" aria-hidden="true" /><p>Gå från översikt till detalj när du behöver ett gemensamt språk — och tillbaka till översikten när du behöver välja fokus.</p></div>
            </section>
          </SectionReveal>
        </main>
      )}
    </div>
  );
};

export default FemUpphojtFem;
