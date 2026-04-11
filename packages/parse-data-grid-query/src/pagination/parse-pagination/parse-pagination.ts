import { ParseDataGridQueryError } from "../../core/errors.ts";
import {
  DEFAULT_PAGINATION_MODE,
  DEFAULT_STRICT,
  PAGINATION_MODE_QUERY_KEY,
} from "../../core/constants.ts";
import type {
  Pagination,
  ParsePaginationOptions,
  OffsetParsePaginationOptions,
  CursorParsePaginationOptions,
} from "../types.ts";
import { parseOffsetPagination } from "./parse-offset-pagination.ts";
import { parseCursorPagination } from "./parse-cursor-pagination.ts";

/**
 * Determines the pagination mode from query parameters
 * @param query - The query object to parse
 * @param options - Optional configuration for pagination defaults and limits
 * @returns The pagination mode ("offset" or "cursor")
 */
export function determinePaginationMode({
  query,
  options = {},
}: {
  query: Record<string, string>;
  options?: ParsePaginationOptions;
}): "offset" | "cursor" {
  const strict = options.strict ?? DEFAULT_STRICT;

  const defaultPaginationMode =
    options.defaultPaginationMode ?? DEFAULT_PAGINATION_MODE;

  if (typeof query !== "object" || query === null) {
    if (strict) {
      throw new ParseDataGridQueryError("Query must be an object");
    }
    return defaultPaginationMode;
  }

  const paginationModeQueryKey =
    options.queryKey?.paginationMode ?? PAGINATION_MODE_QUERY_KEY;

  let paginationMode = (query as any)[paginationModeQueryKey] as
    | "offset"
    | "cursor"
    | undefined;
  if (!paginationMode) {
    if (strict) {
      throw new ParseDataGridQueryError("Pagination mode is required");
    }
    paginationMode = defaultPaginationMode;
  }
  if (paginationMode !== "offset" && paginationMode !== "cursor") {
    if (strict) {
      throw new ParseDataGridQueryError(
        `Invalid pagination mode: ${paginationMode}`,
      );
    }
    paginationMode = defaultPaginationMode;
  }
  return paginationMode;
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
  query: Record<string, string>;
  options?: ParsePaginationOptions;
}): Pagination {
  const paginationMode = determinePaginationMode({ query, options }) as
    | "offset"
    | "cursor";

  if (paginationMode === "offset") {
    return parseOffsetPagination({
      query,
      options: options as OffsetParsePaginationOptions,
    });
  } else if (paginationMode === "cursor") {
    return parseCursorPagination({
      query,
      options: options as CursorParsePaginationOptions,
    });
  } else {
    throw new ParseDataGridQueryError(
      `Fatal error: assigned pagination mode after validation is invalid (${paginationMode})`,
    );
  }
}
