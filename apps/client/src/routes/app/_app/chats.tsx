import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from '@tanstack/react-start';
import { api } from "~/lib/api";

export const getChatSessions = createServerFn().handler(async () => {
  const chatSessions = await api.chatSession.findAll();
  return chatSessions;
});

export const Route = createFileRoute("/app/_app/chats")({
  component: Chat,
  loader: async () => {
    const chatSession = await getChatSessions();
    return { chatSession };
  }
});

export default function Chat() {
  const { chatSession } = Route.useLoaderData();

  return (
    <div className="relative max-w-lg mx-auto mt-10">
      <div className="flex flex-col gap-4">
        {chatSession.length === 0 ? (
          <div className="text-gray-500 text-center py-8 border rounded-lg bg-gray-50">
            No chat sessions found.
          </div>
        ) : (
          chatSession.map((e) => (
            <Link
              to="/app/chat/$chatId"
              params={{ chatId: e.id }}
              key={e.id}
              className=""
            >
              <div className="font-semibold text-lg ">{e.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {e.updatedAt ? `Last updated: ${new Date(e.updatedAt).toLocaleString()}` : ""}
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
