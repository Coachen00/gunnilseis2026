import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/spelide", label: "Spelidé" },
  { to: "/anfall", label: "Principer" },
  { to: "/verktyg", label: "Träningspass" },
  { to: "/match/matcher", label: "Matcher" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-24 border-t border-border bg-card/40">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr] md:gap-16 md:py-14">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background font-mono text-sm font-black text-accent">
              S
            </div>
            <span className="font-extrabold tracking-tight text-foreground">
              Spelmodellen
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            En gemensam karta för hur laget tränar, spelar och utvecklas.
          </p>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Princip · Träning · Match
          </p>
        </div>

        <nav aria-label="Snabblänkar" className="grid gap-3 sm:grid-cols-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-accent sm:col-span-2">
            Snabblänkar
          </p>
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-foreground/85 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="container flex flex-col items-start justify-between gap-3 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {year} Spelmodellen · För Gunnilse IS 2026</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono uppercase tracking-[0.22em] transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            ↑ Toppen
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
