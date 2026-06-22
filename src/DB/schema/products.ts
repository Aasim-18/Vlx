import { varchar, uuid, pgTable, boolean, jsonb, uniqueIndex, integer} from 'drizzle-orm/pg-core';
import { user } from './user.js';
import { sql } from 'drizzle-orm';

export const productTable = pgTable(
  'products',
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar('name', { length: 55 }).notNull(),
    category: varchar('category', { length: 55 }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    price: integer('price').notNull(),
    collageName: varchar('collageName', { length: 125 }),
    detail: varchar('productDetail', { length: 225 }).notNull(),
    isAvalable: boolean('isAvailable').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    images: jsonb('images')
      .notNull()
      .default(sql`'[]'::jsonb`),
  },

  (table) => [uniqueIndex('product_title_unique').on(table.name, table.userId)],
);
