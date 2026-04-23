import { Link } from "react-router-dom";
import { ArrowRight, Shield, Swords, Zap, Users, Wrench } from "lucide-react";
import ScrollChapter from "@/components/ScrollChapter";
import ChapterNumber from "@/components/ChapterNumber";
import PrincipleTeaser from "@/components/PrincipleTeaser";
import ScrollCue from "@/components/ScrollCue";
import PhaseFlow from "@/components/PhaseFlow";

const identityWords = [
  { word: "Duell", meaning: "Du ska aldrig förlora en duell — i sämsta fall oavgjort." },
  { word: "Spelbarhet", meaning: "Rörelse utan boll och position i farligaste ytan." },
  { word: "Rättvänd", meaning: "Sök rättvänd mottagning — det utlöser progression och spelvändning." },
  { word: "Djup", meaning: "Höghastighetslöpning i djupled när vi är rättvända i spelyta 2–3." },
  { word: "Tillsammans", meaning: "Vi pressar och faller som ett lag — första försvarare först." },
];

const Hem = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6">
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <span className="inline-block w-10 h-px bg-accent" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Gunnilse IS · Vår identitet på planen
          </span>
          <span className="inline-block w-10 h-px bg-accent" />
        </div>
        <h1
          className="font-black tracking-tight leading-[0.95] text-foreground animate-fade-in-up"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)", animationDelay: "120ms" }}
        >
          Spelmodell <span className="text-gradient-accent">2026</span>
        </h1>
        <p
          className="mt-8 max-w-2xl text-base md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "260ms" }}
        >
          Så här bygger vi. Så här gör vi mål. Så här försvarar vi. <br className="hidden md:inline" />
          <span className="text-foreground/80 font-semibold">En princip per skede</span> — samma vokabulär från målvakt till anfallare.
        </p>
        <div className="absolute bottom-10 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <ScrollCue />
        </div>
      </section>

      {/* KAPITEL 1 — IDENTITET */}
      <ScrollChapter>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Kapitel 01</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Vår identitet</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-14">
            Fem ord. Fem beteenden. Det här ser du i varje match — oavsett motstånd.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {identityWords.map((w, i) => (
              <li
                key={w.word}
                className="group bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
              >
                <div className="text-[10px] font-bold text-muted-foreground mb-2">0{i + 1}</div>
                <div className="text-xl font-black tracking-tight text-foreground mb-2">{w.word}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{w.meaning}</div>
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
              Fotboll är inte ett spel — det är fyra. Vi vet exakt vad vi gör i varje skede och vad som triggar nästa.
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
                Positionering, press och markering — vi blockerar avslutsytor och styr pressen åt en sida. Andrabollar vinner vi som ett lag.
              </p>
            </div>
          </div>
          <PrincipleTeaser
            index="1"
            quote="Förhindra avslut i gyllene zonen — positionering, press, markering."
            detail="Vi styr pressen åt en sida och håller kompakt form genom överflyttning, centrering, upp- och nedflyttning. Bollen ska aldrig gå genom mitten."
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
            detail="Rättvänd spelare i spelyta 2–3 löper i djupled, hittar assistytan och passar in i gyllene zonen. Övertalighet i gyllene zonen och assistzon är målet."
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
                De fyra grundförutsättningarna är vårt ramverk. Vi söker rättvänd spelare, vänder spelet och accelererar mot gyllene zonen.
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
              Hörnor och frisparkar avgör matcher. Vi gissar inte — vi har regler.
            </p>
          </div>
          <PrincipleTeaser
            index="1"
            quote="Hybridförsvar: zon i boxen + två strikta man-markeringar."
            detail="Vi täcker farliga ytor med zon — och låser de två största lufthoten man-mot-man. Offensivt: leverera till gyllene zonen via assistytan."
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
              Spelmodellen lever genom spelarna och tränarteamets verktyg.
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