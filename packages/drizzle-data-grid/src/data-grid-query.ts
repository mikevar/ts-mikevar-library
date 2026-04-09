import {
  type Pagination,
  parsePagination,
  type Sorting,
  parseSorting,
  type Filtering,
  parseFiltering,
  type BaseRequestQueryObject,
} from "@mikevar/parse-data-grid-query";

export function createDataGridQuery<
  TRequestQuery extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
>(options: {
  query: TRequestQuery;
  sortables: readonly TOrderColumnKey[];
  strict?: boolean;
}) {
  return new DataGridQuery(options);
}

export class DataGridQuery<
  TRequestQuery extends BaseRequestQueryObject<TOrderColumnKey>,
  TOrderColumnKey extends string,
> {
  private strict: boolean | undefined;

  private query: TRequestQuery;

  private pagination: Pagination | undefined;
  private sorting: Sorting<TOrderColumnKey> | undefined;
  private filtering: Filtering | undefined;

  constructor({
    query,
    sortables,
    strict = true,
  }: {
    query: TRequestQuery;
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
    this.pagination = parsePagination<TRequestQuery, TOrderColumnKey>({
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
    this.sorting = parseSorting<TRequestQuery, TOrderColumnKey>({
      query: this.query,
      allowed,
      options: {
        strict: this.strict!,
      },
    });
  }

  private buildFiltering(): void {
    this.filtering = parseFiltering<TRequestQuery, TOrderColumnKey>({
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

  getSorting(): Sorting<TOrderColumnKey> {
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
