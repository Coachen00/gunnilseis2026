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
      { id: "7", x: 70, y: 58, role: "7:a", color: "primary" as const },
      { id: "8", x: 30, y: 58, role: "8:a", color: "primary" as const },
      { id: "9", x: 50, y: 28, role: "9:a", color: "accent" as const },
      { id: "10", x: 82, y: 35, role: "HY", color: "primary" as const },
      { id: "11", x: 18, y: 35, role: "VY", color: "primary" as const },
    ]
  },
  {
    name: "3-2-2-3 Anfall",
    players: [
      { id: "2", x: 70, y: 85, role: "HYB (stannar)", color: "primary" as const },
      { id: "3", x: 30, y: 85, role: "VMB", color: "primary" as const },
      { id: "4", x: 50, y: 88, role: "HMB", color: "primary" as const },
      { id: "5", x: 62, y: 68, role: "VYB (inv.)", color: "accent" as const },
      { id: "6", x: 38, y: 68, role: "6:a", color: "accent" as const },
      { id: "7", x: 88, y: 28, role: "HY", color: "primary" as const },
      { id: "8", x: 32, y: 48, role: "8:a", color: "primary" as const },
      { id: "9", x: 50, y: 22, role: "9:a", color: "accent" as const },
      { id: "10", x: 68, y: 48, role: "7:a", color: "primary" as const },
      { id: "11", x: 12, y: 28, role: "VY", color: "primary" as const },
    ]
  },
];

