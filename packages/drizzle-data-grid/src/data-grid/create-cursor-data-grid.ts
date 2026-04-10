import { createDataGridQuery } from "../data-grid-query.ts";
import { createDataGridFields } from "../data-grid-fields.ts";
import type { Fields, DataGridQueryBuilders } from "../types.ts";
import { CursorDataGrid } from "./cursor-data-grid.ts";

export function createCursorDataGrid<
  TOrderColumnKey extends string,
  TItem = any,
>({
  query,
  fields,
  queryBuilders,
}: {
  query: {
    query: Record<string, string>;
    allowed: readonly TOrderColumnKey[];
  };
  fields: Fields<TOrderColumnKey>;
  queryBuilders: DataGridQueryBuilders<TOrderColumnKey, TItem>;
}) {
  const dataGridQuery = createDataGridQuery<TOrderColumnKey>({
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
