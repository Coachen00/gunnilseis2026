import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Eye,
  Footprints,
  GitBranch,
  Layers,
  Library,
  Lock,
  type LucideIcon,
  MessageSquare,
  Send,
  ShieldCheck,
  Swords,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import SegmentNav, { type SegmentItem } from "@/components/SegmentNav";
import SystemMap, { type SystemMapColumn } from "@/components/SystemMap";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";

type Tone = "yellow" | "red" | "blue" | "green" | "violet";

const TONE_BG: Record<Tone, string> = {
  yellow: "bg-amber-50 border-amber-400/70",
  red: "bg-rose-50 border-rose-300/80",
  blue: "bg-sky-50 border-sky-300/80",
  green: "bg-emerald-50 border-emerald-300/80",
  violet: "bg-violet-50 border-violet-300/80",
};

const TONE_TEXT: Record<Tone, string> = {
  yellow: "text-amber-700",
  red: "text-rose-700",
  blue: "text-sky-700",
  green: "text-emerald-700",
  violet: "text-violet-700",
};

/* De fem femmorna — minnesskelett. 3 äkta, 2 strukturella. */
const femmor: { no: string; title: string; items: string; status: "äkta" | "strukturell"; tone: Tone }[] = [
  { no: "01", title: "5 korridorer", items: "Yttre v · Inre v · Central · Inre h · Yttre h", status: "äkta", tone: "green" },
  { no: "02", title: "5 identitetsord", items: "Dueller · Andrabollsspel · Ta ytan · Prata med passningen · Scanning", status: "äkta", tone: "yellow" },
  { no: "03", title: "5 anfallsprinciper", items: "Skydda · Spela in · Spela ut · Framåt · Fyll boxen", status: "äkta", tone: "blue" },
  { no: "04", title: "5 förberedelse-steg", items: "Analysera → Samla info → Tolka → Besluta → Agera", status: "strukturell", tone: "red" },
  { no: "05", title: "5 lager (per skede)", items: "Riktning · Princip · Sub-princip · Koncept · Arbetssätt", status: "strukturell", tone: "violet" },
];

/* Identiteten — de fem nya orden (vald av Joel 2026-06). */
const identitet: { title: string; command: string; g: string; icon: LucideIcon; tone: Tone }[] = [
  { title: "Dueller", command: "Förlorar aldrig kampen om bollen.", g: "Vinner ≥ 50 % av sina dueller, går aldrig undan.", icon: Swords, tone: "red" },
  { title: "Andrabollsspel", command: "Först på den fria bollen. Alltid.", g: "Först på minst hälften av andrabollarna i sitt område.", icon: Target, tone: "green" },
  { title: "Ta ytan", command: "Öppnar sig en yta — ta den.", g: "Attackerar öppen yta direkt när den syns.", icon: Footprints, tone: "yellow" },
  { title: "Prata med passningen", command: "Passningen är ditt budskap.", g: "Passar så mottagaren slipper tänka — rätt fot, rätt fart.", icon: Send, tone: "blue" },
  { title: "Scanning", command: "Se ytan innan du får bollen.", g: "Skannar ≥ 2 ggr före mottagning, vet sitt nästa drag.", icon: Eye, tone: "violet" },
];

/* Skeden — länkar till befintliga principsidor. */
const skeden: { no: string; title: string; one: string; to: string; tone: Tone }[] = [
  { no: "01", title: "Anfallsspel", one: "Skydda → in → ut → framåt → fyll boxen.", to: "/anfall", tone: "yellow" },
  { no: "02", title: "Försvarsspel", one: "Förhindra avslut i gyllene zonen — styr utåt.", to: "/forsvar", tone: "red" },
  { no: "03", title: "Omställning anfall", one: "Bollvinst → ta ytan, utnyttja obalansen.", to: "/omstallning-anfall", tone: "blue" },
  { no: "04", title: "Omställning försvar", one: "Bollförlust → motpress i 5 sekunder.", to: "/omstallning-forsvar", tone: "green" },
  { no: "05", title: "Fasta situationer", one: "Din plats. Din löpning. Ditt ansvar.", to: "/fasta", tone: "violet" },
];

