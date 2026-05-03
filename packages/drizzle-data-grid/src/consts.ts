import type { FilterMode, PaginationMode } from "./types.ts";

export const COL_DIRECTION_SEPARATOR = ":";
export const COL_OPERATOR_SEPARATOR = "__";

export const DEFAULT_PAGINATION_MODE: PaginationMode = "offset";
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_CURSOR = "";
export const DEFAULT_FILTER_MODE: FilterMode = "search";
export const DEFAULT_SEARCH = "";

export const FILTER_OPERATORS = [
  "eq",
  "gt",
  "gte",
  "lt",
  "lte",
  "between",
  "iLike",
  "isNull",
  "inArray",
] as const;
