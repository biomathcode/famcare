import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from '@tanstack/react-start';
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import {
    Message,
    MessageContent,
} from '@/components/ai-elements/message';

import {
    Reasoning,
    ReasoningContent,
    ReasoningTrigger,
} from '@/components/ai-elements/reasoning';

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
    const rows = await api.chatMessages.findAll();

    return rows
        .filter((row) => row.sessionId === data.sessionId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
});




export const Route = createFileRoute("/app/_app/chat/$chatId")({
    component: Chat,
    loader: async ({ params }) => {
        const chats = await getChatMessages({ data: { sessionId: params.chatId } });
        return { chats };
    }
});


const models = [
    { id: 'kimi-k2-0711-preview', name: 'Kimi-k2' },
    // { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
];

function safeJSONParse(str: string) {
    try {
        return JSON.parse(str);
    } catch {
        return { message: { parts: [{ type: "text", text: str }] } }; // fallback if it's just raw text
    }
}

export default function Chat() {

    const [text, setText] = useState<string>('');
    const [model, setModel] = useState<string>(models[0].id);


    const context = Route.useRouteContext();
    const { chatId } = Route.useParams();


    const user = context.user;

    const { chats } = Route.useLoaderData<{ chats: any[] }>(); // ✅ get from loader

    console.log("chats", chats,)





    // 🔹 Transform DB chats into useChat format
    const initialMessages = chats.map((c) => {

        const message = safeJSONParse(c.content);

        console.log('message', message);

        const parts = message.message.parts;

        console.log('parts', parts);
        return {
            id: c.id,
            role: c.role,
            parts: parts,
        }
    });

    console.log("initialMessage", initialMessages)

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
                                    console.log("parts", part)
                                    switch (part.type) {
                                        case 'text':
                                            return <Response key={`${role}-${i}`}>{part.text}</Response>;

                                        case 'tool-findRelevantContent':
                                            switch (part.state) {
                                                case 'input-available':
                                                    return <div key={index}>Scanning documents...</div>;
                                                case 'output-available':
                                                    return <Response key={`${role}-${i}`}>{part.text}</Response>
                                                case 'output-error':
                                                    return <div key={index}>Error: {part.errorText}</div>;
                                                default:
                                                    return null;

                                            }


                                        default:
                                            return null;

                                    }
                                })}
                            </MessageContent>
                        </Message>
                    ))}
                </ConversationContent>
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
                <ConversationScrollButton className="bottom-40" />
            </Conversation>


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


