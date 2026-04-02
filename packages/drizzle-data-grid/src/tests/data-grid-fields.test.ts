import { describe, it, expect } from "vitest";
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { DataGridFields } from "../data-grid-fields.ts";
import type { Fields } from "../types.ts";

const schema = {
  users: pgTable("users", {
    id: integer("id").primaryKey(),
    name: text("name"),
  }),
};

describe("DataGridFields", () => {
  const fieldsConfig: Fields<"id" | "name"> = {
    id: { column: schema.users.id, type: "number" },
    name: { column: schema.users.name, type: "string" },
  };

  it("should create a new instance", () => {
    const fields = new DataGridFields({
      fields: fieldsConfig,
    });

    expect(fields).toBeInstanceOf(DataGridFields);
  });
});
