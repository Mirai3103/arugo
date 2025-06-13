import postService from "@repo/backend/posts/postService";
import {
  GetPostQuerySchema,
  CreatePostSchema,
  getPostQuerySchema,
} from "@repo/backend/posts/validations/index";

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPosts = createServerFn({
  method: "GET",
})
  .validator(getPostQuerySchema)
  .handler(async ({ data }) => {
    return await postService.getPosts(data);
  });

export const getPostBySlug = createServerFn({
  method: "GET",
})
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    return await postService.getPostBySlug(data.slug);
  });

export const getTopTags = createServerFn({
  method: "GET",
}).handler(async () => {
  return await postService.getTopTags();
});
