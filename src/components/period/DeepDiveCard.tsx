import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface DeepDive {
  title: string;
  to: string;
  Icon: LucideIcon;
  hint?: string;
}

const DeepDiveCard = ({ item }: { item: DeepDive }) => {
  const { Icon } = item;
  return (
    <Link
      to={item.to}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card/35 p-3.5 transition hover:border-accent/45 hover:bg-card/55"
    >
      <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background/40 text-accent">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-foreground">{item.title}</span>
        {item.hint && (
          <span className="block text-[11px] text-muted-foreground">{item.hint}</span>
        )}
      </span>
      <ArrowRight className="h-4 w-4 text-accent opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
};

export default DeepDiveCard;
