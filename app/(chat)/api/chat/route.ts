import { NextResponse } from 'next/server';

import { createCompletion } from '@/ai/client';
import { models } from '@/ai/models';
import { auth } from '@/app/(auth)/auth';

import { handleToolAuthorizations } from './tool-authorization';
import type { ChatRequestBody, ToolAuthorization } from './types';

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { messages, modelId }: ChatRequestBody = await request.json();

    const model = models.find((model) => model.id === modelId);
    if (!model) {
      return new Response('Model not found', { status: 404 });
    }

    // Create a new ReadableStream to handle the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();
          const response = await createCompletion({
            userId: userEmail,
            model,
            messages,
          });

          let toolAuthorizations: Array<ToolAuthorization> = [];
          for await (const chunk of response) {
            // Check for tool authorizations
            // @ts-ignore - Arcade AI injects this property into the response
            const authorizations = chunk?.choices?.[0]?.tool_authorizations;
            if (authorizations) {
              toolAuthorizations = authorizations;
            }

            // Stream the response
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }

          // If there are tool authorizations, handle them
          if (toolAuthorizations.length > 0) {
            await handleToolAuthorizations(userEmail, {
              model,
              messages,
              encoder,
              controller,
              toolAuthorizations,
            });
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          controller.enqueue(
            new TextEncoder().encode(
              '\n\n❌ An error occurred while processing your request.\n',
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Request processing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
