import { useQueryState } from "nuqs";

interface DataGridStateOptions {
  queryKeys: {
    filterMode?: string;
    search?: string;
    paginationMode?: string;
    page?: string;
    limit?: string;
    cursor?: string;
    orders?: string;
  };
}

export function useDataGridState(options: DataGridStateOptions) {}
