import FootballPitch from "@/components/FootballPitch";
import InteractiveFootballPitch, { Formation } from "@/components/InteractiveFootballPitch";
import TriggerCard from "@/components/TriggerCard";
import CoachCue from "@/components/CoachCue";
import TrainingDay from "@/components/TrainingDay";
import RoleCard from "@/components/RoleCard";
import SectionHeader from "@/components/SectionHeader";
import SetPieceCard from "@/components/SetPieceCard";
import SpelytorDiagram from "@/components/SpelytorDiagram";
import KorridorerDiagram from "@/components/KorridorerDiagram";

const defensePlayers = [
  { id: "1", x: 50, y: 92, role: "MV", color: "secondary" as const },
  { id: "2", x: 15, y: 78, role: "VYB", color: "primary" as const },
  { id: "3", x: 38, y: 75, role: "VMB", color: "primary" as const },
  { id: "4", x: 62, y: 75, role: "HMB", color: "primary" as const },
  { id: "5", x: 85, y: 78, role: "HYB", color: "primary" as const },
  { id: "6", x: 30, y: 58, role: "VM", color: "primary" as const },
  { id: "8", x: 50, y: 55, role: "6:a", color: "accent" as const },
  { id: "7", x: 70, y: 58, role: "HM", color: "primary" as const },
  { id: "11", x: 18, y: 35, role: "VY", color: "primary" as const },
  { id: "9", x: 50, y: 28, role: "9:a", color: "accent" as const },
  { id: "10", x: 82, y: 35, role: "HY", color: "primary" as const },
];

