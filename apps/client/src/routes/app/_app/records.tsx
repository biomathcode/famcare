import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from '@tanstack/react-start';


const getFiles = createServerFn({ method: "GET" }).
    handler(async () => {
        const res = await fetch('http://localhost:3000/api/upload/file');
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
