import { createFileRoute } from "@tanstack/react-router";
import { AgendaView, CalendarEvent, EventColor } from "~/components/event-calendar";
import authClient from "~/lib/auth/auth-client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

import { getEvents, getMedia, getMembers, getSleepGoals } from "~/lib/db/queries";
import { FilesTable } from "./records";
import { RadialSleepChart, SleepCycleSummary } from "./sleep";

// UI Elements 
// Total Members
// Health Records
// Upcoming Events
// 

//TODO: Show the List of Members
//TODO: Show Upcoming Events
//TODO: Show Sleep Cycles
//TODO: Show Medicines
//TODO: Show Records



//TODO: Add the Agent List view here
//TODO: Add What to cook for today
//TODO list of member
//TODO: Start AI Chart
//Todo: Upload Document

export function MembersTable({ members }: { members: any[] }) {
    return (
        <div className="max-w-3xl overflow-auto w-full border rounded-lg  flex flex-col justify-between bg-accent">
            <div className="text-md font-semibold h-10 border-b py-2 px-4">
                List Of Members
            </div>
            <Table className="mt-4 p-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Relation</TableHead>
                        <TableHead>DOB</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((e) => (
                        <TableRow key={e.id}>
                            <TableCell>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        {e.imageUrl ? (
                                            <AvatarImage src={e.imageUrl} alt={e.name} />
                                        ) : (
                                            <AvatarFallback>{e.name[0]}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span>{e.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{e.relation}</TableCell>
                            <TableCell>{e.dob ? format(new Date(e.dob), "dd MMM yyyy") : "N/A"}</TableCell>
                            <TableCell>{e.gender || "N/A"}</TableCell>
                            <TableCell>{format(new Date(e.createdAt), "dd MMM yyyy")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}


export const Route = createFileRoute("/app/_app/home")({
    component: RouteComponent,
    loader: async () => {
        const members = await getMembers()
        const events = await getEvents()
        const files = await getMedia();
        const goals = await getSleepGoals();


        return {
            members,
            events,
            files,
            goals
        }
    },
});

function RouteComponent() {
    const { members,
        events, files, goals } = Route.useLoaderData();

    const { data: session } = authClient.useSession();


    const newEvents: CalendarEvent[] = (events as any[]).map((e, ind) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start: new Date(e.startTime),  // Assuming backend sends startTime as ISO string
        end: new Date(e.endTime),      // Likewise for endTime
        allDay: e.allDay ?? false,
        color: e.color as EventColor,
        location: e.location,
    }));

    return <div className="px-10 py-4 h-fit w-full flex flex-col gap-8">
        <h1 className="text-xl font-bold ">Dashboard, Welcome {session?.user?.name}</h1>
        <div className="flex  justify-around gap-10 w-full ">
            <div className=" max-h-[400px]  h-full overflow-scroll no-scrollbar flex flex-col  border rounded-md w-full ">
                <div className=" sticky top-0 py-2 px-2 bg-accent z-10 text-md font-semibold ">
                    Upcoming Events
                </div>

                <AgendaView
                    currentDate={new Date()}
                    events={newEvents}
                    onEventSelect={() => { }}

                />
            </div>

            <div className=" max-h-[400px]  h-full overflow-scroll no-scrollbar flex flex-col  border rounded-md w-full ">
                <div className=" sticky top-0 py-2 px-2 bg-accent z-10 text-md font-semibold ">
                    Uploaded Files
                </div>
                <FilesTable files={files as any} />
            </div>






        </div>
        <div className="flex  justify-around gap-10 w-full  ">
            <div className=" w-full ">
                <MembersTable members={members} />
            </div>

            {/* <RadialSleepChart data={goals} /> */}
            <div className="w-full border rounded-md ">

                <SleepCycleSummary sleepGoalsData={goals} />
            </div>
        </div>


    </div>
}
