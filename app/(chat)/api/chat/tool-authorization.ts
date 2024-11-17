import { createCompletion } from '@/ai/client';

import type { StreamContext, ToolAuthorization } from './types';

const CHECK_AUTHORIZATION_PATH = '/auth/status';
const CHECK_AUTHORIZATION_WAIT_TIME = 20;

/**
 * Function to check the status of a tool
 *
 * @param toolAuthorization - The tool authorization object
 * @returns The status of the tool authorization
 */
export const checkToolAuthorization = async (
  toolAuthorization: ToolAuthorization,
): Promise<ToolAuthorization['status']> => {
  let status: ToolAuthorization['status'] = 'pending';
  while (status === 'pending') {
    const searchParams = new URLSearchParams({
      authorizationId: toolAuthorization.authorization_id,
      scopes: toolAuthorization.scopes.join(','),
      wait: `${CHECK_AUTHORIZATION_WAIT_TIME}`, // Wait for auth completion or timeout is reached
    });

    const url = `${process.env.ARCADE_ENGINE_URL ?? 'https://api.arcade-ai.com/v1'}${CHECK_AUTHORIZATION_PATH}?${searchParams}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ARCADE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check authorization status');
    }

    const data = await response.json();
    status = data.status;
  }
  return status;
};

/**
 * Handles the tool authorizations, checking their status and streaming the response
 *
 * @param streamContext
 * @returns
 */
export async function handleToolAuthorizations(
  userId: string,
  streamContext: StreamContext,
) {
  const { model, messages, encoder, controller, toolAuthorizations } =
    streamContext;

  // Inform the user that the tool authorizations are being checked
  controller.enqueue(
    encoder.encode('\n\n⏳ Waiting for tool authorization to complete...\n'),
  );

  for (const auth of toolAuthorizations) {
    try {
      const status = await checkToolAuthorization(auth);

      if (status === 'completed') {
        controller.enqueue(
          encoder.encode(
            '\n\n✅ Authorization completed! Waiting for the response...\n\n\n',
          ),
        );

        const response = await createCompletion({ userId, model, messages });
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
      }
    } catch (error) {
      console.error('Error checking authorization status:', error);
      controller.enqueue(
        encoder.encode(
          '\n\n❌ Error processing authorization. Please try again.\n',
        ),
      );
    }
  }
}
