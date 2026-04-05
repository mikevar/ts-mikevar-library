import type { BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";
import { createDataGridQuery } from "../data-grid-query.ts";
import { createDataGridFields } from "../data-grid-fields.ts";
import type { Fields, DataGridQueryBuilders } from "../types.ts";
import { OffsetDataGrid } from "./offset-data-grid.ts";
import { CursorDataGrid } from "./cursor-data-grid.ts";

export function createDataGrid<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
  TItem = any,
>({
  query,
  fields,
  queryBuilders,
}: {
  query: {
    query: TRequestQuery;
    allowed: readonly TOrderByKey[];
  };
  fields: Fields<TOrderByKey>;
  queryBuilders: DataGridQueryBuilders<TRequestQuery, TOrderByKey, TItem>;
}) {
  const dataGridQuery = createDataGridQuery<TRequestQuery, TOrderByKey>({
    query: query.query,
    sortables: query.allowed,
  });
  const dataGridFields = createDataGridFields<TOrderByKey>({ fields });

  if (dataGridQuery.getPagination().mode === "offset") {
    return new OffsetDataGrid({
      query: dataGridQuery,
      fields: dataGridFields,
      queryBuilders,
    });
  } else if (dataGridQuery.getPagination().mode === "cursor") {
    return new CursorDataGrid({
      query: dataGridQuery,
      fields: dataGridFields,
      queryBuilders,
    });
  }

  throw new Error("Invalid pagination mode");
}
