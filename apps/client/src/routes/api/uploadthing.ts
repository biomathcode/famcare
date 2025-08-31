import { createServerFileRoute } from "@tanstack/react-start/server";

import { json } from '@tanstack/react-start'


export const ServerRoute = createServerFileRoute("/api/uploadthing").methods({
    POST: async () => {
        return json({ message: `Hello, ` });
    }

});