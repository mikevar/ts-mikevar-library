import { describe, it, expect } from "vitest";
import {
  parsePagination,
  parseOffsetPagination,
  parseCursorPagination,
} from "../pagination.ts";
import { type PaginationMode } from "../types.ts";

describe("parseOffsetPagination", () => {
  type OrderByKey = "id";
  type BaseQuery = {
    paginationMode: PaginationMode;
    page: number;
    limit: number;
    order: "asc" | "desc";
    orderBy: OrderByKey;
    filterMode: "search" | "filter";
  };
  const baseQuery: BaseQuery = {
    paginationMode: "offset",
    page: 1,
    limit: 10,
    order: "asc",
    orderBy: "id",
    filterMode: "search",
  };
  it("uses defaults when query is empty", () => {
    const result = parseOffsetPagination<BaseQuery, OrderByKey>({
      query: { ...baseQuery },
    });

    expect(result).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
    });
  });

  it("parses valid page and limit", () => {
    const result = parseOffsetPagination<BaseQuery, OrderByKey>({
      query: { ...baseQuery, page: 1, limit: 20 },
    });

    expect(result).toEqual({
      page: 2,
      limit: 20,
      offset: 20,
    });
  });

  it("handles numeric input directly", () => {
    const result = parseOffsetPagination<BaseQuery, OrderByKey>({
      query: { ...baseQuery, page: 3, limit: 5 },
    });

    expect(result).toEqual({
      page: 3,
      limit: 5,
      offset: 10,
    });
  });

  it("enforces minimum values", () => {
    const result = parseOffsetPagination<BaseQuery, OrderByKey>({
      query: { ...baseQuery, page: -5, limit: 0 },
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.offset).toBe(0);
  });

  it("caps limit at maxLimit", () => {
    const result = parseOffsetPagination<BaseQuery, OrderByKey>({
      query: { ...baseQuery, limit: 9999 },
      options: { maxLimit: 100 },
    });

    expect(result.limit).toBe(100);
  });

  it("respects custom defaults", () => {
    const result = parseOffsetPagination<BaseQuery, OrderByKey>({
      query: { ...baseQuery },
      options: { defaultPage: 2, defaultLimit: 25 },
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(25);
    expect(result.offset).toBe(25);
  });
});
