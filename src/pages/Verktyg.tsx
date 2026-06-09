import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, FileText, Search, Sparkles, Target } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";

const tools = [
  {
    to: "/spelmodell-labb",
    label: "Spelmodell-labb",
    desc: "Fokus, matchbild och passupplägg.",
    icon: Sparkles,
  },
  {
    to: "/traningsplan",
    label: "Träningsplan",
    desc: "A4 för passet.",
    icon: ClipboardList,
  },
  {
    to: "/matchblad",
    label: "Matchblad",
    desc: "Trupp och fokuspunkter.",
    icon: FileText,
  },
  {
    to: "/motstandaranalys",
    label: "Motståndaranalys",
    desc: "Styrkor, svagheter och plan.",
    icon: Search,
  },
  {
    to: "/taktiktavla",
    label: "Taktiktavla",
    desc: "Flytta spelare och rita sekvenser.",
    icon: Target,
  },
];

const Verktyg = () => (
  <>
    <PageHero
      eyebrow="Verktyg"
      title="Tränarverktyg"
      description="Välj det du behöver inför träning eller match."
    />
    <SectionReveal as="section" className="container pb-section">
      <div className="divide-y divide-border border-y border-border">
        {tools.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group grid items-center gap-4 py-5 transition hover:bg-card/35 md:grid-cols-[48px_220px_1fr_28px]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card/55 text-accent-ink">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <h2 className="text-xl text-foreground">{label}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <ArrowRight className="hidden h-4 w-4 text-accent transition group-hover:translate-x-1 md:block" />
          </Link>
        ))}
      </div>
    </SectionReveal>
  </>
);

export default Verktyg;
