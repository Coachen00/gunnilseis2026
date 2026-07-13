import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Visningsnamn för felmeddelandet ("Rutten 'Maj 2026'" etc.) */
  routeName?: string;
  /** Egen fallback. Default renderar standard-UI. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface ErrorBoundaryState {
  error: Error | null;
}

const isChunkLoadError = (error: Error) =>
  /chunkloaderror|failed to fetch dynamically imported module|importing a module script failed|loading chunk .* failed/i.test(
    `${error.name} ${error.message}`,
  );

/**
 * ErrorBoundary — fångar render-/lifecycle-fel under denna gren av trädet.
 *
 * - Loggar via central logger (Sentry-ready).
 * - Visar fallback med möjlighet att försöka igen utan full sidladdning.
 * - Async-fel (fetches) hanteras av TanStack Query → den här fångar INTE dem.
 *   Det är OK — vi har separat error-UI per query.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error(error, {
      scope: "error-boundary",
      route: this.props.routeName,
      componentStack: info.componentStack ?? undefined,
    });
  }

  private reset = () => {
    const error = this.state.error;

    if (error && isChunkLoadError(error) && typeof window !== "undefined") {
      const retryKey = `gunnilse-chunk-retry:${error.message}`;

      try {
        if (!window.sessionStorage.getItem(retryKey)) {
          window.sessionStorage.setItem(retryKey, "1");
          window.location.reload();
          return;
        }
      } catch {
        // Storage can be unavailable in privacy-restricted browsers.
      }
    }

    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    if (typeof this.props.fallback === "function") {
      return this.props.fallback(this.state.error, this.reset);
    }
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-[40vh] flex items-center justify-center px-4 py-12"
      >
        <div className="max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-destructive/15">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Något gick sönder här</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {this.props.routeName ? `Felet inträffade i ${this.props.routeName}. ` : null}
            Du kan försöka igen — resten av appen funkar fortfarande.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Försök igen
          </button>
        </div>
      </div>
    );
  }
}
