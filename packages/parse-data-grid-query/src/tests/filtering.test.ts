import { describe, it, expect } from "vitest";
import { parseFiltering } from "../filtering.ts";
import type { FilterMode } from "../types.ts";

describe("parseFiltering", () => {
  it("uses defaults when query is empty", () => {
    const result = parseFiltering({
      query: {
        page: 1,
        limit: 10,
        order: "asc",
        orderBy: "",
        filterMode: "search",
      },
    });

    expect(result).toEqual({
      filterMode: "search",
      filters: {},
      search: undefined,
    });
  });

  it("parses valid filter mode", () => {
    const result = parseFiltering({
      query: {
        page: 1,
        limit: 10,
        order: "asc",
        orderBy: "",
        filterMode: "search",
        search: "test",
      },
    });

    expect(result).toEqual({
      filterMode: "search",
      filters: {},
      search: "test",
    });
  });

  it("parses filter mode with other query params", () => {
    const result = parseFiltering({
      query: {
        page: 1,
        limit: 10,
        order: "asc",
        orderBy: "",
        filterMode: "filter",
        name: "test",
        age: "25",
      },
    });

    expect(result).toEqual({
      filterMode: "filter",
      filters: {
        name: ["test"],
        age: ["25"],
      },
    });
  });

  it("handles invalid filter mode", () => {
    const result = parseFiltering({
      query: {
        page: 1,
        limit: 10,
        order: "asc",
        orderBy: "",
        filterMode: "invalid" as FilterMode,
        name: "test",
      },
    });

    expect(result).toEqual({
      filterMode: "invalid",
      filters: {},
      search: undefined,
    });
  });

  it("handles multiple values for same filter key", () => {
    const result = parseFiltering({
      query: {
        page: 1,
        limit: 10,
        order: "asc",
        orderBy: "",
        filterMode: "filter",
        name: "test,meh",
        age: "25,30",
      },
    });

    expect(result).toEqual({
      filterMode: "filter",
      filters: {
        name: ["test", "meh"],
        age: ["25", "30"],
      },
    });
  });
});
