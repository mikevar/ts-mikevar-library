import type { NormalizedQueryObject } from "@mikevar/data-grid-contracts";

export function buildOffsetMeta({
  page,
  limit,
  count,
}: {
  page: number;
  limit: number;
  count: number;
}) {
  const totalPages = Math.ceil(count / limit);

  return {
    page,
    limit,
    total: count,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
}

interface FormatResultParams {
  items: any[];
  count: number;
  pagination: NormalizedQueryObject["pagination"];
}

export function formatResult({ items, count, pagination }: FormatResultParams) {
  if (pagination.mode === "offset") {
    return {
      data: items,
      meta: buildOffsetMeta({
        page: pagination.page,
        limit: pagination.limit,
        count,
      }),
    };
  }

  if (pagination.mode === "cursor") {
    return {
      data: items,
      meta: {
        limit: pagination.limit,
        hasNext: items.length === pagination.limit,
        nextCursor: items.at(-1)?.id ?? null,
      },
    };
  }

  return { data: items, meta: {} };
}
