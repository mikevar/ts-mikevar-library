import {
  FilterMode,
  FilterOperator,
  OrderDirection,
  PaginationMode,
  FILTER_OPERATORS,
} from "@mikevar/data-grid-contracts";

export function isPaginationMode(v: unknown): v is PaginationMode {
  return v === "offset" || v === "cursor";
}

export function isOrderDirection(v: unknown): v is OrderDirection {
  return v === "asc" || v === "desc";
}

export function isFilterMode(v: unknown): v is FilterMode {
  return v === "search" || v === "filter";
}

export function toPositiveInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function isFilterOperator(v: unknown): v is FilterOperator {
  return FILTER_OPERATORS.includes(v as FilterOperator);
}
