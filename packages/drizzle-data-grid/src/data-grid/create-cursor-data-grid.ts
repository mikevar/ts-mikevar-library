import type { BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";
import { createDataGridQuery } from "../data-grid-query.ts";
import { createDataGridFields } from "../data-grid-fields.ts";
import type { Fields, DataGridQueryBuilders } from "../types.ts";
import { CursorDataGrid } from "./cursor-data-grid.ts";

export function createCursorDataGrid<
  TRequestQuery extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
  TItem = any,
>({
  query,
  fields,
  queryBuilders,
}: {
  query: {
    query: TRequestQuery;
    allowed: readonly TOrderColumnKey[];
  };
  fields: Fields<TOrderColumnKey>;
  queryBuilders: DataGridQueryBuilders<TRequestQuery, TOrderColumnKey, TItem>;
}) {
  const dataGridQuery = createDataGridQuery<TRequestQuery, TOrderColumnKey>({
    query: query.query,
    sortables: query.allowed,
  });
  const dataGridFields = createDataGridFields<TOrderColumnKey>({ fields });

  return new CursorDataGrid({
    query: dataGridQuery,
    fields: dataGridFields,
    queryBuilders,
  });
}
