import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: integer('user_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 55 }),
  email: varchar('email', { length: 25 }).unique(),
  mobile: varchar('mobile', { length: 10 }).unique(),
  clerkId: varchar('clerk_id', { length: 255 }).unique(),
  batch: varchar('batch', { length: 15 }),
  collageName: varchar('collage_name', { length: 125 }),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
