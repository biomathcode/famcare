// src/routes/api/upload.ts
import { createServerFileRoute } from "@tanstack/react-start/server";
import { json } from "@tanstack/react-start";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const ServerRoute = createServerFileRoute("/api/upload").methods({
    POST: async ({ request }) => {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convert file to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result = await new Promise<cloudinary.UploadApiResponse>(
            (resolve, reject) => {
                cloudinary.v2.uploader
                    .upload_stream(
                        { folder: "profiles", resource_type: "image" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result!);
                        }
                    )
                    .end(buffer);
            }
        );

        return json({ url: result.secure_url });
    },
});
