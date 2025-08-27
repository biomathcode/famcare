import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import {
  Message,
  MessageContent,
} from '@/components/ai-elements/message';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';


export const Route = createFileRoute("/app/_app/chats")({
  component: Chat,
});


export default function Chat() {

  const [input, setInput] = useState("");

  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
    }),
  })



  return (
    <div>
      <Conversation>
        <ConversationContent>
          {messages.map(({ role, parts }, index) => (
            <Message from={role} key={index}>
              <MessageContent>
                {parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={`${role}-${i}`}>{part.text}</div>;
                  }
                })}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <div className="flex space-x-3 max-w-xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something clever (or don't, we won't judge)..."
            className="w-full rounded-lg border border-orange-500/20 bg-gray-800/50 pl-4 pr-12 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent resize-none overflow-hidden shadow-lg"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "200px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height =
                Math.min(target.scrollHeight, 200) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage({ text: input });
                setInput("");
              }
            }}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 text-orange-500 hover:text-orange-400 disabled:text-gray-500 transition-colors focus:outline-none"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>{" "}

      </form>
    </div>
  )
}


