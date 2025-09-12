/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import {
    chatMessage,
    chatSession,
    diet,
    event,
    exerciseGoal,
    media,
    mediaChunks,
    medicine,
    medicineSchedule,
    member,
    sleepGoal,
} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { createServerFn } from '@tanstack/react-start';
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth";
import { authMiddleware } from "../auth/middleware";
import { parse } from "date-fns";

// Helper to get userId from session
async function getUserIdFromSession() {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({ headers });
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not authenticated");
    return userId;
}

export const getChatSessions = createServerFn()
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        const chatSessions = await db.select().from(chatSession).where(eq(chatSession.userId, userId));
        return chatSessions;
    });

export const getChatMessages = createServerFn().middleware([authMiddleware]).handler(async ({ data }: any) => { await db.select().from(chatMessage).where(eq(chatMessage.sessionId, data.sessionId)).orderBy(asc(chatMessage.createdAt)); });



//CRUD for members

export const memberSchema = createInsertSchema(member, {
    dob: z.string(),
    conditions: z.string().optional(), // Expect stringified JSON
})


export type memberFormData = z.infer<typeof memberSchema>;


export const memberDeleteSchema = z.object({
    id: z.string(),
});

export const createMembers = createServerFn({ method: 'POST' })
    .validator(memberSchema)
    .handler(async ({ data }) => {
        console.log("data", data)
        if (!data.userId) throw new Error("userId is required");
        const payload = {
            ...data,
            dob: data.dob ? new Date(data.dob) : null,
            conditions: JSON.parse(data.conditions || ' '), // Store as JSON type
        };
        return await db.insert(member).values(payload);
    });






export const getMembers = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select().from(member).where(eq(member.userId, userId));
    });

export const deleteMember = createServerFn({ method: "POST" })
    .validator(memberDeleteSchema)
    .handler(async ({ data }) => {
        if (!data || !data.id) {
            throw new Error("Member id is required for deletion");
        }
        const id = await db.delete(member).where(eq(member.id, data.id));
        return id
    })

export const getMedicines = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select({
            member,
            medicine,
            medicineSchedule
        })
            .from(medicine)
            .leftJoin(member, eq(medicine.memberId, member.id))
            .leftJoin(medicineSchedule, eq(medicineSchedule.medicineId, medicine.id))
            .where(eq(member.userId, userId));
    });

export const deleteMedicine = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const medicineToDelete = await db.select().from(medicine)
            .where(eq(medicine.id, data.id))
            .limit(1);

        if (!medicineToDelete.length || medicineToDelete[0].userId !== userId) {
            throw new Error("Unauthorized");
        }

        await db.delete(medicine).where(eq(medicine.id, data.id));
        return { success: true };
    });

export const getMedicineByMemberId = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator(z.object({ memberId: z.string() }))
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const memberRecord = await db.select().from(member)
            .where(eq(member.id, data.memberId))
            .limit(1);

        if (!memberRecord.length || memberRecord[0].userId !== userId) {
            throw new Error("Unauthorized");
        }

        return await db.select().from(medicine)
            .where(eq(medicine.memberId, data.memberId));
    });

export const getSleepGoals = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select({
            sleepGoal,
            member
        })
            .from(sleepGoal)
            .leftJoin(member, eq(sleepGoal.memberId, member.id))
            .where(eq(member.userId, userId));
    });

export const getExerciseGoals = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select({
            exerciseGoal,
            member
        })
            .from(exerciseGoal)
            .leftJoin(member, eq(exerciseGoal.memberId, member.id))
            .where(eq(member.userId, userId));
    });

export const exerciseSchema = createInsertSchema(exerciseGoal);

export type ExerciseGoalInput = z.infer<typeof exerciseSchema>;

export const createExerciseGoal = createServerFn({
    method: "POST",
    response: "raw",
})
    .middleware([authMiddleware])
    .validator(exerciseSchema)
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        return await db.insert(exerciseGoal).values({ ...data, userId });
    });

