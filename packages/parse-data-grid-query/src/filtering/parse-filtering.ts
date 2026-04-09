import { ParseDataGridQueryError } from "../core/errors.ts";
import {
  FILTER_MODE_QUERY_KEY,
  SEARCH_QUERY_KEY,
  RESERVED_QUERY_KEYS,
  DEFAULT_STRICT,
} from "../core/constants.ts";
import type { BaseRequestQueryObject } from "../core/types.ts";
import type {
  FilterMode,
  Filtering,
  Filters,
  ParseFilteringOptions,
} from "./types.ts";

/**
 * Parses filtering configuration from query parameters
 * @param query - The query object to parse
 * @returns Filtering configuration with search or filter mode
 */
export function parseFiltering<
  T extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
>({
  query,
  options,
}: {
  query: T;
  options?: ParseFilteringOptions;
}): Filtering {
  const strict = options?.strict ?? DEFAULT_STRICT;

  const q = query as Record<string, unknown>;

  const filterMode = q[FILTER_MODE_QUERY_KEY] as FilterMode | undefined;
  let search: string | undefined;
  let filters: Filters = {};

  if (strict) {
    if (filterMode && !["search", "filter"].includes(filterMode)) {
      throw new ParseDataGridQueryError("Invalid filter mode");
    }
  }

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
    if (strict) {
      throw new ParseDataGridQueryError("Invalid filter mode");
    }
  }

  return { filterMode, search, filters };
}
