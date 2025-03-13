import { Action } from 'solana-agent-kit';
import { z } from 'zod';
import { withStagehand } from '../utils';

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
          'Fetches the latest posts from the Solana forum with detailed information',
      },
    ],
  ],
  schema: z.object({}),
  handler: async () =>
    await withStagehand(async (page) => {
      await page.goto('https://forum.solana.com/latest');
      const { latestPosts } = await page.extract({
        instruction: 'Get the top 10 latest posts',
        schema: z.object({
          latestPosts: z.array(
            z.object({
              title: z.string().describe('The title of the post'),
              category: z.string().describe('The category of the post'),
              age: z.string().describe('The age of the post'),
              replies: z.number().describe('The number of replies on the post'),
              views: z
                .number()
                .describe('The number of views the post has received'),
              activity: z
                .string()
                .describe('The last activity time of the post'),
              author: z.string().describe('The author username of the post'),
              postUrl: z.string().describe('The URL of the post'),
            }),
          ),
        }),
      });
      latestPosts.forEach((post) => {
        if (post.postUrl.startsWith('/')) {
          post.postUrl = `https://forum.solana.com${post.postUrl}`;
        }
      });
      return {
        status: 'success',
        posts: latestPosts,
      };
    }),
};
