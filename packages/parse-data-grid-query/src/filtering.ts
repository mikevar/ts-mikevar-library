import {
  FILTER_MODE_QUERY_KEY,
  SEARCH_QUERY_KEY,
  RESERVED_QUERY_KEYS,
} from "./constants.ts";
import { type FilterMode, type Filtering } from "./types.ts";

/**
 * Parses filtering configuration from query parameters
 * @param query - The query object to parse
 * @returns Filtering configuration with search or filter mode
 */
export function parseFiltering({ query }: { query: unknown }): Filtering {
  const q = query as Record<string, unknown>;

  const filterMode = q[FILTER_MODE_QUERY_KEY] as FilterMode | undefined;
  let filters: Record<string, unknown> = {};

  if (filterMode === "search") {
    filters.search = q[SEARCH_QUERY_KEY] as string | undefined;
  } else if (filterMode === "filter") {
    const filtered = Object.fromEntries(
      Object.entries(q).filter(
        ([key]) => !RESERVED_QUERY_KEYS.includes(key as any),
      ),
    );
    filters = { ...filtered };
  } else {
    // return empty object for no filter mode
  }

  return {
    filterMode,
    filters,
  };
}
