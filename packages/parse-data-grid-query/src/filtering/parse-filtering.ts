import { ParseDataGridQueryError } from "../core/errors.ts";
import {
  FILTER_MODE_QUERY_KEY,
  SEARCH_QUERY_KEY,
  RESERVED_QUERY_KEYS,
  PAGINATION_MODE_QUERY_KEY,
  PAGE_QUERY_KEY,
  LIMIT_QUERY_KEY,
  CURSOR_QUERY_KEY,
  ORDERS_QUERY_KEY,
  DEFAULT_STRICT,
} from "../core/constants.ts";
import type {
  FilterMode,
  Filtering,
  Filters,
  ParseFilteringOptions,
} from "./types.ts";

/**
 * Compiles the reserved query keys based on the provided options
 * @param options - The parsing options
 * @returns The compiled reserved query keys
 */
export function compileReservedQueryKeys(options?: ParseFilteringOptions) {
  if (!options) {
    return RESERVED_QUERY_KEYS;
  }

  if (!options.queryKey) {
    return RESERVED_QUERY_KEYS;
  }

  const {
    filterMode = FILTER_MODE_QUERY_KEY,
    search = SEARCH_QUERY_KEY,
    paginationMode = PAGINATION_MODE_QUERY_KEY,
    page = PAGE_QUERY_KEY,
    limit = LIMIT_QUERY_KEY,
    cursor = CURSOR_QUERY_KEY,
    orders = ORDERS_QUERY_KEY,
  } = options!.queryKey! ?? {};

  return [filterMode, search, paginationMode, page, limit, cursor, orders];
}

/**
 * Parses filtering configuration from query parameters
 * @param query - The query object to parse
 * @returns Filtering configuration with search or filter mode
 */
export function parseFiltering({
  query,
  options,
}: {
  query: Record<string, string>;
  options?: ParseFilteringOptions;
}): Filtering {
  const strict = options?.strict ?? DEFAULT_STRICT;

  const q = query as Record<string, unknown>;

  const filterModeQueryKey =
    options?.queryKey?.filterMode ?? FILTER_MODE_QUERY_KEY;
  const searchQueryKey = options?.queryKey?.search ?? SEARCH_QUERY_KEY;
  const reservedQueryKeys = compileReservedQueryKeys(options);

  const filterMode = q[filterModeQueryKey] as FilterMode | undefined;
  let search: string | undefined;
  let filters: Filters = {};

  if (strict) {
    if (filterMode && !["search", "filter"].includes(filterMode)) {
      throw new ParseDataGridQueryError("Invalid filter mode");
    }
  }

  if (filterMode === "search") {
    search = q[searchQueryKey] as string | undefined;
  } else if (filterMode === "filter") {
    const filtered = Object.fromEntries(
      Object.entries(q)
        .filter(([key]) => !reservedQueryKeys.includes(key as any))
        .map(([key, value]) => {
          const explodedValues = (value as string).split(",");
          return [key, explodedValues];
        }),
    );
    filters = { ...filtered };
  } else {
    if (strict) {
      throw new ParseDataGridQueryError("Invalid filter mode");
    }
  }

  return { filterMode, search, filters };
}