const attackPlayers = [
  { id: "3", x: 30, y: 85, role: "VMB", color: "primary" as const },
  { id: "4", x: 50, y: 88, role: "HMB", color: "primary" as const },
  { id: "2", x: 70, y: 85, role: "YB (stannar)", color: "primary" as const },
  { id: "6", x: 38, y: 68, role: "6:a", color: "accent" as const },
  { id: "5", x: 62, y: 68, role: "Inv. YB", color: "accent" as const },
  { id: "8", x: 32, y: 48, role: "8:a", color: "primary" as const },
  { id: "10", x: 68, y: 48, role: "10:a", color: "primary" as const },
  { id: "11", x: 12, y: 28, role: "VY", color: "primary" as const },
  { id: "9", x: 50, y: 22, role: "9:a", color: "accent" as const },
  { id: "7", x: 88, y: 28, role: "HY", color: "primary" as const },
];

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
      { id: "6", x: 30, y: 58, role: "VM", color: "primary" as const },
      { id: "8", x: 50, y: 55, role: "6:a", color: "accent" as const },
      { id: "7", x: 70, y: 58, role: "HM", color: "primary" as const },
      { id: "11", x: 18, y: 35, role: "VY", color: "primary" as const },
      { id: "9", x: 50, y: 28, role: "9:a", color: "accent" as const },
      { id: "10", x: 82, y: 35, role: "HY", color: "primary" as const },
    ]
  },
  {
    name: "3-2-2-3 Anfall",
    players: [
      { id: "3", x: 30, y: 85, role: "VMB", color: "primary" as const },
      { id: "4", x: 50, y: 88, role: "HMB", color: "primary" as const },
      { id: "2", x: 70, y: 85, role: "HYB (stannar)", color: "primary" as const },
      { id: "6", x: 38, y: 68, role: "6:a", color: "accent" as const },
      { id: "5", x: 62, y: 68, role: "VYB (inv.)", color: "accent" as const },
      { id: "8", x: 32, y: 48, role: "8:a", color: "primary" as const },
      { id: "10", x: 68, y: 48, role: "10:a", color: "primary" as const },
      { id: "11", x: 12, y: 28, role: "VY", color: "primary" as const },
      { id: "9", x: 50, y: 22, role: "9:a", color: "accent" as const },
      { id: "7", x: 88, y: 28, role: "HY", color: "primary" as const },
    ]
  },
  {
    name: "4-4-2 Alt.",
    players: [
      { id: "1", x: 50, y: 92, role: "MV", color: "secondary" as const },
      { id: "2", x: 15, y: 78, role: "VYB", color: "primary" as const },
      { id: "3", x: 38, y: 75, role: "VMB", color: "primary" as const },
      { id: "4", x: 62, y: 75, role: "HMB", color: "primary" as const },
      { id: "5", x: 85, y: 78, role: "HYB", color: "primary" as const },
      { id: "6", x: 15, y: 55, role: "VM", color: "primary" as const },
      { id: "7", x: 38, y: 52, role: "CM", color: "accent" as const },
      { id: "8", x: 62, y: 52, role: "CM", color: "accent" as const },
      { id: "11", x: 85, y: 55, role: "HM", color: "primary" as const },
      { id: "9", x: 35, y: 28, role: "ST", color: "primary" as const },
      { id: "10", x: 65, y: 28, role: "ST", color: "primary" as const },
    ]
  }
];

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
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
        {/* Formations Section */}
        <section>
          <SectionHeader 
            badge="Formationer"
            title="Två ansikten – ett lag"
            subtitle="Dra spelarna för att justera positioner. Byt formation med knapparna."
          />
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <InteractiveFootballPitch 
              formations={formations}
              title="Interaktiv Taktiktavla"
              subtitle="Klicka och dra för att flytta spelare"
              showZones
            />
            <div className="space-y-6">
              <div className="card-gradient rounded-xl p-5 border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">4-3-3 Försvar</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Stoppa framåt, styr ut mot yttre korridor, kompakt centralt. Front 3 pressar på trigger.
                </p>
              </div>
              <div className="card-gradient rounded-xl p-5 border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">3-2-2-3 Anfall</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  VB inverterar tidigt. HB stannar i trean bak. 6:an är alltid "pilen nedåt" – ankare bakom 8/10.
                </p>
              </div>
              <div className="card-gradient rounded-xl p-5 border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    Dra spelare till önskad position
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    Klicka för att se spelarinfo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    "Reset" återställer formationen
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section>
          <SectionHeader 
            badge="Rolllås"
            title="3-2-2-3 Struktur"
            subtitle="Varje linje har tydliga uppgifter och ansvar."
          />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RoleCard 
              line="3"
              players="2 MB + 1 YB"
              description="Första linjen i uppbyggnad. Ytterbacken som inte inverterar stannar som tredje spelare."
              variant="defense"
            />
            <RoleCard 
              line="2"
              players="6:a + Inv. YB"
              description="Basen. Säkrar spelvändning och kontringsskydd centralt."
              variant="midfield"
            />
            <RoleCard 
              line="2"
              players="8:or / 10:or"
              description="Offensiva mittfältare som söker spelbarhet i inre korridorer (halv-ytor)."
              variant="midfield"
            />
            <RoleCard 
              line="3"
              players="2 Yttrar + 9:a"
              description="Högsta linjen. Yttrar håller bredd, 9:an hotar spelyta 3."
              variant="attack"
            />
          </div>
        </section>

        {/* Build-up Triggers */}
        <section>
          <SectionHeader 
            badge="Del 1 – Speluppbyggnad"
            title="Ta spelyta för spelyta"
            subtitle="Målbild: Etablera kontroll i spelyta 2 eller 3."
          />
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <TriggerCard 
              number={1}
              condition="vi har rättvänd i spelyta 1/2"
              action="hota framåt (pass/driv) mot inre korridor"
              variant="attack"
            />
            <TriggerCard 
              number={2}
              condition="inre korridor låses"
              action="spelvänd via inverterad (6+inv = säkerhet)"
              variant="attack"
            />
            <TriggerCard 
              number={3}
              condition="motståndaren kliver fel"
              action="spela in bakom (spelyta 3)"
              variant="attack"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <CoachCue cue="Invertera tidigt" />
            <CoachCue cue="Spelbar i inre" />
            <CoachCue cue="Spelvänd snabbt" />
            <CoachCue cue="Rättvänd = hota" />
            <CoachCue cue="Säkra bakom boll" />
          </div>
        </section>

        {/* Defense Triggers */}
        <section>
          <SectionHeader 
            badge="Del 1 – Försvarsspel"
            title="4-3-3 Press & kompakthet"
            subtitle="Styr mot yttre korridor, skydda centralt."
          />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-zone-defense mb-4">Press-triggers</h4>
              <div className="space-y-3">
                <TriggerCard 
                  number={1}
                  condition="felvänd mottagning"
                  action="pressa omedelbart"
                  variant="defense"
                />
                <TriggerCard 
                  number={2}
                  condition="dålig första touch"
                  action="kollektiv press"
                  variant="defense"
                />
                <TriggerCard 
                  number={3}
                  condition="pass in i yttre korridor"
                  action="stäng inåt med täckskugga"
                  variant="defense"
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">If–Then</h4>
              <div className="space-y-3">
                <TriggerCard 
                  number={1}
                  condition="trigger i yttre korridor"
                  action="pressa/stäng inåt med täckskugga"
                  variant="defense"
                />
                <TriggerCard 
                  number={2}
                  condition="vi missar press"
                  action="falla kompakt, skydda centralt (Zone14)"
                  variant="defense"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <CoachCue cue="Styr ut" variant="muted" />
            <CoachCue cue="Stäng inåt" variant="muted" />
            <CoachCue cue="Korta avstånd" variant="muted" />
          </div>
        </section>

        {/* Set Pieces */}
        <section>
          <SectionHeader 
            badge="Fasta situationer"
            title="Defensivt: Hybrid + 2 Man"
            subtitle="Zonbas i boxen med 2 spelare i tydlig man-markering på deras största huvudhot."
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

        {/* Weekly Schedule */}
        <section>
          <SectionHeader 
            badge="Veckoschema"
            title="Mån / Ons / Tor → Lördag"
            subtitle="Ett tema per dag som leder till matchdagen."
          />
          
          <div className="grid md:grid-cols-3 gap-6">
            <TrainingDay 
              day="Måndag"
              theme="Uppbyggnad"
              focus="3-2-bas med inverterad + hitta spelbarhet i inre korridor → kontroll i spelyta 2/3."
              cues={["Invertera tidigt", "Spelbar i inre", "Spelvänd snabbt"]}
              videos={[
                { title: "Invertering & 3-2-uppbyggnad", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "4:32" },
                { title: "Spelbarhet i inre korridor", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "3:15" },
              ]}
            />
            <TrainingDay 
              day="Onsdag"
              theme="Försvar 4-3-3"
              focus="Press-triggers + styra mot yttre korridor + kompakt centralt."
              cues={["Styr ut", "Stäng inåt", "Korta avstånd"]}
              videos={[
                { title: "Press-triggers i praktiken", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "5:10" },
              ]}
            />
            <TrainingDay 
              day="Torsdag"
              theme="Matchrepetition"
              focus="Fasta (hybrid+2 man) + Grön/Gul/Röd + 11v11 med 6 match-cues."
              cues={["Vår zon först", "2 man låser", "Grön/Gul/Röd"]}
              videos={[
                { title: "Hybrid + 2 man på hörnor", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "6:45" },
                { title: "Grön/Gul/Röd beslut", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "4:20" },
              ]}
              isHighlighted
            />
          </div>
        </section>

        {/* Corridors Reference - SvFF Diagrams */}
        <section className="card-gradient rounded-2xl p-8 border border-border">
          <SectionHeader 
            badge="SvFF-språk"
            title="Spelytor & Korridorer"
            subtitle="Visuella diagram baserade på SvFF-terminologi i våra brandfärger."
            className="mb-8"
          />
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <SpelytorDiagram />
            <KorridorerDiagram />
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
