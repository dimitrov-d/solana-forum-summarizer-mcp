import { Action, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { exampleOutput } from '../types/examplesOutput';
import { postsSchema } from '../types/types';
import { formatPostsUrl, withStagehand } from '../utils';

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
        output: exampleOutput,
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

      const { posts } = await page.extract({
        instruction: `Get the top 10 posts from this page with ${category} category posts, order by age descending`,
        schema: postsSchema,
      });
      formatPostsUrl(posts);

      return {
        status: 'success',
        posts,
      };
    }),
};
