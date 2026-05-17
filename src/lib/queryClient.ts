import { QueryClient } from "@tanstack/react-query";
import { logger } from "./logger";

/**
 * Delad QueryClient med spelmodellsmedvetna defaults:
 *
 * - 30s staleTime: data ändras sällan (matcher, identitet, taktik).
 * - 5 min gcTime: behåll cache så att hopp mellan rutter känns instant.
 * - 1 retry på network errors, ingen retry på 4xx (Supabase fel-meddelanden).
 * - refetchOnWindowFocus: false — vi täcker realtime separat.
 * - Globalt error-callback: logga via central logger.
 */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error: unknown) => {
          const msg = error instanceof Error ? error.message : String(error);
          if (/4\d{2}/.test(msg)) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
        onError: (err) => logger.error(err, { scope: "mutation" }),
      },
    },
  });
}
