import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

interface QueryClientProviderProps {
  children: ReactNode;
}

// Global QueryClient instance to persist across SSR/hydration
let globalQueryClient: QueryClient | undefined;

/**
 * QueryClientProvider wrapper for TanStack Query v5
 * Uses a global QueryClient instance to avoid hydration mismatches
 */
export function QueryClientProvider({ children }: QueryClientProviderProps) {
  // Use global instance to avoid creating multiple instances during SSR/hydration
  const queryClient =
    globalQueryClient ??
    (globalQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: false,
        },
      },
    }));

  // Ensure QueryClient is available globally for debugging
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__REACT_QUERY_CLIENT__ = queryClient;
  }

  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}

/**
 * Client-side wrapper component that ensures QueryClientProvider is properly hydrated
 */
export function ClientWrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
