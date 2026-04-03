import { describe, it, expect, beforeEach } from "vitest";
import { eq, ilike, or, and, inArray } from "drizzle-orm";
import { FilterMode } from "@mikevar/parse-data-grid-query";
import { createDataGridQuery } from "../data-grid-query.ts";
import { createDataGrid, DataGrid } from "../data-grid.ts";
import { createDataGridFields } from "../data-grid-fields.ts";
import type { Fields } from "../types.ts";
import * as schema from "./schema.ts";
import { db } from "./db.ts";

describe("DataGrid", () => {
  type OrderByKey =
    | "id"
    | "name"
    | "username"
    | "roleId"
    | "passwordHash"
    | "roleName";
  type RequestQueryObject = {
    page: number;
    limit: number;
    order: "asc" | "desc";
    orderBy: OrderByKey;
    filterMode: FilterMode;
    search: string;
    name__iLike: string;
    username__iLike: string;
    roleId__eq: string;
    roleId__inArray: string;
    roleName__iLike: string;
  };

  const fields: Fields<OrderByKey> = {
    id: {
      column: schema.users.id,
      type: "number",
      sortable: true,
      searchable: false,
      filterable: false,
    },
    name: {
      column: schema.users.name,
      type: "string",
      sortable: true,
      searchable: true,
      filterable: true,
    },
    username: {
      column: schema.users.username,
      type: "string",
      sortable: true,
      searchable: true,
      filterable: true,
    },
    roleId: {
      column: schema.users.roleId,
      type: "number",
      sortable: true,
      searchable: false,
      filterable: true,
    },
    passwordHash: {
      column: schema.users.passwordHash,
      type: "string",
      sortable: false,
      searchable: false,
      filterable: false,
    },
    roleName: {
      column: schema.roles.name,
      type: "string",
      sortable: false,
      searchable: true,
      filterable: true,
    },
  };

  describe("base tests", () => {
    const queryObject: RequestQueryObject = {
      page: 3,
      limit: 13,
      order: "asc",
      orderBy: "id",
      filterMode: "search",
      search: "test",
      name__iLike: "",
      username__iLike: "",
      roleId__eq: "1",
      roleId__inArray: "1,2,3",
      roleName__iLike: "",
    };

    it("should create a new instance using constructor", () => {
      const dataGridQuery = createDataGridQuery<RequestQueryObject, OrderByKey>(
        {
          query: queryObject,
          sortables: ["id"],
        },
      );
      const dataGridFields = createDataGridFields<OrderByKey>({
        fields,
      });
      const dataGrid = new DataGrid({
        query: dataGridQuery,
        fields: dataGridFields,
        queryBuilders: {
          items: () => [],
          total: () => 0,
        },
      });
      expect(dataGrid).toBeInstanceOf(DataGrid);
    });

    it("should create a new instance using factory function", () => {
      const dataGrid = createDataGrid<RequestQueryObject, OrderByKey>({
        query: {
          query: queryObject,
          allowed: ["id"],
        },
        fields,
        queryBuilders: {
          items: () => [],
          total: () => 0,
        },
      });
      expect(dataGrid).toBeInstanceOf(DataGrid);
    });

    it("should return the correct query", () => {
      const dataGrid = createDataGrid<RequestQueryObject, OrderByKey>({
        query: {
          query: queryObject,
          allowed: ["id"],
        },
        fields,
        queryBuilders: {
          items: () => [],
          total: () => 0,
        },
      });
      const dataGridQuery = dataGrid.getQuery();
      expect(dataGridQuery.getPagination().page).toBe(3);
      expect(dataGridQuery.getPagination().limit).toBe(13);
      expect(dataGridQuery.getPagination().offset).toBe(26);
      expect(dataGridQuery.getSorting().orderBy).toBe("id");
      expect(dataGridQuery.getSorting().order).toBe("asc");
      expect(dataGridQuery.getFiltering().filterMode).toBe("search");
      expect(dataGridQuery.getFiltering().search).toBe("test");
      expect(dataGridQuery.getFiltering().filters).toEqual({});
    });
  });

  describe("advanced search and filter tests", () => {
    let queryObject: RequestQueryObject = {
      page: 3,
      limit: 13,
      order: "asc",
      orderBy: "id",
      filterMode: "search",
      search: "test",
      name__iLike: "test",
      username__iLike: "test",
      roleId__eq: "1",
      roleId__inArray: "1,2,3",
      roleName__iLike: "test",
    };
    it("should return the correct query with search mode", () => {
      const dataGrid = createDataGrid<RequestQueryObject, OrderByKey>({
        query: {
          query: { ...queryObject, filterMode: "search" },
          allowed: ["id"],
        },
        fields,
        queryBuilders: {
          items: () => [],
          total: () => 0,
        },
      });
      const dataGridQuery = dataGrid.getQuery();
      expect(dataGridQuery.getFiltering().filterMode).toBe("search");
      expect(dataGridQuery.getFiltering().search).toBe("test");
      expect(dataGridQuery.getFiltering().filters).toEqual({});
      expect(dataGrid.getFilters()).toEqual(
        or(
          ilike(schema.users.name, "%test%"),
          ilike(schema.users.username, "%test%"),
          ilike(schema.roles.name, "%test%"),
        ),
      );
    });
    it("should return the correct query with filter mode", () => {
      const dataGrid = createDataGrid<RequestQueryObject, OrderByKey>({
        query: {
          query: { ...queryObject, filterMode: "filter" },
          allowed: ["id"],
        },
        fields,
        queryBuilders: {
          items: () => [],
          total: () => 0,
        },
      });
      const dataGridQuery = dataGrid.getQuery();
      expect(dataGridQuery.getFiltering().filterMode).toBe("filter");
      expect(dataGridQuery.getFiltering().search).toBe(undefined);
      expect(dataGridQuery.getFiltering().filters).toEqual({
        name__iLike: ["test"],
        username__iLike: ["test"],
        roleId__eq: ["1"],
        roleId__inArray: ["1", "2", "3"],
        roleName__iLike: ["test"],
      });
      expect(dataGrid.getFilters()).toEqual(
        and(
          ilike(schema.users.name, "%test%"),
          ilike(schema.users.username, "%test%"),
          eq(schema.users.roleId, 1),
          inArray(schema.users.roleId, [1, 2, 3]),
          ilike(schema.roles.name, "%test%"),
        ),
      );
    });
  });

  // describe("actual memory db tests", () => {
  //   beforeEach(() => {
  //     db.insert(schema.users)
  //       .values([
  //         { id: 1, name: "john" },
  //         { id: 2, name: "jane" },
  //       ])
  //       .run();
  //   });
  // });
});
