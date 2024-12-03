import { createContext } from "react";
import type { QueryClient } from "../core/QueryClient.js";

/**
 * React context to hold the query client.
 */
export const QueryClientContext = createContext<null | QueryClient>(null);
