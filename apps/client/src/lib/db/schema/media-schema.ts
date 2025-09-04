import { sql } from "drizzle-orm";

import { mysqlTable, varchar, text, float, timestamp, int, customType } from "drizzle-orm/mysql-core";
import { user } from './auth-schema';


export const vector = customType<{
    data: number[];
    config: { length: number };
    configRequired: true;
    driverData: string;
}>({
    dataType(config) {
        return `VECTOR(${config.length})`;
    },
    toDriver(value: number[]) {
        // TiDB expects `[x,y,z]`
        return `[${value.join(",")}]`;
    },
    fromDriver(value: string) {
        // TiDB returns "[0.1,0.2,...]"
        try {
            return JSON.parse(value) as number[];
        } catch {
            return value
                .replace(/^\[|\]$/g, "")
                .split(",")
                .map(Number);
        }
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
    embedding: vector("embedding", { length: 768 }).notNull(),
    order: int("order").notNull(),
})