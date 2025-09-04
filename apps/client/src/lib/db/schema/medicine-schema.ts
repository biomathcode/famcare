import {
    mysqlTable,
    varchar,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

import { user } from './auth-schema';
import { member } from './member-schema';

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
    dosage: varchar("dosage", { length: 100 }), // e.g., 1 pill, 5ml
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
    time: varchar("time", { length: 50 }).notNull(), // e.g., 08:00 AM
    frequency: varchar("frequency", { length: 50 }), // daily, weekly
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
});