import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";

/**
 * Skapa en isolerad QueryClient per test för att undvika cache-läckage.
 * `retry: false` så att fejkade fel inte triggar autoretry under test.
 */
export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface ProvidersProps {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
}

export function TestProviders({ children, routerProps }: ProvidersProps) {
  const client = makeTestQueryClient();
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, "wrapper"> & { routerProps?: MemoryRouterProps } = {}
) {
  const { routerProps, ...rest } = options;
  return render(ui, {
    wrapper: ({ children }) => <TestProviders routerProps={routerProps}>{children}</TestProviders>,
    ...rest,
  });
}
