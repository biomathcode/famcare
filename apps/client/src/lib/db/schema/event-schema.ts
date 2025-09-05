import {
    mysqlTable,
    varchar,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { user } from './auth-schema';

export const event = mysqlTable("event", {
    id: varchar("id", { length: 36 }) // UUID length
        .primaryKey()
        .notNull()
        .default(sql`(UUID())`),
    userId: varchar("userId", { length: 36 })
        .notNull()
        .references(() => user.id),
    title: varchar("title", { length: 255 }).notNull().default("New Event"),
    description: text("description").notNull(),
    startTime: timestamp("start_time", { mode: "string" })
        .notNull(),
    endTime: timestamp("end_time", { mode: "string" })
        .notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
        .notNull(),
    visibility: varchar("visibility", { length: 10 })
        .notNull()
        .default("private"), // public, private

    location: varchar("location", { length: 255 }).notNull().default(""),

    color: varchar("color", { length: 20 }).notNull().default("blue"), // e.g. "red", "blue", "green"
});