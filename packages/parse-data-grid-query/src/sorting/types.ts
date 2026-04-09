/**
 * Sorting order for data grid queries
 */
export type SortingOrder = "asc" | "desc";

/**
 * Sorting configuration for data grid queries
 */
export interface Sorting<TOrderColumnKey extends string> {
  order: SortingOrder;
  orderBy: TOrderColumnKey | undefined;
}

/**
 * Parse sorting options
 */
export interface ParseSortingOptions {
  strict?: boolean;
}
