import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    int,
    float,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

import { user } from './auth-schema';

export const member = mysqlTable("member", {
    id: varchar("id", { length: 36 }).primaryKey(),
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
});

export const diet = mysqlTable("diet", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    mealType: varchar("meal_type", { length: 50 }), // breakfast, lunch, dinner
    description: text("description"),
    calories: int("calories"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const healthMetric = mysqlTable("health_metric", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(), // bp, sugar, cholesterol, hemoglobin
    value: float("value").notNull(),
    unit: varchar("unit", { length: 20 }), // mg/dl, mmHg
    recordedAt: timestamp("recorded_at").default(sql`CURRENT_TIMESTAMP`),
});

export const exerciseGoal = mysqlTable("exercise_goal", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }), // steps, running, cycling
    target: int("target").notNull(),
    unit: varchar("unit", { length: 20 }), // steps, km
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});


export const sleepGoal = mysqlTable("sleep_goal", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    targetHours: float("target_hours").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});


