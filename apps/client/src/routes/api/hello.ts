import { createServerFileRoute } from "@tanstack/react-start/server";
import { json } from '@tanstack/react-start'

export const ServerRoute = createServerFileRoute('/api/hello').methods({
    GET: async () => {

        return json({ message: `Hello, ` });
    },
})