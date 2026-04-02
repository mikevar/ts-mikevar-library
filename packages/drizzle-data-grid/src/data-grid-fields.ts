import type {
  Field,
  Fields,
  FilterableFields,
  SearchableFields,
  SortableFields,
} from "./types.ts";

export class DataGridFields<TKey extends string> {
  private fields: Fields<TKey>;
  private sortableFields: SortableFields<TKey> | undefined;
  private searchableFields: SearchableFields<TKey> | undefined;
  private filterableFields: FilterableFields<TKey> | undefined;

  constructor({ fields }: { fields: Fields<TKey> }) {
    this.fields = fields;

    this.sortableFields = {} as SortableFields<TKey>;
    this.searchableFields = {} as SearchableFields<TKey>;
    this.filterableFields = {} as FilterableFields<TKey>;
  }

  private parseSortableFields() {
    if (this.sortableFields) {
      return;
    }

    this.sortableFields = {} as SortableFields<TKey>;

    for (const [key, field] of Object.entries(this.fields) as [TKey, Field][]) {
      if (field.sortable) {
        this.sortableFields[key] = field.column;
      }
    }
  }

  private parseSearchableFields() {
    if (this.searchableFields) {
      return;
    }

    this.searchableFields = {} as SearchableFields<TKey>;

    for (const [key, field] of Object.entries(this.fields) as [TKey, Field][]) {
      if (field.searchable) {
        this.searchableFields[key] = {
          column: field.column,
          type: field.type,
        };
      }
    }
  }

  private parseFilterableFields() {
    if (this.filterableFields) {
      return;
    }

    this.filterableFields = {} as FilterableFields<TKey>;

    for (const [key, field] of Object.entries(this.fields) as [TKey, Field][]) {
      if (field.filterable) {
        this.filterableFields[key] = {
          column: field.column,
          type: field.type,
        };
      }
    }
  }

  getFields(): Fields<TKey> {
    return this.fields;
  }

  getSortableFields(): SortableFields<TKey> {
    if (!this.sortableFields) {
      this.parseSortableFields();
    }

    return this.sortableFields!;
  }

  getSearchableFields(): SearchableFields<TKey> {
    if (!this.searchableFields) {
      this.parseSearchableFields();
    }

    return this.searchableFields!;
  }

  getFilterableFields(): FilterableFields<TKey> {
    if (!this.filterableFields) {
      this.parseFilterableFields();
    }

    return this.filterableFields!;
  }
}
