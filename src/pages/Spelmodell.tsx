import {
  Compass,
  CornerRightUp,
  Fingerprint,
  Flag,
  Map as MapIcon,
  RefreshCcw,
  RefreshCw,
  Shield,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import SectionHeader from "@/components/SectionHeader";
import HubCard from "@/components/HubCard";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";

type Card = { to: string; label: string; title: string; description: string; Icon: LucideIcon };

/* Vår idé — ingången till hela modellen. */
const ide: Card[] = [
  {
    to: "/maj-2026",
    label: "Idé · Var förberedd",
    title: "Så spelar vi",
    description: "Hela spelmodellen i översikt — sex faser, ett lag, en idé.",
    Icon: Compass,
  },
];

/* Spelets skeden — länkar till befintliga principsidor. */
const skeden: Card[] = [
  {
    to: "/anfall",
    label: "Skede",
    title: "Anfall",
    description: "Skydda → spela in → spela ut → framåt → fyll boxen.",
    Icon: Swords,
  },
  {
    to: "/forsvar",
    label: "Skede",
    title: "Försvar",
    description: "Förhindra avslut i gyllene zonen — pressa tillsammans, styr utåt.",
    Icon: Shield,
  },
  {
    to: "/omstallning-anfall",
    label: "Skede",
    title: "Omställning anfall",
    description: "Bollvinst → ta ytan direkt och utnyttja obalansen.",
    Icon: RefreshCw,
  },
  {
    to: "/omstallning-forsvar",
    label: "Skede",
    title: "Omställning försvar",
    description: "Bollförlust → motpress i fem sekunder, annars tillbaka i form.",
    Icon: RefreshCcw,
  },
  {
    to: "/fasta",
    label: "Skede",
    title: "Fasta situationer",
    description: "Din plats, din löpning, ditt ansvar — innan bollen ligger still.",
    Icon: Flag,
  },
];

/* Spelaren — vad varje spelare bär in i varje skede. */
const spelaren: Card[] = [
  {
    to: "/identitet",
    label: "Beteende",
    title: "Identitet",
    description: "Fem beteenden i varje match: dueller, andraboll, ta ytan, prata med passningen, scanning.",
    Icon: Fingerprint,
  },
  {
    to: "/roller",
    label: "Ansvar",
    title: "Roller",
    description: "Vad din position gör i varje skede — och vad som krävs av den.",
    Icon: Users,
  },
  {
    to: "/spelmodell/planens-ytor",
    label: "Karta",
    title: "Planens ytor",
    description: "Korridorer, spelytor och gyllene zonen — kartan du läser av.",
    Icon: MapIcon,
  },
];

const Grid = ({ cards }: { cards: Card[] }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
    {cards.map((c) => (
      <HubCard
        key={c.to}
        to={c.to}
        label={c.label}
        title={c.title}
        description={c.description}
        Icon={c.Icon}
        world="spelmodell"
      />
    ))}
  </div>
);

const Spelmodell = () => (
  <>
    <BreadcrumbTrail items={[{ label: "Hem", to: "/" }, { label: "Spelmodell" }]} />
    <PageHero
      eyebrow="Spelmodell"
      title="Spelmodell"
      description="Så spelar vi, vad vi letar efter och vad varje spelare behöver känna igen."
    />

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Vår idé" title="Var förberedd" number={1} />
      <Grid cards={ide} />
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Spelets skeden" title="De fem skedena" number={2} />
      <Grid cards={skeden} />
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Spelaren" title="Det du bär in i varje skede" number={3} />
      <Grid cards={spelaren} />
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <CornerRightUp className="h-4 w-4 text-amber-700" strokeWidth={2.2} aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Vill du se hur idén byggs ihop?{" "}
          <Link to="/coach" className="font-bold text-foreground underline-offset-4 hover:underline">
            Gå till Coach
          </Link>{" "}
          för Prisma 2026 och 5⁵.
        </p>
      </div>
    </SectionReveal>
  </>
);

export default Spelmodell;
