import {
  DEFAULT_PAGINATION_MODE,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_CURSOR,
  MAX_LIMIT,
  LIMIT_QUERY_KEY,
  PAGINATION_MODE_QUERY_KEY,
  PAGE_QUERY_KEY,
  CURSOR_QUERY_KEY,
} from "./constants.ts";
import type {
  BaseRequestQueryObject,
  Pagination,
  OffsetPagination,
  CursorPagination,
  ParsePaginationOptions,
  OffsetParsePaginationOptions,
  CursorParsePaginationOptions,
} from "./types.ts";

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
export function parsePagination<
  T extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
>({
  query,
  options = {},
}: {
  query: T;
  options?: ParsePaginationOptions;
}): Pagination {
  const defaultPaginationMode =
    options.defaultPaginationMode ?? DEFAULT_PAGINATION_MODE;

  if (typeof query !== "object" || query === null) {
    return parseOffsetPagination<T, TOrderByKey>({
      query,
      options: options as OffsetParsePaginationOptions,
    });
  }

  let paginationMode = (query as any)[PAGINATION_MODE_QUERY_KEY] as
    | "offset"
    | "cursor"
    | undefined;
  if (!paginationMode) {
    paginationMode = defaultPaginationMode;
  }
  if (paginationMode !== "offset" && paginationMode !== "cursor") {
    paginationMode = defaultPaginationMode;
  }

  if (paginationMode === "offset") {
    return parseOffsetPagination<T, TOrderByKey>({
      query,
      options: options as OffsetParsePaginationOptions,
    });
  } else if (paginationMode === "cursor") {
    return parseCursorPagination<T, TOrderByKey>({
      query,
      options: options as CursorParsePaginationOptions,
    });
  } else {
    throw new Error(
      `Fatal error: assigned pagination mode after validation is invalid (${paginationMode})`,
    );
  }
}

/**
 * Parses offset-based pagination configuration from query parameters
 * @param query - The query object to parse
 * @param options - Optional configuration for pagination defaults and limits
 * @returns Pagination configuration with page, limit, and offset
 */
export function parseOffsetPagination<
  T extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
>({
  query,
  options = {},
}: {
  query: T;
  options?: OffsetParsePaginationOptions;
}): OffsetPagination {
  const defaultPage = options.defaultPage ?? DEFAULT_PAGE;
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;

  if (typeof query !== "object" || query === null) {
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

  const page = Math.max(rawPage ?? defaultPage, 1);
  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);

  const offset = calculateOffset({ page, limit });

  return { mode: "offset", page, limit, offset };
}

/**
 * Parses cursor-based pagination configuration from query parameters
 * @param query - The query object to parse
 * @param options - Optional configuration for pagination defaults and limits
 * @returns Pagination configuration with cursor and limit
 */
export function parseCursorPagination<
  T extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
>({
  query,
  options = {},
}: {
  query: T;
  options?: CursorParsePaginationOptions;
}): CursorPagination {
  const defaultCursor = options.defaultCursor ?? DEFAULT_CURSOR;
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;

  if (typeof query !== "object" || query === null) {
    const cursor = defaultCursor;
    const limit = defaultLimit;

    return {
      mode: "cursor",
      cursor,
      limit,
    };
  }

  const q = query as {
    [CURSOR_QUERY_KEY]?: unknown;
    [LIMIT_QUERY_KEY]?: unknown;
  };

  const rawCursor = q[CURSOR_QUERY_KEY];
  const rawLimit = toNumber(q[LIMIT_QUERY_KEY]);

  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);

  return {
    mode: "cursor",
    cursor: (rawCursor as string) ?? defaultCursor,
    limit,
  };
}
