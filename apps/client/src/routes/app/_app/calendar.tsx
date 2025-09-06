import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/calendar")({
  component: RouteComponent,
});
import BigCalendar from "@/components/big-calendar";
import { CalendarProvider } from "@/components/event-calendar/calendar-context";


function RouteComponent() {


  return <div>
    <CalendarProvider>
      <BigCalendar />

    </CalendarProvider>
  </div>;
}
