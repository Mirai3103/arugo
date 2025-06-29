
import problemService from "#/problems/problemService";
import { problemQuerySchema } from "#/problems/validations/problem";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const problemRouter = createTRPCRouter({
  getAllProblems: publicProcedure
    .input(problemQuerySchema)
    .query(async ({ ctx, input }) => {
        return await problemService.getAllProblems(input);
        }
    ),
  getProblemBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
        const res = await problemService.getProblemBySlug(input.slug);
        return {
          ...res,
        };
      }
    ),
});