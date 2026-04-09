import type { FilterMode } from "../filtering/types.ts";
import type { PaginationMode } from "../pagination/types.ts";
import type { SortingOrderDirection } from "../sorting/types.ts";

/**
 * Base request query object for data grid queries
 */
export type BaseRequestQueryObject<TOrderColumnKey extends string> = {
  paginationMode: PaginationMode;
  page?: number;
  cursor?: string;
  limit: number;
  order: SortingOrderDirection;
  orderBy: TOrderColumnKey;
  filterMode: FilterMode;
  search?: string;
};
