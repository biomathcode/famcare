import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from '@tanstack/react-start';
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import {
    Message,
    MessageContent,
} from '@/components/ai-elements/message';

import { GlobeIcon, MicIcon } from 'lucide-react';


import {
    PromptInput,
    PromptInputButton,
    PromptInputModelSelect,
    PromptInputModelSelectContent,
    PromptInputModelSelectItem,
    PromptInputModelSelectTrigger,
    PromptInputModelSelectValue,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
} from '@/components/ai-elements/prompt-input';

import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Response } from "~/components/ai-elements/response";
import { Loader } from "~/components/ai-elements/loader";
import { api } from "~/lib/api";


export const saveChat = createServerFn<{ data: { userId: string; sessionId: string; role: string; content: string } }>().handler(async ({ data }) => {
    await api.chatMessages.create({
        role: data.role,
        content: data.content,
        sessionId: data.sessionId,
        userId: data.userId,
    });
});

export const getChatMessages = createServerFn().handler(async ({ data }) => {
    return await api.chatMessages.findAll()
        .then(rows => rows.filter(row => row.sessionId === data.sessionId));
});


export const Route = createFileRoute("/app/_app/chat/$chatId")({
    component: Chat,
    loader: async ({ params }) => {
        const chats = await getChatMessages({ data: { sessionId: params.chatId } });
        return { chats };
    }
});


const models = [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
];

export default function Chat() {

    const [text, setText] = useState<string>('');
    const [model, setModel] = useState<string>(models[0].id);


    const context = Route.useRouteContext();
    const { chatId } = Route.useParams();


    const user = context.user;

    const { chats } = Route.useLoaderData<{ chats: any[] }>(); // ✅ get from loader


    // 🔹 Transform DB chats into useChat format
    const initialMessages = chats.map((c) => ({
        id: c.id,
        role: c.role,
        parts: [{ type: "text", text: c.content }],
    }));

    const { messages, sendMessage, status, regenerate, } = useChat({
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: '/api/ai/chat',
        }),

        onFinish: async (message) => {
            console.log('message', message)
            await saveChat({
                data: {
                    userId: user?.id || " ",   // same user
                    sessionId: chatId,
                    role: "assistant",
                    content: JSON.stringify(message),
                }
            });
        },

    })





    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(
            { text: text },
            {
                body: {
                    model: model,
                },
            },
        );
        await saveChat({
            data: {
                userId: user?.id || '', // ← replace with actual auth user id
                sessionId: chatId,
                role: "user",
                content: text,
            }
        });
        setText('');
    };





    return (
        <div className="relative h-full">
            <Conversation className=" h-fit max-h-full pb-96  no-scrollbar  ">
                <ConversationContent>
                    {messages.map(({ role, parts }, index) => (
                        <Message from={role} key={index}>
                            <MessageContent>
                                {parts.map((part, i) => {
                                    switch (part.type) {
                                        case 'text':
                                            return <Response key={`${role}-${i}`}>{part.text}</Response>;
                                    }
                                })}
                            </MessageContent>
                        </Message>
                    ))}
                </ConversationContent>
            </Conversation>
            {
                status === 'submitted' && (
                    <Message from="assistant">
                        <MessageContent>
                            <div className="flex items-center gap-2">
                                <Loader />
                                Steaming the Response
                            </div>
                        </MessageContent>
                    </Message>
                )
            }

            <PromptInput onSubmit={handleSubmit} className=" absolute bottom-0  mt-4  ">
                <PromptInputTextarea
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <PromptInputToolbar>
                    <PromptInputTools>
                        <PromptInputButton>
                            <MicIcon size={16} />
                        </PromptInputButton>
                        <PromptInputButton>
                            <GlobeIcon size={16} />
                            <span>Search</span>
                        </PromptInputButton>
                        <PromptInputModelSelect
                            onValueChange={(value) => {
                                setModel(value);
                            }}
                            value={model}
                        >
                            <PromptInputModelSelectTrigger>
                                <PromptInputModelSelectValue />
                            </PromptInputModelSelectTrigger>
                            <PromptInputModelSelectContent>
                                {models.map((model) => (
                                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                                        {model.name}
                                    </PromptInputModelSelectItem>
                                ))}
                            </PromptInputModelSelectContent>
                        </PromptInputModelSelect>
                    </PromptInputTools>
                    <PromptInputSubmit disabled={!text} status={status} />
                </PromptInputToolbar>
            </PromptInput>
        </div >
    )
}


