/**
 * Filter mode for data grid queries
 */
export type FilterMode = "search" | "filter";

/**
 * Sorting order for data grid queries
 */
export type SortingOrder = "asc" | "desc";

/**
 * Sorting configuration for data grid queries
 */
export interface Sorting<TOrderByKey extends string> {
  order: SortingOrder;
  orderBy: TOrderByKey | undefined;
}

/**
 * Pagination configuration for data grid queries
 */
export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Options for parsing pagination configuration
 */
export interface ParsePaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Filter key for data grid queries
 */
export type FilterKey = string;

/**
 * Filter value for data grid queries
 */
export type FilterValue = string[] | undefined;

/**
 * Filters configuration for data grid queries
 */
export type Filters = Record<FilterKey, FilterValue>;

/**
 * Filtering configuration for data grid queries
 */
export interface Filtering {
  filterMode: FilterMode | undefined;
  search: string | undefined;
  filters: Filters;
}
