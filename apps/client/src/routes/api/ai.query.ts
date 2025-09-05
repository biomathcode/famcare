// src/routes/api/search.ts
import { createServerFileRoute } from "@tanstack/react-start/server";
import { json } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { mediaChunks } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { generateText } from "ai";

// Init Moonshot client via OpenAI SDK

const moonshotai = createOpenAICompatible({
  apiKey: process.env.MOONSHOTAI_API_KEY!,
  name: 'moonshotai',
  baseURL: 'https://api.moonshot.ai/v1',

})

export const ServerRoute = createServerFileRoute("/api/ai/query").methods({
  POST: async ({ request }) => {
    const body = await request.json();
    const { query } = body as { query: string };

    if (!query) {
      return json({ error: "Missing query" }, { status: 400 });
    }

    // 1. Get query embedding from Jina
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
        input: [query],
      }),
    });

    const embeddingsData = await embeddingsResult.json();
    const queryEmbedding = embeddingsData.data[0].embedding as number[];

    // 2. Build CAST for TiDB vector search
    const embeddingLiteral = `CAST('[${queryEmbedding.join(",")}]' AS VECTOR(768))`;

    // 3. Similarity search
    const rows = await db.execute(
      sql/*sql*/ `
        SELECT 
          id,
          media_id,
          chunk,
          \`order\`,
          vec_cosine_distance(embedding, ${sql.raw(embeddingLiteral)}) AS distance
        FROM ${mediaChunks}
        ORDER BY distance
        LIMIT 3
      `
    );


    const chunks = (rows[0] as any[]).map((r) => r.chunk).join("\n\n");

    console.log("Search rows:", rows[0], chunks);


    const model = moonshotai('kimi-k2-0711-preview')

    const { text } = await generateText({
      model,

      prompt: query,
      system: `You are an question answer assistant. 
  Context:\n${chunks}\n\n
  `,
    });

    // // 4. Call Moonshot (OpenAI SDK)
    // const completion = await moonshotai.chat.completions.create({
    //   model: "moonshot-v1-8k'", // replace with the correct model name
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are an assistant that answers questions using provided context.",
    //     },
    //     {
    //       role: "user",
    //       content: `Context:\n${chunks}\n\nQuestion: ${query}`,
    //     },
    //   ],
    //   temperature: 0.2,
    // });

    // const answer = completion.choices[0]?.message?.content;

    return json({
      query,
      answer: text,
      // sources: rows, // return top chunks for debugging
    });
  },
});
