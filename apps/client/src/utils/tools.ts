import { tool } from "ai";
import { z } from "zod";
import { api } from "~/lib/api";
import { db } from "~/lib/db";
import { diet, exerciseGoal, mediaChunks, medicine } from "~/lib/db/schema";
import { sql } from "drizzle-orm";

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

//“Add breakfast for Ramesh: 2 eggs, toast, and juice (~350 calories).”

//“Log dinner for Sita: paneer curry with rice (~500 calories).”
export const createDietTool = (userId: string) =>
    tool({
        description: "Create a diet entry for a member",
        inputSchema: z.object({
            memberId: z.string().describe("The ID of the member"),
            mealType: z
                .enum(["breakfast", "lunch", "dinner", "snack"])
                .describe("Type of meal"),
            description: z
                .string()
                .describe("Details about the meal (e.g., '2 chapatis with dal and salad')"),
            calories: z.number().optional().describe("Approximate calories for the meal"),
        }),
        execute: async ({ memberId, mealType, description, calories }) => {
            console.log("Tool createDiet called ✅");

            const [inserted] = await db
                .insert(diet)
                .values({
                    userId, // from auth context
                    memberId,
                    mealType,
                    description,
                    calories,
                })
            return inserted;
        },
    });

//“Add Paracetamol 500mg for Sita, dosage 1 pill twice daily for fever.”
//“Log Vitamin D drops for Ramesh, 5ml once a day.”
export const createMedicineTool = (userId: string) =>
    tool({
        description: "Log a medicine for a member",
        inputSchema: z.object({
            memberId: z.string().describe("The ID of the member"),
            name: z.string().describe("The name of the medicine"),
            description: z.string().optional().describe("Details about the medicine (e.g., purpose, instructions)"),
            dosage: z.string().describe("Dosage information (e.g., 1 pill, 5ml, twice a day)"),
        }),
        execute: async ({ memberId, name, description, dosage }) => {
            console.log("Tool createMedicine called ✅");

            const [inserted] = await db
                .insert(medicine)
                .values({
                    userId, // injected from auth context
                    memberId,
                    name,
                    description,
                    dosage,
                })


            return inserted;
        },
    });



export const getDrugLabelTool = tool({
    description: "Retrieve labeling info for a drug (adverse reactions, indications, warnings)",
    inputSchema: z.object({
        query: z.string().describe("Drug name, e.g., 'ibuprofen'"),
        limit: z.number().optional().default(1),
    }),
    execute: async ({ query, limit }) => {
        const params = new URLSearchParams({
            search: `openfda.generic_name:${query}`,
            limit: limit.toString(),
            api_key: process.env.OPEN_FDA_API_KEY!,
        });
        const res = await fetch(`https://api.fda.gov/drug/label.json?${params}`);
        return await res.json();
    },
});

export const getAdverseEventsTool = tool({
    description: "Retrieve reported side effects (adverse events) for a drug",
    inputSchema: z.object({
        query: z.string().describe("Drug name or reaction, e.g., 'headache'"),
        limit: z.number().optional().default(5),
    }),
    execute: async ({ query, limit }) => {
        const params = new URLSearchParams({
            search: `reactionmeddrapt:${query}`,
            limit: limit.toString(),
            api_key: process.env.OPEN_FDA_API_KEY!,
        });
        const res = await fetch(`https://api.fda.gov/drug/event.json?${params}`);
        return await res.json();
    },
});

export const getDrugRecallsTool = tool({
    description: "Retrieve drug recall information or enforcement data",
    inputSchema: z.object({
        query: z.string().describe("Drug name, recall reason, etc."),
        limit: z.number().optional().default(5),
    }),
    execute: async ({ query, limit }) => {
        const params = new URLSearchParams({
            search: query,
            limit: limit.toString(),
            api_key: process.env.OPEN_FDA_API_KEY!,
        });
        const res = await fetch(`https://api.fda.gov/drug/enforcement.json?${params}`);
        return await res.json();
    },
});


//ai query
export const findRelevantContent = tool({
    description: `get information from your knowledge base to answer questions.`,
    inputSchema: z.object({
        question: z.string().describe('the users question'),
    }),

    execute: async ({ question }) => {

        console.log('findRelevantContent question', question);

        const embeddingsResult = await fetch("https://api.jina.ai/v1/embeddings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.JINA_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "jina-embeddings-v3",
                task: "retrieval.query",
                dimensions: 768,
                embedding_type: "float",
                input: [question],
            }),
        });

        const embeddingsData = await embeddingsResult.json();
        const queryEmbedding = embeddingsData.data[0].embedding as number[];

        const embeddingLiteral = [JSON.stringify(queryEmbedding)]

        const { rows } = await db.execute(
            sql/*sql*/`
            SELECT 
              id,
              media_id,
              chunk,
              \`order\`,
              vec_cosine_distance(
                embedding,
                ${embeddingLiteral}
              ) AS distance
            FROM ${mediaChunks}
            ORDER BY distance
            LIMIT 5
          `
        );

        const chunks = rows?.map((r) => r.chunk).join("\n\n");


        return chunks;

    }
})




export default async function getTools(ctx: { userId: string }) {
    return {
        getMembers,
        displayWeather: weatherTool,
        createExerciseGoal: createExerciseGoalTool(ctx.userId),
        createDietTool: createDietTool(ctx.userId),
        createMedicineTool: createMedicineTool(ctx.userId),
        getDrugLabel: getDrugLabelTool,
        getAdverseEvents: getAdverseEventsTool,
        getDrugRecalls: getDrugRecallsTool,
        findRelevantContent: findRelevantContent,
    };
}

