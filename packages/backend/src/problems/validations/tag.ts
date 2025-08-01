import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required" }),
  description: z.string().optional(),
});
export type CreateTagSchema = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.extend({
  id: z.coerce.number(),
});
export type UpdateTagSchema = z.infer<typeof updateTagSchema>;
