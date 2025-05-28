import { QUERY_CONSTANTS } from "@/utils/constants/query";
import z from "zod";

export const createPaginationQuerySchema = <T extends z.ZodRawShape>(
	schema: z.ZodObject<T>,
) => {
	return schema.extend({
		page: z.coerce.number().int().positive().default(1),
		pageSize: z.coerce
			.number()
			.int()
			.positive()
			.default(QUERY_CONSTANTS.DEFAULT_PAGE_SIZE),
		order: z.enum(["asc", "desc"]).nullish(),
	});
};
