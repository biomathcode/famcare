import { createServerFileRoute } from "@tanstack/react-start/server";
import { json } from '@tanstack/react-start'
import { getPdfContentFromUrl } from "~/lib/utils";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embedMany } from "ai";
import { json } from '@tanstack/react-start'
import { openai } from "@ai-sdk/openai";


export const ServerRoute = createServerFileRoute('/api/hello').methods({
  GET: async () => {

    return json({ message: `Hello, ` });
  },
  POST: async () => {

    //TODO: check for auth
    //TODO: Validate the data
    //TODO: store the file in cloud storage
    //TODO: 

    const downloadUrl = "https://arxiv.org/pdf/2305.10403.pdf";

    const content = await getPdfContentFromUrl(downloadUrl);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const chunkedContent = await textSplitter.createDocuments([content]);

    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: chunkedContent.map((chunk) => chunk.pageContent),
    });

    //    await insertChunks({
    //   chunks: chunkedContent.map((chunk, i) => ({
    //     id: `${user.email}/${filename}/${i}`,
    //     filePath: `${user.email}/${filename}`,
    //     content: chunk.pageContent,
    //     embedding: embeddings[i],
    //   })),
    // });
    return json({ message: `Hello, ` });
  }
})