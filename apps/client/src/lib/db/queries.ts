import { api } from "~/lib/api";
import { createServerFn } from '@tanstack/react-start';

export const getChatSessions = createServerFn().handler(async () => {
    const chatSessions = await api.chatSession.findAll();
    return chatSessions;
});