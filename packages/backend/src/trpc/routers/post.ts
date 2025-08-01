
import { createTRPCRouter, publicProcedure } from "../trpc";
import postService from "#/posts/postService";
import { getPostQuerySchema } from "#/posts/validations";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure.input(getPostQuerySchema).query(async ({ input }) => {
    return await postService.getPosts(input);
  }),
  getPostBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return await postService.getPostBySlug(input.slug);
  }),
  getTopTags: publicProcedure.query(async () => {
    return await postService.getTopTags();
  }),
});