import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PhaseStop {
  route: string;
  label: string;
}

const FLOW: PhaseStop[] = [
  { route: "/spelide", label: "Vår spelidé" },
  { route: "/anfall", label: "Anfall" },
  { route: "/omstallning-forsvar", label: "Omställning till försvar" },
  { route: "/forsvar", label: "Försvar" },
  { route: "/omstallning-anfall", label: "Omställning till anfall" },
  { route: "/fasta", label: "Fasta situationer" },
];

interface PhaseNavProps {
  /** Aktuell route — t.ex. "/forsvar". Bestämmer vad som visas som föregående/nästa. */
  current: string;
}

const PhaseNav = ({ current }: PhaseNavProps) => {
  const idx = FLOW.findIndex((s) => s.route === current);
  if (idx === -1) return null;
  const prev = FLOW[(idx - 1 + FLOW.length) % FLOW.length];
  const next = FLOW[(idx + 1) % FLOW.length];

  return (
    <nav className="container pb-24">
      <div className="grid grid-cols-2 gap-4 border-t border-border pt-8 max-w-3xl">
        <Link
          to={prev.route}
          className="group flex flex-col gap-1 rounded-lg border border-border bg-card/60 p-4 hover:bg-card transition-colors"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <ArrowLeft className="w-3 h-3" />
            Föregående skede
          </span>
          <span className="text-sm md:text-base font-bold text-foreground group-hover:text-accent transition-colors">
            {prev.label}
          </span>
        </Link>
        <Link
          to={next.route}
          className="group flex flex-col gap-1 rounded-lg border border-accent/40 bg-accent/5 p-4 hover:bg-accent/10 transition-colors text-right"
        >
          <span className="inline-flex items-center justify-end gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
            Nästa skede
            <ArrowRight className="w-3 h-3" />
          </span>
          <span className="text-sm md:text-base font-bold text-foreground group-hover:text-accent transition-colors">
            {next.label}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default PhaseNav;
