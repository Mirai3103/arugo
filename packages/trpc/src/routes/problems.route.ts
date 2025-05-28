import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const problemsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    })
});