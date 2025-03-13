import { z } from 'zod';

export interface ForumPost {
  title: string;
  category: string;
  age: string;
  replies: number;
  views: number;
  activity: string;
  author: string;
  postUrl: string;
}

export const postsSchema = z.object({
  posts: z.array(
    z.object({
      title: z.string().describe('The title of the post'),
      category: z.string().describe('The category of the post'),
      author: z.string().describe('The author username of the post'),
      age: z.string().describe('The age of the post'),
      postUrl: z.string().describe('The URL of the post'),
      replies: z.number().describe('The number of replies on the post'),
      views: z.number().describe('The number of views the post has received'),
      activity: z.string().describe('The last activity time of the post'),
      tags: z.array(z.string()).describe('The tags associated with the post'),
    }),
  ),
});
