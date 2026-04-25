import { Link } from "react-router-dom";
import { ArrowRight, Shield, Swords, Zap, Users, Wrench } from "lucide-react";
import ScrollChapter from "@/components/ScrollChapter";
import ChapterNumber from "@/components/ChapterNumber";
import PrincipleTeaser from "@/components/PrincipleTeaser";
import ScrollCue from "@/components/ScrollCue";
import PhaseFlow from "@/components/PhaseFlow";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";

const Hem = () => {
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        {/*
          Bakgrundsfilm. Lägg filen som /public/hero.mp4 (rendereras som /hero.mp4 i prod).
          Saknas filen är taggen tyst och AnimatedBackground (från Layout) lyser igenom.
          Tips: håll filen ≤ 6 MB, h264 1080p, ingen ljudspår — vi spelar ändå muted.
        */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Mörk gradient för läsbar text ovanpå filmen */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background/90 pointer-events-none"
          aria-hidden="true"
        />

        {/* Innehåll — centrerat ovanpå film + overlay */}
        <div className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6">
          {/* Klubbsigill — placeholder, byts mot riktig Gunnilse IS-logga */}
          <Shield
            className="w-12 h-12 md:w-16 md:h-16 text-gunnilse-gold mb-6 animate-fade-in-up"
            strokeWidth={1.25}
            aria-label="Gunnilse IS"
          />
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
            <span className="inline-block w-10 h-px bg-gunnilse-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground">
              Gunnilse IS · Vår identitet på planen
            </span>
            <span className="inline-block w-10 h-px bg-gunnilse-gold" />
          </div>
          <h1
            className="font-black tracking-tight leading-[0.95] text-foreground animate-fade-in-up"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)", animationDelay: "120ms" }}
          >
            Spelmodell <span className="text-gunnilse-gold">2026</span>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "260ms" }}
          >
            Så här bygger vi. Så här gör vi mål. Så här försvarar vi. <br className="hidden md:inline" />
            <span className="text-foreground/80 font-semibold">En tydlig idé per skede</span> — samma ord från målvakten till anfallaren.
          </p>
          <div className="absolute bottom-10 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <ScrollCue />
          </div>
        </div>
      </section>

      {/* KAPITEL 1 — IDENTITET */}
      <section className="px-6 pb-16 -mt-4 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
          <div className="bg-card/75 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-4">Vad är detta?</div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground mb-4">
              En gemensam spelmodell för Gunnilse IS 2026.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Startsidan är öppen för föräldrar, spelare och nyfikna runt laget. Här får du en överblick av hur vi vill spela, vilka ord vi använder och varför det ska kännas igen från träning till match.
            </p>
          </div>
          <div className="bg-background/70 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8 flex flex-col justify-between gap-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Detaljerade principsidor, matchplaner och tränarverktyg är skyddade för laget. Logga in om du redan har tillgång, eller registrera en förfrågan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Logga in <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card/70 px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
              >
                Registrera
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ScrollChapter>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Kapitel 01</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Vår identitet</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-14">
            Fem saker vi gör i varje match — oavsett vem vi möter.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {identity.map((w, i) => (
              <li key={w.slug}>
                <Link
                  to={`/identitet/${w.slug}`}
                  className="group block h-full bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="text-[10px] font-bold text-muted-foreground mb-2">0{i + 1}</div>
                  <div className="text-xl font-black tracking-tight text-foreground mb-2">{w.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-4">{w.short}</div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent group-hover:gap-2.5 transition-all">
                    Läs mer här <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ScrollChapter>

      {/* KAPITEL 2 — DE FYRA SKEDENA */}
      <ScrollChapter>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Kapitel 02</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">De fyra skedena</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              En match består av fyra olika lägen. Vi vet vad vi ska göra i varje läge — och vad som gör att vi byter läge.
            </p>
          </div>
          <PhaseFlow />
        </div>
      </ScrollChapter>

      {/* KAPITEL 3 — FÖRSVAR */}
      <ScrollChapter>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="relative">
            <ChapterNumber number="03" className="absolute -top-12 -left-4 opacity-60" />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">När vi försvarar</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Förhindra avslut.<br />
                <span className="text-muted-foreground">I gyllene zonen.</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Vi står på rätt plats, jagar bollen åt samma håll och täcker farliga ytor. Inget skott från mitten — vi tvingar dem ut till kanten.
              </p>
            </div>
          </div>
          <PrincipleTeaser
            index="1"
            quote="Förhindra avslut i gyllene zonen — positionering, press, markering."
            to="/forsvar"
          />
        </div>
      </ScrollChapter>

      {/* KAPITEL 4 — ANFALL */}
      <ScrollChapter>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <PrincipleTeaser
            index="1"
            quote="Avslut i gyllene zonen — alltid med övertal."
            to="/anfall"
          />
          <div className="relative order-first lg:order-last">
            <ChapterNumber number="04" className="absolute -top-12 -right-4 opacity-60 text-right" />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">När vi anfaller</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Spelbarhet, avstånd,<br />
                <span className="text-muted-foreground">bredd och djup.</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Fyra enkla saker styr vårt anfall: erbjud passning (spelbarhet), stå rätt avstånd från varandra, använd hela planens bredd och hota bakom backlinjen (djup).
              </p>
            </div>
          </div>
        </div>
      </ScrollChapter>

      {/* KAPITEL 5 — FASTA */}
      <ScrollChapter>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Kapitel 05</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">När spelet stannar</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hörnor och frisparkar avgör matcher. Vi chansar inte — alla vet sin uppgift.
            </p>
          </div>
          <PrincipleTeaser
            index="1"
            quote="Hybridförsvar: zon i boxen + två strikta man-markeringar."
            to="/fasta"
            ctaLabel="Se alla fasta situationer"
          />
        </div>
      </ScrollChapter>

      {/* KAPITEL 6 — ROLLER & VERKTYG */}
      <ScrollChapter>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Kapitel 06</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Roller & verktyg</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Det här är spelarnas uppgifter på planen och tränarnas verktyg vid sidan om.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { to: "/roller", label: "Roller & Trupp", desc: "Rollkort, exempel från match och matchtrupp.", icon: Users },
              { to: "/verktyg", label: "Tränarverktyg", desc: "Träningsplan, matchblad, motståndaranalys, taktiktavla.", icon: Wrench },
            ].map(({ to, label, desc, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all">
                  Öppna <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScrollChapter>

      {/* AVSLUT */}
      <ScrollChapter minHeight="min-h-[60vh]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-6">Avslut</div>
          <blockquote className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            "Spelmodellen är inte ett dokument.<br />
            <span className="text-gradient-accent">Den är ett beteende.</span>"
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <span className="inline-block w-8 h-px bg-accent" />
            Gunnilse IS · 2026
            <span className="inline-block w-8 h-px bg-accent" />
          </div>
          <Link
            to="/spelide"
            className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-primary group"
          >
            Läs hela spelidén
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollChapter>

      {/* hidden import to keep referenced icons tree-shaken correctly */}
      <span className="hidden">
        <Shield />
        <Swords />
        <Zap />
      </span>
    </>
  );
};

export default Hem;
