import type {
  FilterValue,
  BaseRequestQueryObject,
} from "@mikevar/parse-data-grid-query";
import { createDataGridQuery, DataGridQuery } from "./data-grid-query.ts";
import { createDataGridFields, DataGridFields } from "./data-grid-fields.ts";
import type {
  FieldColumn,
  Fields,
  FilterOperator,
  FilterValueType,
  FilterableField,
  SearchableField,
  DataGridQueryBuilders,
} from "./types.ts";
import {
  and,
  or,
  eq,
  ilike,
  gt,
  gte,
  lt,
  lte,
  isNull,
  isNotNull,
  inArray,
  type SQL,
  type AnyColumn,
  between,
  asc,
  desc,
  count,
} from "drizzle-orm";

export function createDataGrid<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
  TItem = any,
>({
  query,
  fields,
  queryBuilders,
}: {
  query: {
    query: TRequestQuery;
    allowed: readonly TOrderByKey[];
  };
  fields: Fields<TOrderByKey>;
  queryBuilders: DataGridQueryBuilders<TRequestQuery, TOrderByKey, TItem>;
}) {
  const dataGridQuery = createDataGridQuery<TRequestQuery, TOrderByKey>({
    query: query.query,
    sortables: query.allowed,
  });
  const dataGridFields = createDataGridFields<TOrderByKey>({ fields });
  return new DataGrid({
    query: dataGridQuery,
    fields: dataGridFields,
    queryBuilders,
  });
}

export class DataGrid<
  TRequestQuery extends BaseRequestQueryObject<TOrderByKey>,
  TOrderByKey extends string,
  TItem = any,
