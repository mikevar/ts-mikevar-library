import { describe, it, expect } from "vitest";
import { parseFiltering } from "../filtering.ts";

describe("parseFiltering", () => {
  it("uses defaults when query is empty", () => {
    const result = parseFiltering({ query: {} });

    expect(result).toEqual({ filterMode: undefined, filters: {} });
  });

  it("parses valid filter mode", () => {
    const result = parseFiltering({
      query: { filterMode: "search", search: "test" },
    });

    expect(result).toEqual({
      filterMode: "search",
      filters: { search: "test" },
    });
  });

  it("parses filter mode with other query params", () => {
    const result = parseFiltering({
      query: { filterMode: "filter", name: "test", age: "25" },
    });

    expect(result).toEqual({
      filterMode: "filter",
      filters: { name: "test", age: "25" },
    });
  });

  it("handles invalid filter mode", () => {
    const result = parseFiltering({
      query: { filterMode: "invalid", name: "test" },
    });

    expect(result).toEqual({
      filterMode: "invalid",
      filters: {},
    });
  });
});
