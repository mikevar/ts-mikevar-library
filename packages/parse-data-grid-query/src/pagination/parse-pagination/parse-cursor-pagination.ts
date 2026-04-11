import { ParseDataGridQueryError } from "../../core/errors.ts";
import {
  DEFAULT_LIMIT,
  DEFAULT_CURSOR,
  MAX_LIMIT,
  LIMIT_QUERY_KEY,
  CURSOR_QUERY_KEY,
  DEFAULT_STRICT,
} from "../../core/constants.ts";
import type {
  CursorPagination,
  CursorParsePaginationOptions,
} from "../types.ts";
import { toNumber } from "../functions.ts";

/**
 * Parses cursor-based pagination configuration from query parameters
 * @param query - The query object to parse
 * @param options - Optional configuration for pagination defaults and limits
 * @returns Pagination configuration with cursor and limit
 */
export function parseCursorPagination({
  query,
  options = {},
}: {
  query: Record<string, string>;
  options?: CursorParsePaginationOptions;
}): CursorPagination {
  const strict = options.strict ?? DEFAULT_STRICT;

  const defaultCursor = options.defaultCursor ?? DEFAULT_CURSOR;
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;

  if (typeof query !== "object" || query === null) {
    if (strict) {
      throw new ParseDataGridQueryError("Query must be an object");
    }
    const cursor = defaultCursor;
    const limit = defaultLimit;

    return {
      mode: "cursor",
      cursor,
      limit,
    };
  }

  const {
    cursor: cursorQueryKey = CURSOR_QUERY_KEY,
    limit: limitQueryKey = LIMIT_QUERY_KEY,
  } = options.queryKey ?? {};

  const q = query as {
    [cursorQueryKey]?: unknown;
    [limitQueryKey]?: unknown;
  };

  const rawCursor = q[cursorQueryKey];
  const rawLimit = toNumber(q[limitQueryKey]);

  if (strict) {
    if (typeof rawCursor !== "string") {
      throw new ParseDataGridQueryError("Cursor must be a string");
    }
    if (typeof rawLimit !== "number") {
      throw new ParseDataGridQueryError("Limit must be a number");
    }
    if (isNaN(rawLimit)) {
      throw new ParseDataGridQueryError("Limit must be a valid number");
    }
    if (rawLimit !== undefined && (rawLimit < 1 || rawLimit > maxLimit)) {
      throw new ParseDataGridQueryError(
        `Limit must be between 1 and ${maxLimit}`,
      );
    }
  }

  const cursor = (rawCursor as string) ?? defaultCursor;
  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);

  return {
    mode: "cursor",
    cursor,
    limit,
  };
}