> {
  private readonly filterOperators: Record<
    FilterOperator,
    (col: FieldColumn, values: FilterValueType[]) => SQL
  > = {
    eq: (col, [val]) => eq(col, val),

    iLike: (col, [val]) => ilike(col as AnyColumn, `%${val}%`),

    gt: (col, [val]) => gt(col, val),
    gte: (col, [val]) => gte(col, val),
    lt: (col, [val]) => lt(col, val),
    lte: (col, [val]) => lte(col, val),

    between: (col, [val1, val2]) =>
      between(col, val1 as string, val2 as string),

    isNull: (col, [val]) => (val === true ? isNull(col) : isNotNull(col)),

    inArray: (col, values) => inArray(col, values),
  };

  private query: DataGridQuery<TRequestQuery, TOrderByKey>;
  private fields: DataGridFields<TOrderByKey>;
  private queryBuilders: DataGridQueryBuilders<
    TRequestQuery,
    TOrderByKey,
    TItem
  >;

  private orderBy: SQL | undefined = undefined;
  private filters: SQL | undefined = undefined;

  private items: TItem[] = [];
  private total: number = 0;

  constructor({
    query,
    fields,
    queryBuilders,
  }: {
    query: DataGridQuery<TRequestQuery, TOrderByKey>;
    fields: DataGridFields<TOrderByKey>;
    queryBuilders: DataGridQueryBuilders<TRequestQuery, TOrderByKey, TItem>;
  }) {
    this.query = query;
    this.fields = fields;
    this.queryBuilders = queryBuilders;

    this.buildOrderBy();
    this.buildFilters();
  }

  private buildOrderBy() {
    const sorting = this.query.getSorting();
    let key = sorting.orderBy! as TOrderByKey;
    if (!key) {
      key = Object.keys(this.fields.getFields())[0]! as TOrderByKey;
    }
    console.log(key);

    const column = this.fields.getFields()[key].column;
    if (sorting.order === "asc") {
      this.orderBy = asc(column);
    } else {
      this.orderBy = desc(column);
    }
  }

  private parseValue({
    type,
    values,
  }: {
    type: FilterValueType;
    values: FilterValue;
  }): FilterValueType[] {
    if (!values) {
      return [];
    }

    switch (type) {
      case "number": {
        return values?.map((value) => {
          const num = Number(value);
          if (isNaN(num)) return undefined;
          return num;
        });
      }
      case "boolean":
        return values?.map((value) => value === "true");
      case "date": {
        return values?.map((value) => new Date(value));
      }
      case "string":
      default:
        return values;
    }
  }

  private parseFieldKeyAndOperator({ key }: { key: string }) {
    const [fieldKey, operatorRaw] = key.split("__");
    const operator = (operatorRaw ?? "eq") as FilterOperator;

    return { fieldKey, operator };
  }

  private buildFilters() {
    const filtering = { ...this.query.getFiltering() };
    if (!filtering) {
      throw new Error("Filtering is required");
    }

    if (filtering.filterMode === "search") {
      this.buildSearchModeFilters();
    } else if (filtering.filterMode === "filter") {
      this.buildFilterModeFilters();
    } else {
      // ADD CHECK IF STRICT
      this.buildSearchModeFilters();
    }
  }

  private buildSearchModeFilters() {
    const filtering = { ...this.query.getFiltering() };
    if (!filtering) {
      throw new Error("Filters are required");
    }
    // if (!filtering.search) {
    //   throw new Error("Search is required");
    // }

    const search: string = filtering.search ?? "";
    const searchableFields = this.fields.getSearchableFields();

    const filters: SQL[] = [];

    for (const [key, field] of Object.entries(searchableFields) as [
      string,
      SearchableField,
    ][]) {
      if (field.type !== "string") {
        continue;
      }

      filters.push(this.filterOperators.iLike(field.column, [search]));
    }

    this.filters = filters.length ? or(...filters) : undefined;
  }

  private buildFilterModeFilters() {
    const filtering = { ...this.query.getFiltering() };
    if (!filtering) {
      throw new Error("Filters are required");
    }
    if (!filtering.filters) {
      throw new Error("Filters are required");
    }

    const filters: SQL[] = [];
    const filterableFields = this.fields.getFilterableFields();

    for (const key of Object.keys(filtering.filters)) {
      const { fieldKey, operator } = this.parseFieldKeyAndOperator({ key });

      const field = filterableFields[fieldKey as keyof typeof filterableFields];
      if (!field) {
        continue;
      }
      const parsedValues = this.parseValue({
        type: field.type,
        values: filtering.filters[key as keyof typeof filtering.filters],
      });

      const condition = this.filterOperators[operator](
        field.column,
        parsedValues,
      );

      if (condition) {
        filters.push(condition);
      }
    }

    this.filters = filters.length ? and(...filters) : undefined;
  }

  private constructQueryBuilderArguments() {
    return {
      query: this.query,
      fields: this.fields,
      filters: this.filters,
      orderBy: this.orderBy,
      pagination: {
        limit: this.query.getPagination()?.limit,
        offset: this.query.getPagination()?.offset,
      },
      count,
    };
  }

  private async resolveDataGridQuery() {
    const args = this.constructQueryBuilderArguments();

    const itemsIsFn = typeof this.queryBuilders.items === "function";
    const totalIsFn = typeof this.queryBuilders.total === "function";

    const itemsBase = itemsIsFn
      ? await (this.queryBuilders.items as any)(args)
      : this.queryBuilders.items;

    const totalBase = totalIsFn
      ? await (this.queryBuilders.total as any)(args)
      : this.queryBuilders.total;

    const itemsQuery = itemsIsFn
      ? itemsBase
      : itemsBase
          .where(this.filters)
          .orderBy(this.orderBy)
          .limit(this.query.getPagination()?.limit)
          .offset(this.query.getPagination()?.offset);

    const totalQuery = totalIsFn ? totalBase : totalBase.where(this.filters);

    const [items, totalResult] = await Promise.all([itemsQuery, totalQuery]);

    const total = Array.isArray(totalResult)
      ? (totalResult[0]?.count ?? 0)
      : typeof totalResult === "number"
        ? totalResult
        : (totalResult?.count ?? 0);

    this.items = items;
    this.total = total;
  }

  async execute() {
    await this.resolveDataGridQuery();
    return this.getResolvedDataGridQuery();
  }

  getQuery() {
    return this.query;
  }

  getOrderBy() {
    return this.orderBy;
  }

  getFilters() {
    return this.filters;
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.total;
  }

  getTotalPages() {
    const total = this.total;
    const pagination = this.query.getPagination();

    return Math.ceil(total / pagination.limit);
  }

  getHasNextPage() {
    return this.getTotalPages() > this.query.getPagination().page;
  }

  getHasPreviousPage() {
    return this.query.getPagination().page > 1;
  }

  getNextPage() {
    return this.query.getPagination().page + 1;
  }

  getPreviousPage() {
    return this.query.getPagination().page - 1;
  }

  getPageOutOfBounds() {
    return this.query.getPagination().page > this.getTotalPages();
  }

  getData() {
    return {
      items: this.getItems(),
    };
  }

  getMeta() {
    return {
      total: this.getTotal(),
      pagination: this.query.getPagination(),
      totalPages: this.getTotalPages(),
      hasNextPage: this.getHasNextPage(),
      hasPreviousPage: this.getHasPreviousPage(),
      nextPage: this.getNextPage(),
      previousPage: this.getPreviousPage(),
      pageOutOfBounds: this.getPageOutOfBounds(),
    };
  }

  getResolvedDataGridQuery() {
    return {
      data: this.getData(),
      meta: this.getMeta(),
    };
  }

  toJSON() {
    return this.getResolvedDataGridQuery();
  }
}
