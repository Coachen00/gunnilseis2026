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

const PrincipleTeaser = ({ index, total = "5", quote, detail, to, ctaLabel = "Se alla principer" }: PrincipleTeaserProps) => (
  <div className="relative bg-card/70 backdrop-blur-md border border-border rounded-3xl p-8 md:p-12 shadow-sm">
    <div className="flex items-center gap-3 mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
      <span className="inline-block w-8 h-px bg-accent" />
      Princip {index} av {total}
    </div>
    <blockquote className="text-2xl md:text-4xl font-black leading-tight text-foreground tracking-tight">
      "{quote}"
    </blockquote>
    {detail && (
      <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
        {detail}
      </p>
    )}
    <Link
      to={to}
      className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary group"
    >
      {ctaLabel}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

export default PrincipleTeaser;