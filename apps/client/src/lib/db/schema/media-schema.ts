import { sql } from "drizzle-orm";

import { mysqlTable, varchar, text, float, timestamp, int, customType } from "drizzle-orm/mysql-core";
import { user } from './auth-schema';



// 1. Create a reusable `vector` custom type
export const vector = customType<{
    data: ArrayBuffer;
    config: { length: number };
    configRequired: true;
    driverData: Buffer;
}>({
    dataType(config) {
        return `VECTOR(${config.length})`;
    },
    fromDriver(value) {
        // Convert database Buffer back to ArrayBuffer
        return (value as Buffer).buffer as ArrayBuffer;
    },
    toDriver(value) {
        // Convert ArrayBuffer to Buffer for driver
        return Buffer.from(value);
    },
});

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


export const mediaChunks = mysqlTable("media_chunks", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .default(sql`(UUID())`), // use MySQL's UUID()

    mediaId: varchar("media_id", { length: 36 })
        .notNull()
        .references(() => media.id, { onDelete: "cascade" }),
    chunk: text("chunk").notNull(),
    embedding: vector("embedding", { length: 1024 }).notNull(),
    order: int("order").notNull(),
})