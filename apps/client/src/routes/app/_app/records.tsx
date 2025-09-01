import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from '@tanstack/react-start';
import FileUpload from "~/components/file-upload";
import FileUploadTwo from "~/components/file-upload-two";
import OCRDemo from "~/components/ocr";
import { useState } from "react";

//TODO add document upload using 
// pnpm dlx shadcn@latest add https://originui.com/r/comp-549.json


function FileUploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);


    const context = Route.useRouteContext();

    const user = context.user;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("userId", user?.id ||
            ' '
        ); // Replace with logged-in userId

        const res = await fetch("/api/media", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setLoading(false);

        if (data.fileUrl) {
            setUploadedUrl(data.fileUrl);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter file title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-lg p-2"
                />

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>

            {uploadedUrl && (
                <div className="mt-4">
                    <p className="text-green-600">✅ Uploaded successfully!</p>
                    <a
                        href={uploadedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        View File
                    </a>
                </div>
            )}
        </div>
    );
}




const getFiles = createServerFn({ method: "GET" }).
    handler(async () => {
        const res = await fetch('http://localhost:3000/api/media');
        // Make sure to use the correct absolute URL or use fetch from server context
        if (!res.ok) throw new Error('Failed to fetch files');
        const files = await res.json();
        return { files };
    });

export const Route = createFileRoute("/app/_app/records")({
    component: RouteComponent,
    loader: async () => {

        return await getFiles();


    }
});

function RouteComponent() {
    const { files } = Route.useLoaderData();



    return <div className="space-y-4 p-4">
        <FileUploadTwo />


        <OCRDemo />


        <div>
            <FileUploadForm />
        </div>
        {files.map((file: any) => (
            <div
                key={file.id}
                className="border rounded-xl p-4 shadow-sm bg-white"
            >
                <h2 className="font-semibold text-lg">{file.filename}</h2>
                <p className="text-sm text-gray-600">ID: {file.id}</p>
                <p className="text-sm text-gray-600">
                    Size: {(file.bytes / 1024).toFixed(2)} KB
                </p>
                <p className="text-sm text-gray-600">Type: {file.file_type}</p>
                <p className="text-sm text-gray-600">
                    Created: {new Date(file.created_at * 1000).toLocaleString()}
                </p>
                <p
                    className={`text-sm font-medium ${file.status === "ok" ? "text-green-600" : "text-red-600"
                        }`}
                >
                    Status: {file.status}
                </p>
            </div>
        ))}

    </div>
}
