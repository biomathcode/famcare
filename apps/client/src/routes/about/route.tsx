import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/about")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 p-2">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard Layout</h1>
        <div className="text-foreground/80 flex items-center gap-2 text-sm max-sm:flex-col">
          this is not protected route
          <pre className="bg-card text-card-foreground rounded-md border p-1">
            routes/dashboard/route.tsx
          </pre>
        </div>

        <Button type="button" asChild className="w-fit" size="lg">
          <Link to="/">Back to index</Link>
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
