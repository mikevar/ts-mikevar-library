import { and, or, type SQL, asc, desc } from "drizzle-orm";
import { DataGridQuery } from "../data-grid-query.ts";
import { DataGridFields } from "../data-grid-fields.ts";
import type {
  FieldColumn,
  SearchableField,
  DataGridQueryBuilders,
} from "../types.ts";
import { filterOperators } from "../filter-operators.ts";
import { parseValue, parseFieldKeyAndOperator } from "./functions.ts";

export abstract class DataGrid<TOrderColumnKey extends string, TItem = any> {
  protected query: DataGridQuery<TOrderColumnKey>;
  protected fields: DataGridFields<TOrderColumnKey>;
  protected queryBuilders: DataGridQueryBuilders<TOrderColumnKey, TItem>;

  protected orderByKey: string | undefined = undefined;
  protected orderByColumn: FieldColumn | undefined = undefined;
  protected orderBy: SQL | undefined = undefined;
  protected filters: SQL | undefined = undefined;

  protected items: TItem[] = [];
  protected total: number = 0;

  protected hasMore: boolean = false;
  protected nextCursor: any = undefined;

  constructor({
    query,
    fields,
    queryBuilders,
  }: {
    query: DataGridQuery<TOrderColumnKey>;
    fields: DataGridFields<TOrderColumnKey>;
    queryBuilders: DataGridQueryBuilders<TOrderColumnKey, TItem>;
  }) {
    this.query = query;
    this.fields = fields;
    this.queryBuilders = queryBuilders;

    this.buildOrderBy();
    this.buildFilters();
  }

  protected buildOrderBy() {
    const sorting = this.query.getSorting();
    let key = sorting.orderBy! as TOrderColumnKey;
    if (!key) {
      key = Object.keys(this.fields.getFields())[0]! as TOrderColumnKey;
    }

    this.orderByKey = key;
    const column = this.fields.getFields()[key].column;
    this.orderByColumn = column;
    if (sorting.order === "asc") {
      this.orderBy = asc(column);
    } else {
      this.orderBy = desc(column);
    }
  }

  protected buildFilters() {
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

  protected buildSearchModeFilters() {
    const filtering = { ...this.query.getFiltering() };
    if (!filtering) {
      throw new Error("Filters are required");
    }

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

      filters.push(filterOperators.iLike(field.column, [search]));
    }

    this.filters = filters.length ? or(...filters) : undefined;
  }

  protected buildFilterModeFilters() {
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
      const { fieldKey, operator } = parseFieldKeyAndOperator({ key });

      const field = filterableFields[fieldKey as keyof typeof filterableFields];
      if (!field) {
        continue;
      }
      const parsedValues = parseValue({
        type: field.type,
        values: filtering.filters[key as keyof typeof filtering.filters],
      });

      const condition = filterOperators[operator](field.column, parsedValues);

      if (condition) {
        filters.push(condition);
      }
    }

    this.filters = filters.length ? and(...filters) : undefined;
  }

  protected abstract constructWheres(): SQL | undefined;

  protected abstract constructQueryBuilderArguments(): any;

  protected abstract resolveDataGridQuery({
    wheres,
    args,
  }: {
    wheres: SQL | undefined;
    args: any;
  }): Promise<void>;

  async execute() {
    const wheres = this.constructWheres();
    const args = this.constructQueryBuilderArguments();
    await this.resolveDataGridQuery({ wheres, args });
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

  getData() {
    return {
      items: this.getItems(),
    };
  }

  abstract getMeta(): any;

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
