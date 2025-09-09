/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import {

    chatMessage,
    event,
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
    const members = await api.members.findAll();
    return members;
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

export const getEvents = createServerFn().handler(async () => {
    const events = await api.events.findAll();
    return events;
});


// CRUD For Events

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