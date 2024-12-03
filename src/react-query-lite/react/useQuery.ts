import { useReducer, useContext, useRef } from "react";
import { QuerySubscriber } from "../core/QuerySubscriber.js";
import { QueryClientContext } from "./QueryClientContext.js";
import type { QueryOptions } from "../core/QueryOptions.js";

/**
 * React hook to use the Query and get its data.
 */
export function useQuery<T>(queryOptions: QueryOptions<T>) {
  // Using useReducer (can also be useState) hook's update state function to
  // trigger a re-render of the component that uses this useQuery hook, we don't
  // actually care about the state/value, but in this case could be useful for
  // displaying re-render count.
  const [_, rerender] = useReducer((i: number) => i + 1, 0);

  // Use a Ref to maintain one Unique QuerySubscriber per hook use
  const querySubscriberRef = useRef<null | QuerySubscriber<T>>(null);

  // Create and set the QuerySubscriber on first use
  if (querySubscriberRef.current === null) {
    const queryClient = useContext(QueryClientContext);

    if (queryClient === null) {
      throw new Error(
        "Missing QueryClient! Please wrap your component with <QueryClientContextProvider client={yourQueryClient}><YourApp /></QueryClientContextProvider>!"
      );
    }

    // Use QueryClient to either create a new Query or load the cached Query
    const query = queryClient.getQuery(queryOptions);

    // Subscribe to the query, and give QuerySubscriber the ability to trigger
    // a re-render in React when the `QueryState` we subscribe to is updated.
    querySubscriberRef.current = new QuerySubscriber(query, rerender);
  }

  // Return hook user the `QueryState` and other subscription data
  return querySubscriberRef.current.getSubscription();
}
