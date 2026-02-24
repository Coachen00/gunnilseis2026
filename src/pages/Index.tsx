import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InteractiveFootballPitch, { Formation } from "@/components/InteractiveFootballPitch";
import TriggerCard from "@/components/TriggerCard";
import CoachCue from "@/components/CoachCue";
import { supabase } from "@/integrations/supabase/client";
import RoleCard from "@/components/RoleCard";
import SectionHeader from "@/components/SectionHeader";
import SetPieceCard from "@/components/SetPieceCard";
import SpelytorDiagram from "@/components/SpelytorDiagram";
import KorridorerDiagram from "@/components/KorridorerDiagram";
import GoldenZoneDiagram from "@/components/GoldenZoneDiagram";
import PrincipleCard from "@/components/PrincipleCard";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import TrainingVideo from "@/components/TrainingVideo";
import CategoryNav from "@/components/CategoryNav";
import GIGTemplate from "@/components/GIGTemplate";
import MissingInputPlaceholder from "@/components/MissingInputPlaceholder";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import MatchSquad from "@/components/MatchSquad";
import Matetal from "@/components/Matetal";
import ImageLinkCard from "@/components/ImageLinkCard";
import MatchExampleTimeline from "@/components/MatchExampleTimeline";
import LogoutButton from "@/components/LogoutButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, X } from "lucide-react";


// Image imports
import gulOverbelastning from "@/assets/gul-overbelastning.png";
import gronSpelvandning from "@/assets/gron-spelvandning.png";
import offensivHorna from "@/assets/offensiv-horna.png";
import defensivHorna from "@/assets/defensiv-horna.png";
import formation433 from "@/assets/formation-433.png";
import spelytorPlanbild from "@/assets/spelytor-planbild.png";
import spelbarhetInfografik from "@/assets/spelbarhet-infografik.png";
import hornaTyper from "@/assets/horna-typer.png";
import forsvarMotHorna from "@/assets/forsvar-mot-horna.png";

const ExpandableImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <button onClick={() => setExpanded(true)} className={`cursor-pointer w-full ${className}`}>
        <img src={src} alt={alt} className="w-full h-auto rounded-xl border border-border hover:opacity-90 transition-opacity" />
      </button>
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" onClick={() => setExpanded(false)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpanded(false)} className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
              <X className="w-4 h-4" />
            </button>
            <img src={src} alt={alt} className="w-full rounded-xl border border-border" />
          </div>
        </div>
      )}
    </>
  );
};

// Formation presets for interactive pitch
const formations: Formation[] = [
  {
    name: "4-3-3 Försvar",
    players: [
      { id: "1", x: 50, y: 92, role: "MV", color: "secondary" as const },
      { id: "2", x: 15, y: 78, role: "VYB", color: "primary" as const },
      { id: "3", x: 38, y: 75, role: "VMB", color: "primary" as const },
      { id: "4", x: 62, y: 75, role: "HMB", color: "primary" as const },
      { id: "5", x: 85, y: 78, role: "HYB", color: "primary" as const },
      { id: "6", x: 50, y: 55, role: "6:a", color: "accent" as const },
      { id: "7", x: 30, y: 58, role: "8:a", color: "primary" as const },
      { id: "8", x: 70, y: 58, role: "7:a", color: "primary" as const },
      { id: "9", x: 50, y: 28, role: "9:a", color: "accent" as const },
      { id: "10", x: 18, y: 35, role: "VY", color: "primary" as const },
      { id: "11", x: 82, y: 35, role: "HY", color: "primary" as const },
    ]
  },
  {
    name: "3-2-2-3 Anfall",
    players: [
      { id: "3", x: 30, y: 85, role: "VMB", color: "primary" as const },
      { id: "4", x: 50, y: 88, role: "HMB", color: "primary" as const },
      { id: "5", x: 70, y: 85, role: "HYB (stannar)", color: "primary" as const },
      { id: "2", x: 45, y: 68, role: "VYB (inv.)", color: "accent" as const },
      { id: "6", x: 55, y: 68, role: "6:a", color: "accent" as const },
      { id: "7", x: 32, y: 48, role: "8:a", color: "primary" as const },
      { id: "8", x: 68, y: 48, role: "7:a", color: "primary" as const },
      { id: "9", x: 50, y: 22, role: "9:a", color: "accent" as const },
      { id: "10", x: 12, y: 28, role: "VY", color: "primary" as const },
      { id: "11", x: 88, y: 28, role: "HY", color: "primary" as const },
    ]
  },
];