/* Förberedelse — "upphöjt". */
const forberedelse: { no: string; step: string; text: string }[] = [
  { no: "01", step: "Analysera", text: "Läs matchbilden — formation, presshöjd, var ytan finns." },
  { no: "02", step: "Samla info", text: "Skanna över axeln innan bollen kommer — press, fri yta, nästa pass." },
  { no: "03", step: "Tolka", text: "Genom, utanför eller hem? Är rättvänd möjlig?" },
  { no: "04", step: "Besluta", text: "Ett beslut ur skedets principer — inte tre." },
  { no: "05", step: "Agera i rätt riktning", text: "Utför med fart och börja om — bollen rör sig hela tiden." },
];

/* Sticky internnav — samma ordning som sidans sektioner. */
const SEGMENTS: SegmentItem[] = [
  { id: "oversikt", label: "Översikt" },
  { id: "karta", label: "Karta" },
  { id: "skeden", label: "Skeden" },
  { id: "identitet", label: "Identitet" },
  { id: "forberedelse", label: "Förberedelse" },
  { id: "bibliotek", label: "Bibliotek" },
];

/* Systemkartan — taket vilar på tre pelare. Spelbar karta, inte akademi. */
const mapColumns: SystemMapColumn[] = [
  {
    heading: "Människan & kulturen",
    Icon: Users,
    rows: [
      { label: "Identitet", to: "/identitet" },
      { label: "Spelarvård", to: "/spelarvard" },
      { label: "Standard" },
    ],
  },
  {
    heading: "Spelet",
    Icon: Compass,
    rows: [
      { label: "Skeden", to: "/spelmodell" },
      { label: "Principer", to: "/anfall" },
      { label: "Koncept" },
    ],
  },
  {
    heading: "Ledarskapet",
    Icon: GitBranch,
    rows: [
      { label: "Kaskad", to: "/under-process" },
      { label: "Match → träning", to: "/verktyg" },
      { label: "Ledarkort" },
    ],
  },
];

/* Bibliotek — snabba ingångar till allt material 5⁵ pekar på. */
const bibliotek: { label: string; to: string }[] = [
  { label: "Anfall", to: "/anfall" },
  { label: "Försvar", to: "/forsvar" },
  { label: "Omställning anfall", to: "/omstallning-anfall" },
  { label: "Omställning försvar", to: "/omstallning-forsvar" },
  { label: "Fasta situationer", to: "/fasta" },
  { label: "Identitet", to: "/identitet" },
  { label: "Roller", to: "/roller" },
  { label: "Planens ytor", to: "/spelmodell/planens-ytor" },
  { label: "Prisma 2026", to: "/under-process" },
];

