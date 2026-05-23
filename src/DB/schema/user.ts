import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { collageTable } from "./collage.js";

export const userTable = pgTable("users", {

  id: integer("user_id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 25 }),
  email: varchar("email", { length: 25 }).unique(),
  mobile: varchar("mobile", { length: 10 }).unique(),
  clerkId: varchar("clerk_id", { length: 255 }).unique(),
  batch: integer("batch"),
  collageId: integer("collage_id")
             .references(() => collageTable.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),

}) 