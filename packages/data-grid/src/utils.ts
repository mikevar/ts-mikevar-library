import type { QueryKeysOptions, DefaultQueryValuesOptions } from "./types.ts";
import {
  DEFAULT_FILTER_MODE_KEY,
  DEFAULT_SEARCH_KEY,
  DEFAULT_PAGINATION_MODE_KEY,
  DEFAULT_PAGE_KEY,
  DEFAULT_LIMIT_KEY,
  DEFAULT_CURSOR_KEY,
  DEFAULT_ORDERS_KEY,
  DEFAULT_CURSOR,
  DEFAULT_FILTER_MODE,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_PAGINATION_MODE,
  DEFAULT_SEARCH,
} from "./consts.ts";

export function mergeDefaultAndCustomQueryKeys(
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

export function mergeDefaultQueryValues(
  defaultQueryValues?: DefaultQueryValuesOptions,
) {
  if (defaultQueryValues === undefined) {
    return {
      pagination: {
        mode: DEFAULT_PAGINATION_MODE,
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
        cursor: DEFAULT_CURSOR,
      },
      sorting: {
        orders: [],
      },
      filtering: {
        mode: DEFAULT_FILTER_MODE,
        search: DEFAULT_SEARCH,
        filters: [],
      },
    };
  }

  return {
    pagination: {
      mode: defaultQueryValues.paginationMode ?? DEFAULT_PAGINATION_MODE,
      page: defaultQueryValues.page ?? DEFAULT_PAGE,
      limit: defaultQueryValues.limit ?? DEFAULT_LIMIT,
      cursor: defaultQueryValues.cursor ?? DEFAULT_CURSOR,
    },
    sorting: {
      orders: defaultQueryValues.orders ?? [],
    },
    filtering: {
      mode: defaultQueryValues.filterMode ?? DEFAULT_FILTER_MODE,
      search: defaultQueryValues.search ?? DEFAULT_SEARCH,
      filters: defaultQueryValues.filters ?? [],
    },
  };
}
