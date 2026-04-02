import { describe, it, expect } from "vitest";
import { parseFiltering } from "../filtering";

describe("parseFiltering", () => {
  it("uses defaults when query is empty", () => {
    const result = parseFiltering({ query: {} });

    expect(result).toEqual({ search: undefined });
  });

  it("parses valid filter mode", () => {
    const result = parseFiltering({
      query: { filterMode: "search", search: "test" },
    });

    expect(result).toEqual({ search: "test" });
  });

  it("parses filter mode with other query params", () => {
    const result = parseFiltering({
      query: { filterMode: "filter", name: "test", age: "25" },
    });

    expect(result).toEqual({ name: "test", age: "25" });
  });

  it("handles invalid filter mode", () => {
    const result = parseFiltering({
      query: { filterMode: "invalid", name: "test" },
    });

    expect(result).toEqual({});
  });
});
