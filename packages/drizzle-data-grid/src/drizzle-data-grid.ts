import type {
  ParsedQueryObject,
  QueryKeysOptions,
  NormalizedQueryObject,
  DefaultQueryValuesOptions,
} from "@mikevar/data-grid";
import { parseAndNormalize } from "@mikevar/data-grid";
import type { FieldSchema, QueryPlanObject } from "./types.ts";
import { buildQueryPlan } from "./build-query-plan.ts";
import { executeQueryPlan } from "./execute-query-plan.ts";
import { formatResult } from "./format-result.ts";

interface DrizzleDataGridParams {
  query: Record<string, string>;
  queryKeys?: QueryKeysOptions;
  fieldsSchema: FieldSchema;
  queryBuilders: {
    items: any;
    count: any;
  };
  defaultQueryValues?: DefaultQueryValuesOptions;
}

export async function ddgRun(params: DrizzleDataGridParams) {
  const dataGrid = new DrizzleDataGrid(params);
  return await dataGrid.run();
}

export class DrizzleDataGrid {
  private query;
  private queryKeys;
  private fieldsSchema;
  private queryBuilders;
  private defaultQueryValues;

  // optional debug state
  public parsed?: ParsedQueryObject;
  public normalized?: NormalizedQueryObject;
  public plan?: QueryPlanObject;
  public result?: { items: any[]; count: number };

  constructor({
    query,
    queryKeys,
    fieldsSchema,
    queryBuilders,
    defaultQueryValues,
  }: DrizzleDataGridParams) {
    this.query = query;
    this.queryKeys = queryKeys;
    this.fieldsSchema = fieldsSchema;
    this.queryBuilders = queryBuilders;
    this.defaultQueryValues = defaultQueryValues;
  }

  async run() {
    const { parsed, normalized } = parseAndNormalize({
      query: this.query,
      queryKeys: this.queryKeys,
      defaultQueryValues: this.defaultQueryValues,
    });

    this.parsed = parsed;
    this.normalized = normalized;

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
