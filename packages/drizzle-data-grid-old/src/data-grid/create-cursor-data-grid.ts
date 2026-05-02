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
  queryKey,
}: {
  query: {
    query: Record<string, string>;
    allowed: readonly TOrderColumnKey[];
  };
  fields: Fields<TOrderColumnKey>;
  queryBuilders: DataGridQueryBuilders<TOrderColumnKey, TItem>;
  queryKey?: {
    filterMode?: string;
    search?: string;
    paginationMode?: string;
    page?: string;
    limit?: string;
    cursor?: string;
    orders?: string;
  };
}) {
  const dataGridQuery = createDataGridQuery<TOrderColumnKey>({
    query: query.query,
    sortables: query.allowed,
    queryKey: queryKey ?? {},
  });
  const dataGridFields = createDataGridFields<TOrderColumnKey>({ fields });

  return new CursorDataGrid({
    query: dataGridQuery,
    fields: dataGridFields,
    queryBuilders,
  });
}
