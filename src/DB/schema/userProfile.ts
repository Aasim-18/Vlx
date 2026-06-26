import { pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';
import { user } from './exporter.js';

export const userProfile = pgTable('usersProfile', {
  user_id: uuid('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 55 }).notNull(),
  mobile: varchar('mobile', { length: 10 }).unique().notNull(),
  batch: varchar('batch', { length: 15 }).notNull(),
  collageName: varchar('collage_name', { length: 125 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
