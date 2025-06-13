import topicService from "@repo/backend/posts/topicService";

import { createServerFn } from "@tanstack/react-start";

export const getAllTopics = createServerFn().handler(async () => {
  return topicService.getTopics();
});
