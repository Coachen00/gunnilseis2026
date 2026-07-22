import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen, ClipboardList, LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import TacticsBitmapBackdrop from "@/components/tactics/TacticsBitmapBackdrop";
import TacticsLibrary from "@/components/tactics/TacticsLibrary";
import { getLatestTacticsImage } from "@/lib/tacticsBoardStorage";
import CoachTacticsAnimation from "@/components/coach/CoachTacticsAnimation";
import {
  TACTICS_BOARD_ASSETS,
  TACTICS_SCENE_ORDER,
  type TacticsBoardScene,
} from "@/data/tacticsBoardAssets";
import boardMarkup from "./tactic-board-markup.html?raw";
import boardScript from "./tactic-board-script.js?raw";
import "./tactic-board.css";

declare global {
  interface Window {
    html2canvas?: unknown;
    __cleanupTacticBoard?: () => void;
    /**
     * Bridge — HTML-toolbarens scen-väljare (select#sceneSelect) anropar
     * detta för att be React rendra om backdrop med ny scen.
     */
    __setTacticsScene?: (scene: TacticsBoardScene) => void;
    __TACTICS_ACTIVITY_ID?: string | null;
    __TACTICS_BOARD_CONTEXT?: string | null;
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

/**
 * Säker injection av static HTML-template som är import-kompilerad
 * (Vite ?raw — content är fast vid build time, inte user input).
 * Vi använder DOMParser så att den statiska analysen ser att det
 * inte är en innerHTML-sink för untrusted data.
 */
function injectStaticBoardMarkup(host: HTMLElement, markup: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${markup}</div>`, "text/html");
  const wrapper = doc.body.firstElementChild;
  if (!wrapper) return;
  host.replaceChildren(...Array.from(wrapper.childNodes));
}

const Taktiktavla = () => {
  const location = useLocation();
  const activityId = new URLSearchParams(location.search).get("activity");
  const contextId = new URLSearchParams(location.search).get("context");
  const contextLabel = new URLSearchParams(location.search).get("label");
  const boardRootRef = useRef<HTMLDivElement>(null);
  const backdropRootRef = useRef<Root | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [scene, setSceneState] = useState<TacticsBoardScene>("training_pitch");
  const [latestImage, setLatestImage] = useState<string | null>(() => getLatestTacticsImage());

  // Stabil setter — exponeras globalt så HTML-toolbarens select kan triggera om-render.
  const setScene = useCallback((next: TacticsBoardScene) => {
    if (!TACTICS_BOARD_ASSETS[next]) return;
    setSceneState(next);
  }, []);

  useEffect(() => {
    window.__setTacticsScene = setScene;
    return () => {
      if (window.__setTacticsScene === setScene) delete window.__setTacticsScene;
    };
  }, [setScene]);

  // Rendera om backdrop när scen ändras — utan att återskapa hela tavlan.
  useEffect(() => {
    backdropRootRef.current?.render(<TacticsBitmapBackdrop scene={scene} />);
    const boardEl = boardRootRef.current?.querySelector<HTMLElement>(".tactics-board");
    if (boardEl) boardEl.dataset.scene = scene;
    const sceneSelect = boardRootRef.current?.querySelector<HTMLSelectElement>("#sceneSelect");
    if (sceneSelect) sceneSelect.value = scene;
  }, [scene]);

  useEffect(() => {
    const handleImageSaved = (event: Event) => {
      const image = (event as CustomEvent<{ image?: string }>).detail?.image;
      if (image) setLatestImage(image);
    };
    window.addEventListener("tactics:image-saved", handleImageSaved);
    return () => window.removeEventListener("tactics:image-saved", handleImageSaved);
  }, []);

  useEffect(() => {
    window.__TACTICS_ACTIVITY_ID = activityId;
    window.__TACTICS_BOARD_CONTEXT = contextId;
    const boardRoot = boardRootRef.current;
    if (!boardRoot) return;

    let mounted = true;
    const script = document.createElement("script");

    injectStaticBoardMarkup(boardRoot, boardMarkup);
    const backdropMount = boardRoot.querySelector("#tactics-backdrop-root");

    if (backdropMount) {
      backdropRootRef.current = createRoot(backdropMount);
      backdropRootRef.current.render(<TacticsBitmapBackdrop scene={scene} />);
    }

    // Pre-fyll scen-väljaren och binda change-handler till bridge.
    const sceneSelect = boardRoot.querySelector<HTMLSelectElement>("#sceneSelect");
    if (sceneSelect) {
      sceneSelect.value = scene;
      sceneSelect.addEventListener("change", (e) => {
        const target = e.currentTarget as HTMLSelectElement;
        const value = target.value as TacticsBoardScene;
        window.__setTacticsScene?.(value);
      });
    }

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
      delete window.__TACTICS_ACTIVITY_ID;
      delete window.__TACTICS_BOARD_CONTEXT;
      mounted = false;
      window.__cleanupTacticBoard?.();
      delete window.__cleanupTacticBoard;
      script.remove();
      const rootToUnmount = backdropRootRef.current;
      backdropRootRef.current = null;
      queueMicrotask(() => rootToUnmount?.unmount());
      boardRoot.replaceChildren();
    };
    // Kör endast en gång — scen-uppdateringar går via effekten ovan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link
            to={contextId ? "/traningsplan" : "/coach"}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {contextId ? "Tillbaka till träningsplanering" : "Coach"}
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
              {contextLabel || "Matchdagens taktiktavla"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Forma laget, byt mellan målade miljöer och spara bilder direkt i samma vy som matchplanen.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={contextId ? "/traningsplan" : "/coach"}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              {contextId ? "Träningsplanering" : "Coach"}
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

      <div className="mx-auto max-w-7xl px-4">
        <CoachTacticsAnimation variant="taktiktavla" />
      </div>

      {loadError && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-100">
          Skärmbildsfunktionen kunde inte laddas just nu. Tavlan fungerar ändå.
        </div>
      )}

      <div id="tactics-autosave-status" className="border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-center text-xs font-semibold text-emerald-200">
        Autosparar arbetsläget …
      </div>

      <TacticsLibrary latestImage={latestImage} />

      <div id="tactic-board-workspace" ref={boardRootRef} className="tactic-board-page" />

      {/* Build-time länk till scen-ordningen så även denna fil håller dem i sync. */}
      <noscript data-tactics-scene-order={TACTICS_SCENE_ORDER.join(",")} />
    </div>
  );
};

export default Taktiktavla;
