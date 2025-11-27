import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: text({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  role: userRoleEnum().notNull().default("USER"),
  salt: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userSessionTable = pgTable("user_sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
