import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ClipboardList, LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import boardMarkup from "./tactic-board-markup.html?raw";
import boardScript from "./tactic-board-script.js?raw";
import "./tactic-board.css";

declare global {
  interface Window {
    html2canvas?: unknown;
    __cleanupTacticBoard?: () => void;
  }
}

const HTML2CANVAS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

function loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${HTML2CANVAS_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = HTML2CANVAS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

const Taktiktavla = () => {
  const boardRootRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const boardRoot = boardRootRef.current;
    if (!boardRoot) return;

    let mounted = true;
    const script = document.createElement("script");

    boardRoot.innerHTML = boardMarkup;

    loadHtml2Canvas()
      .catch(() => {
        setLoadError(true);
      })
      .finally(() => {
        if (!mounted) return;
        script.text = boardScript;
        document.body.appendChild(script);
      });

    return () => {
      mounted = false;
      window.__cleanupTacticBoard?.();
      delete window.__cleanupTacticBoard;
      script.remove();
      boardRoot.innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link
            to="/verktyg"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Verktyg
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm font-display font-bold text-primary sm:flex">
              <ClipboardList className="h-4 w-4" />
              Taktiktavla
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-card/35">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Gunnilse IS 2026
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              Matchdagens taktiktavla
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Forma laget, visa ytorna och spara bilder direkt i samma miljö som resten av matchplanen.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/verktyg"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Verktyg
            </Link>
            <Link
              to="/match/kommande"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Matchplan
            </Link>
            <a
              href="#tactic-board-workspace"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ClipboardList className="h-4 w-4" />
              Arbetsyta
            </a>
          </div>
        </div>
      </section>

      {loadError && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-100">
          Skärmbildsfunktionen kunde inte laddas just nu. Tavlan fungerar ändå.
        </div>
      )}

      <div id="tactic-board-workspace" ref={boardRootRef} className="tactic-board-page" />
    </div>
  );
};

export default Taktiktavla;
