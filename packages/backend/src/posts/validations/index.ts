import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.any(), // tiptap json
  tags: z.array(z.string()).optional(),
  topicId: z.coerce.number().min(1),
});
export const getPostQuerySchema = z.object({
  topicId: z.coerce.number().min(1),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(20),
  order: z.enum(["asc", "desc"]).nullish(),
  search: z.string().nullish(),
  orderBy: z.enum(["createdAt", "title","totalLikes"]).default("createdAt"),
  tag: z.string().nullish(),
  authorId: z.string().nullish(),
  
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type GetPostQuerySchema = z.infer<typeof getPostQuerySchema>;