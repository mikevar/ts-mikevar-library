import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  username: text("username"),
  roleId: integer("role_id"),
  passwordHash: text("password_hash"),
});
