import { varchar, integer, pgTable, boolean, text } from 'drizzle-orm/pg-core';
import { userTable } from './user.js';
import { collageTable } from './collage.js';
import { sql } from 'drizzle-orm';

export const productTable = pgTable('products', {
  id: integer('product_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 25 }).notNull(),
  category: varchar('category', { length: 25 }).notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  price: integer('price').notNull(),
  collageId: integer('collage_id')
    .notNull()
    .references(() => collageTable.id),
  detail: varchar('productDetail', { length: 225 }).notNull(),
  isAvalable: boolean('isAvailable').notNull(),
  status: varchar('status', { length: 10 }).notNull(),
  images: text('images')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
});
