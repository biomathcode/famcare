import { createServerFileRoute } from "@tanstack/react-start/server";
import { json } from '@tanstack/react-start'
import { getPdfContentFromUrl } from "~/lib/utils";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { mediaChunks } from "~/lib/db/schema";
import { db } from "~/lib/db";


export const ServerRoute = createServerFileRoute('/api/ai/upload').methods({
  GET: async () => {

    return json({ message: `Hello, ` });
  },
  POST: async () => {

    //TODO: check for auth
    //TODO: Validate the data
    //TODO: store the file in cloud storage
    //TODO: 

    // const downloadUrl = "https://arxiv.org/pdf/2305.10403.pdf";

    // const content = await getPdfContentFromUrl(downloadUrl);

    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 1000,
    // });
    // const chunkedContent = await textSplitter.createDocuments([content]);

    // const { embeddings } = await embedMany({
    //   model: openai.embedding("text-embedding-3-small"),
    //   values: chunkedContent.map((chunk) => chunk.pageContent),
    // });



    //    await insertChunks({
    //   chunks: chunkedContent.map((chunk, i) => ({
    //     id: `${user.email}/${filename}/${i}`,
    //     filePath: `${user.email}/${filename}`,
    //     content: chunk.pageContent,
    //     embedding: embeddings[i],
    //   })),
    // });
    const url = "https://coolhead.in";

    const result = await fetch(`https://r.jina.ai/${url}`);

    const content = await result.text();
    console.log("Fetched content length:", content.length);


    const segmentsResult = await fetch(`https://segment.jina.ai`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        return_tokens: true,
        return_chunks: true,
        max_chunk_length: 1000,
      }),
    });

    const segmentsData =
      (await segmentsResult.json()) as JinaSegmenterResponse;

    const embeddingsResult = await fetch(
      "https://api.jina.ai/v1/embeddings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "jina-embeddings-v3",
          task: "retrieval.passage",
          late_chunking: true,
          dimensions: 768,
          embedding_type: "float",
          input: segmentsData.chunks,
        }),
      },
    );

    const embeddingsData =
      (await embeddingsResult.json()) as JinaEmbeddingsResponse;

    const mediaId = "9203fd63-869b-11f0-bb4b-9ee057d67487"


    const values = embeddingsData.data.map((embedding, index) => ({
      mediaId,
      chunk: segmentsData.chunks[embedding.index],
      embedding: embedding.embedding,
      order: index,
    }));

    await db.insert(mediaChunks).values(values);
    console.log('Inserted chunks:', values.length);

    return json({ message: "Inserted embeddings", });
  }
})




interface JinaSegmenterResponse {
  num_tokens: number;
  tokenizer: string;
  usage: {
    tokens: number;
  };
  num_chunks: number;
  chunk_positions: [number, number][];
  chunks: string[];
}

interface JinaEmbeddingsResponse {
  model: string;
  object: string;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
  };
  data: {
    object: string;
    index: number;
    embedding: number[];
  }[];
}

interface JinaRerankerResponse {
  model: string;
  usage: {
    total_tokens: number;
  };
  results: {
    index: number;
    document: {
      text: string;
    };
    relevance_score: number;
  }[];
}
