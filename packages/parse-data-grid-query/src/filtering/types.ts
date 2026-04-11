/**
 * Filter mode for data grid queries
 */
export type FilterMode = "search" | "filter";

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
  queryKey?: {
    filterMode?: string | undefined;
    search?: string | undefined;
    paginationMode?: string | undefined;
    page?: string | undefined;
    limit?: string | undefined;
    cursor?: string | undefined;
    orders?: string | undefined;
  };
}
