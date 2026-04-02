import {
  FILTER_MODE_QUERY_KEY,
  SEARCH_QUERY_KEY,
  RESERVED_QUERY_KEYS,
} from "./constants.ts";
import type {
  BaseRequestQueryObject,
  FilterMode,
  Filtering,
  Filters,
} from "./types.ts";

/**
 * Parses filtering configuration from query parameters
 * @param query - The query object to parse
 * @returns Filtering configuration with search or filter mode
 */
export function parseFiltering<
  T extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
>({ query }: { query: T }): Filtering {
  const q = query as Record<string, unknown>;

  const filterMode = q[FILTER_MODE_QUERY_KEY] as FilterMode | undefined;
  let search: string | undefined;
  let filters: Filters = {};

  if (filterMode === "search") {
    search = q[SEARCH_QUERY_KEY] as string | undefined;
  } else if (filterMode === "filter") {
    const filtered = Object.fromEntries(
      Object.entries(q)
        .filter(([key]) => !RESERVED_QUERY_KEYS.includes(key as any))
        .map(([key, value]) => {
          const explodedValues = (value as string).split(",");
          return [key, explodedValues];
        }),
    );
    filters = { ...filtered };
  } else {
    // return empty object for no filter mode
  }

  return {
    filterMode,
    search,
    filters,
  };
}
