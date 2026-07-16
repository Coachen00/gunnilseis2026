import MediaSlot from "@/components/match/MediaSlot";
import {
  RollerSection,
  MatchExempelSection,
  MatchtruppSection,
  KvalitetSection,
} from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";

const NAV_ITEMS = [
  { num: "01", title: "Roller & positioner", sub: "Mittfält & ytterback", href: "#roller-positioner" },
  { num: "02", title: "Målvakten", sub: "Sista försvarare", href: "#malvakt" },
  { num: "03", title: "Exempel från match", sub: "Situation → beslut", href: "#exempel-match" },
  { num: "04", title: "Rollklipp", sub: "Filmer & bilder", href: "#rollklipp" },
  { num: "05", title: "Matchtrupp & ansvar", sub: "Matchdag", href: "#matchtrupp" },
  { num: "06", title: "Mätetal & lärdom", sub: "Kvalitetskontroll", href: "#quality-control" },
];

const Roller = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Roller & Trupp"
      title="Roller, exempel och matchtrupp"
      lead="Vad varje position gör, hur principerna ser ut i match, och dagens trupp."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <div className="bg-kedja-paper py-16">
      <div className="container">
        <RollerSection />
      </div>
    </div>

    <section id="malvakt" className="scroll-mt-20 bg-white">
      <div className="container pb-[88px] pt-24">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Roller · Målvakt</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">
            Spelbar i uppbyggnad — <span className="mark-lime">sista försvarare</span> i försvarsspel
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            Målvakten är en uppbyggnadsspelare och en kommunicerande sista försvarare.
          </p>
        </div>
        <div className="mt-12 text-left">
          <PrincipleBlock phase="malvakt" showSource />
        </div>
      </div>
    </section>

    <div className="bg-kedja-paper py-16">
      <div className="container">
        <MatchExempelSection />
      </div>
    </div>

    <section id="rollklipp" className="scroll-mt-20 bg-white">
      <div className="container pb-[88px] pt-24">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Roller · Klipp</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">
            Filmer och bilder kopplade till roller
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            Tre fasta platser för klipp och bilder som visar <span className="mark-lime">ansvar, positioner och kroppsspråk</span> i rollen.
          </p>
        </div>
        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          <MediaSlot
            slotKey="spelmodell:roller:mittfalt:ansvar"
            title="Mittfält - ansvar"
            captionPlaceholder="Beskriv ansvar, avstånd eller beslut i sekvensen..."
          />
          <MediaSlot
            slotKey="spelmodell:roller:mohammed"
            title="Rollsekvens"
            captionPlaceholder="Beskriv rollen och vad spelaren gör..."
          />
          <MediaSlot
            slotKey="spelmodell:roller:bildsekvens"
            title="Bildsekvens"
            captionPlaceholder="Beskriv vad bilden förklarar..."
          />
        </div>
      </div>
    </section>

    <div className="bg-kedja-paper py-16">
      <div className="container">
        <MatchtruppSection />
      </div>
    </div>

    <div className="bg-white py-16">
      <div className="container">
        <KvalitetSection />
      </div>
    </div>
  </div>
);

export default Roller;
