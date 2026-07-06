import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

const items = [
  {
    to: "/maj-2026",
    label: "Sommaren 2026 — Spelmodellen (maj)",
  },
  {
    to: "/period/1",
    label: "Period 1 · Diagonalt spel (11 maj–1 jul)",
  },
  {
    to: "/under-process",
    label: "Under process — Tränarskapets system",
  },
];

const Arkiv = () => (
  <>
    <PageHero
      eyebrow="Arkiv"
      title="Arkiv"
      description="Tidigare perioder och material."
    />
    <SectionReveal as="section" className="container pb-section">
      <div className="divide-y divide-border border-y border-border">
        {items.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="group grid items-center gap-4 py-5 transition hover:bg-card/35 md:grid-cols-[1fr_28px]"
          >
            <h2 className="text-xl text-foreground">{label}</h2>
            <ArrowRight className="hidden h-4 w-4 text-accent transition group-hover:translate-x-1 md:block" />
          </Link>
        ))}
      </div>
    </SectionReveal>
  </>
);

export default Arkiv;
