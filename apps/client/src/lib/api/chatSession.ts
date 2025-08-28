import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { api } from "~/lib/api"




export const getChatSessions = createServerFn().handler(async () => {
    return api.chatSession.findAll();
});


const CreateChatSessionInput = z.object({
    userId: z.string(),
})

export const createChatSession = createServerFn({
    method: 'POST',
}).validator((person: unknown) => {
    return CreateChatSessionInput.parse(person)
}).handler(async (ctx) => {
    // create a new random title session and return the session 
    const title = `Chat Session ${Math.floor(Math.random() * 1000)}`;

    return api.chatSession.create({ userId: ctx.data.userId, title: title });
});