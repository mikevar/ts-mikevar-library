import { DEFAULT_STRICT, ORDER_QUERY_KEY } from "../../constants.ts";
import { ParseDataGridQueryError } from "../../errors.ts";
import type { ParseSortingOptions, SortingOrder } from "../../types.ts";

/**
 * Parses the sorting order from query parameters
 * @param query - The query object to parse
 * @param options - Configuration for sorting defaults and limits
 * @returns The sorting order ("asc" or "desc")
 */
export function parseSortingOrder({
  query,
  options,
}: {
  query: unknown;
  options?: ParseSortingOptions | undefined;
}): SortingOrder {
  const rawOrder = (query as { [ORDER_QUERY_KEY]?: SortingOrder })?.[
    ORDER_QUERY_KEY
  ];

  const strict = options?.strict ?? DEFAULT_STRICT;

  if (strict) {
    if (rawOrder !== "asc" && rawOrder !== "desc") {
      throw new ParseDataGridQueryError("Invalid sorting order");
    }
  }

  const order = rawOrder ?? "asc";
  return order;
}
