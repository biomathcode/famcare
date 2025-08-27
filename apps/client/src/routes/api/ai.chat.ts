import { createServerFileRoute } from '@tanstack/react-start/server'
import { anthropic } from '@ai-sdk/anthropic'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

import getTools from '@/utils/tools'

const SYSTEM_PROMPT = `You are a helpful assistant for a store that sells guitars.

You can use the following tools to help the user:

- getGuitars: Get all guitars from the database
- recommendGuitar: Recommend a guitar to the user
`

const moonshotai = createOpenAICompatible({
    apiKey: process.env.MOONSHOTAI_API_KEY!,
    name: 'moonshotai',
    baseURL: 'https://api.moonshot.ai/v1'
})

export const ServerRoute = createServerFileRoute('/api/ai/chat').methods({
    POST: async ({ request }) => {
        try {
            const { messages } = await request.json()

            const tools = await getTools()

            const result = await streamText({
                model: anthropic('claude-3-5-sonnet-latest'),
                messages: convertToModelMessages(messages),
                temperature: 0.7,
                stopWhen: stepCountIs(5),
                system: SYSTEM_PROMPT,
                tools,
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