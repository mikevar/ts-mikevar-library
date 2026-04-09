import type { AnyColumn, SQL, SQLWrapper } from "drizzle-orm";
import type { BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";
import { DataGridFields } from "./data-grid-fields.ts";
import { DataGridQuery } from "./data-grid-query.ts";

export type FieldColumn = any | unknown;
export type FilterType = "string" | "number" | "boolean" | "date";

export type Field = {
  column: FieldColumn;
  type: FilterType;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
};
export type Fields<TKey extends string> = Record<TKey, Field>;

export type SortableField = FieldColumn;
export type SortableFields<TKey extends string> = Record<TKey, SortableField>;

export type SearchableField = {
  column: FieldColumn;
  type: FilterType;
};
export type SearchableFields<TKey extends string> = Record<
  TKey,
  SearchableField
>;

export type FilterableField = {
  column: FieldColumn;
  type: FilterType;
};
export type FilterableFields<TKey extends string> = Record<
  TKey,
  FilterableField
>;

export type FilterValueType = string | number | boolean | Date | undefined;
export type FilterOperator =
  | "eq"
  | "iLike"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "isNull"
  | "inArray";

export interface DataGridQueryBuilderArgs<
  TRequestQuery extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
> {
  query: DataGridQuery<TRequestQuery, TOrderColumnKey>;
  fields: DataGridFields<TOrderColumnKey>;
  filters: SQL | undefined;
}

export type QueryResult<T> = Promise<T>;

export interface DataGridQueryBuilders<
  TRequestQuery extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
  TItem = any,
> {
  items:
    | unknown
    | ((
        args: DataGridQueryBuilderArgs<TRequestQuery, TOrderColumnKey>,
      ) => Promise<TItem[]>);

  total:
    | unknown
    | ((
        args: DataGridQueryBuilderArgs<TRequestQuery, TOrderColumnKey>,
      ) => Promise<{ count: number } | { count: number }[]>);
}
