
import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

import { user } from './auth-schema';



export const healthRecord = mysqlTable("health_record", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fileUrl: text("file_url").notNull(),
    type: varchar("type", { length: 50 }), // pdf, image, doc
    vectorEmbedding: json("vector_embedding"), // for RAG
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});
