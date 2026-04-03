import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";

const CREATED_AT_FIELD = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
};

const VARCHAR_CONFIG = { length: 255 };

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  email: varchar("email", VARCHAR_CONFIG).notNull(),
  passwordHash: varchar("password_hash", VARCHAR_CONFIG).notNull(),
  roleId: integer("role_id"),
  ...CREATED_AT_FIELD,
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  unitId: integer("unit_id"),
  productCategoryId: integer("product_category_id"),
  type: varchar("type", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const productLots = pgTable("product_lots", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  batchNumber: varchar("batch_number", VARCHAR_CONFIG).notNull(),
  expiryDate: timestamp("expiry_date", { withTimezone: true }),
  src: varchar("src", VARCHAR_CONFIG),
  transactionId: integer("transaction_id"),
  ...CREATED_AT_FIELD,
});

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", VARCHAR_CONFIG).notNull(),
  ...CREATED_AT_FIELD,
});

export const stockLocations = pgTable("stock_locations", {
  id: serial("id").primaryKey(),
  refType: varchar("ref_type", VARCHAR_CONFIG).notNull(),
  refId: integer("ref_id").notNull(),
  parentId: integer("parent_id"),
  ...CREATED_AT_FIELD,
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  dateTime: timestamp("date_time", { withTimezone: true }).notNull(),
  stockLocationId: integer("stock_location_id").notNull(),
  productLotId: integer("product_lot_id").notNull(),
  openingBalance: decimal("opening_balance", {
    precision: 22,
    scale: 6,
  }).notNull(),
  qtyIn: decimal("qty_in", { precision: 22, scale: 6 }).notNull(),
  qtyOut: decimal("qty_out", { precision: 22, scale: 6 }).notNull(),
  qtyAdj: decimal("qty_adj", { precision: 22, scale: 6 }).notNull(),
  closingBalance: decimal("closing_balance", {
    precision: 22,
    scale: 6,
  }).notNull(),
  transactionId: integer("transaction_id"),
  transactionType: varchar("transaction_type", VARCHAR_CONFIG),
  ...CREATED_AT_FIELD,
});

export const goodsReceipts = pgTable("goods_receipts", {
  id: serial("id").primaryKey(),
  code: varchar("code", VARCHAR_CONFIG).notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  warehouseId: integer("warehouse_id").notNull(),
  supplierId: integer("supplier_id").notNull(),
  ...CREATED_AT_FIELD,
});

export const goodsReceiptProductLots = pgTable("goods_receipt_product_lots", {
  id: serial("id").primaryKey(),
  headerId: integer("goods_receipt_id").notNull(),
  productLotId: integer("product_lot_id").notNull(),
  qty: decimal("qty", { precision: 22, scale: 6 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 22, scale: 6 }),
  totalAmount: decimal("total_amount", { precision: 22, scale: 6 }),
  ...CREATED_AT_FIELD,
});
