import { createFileRoute } from "@tanstack/react-router";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "~/lib/uploadthing";
const handlers = createRouteHandler({ router: uploadRouter });
export const Route = createServerFileRoute("/api/uploadthing").methods({
    GET: handlers,
    POST: handlers,
});