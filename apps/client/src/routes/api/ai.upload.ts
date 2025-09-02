import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/upload")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/api/ai/upload"!</div>;
}
