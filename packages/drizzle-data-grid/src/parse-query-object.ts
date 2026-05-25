import type {
  ParsedQueryObject,
  QueryKeysOptions,
} from "@mikevar/data-grid-contracts";
import {
  DEFAULT_FILTER_MODE_KEY,
  DEFAULT_SEARCH_KEY,
  DEFAULT_PAGINATION_MODE_KEY,
  DEFAULT_PAGE_KEY,
  DEFAULT_LIMIT_KEY,
  DEFAULT_CURSOR_KEY,
  DEFAULT_ORDERS_KEY,
} from "@mikevar/data-grid-contracts";

function mergeDefaultAndCustomQueryKeys(
  customQueryKeys: QueryKeysOptions | undefined,
) {
  const DEFAULT_QUERY_KEYS = {
    filterMode: DEFAULT_FILTER_MODE_KEY,
    search: DEFAULT_SEARCH_KEY,
    paginationMode: DEFAULT_PAGINATION_MODE_KEY,
    page: DEFAULT_PAGE_KEY,
    limit: DEFAULT_LIMIT_KEY,
    cursor: DEFAULT_CURSOR_KEY,
    orders: DEFAULT_ORDERS_KEY,
  };

  return {
    filterMode: customQueryKeys?.filterMode ?? DEFAULT_QUERY_KEYS.filterMode,
    search: customQueryKeys?.search ?? DEFAULT_QUERY_KEYS.search,
    paginationMode:
      customQueryKeys?.paginationMode ?? DEFAULT_QUERY_KEYS.paginationMode,
    page: customQueryKeys?.page ?? DEFAULT_QUERY_KEYS.page,
    limit: customQueryKeys?.limit ?? DEFAULT_QUERY_KEYS.limit,
    cursor: customQueryKeys?.cursor ?? DEFAULT_QUERY_KEYS.cursor,
    orders: customQueryKeys?.orders ?? DEFAULT_QUERY_KEYS.orders,
  };
}

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
