import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,

});

function RouteComponent() {

  return <div className="p-4">
    <h1 className="text-xl font-bold mb-4">Users</h1>

  </div>
}
