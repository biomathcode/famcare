import { createFileRoute } from "@tanstack/react-router";


import { getEvents, getMembers } from "~/lib/db/queries";

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




export const Route = createFileRoute("/app/_app/home")({
    component: RouteComponent,
    loader: async () => {
        const members = await getMembers()
        const events = await getEvents()
        return {
            members,
            events
        }
    },
});

function RouteComponent() {
    const { members,
        events } = Route.useLoaderData();

    return <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Members</h1>
        <div>
            {JSON.stringify(members)}
            <div>
                {members.map((e) => {
                    return (
                        <div key={e.id}>
                            {e.name}
                        </div>
                    )
                })}
            </div>
        </div>
        <div>
            Events:
            {JSON.stringify(events)}
        </div>
        <ul className="space-y-2">

        </ul>
    </div>
}
