import { sqliteTable, integer, text, real, int } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').notNull(),
  name: text('name').notNull(),
  model: text('model').notNull(),
  brand: text('brand').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  image: text('image'),
  specifications: text('specifications'), // JSON string
  accessories: text('accessories'), // JSON string
  inStock: integer('in_stock', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull(),
  url: text('url').notNull(),
  alt: text('alt'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});
