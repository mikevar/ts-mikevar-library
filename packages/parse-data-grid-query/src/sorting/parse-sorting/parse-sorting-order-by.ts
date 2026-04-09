import { DEFAULT_STRICT, ORDER_BY_QUERY_KEY } from "../../core/constants.ts";
import { ParseDataGridQueryError } from "../../core/errors.ts";
import type { ParseSortingOptions } from "../../core/types.ts";

/**
 * Parses the sorting order by from query parameters
 * @param query - The query object to parse
 * @param allowed - Array of allowed order by keys
 * @param defaultOrderBy - Default order by key to use if none is provided
 * @param options - Optional configuration for sorting defaults and limits
 * @returns The sorting order by key or undefined if not allowed
 */
export function parseSortingOrderBy<TOrderByKey extends string>({
  query,
  allowed,
  defaultOrderBy,
  options,
}: {
  query: unknown;
  allowed: readonly TOrderByKey[];
  defaultOrderBy?: TOrderByKey | undefined;
  options?: ParseSortingOptions | undefined;
}): TOrderByKey | undefined {
  if (allowed.length === 0) {
    throw new ParseDataGridQueryError("Allowed array cannot be empty");
  }

  let strict = options?.strict ?? DEFAULT_STRICT;

  let orderBy: TOrderByKey | undefined = (
    query as {
      [ORDER_BY_QUERY_KEY]?: TOrderByKey;
    }
  )?.[ORDER_BY_QUERY_KEY];

  if (strict) {
    if (!orderBy) {
      throw new ParseDataGridQueryError("Missing sorting order by");
    }
    if (!allowed.includes(orderBy)) {
      throw new ParseDataGridQueryError(
        `Sorting order by: "${orderBy}" not allowed, must be one of: ${allowed.join(", ")}`,
      );
    }
  }

  if (orderBy && !allowed.includes(orderBy)) {
    if (defaultOrderBy) {
      orderBy = defaultOrderBy;
    } else {
      orderBy = allowed[0];
    }
  }

  return orderBy;
}