function Locked() {
  return (
    <div className="container pb-section">
      <div className="rounded-md border border-dashed border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-amber-400 bg-amber-50 text-amber-700">
            <Lock className="h-4 w-4" strokeWidth={2.3} />
          </span>
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Låst coachmaterial
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              5⁵ visas bara för leojsjoqvist-inloggningen.
            </p>
          </div>
        </div>
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
        eyebrow="Prisma 2026 · Tränarspår"
        title="5⁵ — Fem upphöjt till fem"
        description="Allt börjar med att komma förberedd. Var du än tittar i idén möter du fem — ett minnesskelett, inte exakt matematik."
      />

      {loading ? (
        <div className="container pb-section text-sm font-semibold text-muted-foreground">Verifierar coachåtkomst…</div>
      ) : !isOwner ? (
        <Locked />
      ) : (
        <>
          <SegmentNav items={SEGMENTS} ariaLabel="På 5⁵-sidan" className="mb-8" />

          {/* Översikt — de fem femmorna */}
          <section id="oversikt" className="container scroll-mt-32 pb-section">
            <SectionReveal>
              <div className="mb-5 flex items-center gap-2">
                <Layers className="h-4 w-4 text-foreground/70" strokeWidth={2.3} />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/70">
                  Översikt · de fem femmorna
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {femmor.map((f) => (
                  <article key={f.no} className="border border-border bg-card p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className={["grid h-9 w-9 place-items-center border font-mono text-[10px] font-black", TONE_BG[f.tone], TONE_TEXT[f.tone]].join(" ")}>
                        {f.no}
                      </span>
                      <span className={["border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_BG[f.tone], TONE_TEXT[f.tone]].join(" ")}>
                        {f.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black uppercase leading-tight text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/72">{f.items}</p>
                  </article>
                ))}
              </div>
            </SectionReveal>
          </section>

          {/* Karta — systemkartan */}
          <section id="karta" className="container scroll-mt-32 pb-section">
            <SectionReveal>
              <div className="mb-5 flex items-center gap-2">
                <Compass className="h-4 w-4 text-foreground/70" strokeWidth={2.3} />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/70">
                  Karta · taket vilar på tre pelare
                </h2>
              </div>
              <SystemMap
                capstone={{ label: "Var förberedd", sub: "Taket — allt börjar med att komma förberedd." }}
                columns={mapColumns}
              />
            </SectionReveal>
          </section>

          {/* Skeden */}
          <section id="skeden" className="container scroll-mt-32 pb-section">
            <SectionReveal>
              <div className="mb-5 flex items-center gap-2">
                <Swords className="h-4 w-4 text-foreground/70" strokeWidth={2.3} />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/70">
                  Skeden · 4-3-3
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {skeden.map((s) => (
                  <Link key={s.no} to={s.to} className="group border border-border bg-card p-5 transition-colors hover:bg-background">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className={["grid h-9 w-9 place-items-center border font-mono text-[10px] font-black", TONE_BG[s.tone], TONE_TEXT[s.tone]].join(" ")}>
                        {s.no}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.4} />
                    </div>
                    <h3 className="text-lg font-black uppercase leading-tight text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/72">{s.one}</p>
                  </Link>
                ))}
              </div>
            </SectionReveal>
          </section>

          {/* Identitet */}
          <section id="identitet" className="container scroll-mt-32 pb-section">
            <SectionReveal>
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-foreground/70" strokeWidth={2.3} />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/70">
                  Identitet · fem beteenden i varje match
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {identitet.map((id) => {
                  const Icon = id.icon;
                  return (
                    <article key={id.title} className="border border-border bg-card p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black uppercase leading-tight text-foreground">{id.title}</h3>
                        <Icon className={["h-5 w-5 flex-shrink-0", TONE_TEXT[id.tone]].join(" ")} strokeWidth={2.2} />
                      </div>
                      <p className={["text-sm font-black leading-snug", TONE_TEXT[id.tone]].join(" ")}>{id.command}</p>
                      <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-foreground/70">
                        <span className="font-mono font-black uppercase tracking-[0.18em] text-emerald-700">G:</span> {id.g}
                      </p>
                    </article>
                  );
                })}
              </div>
            </SectionReveal>
          </section>

          {/* Förberedelse */}
          <section id="forberedelse" className="container scroll-mt-32 pb-section">
            <SectionReveal>
              <div className="mb-5 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-foreground/70" strokeWidth={2.3} />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/70">
                  Förberedelse · &ldquo;upphöjt&rdquo;
                </h2>
              </div>
              <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
                {forberedelse.map((f) => (
                  <li key={f.no} className="border border-border bg-card p-4">
                    <span className="font-mono text-[10px] font-black text-amber-700">{f.no}</span>
                    <p className="mt-2 text-sm font-black uppercase leading-tight text-foreground">{f.step}</p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/70">{f.text}</p>
                  </li>
                ))}
              </ol>
            </SectionReveal>
          </section>

          {/* Bibliotek */}
          <section id="bibliotek" className="container scroll-mt-32 pb-section">
            <SectionReveal>
              <div className="mb-5 flex items-center gap-2">
                <Library className="h-4 w-4 text-foreground/70" strokeWidth={2.3} />
                <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/70">
                  Bibliotek · allt 5⁵ pekar på
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {bibliotek.map((b) => (
                  <Link
                    key={b.to}
                    to={b.to}
                    className="group flex min-h-[44px] items-center justify-between gap-2 border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-background hover:text-foreground"
                  >
                    {b.label}
                    <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </SectionReveal>
          </section>
        </>
      )}
    </>
  );
};

export default FemUpphojtFem;
