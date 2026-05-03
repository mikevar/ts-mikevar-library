import { FILTER_OPERATORS } from "./consts.ts";

export type ParsedQueryObject = {
  pagination: {
    mode?: string;
    page?: string;
    limit?: string;
    cursor?: string;
  };
  sorting: {
    orders?: string;
  };
  filtering: {
    mode?: string;
    search?: string;
    filters: Record<string, string>;
  };
};

export type PaginationMode = "offset" | "cursor";

export type OffsetPaginationObject = {
  mode: "offset";
  page: number;
  limit: number;
};

export type CursorPaginationObject = {
  mode: "cursor";
  cursor: string;
  limit: number;
};

export type OrderDirection = "asc" | "desc";

export type OrderObject = {
  column: string;
  direction: OrderDirection;
};

export type FilterMode = "search" | "filter";

export type FilterOperator = (typeof FILTER_OPERATORS)[number];

export type FilterObject = {
  column: string;
  operator: FilterOperator;
  value: string;
};

export type NormalizedQueryObject = {
  pagination: OffsetPaginationObject | CursorPaginationObject;
  sorting: {
    orders: OrderObject[];
  };
  filtering: {
    mode: FilterMode;
    search: string;
    filters: FilterObject[];
  };
};

export type FieldSchemaColumn = any | unknown;

export type FieldSchemaObjectType = "string" | "number" | "boolean" | "date";

export type FieldSchemaObject = {
  column: FieldSchemaColumn;
  type: FieldSchemaObjectType;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
};

export type FieldSchema = Record<string, FieldSchemaObject>;

export type QueryPlanObject = {
  where?: any;
  orderBy?: any;
  limit: number;
  offset?: number;
};
