import {
  type Pagination,
  parsePagination,
  type Sorting,
  parseSorting,
  type Filtering,
  parseFiltering,
} from "@mikevar/parse-data-grid-query";

export function createDataGridQuery<TOrderColumnKey extends string>(options: {
  query: Record<string, string>;
  sortables: readonly TOrderColumnKey[];
  strict?: boolean;
}) {
  return new DataGridQuery(options);
}

export class DataGridQuery<TOrderColumnKey extends string> {
  private strict: boolean | undefined;

  private query: Record<string, string>;

  private pagination: Pagination | undefined;
  private sorting: Sorting<TOrderColumnKey>[] | undefined;
  private filtering: Filtering | undefined;

  constructor({
    query,
    sortables,
    strict = true,
  }: {
    query: Record<string, string>;
    sortables: readonly TOrderColumnKey[];
    strict?: boolean;
  }) {
    this.strict = strict;
    this.query = query;

    this.buildPagination();
    this.buildSorting({ allowed: sortables });
    this.buildFiltering();
  }

  private buildPagination(): void {
    this.pagination = parsePagination({
      query: this.query,
      options: {
        strict: this.strict!,
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
      },
    });
  }

  private buildFiltering(): void {
    this.filtering = parseFiltering({
      query: this.query,
      options: {
        strict: this.strict!,
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
