import { varchar, integer, pgTable, boolean, text } from 'drizzle-orm/pg-core';
import { userTable } from './user.js';
import { sql } from 'drizzle-orm';

export const productTable = pgTable('products', {
  id: integer('product_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 55 }).notNull(),
  category: varchar('category', { length: 55 }).notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  price: integer('price').notNull(),
  collageName: varchar('collageName', { length: 125 }),
  detail: varchar('productDetail', { length: 225 }).notNull(),
  isAvalable: boolean('isAvailable').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  images: text('images')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
});
