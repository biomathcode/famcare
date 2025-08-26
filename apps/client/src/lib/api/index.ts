// ~/lib/server/api.ts
import { db } from "@/lib/db";
import {
    user,
    chatMessage,
    healthRecord,
    medicine,
    medicineSchedule,
    member,
    diet,
    healthMetric,
    exerciseGoal,
    sleepGoal,
} from "@/lib/db/schema";

import { eq } from "drizzle-orm";

// 🔹 Generic CRUD helpers
function createCrud<T extends { id: string }>(table: any) {
    return {
        // CREATE
        async create(data: Omit<T, "id"> & { id?: string }) {
            const result = await db.insert(table).values(data);

            // MySQL me insert karne ke baad naya id `insertId` me hota hai
            const insertedId = result[0].insertId;

            return {
                id: insertedId,
                ...data,
            };
        },

        // READ (by id)
        async getById(id: string) {
            const [row] = await db.select().from(table).where(eq(table.id, id));
            return row ?? null;
        },

        // READ (all by user)
        async listByUser(userId: string) {
            return await db.select().from(table).where(eq(table.userId, userId));
        },

        // UPDATE
        async update(id: string, data: Partial<T>) {
            const result = await db
                .update(table)
                .set(data)
                .where(eq(table.id, id))

            const insertedId = result[0].insertId;

            return insertedId;
        },

        // DELETE
        async remove(id: string) {
            await db.delete(table).where(eq(table.id, id));
            return { success: true };
        },

        //Find All
        async findAll() {
            return await db.select().from(table);
        }
    };
}

// 🔹 Export CRUD APIs for each entity
export const api = {
    users: createCrud(user),
    chatMessages: createCrud(chatMessage),
    healthRecords: createCrud(healthRecord),
    medicines: createCrud(medicine),
    medicineSchedules: createCrud(medicineSchedule),
    members: createCrud(member),
    diets: createCrud(diet),
    healthMetrics: createCrud(healthMetric),
    exerciseGoals: createCrud(exerciseGoal),
    sleepGoals: createCrud(sleepGoal),
};