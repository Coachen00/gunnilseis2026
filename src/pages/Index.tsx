import InteractiveFootballPitch, { Formation } from "@/components/InteractiveFootballPitch";
import TriggerCard from "@/components/TriggerCard";
import CoachCue from "@/components/CoachCue";
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
import KPIBox from "@/components/KPIBox";
import MissingInputPlaceholder from "@/components/MissingInputPlaceholder";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import MatchSquad from "@/components/MatchSquad";

// Formation presets for interactive pitch
// VYB = id 2, HYB = id 5 - samma nummer i båda formationer
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

import LogoutButton from "@/components/LogoutButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Navy background with Gold accents */}
      <header className="relative overflow-hidden hero-gradient">
        {/* Logout button */}
        <div className="absolute top-4 right-4 z-10">
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

      {/* Category Navigation */}
      <CategoryNav />

      <main className="container pb-20 space-y-20 pt-10">

        {/* ============================================================ */}
        {/* SECTION 1: GENERELLT */}
        {/* ============================================================ */}
        <section id="generellt">
          <SectionHeader 
            badge="Generellt"
            title="Vår spelkarta"
            subtitle="Det här är vår karta. Som trafikljus och växellådor: den visar oss när vi ska sakta ner, bygga eller köra full fart."
          />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-8">
            <div>
              {/* A) Existing material: Färglogik (Röd/Gul/Grön) — verbatim */}
              <h3 className="text-lg font-bold text-foreground mb-4">Röd → Gul → Grön</h3>
              <p className="text-sm text-muted-foreground mb-6">Tre faser som styr vårt anfallsspel – från kontroll till attack.</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl p-5 border-2 border-zone-defense bg-zone-defense/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full bg-zone-defense" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zone-defense">RÖD</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vi kan inte spelvända. Vi har inte kontroll.
                  </p>
                </div>
                <div className="rounded-xl p-5 border-2 border-zone-midfield bg-zone-midfield/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full bg-zone-midfield" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zone-midfield">GUL</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vi börjar överbelasta (flyttar motståndare till vald kant).
                  </p>
                </div>
                <div className="rounded-xl p-5 border-2 border-zone-attack bg-zone-attack/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full bg-zone-attack" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zone-attack">GRÖN</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vi har skapat oordning och är i fas att spelvända för attack mot deras box.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Röd/Gul/Grön översikt" description="Bild som visar färgfaserna" />
            </div>
          </div>

          {/* Existing material: Pseudokontring — verbatim */}
          <h3 className="text-lg font-bold text-foreground mb-2">Gul → Grön → Full fart</h3>
          <p className="text-sm text-muted-foreground mb-4">Rättvänd → spelvändning → full fart framåt.</p>
          
          <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-sm text-center font-medium text-primary">
              <strong>Koppling:</strong> Kontroll → 3:a centralt (Grön) → Spelvändning → startar Pseudokontring
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Pseudokontrings-processen</h4>
              <ol className="space-y-3 text-sm text-muted-foreground list-none">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-zone-midfield/20 text-zone-midfield text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <span><strong className="text-foreground">GUL: Flytta motståndare</strong> – Överbelasta en kant.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-zone-attack/20 text-zone-attack text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <span><strong className="text-foreground">GRÖN: 3:a centralt rättvänd</strong> – Oordning skapad, redo att vända.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <span><strong className="text-foreground">Spelvändning</strong> – Till motsatt kant → full fart.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                  <span><strong className="text-foreground">Överlapp/underlapp</strong> – I den nya kanten.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">5</span>
                  <span><strong className="text-foreground">Mål:</strong> Kortsidan i assistytan → cutback → golden zone.</span>
                </li>
              </ol>
              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-xs text-foreground text-center font-medium">
                  <strong>Minnesrad:</strong> "Gul: överbelasta → Grön: spelvänd → full fart → kortsida → cutback → golden zone."
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-5 border border-primary/30">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Rättvänd = Spelvändning + Fart</h4>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Rättvänd →</strong> spelvändning → full fart framåt
                </p>
              </div>
              <div className="bg-card rounded-xl p-5 border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Cue "1–2–3"</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-defense/20 text-zone-defense text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span><strong className="text-foreground">SÄKRA</strong> – Spela enkelt/säkert. Ingen vändning. Behåll kontroll.</span>
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
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-10">
            <CoachCue cue="1–2–3" variant="accent" />
            <CoachCue cue="Rättvänd → spelvändning → full fart" variant="primary" />
          </div>

          {/* B) G/IG Templates — Generellt */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Generellt</h3>
          <div className="space-y-4 mb-10">
            <GIGTemplate
              cueTitel="RÖD"
              definition="Vi kan inte spelvända. Vi har inte kontroll."
              narAnvands="När motståndaren pressar högt och vi saknar passningsvägar framåt."
              beslutstrigger="Cue 1 (SÄKRA)"
              handling="Spela enkelt/säkert. Ingen vändning. Behåll kontroll."
              roller="Alla — särskilt mittfältare och backlinje [INFERRED]"
              kpi="Bollförluster i uppspel (lägre = bättre) [INFERRED KPI OPTION]"
              gVillkor="Inga bollförluster i egen spelyta under RÖD fas [INFERRED]"
              igVillkor="Bollförlust i egen spelyta som leder till skottchans [INFERRED]"
            />
            <GIGTemplate
              cueTitel="GUL"
              definition="Vi börjar överbelasta (flyttar motståndare till vald kant)."
              narAnvands="När vi har kontroll men inte kan spelvända ännu."
              beslutstrigger="Cue 2 (FÖRBÄTTRA)"
              handling="Överbelasta en kant. Flytta motståndare. Skapa bättre vinkel/läge inom spelytan."
              roller="Mittfält + ytterback inverterad [INFERRED]"
              kpi="Progressioner / korridoranvändning (antal) [INFERRED KPI OPTION]"
              gVillkor="Lyckad överbelastning som skapar GRÖN situation [INFERRED]"
              igVillkor="Misslyckad överbelastning → motståndare återtar position [INFERRED]"
            />
            <GIGTemplate
              cueTitel="GRÖN"
              definition="Vi har skapat oordning och är i fas att spelvända för attack mot deras box."
              narAnvands="När motståndaren är oorganiserad och vi har en rättvänd spelare centralt."
              beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)"
              handling="Vänd/accelerera: framåt, sök assistytan. Spelvändning → full fart."
              roller="3:a centralt (rättvänd), yttar, 9:a [INFERRED]"
              kpi="Skott eller xG inom 10s efter GRÖN-aktivering [INFERRED KPI OPTION]"
              gVillkor="Spelvändning genomförd → skottchans inom 10s [INFERRED]"
              igVillkor="GRÖN identifierad men ingen spelvändning/acceleration [INFERRED]"
            />
            <GIGTemplate
              cueTitel="CUE 1 — SÄKRA"
              definition="Spela enkelt/säkert. Ingen vändning. Behåll kontroll."
              narAnvands="Spelare i ryggen, press, ingen fri passning framåt."
              beslutstrigger="1"
              handling="Spela enkelt/säkert. Ingen vändning. Behåll kontroll."
              roller="Alla spelare [INFERRED]"
              kpi="Bollinnehav under press (%) [INFERRED KPI OPTION]"
              gVillkor="Boll behålls utan förlust [INFERRED]"
              igVillkor="Bollförlust under SÄKRA-läge [INFERRED]"
            />
            <GIGTemplate
              cueTitel="CUE 2 — FÖRBÄTTRA"
              definition="Skapa bättre vinkel/läge inom spelytan."
              narAnvands="Vi har boll men kan skapa bättre position."
              beslutstrigger="2"
              handling="Skapa bättre vinkel/läge inom spelytan."
              roller="Mittfältare, inverterad ytterback [INFERRED]"
              kpi="Progressioner genom inre korridor (antal) [INFERRED KPI OPTION]"
              gVillkor="Bättre vinkel skapad → ny passningsväg öppnad [INFERRED]"
              igVillkor="Sidledspass utan förbättring [INFERRED]"
            />
            <GIGTemplate
              cueTitel="CUE 3 — VÄXLA / VÄNDLÄGE"
              definition="Vänd/accelerera: framåt, sök assistytan."
              narAnvands="Rättvänd i spelyta 2 eller 3, motståndare oorganiserade."
              beslutstrigger="3"
              handling="Vänd/accelerera: framåt, sök assistytan."
              roller="Offensiva mittfältare, yttrar [INFERRED]"
              kpi="Spelvändningar som leder till skottchans (antal) [INFERRED KPI OPTION]"
              gVillkor="Acceleration genomförd → assistyta nådd [INFERRED]"
              igVillkor="Rättvänd men väljer bakåtpass [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Pseudokontring (process)"
              definition="Gul: överbelasta → Grön: spelvänd → full fart → kortsida → cutback → golden zone."
              narAnvands="När GUL övergår till GRÖN — kontroll → 3:a centralt → spelvändning."
              beslutstrigger="Sekventiellt: GUL → GRÖN → Cue 3"
              handling="1. Överbelasta kant. 2. 3:a centralt rättvänd. 3. Spelvändning till motsatt kant. 4. Överlapp/underlapp. 5. Kortsida → cutback → golden zone."
              roller="Alla anfallsspelare + inverterad ytterback [INFERRED]"
              kpi="Pseudokontringar som slutar i skott (antal) [INFERRED KPI OPTION]"
              gVillkor="Hela sekvensen genomförd → cutback till golden zone [INFERRED]"
              igVillkor="Sekvens avbruten före spelvändning [INFERRED]"
            />
          </div>

          {/* C) KPIs — Generellt */}
          <KPIBox
            title="KPI:er — Generellt"
            kpis={[
              { name: "PPDA", definition: "Pressintensitet (lägre = mer intensivt)", target: "[SAKNAS — fyll i mål-PPDA]", measurement: "Videokodning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Höga bollvinster", definition: "Antal höga bollvinster", target: "[SAKNAS — mål för höga bollvinster]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Höga bollvinster → skott", definition: "Höga bollvinster som leder till skott", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "xG per match", definition: "Förväntade mål skapat av laget", target: "[SAKNAS — xG-mål]", measurement: "Statistikverktyg [INFERRED]", failThreshold: "[SAKNAS]" },
            ]}
          />
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: IDENTITET */}
        {/* ============================================================ */}
        <section id="identitet">
          <SectionHeader 
            badge="Identitet"
            title="Vilka vill vi vara?"
            subtitle="Det här är vilka vi är varje dag — lagets uppförande på planen."
          />

          {/* A) Existing material — verbatim identity cards */}
          <p className="text-sm text-muted-foreground mb-6">Beteenden på planen som bygger vår identitet.</p>
          
          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-5 border-2 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-black text-sm">⚔️</span>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Duellspel</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Du ska <strong className="text-foreground">aldrig förlora en duell</strong> – i sämsta fall oavgjort.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-5 border-2 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-black text-sm">🎯</span>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Andrabollsspel</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Om bollen saknar ägare – <strong className="text-foreground">TA DEN!</strong>
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-5 border-2 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-black text-sm">⚡</span>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Felvända löpningar</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vid bollförlust – <strong className="text-foreground">direkt omställning!</strong>
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-5 border-2 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-black text-sm">👁️</span>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Spelbarhet</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Rörelse utan boll</strong> och position i farligaste ytan.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-5 border-2 border-accent/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-black text-sm">🏃</span>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Spring alltid i djupled!</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Alltid</strong> – oavsett läge.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Identitet" description="Bild som representerar lagets identitet" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-10">
            <CoachCue cue="Vinn duellen" variant="primary" />
            <CoachCue cue="Ta andrabollen" variant="primary" />
            <CoachCue cue="Omställning direkt" variant="accent" />
          </div>

          {/* B) G/IG Templates — Identitet */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Identitet</h3>
          <div className="space-y-4 mb-10">
            <GIGTemplate
              cueTitel="Duellspel"
              definition="Du ska aldrig förlora en duell – i sämsta fall oavgjort."
              narAnvands="Varje duellsituation på planen — luftdueller, markdueller, 1v1 [INFERRED]"
              handling="Gå in med 100% — vinn kropp, vinn boll, eller åtminstone oavgjort."
              roller="Alla spelare [INFERRED]"
              kpi="Duellvinst-% (antal vunna / antal engagerade) [INFERRED KPI OPTION]"
              gVillkor="Duellvinst ≥ 50% individuellt [INFERRED]"
              igVillkor="Duellvinst < 40% eller undviker dueller [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Andrabollsspel"
              definition="Om bollen saknar ägare – TA DEN!"
              narAnvands="Efter varje duell, nickduell, lös boll [INFERRED]"
              handling="Reagera direkt. Ta bollen. Ingen passivitet."
              roller="Alla spelare — särskilt mittfält [INFERRED]"
              kpi="Andrabolls-vinst % [INFERRED KPI OPTION]"
              gVillkor="Laget vinner ≥ 60% av andrabollar [INFERRED]"
              igVillkor="Laget förlorar andrabollar konsekvent → motståndare får kontroll [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Felvända löpningar"
              definition="Vid bollförlust – direkt omställning!"
              narAnvands="Varje gång vi förlorar bollen [INFERRED]"
              handling="Direkt omställning. Löp tillbaka / mot boll omedelbart."
              roller="Alla spelare [INFERRED]"
              kpi="Omställningstid efter bollförlust (sekunder) [INFERRED KPI OPTION]"
              gVillkor="Omställning påbörjad inom 2s [INFERRED]"
              igVillkor="Spelare stannar kvar / reagerar inte vid bollförlust [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Spelbarhet"
              definition="Rörelse utan boll och position i farligaste ytan."
              narAnvands="Alltid när lagkamrat har boll [INFERRED]"
              handling="Rörelse utan boll för att bli spelbar i farlig yta."
              roller="Alla utespelare [INFERRED]"
              kpi="Antal passningsalternativ per bollinnehav [INFERRED KPI OPTION]"
              gVillkor="≥ 2 passningsalternativ vid varje bollinnehav [INFERRED]"
              igVillkor="Spelare statisk utan rörelse [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Spring alltid i djupled!"
              definition="Alltid – oavsett läge."
              narAnvands="Varje anfallssituation [INFERRED]"
              handling="Alltid löp i djupled — skapa djup oavsett om boll kommer eller ej."
              roller="Alla anfallsspelare [INFERRED]"
              kpi="Antal djupledslöpningar per 10 min [INFERRED KPI OPTION]"
              gVillkor="≥ 3 djupledslöpningar per 10 min per spelare [INFERRED]"
              igVillkor="Inga djupledslöpningar under en halvlek [INFERRED]"
            />
          </div>

          {/* C) KPIs — Identitet */}
          <KPIBox
            title="KPI:er — Identitet"
            kpis={[
              { name: "Andrabolls-vinst %", definition: "Vunna andrabollar / totalt antal andrabollar", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Djupledslöpningar / 10 min", definition: "Antal löpningar i djupled per 10 minuter", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Satsningsgrad (dueller)", definition: "Dueller engagerade / möjliga dueller", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
            ]}
          />
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: FÖRSVARSSPEL */}
        {/* ============================================================ */}
        <section id="forsvarsspel">
          <SectionHeader 
            badge="Försvarsspel"
            title="5 Försvarsprinciper"
            subtitle="Vi skyddar vårt mål som en fästning: stäng dörren centralt, styr dem utåt."
          />

          {/* A) Existing material — verbatim */}
          <p className="text-sm text-muted-foreground mb-6">Kompakta regler för att styra spelet utåt och skydda centralt.</p>

          {/* Video */}
          <div className="mb-6">
            <TrainingVideo 
              title="4-3-3 Försvarsspel förklarat"
              url="https://www.youtube.com/watch?v=jJGwvHb8fWs"
              duration="6:45"
            />
          </div>
          
          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PrincipleCard 
                number={1}
                title="Aldrig mellan, aldrig i oss"
                description="Ingen passning mellan våra linjer. Om de spelar i oss = 100% satsning."
                variant="defense"
              />
              <PrincipleCard 
                number={2}
                title="Trigger: deras vänsterback"
                description="Press startar när de spelar till sin VB. Kollektiv insats för att vinna bollen."
                variant="defense"
              />
              <PrincipleCard 
                number={3}
                title="Splitta planen vid sidval"
                description="När de valt sida, splitta planen. Bortre spelare säkrar central korridor."
                variant="defense"
              />
              <PrincipleCard 
                number={4}
                title="Försvara i tre korridorer"
                description="Stäng inre korridorer, tryck motståndet mot yttre. Central korridor = prio."
                variant="defense"
              />
              <PrincipleCard 
                number={5}
                title="Om bollen är 'I' oss = maximal ansträngning"
                description="Se till att vinna 1, få den till bättre yta 2. Styr alltid mot yttre korridor."
                variant="defense"
              />
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Försvarsspel" description="Bild på kompakt försvar" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <CoachCue cue="Styr ut" variant="muted" />
            <CoachCue cue="Stäng inåt" variant="muted" />
            <CoachCue cue="Korta avstånd" variant="muted" />
            <CoachCue cue="100% satsning" variant="muted" />
          </div>

          {/* Restförsvar — verbatim */}
          <h3 className="text-lg font-bold text-foreground mb-2">Restförsvar +1</h3>
          <p className="text-sm text-muted-foreground mb-4">Alltid en extra spelare bakom bollen. Vid ledning: +2.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-zone-defense/30 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-zone-defense mb-4">Standard</h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-zone-defense/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-zone-defense">+1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alltid en spelare mer i restförsvaret än vad motståndaren har framåt.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-primary/30 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Vid ledning</h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-black text-primary">+2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Extra säkerhet när vi leder. Ingen kontring ska gå igenom.
                </p>
              </div>
            </div>
          </div>

          {/* Pressfälla — verbatim */}
          <h3 className="text-lg font-bold text-foreground mb-2">Pressfälla: Deras Vänsterback</h3>
          <p className="text-sm text-muted-foreground mb-4">Formation + höjd skapar pressfällan. Vi vill se passningen till deras VB.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <TriggerCard 
                number={1}
                condition="pass till deras VB"
                action="100% insats – vinn bollen"
                variant="defense"
              />
              <TriggerCard 
                number={2}
                condition="press sätts"
                action="splitta planen, säkra central korridor"
                variant="defense"
              />
              <TriggerCard 
                number={3}
                condition="ABSOLUT KRAV"
                action="HINDRA SPELVÄNDNING"
                variant="defense"
              />
            </div>
            <div className="space-y-4">
              <MediaPlaceholder 
                type="image"
                title="Pressfälla vänsterback"
                description="Visa positionering vid press"
              />
              <MediaPlaceholder 
                type="image"
                title="Splitta planen"
                description="Bortre spelare säkrar centralt"
              />
              <MediaPlaceholder 
                type="image"
                title="Restförsvar +1"
                description="Kompakthet vid kontring"
              />
            </div>
          </div>
          
          <div className="mb-10">
            <MediaPlaceholder 
              type="video"
              title="Film: Triggers i praktiken"
              description="Presstriggers och kollektiv press"
            />
          </div>

          {/* B) G/IG Templates — Försvarsspel */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Försvarsspel</h3>
          <div className="space-y-4 mb-10">
            <GIGTemplate
              cueTitel="Princip 1: Aldrig mellan, aldrig i oss"
              definition="Ingen passning mellan våra linjer. Om de spelar i oss = 100% satsning."
              narAnvands="När motståndare försöker spela genom våra linjer centralt."
              handling="Stäng passningsvägar centralt. Om boll kommer I oss: 100% satsning."
              roller="Hela laget — särskilt mittfält och backlinje [INFERRED]"
              kpi="Passningar tillåtna genom linjer (antal, lägre = bättre) [INFERRED KPI OPTION]"
              gVillkor="0 passningar genom linjer per halvlek [INFERRED]"
              igVillkor="> 3 passningar genom linjer → skottchans [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Princip 2: Trigger — deras vänsterback"
              definition="Press startar när de spelar till sin VB. Kollektiv insats för att vinna bollen."
              narAnvands="När motståndarens vänsterback tar emot bollen."
              beslutstrigger="Pass till deras VB"
              handling="100% insats — vinn bollen. Splitta planen, säkra central korridor."
              roller="HY pressar, mittfält skjuter över, backlinje splittar [INFERRED]"
              kpi="Bollvinster vid pressfälla (antal) [INFERRED KPI OPTION]"
              gVillkor="≥ 50% bollvinst vid trigger [INFERRED]"
              igVillkor="Motståndare spelvänder efter triggern [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Princip 3: Splitta planen vid sidval"
              definition="När de valt sida, splitta planen. Bortre spelare säkrar central korridor."
              narAnvands="När boll är på ena sidan av planen."
              handling="Splitta planen. Bortre spelare täcker centralt."
              roller="Hela försvarslinjen + bortre mittfältare [INFERRED]"
              kpi="Lyckade sidlåsningar (antal) [INFERRED KPI OPTION]"
              gVillkor="Motståndare tvingas spela yttre korridor [INFERRED]"
              igVillkor="Motståndare byter sida fritt → skapar läge [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Princip 4: Försvara i tre korridorer"
              definition="Stäng inre korridorer, tryck motståndet mot yttre. Central korridor = prio."
              narAnvands="Alltid i försvarsspelet."
              handling="Stäng inre korridorer. Tryck motståndare mot yttre."
              roller="Hela laget [INFERRED]"
              kpi="Motståndares anfall via yttre korridor (%) [INFERRED KPI OPTION]"
              gVillkor="≥ 70% av motståndarens anfall via yttre korridor [INFERRED]"
              igVillkor="Motståndare penetrerar inre korridor fritt [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Princip 5: Bollen 'I' oss = maximal ansträngning"
              definition="Se till att vinna 1, få den till bättre yta 2. Styr alltid mot yttre korridor."
              narAnvands="När motståndare lyckas spela genom/i laget."
              handling="Vinn boll (1), eller styr till bättre yta (2). Styr mot yttre."
              roller="Närmaste spelare + täckande [INFERRED]"
              kpi="Tvingade turnovers efter I-situation (antal) [INFERRED KPI OPTION]"
              gVillkor="Boll återvunnen eller styrd utåt [INFERRED]"
              igVillkor="Motståndare skapar skottchans via centralt genombrott [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Restförsvar +1"
              definition="Alltid en spelare mer i restförsvaret än vad motståndaren har framåt."
              narAnvands="Alltid under eget anfall. +2 vid ledning."
              handling="+1 spelare bakom bollen. Vid ledning: +2."
              roller="Backlinje + 6:a [INFERRED]"
              kpi="Skott insläppta efter förlorad restförsvarsform (antal) [INFERRED KPI OPTION]"
              gVillkor="0 kontringsmål insläppta [INFERRED]"
              igVillkor="Mål insläppt via kontring med numerärt underläge [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Pressfälla: Deras Vänsterback"
              definition="Formation + höjd skapar pressfällan. Vi vill se passningen till deras VB."
              narAnvands="När motståndare bygger via sin vänsterback."
              beslutstrigger="Pass till deras VB"
              handling="1. 100% insats — vinn bollen. 2. Splitta planen, säkra central korridor. 3. HINDRA SPELVÄNDNING."
              roller="HY, mittfält, backlinje [INFERRED]"
              kpi="Bollvinster från pressfälla (antal) [INFERRED KPI OPTION]"
              gVillkor="Spelvändning förhindrad i ≥ 80% av tillfällen [INFERRED]"
              igVillkor="Motståndare spelvänder fritt efter pressfälla [INFERRED]"
            />
          </div>

          {/* C) KPIs — Försvarsspel */}
          <KPIBox
            title="KPI:er — Försvarsspel"
            kpis={[
              { name: "PPDA", definition: "Pressintensitet (lägre = mer intensivt)", target: "[SAKNAS]", measurement: "Videokodning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Tvingade turnovers", definition: "Bollvinster via press (antal)", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Skott insläppta efter förlorad restförsvarsform", definition: "Antal skott efter kontringssituation", target: "0 [INFERRED]", measurement: "Videokodning [INFERRED]", failThreshold: "> 2 per match [INFERRED]" },
            ]}
          />
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: OMSTÄLLNING TILL ANFALL */}
        {/* ============================================================ */}
        <section id="omstallning-till-anfall">
          <SectionHeader 
            badge="Omställning till anfall"
            title="Bollvinst → Framåt"
            subtitle="När vi vinner bollen sover vi inte — vi tittar framåt direkt."
          />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div>
              {/* A) Existing material — cross-link to Pseudokontring in Generellt */}
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm text-center font-medium text-primary">
                  <strong>Se även:</strong> <a href="#generellt" className="underline hover:no-underline">Pseudokontring-processen (Generellt)</a> — beskriver hela sekvensen från bollvinst till golden zone.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Omställning till anfall" description="Bild på snabb omställning" />
            </div>
          </div>

          {/* B) G/IG — mostly missing, placeholder */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Omställning till anfall</h3>
          <MissingInputPlaceholder
            needed="Omställning till anfall-principer (bollvinst-triggers, första 3 sekundernas regler, första passens prioriteringar, löpprioriteringar)"
            formatNeeded="3–7 punkter + 1 diagramlänk (om det finns)"
            source="matchmodell"
            owner="tränare"
          />

          <div className="mt-6">
            <GIGTemplate
              cueTitel="Rättvänd → Spelvändning → Full fart (omställning)"
              definition="Rättvänd → spelvändning → full fart framåt"
              narAnvands="Direkt efter bollvinst — om rättvänd spelare får bollen."
              beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)"
              handling="Spelvändning omedelbart. Full fart framåt. Sök assistytan."
              roller="Den som vinner boll + närmaste offensiva spelare [INFERRED]"
              kpi="Tid till första framåtaktion efter bollvinst (sekunder) [INFERRED KPI OPTION]"
              gVillkor="Framåtaktion inom 3 sekunder [INFERRED]"
              igVillkor="Bakåtspel eller stillastående > 5 sekunder [INFERRED]"
            />
          </div>

          {/* C) KPIs */}
          <div className="mt-8">
            <KPIBox
              title="KPI:er — Omställning till anfall"
              kpis={[
                { name: "Tid till framåtaktion efter bollvinst", definition: "Sekunder till första framåtpass/-löpning", target: "< 3s [INFERRED]", measurement: "Videokodning [INFERRED]", failThreshold: "> 5s [INFERRED]" },
                { name: "Höga bollvinster → skott inom 10s", definition: "Antal höga bollvinster som leder till skott inom 10s", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              ]}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: ANFALLSSPEL */}
        {/* ============================================================ */}
        <section id="anfallsspel">
          <SectionHeader 
            badge="Anfallsspel"
            title="3-2-2-3 Struktur"
            subtitle="Vi bygger upp, sedan accelererar vi — som att växla från lågt till högt gear."
          />

          {/* A) Existing material — 3-2-2-3 Struktur — verbatim */}
          <p className="text-sm text-muted-foreground mb-6">Varje linje har tydliga uppgifter. VM = 8:a, HM = 7:a.</p>
          
          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RoleCard 
                line="3"
                players="2 MB + 1 YB"
                description="Första linjen i uppbyggnad. Den ytterback som inte inverterar stannar som tredje spelare bak."
                variant="defense"
              />
              <RoleCard 
                line="2"
                players="6:a + Inv. YB"
                description="Basen. Säkrar spelvändning och kontringsskydd centralt. 6:an alltid 'pilen nedåt'."
                variant="midfield"
              />
              <RoleCard 
                line="2"
                players="8:a + 7:a"
                description="Offensiva mittfältare som söker spelbarhet i inre korridorer. VM = 8:a, HM = 7:a."
                variant="midfield"
              />
              <RoleCard 
                line="3"
                players="2 Yttrar + 9:a"
                description="Högsta linjen. Yttrar håller bredd, 9:an hotar spelyta 3 och gyllene zonen."
                variant="attack"
              />
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="3-2-2-3 Struktur" description="Bild på anfallsuppställning" />
            </div>
          </div>

          {/* Korridorer — verbatim */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-10">
            <div className="mb-8">
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

          {/* Grön spelare → Acceleration — verbatim with interactive pitch */}
          <h3 className="text-lg font-bold text-foreground mb-2">Grön spelare → Acceleration</h3>
          <p className="text-sm text-muted-foreground mb-4">Spelvändning centralt utlöser full fart mot gyllene zonen.</p>

          {/* Video */}
          <div className="mb-6">
            <TrainingVideo 
              title="3-2-2-3 Anfallsspel förklarat"
              url="https://www.youtube.com/shorts/yGyPL4PZD_Q"
              duration="0:59"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <InteractiveFootballPitch 
              formations={formations}
              title="Interaktiv Taktiktavla"
              subtitle="Tryck och dra för att flytta spelare"
              showZones
            />
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-5 border border-accent/30 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">Anfallssekvens</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-midfield/20 text-zone-midfield text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span>Grön spelare centralt slår spelvändning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-attack/20 text-zone-attack text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span>Full fart i inre/yttre korridor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zone-attack/20 text-zone-attack text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span>Överlapp/underlapp mot kortsidan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                    <span>Cutback till gyllene zonen</span>
                  </li>
                </ol>
              </div>
              <TriggerCard 
                number={1}
                condition="rättvänd i spelyta 2"
                action="spelvändning → full fart via inre korridor"
                variant="attack"
              />
              <TriggerCard 
                number={2}
                condition="inre korridor låst"
                action="spelvänd via 6:a + inverterad → full fart"
                variant="attack"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-10">
            <CoachCue cue="Invertera tidigt" variant="primary" />
            <CoachCue cue="Rättvänd → spelvändning → full fart" variant="primary" />
            <CoachCue cue="Cutback > avslut" variant="accent" />
          </div>

          {/* B) G/IG Templates — Anfallsspel */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Anfallsspel</h3>
          <div className="space-y-4 mb-10">
            <GIGTemplate
              cueTitel="3-2-2-3 Struktur"
              definition="Varje linje har tydliga uppgifter. VM = 8:a, HM = 7:a."
              narAnvands="Alltid i anfallsspelet."
              handling="Backlinje (3): uppbyggnad. Bas (2): 6:a + inv. YB. Offensiva MF (2): 8:a + 7:a i inre korridorer. Högsta (3): Yttrar + 9:a."
              roller="Alla utespelare"
              kpi="Korrekt 3-2-2-3 formation vid uppspel (%) [INFERRED KPI OPTION]"
              gVillkor="Samtliga linjer besatta vid uppspel [INFERRED]"
              igVillkor="Linjer saknar spelare → för stor distans [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Inre & Yttre Korridorer"
              definition="Vi spelar alltid via inre korridor när möjligt. Yttre = sista utväg."
              narAnvands="Alltid i anfallsspelet."
              handling="Prioritera passningar via inre korridor. Yttre korridor = sista utväg."
              roller="Mittfältare, yttrar [INFERRED]"
              kpi="Progressioner via inre korridor vs yttre (kvot) [INFERRED KPI OPTION]"
              gVillkor="≥ 60% progressioner via inre korridor [INFERRED]"
              igVillkor="Majoriteten av progressioner via yttre [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Grön spelare → Acceleration"
              definition="Spelvändning centralt utlöser full fart mot gyllene zonen."
              narAnvands="När GRÖN identifieras — rättvänd spelare centralt."
              beslutstrigger="Cue 3 (VÄXLA / VÄNDLÄGE)"
              handling="1. Grön spelare centralt slår spelvändning. 2. Full fart i inre/yttre korridor. 3. Överlapp/underlapp mot kortsidan. 4. Cutback till gyllene zonen."
              roller="3:a centralt + yttrar + 9:a [INFERRED]"
              kpi="Skott inom 10s efter grön aktivering (antal) [INFERRED KPI OPTION]"
              gVillkor="Cutback till golden zone genomförd [INFERRED]"
              igVillkor="GRÖN identifierad men ingen acceleration [INFERRED]"
            />
          </div>

          {/* C) KPIs — Anfallsspel */}
          <KPIBox
            title="KPI:er — Anfallsspel"
            kpis={[
              { name: "xG per match", definition: "Förväntade mål skapat av laget", target: "[SAKNAS]", measurement: "Statistikverktyg [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Inträden i gyllene zonen", definition: "Antal gånger boll spelas in i zon 14 / golden zone", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Skott inom 10s efter GRÖN", definition: "Antal skott inom 10 sekunder efter grön cue-aktivering", target: "[SAKNAS]", measurement: "Videokodning [INFERRED]", failThreshold: "[SAKNAS]" },
            ]}
          />
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: OMSTÄLLNING TILL FÖRSVAR */}
        {/* ============================================================ */}
        <section id="omstallning-till-forsvar">
          <SectionHeader 
            badge="Omställning till försvar"
            title="Bollförlust → Jaga eller falla"
            subtitle="När vi tappar bollen jagar vi tillsammans direkt — eller faller tillbaka tillsammans. Inget kaos."
          />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-6">
            <div>
              {/* A) Cross-link to Restförsvar in Försvarsspel */}
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm text-center font-medium text-primary">
                  <strong>Se även:</strong> <a href="#forsvarsspel" className="underline hover:no-underline">Restförsvar +1 / +2 (Försvarsspel)</a> — principen för numerärt överläge bak.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <ImagePlaceholder title="Omställning till försvar" description="Bild på counterpress" />
            </div>
          </div>

          {/* B) G/IG — missing, placeholder */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Omställning till försvar</h3>
          <MissingInputPlaceholder
            needed="Omställning till försvar-regler (första 5 sekunderna, vem pressar, vem täcker, när man slutar pressa och faller tillbaka)"
            formatNeeded="5–9 punkter + 2 exempel (matchklipp eller skriftliga)"
            source="matchmodell + träningsmodell"
            owner="tränare/analytiker"
          />

          <div className="mt-6">
            <GIGTemplate
              cueTitel="Direkt bollåtererövring [INFERRED]"
              definition="Vid bollförlust — direkt press för att återvinna inom 5 sekunder [INFERRED]"
              narAnvands="Direkt efter bollförlust i motståndarens planhalva [INFERRED]"
              beslutstrigger="Bollförlust → närmaste 2-3 spelare pressar [INFERRED]"
              handling="1. Närmaste spelare pressar boll. 2. Omgivande spelare stänger passningsvägar. 3. Om ej återvunnen inom 5s: falla tillbaka kompakt. [INFERRED]"
              roller="Alla i närheten av bollförlust [INFERRED]"
              kpi="Återerövring inom 5s efter förlust (%) [INFERRED KPI OPTION]"
              gVillkor="≥ 40% bollåtererövring inom 5s [INFERRED]"
              igVillkor="Spelare reagerar inte / laget splittrat [INFERRED]"
            />
          </div>

          {/* C) KPIs */}
          <div className="mt-8">
            <KPIBox
              title="KPI:er — Omställning till försvar"
              kpis={[
                { name: "Bollåtererövring ≤ 5s", definition: "Andel bollvinster inom 5s efter förlust", target: "≥ 40% [INFERRED]", measurement: "Videokodning [INFERRED]", failThreshold: "< 20% [INFERRED]" },
                { name: "Tvingade turnovers i anfallshalva", definition: "Antal tvingade bollförluster i motståndarens halva", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              ]}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 7: FASTA SITUATIONER */}
        {/* ============================================================ */}
        <section id="fasta-situationer">
          <SectionHeader 
            badge="Fasta situationer"
            title="Defensivt: Hybrid + 2 Man"
            subtitle="När spelet stannar (hörna/frispark) har vi fortfarande regler. Vi gissar inte."
          />

          {/* A) Existing material — verbatim */}
          <p className="text-sm text-muted-foreground mb-6">Zonbas i boxen med 2 spelare i strikt man-markering på deras största hot.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <SetPieceCard 
              title="Grundstruktur"
              variant="hybrid"
              roles={[
                { name: "2 MAN", instruction: "Följ hotet – först boll, sen kropp" },
                { name: "ZON", instruction: "Ta första boll i zon – rensa framåt" },
                { name: "REST", instruction: "2 spelare högre för andraboll/kontringsskydd" },
              ]}
            />
            <div className="space-y-4">
              <TriggerCard 
                number={1}
                condition="kort variant"
                action="1 spelare kliver ut, resten håller zon"
              />
              <TriggerCard 
                number={2}
                condition="lång/inswing"
                action="zon attackerar boll, man-markörer låser hot"
              />
            </div>
          </div>

          {/* Set piece image placeholders */}
          <h3 className="text-lg font-bold text-foreground mb-4">Bildunderlag — Fasta situationer</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <ImagePlaceholder title="Offensiv hörna 1" description="Uppställning variant 1" />
            <ImagePlaceholder title="Offensiv hörna 2" description="Uppställning variant 2" />
            <ImagePlaceholder title="Defensiv hörna" description="Hybridförsvar vid hörna" />
            <ImagePlaceholder title="Inläggsfrispark — offensiv" description="Uppställning vid inlägg" />
            <ImagePlaceholder title="Inläggsfrispark — defensiv" description="Försvar vid inlägg" />
            <ImagePlaceholder title="Direkt frispark — offensiv" description="Mur och löpningar" />
            <ImagePlaceholder title="Direkt frispark — defensiv" description="Mur och täckning" />
          </div>

          {/* Existing: Media & Navigation — verbatim */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <SectionHeader 
              badge="Media & Navigation"
              title="Filmer & Veckoschema"
              subtitle="Övningsfilmer finns inbäddade ovan. Veckoschemat flyttas till egen flik."
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Inbäddade filmer</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    3-2-2-3 Anfallsspel (Sektion E)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zone-defense" />
                    4-3-3 Försvarsspel (Sektion B)
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/30">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  TODO: Veckoschema
                </p>
                <p className="text-sm text-muted-foreground">
                  Veckoschemat (Mån / Ons / Tor → Lördag) flyttas till en separat flik/route.
                </p>
              </div>
            </div>
          </div>

          {/* Existing: Bilder & Spelytor TODO — verbatim */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-10">
            <SectionHeader 
              badge="Grafik TODO"
              title="Bilder & Spelytor"
              subtitle="Platshållare för grafik som ska läggas till."
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/30">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  TODO: 4-4-2 Kompakthetsbild
                </p>
                <p className="text-sm text-muted-foreground">
                  Bild där spelarna bortser från 4-4-2 som formation men använder den som referens för hur kompakta vi ska vara i olika faser.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/30">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  TODO: Uppdatera spelytor
                </p>
                <p className="text-sm text-muted-foreground">
                  Justera spelytor-diagrammet baserat på nya referensbilder (Utgångsyta, Spelyta 1–3).
                </p>
              </div>
            </div>
          </div>

          {/* Placeholders for offensive set pieces */}
          <h3 className="text-lg font-bold text-foreground mb-4">Offensiva fasta situationer</h3>
          <div className="space-y-4 mb-10">
            <MissingInputPlaceholder needed="Hörnor för / mot" formatNeeded="punkter + diagram" source="fasta situationer-manus" owner="tränare" />
            <MissingInputPlaceholder needed="Frisparkar för / mot" formatNeeded="punkter + diagram" source="fasta situationer-manus" owner="tränare" />
            <MissingInputPlaceholder needed="Inkast (långa/korta) för / mot" formatNeeded="punkter + diagram" source="fasta situationer-manus" owner="tränare" />
            <MissingInputPlaceholder needed="Straffar" formatNeeded="punkter" source="fasta situationer-manus" owner="tränare" />
          </div>

          {/* B) G/IG Templates — Fasta situationer */}
          <h3 className="text-lg font-bold text-foreground mb-4">G/IG‑mallar — Fasta situationer</h3>
          <div className="space-y-4 mb-10">
            <GIGTemplate
              cueTitel="Defensivt: Hybrid + 2 Man"
              definition="Zonbas i boxen med 2 spelare i strikt man-markering på deras största hot."
              narAnvands="Alla defensiva fasta situationer (hörnor mot, frisparkar mot)."
              handling="2 MAN: Följ hotet — först boll, sen kropp. ZON: Ta första boll i zon — rensa framåt. REST: 2 spelare högre för andraboll/kontringsskydd."
              roller="2 man-markörer, zonspelare, 2 rest [INFERRED]"
              kpi="Mål insläppta från hörnor (antal) [INFERRED KPI OPTION]"
              gVillkor="0 mål insläppta från fasta situationer [INFERRED]"
              igVillkor="≥ 2 mål insläppta från fasta per match [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Trigger: Kort variant"
              definition="1 spelare kliver ut, resten håller zon."
              narAnvands="Vid kort hörnvariant av motståndare."
              handling="1 spelare kliver ut. Resten håller zon."
              roller="Närmaste zonspelare kliver ut [INFERRED]"
              kpi="Kontrollerade korta hörnor mot oss (%) [INFERRED KPI OPTION]"
              gVillkor="Kort hörna neutraliserad — ingen skottchans [INFERRED]"
              igVillkor="Kort hörna leder till skottchans [INFERRED]"
            />
            <GIGTemplate
              cueTitel="Trigger: Lång/inswing"
              definition="Zon attackerar boll, man-markörer låser hot."
              narAnvands="Vid lång hörna / inswing."
              handling="Zonspelare attackerar bollen. Man-markörer låser sina hot."
              roller="Zonspelare + 2 man-markörer [INFERRED]"
              kpi="Rensningar vid lång hörna (%) [INFERRED KPI OPTION]"
              gVillkor="Boll rensad vid ≥ 80% av långa hörnor [INFERRED]"
              igVillkor="Motståndare nickar fritt i boxen [INFERRED]"
            />
          </div>

          {/* C) KPIs — Fasta situationer */}
          <KPIBox
            title="KPI:er — Fasta situationer"
            kpis={[
              { name: "Skott för/mot vid fasta", definition: "Antal skott för och mot vid fasta situationer", target: "[SAKNAS]", measurement: "Manuell taggning [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "xG för/mot vid fasta", definition: "Förväntade mål vid fasta situationer", target: "[SAKNAS]", measurement: "Statistikverktyg [INFERRED]", failThreshold: "[SAKNAS]" },
              { name: "Mål insläppta från hörnor", definition: "Antal mål insläppta från hörnor", target: "0 [INFERRED]", measurement: "Manuell räkning", failThreshold: "≥ 2 per match [INFERRED]" },
            ]}
          />
        </section>

        {/* ============================================================ */}
        {/* SECTION: MATCHTRUPP */}
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
        {/* QUALITY CONTROL */}
        {/* ============================================================ */}
        <section id="quality-control" className="space-y-10">
          <SectionHeader 
            badge="Kvalitetskontroll"
            title="Kvalitetskontroll"
            subtitle="Checklista och KPI-sammanfattning för att säkerställa att inget saknas."
          />

          {/* TABLE 1: Checklist */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-primary/10 border-b border-border">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Checklista — Sektioner vs innehåll</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">Sektion</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">Innehåll flyttat?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">R/G/G def?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">Cue 1/2/3 def?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">Bilder/diagram?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">Video?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">G/IG mallar?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">KPI:er?</th>
                    <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-muted-foreground">Saknas #</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { section: "Generellt", content: "Ja", rgg: "Ja", cue: "Ja", visuals: "Nej", video: "Nej", gig: "Ja", kpi: "Delvis", missing: 4 },
                    { section: "Identitet", content: "Ja", rgg: "Nej", cue: "Nej", visuals: "Nej", video: "Nej", gig: "Ja", kpi: "Delvis", missing: 3 },
                    { section: "Försvarsspel", content: "Ja", rgg: "Nej", cue: "Nej", visuals: "Delvis", video: "Ja", gig: "Ja", kpi: "Delvis", missing: 2 },
                    { section: "Omställning till anfall", content: "Delvis", rgg: "Nej", cue: "Delvis", visuals: "Nej", video: "Nej", gig: "Delvis", kpi: "Delvis", missing: 3 },
                    { section: "Anfallsspel", content: "Ja", rgg: "Delvis", cue: "Delvis", visuals: "Ja", video: "Ja", gig: "Ja", kpi: "Delvis", missing: 3 },
                    { section: "Omställning till försvar", content: "Nej", rgg: "Nej", cue: "Nej", visuals: "Nej", video: "Nej", gig: "Delvis", kpi: "Delvis", missing: 4 },
                    { section: "Fasta situationer", content: "Ja", rgg: "Nej", cue: "Nej", visuals: "Nej", video: "Nej", gig: "Ja", kpi: "Delvis", missing: 5 },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium text-foreground">{row.section}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.content === "Ja" ? "text-zone-attack" : row.content === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.content}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.rgg === "Ja" ? "text-zone-attack" : row.rgg === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.rgg}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.cue === "Ja" ? "text-zone-attack" : row.cue === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.cue}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.visuals === "Ja" ? "text-zone-attack" : row.visuals === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.visuals}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.video === "Ja" ? "text-zone-attack" : row.video === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.video}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.gig === "Ja" ? "text-zone-attack" : row.gig === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.gig}</td>
                      <td className={`px-3 py-2 text-center font-bold ${row.kpi === "Ja" ? "text-zone-attack" : row.kpi === "Delvis" ? "text-zone-midfield" : "text-zone-defense"}`}>{row.kpi}</td>
                      <td className="px-3 py-2 text-center font-bold text-foreground">{row.missing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 2: KPI Summary */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-accent/10 border-b border-border">
              <h4 className="text-sm font-bold uppercase tracking-wider text-accent-foreground">KPI‑sammanfattning</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">KPI</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">Definition</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">Sektion(er)</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">Mätmetod</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">Mål (G)</th>
                    <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground">IG‑tröskel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "PPDA", def: "Pressintensitet", sections: "Generellt, Försvar", method: "Videokodning", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "Höga bollvinster", def: "Antal höga bollvinster", sections: "Generellt", method: "Manuell taggning", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "xG per match", def: "Förväntade mål", sections: "Generellt, Anfall", method: "Statistikverktyg", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "Duellvinst %", def: "Vunna / engagerade dueller", sections: "Identitet", method: "Manuell taggning", target: "≥ 50% [INF]", fail: "< 40% [INF]" },
                    { name: "Andrabolls-vinst %", def: "Vunna andrabollar / totalt", sections: "Identitet", method: "Manuell taggning", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "Djupledslöpn. / 10 min", def: "Löpningar i djupled per 10 min", sections: "Identitet", method: "Manuell taggning", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "Passn. genom linjer", def: "Tillåtna centrala passningar", sections: "Försvar", method: "Videokodning", target: "0 / halvlek [INF]", fail: "> 3 [INF]" },
                    { name: "Bollvinster pressfälla", def: "Vinster vid VB-trigger", sections: "Försvar", method: "Manuell taggning", target: "≥ 50% [INF]", fail: "< 30% [INF]" },
                    { name: "Tid till framåtaktion", def: "Sekunder efter bollvinst", sections: "Omst. anfall", method: "Videokodning", target: "< 3s [INF]", fail: "> 5s [INF]" },
                    { name: "Skott inom 10s GRÖN", def: "Skott efter grön aktivering", sections: "Anfall", method: "Videokodning", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "Inträden golden zone", def: "Boll i zon 14", sections: "Anfall", method: "Manuell taggning", target: "[SAKNAS]", fail: "[SAKNAS]" },
                    { name: "Återerövring ≤ 5s", def: "Bollvinst inom 5s", sections: "Omst. försvar", method: "Videokodning", target: "≥ 40% [INF]", fail: "< 20% [INF]" },
                    { name: "Mål från hörnor mot", def: "Insläppta från hörnor", sections: "Fasta sit.", method: "Manuell räkning", target: "0 [INF]", fail: "≥ 2 [INF]" },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.def}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.sections}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.method}</td>
                      <td className={`px-3 py-2 ${row.target.includes("[SAKNAS") ? "text-accent italic" : "text-foreground font-medium"}`}>{row.target}</td>
                      <td className={`px-3 py-2 ${row.fail.includes("[SAKNAS") ? "text-accent italic" : "text-muted-foreground"}`}>{row.fail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MERMAID FLOWCHART */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-primary/10 border-b border-border">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Flödesdiagram: Cue → Beslut → Handling → KPI</h4>
            </div>
            <div className="p-5">
              <pre className="text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
{`flowchart TD
  A[RÖD - Ingen kontroll] --> B{Beslut: Cue 1/2/3?}
  C[GUL - Överbelasta] --> B
  D[GRÖN - Oordning skapad] --> B
  B -->|Cue 1| E[Handling: SÄKRA - behåll kontroll]
  B -->|Cue 2| F[Handling: FÖRBÄTTRA - bättre vinkel/läge]
  B -->|Cue 3| G[Handling: VÄXLA/VÄNDLÄGE - accelerera framåt]
  E --> H[KPI: Bollförluster i uppspel]
  F --> I[KPI: Progressioner / korridoranvändning]
  G --> J[KPI: Skott eller xG inom 10s]
  K[Bollförlust] --> L{Counterpress?}
  L -->|Ja| M[Handling: Återvinn inom 5s]
  L -->|Nej| N[Handling: Falla tillbaka + skydda centralt]
  M --> O[KPI: Återerövring ≤ 5s %]
  N --> P[KPI: Skott insläppta efter förlust]`}
              </pre>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Ovan visas som text. Om Mermaid-rendering stöds, kopiera blocket till en Mermaid-editor för visuell vy.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Gunnilse IS 2026 • Träningsmatcher Vinter/vår</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
