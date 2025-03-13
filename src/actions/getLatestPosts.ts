import { Action } from 'solana-agent-kit';
import { z } from 'zod';
import { postsSchema } from '../types/types';
import { formatPostsUrl, withStagehand } from '../utils';
import { exampleOutput } from '../types/examplesOutput';

export const getLatestPosts: Action = {
  name: 'GET_LATEST_POSTS',
  similes: [
    'get latest posts',
    'fetch recent posts',
    'retrieve new posts',
    'latest forum posts',
  ],
  description: 'Get the latest posts from the Solana forum',
  examples: [
    [
      {
        input: {},
        output: exampleOutput,
        explanation:
          'Fetches the latest posts from the Solana forum with detailed information',
      },
    ],
  ],
  schema: z.object({}),
  handler: async () =>
    await withStagehand(async (page) => {
      await page.goto('https://forum.solana.com/latest');

      const { posts } = await page.extract({
        instruction: 'Get the top 10 latest posts, order by age descending',
        schema: postsSchema,
      });
      formatPostsUrl(posts);

      return {
        status: 'success',
        posts,
      };
    }),
};
