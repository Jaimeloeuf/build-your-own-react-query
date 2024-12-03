import type { QueryState } from "./QueryState";
import type { QueryOptions } from "./QueryOptions";
import type { QuerySubscriber } from "./QuerySubscriber";

/**
 * `Query` maintains the logic of calling the given `queryFn`, handling request
 * deduplication, and notifying its `QuerySubscriber`s on `QueryState` change.
 */
export class Query<T> {
  constructor(public options: QueryOptions<T>) {}

  /**
   * A set of `QuerySubscriber`s subscribed to the current Query instance.
   */
  public subscribers: Set<QuerySubscriber<T>> = new Set();

  /**
   * A `Query`'s current `QueryState`, this will be updated as things change.
   * The default `QueryState` is also set here.
   */
  public state: QueryState<T> = {
    status: "loading",
    data: null,
    error: null,
  };

  /**
   * Saves the updated `QueryState` and notify all `Query` subscribers with
   * using their `queryStateChangeCallback` method.
   */
  private updateQueryState(newState: QueryState<T>) {
    this.state = newState;

    for (const subscriber of this.subscribers) {
      subscriber.queryStateChangeCallback();
    }
  }

  /**
   * A `Query`'s current query promise if `queryFn` is being ran right now. This
   * is used to do request deduplication, see `run` method for more details.
   */
  private queryExecutionPromise: null | Promise<void> = null;

  /**
   * Run `queryFn` and update `QueryState` accordingly.
   */
  private async runQuery() {
    // Reset state by clearing any existing errors before calling `queryFn`
    this.updateQueryState({
      ...this.state,
      error: null,

      // Even though we are technically "loading" data now, we do not set status
      // to 'loading' so that if the query is successful previously, the stale
      // data will still be shown (Stale-While-Revalidate) until the new data is
      // available or an error occurs.
      // status: "loading",
    });

    try {
      const data = await this.options.queryFn();

      this.updateQueryState({
        ...this.state,
        status: "success",
        data,
      });
    } catch (error) {
      this.updateQueryState({
        ...this.state,
        status: "error",
        error: error as Error,
      });
    }

    // Clear current query execution promise so that this query can be re-ran
    this.queryExecutionPromise = null;
  }

  /**
   * Run's the `Query`'s `queryFn` internally, while handling request
   * de-duplication by returning the existing query promise if it exists instead
   * of creating a new query promise on every call.
   */
  run() {
    if (this.queryExecutionPromise === null) {
      this.queryExecutionPromise = this.runQuery();
    }

    return this.queryExecutionPromise;
  }
}
