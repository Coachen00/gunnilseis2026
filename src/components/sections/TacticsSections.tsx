/**
 * Shared content sections extracted from the original one-page Index.
 * Each section is a self-contained component used by the new multi-page routes.
 * Behavior, copy, and visual structure are preserved exactly.
 */
import { useState } from "react";
import TriggerCard from "@/components/TriggerCard";
import CoachCue from "@/components/CoachCue";
import RoleCard from "@/components/RoleCard";
import SectionHeader from "@/components/SectionHeader";
import SetPieceCard from "@/components/SetPieceCard";
import SpelytorDiagram from "@/components/SpelytorDiagram";
import KorridorerDiagram from "@/components/KorridorerDiagram";
import GoldenZoneDiagram from "@/components/GoldenZoneDiagram";
import GIGTemplate from "@/components/GIGTemplate";
import MissingInputPlaceholder from "@/components/MissingInputPlaceholder";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import MatchSquad from "@/components/MatchSquad";
import Matetal from "@/components/Matetal";
import ImageLinkCard from "@/components/ImageLinkCard";
import MatchExampleTimeline from "@/components/MatchExampleTimeline";
import TrainingVideo from "@/components/TrainingVideo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import offensivHorna from "@/assets/offensiv-horna.png";
import defensivHorna from "@/assets/defensiv-horna.png";
import formation433 from "@/assets/formation-433.png";
import spelytorPlanbild from "@/assets/spelytor-planbild.png";
import spelbarhetInfografik from "@/assets/spelbarhet-infografik.png";
import hornaTyper from "@/assets/horna-typer.png";
import forsvarMotHorna from "@/assets/forsvar-mot-horna.png";

/* ── Expandable image overlay ── */
export const ExpandableImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <button onClick={() => setExpanded(true)} className={`cursor-pointer w-full group ${className}`}>
        <img src={src} alt={alt} className="w-full rounded-xl border border-border transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/20" />
      </button>
      {expanded && (
        <div className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={() => setExpanded(false)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpanded(false)} className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-lg">
              <X className="w-4 h-4 text-foreground" />
            </button>
            <img src={src} alt={alt} className="w-full rounded-xl border border-border shadow-2xl" />
          </div>
        </div>
      )}
    </>
  );
};

/* ── Formation presets ── */
/* Formation-presets borttagna — taktiktavlan ligger nu på /taktiktavla */

