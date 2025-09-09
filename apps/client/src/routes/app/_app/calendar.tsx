import { createFileRoute } from "@tanstack/react-router";
import BigCalendar from "@/components/big-calendar";
import { CalendarProvider } from "@/components/event-calendar/calendar-context";
import { LoadingScreen } from "~/components/loading-screen";
import { getEvents } from "~/lib/db/queries";
import { CalendarEvent, EventColor } from "~/components/event-calendar";


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

  const events: CalendarEvent[] = (event as any[]).map((e, ind) => ({
    id: ind,
    title: e.title,
    description: e.description,
    start: new Date(e.startTime),  // Assuming backend sends startTime as ISO string
    end: new Date(e.endTime),      // Likewise for endTime
    allDay: e.allDay ?? false,
    color: e.color as EventColor,
    location: e.location,
  }));

  console.log('events', events)

  return <div>{events &&
    <CalendarProvider>
      <BigCalendar initialEvents={[...events,
      {
        id: "test",
        title: "Test Event",
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000),
        allDay: false,
        color: "blue",
      }
      ]} />

    </CalendarProvider>
  }</div>;
}
