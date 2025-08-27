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
import { nanoid } from "nanoid";  // ✅ import nanoid

// 🔹 Generic CRUD helpers
function createCrud<T extends { id: string }>(table: any) {
    return {
        // CREATE
        async create(data) {
            const id = nanoid(36); // ✅ auto-generate id if not passed

            const insertData = {
                ...data,
                dob: data.dob ? new Date(data.dob) : null,

                id,
            };

            console.log("Inserting data:", insertData);

            await db.insert(table).values(insertData);

            return insertData;
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
            await db.update(table).set(data).where(eq(table.id, id));
            return { id, ...data };
        },

        // DELETE
        async remove(id: string) {
            await db.delete(table).where(eq(table.id, id));
            return { success: true };
        },

        // Find All
        async findAll() {
            return await db.select().from(table);
        },
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
