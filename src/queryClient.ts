import { QueryClient } from "./react-query-lite";

/**
 * Create a single query client to be used throughout the codebase, so all
 * queries are cached in the same query client.
 */
export const queryClient = new QueryClient();
