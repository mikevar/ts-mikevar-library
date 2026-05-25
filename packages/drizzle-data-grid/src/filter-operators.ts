import type { FilterOperator } from "@mikevar/data-grid";
import type { FieldSchemaColumn } from "./types.ts";
import {
  and,
  or,
  eq,
  ilike,
  gt,
  gte,
  lt,
  lte,
  isNull,
  isNotNull,
  inArray,
  type SQL,
  type AnyColumn,
  between,
} from "drizzle-orm";

export const filterOperators: Record<
  FilterOperator,
  (col: FieldSchemaColumn, values: (string | number | boolean | Date)[]) => SQL
> = {
  eq: (col, [val]) => eq(col, val),

  iLike: (col, [val]) => ilike(col as AnyColumn, `%${val}%`),

  gt: (col, [val]) => gt(col, val),
  gte: (col, [val]) => gte(col, val),
  lt: (col, [val]) => lt(col, val),
  lte: (col, [val]) => lte(col, val),

  between: (col, [val1, val2]) => between(col, val1 as string, val2 as string),

  isNull: (col, [val]) => (val === true ? isNull(col) : isNotNull(col)),

  inArray: (col, values) => inArray(col, values),
};
