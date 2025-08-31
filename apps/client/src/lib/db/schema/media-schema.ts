import { sql } from "drizzle-orm";

import { mysqlTable, varchar, text, float, timestamp, } from "drizzle-orm/mysql-core";
import { user } from './auth-schema';


export const media = mysqlTable("media", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .default(sql`(UUID())`), // use MySQL's UUID()
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fileUrl: text("file_url").notNull(),
    type: varchar("type", { length: 50 }), // pdf, image, doc
    size: float("size").notNull(), // in MB
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});