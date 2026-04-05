import { type BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";

export type UsersForSelectorOrderByKey = "id" | "name";

export type UsersForSelectorQuery =
  BaseRequestQueryObject<UsersForSelectorOrderByKey> & {
    name__iLike?: string;
  };

export type UsersForDataGridOrderByKey =
  | "id"
  | "name"
  | "email"
  | "roleId"
  | "roleName";

export type UsersForDataGridQuery =
  BaseRequestQueryObject<UsersForDataGridOrderByKey> & {
    name__iLike?: string;
    email__iLike?: string;
    roleId__eq?: number;
    roleName__iLike?: string;
  };
