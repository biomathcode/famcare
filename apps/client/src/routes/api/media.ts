import { createFileRoute } from "@tanstack/react-router";
import { createServerFileRoute, createServerRoute } from "@tanstack/react-start/server";

import { v2 as cloudinary } from "cloudinary";
import { media } from '@/lib/db/schema';

import { db } from "@/lib/db";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});



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

        // Save to DB
        await db.insert(media).values({
            userId,
            title,
            fileUrl: uploadRes.secure_url,
            type: uploadRes.format,
            size: uploadRes.bytes / (1024 * 1024), // convert to MB
        });

        return new Response(
            JSON.stringify({ success: true, fileUrl: uploadRes.secure_url }),
            { status: 200 }
        );


    }
})

