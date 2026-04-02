import { describe, it, expect } from "vitest";
import { parsePagination } from "../pagination.ts";

describe("parsePagination", () => {
  it("uses defaults when query is empty", () => {
    const result = parsePagination({ query: {} });

    expect(result).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
    });
  });

  it("parses valid page and limit", () => {
    const result = parsePagination({
      query: { page: "2", limit: "20" },
    });

    expect(result).toEqual({
      page: 2,
      limit: 20,
      offset: 20,
    });
  });

  it("handles numeric input directly", () => {
    const result = parsePagination({
      query: { page: 3, limit: 5 },
    });

    expect(result).toEqual({
      page: 3,
      limit: 5,
      offset: 10,
    });
  });

  it("falls back to defaults on invalid values", () => {
    const result = parsePagination({
      query: { page: "abc", limit: "xyz" },
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
  });

  it("enforces minimum values", () => {
    const result = parsePagination({
      query: { page: "-5", limit: "0" },
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.offset).toBe(0);
  });

  it("caps limit at maxLimit", () => {
    const result = parsePagination({
      query: { limit: "9999" },
      options: { maxLimit: 100 },
    });

    expect(result.limit).toBe(100);
  });

  it("respects custom defaults", () => {
    const result = parsePagination({
      query: {},
      options: { defaultPage: 2, defaultLimit: 25 },
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(25);
    expect(result.offset).toBe(25);
  });

  it("handles non-object input gracefully", () => {
    const result = parsePagination({
      query: null,
    });

    expect(result).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
    });
  });
});