import LogoutButton from "@/components/LogoutButton";

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Logout button */}
        <div className="absolute top-4 right-4 z-10">
          <LogoutButton />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15)_0%,_transparent_60%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-12 h-1 bg-primary rounded-full" />
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Lagets Spelidé</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
              Få saker.{" "}
              <span className="text-gradient-primary">Max tydlighet.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Försvar: 4-3-3 — kompakt, styr ut. 
              <br />
              Anfall: 3-2-2-3 med inverterad ytterback.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <CoachCue cue="Invertera tidigt" variant="primary" />
              <CoachCue cue="Rättvänd = hota" variant="accent" />
              <CoachCue cue="Korta avstånd" variant="muted" />
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-20 space-y-20">
        
        {/* A) Pseudokontring */}
        <section>
        <SectionHeader 
          badge="A) Pseudokontring"
          title="Kontroll → Grön → Acceleration"
          subtitle="När vi får rättvänd spelbarhet, hota framåt direkt."
        />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-gradient rounded-xl p-6 border border-border">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Princip</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Rättvänd → framåt.</strong> Så fort du är rättvänd, hota djupet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Cue "1–2–3":</strong></span>
                </li>
                <li className="flex items-start gap-2 ml-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">1 = SÄKRA</strong> (spelare i ryggen) – Spela enkelt/säkert. Ingen vändning. Behåll kontroll.</span>
                </li>
                <li className="flex items-start gap-2 ml-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">2 = FÖRBÄTTRA</strong> (inom spelytan) – Spela kvar för att skapa bättre vinkel/läge (flytta, locka, förbered).</span>
                </li>
                <li className="flex items-start gap-2 ml-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">3 = VÄXLA / VÄNDLÄGE</strong> (rättvänd) – Vänd/accelerera: framåt, många meter, sök assistytan → cutback (pseudokontring).</span>
                </li>
              </ul>
            </div>
            <div className="card-gradient rounded-xl p-6 border border-accent/30 bg-accent/5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">Definition</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-accent">Pseudokontring</strong> = kontroll i spelyta 2 → trigger (grön 3:e spelare) → full acceleration mot mål. Inte kaos – kontrollerad explosion.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <CoachCue cue="1–2–3" variant="accent" />
            <CoachCue cue="Rättvänd = hota" variant="primary" />
          </div>
        </section>

        {/* B) Försvar: 4-3-3 (5 komprimerade principer) */}
        <section>
          <SectionHeader 
            badge="B) Försvar: 4-3-3"
            title="5 Försvarsprinciper"
            subtitle="Kompakta regler för att styra spelet utåt och skydda centralt."
          />
          
          {/* Video */}
          <div className="mb-6">
            <TrainingVideo 
              title="4-3-3 Försvarsspel förklarat"
              url="https://www.youtube.com/watch?v=jJGwvHb8fWs"
              duration="6:45"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
          
          <div className="flex flex-wrap gap-3">
            <CoachCue cue="Styr ut" variant="muted" />
            <CoachCue cue="Stäng inåt" variant="muted" />
            <CoachCue cue="Korta avstånd" variant="muted" />
            <CoachCue cue="100% satsning" variant="muted" />
          </div>
        </section>

        {/* C) Spelarinstruktioner (tidigare "Rollås") */}
        <section>
          <SectionHeader 
            badge="C) Spelarinstruktioner"
            title="3-2-2-3 Struktur"
            subtitle="Varje linje har tydliga uppgifter. VM = 8:a, HM = 7:a."
          />
          
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
        </section>

        {/* D) Korridorer – visualisering */}
        <section className="card-gradient rounded-2xl p-8 border border-border">
          <SectionHeader 
            badge="D) Korridorer"
            title="Inre & Yttre Korridorer"
            subtitle="Vi spelar alltid via inre korridor när möjligt. Yttre = sista utväg."
            className="mb-8"
          />
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <SpelytorDiagram />
            <KorridorerDiagram />
            <GoldenZoneDiagram />
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong>OBS:</strong> TODO – uppdatera spelytor/grafik baserat på uppladdade referensbilder.
            </p>
          </div>
        </section>

        {/* E) Anfall: 3-2-2-3 */}
        <section>
          <SectionHeader 
            badge="E) Anfall: 3-2-2-3"
            title="Grön spelare → Acceleration"
            subtitle="Spelvändning centralt utlöser full fart mot gyllene zonen."
          />
          
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
              subtitle="Klicka och dra för att flytta spelare"
              showZones
            />
            <div className="space-y-4">
              <div className="card-gradient rounded-xl p-5 border border-accent/30">
                <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">Anfallssekvens</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span>Grön spelare centralt slår spelvändning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span>Full fart i inre/yttre korridor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
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
                action="hota framåt via inre korridor"
                variant="attack"
              />
              <TriggerCard 
                number={2}
                condition="inre korridor låst"
                action="spelvänd via 6:a + inverterad (säkerhet)"
                variant="attack"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <CoachCue cue="Invertera tidigt" variant="primary" />
            <CoachCue cue="Spelbar i inre" variant="primary" />
            <CoachCue cue="Cutback > avslut" variant="accent" />
          </div>
        </section>

        {/* F) Restförsvar */}
        <section>
          <SectionHeader 
            badge="F) Restförsvar"
            title="Restförsvar +1"
            subtitle="Alltid en extra spelare bakom bollen. Vid ledning: +2."
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-gradient rounded-xl p-6 border border-zone-defense/30">
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
            <div className="card-gradient rounded-xl p-6 border border-primary/30">
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
        </section>

        {/* G) Presstriggers (vänsterback) */}
        <section>
          <SectionHeader 
            badge="G) Presstriggers"
            title="Pressfälla: Deras Vänsterback"
            subtitle="Formation + höjd skapar pressfällan. Vi vill se passningen till deras VB."
          />
          
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
          
          <MediaPlaceholder 
            type="video"
            title="Film: Triggers i praktiken"
            description="Presstriggers och kollektiv press"
          />
        </section>

        {/* Set Pieces */}
        <section>
          <SectionHeader 
            badge="Fasta situationer"
            title="Defensivt: Hybrid + 2 Man"
            subtitle="Zonbas i boxen med 2 spelare i strikt man-markering på deras största hot."
          />
          
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
        </section>

        {/* H) Media + Navigation note */}
        <section className="card-gradient rounded-2xl p-8 border border-border">
          <SectionHeader 
            badge="H) Media & Navigation"
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
        </section>

        {/* I) Bilder/Spelytor note */}
        <section className="card-gradient rounded-2xl p-8 border border-border">
          <SectionHeader 
            badge="I) Grafik TODO"
            title="Bilder & Spelytor"
            subtitle="Placeholders för grafik som ska läggas till."
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
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Lagets Spelidé • Version "Få saker / Max tydlighet"</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
