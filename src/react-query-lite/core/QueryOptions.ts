/**
 * `QueryOptions` is used to define the `queryFn` to load the data we want, and
 * a unique string `id` to identify the Query for caching purposes.
 */
export type QueryOptions<T> = {
  /**
   * Deterministic string that doesnt change across requests for the same data.
   */
  id: string;

  /**
   * Actual function that loads data from whatever source you want.
   */
  queryFn: () => Promise<T>;
};