/* ── Accordion section ── */
export const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full px-5 py-3.5 rounded-xl border border-border bg-card flex items-center justify-between hover:bg-muted/40 transition-all duration-200 mb-2 shadow-sm">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-2 pb-6 pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ══════════════════════════════════════════════════════════════ */
/* GENERELLT */
/* ══════════════════════════════════════════════════════════════ */
export const GenerelltSection = () => (
  <section id="generellt">
    <SectionHeader badge="Generellt" title="Vår spelkarta" subtitle="Fyra grundförutsättningar styr varje beslut: spelbarhet, spelavstånd, spelbredd, speldjup." />

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {[
        { title: "Spelbarhet", text: "Erbjud passningsalternativ — alltid minst två linjer framåt och en bakåt." },
        { title: "Spelavstånd", text: "Rätt avstånd mellan spelare: nära nog för stöd, långt nog för att inte täcka samma yta." },
        { title: "Spelbredd", text: "Använd hela planens bredd så motståndaren tvingas sträcka ut sin form." },
        { title: "Speldjup", text: "Hota bakom backlinjen och erbjud djupledspassningar — det öppnar ytor framför." },
      ].map((g) => (
        <div key={g.title} className="bg-card/85 backdrop-blur-sm rounded-xl p-5 border border-border shadow-sm card-hover">
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-3">{g.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
        </div>
      ))}
    </div>

    <div className="bg-card/85 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm mb-10">
      <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">Beslutslogik — så agerar vi när vi har bollen</h4>
      <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
        <li><strong className="text-foreground font-medium">Sök rättvänd spelare</strong> — den som ser planen är vår nästa station.</li>
        <li><strong className="text-foreground font-medium">Spelvändning när vinkeln finns</strong> — flytta bollen till motsatt sida för att skapa fri yta.</li>
        <li><strong className="text-foreground font-medium">Full fart framåt</strong> — när vi är rättvända i progression: hota djupet och assistytan.</li>
        <li><strong className="text-foreground font-medium">Avslut i gyllene zonen</strong> — alltid via assistytan, helst med övertal.</li>
      </ol>
      <TrainingVideo title="Spelvändning → acceleration" url="https://www.youtube.com/shorts/-hVrA26JJw0" className="mt-5" />
    </div>

    <Matetal className="mb-8" />

    <AccordionSection title="Visa G/IG-mallar — Generellt">
      <div className="space-y-3">
        <GIGTemplate cueTitel="Spelbarhet" definition="Erbjud passningsalternativ i flera riktningar." narAnvands="Hela bollinnehavsfasen." handling="Minst två spelbara linjer framåt och en bakåt. Rörelse utan boll." gVillkor="Bollförare har ≥ 2 framåtalternativ" igVillkor="Bollförare isolerad utan spelbara linjer" />
        <GIGTemplate cueTitel="Rättvänd mottagning" definition="Vi söker spelare som kan vända upp och se planen framåt." narAnvands="Progression och uppbyggnad." handling="Spelaren öppnar kroppen vid mottagning. Stödspelare erbjuder vinkel." gVillkor="Rättvänd spelare hittar djupledspassning" igVillkor="Mottagning med rygg mot mål utan stöd" />
        <GIGTemplate cueTitel="Spelvändning" definition="Flytta bollen till motsatt sida för att skapa övertal/fri yta." narAnvands="När vi har kontroll men en sida är låst." handling="Bas (6:a + inverterad YB) hittar fri sida via 1–2 passningar." gVillkor="Spelvändning genomförd → progression i ny korridor" igVillkor="Tappad boll i vändningen" />
        <GIGTemplate cueTitel="Avslut i gyllene zonen" definition="Avslut centralt framför mål med övertal, oftast via assistytan." narAnvands="Sista tredjedelen." handling="Cutback från kortlinjen eller löp i djupled från inre korridor." gVillkor="Avslut från gyllene zonen med övertal" igVillkor="Avslut långt utifrån utan kvalitet" />
      </div>
    </AccordionSection>
  </section>
);

