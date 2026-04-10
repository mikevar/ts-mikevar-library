import { count, type SQL } from "drizzle-orm";
import type { OffsetPagination } from "@mikevar/parse-data-grid-query";
import { DataGrid } from "./data-grid.ts";

export class OffsetDataGrid<
  TOrderColumnKey extends string,
  TItem = any,
> extends DataGrid<TOrderColumnKey, TItem> {
  protected constructWheres() {
    return this.filters;
  }

  protected constructQueryBuilderArguments() {
    const pagination = this.query.getPagination() as OffsetPagination;

    return {
      query: this.query,
      fields: this.fields,
      filters: this.filters,
      wheres: this.filters,
      orderBy: this.orderBy,
      pagination: {
        mode: "offset",
        limit: pagination.limit,
        queryLimit: pagination.limit,
        offset: pagination.offset,
      },
      count,
    };
  }

  protected async resolveDataGridQuery({
    wheres,
    args,
  }: {
    wheres: SQL | undefined;
    args: any;
  }) {
    const itemsQB = this.queryBuilders.items as any;
    const totalQB = this.queryBuilders.total as any;

    const itemsQBIsFn = typeof itemsQB === "function";
    const totalQBIsFn = typeof totalQB === "function";

    const itemsFn = itemsQBIsFn
      ? (itemsQB as any)
      : async (args: {
          wheres: any;
          orderBy: any;
          pagination: {
            limit: number;
            offset: number;
          };
        }) => {
          return itemsQB
            .where(args.wheres)
            .orderBy(args.orderBy)
            .limit(args.pagination.limit)
            .offset(args.pagination.offset);
        };
    const totalFn = totalQBIsFn
      ? (totalQB as any)
      : async (args: { filters: any }) => {
          return totalQB.where(args.filters);
        };

    const [items, totalResult] = await Promise.all([
      itemsFn(args),
      totalFn(args),
    ]);

    const total = Array.isArray(totalResult)
      ? (totalResult[0]?.count ?? 0)
      : typeof totalResult === "number"
        ? totalResult
        : (totalResult?.count ?? 0);

    this.items = items;
    this.total = total;
  }

  getTotalPages() {
    const total = this.total;
    const pagination = this.query.getPagination();

    return Math.ceil(total / pagination.limit);
  }

  getHasNextPage() {
    const pagination = this.query.getPagination() as OffsetPagination;
    return this.getTotalPages() > pagination.page;
  }

  getHasPreviousPage() {
    const pagination = this.query.getPagination() as OffsetPagination;
    return pagination.page > 1;
  }

  getNextPage() {
    const pagination = this.query.getPagination() as OffsetPagination;
    return pagination.page + 1;
  }

  getPreviousPage() {
    const pagination = this.query.getPagination() as OffsetPagination;
    return pagination.page - 1;
  }

  getPageOutOfBounds() {
    const pagination = this.query.getPagination() as OffsetPagination;
    return pagination.page > this.getTotalPages();
  }

  getMeta() {
    return {
      total: this.getTotal(),
      pagination: this.query.getPagination() as OffsetPagination,
      totalPages: this.getTotalPages(),
      hasNextPage: this.getHasNextPage(),
      hasPreviousPage: this.getHasPreviousPage(),
      nextPage: this.getNextPage(),
      previousPage: this.getPreviousPage(),
      pageOutOfBounds: this.getPageOutOfBounds(),
    };
  }
}
