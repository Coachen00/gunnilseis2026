import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PrincipleTeaserProps {
  index: string;
  total?: string;
  quote: string;
  detail?: string;
  to: string;
  ctaLabel?: string;
}

const PrincipleTeaser = ({ index, total = "5", quote, to, ctaLabel = "Öppna" }: PrincipleTeaserProps) => (
  <div className="border-y border-border py-6">
    <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent">
      Princip {index} av {total}
    </p>
    <p className="max-w-2xl text-2xl font-black leading-tight tracking-normal text-foreground md:text-3xl">
      {quote}
    </p>
    <Link
      to={to}
      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:gap-3"
    >
      {ctaLabel}
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

export default PrincipleTeaser;
