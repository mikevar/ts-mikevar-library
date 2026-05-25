import type { NormalizedQueryObject } from "@mikevar/data-grid";
import type {
  FieldSchema,
  FieldSchemaObject,
  FieldSchemaObjectType,
  QueryPlanObject,
} from "./types.ts";
import { or, and, gt, lt, asc, desc } from "drizzle-orm";
import { filterOperators } from "./filter-operators.ts";

function buildFieldMaps(fieldsSchema: FieldSchema) {
  const sortable: Record<string, FieldSchemaObject> = {};
  const searchable: Record<string, FieldSchemaObject> = {};
  const filterable: Record<string, FieldSchemaObject> = {};

  for (const [key, field] of Object.entries(fieldsSchema)) {
    if (field.sortable) sortable[key] = field;
    if (field.searchable) searchable[key] = field;
    if (field.filterable) filterable[key] = field;
  }

  return { sortable, searchable, filterable };
}

export function parseValue({
  type,
  values,
}: {
  type: FieldSchemaObjectType;
  values: string[];
}): unknown[] {
  if (!values) {
    return [];
  }

  switch (type) {
    case "number": {
      return values
        ?.map((value) => {
          const num = Number(value);
          if (isNaN(num)) return null;
          return num;
        })
        ?.filter((value) => value !== null);
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

interface BuildQueryPlanParams {
  normalizedQuery: NormalizedQueryObject;
  fieldsSchema: FieldSchema;
}

export function buildQueryPlan({
  normalizedQuery,
  fieldsSchema,
}: BuildQueryPlanParams): QueryPlanObject {
  const { sorting, filtering, pagination } = normalizedQuery;

  const { sortable, searchable, filterable } = buildFieldMaps(fieldsSchema);

  const orders = [];
  let orderByClause: any = null;
  for (const { column, direction } of sorting.orders) {
    const field = sortable[column];
    if (!field) continue;

    if (direction === "asc") {
      orders.push(asc(field.column));
    } else {
      orders.push(desc(field.column));
    }
  }
  orderByClause = orders.length > 0 ? orders : undefined;

  const wheres = [];
  let whereClause: any = null;
  if (filtering.mode === "search") {
    for (const column of Object.keys(searchable)) {
      const field = searchable[column];
      if (!field) continue;
      if (field.type !== "string") continue;

      wheres.push(filterOperators.iLike(field.column, [filtering.search]));
    }
    whereClause =
      wheres.length === 0
        ? undefined
        : wheres.length === 1
          ? wheres[0]
          : or(...wheres);
  } else if (filtering.mode === "filter") {
    for (const filter of filtering.filters) {
      const field = filterable[filter.column];
      if (!field) continue;

      const parsedValues = parseValue({
        type: field.type,
        values: (filter.value as string).split(","),
      });

      wheres.push(
        filterOperators[filter.operator](field.column, parsedValues as any),
      );
    }
    whereClause =
      wheres.length === 0
        ? undefined
        : wheres.length === 1
          ? wheres[0]
          : and(...wheres);
  }

  const limit: number = pagination.limit;
  if (pagination.mode === "offset") {
    const offset = (pagination.page - 1) * limit;

    return {
      where: whereClause,
      orderBy: orderByClause,
      limit,
      offset,
    };
  } else if (pagination.mode === "cursor") {
    const cursorOrder = sorting.orders[0];

    if (!cursorOrder) {
      throw new Error("Cursor pagination requires at least one order");
    }

    const cursorColumn = fieldsSchema[cursorOrder.column]!.column;
    const cursorType = fieldsSchema[cursorOrder.column]!.type;
    const cursorValue = parseValue({
      type: cursorType,
      values: [pagination.cursor],
    })[0];
    const cursorFilterDirection = cursorOrder.direction;
    let additionalWhereClause: any = null;
    if (cursorFilterDirection === "asc") {
      additionalWhereClause = gt(cursorColumn, cursorValue);
    } else {
      additionalWhereClause = lt(cursorColumn, cursorValue);
    }

    whereClause = whereClause
      ? and(whereClause, additionalWhereClause)
      : additionalWhereClause;

    return {
      where: whereClause,
      orderBy: orderByClause,
      limit,
    };
  }

  throw new Error("Invalid pagination mode");
}
