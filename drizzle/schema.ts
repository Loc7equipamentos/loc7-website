import { mysqlTable, varchar, text, int, decimal, datetime, boolean, json } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Tabela de Categorias
export const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Produtos (Equipamentos)
export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  categoryId: int('category_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  brand: varchar('brand', { length: 255 }),
  model: varchar('model', { length: 255 }),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  pricePerDay: decimal('price_per_day', { precision: 10, scale: 2 }).notNull(),
  pricePerWeek: decimal('price_per_week', { precision: 10, scale: 2 }),
  pricePerMonth: decimal('price_per_month', { precision: 10, scale: 2 }),
  mainImage: varchar('main_image', { length: 500 }),
  images: json('images').$type<string[]>().default([]),
  specifications: json('specifications').$type<Record<string, string>>().default({}),
  whatIncludes: json('what_includes').$type<string[]>().default([]),
  available: boolean('available').default(true),
  quantity: int('quantity').default(1),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Relações
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// Types exportados
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
