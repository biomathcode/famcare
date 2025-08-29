import { createServerFileRoute } from "@tanstack/react-start/server";
import { json } from '@tanstack/react-start'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import fs from "fs";
import path from "path";
import os from "os";
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.MOONSHOTAI_API_KEY!,
    baseURL: 'https://api.moonshot.ai/v1',

})


export const ServerRoute = createServerFileRoute('/api/upload/file').methods({
    GET: async () => {
        const file_list = await client.files.list()
        return json(file_list.data);
    },
    POST: async ({ request }) => {

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return json({ error: "No file uploaded" }, { status: 400 });
        }

        // Save to temp file so we can stream it
        const tempFilePath = path.join(os.tmpdir(), file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempFilePath, buffer);

        // Upload to Moonshot
        const file_object = await client.files.create({
            file: fs.createReadStream(tempFilePath),
            purpose: "file-extract",
        });

        const file_content = await (
            await client.files.content(file_object.id)
        ).text();

        // Cleanup temp file
        fs.unlinkSync(tempFilePath);

        console.log('file_content', file_content)

        return json({
            role: "system",
            content: file_content,
        });

    }
});