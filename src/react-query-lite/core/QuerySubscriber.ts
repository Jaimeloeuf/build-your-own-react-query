import type { Query } from "./Query";

/**
 * A `QuerySubscriber` subscribes to a Query to allow `QuerySubscriber` users to
 * subscribe to `QueryState` changes.
 */
export class QuerySubscriber<T> {
  constructor(
    /**
     * The `Query` that this `QuerySubscriber` instance subscribes to.
     */
    private readonly query: Query<T>,

    /**
     * Callback function that is called whenever `QueryState` changes.
     */
    public readonly queryStateChangeCallback: () => void
  ) {
    // Subscribe self to the `Query`'s `QueryState` changes
    this.query.subscribers.add(this);

    // On new QuerySubscriber creation, i.e. on new subscription, trigger a new
    // query run to get updated data
    this.query.run();
  }

  /**
   * Get the current subscription data, which includes the `QueryState` and a
   * `refetch` function to allow users to explicitly re-run `queryFn`.
   */
  getSubscription() {
    return {
      ...this.query.state,
      refetch: () => this.query.run(),
    };
  }
}
