import { createFileRoute } from "@tanstack/react-router";
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
      {
        chatSession.map((e) => <div key={e.id}>{e.title}</div>)
      }

    </div>
  )
}


