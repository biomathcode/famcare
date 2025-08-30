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

  console.log('chatSession', chatSession)

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">

        {
          chatSession.map((e) => <Link
            to="/app/chat/$chatId"

            params={{ chatId: e.id }}
            key={e.id}>{e.title}</Link>)
        }
      </div>


    </div>
  )
}


