import { createFileRoute } from "@tanstack/react-router";

import { createServerFn } from '@tanstack/react-start'

import { api } from "@/lib/api";

// UI Elements 
// Total Members
// Health Records
// Upcoming Events
// 


export const getUsers = createServerFn().handler(async () => {
    const users = await api.users.findAll();
    return users;
});

export const Route = createFileRoute("/app/_app/home")({
    component: RouteComponent,
    loader: async () => {
        const users = await getUsers();
        return { users };
    },
});

function RouteComponent() {
    const { users } = Route.useLoaderData();

    return <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Users</h1>
        <ul className="space-y-2">
            {users.map((user) => (
                <li key={user.id} className="p-2 border rounded">
                    {user.name} ({user.email})
                </li>
            ))}
        </ul>
    </div>
}
