import { Action } from 'solana-agent-kit';
import { z } from 'zod';
import { postsSchema } from '../types/types';
import { formatPostsUrl, withStagehand } from '../utils';
import { exampleOutput } from '../types/examplesOutput';

export const getTopPosts: Action = {
  name: 'GET_TOP_POSTS',
  similes: [
    'get top posts',
    'get top posts by views',
    'get top posts by replies',
    'fetch popular posts',
    'retrieve top posts',
    'top forum posts',
  ],
  description:
    'Get the top posts from the Solana forum by activity (views and replies)',
  examples: [
    [
      {
        input: {},
        output: exampleOutput,
        explanation:
          'Fetches the top posts from the Solana forum by activity (views and replies) with detailed information',
      },
    ],
  ],
  schema: z.object({}),
  handler: async () =>
    await withStagehand(async (page) => {
      await page.goto('https://forum.solana.com/top?ascending=false&order=activity');

      const { posts } = await page.extract({
        instruction:
          'Get the top 10 posts by activity (views and replies), order by activity descending',
        schema: postsSchema,
      });
      formatPostsUrl(posts);

      return {
        status: 'success',
        posts,
      };
    }),
};
