import type { ReactNode } from "react";
import type { QueryClient } from "../core/QueryClient.js";
import { QueryClientContext } from "./QueryClientContext.js";

/**
 * React context Provider wrapper component.
 */
export function QueryClientContextProvider(props: {
  client: QueryClient;
  children: ReactNode;
}) {
  return (
    <QueryClientContext.Provider value={props.client}>
      {props.children}
    </QueryClientContext.Provider>
  );
}
