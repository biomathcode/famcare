import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    int,
    json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

import { user } from './auth-schema';

export const member = mysqlTable("member", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    relation: varchar("relation", { length: 50 }).notNull(), // e.g., father, mother, son
    dob: timestamp("dob"),
    gender: varchar("gender", { length: 20 }),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    conditions: json("conditions")

});

export const diet = mysqlTable("diet", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    memberId: varchar("member_id", { length: 36 })
        .notNull()
        .references(() => member.id, { onDelete: "cascade" }),
    mealType: varchar("meal_type", { length: 50 }), // breakfast, lunch, dinner
    description: text("description"),
    calories: int("calories"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});


export const exerciseGoal = mysqlTable("exercise_goal", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    memberId: varchar("member_id", { length: 36 })
        .notNull()
        .references(() => member.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }), // steps, running, cycling
    target: int("target").notNull(),
    unit: varchar("unit", { length: 20 }), // steps, km
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});


export const sleepGoal = mysqlTable("sleep_goal", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    memberId: varchar("member_id", { length: 36 })
        .notNull()
        .references(() => member.id, { onDelete: "cascade" }),
    wokeUp: timestamp("woke_up").notNull(),
    sleepTime: timestamp("sleep_time").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});


