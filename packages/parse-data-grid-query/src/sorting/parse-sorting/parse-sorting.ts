import type { BaseRequestQueryObject } from "../../core/types.ts";
import type { ParseSortingOptions, Sorting } from "../types.ts";
import { parseSortingOrder } from "./parse-sorting-order.ts";
import { parseSortingOrderBy } from "./parse-sorting-order-by.ts";

/**
 * Parses sorting configuration from query parameters
 * @param query - The query object to parse
 * @param allowed - Array of allowed order by keys
 * @param defaultOrderBy - Default order by key to use if none is provided
 * @param options - Optional configuration for sorting defaults and limits
 * @returns Sorting configuration with order and orderBy
 */
export function parseSorting<
  TQuery extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
>({
  query,
  allowed,
  defaultOrderBy,
  options,
}: {
  query: TQuery;
  allowed: readonly TOrderColumnKey[];
  defaultOrderBy?: TOrderColumnKey;
  options?: ParseSortingOptions | undefined;
}): Sorting<TOrderColumnKey> {
  const order = parseSortingOrder({ query, options });
  const orderBy = parseSortingOrderBy<TOrderColumnKey>({
    query,
    allowed,
    defaultOrderBy,
    options,
  });
  return { order, orderBy };
}
