'use client';
import type { CoreUserMessage } from 'ai';
import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

import { generateTitleFromUserMessage } from '@/app/(chat)/actions';
import { ChatHeader } from '@/components/custom/chat-header';
import {} from '@/components/custom/message';

import { MultimodalInput } from './multimodal-input';
import type { Chats } from './sidebar-history';
import { Messages } from './messages';

export function Chat({
  id,
  selectedModelId,
}: {
  id: string;
  selectedModelId: string;
}) {
  const [history, setHistory] = useLocalStorage<Chats>(
    `chats`,
    { chats: [] },
    {
      initializeWithValue: false,
    },
  );
  const previousMessagesLengthRef = useRef(0);
  const saveChatRef = useRef(false);
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
  } = useChat({
    body: { id, modelId: selectedModelId },
    initialMessages:
      history?.chats.find((chat) => chat.id === id)?.messages || [],
    streamProtocol: 'text',
    onError: (error) => {
      console.error(error);
      toast.error(`Something went wrong`);
    },
    onFinish: () => {
      saveChatRef.current = true;
    },
  });

  // TODO: This is a hacky way to update the history, but it works for now
  // When the messages change, update the history
  useEffect(() => {
    const updateHistory = async () => {
      // Skip if messages are empty or haven't actually changed
      if (!messages || messages.length === 0) return;
      if (!saveChatRef.current) return;
      if (messages.length === previousMessagesLengthRef.current) return;

      // Update the refs
      previousMessagesLengthRef.current = messages.length;
      saveChatRef.current = false;

      const existingChat = history.chats.find((chat) => chat.id === id);
      const otherChats = history.chats.filter((chat) => chat.id !== id);

      // Prepare the updated or new chat
      const updatedChat = existingChat
        ? {
            ...existingChat,
            messages,
          }
        : {
            id,
            messages,
            createdAt: new Date(),
            title: await generateTitleFromUserMessage({
              message: messages.find(
                (message) => message.role === 'user',
              ) as CoreUserMessage,
            }),
          };

      setHistory({
        ...history,
        chats: [updatedChat, ...otherChats],
      });
    };

    updateHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history,
    messages,
    saveChatRef.current,
    previousMessagesLengthRef.current,
  ]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader selectedModelId={selectedModelId} />
        <Messages chatId={id} isLoading={isLoading} messages={messages} />
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </>
  );
}
