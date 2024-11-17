'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { type CoreUserMessage, generateText } from 'ai';
import { cookies } from 'next/headers';

const arcade = createOpenAI({
  apiKey: process.env.ARCADE_API_KEY,
  baseURL: process.env.ARCADE_ENGINE_URL ?? 'https://api.arcade-ai.com/v1',
});

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  const { text: title } = await generateText({
    model: arcade('gpt-4o-mini'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}
