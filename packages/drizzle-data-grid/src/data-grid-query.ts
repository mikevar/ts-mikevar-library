import {
  type Pagination,
  parsePagination,
  type Sorting,
  parseSorting,
  type Filtering,
  parseFiltering,
} from "@mikevar/parse-data-grid-query";

export function createDataGridQuery<TOrderByKey extends string>(options: {
  query: unknown;
  allowed: readonly TOrderByKey[];
}) {
  return new DataGridQuery(options);
}

export class DataGridQuery<TOrderByKey extends string> {
  private query: unknown;

  private pagination: Pagination | undefined;
  private sorting: Sorting<TOrderByKey> | undefined;
  private filtering: Filtering | undefined;

  constructor({
    query,
    allowed,
  }: {
    query: unknown;
    allowed: readonly TOrderByKey[];
  }) {
    this.query = query;

    this.pagination = this.parsePagination();
    this.sorting = this.parseSorting({ allowed });
    this.filtering = this.parseFiltering();
  }

  private parsePagination(): Pagination | undefined {
    return parsePagination({ query: this.query });
  }

  private parseSorting({
    allowed,
  }: {
    allowed: readonly TOrderByKey[];
  }): Sorting<TOrderByKey> | undefined {
    return parseSorting({ query: this.query, allowed });
  }

  private parseFiltering(): Filtering {
    return parseFiltering({ query: this.query });
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
