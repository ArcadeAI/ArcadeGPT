import type { OpenAI } from 'openai';

import type { Model } from '@/ai/models';

export interface ChatRequestBody {
  messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>;
  modelId: string;
}

export interface StreamContext {
  model: Model;
  messages: ChatRequestBody['messages'];
  encoder: TextEncoder;
  controller: ReadableStreamDefaultController;
  toolAuthorizations: Array<ToolAuthorization>;
}

export interface ToolAuthorization {
  url: string;
  id: string;
  provider_id: string;
  user_id: string;
  status: 'pending' | 'completed' | 'failed';
  context: Record<string, any>;
  scopes: Array<string>;
}
