import { Action } from 'solana-agent-kit';
import { z } from 'zod';
import { postsSchema } from '../types/types';
import { formatPostsUrl, withStagehand } from '../utils';

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
        output: {
          status: 'success',
          posts: [
            {
              title: 'Post Title 1',
              category: 'Governance',
              age: '2h',
              replies: 10,
              views: 100,
              activity: '1',
              author: 'user1',
              postUrl: 'https://forum.solana.com/post1',
            },
            {
              title: 'Post Title 2',
              category: 'sRFC',
              age: '2d',
              replies: 5,
              views: 50,
              activity: '3h',
              author: 'user2',
              postUrl: 'https://forum.solana.com/post2',
            },
          ],
        },
        explanation:
          'Fetches the top posts from the Solana forum by activity (views and replies) with detailed information',
      },
    ],
  ],
  schema: z.object({}),
  handler: async () =>
    await withStagehand(async (page) => {
      await page.goto('https://forum.solana.com/top');

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
