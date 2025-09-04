import { db } from "@/lib/db";
import {

    chatMessage,
    member,
    sleepGoal,

} from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

import { api } from "~/lib/api";
import { createServerFn } from '@tanstack/react-start';

export const getChatSessions = createServerFn().handler(async () => {
    const chatSessions = await api.chatSession.findAll();
    return chatSessions;
});

export const getChatMessages = createServerFn().handler(async ({ data }) => {
    await db.select()
        .from(chatMessage)
        .where(eq(chatMessage.sessionId, data.sessionId))
        .orderBy(asc(chatMessage.createdAt));
});

export const getMembers = createServerFn({ method: "GET" }).handler(async () => {
    const members = await api.members.findAll();
    return members;
});


export const getSleepGoals = createServerFn({ method: "GET" }).handler(
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
