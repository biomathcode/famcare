import { tool } from "ai";
import { z } from "zod";



const recommendGuitar = tool({
    description: "Use this tool to recommend a guitar to the user",
    inputSchema: z.object({
        id: z.string().describe("The id of the guitar to recommend"),
    }),
    execute: async ({ id }) => {
        return {
            id,
        };
    },
});

export default async function getTools() {
    return {

        recommendGuitar,
    };
}