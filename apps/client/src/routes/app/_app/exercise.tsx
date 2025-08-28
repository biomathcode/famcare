import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/exercise")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/_app/exercise"!</div>;
}
