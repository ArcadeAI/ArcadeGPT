import { OpenAI } from 'openai';
import { Model } from '@/ai/models';

export type CreateCompletionProps = {
  userId: string;
  model: Model;
  messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>;
};