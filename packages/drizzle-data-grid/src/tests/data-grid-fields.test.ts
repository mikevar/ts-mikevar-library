import { describe, it, expect } from "vitest";
import { DataGridFields, createDataGridFields } from "../data-grid-fields.ts";
import type { Fields } from "../types.ts";
import * as schema from "./schema.ts";

describe("DataGridFields", () => {
  type SortableKeys =
    | "id"
    | "name"
    | "username"
    | "roleId"
    | "passwordHash"
    | "roleName";
  const fieldsConfig: Fields<SortableKeys> = {
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
      filterable: false,
    },
  };

  it("should create a new instance using constructor", () => {
    const fields = new DataGridFields<SortableKeys>({
      fields: fieldsConfig,
    });

    expect(fields).toBeInstanceOf(DataGridFields);
  });

  it("should create a new instance using factory function", () => {
    const fields = createDataGridFields<SortableKeys>({
      fields: fieldsConfig,
    });

    expect(fields).toBeInstanceOf(DataGridFields);
  });

  const fields = createDataGridFields<SortableKeys>({
    fields: fieldsConfig,
  });

  it("should have the correct fields", () => {
    expect(fields.getFields()).toEqual(fieldsConfig);
  });

  it("should have the correct sortable fields", () => {
    expect(fields.getSortableFields()).toEqual({
      id: schema.users.id,
      name: schema.users.name,
      username: schema.users.username,
      roleId: schema.users.roleId,
    });
  });

  it("should have the correct searchable fields", () => {
    expect(fields.getSearchableFields()).toEqual({
      name: {
        column: schema.users.name,
        type: "string",
      },
      username: {
        column: schema.users.username,
        type: "string",
      },
      roleName: {
        column: schema.roles.name,
        type: "string",
      },
    });
  });

  it("should have the correct filterable fields", () => {
    expect(fields.getFilterableFields()).toEqual({
      name: {
        column: schema.users.name,
        type: "string",
      },
      username: {
        column: schema.users.username,
        type: "string",
      },
      roleId: {
        column: schema.users.roleId,
        type: "number",
      },
    });
  });
});
