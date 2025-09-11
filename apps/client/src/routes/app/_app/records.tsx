/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

import { deleteMedia, getMedia } from "~/lib/db/queries";
import { useRouter } from "@tanstack/react-router";

//Step 1-> Upload Media
//Step 2 -> parsing
//Step 3 -> Create Chunks
//Step 4 -> Creating Embeddings
//Step 5 -> Creating Vectors & Saving to db 





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

        <Dialog>
            <DialogTrigger asChild>
                <Button>Upload File</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Add your health records for Knowledge base                          </DialogDescription>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    );
}



export const Route = createFileRoute("/app/_app/records")({
    component: RouteComponent,
    loader: async () => {
        const files = await getMedia();
        return {
            files,
        }
    }
});

function RouteComponent() {
    const { files, } = Route.useLoaderData();



    return <div className="space-y-4 p-4">



        <div className="w-full flex justify-between px-4">
            <div className="flex flex-col gap-2">
                <div className=" text-2xl font-bold">
                    Health Records
                </div>
                <div>
                    Add Health Records to add to your ai Knowledge Base
                </div>
            </div>

            <FileUploadForm />
        </div>
        <FilesTable files={files as any} />
        {files.map((file: any) => (
            <div
                key={file.id}
                className="border rounded-xl p-4 shadow-sm "
            >
                <h2 className="font-semibold text-lg">{file.title}</h2>
                <p className="text-sm text-gray-600">ID: {file.id}</p>
                <p className="text-sm text-gray-600">
                    Size: {(file.size).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-600">Type: {file.type}</p>
                <p className="text-sm text-gray-600">
                    Created: {new Date(Date.parse(file.createdAt)).toLocaleString()
                    }
                </p>

                {file.type === 'application/pdf' ? (
                    <iframe
                        src={file.fileUrl}
                        width="100%"
                        height="600"
                        className="border"
                    ></iframe>
                ) : file.type.startsWith('image/') ? (
                    <img src={file.fileUrl} alt={file.title} className="max-w-full h-auto border" />
                ) : (
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Open File
                    </a>
                )}

                {/* <p>
                    No. of chunks for this file {chunks.filter((e) => e.mediaId === file.id).length}
                </p> */}
            </div>
        ))}

    </div>
}


interface FileItem {
    id: string;
    title: string;
    fileUrl: string;
    type: string;
    size: number;
    createdAt: string;
}

interface FilesTableProps {
    files: FileItem[];

}



export function FilesTable({ files }: FilesTableProps) {

    const router = useRouter()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size (MB)</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files?.map((file) => (
                    <TableRow key={file.id}>
                        <TableCell >{file.title}</TableCell>
                        <TableCell className="capitalize">{file.type}</TableCell>
                        <TableCell>{file.size.toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(file.createdAt), "dd-MM-yyyy")}</TableCell>
                        <TableCell>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => (file.id)}
                                    >
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{file.title}"? This action
                                            cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={async () => {
                                                await deleteMedia({ data: { id: file.id } })
                                                router.invalidate()

                                            }}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}