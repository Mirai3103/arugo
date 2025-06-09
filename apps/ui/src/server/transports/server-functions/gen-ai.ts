import { createServerFn } from "@tanstack/react-start";
import { requireAuthMiddleware } from "../middleware/authMiddleware";

import { getSubmissionReview } from "@repo/backend/gen_ai/gen-ai.service";
import { z } from "zod";
export const getAiReview = createServerFn({
  method: "GET",
})
  .middleware([requireAuthMiddleware])
  .validator(z.object({ submissionId: z.string() }))
  .handler(async ({ data }) => {
    const review = await getSubmissionReview(data.submissionId);
    return review;
  });
