import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface Huvudprincip {
  number: number;
  title: string;
  text: string;
  to: string;
  Icon: LucideIcon;
}

const HuvudprincipCard = ({ principle }: { principle: Huvudprincip }) => {
  const { Icon } = principle;
  return (
    <Link
      to={principle.to}
      className="group flex h-full flex-col rounded-xl border border-border bg-card/40 p-5 transition hover:border-accent/45 hover:bg-card/55"
    >
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs font-black text-muted-foreground">
          {String(principle.number).padStart(2, "0")}
        </span>
        <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
      </header>
      <h3 className="text-lg font-black tracking-normal text-foreground">{principle.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent opacity-80 transition group-hover:gap-2.5 group-hover:opacity-100">
        Läs mer <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
};

export default HuvudprincipCard;
