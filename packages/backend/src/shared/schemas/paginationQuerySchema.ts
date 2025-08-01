import z from "zod";

export const createPaginationQuerySchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) => {
  return schema.extend({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(20),
    order: z.enum(["asc", "desc"]).nullish(),
  });
};
