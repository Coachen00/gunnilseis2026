import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.10),transparent_60%)]" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
        Spelmodellen · 404
      </p>
      <h1 className="mt-4 text-7xl font-black tracking-tight text-foreground md:text-8xl">
        404
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
        Sidan du letade efter finns inte här.
      </p>
      <p className="mt-2 max-w-md font-mono text-xs text-muted-foreground/70">
        {location.pathname}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background/50 px-5 text-sm font-bold uppercase tracking-wider text-foreground transition hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till startsidan
      </Link>
    </div>
  );
};

export default NotFound;
