import contestService, {
  contestQuerySchema,
} from "@repo/backend/contests/contests.service";
import { createServerFn } from "@tanstack/react-start";

export const getAllPublishContests = createServerFn({
  method: "GET",
})
  .validator(contestQuerySchema)
  .handler(async ({ data }) => {
    return await contestService.getPublishContests(data);
  });
