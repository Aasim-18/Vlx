import { varchar, uuid, pgTable, jsonb, uniqueIndex, integer, text, index } from 'drizzle-orm/pg-core';
import { user } from './user.js';
import { sql } from 'drizzle-orm';

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
    price: integer('price').notNull(),
    collageName: varchar('collageName', { length: 225 }),
    detail: text('productDetail').notNull(),
    status: varchar('status', { length: 250 }).notNull(),
    images: jsonb('images')
      .notNull()
      .default(sql`'[]'::jsonb`),
  },

  (table) => [uniqueIndex('product_title_unique').on(table.name, table.userId),
        index("products_search").using(
      "gin",
      sql`(setweight(to_tsvector('english', ${table.name}), 'A') ||
          setweight(to_tsvector('english', ${table.category}), 'B') ||
          setweight(to_tsvector('english', ${table.detail}), 'C')                                                       )`
    )
  ],
  
);
