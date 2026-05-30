import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const collageTable = pgTable('collage', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 25 }).notNull(),
  city: varchar('city', { length: 25 }).notNull(),
  domain: varchar('domain', { length: 25 }).notNull(),
});
