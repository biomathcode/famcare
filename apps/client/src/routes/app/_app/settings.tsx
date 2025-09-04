import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/settings")({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Health Management - Settings',
            },
        ],
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return <div>
        <h1>Settings</h1>
    </div>;
}
