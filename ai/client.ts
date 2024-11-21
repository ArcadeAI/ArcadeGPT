import { OpenAI } from 'openai';
import type { CreateCompletionProps } from './types';
import { systemPrompt } from './prompts';

const BASE_URL =
  process.env.ARCADE_ENGINE_URL ?? 'https://api.arcade-ai.com/v1'; // Default to the cloud engine

// Initialize the OpenAI client
export const client = new OpenAI({
  baseURL: BASE_URL,
  apiKey: process.env.ARCADE_API_KEY,
});

// Function to create chat completions
export const createCompletion = (props: CreateCompletionProps) => {
  const { model, messages, userId } = props;
  return client.chat.completions.create({
    model: model.apiIdentifier,
    user: userId,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ],
    tool_choice: 'auto',
    stream: true,
  });
};
