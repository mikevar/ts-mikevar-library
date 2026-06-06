import { createFileRoute } from "@tanstack/react-router";
import type { FilterMode, PaginationMode } from "@mikevar/data-grid";

type SearchFilter = {
  filterMode: "search";
  search: string;
};
type FilterFilter<T = Record<string, string>> = {
  filterMode: "filter";
  filters: T;
};
type FilterQuery<TFilters = Record<string, string>> =
  | SearchFilter
  | FilterFilter<TFilters>;

type OffsetPagination = {
  paginationMode: "offset";
  page: number;
  limit: number;
};
type CursorPagination = {
  paginationMode: "cursor";
  cursor: string;
  limit: number;
};
type PaginationQuery = OffsetPagination | CursorPagination;

type SortingQuery = {
  orders: string;
};

type DataGridBaseQuery<TFilters = Record<string, string>> =
  FilterQuery<TFilters> & PaginationQuery & SortingQuery;

type TableSearch = DataGridBaseQuery<{
  "name:ilike": string;
  "age:gte": string;
  "isActive:eq": string;
  "createdAt:gte": string;
}>;

export const Route = createFileRoute("/table")({
  validateSearch: (search: Record<string, string>): TableSearch => {
    return {
      filterMode: search["filterMode"] as FilterMode,
      search: search["search"] ?? "",
      paginationMode: search["paginationMode"] as PaginationMode,
      page: parseInt(search["page"] ?? "1"),
      limit: parseInt(search["limit"] ?? "10"),
      cursor: search["cursor"] ?? "",
      orders: search["orders"] ?? "",
      filters: {
        "name:ilike": search["name:ilike"] ?? "",
        "age:gte": search["age:gte"] ?? "",
        "isActive:eq": search["isActive:eq"] ?? "",
        "createdAt:gte": search["createdAt:gte"] ?? "",
      },
    };
  },
  component: TablePage,
});

function TablePage() {
  return (
    <div className="p-4 mb-20">
      <h2>Table</h2>
    </div>
  );
}
