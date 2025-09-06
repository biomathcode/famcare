import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    int,
    json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { user } from "./auth-schema";
import { member } from "./member-schema";

export const medicine = mysqlTable("medicine", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    memberId: varchar("member_id", { length: 36 })
        .notNull()
        .references(() => member.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const medicineSchedule = mysqlTable("medicine_schedule", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    medicineId: varchar("medicine_id", { length: 36 })
        .notNull()
        .references(() => medicine.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    memberId: varchar("member_id", { length: 36 })
        .notNull()
        .references(() => member.id, { onDelete: "cascade" }),

    // recurrence type
    frequency: varchar("frequency", { length: 20 }).notNull().default("daily"),
    // e.g., daily, weekly, monthly, custom

    // number of times per day (for daily schedules)
    timesPerDay: int("times_per_day").default(1),

    // JSON field to handle complex recurrence rules
    recurrenceRule: json("recurrence_rule").$type<{
        interval?: number; // e.g., every 2 days
        daysOfWeek?: string[]; // ["monday", "tuesday"]
        daysOfMonth?: number[]; // [1, 15, 30]
        customDates?: string[]; // ISO dates ["2025-09-06", "2025-09-08"]
    }>(),

    dosage: int("dosage").default(1),
    unit: varchar("unit", { length: 20 }).default("pill"), // pill, ml, etc.
    startDate: timestamp("start_date").default(sql`CURRENT_TIMESTAMP`),
    endDate: timestamp("end_date"),
});
