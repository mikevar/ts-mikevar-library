import type { AnyColumn, SQL, SQLWrapper } from "drizzle-orm";
import type { BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";
import { DataGridFields } from "./data-grid-fields.ts";
import { DataGridQuery } from "./data-grid-query.ts";

export type FieldColumn = AnyColumn | SQLWrapper | SQL<any> | SQL.Aliased<any>;
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
  | "isNull";

export interface DataGridQueryBuilderArgs<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
> {
  query: DataGridQuery<TRequestQuery, TOrderByKey>;
  fields: DataGridFields<TOrderByKey>;
  filters: SQL | undefined;
}

export type QueryResult<T> = Promise<T>;

export interface DataGridQueryBuilders<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
  TItem = any,
> {
  items:
    | unknown
    | ((
        args: DataGridQueryBuilderArgs<TRequestQuery, TOrderByKey>,
      ) => Promise<TItem[]>);

  total:
    | unknown
    | ((
        args: DataGridQueryBuilderArgs<TRequestQuery, TOrderByKey>,
      ) => Promise<{ count: number } | { count: number }[]>);
}
