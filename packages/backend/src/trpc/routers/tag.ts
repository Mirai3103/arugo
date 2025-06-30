
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import tagService from "#/problems/tagService";
import {
    createTagSchema,
    updateTagSchema,
} from "#/problems/validations/tag";
import { z } from "zod";

export const tagRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(async () => {
    return tagService.getAllTags();
  }),
  createTag: protectedProcedure
    .input(createTagSchema)
    .mutation(async ({ input }) => {
      return tagService.createTag(input);
    }),
  updateTag: protectedProcedure
    .input(updateTagSchema)
    .mutation(async ({ input }) => {
      return tagService.updateTag(input);
    }),
  deleteTag: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ input }) => {
      await tagService.deleteTag(input);
      return { success: true };
    }),
  getTagById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return tagService.getTagById(input.id);
    }
    ),
});