import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';

const poolConnection = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'loc7',
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });

// Helper functions for products
export async function getProductsByCategory(categoryId: number) {
  return db.query.products.findMany({
    where: (products, { eq }) => eq(products.categoryId, categoryId),
    with: {
      category: true,
    },
  });
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: (products, { eq }) => eq(products.slug, slug),
    with: {
      category: true,
    },
  });
}

export async function getAllProducts() {
  return db.query.products.findMany({
    with: {
      category: true,
    },
  });
}

export async function getCategories() {
  return db.query.categories.findMany({
    with: {
      products: true,
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
    with: {
      products: true,
    },
  });
}
