import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "./constants";

export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}

export interface ParsePaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

function toNumber(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(n) ? n : null;
}

export function calculateOffset({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): number {
  return (page - 1) * limit;
}

export function parsePagination({
  query,
  options = {},
}: {
  query: unknown;
  options?: ParsePaginationOptions;
}): Pagination {
  const defaultPage = options.defaultPage ?? DEFAULT_PAGE;
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;

  if (typeof query !== "object" || query === null) {
    const page = defaultPage;
    const limit = defaultLimit;

    return {
      page,
      limit,
      offset: calculateOffset({ page, limit }),
    };
  }

  const q = query as Record<string, unknown>;

  const rawPage = toNumber(q.page);
  const rawLimit = toNumber(q.limit);

  const page = Math.max(rawPage ?? defaultPage, 1);
  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);

  const offset = calculateOffset({ page, limit });

  return { page, limit, offset };
}
