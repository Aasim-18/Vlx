import { pgTable, timestamp, varchar, uuid} from 'drizzle-orm/pg-core';
import { user } from './exporter.js';


export const userProfile = pgTable('usersprofile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 225 }).notNull(),
  mobile: varchar('mobile', { length: 225 }).unique().notNull(),
  batch: varchar('batch', { length: 225 }).notNull(),
  collageName: varchar('collage_name', { length: 225 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
