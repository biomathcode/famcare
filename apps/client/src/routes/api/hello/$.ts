import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/hello/$").methods({
  GET: () => {
    return {
      data: 'hello from GET /api/auth/$'
    }
  },
  POST: () => {
    return {
      data: 'hello from POST /api/auth/$'
    }
  },
});
