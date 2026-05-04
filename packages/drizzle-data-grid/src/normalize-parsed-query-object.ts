import type {
  FilterObject,
  NormalizedQueryObject,
  OrderObject,
  ParsedQueryObject,
  CursorPaginationObject,
  OffsetPaginationObject,
  FieldSchemaObjectType,
} from "./types.ts";
import {
  isPaginationMode,
  isOrderDirection,
  isFilterMode,
  toPositiveInt,
  isFilterOperator,
} from "./helpers.ts";
import {
  COL_DIRECTION_SEPARATOR,
  COL_OPERATOR_SEPARATOR,
  DEFAULT_CURSOR,
  DEFAULT_FILTER_MODE,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_PAGINATION_MODE,
  DEFAULT_SEARCH,
} from "./consts.ts";

interface NormalizeParsedQueryObjectParams {
  parsedQuery: ParsedQueryObject;
}

export function normalizeParsedQueryObject({
  parsedQuery,
}: NormalizeParsedQueryObjectParams): NormalizedQueryObject {
  const paginationMode = isPaginationMode(parsedQuery.pagination.mode)
    ? parsedQuery.pagination.mode
    : DEFAULT_PAGINATION_MODE;
  const page = toPositiveInt(parsedQuery.pagination.page, DEFAULT_PAGE);
  const limit = toPositiveInt(parsedQuery.pagination.limit, DEFAULT_LIMIT);
  const cursor = parsedQuery.pagination.cursor ?? DEFAULT_CURSOR;

  const pagination =
    paginationMode === "offset"
      ? ({
          mode: "offset",
          page,
          limit,
        } as OffsetPaginationObject)
      : ({
          mode: "cursor",
          cursor,
          limit,
        } as CursorPaginationObject);

  const explodedOrders = parsedQuery.sorting.orders?.split(",") || [];
  const orders = explodedOrders
    .map((order) => {
      const [column, direction] = order
        .split(COL_DIRECTION_SEPARATOR)
        .map((s) => s.trim());
      if (!column) return null;

      return {
        column,
        direction: isOrderDirection(direction) ? direction : "asc",
      };
    })
    .filter((item): item is OrderObject => item !== null);

  const filters = Object.entries(parsedQuery.filtering.filters)
    .map(([colOperator, value]) => {
      const [col, operator] = colOperator.split(COL_OPERATOR_SEPARATOR);

      if (!col || !isFilterOperator(operator)) return null;

      const column = col.trim();
      const valueTrimmed = value.trim();

      return {
        column,
        operator,
        value: valueTrimmed,
      };
    })
    .filter((item): item is FilterObject => item !== null);

  return {
    pagination,
    sorting: {
      orders: orders,
    },
    filtering: {
      mode: isFilterMode(parsedQuery.filtering.mode)
        ? parsedQuery.filtering.mode
        : DEFAULT_FILTER_MODE,
      search: parsedQuery.filtering.search ?? DEFAULT_SEARCH,
      filters: filters,
    },
  };
}
