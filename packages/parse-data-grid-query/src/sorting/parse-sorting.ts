import type {
  ParseSortingOptions,
  Sorting,
  SortingOrderDirection,
} from "./types.ts";
import { ParseDataGridQueryError } from "../core/errors.ts";
import { DEFAULT_STRICT, ORDERS_QUERY_KEY } from "../core/constants.ts";

/**
 * Parses sorting configuration from query parameters
 * @param query - The query object to parse
 * @param allowed - Array of allowed order by keys
 * @param defaultOrderBy - Default order by key to use if none is provided
 * @param options - Optional configuration for sorting defaults and limits
 * @returns Sorting configuration with order and orderBy
 */
export function parseSorting<TOrderColumnKey extends string>({
  query,
  allowed,
  defaultOrderBy,
  options,
}: {
  query: Record<string, string>;
  allowed: readonly TOrderColumnKey[];
  defaultOrderBy?: TOrderColumnKey;
  options?: ParseSortingOptions | undefined;
}): Sorting<TOrderColumnKey>[] {
  if (allowed.length === 0) {
    throw new ParseDataGridQueryError("Allowed array cannot be empty");
  }

  let strict = options?.strict ?? DEFAULT_STRICT;

  const ordersQueryKey = options?.queryKey?.orders ?? ORDERS_QUERY_KEY;

  const rawOrders = query[ordersQueryKey]?.split(",") || [];
  const orders: Sorting<TOrderColumnKey>[] = [];

  if (rawOrders.length > 0) {
    for (const rawOrder of rawOrders) {
      const explodedRawOrder = rawOrder.split(":");
      const rawColumn = explodedRawOrder[0] as TOrderColumnKey;
      const rawDirection = explodedRawOrder[1] as SortingOrderDirection;

      if (strict) {
        if (!allowed.includes(rawColumn)) {
          throw new ParseDataGridQueryError(
            `Sorting order column: "${rawColumn}" not allowed, must be one of: ${allowed.join(", ")}`,
          );
        }
      }

      orders.push({ column: rawColumn, direction: rawDirection });
    }
  } else {
    if (defaultOrderBy) {
      orders.push({ column: defaultOrderBy, direction: "asc" });
    } else {
      orders.push({ column: allowed[0], direction: "asc" });
    }
  }

  return orders;
}
