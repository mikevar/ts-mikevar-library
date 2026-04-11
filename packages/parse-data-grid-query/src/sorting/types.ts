/**
 * Sorting order for data grid queries
 */
export type SortingOrderDirection = "asc" | "desc";

/**
 * Sorting configuration for data grid queries
 */
export interface Sorting<TOrderColumnKey extends string> {
  direction: SortingOrderDirection;
  column: TOrderColumnKey | undefined;
}

/**
 * Parse sorting options
 */
export interface ParseSortingOptions {
  strict?: boolean;
}
