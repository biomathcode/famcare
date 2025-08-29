import { AppSidebar } from "~/components/common/app-sidebar";
import { SiteHeader } from "~/components/common/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Toaster } from "~/components/ui/sonner";

export const Route = createFileRoute("/app/_app")({
    component: RouteComponent,
    beforeLoad: async ({ context }) => {
        if (!context.user) {
            throw redirect({ to: "/login" });
        }
    },
    loader: async () => {
        const res = await fetch("/api/hello"); // call your server route
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    }
});
function RouteComponent() {
    const data = Route.useLoaderData();

    console.log("data from api", data)

    return (
        <div className="h-screen overflow-hidden flex">
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset className="flex flex-col w-full">
                    <SiteHeader />
                    <div className="flex-1 overflow-auto @container/main">
                        <div className="flex flex-col   h-full">
                            <Outlet />
                            <Toaster />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
