import { AppSidebar } from "~/components/common/app-sidebar";
import { SiteHeader } from "~/components/common/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Toaster } from "~/components/ui/sonner";
import { CalendarProvider } from "~/components/event-calendar/calendar-context";

export const Route = createFileRoute("/app/_app")({
    component: RouteComponent,
    beforeLoad: async ({ context }) => {
        if (!context.user) {
            throw redirect({ to: "/login" });
        }
    },

});
function RouteComponent() {


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
                <CalendarProvider>

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
                </CalendarProvider>

            </SidebarProvider>
        </div>
    );
}
