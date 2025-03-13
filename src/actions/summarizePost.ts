import { Action, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { withStagehand } from '../utils';

export const summarizePost: Action = {
  name: 'SUMMARIZE_POST',
  similes: [
    'summarize post',
    'get post summary',
    'fetch post summary',
    'retrieve post summary',
  ],
  description: 'Summarize the content of a specified post from the Solana forum',
  examples: [
    [
      {
        input: { postUrl: 'https://forum.solana.com/t/srfc-31-compatibility-of-blinks-and-actions/1892' },
        output: {
          status: 'success',
          summary: 'This post discusses the compatibility of blinks and actions in the Solana forum. It highlights key points and provides a concise summary of the content.',
        },
        explanation:
          'Fetches the content of the specified post from the Solana forum and provides a summary with key points',
      },
    ],
  ],
  schema: z.object({
    postUrl: z.string().url().describe('The URL of the post to summarize'),
  }),
  handler: async (_agent: SolanaAgentKit, input: Record<string, any>) =>
    await withStagehand(async (page) => {
      const { postUrl } = summarizePost.schema.parse(input) as {
        postUrl: string;
      };

      await page.goto(postUrl);
      const { summary } = await page.extract({
        instruction: 'Summarize the post content and return it, make it easily understandable, concise and capture the key points',
        schema: z.object({
          summary: z.string().describe('The summary of the post'),
        }),
      });
      return {
        status: 'success',
        summary,
      };
    }),
};
