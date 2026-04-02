import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  LIMIT_QUERY_KEY,
  PAGE_QUERY_KEY,
} from "./constants.ts";
import { type Pagination, type ParsePaginationOptions } from "./types.ts";

/**
 * Converts a value to a number, returning null if conversion fails
 * @param value - The value to convert
 * @returns The converted number or null if conversion fails
 */
function toNumber(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(n) ? n : null;
}

/**
 * Calculates the offset for pagination based on page and limit
 * @param page - The page number (1-indexed)
 * @param limit - The number of items per page
 * @returns The calculated offset
 */
export function calculateOffset({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): number {
  return (page - 1) * limit;
}

/**
 * Parses pagination configuration from query parameters
 * @param query - The query object to parse
 * @param options - Optional configuration for pagination defaults and limits
 * @returns Pagination configuration with page, limit, and offset
 */
export function parsePagination({
  query,
  options = {},
}: {
  query: unknown;
  options?: ParsePaginationOptions;
}): Pagination {
  const defaultPage = options.defaultPage ?? DEFAULT_PAGE;
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;

  if (typeof query !== "object" || query === null) {
    const page = defaultPage;
    const limit = defaultLimit;

    return {
      page,
      limit,
      offset: calculateOffset({ page, limit }),
    };
  }

  const q = query as {
    [PAGE_QUERY_KEY]?: unknown;
    [LIMIT_QUERY_KEY]?: unknown;
  };

  const rawPage = toNumber(q[PAGE_QUERY_KEY]);
  const rawLimit = toNumber(q[LIMIT_QUERY_KEY]);

  const page = Math.max(rawPage ?? defaultPage, 1);
  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);

  const offset = calculateOffset({ page, limit });

  return { page, limit, offset };
}
