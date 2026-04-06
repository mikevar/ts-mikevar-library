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
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
>(options: {
  query: TRequestQuery;
  sortables: readonly TOrderByKey[];
  strict?: boolean;
}) {
  return new DataGridQuery(options);
}

export class DataGridQuery<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
> {
  private strict: boolean | undefined;

  private query: TRequestQuery;

  private pagination: Pagination | undefined;
  private sorting: Sorting<TOrderByKey> | undefined;
  private filtering: Filtering | undefined;

  constructor({
    query,
    sortables,
    strict = true,
  }: {
    query: TRequestQuery;
    sortables: readonly TOrderByKey[];
    strict?: boolean;
  }) {
    this.strict = strict;
    this.query = query;

    this.buildPagination();
    this.buildSorting({ allowed: sortables });
    this.buildFiltering();
  }

  private buildPagination(): void {
    this.pagination = parsePagination<TRequestQuery, TOrderByKey>({
      query: this.query,
      options: {
        strict: this.strict!,
      },
    });
  }

  private buildSorting({ allowed }: { allowed: readonly TOrderByKey[] }): void {
    this.sorting = parseSorting<TRequestQuery, TOrderByKey>({
      query: this.query,
      allowed,
      options: {
        strict: this.strict!,
      },
    });
  }

  private buildFiltering(): void {
    this.filtering = parseFiltering<TRequestQuery, TOrderByKey>({
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

  getSorting(): Sorting<TOrderByKey> {
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
