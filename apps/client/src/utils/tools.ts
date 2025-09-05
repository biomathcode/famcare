import { tool } from "ai";
import { z } from "zod";
import { api } from "~/lib/api";
import { db } from "~/lib/db";
import { exerciseGoal } from "~/lib/db/schema";

//TODO: Add tools for getting data from openFDA
//TODO: Add tools for save diet, exercise, sleep, medicines plan for members
//TODO: 


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


export const createExerciseGoalTool = (userId: string) =>
    tool({
        description: "Create an exercise goal for a member",
        inputSchema: z.object({
            memberId: z.string(),
            type: z.string(),
            target: z.number(),
            unit: z.string(),
        }),
        execute: async ({ memberId, type, target, unit }) => {
            const [inserted] = await db
                .insert(exerciseGoal)
                .values({
                    userId, // ✅ injected from auth context
                    memberId,
                    type,
                    target,
                    unit,
                })
            return inserted
        },
    })





export default async function getTools(ctx: { userId: string }) {
    return {
        getMembers,
        displayWeather: weatherTool,
        createExerciseGoal: createExerciseGoalTool(ctx.userId),

    };
}