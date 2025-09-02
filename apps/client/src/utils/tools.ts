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

export const weatherTool = tool({
    description: 'Display the weather for a location',
    inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
    }),
    execute: async function ({ location }) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { weather: 'Sunny', temperature: 75, location };
    },
})

export default async function getTools() {
    return {
        getMembers,
        displayWeather: weatherTool,

    };
}