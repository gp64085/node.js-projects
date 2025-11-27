import {
  uuid,
  varchar,
  text,
  timestamp,
  pgTable,
  index,
} from "drizzle-orm/pg-core";

import { authorTable } from "./author.model.js";

export const bookTable = pgTable(
  "books",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    authorId: uuid("author_id")
      .references(() => authorTable.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_title").on(table.title)],
);
