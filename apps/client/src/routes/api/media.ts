import { createFileRoute } from "@tanstack/react-router";
import { createServerFileRoute, createServerRoute } from "@tanstack/react-start/server";
import { fileTypeFromBuffer } from 'file-type';
import { convertToModelMessages, generateText } from 'ai'


import { v2 as cloudinary } from "cloudinary";
import { media, mediaChunks } from '@/lib/db/schema';

import { db } from "@/lib/db";
import { nanoid } from "nanoid";

import { createOpenAICompatible } from '@ai-sdk/openai-compatible'




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});


const moonshotai = createOpenAICompatible({
    apiKey: process.env.MOONSHOTAI_API_KEY!,
    name: 'moonshotai',
    baseURL: 'https://api.moonshot.ai/v1',
})


export const ServerRoute = createServerFileRoute("/api/media").methods({
    GET: async () => {

        const allMedia = await db.select().from(media);
        return new Response(JSON.stringify(allMedia), { status: 200 });


    },
    POST: async ({ request }) => {

        console.log('request', request);

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const userId = formData.get("userId") as string;




        if (!file || !title || !userId) {
            return new Response(JSON.stringify({ error: "Missing fields" }), {
                status: 400,
            });
        }

        // Upload file buffer to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadRes = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ resource_type: "auto" }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                })
                .end(buffer);
        });

        console.log('uploadRes', uploadRes);


        const mediaId = nanoid(36);

        // Save to DB
        await db.insert(media).values({
            id: mediaId,
            userId,
            title,
            fileUrl: uploadRes.secure_url,
            type: uploadRes.format,
            size: uploadRes.bytes / (1024 * 1024), // convert to MB
        });

        const detectedType = await fileTypeFromBuffer(buffer);

        let contentText = "";

        if (detectedType?.mime.startsWith('image/')) {
            // Extract text from image using Kimi Vision Model
            const imageBase64 = `data:${detectedType.mime};base64,${buffer.toString('base64')}`;


            const model = moonshotai("moonshot-v1-8k-vision-preview");

            const { text } = await generateText({
                model,
                messages: [

                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Extract and return all readable text from the image." },
                            { type: "image", image: imageBase64 },
                        ],
                    },
                ],
                system: `You are Vision model, Your Task is to get the image annotate, give image summary and get all text from the image`
            });

            console.log("text from the image", text)

            contentText = text;

        } else if (detectedType?.mime === 'application/pdf') {
            // Fetch PDF as text
            const result = await fetch(uploadRes.secure_url);
            contentText = await result.text();
        } else {
            return new Response(JSON.stringify({ error: "Unsupported file type" }), { status: 400 });
        }




        const segmentsResult = await fetch(`https://segment.jina.ai`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.JINA_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: contentText,
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



        console.log('mediaId', mediaId, segmentsData, embeddingsData);


        const values = embeddingsData.data.map((embedding, index) => ({
            mediaId,
            chunk: segmentsData.chunks[embedding.index],
            embedding: embedding.embedding,
            order: index,
        }));

        await db.insert(mediaChunks).values(values);
        console.log('Inserted chunks:', values.length);


        return new Response(
            JSON.stringify({ success: true, fileUrl: uploadRes.secure_url }),
            { status: 200 }
        );
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
