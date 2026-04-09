import { ParseDataGridQueryError } from "../../core/errors.ts";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_STRICT,
  MAX_LIMIT,
  LIMIT_QUERY_KEY,
  PAGE_QUERY_KEY,
} from "../../core/constants.ts";
import type { BaseRequestQueryObject } from "../../core/types.ts";
import type {
  OffsetPagination,
  OffsetParsePaginationOptions,
} from "../types.ts";
import { toNumber, calculateOffset } from "../functions.ts";

/**
 * Parses offset-based pagination configuration from query parameters
 * @param query - The query object to parse
 * @param options - Optional configuration for pagination defaults and limits
 * @returns Pagination configuration with page, limit, and offset
 */
export function parseOffsetPagination<
  T extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
>({
  query,
  options = {},
}: {
  query: T;
  options?: OffsetParsePaginationOptions;
}): OffsetPagination {
  const strict = options.strict ?? DEFAULT_STRICT;

  const defaultPage = options.defaultPage ?? DEFAULT_PAGE;
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;

  if (typeof query !== "object" || query === null) {
    if (strict) {
      throw new ParseDataGridQueryError("Query must be an object");
    }
    const page = defaultPage;
    const limit = defaultLimit;

    return {
      mode: "offset",
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

  if (strict) {
    if (typeof rawPage !== "number") {
      throw new ParseDataGridQueryError("Page must be a number");
    }
    if (
      rawPage !== undefined &&
      (rawPage < 1 || rawPage > Number.MAX_SAFE_INTEGER)
    ) {
      throw new ParseDataGridQueryError("Page must be a positive integer");
    }
    if (typeof rawLimit !== "number") {
      throw new ParseDataGridQueryError("Limit must be a number");
    }
    if (rawLimit !== undefined && (rawLimit < 1 || rawLimit > maxLimit)) {
      throw new ParseDataGridQueryError(
        `Limit must be between 1 and ${maxLimit}`,
      );
    }
  }

  const page = Math.max(rawPage ?? defaultPage, 1);
  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);

  const offset = calculateOffset({ page, limit });

  return { mode: "offset", page, limit, offset };
}
