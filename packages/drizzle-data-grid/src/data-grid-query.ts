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
>(options: { query: TRequestQuery; sortables: readonly TOrderByKey[] }) {
  return new DataGridQuery(options);
}

export class DataGridQuery<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
> {
  private query: TRequestQuery;

  private pagination: Pagination | undefined;
  private sorting: Sorting<TOrderByKey> | undefined;
  private filtering: Filtering | undefined;

  constructor({
    query,
    sortables,
  }: {
    query: TRequestQuery;
    sortables: readonly TOrderByKey[];
  }) {
    this.query = query;

    this.pagination = this.parsePagination();
    this.sorting = this.parseSorting({ allowed: sortables });
    this.filtering = this.parseFiltering();
  }

  private parsePagination(): Pagination | undefined {
    return parsePagination<TRequestQuery, TOrderByKey>({ query: this.query });
  }

  private parseSorting({
    allowed,
  }: {
    allowed: readonly TOrderByKey[];
  }): Sorting<TOrderByKey> | undefined {
    return parseSorting<TRequestQuery, TOrderByKey>({
      query: this.query,
      allowed,
    });
  }

  private parseFiltering(): Filtering {
    return parseFiltering<TRequestQuery, TOrderByKey>({ query: this.query });
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
