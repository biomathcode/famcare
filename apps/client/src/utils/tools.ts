import { tool } from "ai";
import { z } from "zod";
import { api } from "~/lib/api";


const getMembers = tool({
    description: "Use this tool to get all members from the database",
    inputSchema: z.object({}),
    execute: async () => {

        console.log("Tool getMembers called ✅");

        const members = await api.members.findAll();

        console.log('members', members)
        return JSON.parse(JSON.stringify(members));
    }
})

export default async function getTools() {
    return {
        getMembers,
    };
}