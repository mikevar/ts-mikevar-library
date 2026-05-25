import type { QueryPlanObject } from "@mikevar/data-grid-contracts";

interface ExecuteQueryPlanParams {
  queryPlan: QueryPlanObject;
  queryBuilders: {
    items: any;
    count: any;
  };
}

export async function executeQueryPlan({
  queryPlan,
  queryBuilders,
}: ExecuteQueryPlanParams) {
  let itemsQuery = queryBuilders.items;
  let countQuery = queryBuilders.count;

  if (queryPlan.where) {
    itemsQuery = itemsQuery.where(queryPlan.where);
    countQuery = countQuery.where(queryPlan.where);
  }

  if (queryPlan.orderBy && queryPlan.orderBy.length > 0) {
    itemsQuery = itemsQuery.orderBy(...queryPlan.orderBy);
  }

  if (queryPlan.limit !== undefined) {
    itemsQuery = itemsQuery.limit(queryPlan.limit);
  }

  if (queryPlan.offset !== undefined) {
    itemsQuery = itemsQuery.offset(queryPlan.offset);
  }

  try {
    const [itemsResult, countResult] = await Promise.all([
      itemsQuery,
      countQuery,
    ]);

    const items = itemsResult;
    const count = Array.isArray(countResult)
      ? (countResult[0]?.count ?? 0)
      : countResult;

    return {
      items,
      count,
    };
  } catch (error) {
    throw error;
  }
}
