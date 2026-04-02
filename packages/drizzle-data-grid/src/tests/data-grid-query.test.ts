import { describe, it, expect } from "vitest";
import type { FilterMode } from "@mikevar/parse-data-grid-query";
import { createDataGridQuery, DataGridQuery } from "../data-grid-query.ts";

describe("DataGridQuery", () => {
  type OrderByKey = "id";
  type RequestQueryObject = {
    page: number;
    limit: number;
    order: "asc" | "desc";
    orderBy: OrderByKey;
    filterMode: FilterMode;
    search: string;
    name__iLike?: string;
  };

  const searchQueryObject: RequestQueryObject = {
    page: 1,
    limit: 10,
    order: "asc",
    orderBy: "id",
    filterMode: "search",
    search: "test",
  };

  const filterQueryObject: RequestQueryObject = {
    page: 1,
    limit: 10,
    order: "asc",
    orderBy: "id",
    filterMode: "filter",
    search: "test",
    name__iLike: "test1,test2,test3",
  };

  it("should create a new instance using constructor", () => {
    const query = new DataGridQuery<RequestQueryObject, OrderByKey>({
      query: searchQueryObject,
      sortables: ["id"],
    });
    expect(query).toBeDefined();
  });

  it("should create a new instance using factory function", () => {
    const query = createDataGridQuery<RequestQueryObject, OrderByKey>({
      query: searchQueryObject,
      sortables: ["id"],
    });
    expect(query).toBeDefined();
  });

  it("should have the correct properties", () => {
    const query = createDataGridQuery<RequestQueryObject, OrderByKey>({
      query: searchQueryObject,
      sortables: ["id"],
    });
    expect(query.getPagination().page).toBe(1);
    expect(query.getPagination().limit).toBe(10);
    expect(query.getSorting().order).toBe("asc");
    expect(query.getSorting().orderBy).toBe("id");
    expect(query.getFiltering().filterMode).toBe("search");
    expect(query.getFiltering().search).toBe("test");
  });

  it("should have the correct properties for filter mode", () => {
    const query = createDataGridQuery<RequestQueryObject, OrderByKey>({
      query: filterQueryObject,
      sortables: ["id"],
    });
    expect(query.getFiltering().filterMode).toBe("filter");
    expect(query.getFiltering().search).toBe(undefined);
    expect(query.getFiltering().filters).toBeDefined();
    expect(query.getFiltering().filters).toStrictEqual({
      name__iLike: ["test1", "test2", "test3"],
    });
  });
});
