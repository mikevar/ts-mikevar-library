import type { ParsedQueryObject, QueryKeysOptions } from "./types.ts";

interface ParseQueryObjectParams {
  query: Record<string, string>;
  queryKeys?: QueryKeysOptions | undefined;
}

export function parseQueryObject({
  query,
  queryKeys,
}: ParseQueryObjectParams): ParsedQueryObject {
  const DEFAULT_QUERY_KEYS = {
    filterMode: "filterMode",
    search: "search",
    paginationMode: "paginationMode",
    page: "page",
    limit: "limit",
    cursor: "cursor",
    orders: "orders",
  };

  const keys = {
    filterMode: queryKeys?.filterMode ?? DEFAULT_QUERY_KEYS.filterMode,
    search: queryKeys?.search ?? DEFAULT_QUERY_KEYS.search,
    paginationMode:
      queryKeys?.paginationMode ?? DEFAULT_QUERY_KEYS.paginationMode,
    page: queryKeys?.page ?? DEFAULT_QUERY_KEYS.page,
    limit: queryKeys?.limit ?? DEFAULT_QUERY_KEYS.limit,
    cursor: queryKeys?.cursor ?? DEFAULT_QUERY_KEYS.cursor,
    orders: queryKeys?.orders ?? DEFAULT_QUERY_KEYS.orders,
  };

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
