

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { getSubmissionReview } from "#/gen_ai/gen-ai.service";
import { z } from "zod";

export const genAiRouter = createTRPCRouter({
  getAiReview: protectedProcedure.input(z.object({ submissionId: z.string() })).query(async ({ input }) => {
    return await getSubmissionReview(input.submissionId,'block');
  }),
});