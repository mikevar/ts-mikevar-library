import type {
  FilterObject,
  NormalizedQueryObject,
  OrderObject,
  ParsedQueryObject,
  CursorPaginationObject,
  OffsetPaginationObject,
  DefaultQueryValuesOptions,
} from "./types.ts";
import { COL_DIRECTION_SEPARATOR, COL_OPERATOR_SEPARATOR } from "./consts.ts";
import {
  isPaginationMode,
  isOrderDirection,
  isFilterMode,
  toPositiveInt,
  isFilterOperator,
} from "./helpers.ts";
import {
  mergeDefaultAndCustomQueryKeys,
  mergeDefaultQueryValues,
} from "./utils.ts";

interface NormalizeParsedQueryObjectParams {
  parsedQuery: ParsedQueryObject;
  defaultQueryValues?: DefaultQueryValuesOptions | undefined;
}

export function normalizeParsedQueryObject({
  parsedQuery,
  defaultQueryValues,
}: NormalizeParsedQueryObjectParams): NormalizedQueryObject {
  const defaultValues = mergeDefaultQueryValues(defaultQueryValues);

  const paginationMode = isPaginationMode(parsedQuery.pagination.mode)
    ? parsedQuery.pagination.mode
    : defaultValues.pagination.mode;
  const page = toPositiveInt(
    parsedQuery.pagination.page,
    defaultValues.pagination.page,
  );
  const limit = toPositiveInt(
    parsedQuery.pagination.limit,
    defaultValues.pagination.limit,
  );
  const cursor =
    parsedQuery.pagination.cursor ?? defaultValues.pagination.cursor;

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
        : defaultValues.filtering.mode,
      search: parsedQuery.filtering.search ?? defaultValues.filtering.search,
      filters: filters,
    },
  };
}
