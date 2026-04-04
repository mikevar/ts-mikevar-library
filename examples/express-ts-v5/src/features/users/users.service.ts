import { createDataGrid } from "@mikevar/drizzle-data-grid";
import type { UsersForTableQuery, UsersOrderByKey } from "./users.types";
import {
  usersDataGridFields,
  usersDataGridQueryBuilders,
} from "./users.static";

export async function getUsersForDataGrid({
  query,
}: {
  query: UsersForTableQuery;
}) {
  const dataGrid = createDataGrid<UsersForTableQuery, UsersOrderByKey, any>({
    query: {
      query: query,
      allowed: ["id", "name", "email", "roleId", "roleName"],
    },
    fields: usersDataGridFields,
    queryBuilders: usersDataGridQueryBuilders,
  });
  await dataGrid.execute();
  return dataGrid.toJSON();
}
