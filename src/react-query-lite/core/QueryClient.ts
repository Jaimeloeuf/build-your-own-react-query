import { Query } from "./Query.js";
import type { QueryOptions } from "./QueryOptions.js";

/**
 * `QueryClient` manages all the cached queries, allowing you to either create
 * or get a Query, and invalidate queries as needed.
 *
 * A `QueryClient` encapsulates its own unique cache, so multiple instances of
 * `QueryClient` can exists to provide cache namespaces.
 */
export class QueryClient {
  /**
   * Cache of all queries managed by this `QueryClient` instance.
   */
  private queryCache = new Map<string, Query<any>>();

  /**
   * Get a Query if it already exists, else, create a new one and cache it.
   */
  getQuery<T>(queryOptions: QueryOptions<T>) {
    if (!this.queryCache.has(queryOptions.id)) {
      this.queryCache.set(queryOptions.id, new Query(queryOptions));
    }

    return this.queryCache.get(queryOptions.id)!;
  }

  /**
   * Invalidate an existing `Query` using the Query IDs, by re-running the Query
   * to get fresh data.
   */
  invalidateQuery(...queryIDs: Array<string>) {
    for (const queryID of queryIDs) {
      this.queryCache.get(queryID)?.run();
    }
  }
}
