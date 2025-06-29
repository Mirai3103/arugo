

import { createTRPCRouter, publicProcedure } from "../trpc";
import topicService from "#/posts/topicService";

export const topicRouter = createTRPCRouter({
  getAllTopics: publicProcedure.query(async () => {
    return topicService.getTopics();
  }),
});