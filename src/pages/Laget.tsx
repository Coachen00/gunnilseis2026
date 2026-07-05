import { Dumbbell, HeartPulse, Trophy, Users, type LucideIcon } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import HubCard from "@/components/HubCard";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";

type Card = { to: string; label: string; title: string; description: string; Icon: LucideIcon };

const cards: Card[] = [
  {
    to: "/truppen",
    label: "Spelare",
    title: "Trupp",
    description: "Hela truppen — namn, nummer och positioner.",
    Icon: Users,
  },
  {
    to: "/spelarvard",
    label: "Hälsa",
    title: "Spelarvård",
    description: "Sömn, kost, återhämtning och skadeförebyggande — ta hand om dig själv.",
    Icon: HeartPulse,
  },
  {
    to: "/semestern-2026",
    label: "Sommar",
    title: "Semestern 2026",
    description: "Gå inte upp i vikt — personliga löpscheman fram till 26/7.",
    Icon: Dumbbell,
  },
  {
    to: "/tavlingar",
    label: "Säsong",
    title: "Tävlingar",
    description: "Serier och cuper laget spelar 2026.",
    Icon: Trophy,
  },
];

const Laget = () => (
  <>
    <BreadcrumbTrail items={[{ label: "Hem", to: "/" }, { label: "Laget" }]} />
    <PageHero
      eyebrow="Laget"
      title="Laget"
      description="Allt runt truppen — vilka vi är, hur vi håller oss i form och vad vi spelar."
    />
    <SectionReveal as="section" className="container pb-section">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <HubCard
            key={c.to}
            to={c.to}
            label={c.label}
            title={c.title}
            description={c.description}
            Icon={c.Icon}
            world="laget"
          />
        ))}
      </div>
    </SectionReveal>
  </>
);

export default Laget;
