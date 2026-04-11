import { eq, count } from "drizzle-orm";
import {
  createCursorDataGrid,
  createDataGrid,
} from "@mikevar/drizzle-data-grid";
import type {
  UsersForDataGridOrderByKey,
  UsersForSelectorOrderByKey,
} from "./users.types";
import { db } from "../../db";
import * as schema from "../../schema";

export async function getUsersForSelector({
  query,
}: {
  query: Record<string, string>;
}) {
  const dataGrid = createCursorDataGrid<UsersForSelectorOrderByKey, any>({
    query: {
      query: {
        paginationMode: "cursor",
        cursor: query.cursor!,
        limit: query.limit!,
        orders: "id:asc",
        filterMode: "search",
        search: query.search!,
      },
      allowed: ["id"],
    },
    fields: {
      id: {
        column: schema.users.id,
        type: "number",
      },
      name: {
        column: schema.users.name,
        type: "string",
        sortable: true,
        searchable: true,
        filterable: true,
      },
    },
    queryBuilders: {
      items: db
        .select({
          id: schema.users.id,
          name: schema.users.name,
        })
        .from(schema.users),
      total: db.select({ count: count() }).from(schema.users),
    },
  });
  await dataGrid.execute();
  return dataGrid.toJSON();
}

export async function getUsersForDataGrid({
  query,
}: {
  query: Record<string, string>;
}) {
  const dataGrid = createDataGrid<UsersForDataGridOrderByKey, any>({
    query: {
      query: query,
      allowed: ["id", "name", "email", "roleId", "roleName"],
    },
    fields: {
      id: {
        column: schema.users.id,
        type: "number",
      },
      name: {
        column: schema.users.name,
        type: "string",
        sortable: true,
        searchable: true,
        filterable: true,
      },
      email: {
        column: schema.users.email,
        type: "string",
        sortable: true,
        searchable: true,
        filterable: true,
      },
      roleId: {
        column: schema.users.roleId,
        type: "number",
        sortable: true,
        filterable: true,
      },
      roleName: {
        column: schema.roles.name,
        type: "string",
        searchable: true,
        filterable: true,
      },
    },
    queryBuilders: {
      items: db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          roleId: schema.users.roleId,
          role: {
            id: schema.roles.id,
            name: schema.roles.name,
          },
        })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id)),
      total: db
        .select({ count: count() })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id)),
    },
  });
  await dataGrid.execute();
  return dataGrid.toJSON();
}
