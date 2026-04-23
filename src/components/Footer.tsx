import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 mt-20 bg-card/40">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Gunnilse IS <span className="text-accent">2026</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-[0.2em]">
            Spelidé · Träning · Match
          </p>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
          <Link to="/spelide" className="hover:text-accent transition-colors">Spelidé</Link>
          <Link to="/verktyg" className="hover:text-accent transition-colors">Verktyg</Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-accent transition-colors"
          >
            ↑ Toppen
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
