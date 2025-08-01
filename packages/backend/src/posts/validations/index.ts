import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.any(), 
  tags: z.array(z.string()).nullish(),
  topicId: z.coerce.number().min(1),
  shortDescription: z.string().nullish(),
});
export const getPostQuerySchema = z.object({
  topicId: z.coerce.number().min(1).nullish(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(20),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().nullish(),
  orderBy: z.enum(["createdAt", "title", "totalLikes"]).default("createdAt"),
  tag: z.string().nullish(),
  authorId: z.string().nullish(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type GetPostQuerySchema = z.infer<typeof getPostQuerySchema>;
