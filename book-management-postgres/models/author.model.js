import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const authorTable = pgTable("authors", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
