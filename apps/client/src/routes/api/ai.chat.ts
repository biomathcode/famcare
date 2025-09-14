import { createServerFileRoute } from '@tanstack/react-start/server'
import { convertToModelMessages, stepCountIs, streamText, } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

import getTools from '@/utils/tools'
import { auth } from '~/lib/auth/auth'

//TODO: Add Events

const SYSTEM_PROMPT = `You are a helpful health care management assistant.

For Creating Events 
always use 24 hour formate for event creation.
type: "Diet" use color: "emerald"
type: "Medicine" use color: "orange"
type: "Exercise" use color: "violet"
type: "Sleep" use color: "blue" 
type: "Activity" use color: "rose"
   
You can use the following tools to help the user:

- getMembers: Use this tool to get all members from the database
- createExerciseGoalTool: Use this tool to create an exercise goal for a member
- createDietTool: Use this tool to create a diet plan for a member
- createMedicine: Use this tool to log a medicine entry for a member
- getDrugLabel: view drug labeling info
- getAdverseEvents: lookup reported side effects
- getDrugRecalls: check recall or enforcement reports
- findRelevantContent: Use this tool to find relevant content from the database
-createBulkEventsTool: Use this tool to create events in bulk or than one event


`

const moonshotai = createOpenAICompatible({
    apiKey: process.env.MOONSHOTAI_API_KEY!,
    name: 'moonshotai',
    baseURL: 'https://api.moonshot.ai/v1',
})

export const ServerRoute = createServerFileRoute('/api/ai/chat').methods({
    POST: async ({ request }) => {
        try {
            const { messages } = await request.json()

            const session = await auth.api.getSession({ headers: request.headers });

            if (!session) {
                throw new Response("Unauthorized", { status: 401 });
            }

            const userId = session.user.id;

            const tools = await getTools({ userId })

            const model = moonshotai('kimi-k2-0711-preview')


            const result = streamText({
                model,
                messages: convertToModelMessages(messages),
                temperature: 0.7,
                // topP: 1,
                stopWhen: stepCountIs(5),
                tools,
                system: SYSTEM_PROMPT,

            })

            return result.toUIMessageStreamResponse()
        } catch (error) {
            console.error('Chat API error:', error)
            return new Response(
                JSON.stringify({ error: 'Failed to process chat request' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        }
    },
})