const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full px-5 py-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between hover:bg-muted/40 transition-colors mb-2">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-2 pb-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === "leojsjoqvist@gmail.com") {
        setIsAdmin(true);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hjälte */}
      <header className="relative overflow-hidden hero-gradient">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              🔒 Admin
            </Link>
          )}
          <Link
            to="/traningsplan"
            className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-bold hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            📋 Träningsplan
          </Link>
          <LogoutButton />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.2)_0%,_transparent_60%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-12 h-1 bg-accent rounded-full" />
              <span className="text-sm font-bold uppercase tracking-widest text-accent">Gunnilse IS 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Träningsmatcher{" "}
              <span className="text-gradient-accent">Vinter/vår 2026</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              Försvar: 4-3-3 — kompakt, styr ut. 
              <br />
              Anfall: 3-2-2-3 med inverterad ytterback.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <CoachCue cue="Invertera tidigt" variant="primary" />
              <CoachCue cue="Rättvänd → spelvändning → full fart" variant="accent" />
              <CoachCue cue="Korta avstånd" variant="muted" />
            </div>
          </div>
        </div>
      </header>

      <CategoryNav />

      {/* Snabbnavigering */}
      <div className="container pt-6 pb-2">
        <div className="flex flex-wrap gap-2 text-xs">
          <a href="#generellt" className="text-primary hover:underline">↓ Generellt</a>
          <span className="text-muted-foreground">•</span>
          <a href="#identitet" className="text-primary hover:underline">↓ Identitet</a>
          <span className="text-muted-foreground">•</span>
          <a href="#forsvarsspel" className="text-primary hover:underline">↓ Försvarsspel</a>
          <span className="text-muted-foreground">•</span>
          <a href="#omstallning-till-anfall" className="text-primary hover:underline">↓ Omställning till anfall</a>
          <span className="text-muted-foreground">•</span>
          <a href="#anfallsspel" className="text-primary hover:underline">↓ Anfallsspel</a>
          <span className="text-muted-foreground">•</span>
          <a href="#omstallning-till-forsvar" className="text-primary hover:underline">↓ Omställning till försvar</a>
          <span className="text-muted-foreground">•</span>
          <a href="#fasta-situationer" className="text-primary hover:underline">↓ Fasta situationer</a>
          <span className="text-muted-foreground">•</span>
          <a href="#matchtrupp" className="text-primary hover:underline">↓ Matchtrupp</a>
        </div>
      </div>

      <main className="container pb-20 space-y-20 pt-6">

        {/* ============================================================ */}
        {/* GENERELLT */}
        {/* ============================================================ */}
        <section id="generellt">
          <SectionHeader 
            badge="Generellt"
            title="Vår spelkarta"
            subtitle="Som trafikljus och växellådor: den visar oss när vi ska sakta ner, bygga eller köra full fart."
          />

          {/* Röd/Gul/Grön */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="space-y-3">
              <div className="rounded-xl p-5 border-2 border-zone-defense bg-zone-defense/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-zone-defense" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zone-defense">RÖD</h4>
                </div>
                <p className="text-sm text-muted-foreground">Vi kan inte spelvända. Vi har inte kontroll.</p>
              </div>
              <ImagePlaceholder title="RÖD fas" description="Bild/film: Röd situation" compact />
            </div>
            <div className="space-y-3">
              <div className="rounded-xl p-5 border-2 border-zone-midfield bg-zone-midfield/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-zone-midfield" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zone-midfield">GUL</h4>
                </div>
                <p className="text-sm text-muted-foreground">Vi börjar överbelasta (flyttar motståndare till vald kant).</p>
              </div>
              <ExpandableImage src={gulOverbelastning} alt="GUL fas — överbelastning" />
            </div>
            <div className="space-y-3">
              <div className="rounded-xl p-5 border-2 border-zone-attack bg-zone-attack/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-zone-attack" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zone-attack">GRÖN</h4>
                </div>
                <p className="text-sm text-muted-foreground">Vi har skapat oordning och är i fas att spelvända för attack mot deras box.</p>
              </div>
              <ExpandableImage src={gronSpelvandning} alt="GRÖN fas — spelvändning och attack" />
            </div>
          </div>

          {/* Pseudokontring */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Pseudokontrings-processen</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong className="text-foreground">GUL:</strong> Överbelasta en kant</li>
                <li>• <strong className="text-foreground">GRÖN:</strong> 3:a centralt rättvänd → spelvändning</li>
                <li>• <strong className="text-foreground">Full fart</strong> → överlapp/underlapp → kortsida → cutback → gyllene zonen</li>
              </ul>
              <TrainingVideo title="Pseudokontring — hela sekvensen" url="https://www.youtube.com/shorts/-hVrA26JJw0" className="mt-4" />
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-5 border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Cue "1–2–3"</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-defense/20 text-zone-defense text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span><strong className="text-foreground">SÄKRA</strong> – Spela enkelt/säkert. Behåll kontroll.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-midfield/20 text-zone-midfield text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span><strong className="text-foreground">FÖRBÄTTRA</strong> – Skapa bättre vinkel/läge inom spelytan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-attack/20 text-zone-attack text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span><strong className="text-foreground">VÄXLA / VÄNDLÄGE</strong> – Vänd/accelerera: framåt, sök assistytan.</span>
                  </li>
                </ul>
              </div>
              <ImagePlaceholder title="Växla / Vändläge" description="Bild/film: Cue 3 i praktiken" compact />
            </div>
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Generellt">
            <div className="space-y-3">
              <GIGTemplate cueTitel="RÖD" definition="Vi kan inte spelvända. Vi har inte kontroll." narAnvands="När motståndaren pressar högt och vi saknar passningsvägar framåt." beslutstrigger="Cue 1 (SÄKRA)" handling="Spela enkelt/säkert. Ingen vändning. Behåll kontroll." gVillkor="Inga bollförluster i egen spelyta" igVillkor="Bollförlust som leder till skottchans" />
              <GIGTemplate cueTitel="GUL" definition="Vi börjar överbelasta (flyttar motståndare till vald kant)." narAnvands="När vi har kontroll men inte kan spelvända ännu." beslutstrigger="Cue 2 (FÖRBÄTTRA)" handling="Överbelasta en kant. Flytta motståndare." gVillkor="Överbelastning skapar GRÖN situation" igVillkor="Motståndare återtar position" />
              <GIGTemplate cueTitel="GRÖN" definition="Vi har skapat oordning och är i fas att spelvända." narAnvands="När motståndaren är oorganiserad och vi har rättvänd spelare centralt." beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)" handling="Vänd/accelerera framåt, sök assistytan. Spelvändning → full fart." gVillkor="Spelvändning genomförd → skottchans inom 10s" igVillkor="GRÖN identifierad men ingen spelvändning" />
              <GIGTemplate cueTitel="Pseudokontring (process)" definition="Gul: överbelasta → Grön: spelvänd → full fart → kortsida → cutback → gyllene zonen." narAnvands="När GUL övergår till GRÖN." beslutstrigger="Sekventiellt: GUL → GRÖN → Cue 3" handling="1. Överbelasta kant. 2. 3:a centralt rättvänd. 3. Spelvändning. 4. Överlapp/underlapp. 5. Cutback." gVillkor="Hela sekvensen genomförd → cutback" igVillkor="Sekvens avbruten före spelvändning" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* IDENTITET */}
        {/* ============================================================ */}
        <section id="identitet">
          <SectionHeader 
            badge="Identitet"
            title="Vilka vill vi vara?"
            subtitle="Det här är vilka vi är varje dag — lagets uppförande på planen."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { emoji: "⚔️", title: "Duellspel", text: "Du ska aldrig förlora en duell – i sämsta fall oavgjort." },
              { emoji: "🎯", title: "Andrabollsspel", text: "Om bollen saknar ägare – TA DEN!" },
              { emoji: "⚡", title: "Felvända löpningar", text: "Vid bollförlust – direkt omställning!" },
              { emoji: "👁️", title: "Spelbarhet", text: "Rörelse utan boll och position i farligaste ytan." },
              { emoji: "🏃", title: "Spring alltid i djupled!", text: "Alltid – oavsett läge.", accent: true },
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <div className={`bg-card rounded-xl p-5 border-2 ${item.accent ? "border-accent/30" : "border-primary/30"} shadow-sm`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${item.accent ? "bg-accent/20" : "bg-primary/20"} flex items-center justify-center`}>
                      <span className={`${item.accent ? "text-accent" : "text-primary"} font-black text-sm`}>{item.emoji}</span>
                    </div>
                    <h4 className={`text-sm font-bold uppercase tracking-wider ${item.accent ? "text-accent" : "text-primary"}`}>{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">{item.text.split("–")[0]}</strong>{item.text.includes("–") ? `–${item.text.split("–").slice(1).join("–")}` : ""}</p>
                </div>
                {item.title === "Spelbarhet" ? (
                  <ExpandableImage src={spelbarhetInfografik} alt="Spelbarhet infografik" />
                ) : (
                  <ImagePlaceholder title={item.title} description={`Bild/film: ${item.title}`} compact />
                )}
              </div>
            ))}
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Identitet">
            <div className="space-y-3">
              <GIGTemplate cueTitel="Duellspel" definition="Du ska aldrig förlora en duell – i sämsta fall oavgjort." narAnvands="Varje duellsituation på planen" handling="Gå in med 100% — vinn kropp, vinn boll, eller åtminstone oavgjort." gVillkor="Duellvinst ≥ 50% individuellt" igVillkor="Duellvinst < 40% eller undviker dueller" />
              <GIGTemplate cueTitel="Andrabollsspel" definition="Om bollen saknar ägare – TA DEN!" narAnvands="Efter varje duell, nickduell, lös boll" handling="Reagera direkt. Ta bollen. Ingen passivitet." gVillkor="Laget vinner ≥ 60% av andrabollar" igVillkor="Laget förlorar andrabollar konsekvent" />
              <GIGTemplate cueTitel="Felvända löpningar" definition="Vid bollförlust – direkt omställning!" narAnvands="Varje gång vi förlorar bollen" handling="Direkt omställning. Löp tillbaka / mot boll omedelbart." gVillkor="Omställning påbörjad inom 2s" igVillkor="Spelare stannar kvar / reagerar inte vid bollförlust" />
              <GIGTemplate cueTitel="Spelbarhet" definition="Rörelse utan boll och position i farligaste ytan." narAnvands="Alltid när lagkamrat har boll" handling="Rörelse utan boll för att bli spelbar i farlig yta." gVillkor="≥ 2 passningsalternativ vid varje bollinnehav" igVillkor="Spelare statisk utan rörelse" />
              <GIGTemplate cueTitel="Spring alltid i djupled!" definition="Alltid – oavsett läge." narAnvands="Varje anfallssituation" handling="Alltid löp i djupled — skapa djup oavsett om boll kommer eller ej." gVillkor="≥ 3 djupledslöpningar per 10 min per spelare" igVillkor="Inga djupledslöpningar under en halvlek" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* FÖRSVARSSPEL */}
        {/* ============================================================ */}
        <section id="forsvarsspel">
          <SectionHeader 
            badge="Försvarsspel"
            title="5 Försvarsprinciper"
            subtitle="Vi skyddar vårt mål som en fästning: stäng dörren centralt, styr dem utåt."
          />

          <div className="mb-6">
            <TrainingVideo title="4-3-3 Försvarsspel förklarat" url="https://www.youtube.com/watch?v=jJGwvHb8fWs" duration="6:45" />
          </div>
          
          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PrincipleCard number={1} title="Aldrig mellan, aldrig i oss" description="Ingen passning mellan våra linjer. Om de spelar i oss = 100% satsning." variant="defense" />
              <PrincipleCard number={2} title="Trigger: deras vänsterback" description="Press startar när de spelar till sin VB. Kollektiv insats för att vinna bollen." variant="defense" />
              <PrincipleCard number={3} title="Splitta planen vid sidval" description="När de valt sida, splitta planen. Bortre spelare säkrar central korridor." variant="defense" />
              <PrincipleCard number={4} title="Försvara i tre korridorer" description="Stäng inre korridorer, tryck motståndet mot yttre. Central korridor = prio." variant="defense" />
              <PrincipleCard number={5} title="Om bollen är 'I' oss = maximal ansträngning" description="Se till att vinna 1, få den till bättre yta 2. Styr alltid mot yttre korridor." variant="defense" />
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Försvarsspel" description="Bild på kompakt försvar" />
            </div>
          </div>

          {/* Restförsvar */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-zone-defense/30 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-zone-defense mb-4">Restförsvar +1</h4>
              <p className="text-sm text-muted-foreground">Alltid en spelare mer i restförsvaret än vad motståndaren har framåt.</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-primary/30 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Vid ledning: +2</h4>
              <p className="text-sm text-muted-foreground">Extra säkerhet när vi leder. Ingen kontring ska gå igenom.</p>
            </div>
          </div>

          {/* Pressfälla */}
          <h3 className="text-lg font-bold text-foreground mb-2">Pressfälla: Deras Vänsterback</h3>
          <p className="text-sm text-muted-foreground mb-4">Formation + höjd skapar pressfällan. Vi vill se passningen till deras VB.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <TriggerCard number={1} condition="pass till deras VB" action="100% insats – vinn bollen" variant="defense" />
              <TriggerCard number={2} condition="press sätts" action="splitta planen, säkra central korridor" variant="defense" />
              <TriggerCard number={3} condition="ABSOLUT KRAV" action="HINDRA SPELVÄNDNING" variant="defense" />
            </div>
            <div className="space-y-4">
              <ImagePlaceholder title="Pressfälla vänsterback" description="Visa positionering vid press" compact />
              <ImagePlaceholder title="Splitta planen" description="Bortre spelare säkrar centralt" compact />
              <ImagePlaceholder title="Restförsvar +1" description="Kompakthet vid kontring" compact />
            </div>
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Försvarsspel">
            <div className="space-y-3">
              <GIGTemplate cueTitel="Princip 1: Aldrig mellan, aldrig i oss" definition="Ingen passning mellan våra linjer." narAnvands="När motståndare försöker spela genom våra linjer centralt." handling="Stäng passningsvägar centralt. Om boll kommer i oss: 100% satsning." gVillkor="0 genomspelade centrala passningar per halvlek" igVillkor="> 3 centrala passningar per halvlek" />
              <GIGTemplate cueTitel="Princip 2: Trigger deras VB" definition="Press startar vid pass till deras vänsterback." narAnvands="När motståndare bygger via sin vänsterback." beslutstrigger="Pass till deras VB" handling="Kollektiv insats. Splitta planen. Hindra spelvändning." gVillkor="Spelvändning förhindrad i ≥ 80% av tillfällen" igVillkor="Motståndare spelvänder fritt" />
              <GIGTemplate cueTitel="Restförsvar +1" definition="Alltid en extra spelare bakom bollen." narAnvands="Alltid i försvarsspelet." handling="+1 spelare i restförsvar. Vid ledning: +2." gVillkor="0 mål insläppta via kontringar" igVillkor="Mål insläppt via kontring pga saknad restförsvarsspelare" />
              <GIGTemplate cueTitel="Pressfälla: Deras Vänsterback" definition="Vi vill se passningen till deras VB och pressa kollektivt." narAnvands="När motståndare bygger via sin vänsterback." beslutstrigger="Pass till deras VB" handling="1. 100% insats — vinn bollen. 2. Splitta planen. 3. HINDRA SPELVÄNDNING." gVillkor="Spelvändning förhindrad ≥ 80%" igVillkor="Motståndare spelvänder fritt efter pressfälla" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* OMSTÄLLNING TILL ANFALL */}
        {/* ============================================================ */}
        <section id="omstallning-till-anfall">
          <SectionHeader 
            badge="Omställning till anfall"
            title="Bollvinst → Framåt"
            subtitle="När vi vinner bollen sover vi inte — vi tittar framåt direkt."
          />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div>
              <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm text-center font-medium text-primary">
                  <strong>Se även:</strong> <a href="#generellt" className="underline hover:no-underline">Pseudokontring-processen (Generellt)</a>
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Rättvänd → spelvändning → full fart framåt</li>
                <li>• Första framåtaktion inom 3 sekunder</li>
                <li>• Sök assistytan direkt</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Omställning till anfall" description="Bild på snabb omställning" />
            </div>
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Omställning till anfall">
            <div className="space-y-3">
              <GIGTemplate cueTitel="Rättvänd → Spelvändning → Full fart" definition="Rättvänd → spelvändning → full fart framåt" narAnvands="Direkt efter bollvinst — om rättvänd spelare får bollen." beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)" handling="Spelvändning omedelbart. Full fart framåt. Sök assistytan." gVillkor="Framåtaktion inom 3 sekunder" igVillkor="Bakåtspel eller stillastående > 5 sekunder" />
              <MissingInputPlaceholder needed="Omställning till anfall-principer (bollvinst-triggers, första 3 sekundernas regler)" formatNeeded="3–7 punkter + 1 diagramlänk" source="matchmodell" owner="tränare" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* ANFALLSSPEL */}
        {/* ============================================================ */}
        <section id="anfallsspel">
          <SectionHeader 
            badge="Anfallsspel"
            title="3-2-2-3 Struktur"
            subtitle="Vi bygger upp, sedan accelererar vi — som att växla från lågt till högt gear."
          />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RoleCard line="3" players="2 MB + 1 YB" description="Första linjen i uppbyggnad. Den ytterback som inte inverterar stannar som tredje spelare bak." variant="defense" />
              <RoleCard line="2" players="6:a + Inv. YB" description="Basen. Säkrar spelvändning och kontringsskydd centralt. 6:an alltid 'pilen nedåt'." variant="midfield" />
              <RoleCard line="2" players="8:a + 7:a" description="Offensiva mittfältare som söker spelbarhet i inre korridorer. VM = 8:a, HM = 7:a." variant="midfield" />
              <RoleCard line="3" players="2 Yttrar + 9:a" description="Högsta linjen. Yttrar håller bredd, 9:an hotar spelyta 3 och gyllene zonen." variant="attack" />
            </div>
            <div className="w-full md:w-64 flex-shrink-0">
              <ExpandableImage src={formation433} alt="4-3-3 / 3-2-2-3 grunduppställning" />
            </div>
          </div>

          {/* Spelytor */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-10">
            <SectionHeader 
              badge="Spelytor"
              title="Spelytor"
              subtitle="Planen är som fyra rum. Vi vill veta var bollen är, och vad vi ska göra i just det rummet."
              className="mb-6"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <h5 className="text-sm font-bold text-foreground mb-1">Utgångsyta</h5>
                <p className="text-xs text-muted-foreground">Här startar vi – nära vår målvakt och våra första passningar.</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <h5 className="text-sm font-bold text-foreground mb-1">Spelyta 1</h5>
                <p className="text-xs text-muted-foreground">Här bygger vi upp och letar nästa passning framåt.</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/30">
                <h5 className="text-sm font-bold text-foreground mb-1">Spelyta 2</h5>
                <p className="text-xs text-muted-foreground">Här i mitten vill vi spela oss förbi och komma loss.</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <h5 className="text-sm font-bold text-foreground mb-1">Spelyta 3</h5>
                <p className="text-xs text-muted-foreground">Nära deras mål – här vill vi skapa chans och avslut.</p>
              </div>
            </div>
            <ExpandableImage src={spelytorPlanbild} alt="Spelytor — planbild med zoner" />
            
            <div className="mt-8 mb-8">
              <KorridorerDiagram />
            </div>
            
            <SectionHeader 
              badge="Korridorer"
              title="Inre & Yttre Korridorer"
              subtitle="Vi spelar alltid via inre korridor när möjligt. Yttre = sista utväg."
              className="mb-8"
            />
            
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <SpelytorDiagram />
              <GoldenZoneDiagram />
            </div>
          </div>

          {/* Grön spelare → Acceleration */}
          <h3 className="text-lg font-bold text-foreground mb-2">Grön spelare → Acceleration</h3>
          <p className="text-sm text-muted-foreground mb-4">Spelvändning centralt utlöser full fart mot gyllene zonen.</p>

          <div className="mb-6">
            <TrainingVideo title="3-2-2-3 Anfallsspel förklarat" url="https://www.youtube.com/shorts/yGyPL4PZD_Q" duration="0:59" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <InteractiveFootballPitch formations={formations} title="Interaktiv Taktiktavla" subtitle="Tryck och dra för att flytta spelare" showZones />
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-5 border border-accent/30 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">Anfallssekvens</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Grön spelare centralt slår spelvändning</li>
                  <li>2. Full fart i inre/yttre korridor</li>
                  <li>3. Överlapp/underlapp mot kortsidan</li>
                  <li>4. Cutback till gyllene zonen</li>
                </ul>
              </div>
              <TriggerCard number={1} condition="rättvänd i spelyta 2" action="spelvändning → full fart via inre korridor" variant="attack" />
              <TriggerCard number={2} condition="inre korridor låst" action="spelvänd via 6:a + inverterad → full fart" variant="attack" />
            </div>
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Anfallsspel">
            <div className="space-y-3">
              <GIGTemplate cueTitel="3-2-2-3 Struktur" definition="Varje linje har tydliga uppgifter. VM = 8:a, HM = 7:a." narAnvands="Alltid i anfallsspelet." handling="Backlinje (3): uppbyggnad. Bas (2): 6:a + inv. YB. Offensiva MF (2): 8:a + 7:a. Högsta (3): Yttrar + 9:a." gVillkor="Samtliga linjer besatta vid uppspel" igVillkor="Linjer saknar spelare → för stor distans" />
              <GIGTemplate cueTitel="Inre & Yttre Korridorer" definition="Vi spelar alltid via inre korridor när möjligt." narAnvands="Alltid i anfallsspelet." handling="Prioritera passningar via inre korridor. Yttre = sista utväg." gVillkor="≥ 60% progressioner via inre korridor" igVillkor="Majoriteten av progressioner via yttre" />
              <GIGTemplate cueTitel="Grön spelare → Acceleration" definition="Spelvändning centralt utlöser full fart mot gyllene zonen." narAnvands="När GRÖN identifieras." beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)" handling="1. Spelvändning. 2. Full fart. 3. Överlapp/underlapp. 4. Cutback till gyllene zonen." gVillkor="Cutback till gyllene zonen genomförd" igVillkor="GRÖN identifierad men ingen acceleration" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* OMSTÄLLNING TILL FÖRSVAR */}
        {/* ============================================================ */}
        <section id="omstallning-till-forsvar">
          <SectionHeader 
            badge="Omställning till försvar"
            title="Bollförlust → Jaga eller falla"
            subtitle="När vi tappar bollen jagar vi tillsammans direkt — eller faller tillbaka tillsammans. Inget kaos."
          />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div>
              <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm text-center font-medium text-primary">
                  <strong>Se även:</strong> <a href="#forsvarsspel" className="underline hover:no-underline">Restförsvar +1 / +2 (Försvarsspel)</a>
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Närmaste spelare pressar boll direkt</li>
                <li>• Omgivande spelare stänger passningsvägar</li>
                <li>• Om ej återvunnen inom 5s: falla tillbaka kompakt</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Omställning till försvar" description="Bild på counterpress" />
            </div>
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Omställning till försvar">
            <div className="space-y-3">
              <GIGTemplate cueTitel="Direkt bollåtererövring" definition="Vid bollförlust — direkt press för att återvinna inom 5 sekunder" narAnvands="Direkt efter bollförlust i motståndarens planhalva" beslutstrigger="Bollförlust → närmaste 2–3 spelare pressar" handling="1. Närmaste spelare pressar boll. 2. Stäng passningsvägar. 3. Om ej 5s: falla tillbaka kompakt." gVillkor="≥ 40% bollåtererövring inom 5s" igVillkor="Spelare reagerar inte / laget splittrat" />
              <MissingInputPlaceholder needed="Omställning till försvar-regler (första 5 sekunderna, vem pressar, vem täcker)" formatNeeded="5–9 punkter + 2 exempel" source="matchmodell + träningsmodell" owner="tränare/analytiker" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* FASTA SITUATIONER */}
        {/* ============================================================ */}
        <section id="fasta-situationer">
          <SectionHeader 
            badge="Fasta situationer"
            title="Defensivt: Hybrid + 2 Man"
            subtitle="När spelet stannar (hörna/frispark) har vi fortfarande regler. Vi gissar inte."
          />

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <SetPieceCard 
              title="Grundstruktur"
              variant="hybrid"
              roles={[
                { name: "2 MAN", instruction: "Följ hotet – först boll, sen kropp" },
                { name: "ZON", instruction: "Ta första boll i zon – rensa framåt" },
                { name: "REST", instruction: "2 spelare högre – andraboll + kontringsskydd" },
              ]}
            />
            <div className="space-y-4">
              <SetPieceCard title="Trigger: Kort variant" variant="man" roles={[{ name: "Kort", instruction: "1 spelare kliver ut, resten håller zon" }]} />
              <SetPieceCard title="Trigger: Lång/inswing" variant="zone" roles={[{ name: "Lång", instruction: "Zon attackerar boll, man-markörer låser hot" }]} />
              <SetPieceCard title="Trigger: Andraboll / lös boll" variant="man" roles={[{ name: "Andraboll", instruction: "AGGRESSIVT – vinn eller foul" }]} />
            </div>
          </div>

          {/* Bildplatshållare för fasta situationer */}
          <h3 className="text-lg font-bold text-foreground mb-4">Bilder & diagram</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <ExpandableImage src={offensivHorna} alt="Offensiv hörna — spelarpositioner" />
            <ExpandableImage src={hornaTyper} alt="Olika sätt att slå hörnor" />
            <ExpandableImage src={defensivHorna} alt="Defensiv hörna — zonförsvar" />
            <ExpandableImage src={forsvarMotHorna} alt="Analys av hörnsekvenser" />
            <ImagePlaceholder title="Inläggsfrispark — offensiv" description="Bild/film" compact />
            <ImagePlaceholder title="Inläggsfrispark — defensiv" description="Bild/film" compact />
            <ImagePlaceholder title="Direkt frispark — offensiv" description="Bild/film" compact />
            <ImagePlaceholder title="Direkt frispark — defensiv" description="Bild/film" compact />
          </div>

          <Matetal className="mb-6" />

          <AccordionSection title="Visa G/IG-mallar — Fasta situationer">
            <div className="space-y-3">
              <GIGTemplate cueTitel="Defensivt: Hybrid + 2 Man" definition="Zonbas i boxen med 2 spelare i strikt man-markering." narAnvands="Alla defensiva fasta situationer." handling="2 MAN: Följ hotet. ZON: Ta första boll — rensa framåt. REST: 2 spelare högre." gVillkor="0 mål insläppta från fasta situationer" igVillkor="≥ 2 mål insläppta från fasta per match" />
              <GIGTemplate cueTitel="Trigger: Kort variant" definition="1 spelare kliver ut, resten håller zon." narAnvands="Vid kort hörnvariant av motståndare." handling="1 spelare kliver ut. Resten håller zon." gVillkor="Kort hörna neutraliserad — ingen skottchans" igVillkor="Kort hörna leder till skottchans" />
              <GIGTemplate cueTitel="Trigger: Lång/inswing" definition="Zon attackerar boll, man-markörer låser hot." narAnvands="Vid lång hörna / inswing." handling="Zonspelare attackerar bollen. Man-markörer låser sina hot." gVillkor="Boll rensad vid ≥ 80% av långa hörnor" igVillkor="Motståndare nickar fritt i boxen" />
              <MissingInputPlaceholder needed="Hörnor för, frisparkar för, inkast, straffar" formatNeeded="punkter + diagram" source="fasta situationer-manus" owner="tränare" />
            </div>
          </AccordionSection>
        </section>

        {/* ============================================================ */}
        {/* ROLLER & POSITIONER (NY SEK 6) */}
        {/* ============================================================ */}
        <section id="roller-positioner">
          <SectionHeader 
            badge="Roller"
            title="Roller & positioner"
          />
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ImageLinkCard title="Mittfält – beslutsnav" bullet="Mittfältarna styr tempot och beslutar om spelvändning." />
            <ImageLinkCard title="Inverterad ytterback – numerärt övertag centralt" bullet="Vänsterbacken inverterar för att skapa bas med 6:an." />
          </div>
        </section>

        {/* ============================================================ */}
        {/* EXEMPEL FRÅN MATCH (NY SEK 7) */}
        {/* ============================================================ */}
        <section id="exempel-match">
          <SectionHeader 
            badge="Exempel"
            title="Exempel från match"
            subtitle="En situation, ett beslut, ett resultat."
          />
          <MatchExampleTimeline />
        </section>

        {/* ============================================================ */}
        {/* MATCHTRUPP */}
        {/* ============================================================ */}
        <section id="matchtrupp">
          <SectionHeader 
            badge="Matchdag"
            title="Matchtrupp & Ansvarsområden"
            subtitle="Fyll i dagens matchtrupp och tilldela specialroller inför varje match."
          />
          <MatchSquad />
        </section>

        {/* ============================================================ */}
        {/* KVALITETSKONTROLL — FÖRENKLAD */}
        {/* ============================================================ */}
        <section id="quality-control">
          <SectionHeader 
            badge="Kvalitetskontroll"
            title="Mätetal & Lärdom"
            subtitle="Enkel uppföljning efter match."
          />

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">PPDA</h4>
              <input type="text" placeholder="Värde" className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 mb-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Kort anteckning" rows={2} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-accent-foreground mb-3">Spelvändningar</h4>
              <input type="text" placeholder="Antal / typ" className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 mb-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Kort anteckning" rows={2} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Inspel till assistytan</h4>
              <input type="text" placeholder="Antal / kvalitet" className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 mb-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Kort anteckning" rows={2} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Lärdom (1–3 meningar)</h4>
            <textarea placeholder="Vad lärde vi oss idag?" rows={3} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
        </section>

      </main>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Gunnilse IS 2026 • Träningsmatcher Vinter/vår</p>
          <a href="#generellt" className="text-primary text-xs hover:underline mt-2 inline-block">↑ Tillbaka upp</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
