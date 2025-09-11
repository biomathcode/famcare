/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import {

    chatMessage,
    diet,
    event,
    exerciseGoal,
    medicine,
    medicineSchedule,
    member,
    sleepGoal,

} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

import { api } from "~/lib/api";
import { createServerFn } from '@tanstack/react-start';
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const getChatSessions = createServerFn().handler(async () => {
    const chatSessions = await api.chatSession.findAll();
    return chatSessions;
});



export const getChatMessages = createServerFn().handler(async ({ data }: any) => {
    await db.select()
        .from(chatMessage)
        .where(eq(chatMessage.sessionId, data.sessionId))
        .orderBy(asc(chatMessage.createdAt));
});

export const getMembers = createServerFn({ method: "GET" }).handler(async () => {
    const members = await db.select()
        .from(member)
    return members;
});

export const getMedicines = createServerFn({ method: "GET" }).handler(
    async () => {
        const medicines = await db.select({
            member,
            medicine,
            medicineSchedule
        })
            .from(medicine)
            .leftJoin(member, eq(medicine.memberId, member.id))
            .leftJoin(
                medicineSchedule,
                eq(medicineSchedule.medicineId, medicine.id)
            );
        return medicines;
    }
);

export const deleteMedicine = createServerFn({ method: 'POST' })
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        await api.medicines.remove(data.id); // implement api.events.remove
        return { success: true };
    });

export const getMedicineByMemberId = createServerFn({ method: "POST" })
    .validator(z.object({ memberId: z.string() }))
    .handler(async ({ data }) => {


        const medicines = await db.select().from(medicine).where(eq(medicine.memberId, data.memberId));


        console.log("medicines By memberId", data.memberId, medicines,)


        return medicines;
    });


export const getSleepGoals = createServerFn({ method: "GET" })
    .handler(
        async () => {
            const goals = await db.select({
                sleepGoal,
                member
            })
                .from(sleepGoal)
                .leftJoin(member, eq(sleepGoal.memberId, member.id));
            return goals;
        }
    );

// Exercise
export const getExerciseGoals = createServerFn({ method: "GET" }).handler(
    async () => {
        const goals = await db.select({
            exerciseGoal,
            member
        })
            .from(exerciseGoal)
            .leftJoin(member, eq(exerciseGoal.memberId, member.id));
        return goals;
    }
);

export const exerciseSchema = createInsertSchema(exerciseGoal)

export type ExerciseGoalInput = z.infer<typeof exerciseSchema>;

export const createExerciseGoal = createServerFn({
    method: "POST",
    response: "raw",
})
    .validator(exerciseSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");
        return await api.exerciseGoals.create(data);
    });



export const deleteExercise = createServerFn({ method: 'POST' })
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        await api.exerciseGoals.remove(data.id); // implement api.events.remove
        return { success: true };
    });



// CRUD For Diets


export const dietSchema = createInsertSchema(diet)

export type DietInput = z.infer<typeof dietSchema>;

export const createDiet = createServerFn({
    method: "POST",
    response: "raw",
})
    .validator(dietSchema)
    .handler(async ({ data }) => {
        if (!data.userId) throw new Error("userId is required");
        return await api.diets.create(data);
    });

export const getDiets = createServerFn({ method: "GET" }).handler(async () => {

    const goals = await db.select({
        diet,
        member
    })
        .from(diet)
        .leftJoin(member, eq(diet.memberId, member.id));
    return goals;

});



export const deleteDiet = createServerFn({ method: 'POST' })
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        await api.diets.remove(data.id); // implement api.events.remove
        return { success: true };
    });









// CRUD For Events

export const getEvents = createServerFn().handler(async () => {
    const events = await api.events.findAll();
    return events;
});

const createEventSchema = createInsertSchema(event);

export type creatEventFormData = z.infer<typeof createEventSchema>;

export const createEvent = createServerFn({ method: 'POST' })
    .validator(createEventSchema)
    .handler(async ({ data }) => {
        const newEvent = await api.events.create(data); // implement api.events.create
        return newEvent;
    });


export const updateEvent = createServerFn({ method: 'POST' })
    .validator(createEventSchema)
    .handler(async ({ data }) => {
        if (!data.id) throw new Error('Event ID is required');
        const updated = await api.events.update(data.id, data); // implement api.events.update
        return updated;
    });



export const deleteEvent = createServerFn({ method: 'POST' })
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        await api.events.remove(data.id); // implement api.events.remove
        return { success: true };
    });



export const getChunks = createServerFn({ method: "GET" }).
    handler(async () => {
        return await api.mediaChunks.findAll()
    });



export const getMedia = createServerFn({ method: "GET" }).
    handler(async () => {
        return await api.media.findAll();
    });




export const deleteMedia = createServerFn({ method: 'POST' })
    .validator(z.object({ id: z.string() }))
    .handler(async ({ data }) => {
        await api.media.remove(data.id); // implement api.events.remove
        return { success: true };
    });