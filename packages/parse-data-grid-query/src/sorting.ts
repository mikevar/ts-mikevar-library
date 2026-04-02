import { ORDER_BY_QUERY_KEY, ORDER_QUERY_KEY } from "./constants";
import { type Sorting, type SortingOrder } from "./types";

/**
 * Parses the sorting order from query parameters
 * @param query - The query object to parse
 * @returns The sorting order ("asc" or "desc")
 */
export function parseSortingOrder({ query }: { query: unknown }): SortingOrder {
  const order =
    (query as { [ORDER_QUERY_KEY]?: SortingOrder })?.[ORDER_QUERY_KEY] ?? "asc";
  return order;
}

/**
 * Parses the sorting order by from query parameters
 * @param query - The query object to parse
 * @param allowed - Array of allowed order by keys
 * @param defaultOrderBy - Default order by key to use if none is provided
 * @returns The sorting order by key or undefined if not allowed
 */
export function parseSortingOrderBy<TOrderByKey extends string>({
  query,
  allowed,
  defaultOrderBy,
}: {
  query: unknown;
  allowed: readonly TOrderByKey[];
  defaultOrderBy?: TOrderByKey | undefined;
}): TOrderByKey | undefined {
  if (allowed.length === 0) {
    throw new Error("Allowed array cannot be empty");
  }

  let orderBy: TOrderByKey | undefined = (
    query as {
      [ORDER_BY_QUERY_KEY]?: TOrderByKey;
    }
  )?.[ORDER_BY_QUERY_KEY];

  if (orderBy && !allowed.includes(orderBy)) {
    if (defaultOrderBy) {
      orderBy = defaultOrderBy;
    } else {
      orderBy = allowed[0];
    }
  }

  return orderBy;
}

/**
 * Parses sorting configuration from query parameters
 * @param query - The query object to parse
 * @param allowed - Array of allowed order by keys
 * @param defaultOrderBy - Default order by key to use if none is provided
 * @returns Sorting configuration with order and orderBy
 */
export function parseSorting<TOrderByKey extends string>({
  query,
  allowed,
  defaultOrderBy,
}: {
  query: unknown;
  allowed: readonly TOrderByKey[];
  defaultOrderBy?: TOrderByKey;
}): Sorting<TOrderByKey> {
  const order = parseSortingOrder({ query });
  const orderBy = parseSortingOrderBy<TOrderByKey>({
    query,
    allowed,
    defaultOrderBy,
  });
  return { order, orderBy };
}
