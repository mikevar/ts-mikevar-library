import { describe, expect, it } from "vitest";

import { parseQueryObject } from "./parse-query-object.ts";

describe("parseQueryObject", () => {
  describe("core behavior", () => {
    it("parses all default reserved query keys correctly", () => {
      const result = parseQueryObject({
        query: {
          filterMode: "and",
          search: "john",
          paginationMode: "page",
          page: "2",
          limit: "20",
          cursor: "abc123",
          orders: "name.asc",
        },
      });

      expect(result).toEqual({
        pagination: {
          mode: "page",
          page: "2",
          limit: "20",
          cursor: "abc123",
        },
        sorting: {
          orders: "name.asc",
        },
        filtering: {
          mode: "and",
          search: "john",
          filters: {},
        },
      });
    });

    it("excludes reserved keys from filters", () => {
      const result = parseQueryObject({
        query: {
          search: "john",
          page: "1",
          limit: "10",
        },
      });

      expect(result.filtering.filters).toEqual({});
    });

    it("includes unknown keys in filters", () => {
      const result = parseQueryObject({
        query: {
          status: "active",
          role: "admin",
        },
      });

      expect(result.filtering.filters).toEqual({
        status: "active",
        role: "admin",
      });
    });
  });

  describe("custom key mapping", () => {
    it("uses custom queryKeys mappings correctly", () => {
      const result = parseQueryObject({
        query: {
          q: "laptop",
          p: "3",
          size: "50",
          sort: "price.desc",
        },
        queryKeys: {
          search: "q",
          page: "p",
          limit: "size",
          orders: "sort",
        },
      });

      expect(result).toEqual({
        pagination: {
          mode: undefined,
          page: "3",
          limit: "50",
          cursor: undefined,
        },
        sorting: {
          orders: "price.desc",
        },
        filtering: {
          mode: undefined,
          search: "laptop",
          filters: {},
        },
      });
    });

    it("excludes custom reserved keys from filters", () => {
      const result = parseQueryObject({
        query: {
          q: "hello",
          category: "books",
        },
        queryKeys: {
          search: "q",
        },
      });

      expect(result.filtering.filters).toEqual({
        category: "books",
      });
    });

    it("falls back to default keys when partial queryKeys provided", () => {
      const result = parseQueryObject({
        query: {
          q: "john",
          page: "2",
        },
        queryKeys: {
          search: "q",
        },
      });

      expect(result.filtering.search).toBe("john");
      expect(result.pagination.page).toBe("2");
    });
  });

  describe("missing data", () => {
    it("handles empty query object", () => {
      const result = parseQueryObject({
        query: {},
      });

      expect(result).toEqual({
        pagination: {
          mode: undefined,
          page: undefined,
          limit: undefined,
          cursor: undefined,
        },
        sorting: {
          orders: undefined,
        },
        filtering: {
          mode: undefined,
          search: undefined,
          filters: {},
        },
      });
    });

    it("returns undefined for missing fields", () => {
      const result = parseQueryObject({
        query: {
          search: "john",
        },
      });

      expect(result.pagination.page).toBeUndefined();
      expect(result.sorting.orders).toBeUndefined();
    });

    it("handles partially filled query object", () => {
      const result = parseQueryObject({
        query: {
          search: "john",
          limit: "25",
        },
      });

      expect(result.filtering.search).toBe("john");
      expect(result.pagination.limit).toBe("25");
    });
  });

  describe("safety and stability", () => {
    it("does not mutate input query object", () => {
      const query = {
        search: "john",
        status: "active",
      };

      const original = structuredClone(query);

      parseQueryObject({ query });

      expect(query).toEqual(original);
    });

    it("does not mutate queryKeys object", () => {
      const queryKeys = {
        search: "q",
      };

      const original = structuredClone(queryKeys);

      parseQueryObject({
        query: {},
        queryKeys,
      });

      expect(queryKeys).toEqual(original);
    });

    it("always returns pagination, sorting, and filtering objects", () => {
      const result = parseQueryObject({
        query: {},
      });

      expect(result.pagination).toBeDefined();
      expect(result.sorting).toBeDefined();
      expect(result.filtering).toBeDefined();
      expect(result.filtering.filters).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("preserves empty string values", () => {
      const result = parseQueryObject({
        query: {
          search: "",
          status: "",
        },
      });

      expect(result.filtering.search).toBe("");
      expect(result.filtering.filters.status).toBe("");
    });

    it("preserves special characters in filter keys and values", () => {
      const result = parseQueryObject({
        query: {
          "user:name": "john/doe@example.com",
        },
      });

      expect(result.filtering.filters).toEqual({
        "user:name": "john/doe@example.com",
      });
    });

    it("handles custom key collisions predictably", () => {
      const result = parseQueryObject({
        query: {
          q: "search-value",
          search: "filter-value",
        },
        queryKeys: {
          search: "q",
        },
      });

      expect(result.filtering.search).toBe("search-value");

      expect(result.filtering.filters).toEqual({
        search: "filter-value",
      });
    });
  });
});