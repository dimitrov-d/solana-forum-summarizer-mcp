import { BrowserContext, Page, Stagehand } from '@browserbasehq/stagehand';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export async function main({
  page,
  context,
  stagehand,
}: {
  page: Page;
  context: BrowserContext;
  stagehand: Stagehand;
}) {
  await page.goto('https://forum.solana.com/');

  const { latestPosts } = await page.extract({
    instruction: 'Get the top 10 latest posts',
    schema: z.object({
      latestPosts: z.array(
        z.object({
          title: z.string(),
          category: z.string(),
          age: z.string(),
          comments: z.number(),
        }),
      ),
    }),
  });
  console.log(JSON.stringify(latestPosts, null, 2));
}
