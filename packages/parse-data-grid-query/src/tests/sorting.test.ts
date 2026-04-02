import { describe, it, expect } from "vitest";
import { parseSortingOrder, parseSortingOrderBy } from "../sorting.ts";

describe("parseSortingOrder", () => {
  it("uses defaults when query is empty", () => {
    const result = parseSortingOrder({ query: {} });

    expect(result).toEqual("asc");
  });

  it("parses valid order", () => {
    const result = parseSortingOrder({
      query: { order: "desc" },
    });

    expect(result).toEqual("desc");
  });
});

describe("parseSortingOrderBy", () => {
  it("uses defaults when query is empty", () => {
    type TestOrderBy = "name";
    const result = parseSortingOrderBy<TestOrderBy>({
      query: {},
      allowed: ["name"],
    });

    expect(result).toBeUndefined();
  });

  it("parses valid order by", () => {
    type TestOrderBy = "name";
    const result = parseSortingOrderBy<TestOrderBy>({
      query: { orderBy: "name" },
      allowed: ["name"],
    });

    expect(result).toEqual("name");
  });

  it("handles multiple order by options", () => {
    type TestOrderBy = "name" | "age";
    const result = parseSortingOrderBy<TestOrderBy>({
      query: { orderBy: "age" },
      allowed: ["name", "age"],
    });

    expect(result).toEqual("age");
  });

  it("handles empty allowed array", () => {
    type TestOrderBy = "name";
    expect(() =>
      parseSortingOrderBy<TestOrderBy>({
        query: { orderBy: "name" },
        allowed: [],
      }),
    ).toThrow("Allowed array cannot be empty");
  });

  it("handles invalid order by with default", () => {
    type TestOrderBy = "name";
    const result = parseSortingOrderBy<TestOrderBy>({
      query: { orderBy: "invalid" },
      allowed: ["name"],
      defaultOrderBy: "name",
    });

    expect(result).toEqual("name");
  });
});
