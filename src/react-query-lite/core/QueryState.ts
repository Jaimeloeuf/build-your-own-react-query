/**
 * An object representing the current `Query`'s state.
 */
export interface QueryState<T> {
  /**
   * The current query status.
   */
  status: "loading" | "success" | "error";

  /**
   * The return value of `queryFn` from its latest run, or `null` if no data is
   * returned yet.
   */
  data: null | T;

  /**
   * The error thrown by the provided query function during its latest run, or
   * `null` if there was no error on its latest run or the latest run hasnt
   * completed yet.
   */
  error: null | Error;
}
