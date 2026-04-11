import {
  type Pagination,
  parsePagination,
  type Sorting,
  parseSorting,
  type Filtering,
  parseFiltering,
} from "@mikevar/parse-data-grid-query";

export interface DataGridQueryConstructorArgs<TOrderColumnKey extends string> {
  query: Record<string, string>;
  sortables: readonly TOrderColumnKey[];
  strict?: boolean;
  queryKey?: {
    filterMode?: string;
    search?: string;
    paginationMode?: string;
    page?: string;
    limit?: string;
    cursor?: string;
    orders?: string;
  };
}

export function createDataGridQuery<TOrderColumnKey extends string>(
  options: DataGridQueryConstructorArgs<TOrderColumnKey>,
) {
  return new DataGridQuery(options);
}

export class DataGridQuery<TOrderColumnKey extends string> {
  private strict: boolean | undefined;

  private query: Record<string, string>;

  private pagination: Pagination | undefined;
  private sorting: Sorting<TOrderColumnKey>[] | undefined;
  private filtering: Filtering | undefined;

  private queryKey: DataGridQueryConstructorArgs<TOrderColumnKey>["queryKey"];

  constructor({
    query,
    sortables,
    strict = true,
    queryKey,
  }: DataGridQueryConstructorArgs<TOrderColumnKey>) {
    this.strict = strict;
    this.query = query;
    this.queryKey = queryKey;

    this.buildPagination();
    this.buildSorting({ allowed: sortables });
    this.buildFiltering();
  }

  private buildPagination(): void {
    this.pagination = parsePagination({
      query: this.query,
      options: {
        strict: this.strict!,
        queryKey: {
          paginationMode: this.queryKey?.paginationMode,
          page: this.queryKey?.page,
          limit: this.queryKey?.limit,
          cursor: this.queryKey?.cursor,
        },
      },
    });
  }

  private buildSorting({
    allowed,
  }: {
    allowed: readonly TOrderColumnKey[];
  }): void {
    this.sorting = parseSorting<TOrderColumnKey>({
      query: this.query,
      allowed,
      options: {
        strict: this.strict!,
        queryKey: {
          orders: this.queryKey?.orders,
        },
      },
    });
  }

  private buildFiltering(): void {
    this.filtering = parseFiltering({
      query: this.query,
      options: {
        strict: this.strict!,
        queryKey: this.queryKey ?? {},
      },
    });
  }

  getPagination(): Pagination {
    if (!this.pagination) {
      throw new Error("Pagination not parsed");
    }
    return this.pagination;
  }

  getSorting(): Sorting<TOrderColumnKey>[] {
    if (!this.sorting) {
      throw new Error("Sorting not parsed");
    }
    return this.sorting;
  }

  getFiltering(): Filtering {
    if (!this.filtering) {
      throw new Error("Filtering not parsed");
    }
    return this.filtering;
  }
}
