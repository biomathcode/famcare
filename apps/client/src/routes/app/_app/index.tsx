import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
  beforeLoad: () => {

  }
});

function RouteComponent() {
  return <div>Hello "/app/_app/"!</div>;
}