/* IDENTITET */
export const IdentitetSection = () => (
  <section id="identitet">
    <SectionHeader badge="Identitet" title="Vilka vill vi vara?" subtitle="Det här är vilka vi är varje dag — lagets uppförande på planen." />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {[
        { emoji: "⚔️", title: "Duellspel", text: "Du ska aldrig förlora en duell – i sämsta fall oavgjort." },
        { emoji: "🎯", title: "Andrabollsspel", text: "Om bollen saknar ägare – TA DEN!" },
        { emoji: "⚡", title: "Felvända löpningar", text: "Vid bollförlust – direkt omställning!" },
        { emoji: "👁️", title: "Spelbarhet", text: "Rörelse utan boll och position i farligaste ytan." },
        { emoji: "🏃", title: "Spring alltid i djupled!", text: "Alltid – oavsett läge.", accent: true },
      ].map((item) => (
        <div key={item.title} className="space-y-3">
          <div className={`bg-card/85 backdrop-blur-sm rounded-xl p-5 border ${item.accent ? "border-accent/25" : "border-border"} shadow-sm card-hover`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${item.accent ? "bg-accent/15" : "bg-primary/8"} flex items-center justify-center`}>
                <span className="text-sm">{item.emoji}</span>
              </div>
              <h4 className={`text-xs font-bold uppercase tracking-[0.15em] ${item.accent ? "text-accent-foreground" : "text-primary"}`}>{item.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-medium">{item.text.split("–")[0]}</strong>
              {item.text.includes("–") ? `–${item.text.split("–").slice(1).join("–")}` : ""}
            </p>
          </div>
          {item.title === "Spelbarhet" ? (
            <ExpandableImage src={spelbarhetInfografik} alt="Spelbarhet infografik" />
          ) : (
            <ImagePlaceholder title={item.title} description={`Bild/film: ${item.title}`} compact />
          )}
        </div>
      ))}
    </div>

    <Matetal className="mb-8" />

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
);

/* FÖRSVARSSPEL */
export const ForsvarsspelSection = () => (
  <section id="forsvarsspel">
    <SectionHeader badge="Försvarsspel" title="5 Försvarsprinciper" subtitle="Vi skyddar vårt mål som en fästning: stäng dörren centralt, styr dem utåt." />
    <div className="mb-8">
      <TrainingVideo title="4-3-3 Försvarsspel förklarat" url="https://www.youtube.com/watch?v=jJGwvHb8fWs" duration="6:45" />
    </div>
    <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PrincipleCardWrap n={1} title="Aldrig mellan, aldrig i oss" description="Ingen passning mellan våra linjer. Om de spelar i oss = 100% satsning." />
        <PrincipleCardWrap n={2} title="Trigger: deras vänsterback" description="Press startar när de spelar till sin VB. Kollektiv insats för att vinna bollen." />
        <PrincipleCardWrap n={3} title="Splitta planen vid sidval" description="När de valt sida, splitta planen. Bortre spelare säkrar central korridor." />
        <PrincipleCardWrap n={4} title="Försvara i tre korridorer" description="Stäng inre korridorer, tryck motståndet mot yttre. Central korridor = prio." />
        <PrincipleCardWrap n={5} title="Om bollen är 'I' oss = maximal ansträngning" description="Se till att vinna 1, få den till bättre yta 2. Styr alltid mot yttre korridor." />
      </div>
      <div className="flex flex-col gap-3">
        <ImagePlaceholder title="Försvarsspel" description="Bild på kompakt försvar" />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-5 mb-10">
      <div className="bg-card/85 backdrop-blur-sm rounded-xl p-6 border border-destructive/15 shadow-sm card-hover">
        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-destructive mb-3">Restförsvar +1</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">Alltid en spelare mer i restförsvaret än vad motståndaren har framåt.</p>
      </div>
      <div className="bg-card/85 backdrop-blur-sm rounded-xl p-6 border border-primary/15 shadow-sm card-hover">
        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">Vid ledning: +2</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">Extra säkerhet när vi leder. Ingen kontring ska gå igenom.</p>
      </div>
    </div>

    <div className="mb-10">
      <h3 className="text-lg font-bold text-foreground mb-1.5">Pressfälla: Deras Vänsterback</h3>
      <p className="text-sm text-muted-foreground mb-5">Formation + höjd skapar pressfällan. Vi vill se passningen till deras VB.</p>
      <div className="grid md:grid-cols-2 gap-6">
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
    </div>

    <Matetal className="mb-8" />

    <AccordionSection title="Visa G/IG-mallar — Försvarsspel">
      <div className="space-y-3">
        <GIGTemplate cueTitel="Princip 1: Aldrig mellan, aldrig i oss" definition="Ingen passning mellan våra linjer." narAnvands="När motståndare försöker spela genom våra linjer centralt." handling="Stäng passningsvägar centralt. Om boll kommer i oss: 100% satsning." gVillkor="0 genomspelade centrala passningar per halvlek" igVillkor="> 3 centrala passningar per halvlek" />
        <GIGTemplate cueTitel="Princip 2: Trigger deras VB" definition="Press startar vid pass till deras vänsterback." narAnvands="När motståndare bygger via sin vänsterback." beslutstrigger="Pass till deras VB" handling="Kollektiv insats. Splitta planen. Hindra spelvändning." gVillkor="Spelvändning förhindrad i ≥ 80% av tillfällen" igVillkor="Motståndare spelvänder fritt" />
        <GIGTemplate cueTitel="Restförsvar +1" definition="Alltid en extra spelare bakom bollen." narAnvands="Alltid i försvarsspelet." handling="+1 spelare i restförsvar. Vid ledning: +2." gVillkor="0 mål insläppta via kontringar" igVillkor="Mål insläppt via kontring pga saknad restförsvarsspelare" />
        <GIGTemplate cueTitel="Pressfälla: Deras Vänsterback" definition="Vi vill se passningen till deras VB och pressa kollektivt." narAnvands="När motståndare bygger via sin vänsterback." beslutstrigger="Pass till deras VB" handling="1. 100% insats — vinn bollen. 2. Splitta planen. 3. HINDRA SPELVÄNDNING." gVillkor="Spelvändning förhindrad ≥ 80%" igVillkor="Motståndare spelvänder fritt efter pressfälla" />
      </div>
    </AccordionSection>
  </section>
);

import PrincipleCard from "@/components/PrincipleCard";
const PrincipleCardWrap = ({ n, title, description }: { n: number; title: string; description: string }) => (
  <PrincipleCard number={n} title={title} description={description} variant="defense" />
);

/* OMSTÄLLNING TILL ANFALL */
export const OmstallningAnfallSection = () => (
  <section id="omstallning-till-anfall">
    <SectionHeader badge="Omställning till anfall" title="Bollvinst → Framåt" subtitle="När vi vinner bollen sover vi inte — vi tittar framåt direkt." />
    <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-8">
      <div>
        <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
          <p className="text-sm text-center font-medium text-primary">
            <strong>Se även:</strong>{" "}
            <a href="/spelide#generellt" className="underline decoration-primary/30 hover:decoration-primary transition-colors">
              Pseudokontring-processen (Spelidé)
            </a>
          </p>
        </div>
        <ul className="space-y-2.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Rättvänd → spelvändning → full fart framåt</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Första framåtaktion inom 3 sekunder</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Sök assistytan direkt</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <ImagePlaceholder title="Omställning till anfall" description="Bild på snabb omställning" />
      </div>
    </div>

    <Matetal className="mb-8" />

    <AccordionSection title="Visa G/IG-mallar — Omställning till anfall">
      <div className="space-y-3">
        <GIGTemplate cueTitel="Rättvänd → Spelvändning → Full fart" definition="Rättvänd → spelvändning → full fart framåt" narAnvands="Direkt efter bollvinst — om rättvänd spelare får bollen." beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)" handling="Spelvändning omedelbart. Full fart framåt. Sök assistytan." gVillkor="Framåtaktion inom 3 sekunder" igVillkor="Bakåtspel eller stillastående > 5 sekunder" />
        <MissingInputPlaceholder needed="Omställning till anfall-principer (bollvinst-triggers, första 3 sekundernas regler)" formatNeeded="3–7 punkter + 1 diagramlänk" source="matchmodell" owner="tränare" />
      </div>
    </AccordionSection>
  </section>
);

/* ANFALLSSPEL */
export const AnfallsspelSection = () => (
  <section id="anfallsspel">
    <SectionHeader badge="Anfallsspel" title="3-2-2-3 Struktur" subtitle="Vi bygger upp, sedan accelererar vi — som att växla från lågt till högt gear." />
    <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-10">
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

    <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-sm mb-12">
      <SectionHeader badge="Spelytor" title="Spelytor" subtitle="Planen är fyra korridorer. Vi vill veta var bollen är, och vad vi ska göra i just den korridoren." className="mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { name: "Utgångsyta", desc: "Här startar vi – nära vår målvakt och våra första passningar.", bg: "bg-muted/40", border: "border-border" },
          { name: "Spelyta 1", desc: "Här bygger vi upp och letar nästa passning framåt.", bg: "bg-primary/3", border: "border-primary/15" },
          { name: "Spelyta 2", desc: "Här i mitten vill vi spela oss förbi och komma loss.", bg: "bg-primary/6", border: "border-primary/20" },
          { name: "Spelyta 3", desc: "Nära deras mål – här vill vi skapa chans och avslut.", bg: "bg-accent/8", border: "border-accent/20" },
        ].map((zone) => (
          <div key={zone.name} className={`${zone.bg} rounded-xl p-4 border ${zone.border} card-hover`}>
            <h5 className="text-sm font-semibold text-foreground mb-1">{zone.name}</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">{zone.desc}</p>
          </div>
        ))}
      </div>
      <ExpandableImage src={spelytorPlanbild} alt="Spelytor — planbild med zoner" />

      <div className="mt-10 mb-10">
        <KorridorerDiagram />
      </div>

      <SectionHeader badge="Korridorer" title="Inre & Yttre Korridorer" subtitle="Vi spelar alltid via inre korridor när möjligt. Yttre = sista utväg." className="mb-8" />
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        <SpelytorDiagram />
        <GoldenZoneDiagram />
      </div>
    </div>

    <div className="mb-10">
      <h3 className="text-lg font-bold text-foreground mb-1.5">Spelvändning → acceleration</h3>
      <p className="text-sm text-muted-foreground mb-5">När en rättvänd spelare i progression vänder spelet utlöser det full fart mot gyllene zonen.</p>
      <div className="mb-6">
        <TrainingVideo title="3-2-2-3 Anfallsspel förklarat" url="https://www.youtube.com/shorts/yGyPL4PZD_Q" duration="0:59" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/taktiktavla"
          className="group relative bg-card/85 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm card-hover flex flex-col justify-center min-h-[280px]"
        >
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-3">Verktyg</div>
          <h4 className="text-xl font-black text-foreground mb-2 tracking-tight">Öppna taktiktavlan</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Dra spelare med siffror 1–11, byt formation, visa korridorer och resonera kring sekvensen i en enkel pluppmatta.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
            Öppna taktiktavla <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <div className="space-y-4">
          <div className="bg-card/85 backdrop-blur-sm rounded-xl p-5 border border-accent/20 shadow-sm card-hover">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-accent-foreground mb-3">Anfallssekvens</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>1. Rättvänd spelare centralt slår spelvändning</li>
              <li>2. Full fart i inre/yttre korridor</li>
              <li>3. Överlapp/underlapp mot kortsidan</li>
              <li>4. Cutback till gyllene zonen</li>
            </ul>
          </div>
          <TriggerCard number={1} condition="rättvänd mellan motståndarens lagdelar" action="spelvändning → full fart via inre korridor" variant="attack" />
          <TriggerCard number={2} condition="inre korridor låst" action="spelvänd via 6:a + inverterad → full fart" variant="attack" />
        </div>
      </div>
    </div>

    <Matetal className="mb-8" />

    <AccordionSection title="Visa G/IG-mallar — Anfallsspel">
      <div className="space-y-3">
        <GIGTemplate cueTitel="3-2-2-3 Struktur" definition="Varje linje har tydliga uppgifter. VM = 8:a, HM = 7:a." narAnvands="Alltid i anfallsspelet." handling="Backlinje (3): uppbyggnad. Bas (2): 6:a + inv. YB. Offensiva MF (2): 8:a + 7:a. Högsta (3): Yttrar + 9:a." gVillkor="Samtliga linjer besatta vid uppspel" igVillkor="Linjer saknar spelare → för stor distans" />
        <GIGTemplate cueTitel="Inre & Yttre Korridorer" definition="Vi spelar alltid via inre korridor när möjligt." narAnvands="Alltid i anfallsspelet." handling="Prioritera passningar via inre korridor. Yttre = sista utväg." gVillkor="≥ 60% progressioner via inre korridor" igVillkor="Majoriteten av progressioner via yttre" />
        <GIGTemplate cueTitel="Spelvändning → acceleration" definition="Rättvänd spelare centralt vänder spelet och utlöser full fart mot gyllene zonen." narAnvands="När rättvänd mottagning skapats i progression." handling="1. Spelvändning. 2. Full fart. 3. Överlapp/underlapp. 4. Cutback till gyllene zonen." gVillkor="Cutback till gyllene zonen genomförd" igVillkor="Rättvänd spelare hittad men ingen acceleration" />
      </div>
    </AccordionSection>
  </section>
);

/* OMSTÄLLNING TILL FÖRSVAR */
export const OmstallningForsvarSection = () => (
  <section id="omstallning-till-forsvar">
    <SectionHeader badge="Omställning till försvar" title="Bollförlust → Jaga eller falla" subtitle="När vi tappar bollen jagar vi tillsammans direkt — eller faller tillbaka tillsammans. Inget kaos." />
    <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-8">
      <div>
        <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
          <p className="text-sm text-center font-medium text-primary">
            <strong>Se även:</strong>{" "}
            <a href="/forsvar#forsvarsspel" className="underline decoration-primary/30 hover:decoration-primary transition-colors">
              Restförsvar +1 / +2 (Försvar)
            </a>
          </p>
        </div>
        <ul className="space-y-2.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Närmaste spelare pressar boll direkt</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Omgivande spelare stänger passningsvägar</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Om ej återvunnen inom 5s: falla tillbaka kompakt</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <ImagePlaceholder title="Omställning till försvar" description="Bild på counterpress" />
      </div>
    </div>

    <Matetal className="mb-8" />

    <AccordionSection title="Visa G/IG-mallar — Omställning till försvar">
      <div className="space-y-3">
        <GIGTemplate cueTitel="Direkt bollåtererövring" definition="Vid bollförlust — direkt press för att återvinna inom 5 sekunder" narAnvands="Direkt efter bollförlust i motståndarens planhalva" beslutstrigger="Bollförlust → närmaste 2–3 spelare pressar" handling="1. Närmaste spelare pressar boll. 2. Stäng passningsvägar. 3. Om ej 5s: falla tillbaka kompakt." gVillkor="≥ 40% bollåtererövring inom 5s" igVillkor="Spelare reagerar inte / laget splittrat" />
        <MissingInputPlaceholder needed="Omställning till försvar-regler (första 5 sekunderna, vem pressar, vem täcker)" formatNeeded="5–9 punkter + 2 exempel" source="matchmodell + träningsmodell" owner="tränare/analytiker" />
      </div>
    </AccordionSection>
  </section>
);

/* FASTA SITUATIONER */
export const FastaSection = () => (
  <section id="fasta-situationer">
    <SectionHeader badge="Fasta situationer" title="Defensivt: Hybrid + 2 Man" subtitle="När spelet stannar (hörna/frispark) har vi fortfarande regler. Vi gissar inte." />
    <div className="grid md:grid-cols-2 gap-6 mb-10">
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

    <div className="mb-10">
      <h3 className="text-lg font-bold text-foreground mb-5">Bilder & diagram</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ExpandableImage src={offensivHorna} alt="Offensiv hörna — spelarpositioner" />
        <ExpandableImage src={hornaTyper} alt="Olika sätt att slå hörnor" />
        <ExpandableImage src={defensivHorna} alt="Defensiv hörna — zonförsvar" />
        <ExpandableImage src={forsvarMotHorna} alt="Analys av hörnsekvenser" />
        <ImagePlaceholder title="Inläggsfrispark — offensiv" description="Bild/film" compact />
        <ImagePlaceholder title="Inläggsfrispark — defensiv" description="Bild/film" compact />
        <ImagePlaceholder title="Direkt frispark — offensiv" description="Bild/film" compact />
        <ImagePlaceholder title="Direkt frispark — defensiv" description="Bild/film" compact />
      </div>
    </div>

    <Matetal className="mb-8" />

    <AccordionSection title="Visa G/IG-mallar — Fasta situationer">
      <div className="space-y-3">
        <GIGTemplate cueTitel="Defensivt: Hybrid + 2 Man" definition="Zonbas i boxen med 2 spelare i strikt man-markering." narAnvands="Alla defensiva fasta situationer." handling="2 MAN: Följ hotet. ZON: Ta första boll — rensa framåt. REST: 2 spelare högre." gVillkor="0 mål insläppta från fasta situationer" igVillkor="≥ 2 mål insläppta från fasta per match" />
        <GIGTemplate cueTitel="Trigger: Kort variant" definition="1 spelare kliver ut, resten håller zon." narAnvands="Vid kort hörnvariant av motståndare." handling="1 spelare kliver ut. Resten håller zon." gVillkor="Kort hörna neutraliserad — ingen skottchans" igVillkor="Kort hörna leder till skottchans" />
        <GIGTemplate cueTitel="Trigger: Lång/inswing" definition="Zon attackerar boll, man-markörer låser hot." narAnvands="Vid lång hörna / inswing." handling="Zonspelare attackerar bollen. Man-markörer låser sina hot." gVillkor="Boll rensad vid ≥ 80% av långa hörnor" igVillkor="Motståndare nickar fritt i boxen" />
        <MissingInputPlaceholder needed="Hörnor för, frisparkar för, inkast, straffar" formatNeeded="punkter + diagram" source="fasta situationer-manus" owner="tränare" />
      </div>
    </AccordionSection>
  </section>
);

/* ROLLER + EXEMPEL + MATCHTRUPP + KVALITET */
export const RollerSection = () => (
  <section id="roller-positioner">
    <SectionHeader badge="Roller" title="Roller & positioner" />
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <ImageLinkCard title="Mittfält – beslutsnav" bullet="Mittfältarna styr tempot och beslutar om spelvändning." />
      <ImageLinkCard title="Inverterad ytterback – numerärt övertag centralt" bullet="Vänsterbacken inverterar för att skapa bas med 6:an." />
    </div>
  </section>
);

export const MatchExempelSection = () => (
  <section id="exempel-match">
    <SectionHeader badge="Exempel" title="Exempel från match" subtitle="En situation, ett beslut, ett resultat." />
    <MatchExampleTimeline />
  </section>
);

export const MatchtruppSection = () => (
  <section id="matchtrupp">
    <SectionHeader badge="Matchdag" title="Matchtrupp & Ansvarsområden" subtitle="Fyll i dagens matchtrupp och tilldela specialroller inför varje match." />
    <MatchSquad />
  </section>
);

export const KvalitetSection = () => (
  <section id="quality-control">
    <SectionHeader badge="Kvalitetskontroll" title="Mätetal & Lärdom" subtitle="Enkel uppföljning efter match." />
    <div className="grid md:grid-cols-3 gap-5 mb-8">
      {[
        { label: "PPDA", placeholder: "Värde" },
        { label: "Spelvändningar", placeholder: "Antal / typ" },
        { label: "Inspel till assistytan", placeholder: "Antal / kvalitet" },
      ].map((item) => (
        <div key={item.label} className="bg-card/85 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm card-hover">
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">{item.label}</h4>
          <input type="text" placeholder={item.placeholder} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2.5 mb-3 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
          <textarea placeholder="Kort anteckning" rows={2} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2.5 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
        </div>
      ))}
    </div>
    <div className="bg-card/85 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground mb-4">Lärdom (1–3 meningar)</h4>
      <textarea placeholder="Vad lärde vi oss idag?" rows={3} className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2.5 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
    </div>
  </section>
);

export const HeroBadges = () => (
  <div className="flex flex-wrap gap-2.5">
    <CoachCue cue="Invertera tidigt" variant="primary" />
    <CoachCue cue="Rättvänd → spelvändning → full fart" variant="accent" />
    <CoachCue cue="Korta avstånd" variant="muted" />
  </div>
);
