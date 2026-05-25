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

export function useDataGridState(options: DataGridStateOptions) {
  const [filterMode, setFilterMode] = useQueryState(
    options.queryKeys.filterMode,
    { defaultValue: "dynamic" },
  );
  const [search, setSearch] = useQueryState(options.queryKeys.search, {
    defaultValue: "",
  });
  const [paginationMode, setPaginationMode] = useQueryState(
    options.queryKeys.paginationMode,
    { defaultValue: "page" },
  );
  const [page, setPage] = useQueryState(options.queryKeys.page, {
    defaultValue: 1,
  });
  const [limit, setLimit] = useQueryState(options.queryKeys.limit, {
    defaultValue: 10,
  });
  const [cursor, setCursor] = useQueryState(options.queryKeys.cursor, {
    defaultValue: "",
  });
  const [orders, setOrders] = useQueryState(options.queryKeys.orders, {
    defaultValue: "",
  });
}
