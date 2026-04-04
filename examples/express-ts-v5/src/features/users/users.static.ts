import type { Fields } from "@mikevar/drizzle-data-grid";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import * as schema from "../../schema";
import type { UsersOrderByKey } from "./users.types";

export const usersDataGridFields: Fields<UsersOrderByKey> = {
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
} as const;

export const usersDataGridQueryBuilders = {
  items: (args: {
    filters: any;
    orderBy: any;
    pagination: {
      limit: number;
      offset: number;
    };
  }) => {
    return db
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
      .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
      .where(args.filters)
      .orderBy(args.orderBy)
      .limit(args.pagination.limit)
      .offset(args.pagination.offset);
  },
  total: (args: { filters: any; count: any }) => {
    return db
      .select({ count: args.count() })
      .from(schema.users)
      .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
      .where(args.filters);
  },
} as const;
