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
