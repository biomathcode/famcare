import { createFileRoute } from "@tanstack/react-router";
import BigCalendar from "@/components/big-calendar";
import { CalendarProvider } from "@/components/event-calendar/calendar-context";
import { LoadingScreen } from "~/components/loading-screen";
import { getEvents } from "~/lib/db/queries";


export const Route = createFileRoute("/app/_app/calendar")({
  component: RouteComponent,
  loader: async () => {
    const event = await getEvents()
    return { event };
  },
  pendingComponent: LoadingScreen
});



function RouteComponent() {
  const { event } = Route.useLoaderData();

  console.log("events", event);

  return <div>
    <CalendarProvider>
      <BigCalendar />

    </CalendarProvider>
  </div>;
}