export const deleteExercise = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const record = await db.select().from(exerciseGoal)
            .where(eq(exerciseGoal.id, data.id))
            .limit(1);

        if (!record.length || record[0].userId !== userId) throw new Error("Unauthorized");

        await db.delete(exerciseGoal).where(eq(exerciseGoal.id, data.id));
        return { success: true };
    });

export const dietSchema = createInsertSchema(diet);

export type DietInput = z.infer<typeof dietSchema>;

export const createDiet = createServerFn({
    method: "POST",
    response: "raw",
})
    .middleware([authMiddleware])
    .validator(dietSchema)
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        return await db.insert(diet).values({ ...data, userId });
    });

export const getDiets = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select({
            diet,
            member
        })
            .from(diet)
            .leftJoin(member, eq(diet.memberId, member.id))
            .where(eq(member.userId, userId));
    });

export const deleteDiet = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const record = await db.select().from(diet)
            .where(eq(diet.id, data.id))
            .limit(1);

        if (!record.length || record[0].userId !== userId) throw new Error("Unauthorized");

        await db.delete(diet).where(eq(diet.id, data.id));
        return { success: true };
    });

export const getEvents = createServerFn()
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select().from(event).where(eq(event.userId, userId));
    });

const createEventSchema = createInsertSchema(event);

export type createEventFormData = z.infer<typeof createEventSchema>;

export const createEvent = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(createEventSchema)
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        return await db.insert(event).values({ ...data, userId });
    });

export const updateEvent = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(createEventSchema)
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const existing = await db.select().from(event).where(eq(event.id, data.id)).limit(1);

        if (!existing.length || existing[0].userId !== userId) {
            throw new Error("Unauthorized");
        }

        await db.update(event).set(data).where(eq(event.id, data.id));
        return { success: true };
    });

export const deleteEvent = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const existing = await db.select().from(event).where(eq(event.id, data.id)).limit(1);

        if (!existing.length || existing[0].userId !== userId) throw new Error("Unauthorized");

        await db.delete(event).where(eq(event.id, data.id));
        return { success: true };
    });

export const getChunks = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        return await db.select().from(mediaChunks);
    });

export const getMedia = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const userId = await getUserIdFromSession();
        return await db.select().from(media).where(eq(media.userId, userId));
    });

export const deleteMedia = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        const userId = await getUserIdFromSession();
        const existing = await db.select().from(media).where(eq(media.id, data.id)).limit(1);

        if (!existing.length || existing[0].userId !== userId) throw new Error("Unauthorized");

        await db.delete(media).where(eq(media.id, data.id));
        return { success: true };
    });



export const sleepGoalSchema = createInsertSchema(sleepGoal, {
    wokeUp: z.string(),
    sleepTime: z.string()
})

export type SleepGoalFormData = z.infer<typeof sleepGoalSchema>;

export const createSleepGoal = createServerFn({
    method: "POST",
    response: "raw",
}) // no generics here
    .validator(sleepGoalSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");

        console.log("data", data)
        const payload = {
            ...data,
            sleepTime:
                parse(data.sleepTime, "yyyy-MM-dd'T'HH:mm", new Date()),
            wokeUp: parse(data.wokeUp, "yyyy-MM-dd'T'HH:mm", new Date()),
        };
        return await db.insert(sleepGoal).values({ ...payload });
        ;
    });


//medicine and medicineSchedule 



export const createMedicineSchema = createInsertSchema(medicine)

export const createMedicineScheduleSchema = createInsertSchema(medicineSchedule, {
    startDate: z.string(),
    endDate: z.string(),
})

export type createMedicineScheduleFormData = z.infer<typeof createMedicineScheduleSchema>;

export type CreateMedicineFormData = z.infer<typeof createMedicineSchema>;




export const createMedicine = createServerFn({
    method: "POST",
    response: "raw",
})
    .validator(createMedicineSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");
        console.log('post data', data)
        return await db.insert(medicine).values({ ...data })
    });


export const createMedicineSchedule = createServerFn({
    method: "POST",
    response: 'raw',
})
    .validator(createMedicineScheduleSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");


        console.log('post data', data)

        const payload = {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),

        }
        return await db.insert(medicineSchedule).values({ ...payload })
    })


