import { GitBranch, Layers, MonitorPlay, Sparkles, Telescope, type LucideIcon } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import SectionHeader from "@/components/SectionHeader";
import HubCard from "@/components/HubCard";
import BreadcrumbTrail from "@/components/BreadcrumbTrail";
import { WorldBadge } from "@/components/WorldBadge";

type Card = { to: string; label: string; title: string; description: string; Icon: LucideIcon };

/* Systemet — hur allt hänger ihop. */
const system: Card[] = [
  {
    to: "/under-process",
    label: "System",
    title: "Prisma 2026",
    description: "Hela tankesystemet: vision → identitet → ledarskap → spelmodell → träning → analys.",
    Icon: GitBranch,
  },
  {
    to: "/under-process/5-upphojt-i-fem",
    label: "Ramverk",
    title: "5⁵ — fem upphöjt i fem",
    description: "Minnesskelettet. Var du än tittar i idén möter du fem.",
    Icon: Layers,
  },
  {
    to: "/spelide",
    label: "Tränarspår",
    title: "Spelidé",
    description: "Det egna spåret: ”Vi kommer förberedda” — värdeordet allt hänger på.",
    Icon: Telescope,
  },
];

/* Under utveckling — material som fortfarande byggs. */
const process: Card[] = [
  {
    to: "/under-process/spelmodell-neon",
    label: "Deck",
    title: "Spelmodell – helskärm",
    description: "Presentations-deck för spelmodellen i helskärm.",
    Icon: MonitorPlay,
  },
  {
    to: "/spelmodell-labb",
    label: "Labb",
    title: "Spelmodell-labb",
    description: "Bygg matchbild, fokus och passupplägg inför veckan.",
    Icon: Sparkles,
  },
];

const Coach = () => (
  <>
    <BreadcrumbTrail items={[{ label: "Hem", to: "/" }, { label: "Coach" }]} />
    <PageHero
      eyebrow="Coach"
      title="Coach"
      description="Hur systemet hänger ihop — för ledare och Joel. Mer systemiskt, men fortfarande spelbart."
    >
      <WorldBadge world="coach" label="Ledarmaterial" />
    </PageHero>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Systemet" title="Hur allt hänger ihop" number={1} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {system.map((c) => (
          <HubCard key={c.to} to={c.to} label={c.label} title={c.title} description={c.description} Icon={c.Icon} world="coach" />
        ))}
      </div>
    </SectionReveal>

    <SectionReveal as="section" className="container pb-section">
      <SectionHeader badge="Under utveckling" title="Material som byggs" number={2} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {process.map((c) => (
          <HubCard key={c.to} to={c.to} label={c.label} title={c.title} description={c.description} Icon={c.Icon} world="coach" />
        ))}
      </div>
    </SectionReveal>
  </>
);

export default Coach;
