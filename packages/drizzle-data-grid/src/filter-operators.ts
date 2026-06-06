import type { FilterOperator } from "@mikevar/data-grid";
import type { FieldSchemaColumn } from "./types.ts";
import {
  and,
  arrayContains,
  arrayContained,
  arrayOverlaps,
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
  ne,
  notInArray,
  notBetween,
  notIlike,
} from "drizzle-orm";

export const filterOperators: Record<
  FilterOperator,
  (col: FieldSchemaColumn, values: (string | number | boolean | Date)[]) => SQL
> = {
  eq: (col, [val]) => eq(col, val),
  ne: (col, [val]) => ne(col, val),

  gt: (col, [val]) => gt(col, val),
  gte: (col, [val]) => gte(col, val),
  lt: (col, [val]) => lt(col, val),
  lte: (col, [val]) => lte(col, val),

  isNull: (col, [val]) => (val === true ? isNull(col) : isNotNull(col)),
  isNotNull: (col, [val]) => (val === true ? isNotNull(col) : isNotNull(col)),

  inArray: (col, values) => inArray(col, values),
  notInArray: (col, values) => notInArray(col, values),

  between: (col, [val1, val2]) => between(col, val1 as string, val2 as string),
  notBetween: (col, [val1, val2]) =>
    notBetween(col, val1 as string, val2 as string),

  ilike: (col, [val]) => ilike(col as AnyColumn, `%${val}%`),
  notIlike: (col, [val]) => notIlike(col as AnyColumn, `%${val}%`),

  arrayContains: (col, values) => arrayContains(col, values),
  arrayContained: (col, values) => arrayContained(col, values),
  arrayOverlaps: (col, values) => arrayOverlaps(col, values),
};
