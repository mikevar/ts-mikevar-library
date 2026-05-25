import type { ParsedQueryObject, QueryKeysOptions } from "./types.ts";
import { mergeDefaultAndCustomQueryKeys } from "./utils.ts";

interface ParseQueryObjectParams {
  query: Record<string, string>;
  queryKeys?: QueryKeysOptions | undefined;
}

export function parseQueryObject({
  query,
  queryKeys,
}: ParseQueryObjectParams): ParsedQueryObject {
  const keys = mergeDefaultAndCustomQueryKeys(queryKeys);

  const reserved = new Set(Object.values(keys));

  const filters: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (!reserved.has(key)) {
      filters[key] = value;
    }
  }

  return {
    pagination: {
      mode: query[keys.paginationMode] as string,
      page: query[keys.page] as string,
      limit: query[keys.limit] as string,
      cursor: query[keys.cursor] as string,
    },
    sorting: {
      orders: query[keys.orders] as string,
    },
    filtering: {
      mode: query[keys.filterMode] as string,
      search: query[keys.search] as string,
      filters,
    },
  };
}
