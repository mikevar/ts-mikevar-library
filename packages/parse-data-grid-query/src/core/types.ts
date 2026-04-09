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
 * Parse sorting options
 */
export interface ParseSortingOptions {
  strict?: boolean;
}

/**
 * Pagination mode for data grid queries
 */
export type PaginationMode = "offset" | "cursor";

/**
 * Base pagination configuration
 */
export interface BasePagination {
  mode: PaginationMode;
  limit: number;
}

/**
 * Offset-based pagination configuration
 */
export interface OffsetPagination extends BasePagination {
  page: number;
  offset: number;
}

/**
 * Cursor-based pagination configuration
 */
export interface CursorPagination extends BasePagination {
  cursor: string;
}

/**
 * Pagination configuration for data grid queries
 */
export type Pagination = OffsetPagination | CursorPagination;

/**
 * Base pagination options
 */
export interface BaseParsePaginationOptions {
  defaultPaginationMode?: PaginationMode;
  defaultLimit?: number;
  maxLimit?: number;
  strict?: boolean;
}

/**
 * Offset-based pagination options
 */
export interface OffsetParsePaginationOptions extends BaseParsePaginationOptions {
  defaultPage?: number;
}

/**
 * Cursor-based pagination options
 */
export interface CursorParsePaginationOptions extends BaseParsePaginationOptions {
  defaultCursor?: string;
}

/**
 * Options for parsing pagination configuration
 */
export type ParsePaginationOptions =
  | OffsetParsePaginationOptions
  | CursorParsePaginationOptions;

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

/**
 * Parse filtering options
 */
export interface ParseFilteringOptions {
  strict?: boolean;
}

/**
 * Base request query object for data grid queries
 */
export type BaseRequestQueryObject<TOrderByKey extends string> = {
  paginationMode: PaginationMode;
  page?: number;
  cursor?: string;
  limit: number;
  order: SortingOrder;
  orderBy: TOrderByKey;
  filterMode: FilterMode;
  search?: string;
};
