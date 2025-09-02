import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/query")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/api/ai/query"!</div>;
}
