import { type BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";

export type UsersOrderByKey = "id" | "name" | "email" | "roleId" | "roleName";

export type UsersForTableQuery = BaseRequestQueryObject<UsersOrderByKey> & {
  name__iLike?: string;
  email__iLike?: string;
  roleId__eq?: number;
  roleName__iLike?: string;
};
