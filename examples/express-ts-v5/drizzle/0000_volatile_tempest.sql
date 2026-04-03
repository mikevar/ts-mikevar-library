CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_product_lots" (
	"id" serial PRIMARY KEY NOT NULL,
	"goods_receipt_id" integer NOT NULL,
	"product_lot_id" integer NOT NULL,
	"qty" numeric(22, 6) NOT NULL,
	"unit_price" numeric(22, 6),
	"total_amount" numeric(22, 6),
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"warehouse_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_lots" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"batch_number" varchar(255) NOT NULL,
	"expiry_date" timestamp with time zone,
	"src" varchar(255),
	"transaction_id" integer,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"unit_id" integer,
	"product_category_id" integer,
	"type" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"ref_type" varchar(255) NOT NULL,
	"ref_id" integer NOT NULL,
	"parent_id" integer,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_time" timestamp with time zone NOT NULL,
	"stock_location_id" integer NOT NULL,
	"product_lot_id" integer NOT NULL,
	"opening_balance" numeric(22, 6) NOT NULL,
	"qty_in" numeric(22, 6) NOT NULL,
	"qty_out" numeric(22, 6) NOT NULL,
	"qty_adj" numeric(22, 6) NOT NULL,
	"closing_balance" numeric(22, 6) NOT NULL,
	"transaction_id" integer,
	"transaction_type" varchar(255),
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role_id" integer,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
