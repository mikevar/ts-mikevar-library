import { gt, lt, and, count, type SQL } from "drizzle-orm";
import type {
  BaseRequestQueryObject,
  CursorPagination,
} from "@mikevar/parse-data-grid-query";
import { DataGrid } from "./data-grid.ts";

export class CursorDataGrid<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
  TItem = any,
> extends DataGrid<TRequestQuery, TOrderByKey, TItem> {
  protected constructWheres() {
    const pagination = this.query.getPagination() as CursorPagination;
    const sorting = this.query.getSorting();
    const cursorFilter = sorting.order === "asc" ? gt : lt;
    const wheres = this.filters
      ? and(this.filters, cursorFilter(this.orderByColumn, pagination.cursor))
      : cursorFilter(this.orderByColumn, pagination.cursor);
    return wheres;
  }

  protected constructQueryBuilderArguments() {
    const pagination = this.query.getPagination() as CursorPagination;

    return {
      query: this.query,
      fields: this.fields,
      filters: this.filters,
      wheres: this.constructWheres(),
      orderBy: this.orderBy,
      pagination: {
        mode: "cursor",
        limit: pagination.limit,
        queryLimit: pagination.limit + 1,
        cursor: pagination.cursor,
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
          filters: any;
          orderBy: any;
          pagination: {
            limit: number;
            queryLimit: number;
          };
        }) => {
          return itemsQB
            .where(args.filters)
            .orderBy(args.orderBy)
            .limit(args.pagination.queryLimit);
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

    if (items.length > args.pagination.limit) {
      items.pop();
      this.hasMore = true;
    }

    if (this.hasMore && this.orderByKey) {
      const lastItem = items[items.length - 1];
      this.nextCursor = lastItem?.[this.orderByKey];
    }

    const total = Array.isArray(totalResult)
      ? (totalResult[0]?.count ?? 0)
      : typeof totalResult === "number"
        ? totalResult
        : (totalResult?.count ?? 0);

    this.items = items;
    this.total = total;
  }

  getHasMore() {
    return this.hasMore;
  }

  getNextCursor() {
    return this.nextCursor;
  }

  getMeta() {
    return {
      total: this.getTotal(),
      pagination: this.query.getPagination() as CursorPagination,
      hasMore: this.getHasMore(),
      nextCursor: this.getNextCursor(),
    };
  }
}
