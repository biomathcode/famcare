import { tool } from "ai";
import { z } from "zod";
import { db } from "~/lib/db";
import { diet, event, exerciseGoal, mediaChunks, medicine } from "~/lib/db/schema";
import { sql } from "drizzle-orm";
import { getMembers as getAllMembers, getDiets as getAllDeits, getExerciseGoals, getSleepGoals, getMedicines as getAllMedicines, } from "~/lib/db/queries";



const getMembers = tool({
    description: "Use this tool to get all members from the database",
    inputSchema: z.object({}),
    execute: async () => {
        console.log("Tool getMembers called ✅");
        const members = await getAllMembers();
        console.log('members', members)
        return JSON.parse(JSON.stringify(members));
    }
})

const getDiets = tool({
    description: "Use this tool to get all the diets from the database",
    inputSchema: z.object({}),
    execute: async () => {
        const diets = await getAllDeits();
        return JSON.stringify(diets);
    }
})


const getExercises = tool({
    description: "Use this tool to get all the exercises from the database",
    inputSchema: z.object({}),
    execute: async () => {
        const exercise = await getExerciseGoals();
        return JSON.stringify(exercise);
    }
})


const getMedicine = tool({
    description: "Use this tool to get all the medicines from the database",
    inputSchema: z.object({}),
    execute: async () => {
        const exercise = await getAllMedicines();
        return JSON.stringify(exercise);
    }
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
            return await db
                .insert(exerciseGoal)
                .values({
                    userId, // ✅ injected from auth context
                    memberId,
                    type,
                    target,
                    unit,
                })
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


            console.log('diet', memberId, mealType, description, calories);

            try {

                return await db
                    .insert(diet)
                    .values({
                        userId, // from auth context
                        memberId,
                        mealType,
                        description,
                        calories,
                    })

            } catch (e) {
                console.error('Error in createDietTool', e);
            }

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
        }),
        execute: async ({ memberId, name, description }) => {
            console.log("Tool createMedicine called ✅");

            return await db
                .insert(medicine)
                .values({
                    userId, // injected from auth context
                    memberId,
                    name,
                    description,
                })


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



const eventColorEnum = z.enum(["blue", "orange", "violet", "rose", "emerald"]);
const visibilityEnum = z.enum(["public", "private"]);

export const createEventsTool = (userId: string) =>
    tool({
        description: "Create a new event for a member",
        inputSchema: z.object({
            memberId: z.string().describe("The ID of the member"),
            title: z.string().describe("Title of the event"),
            description: z.string().describe("Detailed description of the event"),
            startTime: z.string().describe("yyyy-MM-dd HH:mm:ss formate of event start time"),
            endTime: z.string().describe("yyyy-MM-dd HH:mm:ss formate of event end time"),
            allDay: z.boolean().optional().describe("Is this an all-day event"),
            visibility: visibilityEnum
                .optional()
                .default("private")
                .describe("Event visibility (public or private)"),
            location: z.string().optional().default("").describe("Event location"),
            color: eventColorEnum
                .optional()
                .default("blue")
                .describe("Color for event display"),
        }),
        execute: async ({
            memberId,
            title,
            description,
            startTime,
            endTime,
            visibility,
            location,
            color,
        }) => {
            console.log("Tool createEvents called ✅", {
                memberId,
                title,
                description,
                startTime,
                endTime,
                visibility,
                location,
                color,
            });



            const eventData = {
                userId,       // Injected from auth context
                memberId,
                title,
                description,
                startTime,  // Correct IST format
                endTime,
                visibility,
                location,
                color,
            };

            console.log("eventdata after parsing", eventData)

            try {
                const newEvent = await db.insert(event).values(eventData);
                return newEvent;
            } catch (error) {
                console.error("Error in createEventsTool:", error);
                throw new Error("Failed to create event");
            }
        },
    });


export const createBulkEventsTool = (userId: string) =>
    tool({
        description: "Create multiple events for a member in bulk",
        inputSchema: z.object({
            events: z.array(
                z.object({
                    memberId: z.string().describe("The ID of the member"),
                    title: z.string().describe("Title of the event"),
                    description: z.string().describe("Detailed description of the event"),
                    startTime: z.string().describe("yyyy-MM-dd HH:mm:ss format of event start time"),
                    endTime: z.string().describe("yyyy-MM-dd HH:mm:ss format of event end time"),
                    allDay: z.boolean().optional().describe("Is this an all-day event"),
                    visibility: visibilityEnum
                        .optional()
                        .default("private")
                        .describe("Event visibility (public or private)"),
                    location: z.string().optional().default("").describe("Event location"),
                    color: eventColorEnum
                        .optional()
                        .default("blue")
                        .describe("Color for event display"),
                })
            ).describe("Array of event objects to create"),
        }),
        execute: async ({ events }) => {
            console.log(`Creating ${events.length} events in bulk ✅`);

            const eventsData = events.map((e) => ({
                userId,           // Injected from auth context
                memberId: e.memberId,
                title: e.title,
                description: e.description,
                startTime: e.startTime,
                endTime: e.endTime,
                visibility: e.visibility,
                location: e.location,
                color: e.color,
            }));

            console.log("Prepared events data:", eventsData);

            try {
                const insertedEvents = await db.insert(event).values(eventsData);
                return insertedEvents;
            } catch (error) {
                console.error("Error in createBulkEventsTool:", error);
                throw new Error("Failed to create bulk events");
            }
        },
    });

export default async function getTools(ctx: { userId: string }) {
    return {
        getMembers,
        getDiets,
        getExercises,
        getMedicine,

        getDrugLabel: getDrugLabelTool,
        getAdverseEvents: getAdverseEventsTool,
        getDrugRecalls: getDrugRecallsTool,
        createExerciseGoal: createExerciseGoalTool(ctx.userId),
        createDietTool: createDietTool(ctx.userId),
        createMedicineTool: createMedicineTool(ctx.userId),
        findRelevantContent: findRelevantContent,
        createEvents: createEventsTool(ctx.userId),
        createBulkEventsTool: createBulkEventsTool(ctx.userId),
    };
}

