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
