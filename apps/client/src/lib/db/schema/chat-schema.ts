
import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

import { user } from './auth-schema';

export const chatMessage = mysqlTable("chat_message", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(), // user, assistant
    content: text("content").notNull(),
    embedding: json("embedding"), // vector embedding for retrieval
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});