import type { FilterMode } from "../filtering/types.ts";
import type { PaginationMode } from "../pagination/types.ts";
import type { SortingOrder } from "../sorting/types.ts";

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
