/**
 * Central event/error-logger. Helps oss gå från statisk sajt till ett verktyg
 * vi kan diagnosticera i drift.
 *
 * - Skickar alltid till console (utvecklarmiljö).
 * - Om VITE_SENTRY_DSN finns: skickar via lazy-loaded Sentry-binding.
 *   Sentry behöver inte vara installerat — wrapen är defensive och no-ops om
 *   modulen inte finns.
 * - Mobil-vänligt: error-objektet packas alltid till plain JSON innan transport
 *   så att React-fel utan stack inte kraschar reporten.
 *
 * Använd `logger.error(err, { route: "/match/reflektioner" })` etc. och låt
 * resten av appen vara helt agnostisk till backend.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  /** Logisk grupp (`auth`, `realtime`, `mutation`, `route`, etc.). */
  scope?: string;
  /** Fritt nyckel-värdesextra. */
  [key: string]: unknown;
}

type SentryLikeModule = {
  captureException: (err: unknown, ctx?: { extra?: Record<string, unknown> }) => void;
  captureMessage: (msg: string, ctx?: { level?: LogLevel; extra?: Record<string, unknown> }) => void;
  init?: (config: { dsn: string; environment?: string; tracesSampleRate?: number }) => void;
};

let sentry: SentryLikeModule | null = null;

const dsn = (import.meta.env.VITE_SENTRY_DSN as string | undefined) ?? "";
const env = (import.meta.env.MODE as string | undefined) ?? "development";

/**
 * Manuell injektion. Anropas från main.tsx vid behov:
 *   import * as Sentry from "@sentry/browser";
 *   setSentry(Sentry);
 *
 * Vi gör INTE dynamisk import av @sentry/browser här — Vite resolverar
 * import-paths vid build-tid, och vi vill inte tvinga teamet att installera
 * paketet om det inte används. När DSN är satt och paketet installerat
 * kopplar man Sentry själv från main.tsx.
 */
export function setSentry(mod: SentryLikeModule | null) {
  sentry = mod;
  if (sentry && dsn) {
    sentry.init?.({ dsn, environment: env, tracesSampleRate: 0.1 });
  }
}

function toSerializable(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
}

function emit(level: LogLevel, message: unknown, context?: LogContext) {
  const payload = {
    level,
    message: toSerializable(message),
    context,
    timestamp: new Date().toISOString(),
  };

  // Bara warn/error i prod-konsol — debug/info skulle annars dränka.
  if (env === "production" && (level === "debug" || level === "info")) {
    // intentionally empty
  } else {
    // eslint-disable-next-line no-console
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    fn(`[${level}]`, payload);
  }

  if ((level === "error" || level === "warn") && sentry) {
    if (message instanceof Error) {
      sentry.captureException(message, { extra: context as Record<string, unknown> });
    } else {
      sentry.captureMessage(String(message), {
        level,
        extra: { context, raw: payload.message } as Record<string, unknown>,
      });
    }
  }
}

export const logger = {
  debug: (message: unknown, context?: LogContext) => emit("debug", message, context),
  info: (message: unknown, context?: LogContext) => emit("info", message, context),
  warn: (message: unknown, context?: LogContext) => emit("warn", message, context),
  error: (message: unknown, context?: LogContext) => emit("error", message, context),
  /** Stub. Kvar för bakåtkompabilitet — Sentry kopplas via setSentry() istället. */
  init: () => undefined,
};

/** Exporteras för test så att vi kan inspektera flaggor utan att gissa env-state. */
export const _internals = { hasDsn: () => Boolean(dsn), env };
