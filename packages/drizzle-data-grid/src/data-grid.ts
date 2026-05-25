import type {
  FieldSchema,
  ParsedQueryObject,
  NormalizedQueryObject,
  QueryPlanObject,
  QueryKeysOptions,
  DefaultQueryValuesOptions,
} from "@mikevar/data-grid-contracts";
import { parseQueryObject } from "./parse-query-object.ts";
import { normalizeParsedQueryObject } from "./normalize-parsed-query-object.ts";
import { buildQueryPlan } from "./build-query-plan.ts";
import { executeQueryPlan } from "./execute-query-plan.ts";
import { formatResult } from "./format-result.ts";

interface DataGridParams {
  query: Record<string, string>;
  queryKeys?: QueryKeysOptions;
  fieldsSchema: FieldSchema;
  queryBuilders: {
    items: any;
    count: any;
  };
  defaultQueryValues?: DefaultQueryValuesOptions;
}

export async function dgRun(params: DataGridParams) {
  const dataGrid = new DataGrid(params);
  return await dataGrid.run();
}

export class DataGrid {
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
  }: DataGridParams) {
    this.query = query;
    this.queryKeys = queryKeys;
    this.fieldsSchema = fieldsSchema;
    this.queryBuilders = queryBuilders;
    this.defaultQueryValues = defaultQueryValues;
  }

  async run() {
    this.parsed = parseQueryObject({
      query: this.query,
      queryKeys: this.queryKeys,
    });

    this.normalized = normalizeParsedQueryObject({
      parsedQuery: this.parsed,
      defaultQueryValues: this.defaultQueryValues,
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
