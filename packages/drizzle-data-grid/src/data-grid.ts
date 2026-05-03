import type {
  FieldSchema,
  ParsedQueryObject,
  NormalizedQueryObject,
  QueryPlanObject,
} from "./types.ts";
import { parseQueryObject } from "./parse-query-object.ts";
import { normalizeParsedQueryObject } from "./normalize-parsed-query-object.ts";
import { buildQueryPlan } from "./build-query-plan.ts";
import { executeQueryPlan } from "./execute-query-plan.ts";
import { formatResult } from "./format-result.ts";

interface DataGridParams {
  query: Record<string, string>;
  fieldsSchema: FieldSchema;
  queryBuilders: {
    items: any;
    count: any;
  };
}

export async function dgRun(params: DataGridParams) {
  const dataGrid = new DataGrid(params);
  return await dataGrid.run();
}

export class DataGrid {
  private query;
  private fieldsSchema;
  private queryBuilders;

  // optional debug state
  public parsed?: ParsedQueryObject;
  public normalized?: NormalizedQueryObject;
  public plan?: QueryPlanObject;
  public result?: { items: any[]; count: number };

  constructor({ query, fieldsSchema, queryBuilders }: DataGridParams) {
    this.query = query;
    this.fieldsSchema = fieldsSchema;
    this.queryBuilders = queryBuilders;
  }

  async run() {
    this.parsed = parseQueryObject({ query: this.query });

    this.normalized = normalizeParsedQueryObject({
      parsedQuery: this.parsed,
    });

    this.plan = buildQueryPlan({
      normalizedQuery: this.normalized,
      fieldsSchema: this.fieldsSchema,
    });

    this.result = await executeQueryPlan({
      queryPlan: this.plan,
      queryBuilders: this.queryBuilders,
    });

    return formatResult({
      items: this.result.items,
      count: this.result.count,
      pagination: this.normalized.pagination,
    });
  }
}
