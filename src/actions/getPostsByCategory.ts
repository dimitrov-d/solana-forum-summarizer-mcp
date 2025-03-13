import { Action, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { withStagehand } from '../utils';

const getPostsByCategorySchema = z.object({
  category: z.enum([
    'sRFC',
    'Research',
    'Governance',
    'RFP',
    'SIMD',
    'Releases',
    'Announcements',
  ]),
});

export const getPostsByCategory: Action = {
  name: 'GET_POSTS_BY_CATEGORY',
  similes: [
    'get posts by category',
    'fetch posts by category',
    'retrieve posts by category',
    'category forum posts',
  ],
  description: 'Get the posts from the Solana forum by specified category',
  examples: [
    [
      {
        input: { category: 'Governance' },
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
              category: 'Governance',
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
          'Fetches the posts from the Solana forum by specified category with detailed information',
      },
    ],
  ],
  schema: getPostsByCategorySchema,
  handler: async (_agent: SolanaAgentKit, input: Record<string, any>) =>
    await withStagehand(async (page) => {
      let { category } = getPostsByCategorySchema.parse(input) as {
        category: string;
      };
      if (category === 'Governance') category = 'gov';

      const categoryUrl = `https://forum.solana.com/c/${category.toLowerCase()}`;
      await page.goto(categoryUrl);
      const { categoryPosts } = await page.extract({
        instruction: `Get the top 10 posts from this page with ${category} category posts, order by age descending`,
        schema: z.object({
          categoryPosts: z.array(
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
      categoryPosts.forEach((post) => {
        if (post.postUrl.startsWith('/')) {
          post.postUrl = `https://forum.solana.com${post.postUrl}`;
        }
      });
      return {
        status: 'success',
        posts: categoryPosts,
      };
    }),
};
