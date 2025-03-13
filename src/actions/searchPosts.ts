import { Action, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { postsSchema } from '../types/types';
import { formatPostsUrl, withStagehand } from '../utils';
import { exampleOutput } from '../types/examplesOutput';

export const searchPosts: Action = {
  name: 'SEARCH_POSTS',
  similes: [
    'search posts',
    'find posts',
    'look up posts',
    'search forum posts',
  ],
  description: 'Search posts on the Solana forum by keyword',
  examples: [
    [
      {
        input: { keyword: 'blinks' },
        output: exampleOutput,
        explanation:
          'Searches the posts on the Solana forum by the specified keyword with detailed information',
      },
    ],
  ],
  schema: z.object({
    keyword: z.string().describe('The keyword to search for'),
  }),
  handler: async (_agent: SolanaAgentKit, input: Record<string, any>) =>
    await withStagehand(async (page) => {
      const { keyword } = searchPosts.schema.parse(input) as {
        keyword: string;
      };

      await page.goto(
        `https://forum.solana.com/search?q=${encodeURIComponent(keyword)}`,
      );
      const { posts } = await page.extract({
        instruction: 'Get the top 5 search results, sorted by age descending',
        schema: postsSchema,
      });
      formatPostsUrl(posts);

      return {
        status: 'success',
        posts,
      };
    }),
};
