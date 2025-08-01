
  
import { createTRPCRouter, publicProcedure } from "../trpc";
import contestService from "#/contests/contests.service";
import { contestQuerySchema } from "#/contests/contests.service";

export const contestRouter = createTRPCRouter({
  getAllPublishContests: publicProcedure.input(contestQuerySchema).query(async ({ input }) => {
    return await contestService.getPublishContests(input);
  }),
});