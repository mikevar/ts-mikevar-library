import { describe, it, expect } from "vitest";
import { createDataGridQuery, DataGridQuery } from "../data-grid-query.ts";

describe("DataGridQuery", () => {
  type OrderByKey = "id";
  type RequestQueryObject = {
    page: number;
    limit: number;
    order: "asc" | "desc";
    orderBy: OrderByKey;
    filterMode: "search";
    search: string;
  };

  const queryObject: RequestQueryObject = {
    page: 1,
    limit: 10,
    order: "asc",
    orderBy: "id",
    filterMode: "search",
    search: "test",
  };

  it("should create a new instance using constructor", () => {
    const query = new DataGridQuery<RequestQueryObject, OrderByKey>({
      query: queryObject,
      sortables: ["id"],
    });
    expect(query).toBeDefined();
  });

  it("should create a new instance using factory function", () => {
    const query = createDataGridQuery<RequestQueryObject, OrderByKey>({
      query: queryObject,
      sortables: ["id"],
    });
    expect(query).toBeDefined();
  });

  it("should have the correct properties", () => {
    const query = createDataGridQuery<RequestQueryObject, OrderByKey>({
      query: queryObject,
      sortables: ["id"],
    });
    expect(query.getPagination().page).toBe(1);
    expect(query.getPagination().limit).toBe(10);
    expect(query.getSorting().order).toBe("asc");
    expect(query.getSorting().orderBy).toBe("id");
    expect(query.getFiltering().filterMode).toBe("search");
    expect(query.getFiltering().search).toBe("test");
  });
});
