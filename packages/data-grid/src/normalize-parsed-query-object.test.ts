import { describe, expect, it } from "vitest";

import { normalizeParsedQueryObject } from "./normalize-parsed-query-object.ts";

describe("normalizeParsedQueryObject", () => {
  describe("default value resolution", () => {
    it("uses library defaults when no defaultQueryValues provided", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.pagination).toBeDefined();
      expect(result.sorting.orders).toEqual([]);
      expect(result.filtering.filters).toEqual([]);
    });

    it("overrides only provided default values", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {},
          },
        },
        defaultQueryValues: {
          limit: 50,
        },
      });

      expect(result.pagination.limit).toBe(50);
    });

    it("preserves library defaults for missing custom defaults", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {},
          },
        },
        defaultQueryValues: {
          page: 10,
        },
      });

      expect(result.pagination).toBeDefined();
    });
  });

  describe("pagination normalization", () => {
    describe("offset pagination", () => {
      it("normalizes valid offset pagination", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
              page: "2",
              limit: "25",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination).toEqual({
          mode: "offset",
          page: 2,
          limit: 25,
        });
      });

      it("falls back to default offset values", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.mode).toBe("offset");
      });

      it("converts page to positive integer", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
              page: "5",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.mode).toBe("offset");

        if (result.pagination.mode === "offset") {
          expect(result.pagination.page).toBe(5);
        }
      });

      it("converts limit to positive integer", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
              limit: "100",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        if (result.pagination.mode === "offset") {
          expect(result.pagination.limit).toBe(100);
        }
      });

      it("rejects invalid pagination mode", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "invalid",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(["offset", "cursor"]).toContain(result.pagination.mode);
      });

      it("handles invalid page values", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
              page: "-10",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        if (result.pagination.mode === "offset") {
          expect(result.pagination.page).toBeGreaterThan(0);
        }
      });

      it("handles invalid limit values", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
              limit: "abc",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.limit).toBeGreaterThan(0);
      });
    });

    describe("cursor pagination", () => {
      it("normalizes valid cursor pagination", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "cursor",
              cursor: "abc123",
              limit: "20",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination).toEqual({
          mode: "cursor",
          cursor: "abc123",
          limit: 20,
        });
      });

      it("falls back to default cursor", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "cursor",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.mode).toBe("cursor");
      });

      it("ignores page in cursor mode", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "cursor",
              page: "10",
              cursor: "abc",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.mode).toBe("cursor");

        if (result.pagination.mode === "cursor") {
          expect(result.pagination.cursor).toBe("abc");
        }
      });

      it("preserves cursor value", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "cursor",
              cursor: "cursor-token",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        if (result.pagination.mode === "cursor") {
          expect(result.pagination.cursor).toBe("cursor-token");
        }
      });
    });

    describe("mode switching", () => {
      it("returns OffsetPaginationObject for offset mode", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "offset",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.mode).toBe("offset");
      });

      it("returns CursorPaginationObject for cursor mode", () => {
        const result = normalizeParsedQueryObject({
          parsedQuery: {
            pagination: {
              mode: "cursor",
            },
            sorting: {},
            filtering: {
              filters: {},
            },
          },
        });

        expect(result.pagination.mode).toBe("cursor");
      });
    });
  });

  describe("sorting normalization", () => {
    it("parses single order correctly", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {
            orders: "name:asc",
          },
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.sorting.orders).toEqual([
        {
          column: "name",
          direction: "asc",
        },
      ]);
    });

    it("parses multiple orders correctly", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {
            orders: "name:asc,createdAt:desc",
          },
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.sorting.orders).toEqual([
        {
          column: "name",
          direction: "asc",
        },
        {
          column: "createdAt",
          direction: "desc",
        },
      ]);
    });

    it("trims whitespace around columns and directions", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {
            orders: " name:asc , createdAt:desc ",
          },
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.sorting.orders).toEqual([
        {
          column: "name",
          direction: "asc",
        },
        {
          column: "createdAt",
          direction: "desc",
        },
      ]);
    });

    it("defaults invalid direction to asc", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {
            orders: "name:invalid",
          },
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.sorting.orders).toEqual([
        {
          column: "name",
          direction: "asc",
        },
      ]);
    });

    it("ignores empty order entries", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {
            orders: ",,,",
          },
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.sorting.orders).toEqual([]);
    });

    it("handles empty sorting string", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {
            orders: "",
          },
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.sorting.orders).toEqual([]);
    });
  });

  describe("filter normalization", () => {
    it("parses valid filters correctly", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {
              status__eq: "active",
            },
          },
        },
      });

      expect(result.filtering.filters).toEqual([
        {
          column: "status",
          operator: "eq",
          value: "active",
        },
      ]);
    });

    it("parses multiple filters correctly", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {
              status__eq: "active",
              role__eq: "admin",
            },
          },
        },
      });

      expect(result.filtering.filters).toHaveLength(2);
    });

    it("trims filter values", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {
              status__eq: " active ",
            },
          },
        },
      });

      expect(result.filtering.filters[0]?.value).toBe("active");
    });

    it("ignores invalid operators", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {
              status__invalid: "active",
            },
          },
        },
      });

      expect(result.filtering.filters).toEqual([]);
    });

    it("ignores malformed filter keys", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {
              status: "active",
            },
          },
        },
      });

      expect(result.filtering.filters).toEqual([]);
    });

    it("handles empty filters object", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.filtering.filters).toEqual([]);
    });
  });

  describe("filtering state", () => {
    it("preserves valid filter mode", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            mode: "search",
            filters: {},
          },
        },
      });

      expect(result.filtering.mode).toBe("search");
    });

    it("falls back invalid filter mode", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            mode: "invalid",
            filters: {},
          },
        },
      });

      expect(["search", "filter"]).toContain(result.filtering.mode);
    });

    it("preserves search value", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            search: "john",
            filters: {},
          },
        },
      });

      expect(result.filtering.search).toBe("john");
    });
  });

  describe("integration", () => {
    it("normalizes complete parsed query object correctly", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {
            mode: "offset",
            page: "2",
            limit: "25",
          },
          sorting: {
            orders: "name:asc,createdAt:desc",
          },
          filtering: {
            mode: "search",
            search: "john",
            filters: {
              status__eq: "active",
            },
          },
        },
      });

      expect(result).toEqual({
        pagination: {
          mode: "offset",
          page: 2,
          limit: 25,
        },
        sorting: {
          orders: [
            {
              column: "name",
              direction: "asc",
            },
            {
              column: "createdAt",
              direction: "desc",
            },
          ],
        },
        filtering: {
          mode: "search",
          search: "john",
          filters: [
            {
              column: "status",
              operator: "eq",
              value: "active",
            },
          ],
        },
      });
    });
  });

  describe("runtime safety", () => {
    it("does not mutate parsedQuery", () => {
      const parsedQuery = {
        pagination: {
          mode: "offset",
          page: "1",
        },
        sorting: {
          orders: "name.asc",
        },
        filtering: {
          search: "john",
          filters: {
            "status:eq": "active",
          },
        },
      };

      const original = structuredClone(parsedQuery);

      normalizeParsedQueryObject({
        parsedQuery,
      });

      expect(parsedQuery).toEqual(original);
    });

    it("does not mutate defaultQueryValues", () => {
      const defaultQueryValues = {
        limit: 50,
      };

      const original = structuredClone(defaultQueryValues);

      normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {},
          },
        },
        defaultQueryValues,
      });

      expect(defaultQueryValues).toEqual(original);
    });

    it("always returns stable object shape", () => {
      const result = normalizeParsedQueryObject({
        parsedQuery: {
          pagination: {},
          sorting: {},
          filtering: {
            filters: {},
          },
        },
      });

      expect(result.pagination).toBeDefined();
      expect(result.sorting).toBeDefined();
      expect(result.filtering).toBeDefined();
      expect(result.sorting.orders).toBeDefined();
      expect(result.filtering.filters).toBeDefined();
    });
  });
});
