import { describe, it, expect } from "vitest";
import { parseSorting } from "../sorting";

describe("parseSorting", () => {
  it("uses defaults when query is empty", () => {
    const result = parseSorting({ query: {} });

    expect(result).toEqual("asc");
  });

  it("parses valid order", () => {
    const result = parseSorting({
      query: { order: "desc" },
    });

    expect(result).toEqual("desc");
  });
});
