
import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    json,
    int
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { generateId } from 'ai';
import { user } from './auth-schema';

export const chatSession = mysqlTable("chat_session", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(), // e.g. "Math QnA"
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const chatMessage = mysqlTable("chat_message", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(), // user, assistant
    content: text("content").notNull(),
    embedding: json("embedding"), // vector embedding for retrieval
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    sessionId: varchar("session_id", { length: 36 })
        .notNull()
        .references(() => chatSession.id, { onDelete: "cascade" }),
});






export const chat = mysqlTable("chat", {
    id: varchar("id", { length: 36 }) // UUID length
        .primaryKey()
        .notNull()
        .$defaultFn(() => uuidv4()),
    userId: varchar("userId", { length: 36 })
        .notNull()
        .references(() => user.id),
    title: varchar("title", { length: 255 }).notNull().default("New Chat"),
    createdAt: timestamp("created_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
        .notNull(),
    visibility: varchar("visibility", { length: 10 })
        .notNull()
        .default("private"), // MySQL doesn’t support enum natively in drizzle yet
});

export const message = mysqlTable("message", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => generateId()),
    chatId: varchar("chat_id", { length: 36 })
        .notNull()
        .references(() => chat.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull(), // user, assistant, or tool
    parts: json("parts").notNull(),
    attachments: json("attachments").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    model: varchar("model", { length: 100 }),
    inputTokens: int("input_tokens"),
    outputTokens: int("output_tokens"),
    totalTokens: int("total_tokens"),
    completionTime: int("completion_time"), // use int since MySQL has no "real"
});
