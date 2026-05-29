import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const stockStatusEnum = pgEnum("stock_status", [
  "em_falta",
  "sob_encomenda",
  "disponivel",
]);

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  country: text("country"),
  logoKey: text("logo_key"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  city: text("city"),
  rating: integer("rating").notNull().default(48),
});

export const parts = pgTable("parts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  sku: text("sku").notNull(),
  oem: text("oem"),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  sellerId: integer("seller_id")
    .notNull()
    .references(() => sellers.id),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("BRL"),
  stockStatus: stockStatusEnum("stock_status").notNull().default("em_falta"),
  imageKey: text("image_key"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const partBrands = pgTable(
  "part_brands",
  {
    partId: integer("part_id")
      .notNull()
      .references(() => parts.id, { onDelete: "cascade" }),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    model: text("model"),
  },
  (t) => [primaryKey({ columns: [t.partId, t.brandId] })],
);

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  partId: integer("part_id").references(() => parts.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  quantity: integer("quantity").notNull().default(1),
  message: text("message"),
  status: text("status").notNull().default("novo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  address: text("address"),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("pendente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  partId: integer("part_id")
    .notNull()
    .references(() => parts.id),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

// ---- Relations ----
export const brandsRelations = relations(brands, ({ many }) => ({
  partBrands: many(partBrands),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  parts: many(parts),
}));

export const sellersRelations = relations(sellers, ({ many }) => ({
  parts: many(parts),
}));

export const partsRelations = relations(parts, ({ one, many }) => ({
  category: one(categories, {
    fields: [parts.categoryId],
    references: [categories.id],
  }),
  seller: one(sellers, {
    fields: [parts.sellerId],
    references: [sellers.id],
  }),
  partBrands: many(partBrands),
  orderItems: many(orderItems),
}));

export const partBrandsRelations = relations(partBrands, ({ one }) => ({
  part: one(parts, { fields: [partBrands.partId], references: [parts.id] }),
  brand: one(brands, { fields: [partBrands.brandId], references: [brands.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  part: one(parts, { fields: [orderItems.partId], references: [parts.id] }),
}));

export type Brand = typeof brands.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Seller = typeof sellers.$inferSelect;
export type Part = typeof parts.$inferSelect;
